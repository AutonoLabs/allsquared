import { z } from 'zod';
import { adminProcedure, protectedProcedure, router } from '../_core/trpc';
import { getDb, createNotification } from '../db';
import {
  escrowTransactions,
  contracts,
  milestones,
  payments,
  auditLogs,
  webhookEvents
} from '../../drizzle/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import * as transpact from '../lib/transpact-client';
import {
  calculateEscrowFee,
  mapTranspactStatus,
  type EscrowStatus,
} from '../_core/escrowFees';
import { checkPayoutCountry } from '../_core/transpact-countries';

/**
 * Transpact Escrow Integration (SOAP)
 * FCA Reference: 546279
 *
 * This router handles escrow operations via Transpact's SOAP API.
 * The SOAP client lives in server/lib/transpact-client.ts and falls
 * back to mock responses when TRANSPACT_API_KEY is not set.
 *
 * Env vars:
 *   TRANSPACT_API_KEY      — partner API key
 *   TRANSPACT_PARTNER_ID   — partner ID
 *   TRANSPACT_WSDL_URL     — WSDL endpoint (optional override)
 *   TRANSPACT_SOAP_URL     — SOAP service endpoint (optional override)
 */

// Re-exported for backward compatibility. Canonical implementation + tests
// live in `_core/escrowFees.ts` so the pure math can run without the full
// router module graph (Drizzle, Transpact SOAP client, tRPC).
export { calculateEscrowFee, mapTranspactStatus };
export type { EscrowStatus };

export const escrowRouter = router({
  // Create escrow transaction for a contract
  createTransaction: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        milestoneId: z.string().optional(),
        amount: z.number().positive(),
        /**
         * ISO-3166-alpha-2 country code of the freelancer's payout bank
         * account. Transpact does not support personal-name accounts in a
         * small list of restricted jurisdictions (PK, ZA, CN).
         */
        supplierPayoutCountry: z
          .string()
          .trim()
          .length(2, 'supplierPayoutCountry must be ISO-3166-alpha-2')
          .transform((s) => s.toUpperCase()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

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

      // Transpact country gate — must run before any Transpact API call.
      const countryCheck = checkPayoutCountry(input.supplierPayoutCountry);
      if (countryCheck.decision === 'blocked') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: countryCheck.reason,
        });
      }
      if (countryCheck.decision === 'unknown') {
        // Treat unknown as a hard fail: we cannot confirm Transpact will
        // accept this payout destination, so we decline rather than risk
        // bouncing at the gateway with funds already promised.
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            countryCheck.reason +
            ' Ask the freelancer to set a valid payout country in their ' +
            'payment settings before retrying.',
        });
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

      // Create Transpact transaction (SOAP: CreateTranspact)
      const transpactTx = await transpact.createTransaction({
        amount: input.amount,
        currency: 'GBP',
        reference: reference,
        description: `Escrow for contract: ${contract[0].title}`,
        clientEmail: ctx.user.email || '',
        callbackUrl: `${process.env.APP_URL}/api/webhooks/transpact`,
        metadata: {
          allsquaredContractId: input.contractId,
          allsquaredMilestoneId: input.milestoneId || '',
          allsquaredEscrowId: escrowId,
          allsquaredSupplierPayoutCountry: input.supplierPayoutCountry,
        },
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');

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

      // Get latest status from Transpact (SOAP: ViewTranspact)
      if (escrow[0].escrowReference && process.env.TRANSPACT_API_KEY) {
        try {
          const transpactStatus = await transpact.getTransaction(escrow[0].escrowReference);

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
      const db = await getDb();
      if (!db) throw new Error('Database not available');

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
      const db = await getDb();
      if (!db) throw new Error('Database not available');

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

      // Release via Transpact (SOAP: ReleaseTranspact)
      const releaseResult = await transpact.releaseFunds(
        escrow[0].escrowReference!,
        releaseAmount,
        contract[0].providerId || undefined,
        input.notes,
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');

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
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Escrow funds are not available for refund',
        });
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
  processRefund: adminProcedure
    .input(
      z.object({
        escrowId: z.string(),
        amount: z.number().positive(),
        recipientId: z.string(), // userId to receive refund
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // In production, this would be admin-only
      const escrow = await db
        .select()
        .from(escrowTransactions)
        .where(eq(escrowTransactions.id, input.escrowId))
        .limit(1);

      if (!escrow[0]) {
        throw new Error('Escrow transaction not found');
      }

      // Process refund via Transpact (SOAP: VoidTranspact)
      const refundResult = await transpact.requestRefund(
        escrow[0].escrowReference!,
        input.amount,
        input.recipientId,
        input.adminNotes,
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

  // Get escrow summary for user
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

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
      .where(inArray(escrowTransactions.contractId, allContractIds));

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

type TranspactWebhookInput = {
  eventType: string;
  eventId: string;
  data: any;
};

export async function processTranspactWebhook(input: TranspactWebhookInput) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const webhookId = `webhook_${nanoid(16)}`;

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
      case 'transaction.deposited':
        await db
          .update(escrowTransactions)
          .set({
            status: 'held',
            depositedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(escrowTransactions.escrowReference, tx.id));
        break;
      case 'transaction.released':
        await db
          .update(escrowTransactions)
          .set({
            status: 'released',
            releasedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(escrowTransactions.escrowReference, tx.id));
        break;
      case 'transaction.refunded':
        await db
          .update(escrowTransactions)
          .set({
            status: 'refunded',
            updatedAt: new Date(),
          })
          .where(eq(escrowTransactions.escrowReference, tx.id));
        break;
      case 'transaction.cancelled':
        await db
          .update(escrowTransactions)
          .set({
            status: 'cancelled',
            updatedAt: new Date(),
          })
          .where(eq(escrowTransactions.escrowReference, tx.id));
        break;
    }

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
}

// (mapTranspactStatus is now re-exported from `_core/escrowFees` above.)
