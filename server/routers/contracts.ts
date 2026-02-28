import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import {
  getUserContracts,
  getContract,
  createContract,
  updateContract,
} from '../db';
import { createNotification } from '../db';

export const contractsRouter = router({
  // List user's contracts
  list: protectedProcedure
    .input(
      z
        .object({
          status: z
            .enum(['draft', 'pending_signature', 'active', 'completed', 'cancelled', 'disputed'])
            .optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const { status, page = 1, limit = 20 } = input || {};
      
      let contracts = await getUserContracts(ctx.user.id);
      
      // Filter by status if provided
      if (status) {
        contracts = contracts.filter((c) => c.status === status);
      }
      
      // Sort by most recent first
      contracts.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      // Pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = contracts.slice(start, end);
      
      return {
        contracts: paginated,
        total: contracts.length,
        page,
        totalPages: Math.ceil(contracts.length / limit),
      };
    }),

  // Get single contract
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Verify user has access
      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      return contract;
    }),

  // Create new contract
  create: protectedProcedure
    .input(
      z.object({
        templateId: z.string().optional(),
        title: z.string().min(1),
        description: z.string(),
        category: z.string(),
        providerId: z.string().optional(),
        providerEmail: z.string().email().optional(),
        totalAmount: z.number().positive(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        content: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const contract = await createContract({
        id: contractId,
        clientId: ctx.user.id,
        providerId: input.providerId || '',
        templateId: input.templateId,
        title: input.title,
        description: input.description,
        category: input.category as any,
        totalAmount: String(Math.round(input.totalAmount * 100)), // Convert to pence as string
        currency: 'GBP',
        status: 'draft',
        contractContent: JSON.stringify(input.content),
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return { contractId, contract };
    }),

  // Update contract
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        totalAmount: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        content: z.any().optional(),
        status: z
          .enum(['draft', 'pending_signature', 'active', 'completed', 'cancelled', 'disputed'])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Only creator can update draft contracts
      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      const updates: any = { updatedAt: new Date() };
      if (input.title) updates.title = input.title;
      if (input.description) updates.description = input.description;
      if (input.totalAmount) updates.totalAmount = String(Math.round(input.totalAmount * 100));
      if (input.startDate) updates.startDate = new Date(input.startDate);
      if (input.endDate) updates.endDate = new Date(input.endDate);
      if (input.content) updates.contractContent = JSON.stringify(input.content);
      if (input.status) updates.status = input.status;
      
      await updateContract(input.id, updates);
      
      return { success: true };
    }),

  // Delete contract (soft delete by setting status to cancelled)
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Only creator can delete draft contracts
      if (contract.status !== 'draft' || contract.clientId !== ctx.user.id) {
        throw new Error('Cannot delete this contract');
      }
      
      await updateContract(input.id, { status: 'cancelled', updatedAt: new Date() });
      
      return { success: true };
    }),

  // Send contract for signature
  sendForSignature: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      if (contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      if (contract.status !== 'draft') {
        throw new Error('Contract already sent');
      }
      
      await updateContract(input.id, {
        status: 'pending_signature',
        updatedAt: new Date(),
      });
      
      // Send notification to provider
      if (contract.providerId) {
        await createNotification({
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: contract.providerId,
          type: 'contract',
          title: 'New Contract Awaiting Signature',
          message: `${ctx.user.name} has sent you a contract to review and sign: "${contract.title}"`,
          relatedId: input.id,
          isRead: 'no',
          createdAt: new Date(),
        });
      }
      
      return { success: true };
    }),

  // Sign contract
  sign: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        signatureName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Verify user is party to contract
      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      // For MVP, we'll track signatures in contract content
      const content = contract.contractContent ? JSON.parse(contract.contractContent as string) : {};
      if (!content.signatures) {
        content.signatures = [];
      }
      
      // Check if user already signed
      const alreadySigned = content.signatures.some(
        (sig: any) => sig.userId === ctx.user.id
      );
      
      if (!alreadySigned) {
        content.signatures.push({
          userId: ctx.user.id,
          name: input.signatureName,
          signedAt: new Date().toISOString(),
        });
      }
      
      // Check if both parties have signed
      const allSigned =
        content.signatures.length >= 2 ||
        (contract.clientId === contract.providerId && content.signatures.length >= 1);
      
      await updateContract(input.id, {
        contractContent: JSON.stringify(content),
        status: allSigned ? 'active' : 'pending_signature',

        updatedAt: new Date(),
      });
      
      if (allSigned) {
        // Notify both parties
        await createNotification({
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: contract.clientId,
          type: 'contract',
          title: 'Contract Fully Executed',
          message: `The contract "${contract.title}" has been signed by all parties and is now active.`,
          relatedId: input.id,
          isRead: 'no',
          createdAt: new Date(),
        });
        
        if (contract.providerId && contract.providerId !== contract.clientId) {
          await createNotification({
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: contract.providerId,
            type: 'contract',
            title: 'Contract Fully Executed',
            message: `The contract "${contract.title}" has been signed by all parties and is now active.`,
            relatedId: input.id,
            isRead: 'no',
            createdAt: new Date(),
          });
        }
      }
      
      return { success: true, allSigned };
    }),

  // Get dashboard stats
  stats: protectedProcedure.query(async ({ ctx }) => {
    const contracts = await getUserContracts(ctx.user.id);
    
    const activeContracts = contracts.filter((c) => c.status === 'active').length;
    const completedContracts = contracts.filter((c) => c.status === 'completed').length;
    const draftContracts = contracts.filter((c) => c.status === 'draft').length;
    
    const totalValue = contracts
      .filter((c) => c.status === 'active' || c.status === 'completed')
      .reduce((sum, c) => sum + (parseInt(c.totalAmount || '0', 10)), 0);
    
    return {
      activeContracts,
      completedContracts,
      draftContracts,
      totalContracts: contracts.length,
      totalValue,
    };
  }),
});

