import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import {
  getContractMilestones,
  getMilestone,
  createMilestone,
  updateMilestone,
  getContract,
  createNotification,
} from '../db';

export const milestonesRouter = router({
  // List milestones for a contract
  list: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify user has access to contract
      const contract = await getContract(input.contractId);
      if (!contract || (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)) {
        throw new Error('Unauthorized');
      }
      
      const milestones = await getContractMilestones(input.contractId);
      
      // Sort by order
      return milestones.sort((a, b) => parseInt(a.order || '0') - parseInt(b.order || '0'));
    }),

  // Get single milestone
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      // Verify access
      const contract = await getContract(milestone.contractId);
      if (!contract || (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)) {
        throw new Error('Unauthorized');
      }
      
      return milestone;
    }),

  // Create milestone
  create: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        title: z.string(),
        description: z.string(),
        amount: z.number().positive(),
        dueDate: z.string().optional(),
        order: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.contractId);
      
      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      const milestoneId = `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await createMilestone({
        id: milestoneId,
        contractId: input.contractId,
        title: input.title,
        description: input.description,
        amount: String(Math.round(input.amount * 100)), // Convert to pence as string
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        status: 'pending',
        order: String(input.order),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return { milestoneId };
    }),

  // Update milestone
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        amount: z.number().optional(),
        dueDate: z.string().optional(),
        status: z
          .enum(['pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid'])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)) {
        throw new Error('Unauthorized');
      }
      
      const updates: any = { updatedAt: new Date() };
      if (input.title) updates.title = input.title;
      if (input.description) updates.description = input.description;
      if (input.amount) updates.amount = String(Math.round(input.amount * 100));
      if (input.dueDate) updates.dueDate = new Date(input.dueDate);
      if (input.status) updates.status = input.status;
      
      await updateMilestone(input.id, updates);
      
      return { success: true };
    }),

  // Submit milestone for approval
  submit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      await updateMilestone(input.id, {
        status: 'submitted',
        updatedAt: new Date(),
      });
      
      // Notify client
      await createNotification({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: contract.clientId,
        type: 'milestone',
        title: 'Milestone Submitted for Approval',
        message: `${ctx.user.name} has submitted "${milestone.title}" for your review.`,
        relatedId: milestone.contractId,
        isRead: 'no',
        createdAt: new Date(),
      });
      
      return { success: true };
    }),

  // Approve milestone
  approve: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      await updateMilestone(input.id, {
        status: 'approved',
        approvedAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Notify provider
      await createNotification({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: contract.providerId,
        type: 'milestone',
        title: 'Milestone Approved',
        message: `"${milestone.title}" has been approved by ${ctx.user.name}.`,
        relatedId: milestone.contractId,
        isRead: 'no',
        createdAt: new Date(),
      });
      
      return { success: true };
    }),

  // Reject milestone
  reject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      await updateMilestone(input.id, {
        status: 'rejected',
        updatedAt: new Date(),
      });
      
      // Notify provider
      await createNotification({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: contract.providerId,
        type: 'milestone',
        title: 'Milestone Requires Revision',
        message: `"${milestone.title}" needs revision. Reason: ${input.reason}`,
        relatedId: milestone.contractId,
        isRead: 'no',
        createdAt: new Date(),
      });
      
      return { success: true };
    }),
});

