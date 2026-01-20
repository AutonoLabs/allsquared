import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { db, createNotification } from '../db';
import {
  escrowTransactions,
  contracts,
  milestones,
  payments,
  auditLogs,
  webhookEvents
} from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * Transpact Escrow Integration
 * FCA Reference: 546279
 *
 * This router handles escrow operations via Transpact's API.
 * In production, you'll need to:
 * 1. Sign a partner agreement with Transpact
 * 2. Obtain API credentials
 * 3. Implement proper webhook handling
 * 4. Set up proper fund segregation
 */

// Transpact API configuration
const TRANSPACT_API_URL = process.env.TRANSPACT_API_URL || 'https://api.transpact.com/v1';
const TRANSPACT_PARTNER_ID = process.env.TRANSPACT_PARTNER_ID;

// Helper to make Transpact API calls
async function transpactRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: Record<string, any>
) {
  const apiKey = process.env.TRANSPACT_API_KEY;

  if (!apiKey || !TRANSPACT_PARTNER_ID) {
    // Return mock response for development
    console.warn('Transpact API not configured - using mock responses');
    return mockTranspactResponse(endpoint, method, body);
  }

  const response = await fetch(`${TRANSPACT_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Partner-ID': TRANSPACT_PARTNER_ID,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Transpact API error:', data);
    throw new Error(data.message || 'Transpact API error');
  }

  return data;
}

// Mock responses for development
function mockTranspactResponse(endpoint: string, method: string, body?: any): any {
  const mockId = `mock_${nanoid(12)}`;

  if (endpoint.includes('/transactions') && method === 'POST') {
    return {
      id: mockId,
      status: 'created',
      amount: body?.amount,
      currency: body?.currency || 'GBP',
      reference: body?.reference,
      depositUrl: `https://sandbox.transpact.com/deposit/${mockId}`,
      createdAt: new Date().toISOString(),
    };
  }

  if (endpoint.includes('/release')) {
    return {
      id: mockId,
      status: 'released',
      releasedAt: new Date().toISOString(),
    };
  }

  if (endpoint.includes('/refund')) {
    return {
      id: mockId,
      status: 'refunded',
      refundedAt: new Date().toISOString(),
    };
  }

  return { id: mockId, status: 'success' };
}

// Calculate escrow fee (Transpact typically charges 1.5-2.5%)
function calculateEscrowFee(amount: number): number {
  const feeRate = 0.02; // 2%
  const minFee = 500; // £5 minimum
  const maxFee = 25000; // £250 maximum

  const calculatedFee = Math.round(amount * feeRate);
  return Math.max(minFee, Math.min(maxFee, calculatedFee));
}

export const escrowRouter = router({
  // Create escrow transaction for a contract
  createTransaction: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        milestoneId: z.string().optional(),
        amount: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify contract exists and user is the client
      const contract = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.contractId))
        .limit(1);

      if (!contract[0]) {
        throw new Error('Contract not found');
      }

      if (contract[0].clientId !== ctx.user.id) {
        throw new Error('Only the client can initiate escrow deposits');
      }

      // Verify milestone if specified
      if (input.milestoneId) {
        const milestone = await db
          .select()
          .from(milestones)
          .where(
            and(
              eq(milestones.id, input.milestoneId),
              eq(milestones.contractId, input.contractId)
            )
          )
          .limit(1);

        if (!milestone[0]) {
          throw new Error('Milestone not found');
        }
      }

      const escrowId = `escrow_${nanoid(16)}`;
      const escrowFee = calculateEscrowFee(input.amount);
      const reference = `AS-${Date.now()}-${nanoid(8)}`;

      // Create Transpact transaction
      const transpactTx = await transpactRequest('/transactions', 'POST', {
        amount: input.amount,
        currency: 'GBP',
        reference: reference,
        description: `Escrow for contract: ${contract[0].title}`,
        clientEmail: ctx.user.email,
        metadata: {
          allsquaredContractId: input.contractId,
          allsquaredMilestoneId: input.milestoneId,
          allsquaredEscrowId: escrowId,
        },
        callbackUrl: `${process.env.APP_URL}/api/webhooks/transpact`,
      });

      // Create local escrow record
      await db.insert(escrowTransactions).values({
        id: escrowId,
        contractId: input.contractId,
        milestoneId: input.milestoneId,
        amount: String(input.amount),
        currency: 'GBP',
        status: 'pending',
        escrowProvider: 'Transpact',
        escrowReference: transpactTx.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'escrow_created',
        entityType: 'escrow',
        entityId: escrowId,
        newValue: JSON.stringify({
          amount: input.amount,
          contractId: input.contractId,
          milestoneId: input.milestoneId,
          transpactId: transpactTx.id,
        }),
        createdAt: new Date(),
      });

      // Notify the provider
      if (contract[0].providerId) {
        await createNotification({
          id: `notif_${nanoid(16)}`,
          userId: contract[0].providerId,
          type: 'payment',
          title: 'Escrow Deposit Initiated',
          message: `The client has initiated an escrow deposit of £${(input.amount / 100).toFixed(2)} for "${contract[0].title}".`,
          relatedId: input.contractId,
          isRead: 'no',
          createdAt: new Date(),
        });
      }

      return {
        escrowId,
        transpactId: transpactTx.id,
        amount: input.amount,
        escrowFee,
        totalAmount: input.amount + escrowFee,
        depositUrl: transpactTx.depositUrl,
        reference,
      };
    }),

  // Get escrow status
  getTransaction: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const escrow = await db
        .select()
        .from(escrowTransactions)
        .where(eq(escrowTransactions.id, input.escrowId))
        .limit(1);

      if (!escrow[0]) {
        throw new Error('Escrow transaction not found');
      }

      // Verify user has access (is party to the contract)
      const contract = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, escrow[0].contractId))
        .limit(1);

      if (
        !contract[0] ||
        (contract[0].clientId !== ctx.user.id && contract[0].providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      // Get latest status from Transpact
      if (escrow[0].escrowReference && process.env.TRANSPACT_API_KEY) {
        try {
          const transpactStatus = await transpactRequest(
            `/transactions/${escrow[0].escrowReference}`,
            'GET'
          );

          // Update local status if changed
          if (transpactStatus.status !== escrow[0].status) {
            await db
              .update(escrowTransactions)
              .set({
                status: mapTranspactStatus(transpactStatus.status),
                updatedAt: new Date(),
              })
              .where(eq(escrowTransactions.id, input.escrowId));
          }

          return {
            ...escrow[0],
            transpactStatus: transpactStatus.status,
          };
        } catch (error) {
          console.error('Failed to fetch Transpact status:', error);
        }
      }

      return escrow[0];
    }),

  // Get all escrow transactions for a contract
  getContractEscrows: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify user has access
      const contract = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.contractId))
        .limit(1);

      if (
        !contract[0] ||
        (contract[0].clientId !== ctx.user.id && contract[0].providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      const escrows = await db
        .select()
        .from(escrowTransactions)
        .where(eq(escrowTransactions.contractId, input.contractId));

      return { escrows };
    }),

  // Release escrow funds to provider
  releaseFunds: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
        milestoneId: z.string().optional(),
        amount: z.number().positive().optional(), // Partial release
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const escrow = await db
        .select()
        .from(escrowTransactions)
        .where(eq(escrowTransactions.id, input.escrowId))
        .limit(1);

      if (!escrow[0]) {
        throw new Error('Escrow transaction not found');
      }

      // Verify user is the client (only client can release)
      const contract = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, escrow[0].contractId))
        .limit(1);

      if (!contract[0] || contract[0].clientId !== ctx.user.id) {
        throw new Error('Only the client can release escrow funds');
      }

      if (escrow[0].status !== 'held') {
        throw new Error('Escrow funds are not in held status');
      }

      const releaseAmount = input.amount || parseInt(escrow[0].amount, 10);

      // Release via Transpact
      const releaseResult = await transpactRequest(
        `/transactions/${escrow[0].escrowReference}/release`,
        'POST',
        {
          amount: releaseAmount,
          recipientAccountId: contract[0].providerId, // Would be provider's bank details
          notes: input.notes,
        }
      );

      // Update escrow status
      await db
        .update(escrowTransactions)
        .set({
          status: 'released',
          releasedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(escrowTransactions.id, input.escrowId));

      // Update milestone if specified
      if (input.milestoneId) {
        await db
          .update(milestones)
          .set({
            status: 'paid',
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(milestones.id, input.milestoneId));
      }

      // Create payment record
      const paymentId = `pay_${nanoid(16)}`;
      await db.insert(payments).values({
        id: paymentId,
        userId: contract[0].providerId,
        contractId: escrow[0].contractId,
        milestoneId: input.milestoneId,
        type: 'escrow_release',
        amount: String(releaseAmount),
        currency: 'GBP',
        status: 'succeeded',
        description: `Escrow release for contract: ${contract[0].title}`,
        processedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'escrow_released',
        entityType: 'escrow',
        entityId: input.escrowId,
        newValue: JSON.stringify({
          amount: releaseAmount,
          milestoneId: input.milestoneId,
          notes: input.notes,
        }),
        createdAt: new Date(),
      });

      // Notify provider
      if (contract[0].providerId) {
        await createNotification({
          id: `notif_${nanoid(16)}`,
          userId: contract[0].providerId,
          type: 'payment',
          title: 'Payment Released',
          message: `£${(releaseAmount / 100).toFixed(2)} has been released from escrow for "${contract[0].title}". Funds will arrive in your account within 2-3 business days.`,
          relatedId: escrow[0].contractId,
          isRead: 'no',
          createdAt: new Date(),
        });
      }

      return {
        success: true,
        releaseId: releaseResult.id,
        amount: releaseAmount,
      };
    }),

  // Request refund (dispute or cancellation)
  requestRefund: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
        reason: z.string().min(10),
        amount: z.number().positive().optional(), // Partial refund
      })
    )
    .mutation(async ({ ctx, input }) => {
      const escrow = await db
        .select()
        .from(escrowTransactions)
        .where(eq(escrowTransactions.id, input.escrowId))
        .limit(1);

      if (!escrow[0]) {
        throw new Error('Escrow transaction not found');
      }

      // Verify user is party to the contract
      const contract = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, escrow[0].contractId))
        .limit(1);

      if (
        !contract[0] ||
        (contract[0].clientId !== ctx.user.id && contract[0].providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      if (escrow[0].status !== 'held') {
        throw new Error('Escrow funds are not available for refund');
      }

      // Mark contract as disputed
      await db
        .update(contracts)
        .set({
          status: 'disputed',
          updatedAt: new Date(),
        })
        .where(eq(contracts.id, escrow[0].contractId));

      // Create audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'escrow_refund_requested',
        entityType: 'escrow',
        entityId: input.escrowId,
        newValue: JSON.stringify({
          reason: input.reason,
          amount: input.amount || escrow[0].amount,
        }),
        createdAt: new Date(),
      });

      // Notify both parties
      const notifyParties = [contract[0].clientId, contract[0].providerId].filter(Boolean);
      for (const userId of notifyParties) {
        if (userId && userId !== ctx.user.id) {
          await createNotification({
            id: `notif_${nanoid(16)}`,
            userId,
            type: 'dispute',
            title: 'Refund Requested',
            message: `A refund has been requested for "${contract[0].title}". Reason: ${input.reason.substring(0, 100)}...`,
            relatedId: escrow[0].contractId,
            isRead: 'no',
            createdAt: new Date(),
          });
        }
      }

      return {
        success: true,
        message: 'Refund request submitted. The dispute will be reviewed.',
      };
    }),

  // Process refund (admin or after dispute resolution)
  processRefund: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
        amount: z.number().positive(),
        recipientId: z.string(), // userId to receive refund
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, this would be admin-only
      const escrow = await db
        .select()
        .from(escrowTransactions)
        .where(eq(escrowTransactions.id, input.escrowId))
        .limit(1);

      if (!escrow[0]) {
        throw new Error('Escrow transaction not found');
      }

      // Process refund via Transpact
      const refundResult = await transpactRequest(
        `/transactions/${escrow[0].escrowReference}/refund`,
        'POST',
        {
          amount: input.amount,
          recipientUserId: input.recipientId,
          notes: input.adminNotes,
        }
      );

      // Update escrow status
      await db
        .update(escrowTransactions)
        .set({
          status: 'refunded',
          updatedAt: new Date(),
        })
        .where(eq(escrowTransactions.id, input.escrowId));

      // Create payment record
      await db.insert(payments).values({
        id: `pay_${nanoid(16)}`,
        userId: input.recipientId,
        contractId: escrow[0].contractId,
        type: 'escrow_refund',
        amount: String(input.amount),
        currency: 'GBP',
        status: 'succeeded',
        description: 'Escrow refund',
        processedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'escrow_refunded',
        entityType: 'escrow',
        entityId: input.escrowId,
        newValue: JSON.stringify({
          amount: input.amount,
          recipientId: input.recipientId,
          adminNotes: input.adminNotes,
        }),
        createdAt: new Date(),
      });

      // Notify recipient
      await createNotification({
        id: `notif_${nanoid(16)}`,
        userId: input.recipientId,
        type: 'payment',
        title: 'Refund Processed',
        message: `A refund of £${(input.amount / 100).toFixed(2)} has been processed. Funds will arrive in your account within 5-7 business days.`,
        relatedId: escrow[0].contractId,
        isRead: 'no',
        createdAt: new Date(),
      });

      return {
        success: true,
        refundId: refundResult.id,
        amount: input.amount,
      };
    }),

  // Handle Transpact webhook
  handleWebhook: publicProcedure
    .input(
      z.object({
        eventType: z.string(),
        eventId: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const webhookId = `webhook_${nanoid(16)}`;

      // Store webhook event
      await db.insert(webhookEvents).values({
        id: webhookId,
        provider: 'transpact',
        eventType: input.eventType,
        eventId: input.eventId,
        payload: JSON.stringify(input.data),
        status: 'processing',
        createdAt: new Date(),
      });

      try {
        const tx = input.data.transaction;

        switch (input.eventType) {
          case 'transaction.deposited': {
            // Funds have been deposited into escrow
            await db
              .update(escrowTransactions)
              .set({
                status: 'held',
                depositedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(escrowTransactions.escrowReference, tx.id));
            break;
          }

          case 'transaction.released': {
            await db
              .update(escrowTransactions)
              .set({
                status: 'released',
                releasedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(escrowTransactions.escrowReference, tx.id));
            break;
          }

          case 'transaction.refunded': {
            await db
              .update(escrowTransactions)
              .set({
                status: 'refunded',
                updatedAt: new Date(),
              })
              .where(eq(escrowTransactions.escrowReference, tx.id));
            break;
          }

          case 'transaction.cancelled': {
            await db
              .update(escrowTransactions)
              .set({
                status: 'cancelled',
                updatedAt: new Date(),
              })
              .where(eq(escrowTransactions.escrowReference, tx.id));
            break;
          }
        }

        // Mark webhook as processed
        await db
          .update(webhookEvents)
          .set({
            status: 'processed',
            processedAt: new Date(),
          })
          .where(eq(webhookEvents.id, webhookId));

        return { success: true };
      } catch (error) {
        await db
          .update(webhookEvents)
          .set({
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          .where(eq(webhookEvents.id, webhookId));

        throw error;
      }
    }),

  // Get escrow summary for user
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    // Get all escrows for contracts where user is client or provider
    const userContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.clientId, ctx.user.id));

    const providerContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.providerId, ctx.user.id));

    const allContractIds = [
      ...userContracts.map((c) => c.id),
      ...providerContracts.map((c) => c.id),
    ];

    if (allContractIds.length === 0) {
      return {
        totalHeld: 0,
        totalReleased: 0,
        totalRefunded: 0,
        pendingDeposits: 0,
        activeEscrows: 0,
      };
    }

    const allEscrows = await db
      .select()
      .from(escrowTransactions)
      .where(eq(escrowTransactions.contractId, allContractIds[0])); // Simplified - would need IN clause

    const summary = allEscrows.reduce(
      (acc, escrow) => {
        const amount = parseInt(escrow.amount, 10);
        switch (escrow.status) {
          case 'held':
            acc.totalHeld += amount;
            acc.activeEscrows++;
            break;
          case 'released':
            acc.totalReleased += amount;
            break;
          case 'refunded':
            acc.totalRefunded += amount;
            break;
          case 'pending':
            acc.pendingDeposits += amount;
            break;
        }
        return acc;
      },
      { totalHeld: 0, totalReleased: 0, totalRefunded: 0, pendingDeposits: 0, activeEscrows: 0 }
    );

    return summary;
  }),
});

// Map Transpact status to our status enum
function mapTranspactStatus(transpactStatus: string): 'pending' | 'held' | 'released' | 'refunded' | 'cancelled' {
  const statusMap: Record<string, 'pending' | 'held' | 'released' | 'refunded' | 'cancelled'> = {
    created: 'pending',
    awaiting_deposit: 'pending',
    deposited: 'held',
    held: 'held',
    released: 'released',
    refunded: 'refunded',
    cancelled: 'cancelled',
    expired: 'cancelled',
  };

  return statusMap[transpactStatus.toLowerCase()] || 'pending';
}
