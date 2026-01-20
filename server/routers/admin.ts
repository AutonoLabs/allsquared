import { z } from 'zod';
import { router, adminProcedure } from '../_core/trpc';
import { getDb } from '../db';
import {
  users,
  contracts,
  disputes,
  kycVerifications,
  auditLogs,
  subscriptions,
  payments,
} from '../../drizzle/schema';
import { eq, desc, and, or, like, sql, count } from 'drizzle-orm';

// Helper to create audit log entries
async function createAuditLog(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  previousValue: unknown,
  newValue: unknown,
  ipAddress?: string,
  userAgent?: string
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(auditLogs).values({
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    action,
    entityType,
    entityId,
    previousValue: previousValue ? JSON.stringify(previousValue) : null,
    newValue: newValue ? JSON.stringify(newValue) : null,
    ipAddress,
    userAgent,
    createdAt: new Date(),
  });
}

// ===== Users Router =====
const usersRouter = router({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
        role: z.enum(['user', 'admin']).optional(),
        verified: z.enum(['yes', 'no']).optional(),
        userType: z.enum(['provider', 'client', 'both']).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 20, search, role, verified, userType } = input || {};
      const db = await getDb();
      if (!db) return { users: [], total: 0, page, totalPages: 0 };

      // Build where conditions
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`),
            like(users.businessName, `%${search}%`)
          )
        );
      }
      if (role) {
        conditions.push(eq(users.role, role));
      }
      if (verified) {
        conditions.push(eq(users.verified, verified));
      }
      if (userType) {
        conditions.push(eq(users.userType, userType));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const countResult = await db
        .select({ count: count() })
        .from(users)
        .where(whereClause);
      const total = countResult[0]?.count || 0;

      // Get paginated results
      const offset = (page - 1) * limit;
      const results = await db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        users: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user) return null;

      // Get user's contracts
      const userContracts = await db
        .select()
        .from(contracts)
        .where(or(eq(contracts.clientId, input.id), eq(contracts.providerId, input.id)))
        .orderBy(desc(contracts.createdAt))
        .limit(10);

      // Get user's subscription
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, input.id))
        .limit(1);

      // Get user's KYC status
      const [kyc] = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.userId, input.id))
        .orderBy(desc(kycVerifications.createdAt))
        .limit(1);

      return {
        user,
        contracts: userContracts,
        subscription,
        kyc,
      };
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(['user', 'admin']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Get current user state for audit log
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!currentUser) throw new Error('User not found');

      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'user.role_updated',
        'user',
        input.id,
        { role: currentUser.role },
        { role: input.role }
      );

      return { success: true };
    }),

  verify: adminProcedure
    .input(
      z.object({
        id: z.string(),
        verified: z.enum(['yes', 'no']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!currentUser) throw new Error('User not found');

      await db
        .update(users)
        .set({ verified: input.verified })
        .where(eq(users.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'user.verification_updated',
        'user',
        input.id,
        { verified: currentUser.verified },
        { verified: input.verified }
      );

      return { success: true };
    }),

  ban: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // For now, we'll use verified: 'no' as a ban indicator
      // In production, you'd add a 'banned' column
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!currentUser) throw new Error('User not found');

      await db
        .update(users)
        .set({ verified: 'no' })
        .where(eq(users.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'user.banned',
        'user',
        input.id,
        { verified: currentUser.verified },
        { verified: 'no', reason: input.reason }
      );

      return { success: true };
    }),
});

// ===== Contracts Router =====
const contractsAdminRouter = router({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z
          .enum(['draft', 'pending_signature', 'active', 'completed', 'disputed', 'cancelled'])
          .optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 20, status, search } = input || {};
      const db = await getDb();
      if (!db) return { contracts: [], total: 0, page, totalPages: 0 };

      const conditions = [];
      if (status) {
        conditions.push(eq(contracts.status, status));
      }
      if (search) {
        conditions.push(
          or(
            like(contracts.title, `%${search}%`),
            like(contracts.description, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const countResult = await db
        .select({ count: count() })
        .from(contracts)
        .where(whereClause);
      const total = countResult[0]?.count || 0;

      const offset = (page - 1) * limit;
      const results = await db
        .select()
        .from(contracts)
        .where(whereClause)
        .orderBy(desc(contracts.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        contracts: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!contract) return null;

      // Get client and provider
      const [client] = await db
        .select()
        .from(users)
        .where(eq(users.id, contract.clientId))
        .limit(1);

      const [provider] = contract.providerId
        ? await db
            .select()
            .from(users)
            .where(eq(users.id, contract.providerId))
            .limit(1)
        : [null];

      // Get disputes
      const contractDisputes = await db
        .select()
        .from(disputes)
        .where(eq(disputes.contractId, input.id))
        .orderBy(desc(disputes.createdAt));

      return {
        contract,
        client,
        provider,
        disputes: contractDisputes,
      };
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['draft', 'pending_signature', 'active', 'completed', 'disputed', 'cancelled']),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [currentContract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!currentContract) throw new Error('Contract not found');

      await db
        .update(contracts)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(contracts.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'contract.status_updated',
        'contract',
        input.id,
        { status: currentContract.status },
        { status: input.status, reason: input.reason }
      );

      return { success: true };
    }),

  cancel: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [currentContract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!currentContract) throw new Error('Contract not found');

      await db
        .update(contracts)
        .set({ status: 'cancelled', updatedAt: new Date() })
        .where(eq(contracts.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'contract.cancelled_by_admin',
        'contract',
        input.id,
        { status: currentContract.status },
        { status: 'cancelled', reason: input.reason }
      );

      return { success: true };
    }),
});

// ===== Disputes Router =====
const disputesRouter = router({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.enum(['open', 'under_review', 'resolved', 'escalated', 'closed']).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 20, status } = input || {};
      const db = await getDb();
      if (!db) return { disputes: [], total: 0, page, totalPages: 0 };

      const conditions = [];
      if (status) {
        conditions.push(eq(disputes.status, status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const countResult = await db
        .select({ count: count() })
        .from(disputes)
        .where(whereClause);
      const total = countResult[0]?.count || 0;

      const offset = (page - 1) * limit;
      const results = await db
        .select()
        .from(disputes)
        .where(whereClause)
        .orderBy(desc(disputes.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        disputes: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.id))
        .limit(1);

      if (!dispute) return null;

      // Get related contract
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      // Get user who raised dispute
      const [raisedByUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, dispute.raisedBy))
        .limit(1);

      return {
        dispute,
        contract,
        raisedByUser,
      };
    }),

  resolve: adminProcedure
    .input(
      z.object({
        id: z.string(),
        resolution: z.string(),
        outcome: z.enum(['resolved', 'closed']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [currentDispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.id))
        .limit(1);

      if (!currentDispute) throw new Error('Dispute not found');

      await db
        .update(disputes)
        .set({
          status: input.outcome,
          resolution: input.resolution,
          resolvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(disputes.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'dispute.resolved',
        'dispute',
        input.id,
        { status: currentDispute.status },
        { status: input.outcome, resolution: input.resolution }
      );

      return { success: true };
    }),
});

// ===== KYC Router =====
const kycRouter = router({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z
          .enum(['pending', 'processing', 'verified', 'failed', 'expired', 'requires_input'])
          .optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 20, status } = input || {};
      const db = await getDb();
      if (!db) return { verifications: [], total: 0, page, totalPages: 0 };

      const conditions = [];
      if (status) {
        conditions.push(eq(kycVerifications.status, status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const countResult = await db
        .select({ count: count() })
        .from(kycVerifications)
        .where(whereClause);
      const total = countResult[0]?.count || 0;

      const offset = (page - 1) * limit;
      const results = await db
        .select()
        .from(kycVerifications)
        .where(whereClause)
        .orderBy(desc(kycVerifications.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        verifications: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  approve: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [currentKyc] = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.id, input.id))
        .limit(1);

      if (!currentKyc) throw new Error('KYC verification not found');

      await db
        .update(kycVerifications)
        .set({
          status: 'verified',
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(kycVerifications.id, input.id));

      // Also update user verification status
      await db
        .update(users)
        .set({ verified: 'yes' })
        .where(eq(users.id, currentKyc.userId));

      await createAuditLog(
        ctx.user.id,
        'kyc.approved',
        'kyc',
        input.id,
        { status: currentKyc.status },
        { status: 'verified' }
      );

      return { success: true };
    }),

  reject: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [currentKyc] = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.id, input.id))
        .limit(1);

      if (!currentKyc) throw new Error('KYC verification not found');

      await db
        .update(kycVerifications)
        .set({
          status: 'failed',
          failureReason: input.reason,
          updatedAt: new Date(),
        })
        .where(eq(kycVerifications.id, input.id));

      await createAuditLog(
        ctx.user.id,
        'kyc.rejected',
        'kyc',
        input.id,
        { status: currentKyc.status },
        { status: 'failed', reason: input.reason }
      );

      return { success: true };
    }),
});

// ===== Analytics Router =====
const analyticsRouter = router({
  overview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        totalUsers: 0,
        totalContracts: 0,
        activeContracts: 0,
        totalDisputes: 0,
        openDisputes: 0,
        pendingKyc: 0,
        totalRevenue: 0,
        recentUsers: [],
        recentContracts: [],
      };
    }

    // User stats
    const [userCount] = await db.select({ count: count() }).from(users);

    // Contract stats
    const [contractCount] = await db.select({ count: count() }).from(contracts);
    const [activeContractCount] = await db
      .select({ count: count() })
      .from(contracts)
      .where(eq(contracts.status, 'active'));

    // Dispute stats
    const [disputeCount] = await db.select({ count: count() }).from(disputes);
    const [openDisputeCount] = await db
      .select({ count: count() })
      .from(disputes)
      .where(eq(disputes.status, 'open'));

    // KYC stats
    const [pendingKycCount] = await db
      .select({ count: count() })
      .from(kycVerifications)
      .where(eq(kycVerifications.status, 'pending'));

    // Revenue (sum of successful payments)
    const revenueResult = await db
      .select({ total: sql<string>`COALESCE(SUM(CAST(${payments.amount} AS DECIMAL)), 0)` })
      .from(payments)
      .where(eq(payments.status, 'succeeded'));
    const totalRevenue = parseFloat(revenueResult[0]?.total || '0');

    // Recent users
    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5);

    // Recent contracts
    const recentContracts = await db
      .select()
      .from(contracts)
      .orderBy(desc(contracts.createdAt))
      .limit(5);

    return {
      totalUsers: userCount?.count || 0,
      totalContracts: contractCount?.count || 0,
      activeContracts: activeContractCount?.count || 0,
      totalDisputes: disputeCount?.count || 0,
      openDisputes: openDisputeCount?.count || 0,
      pendingKyc: pendingKycCount?.count || 0,
      totalRevenue,
      recentUsers,
      recentContracts,
    };
  }),
});

// ===== Audit Logs Router =====
const auditLogsRouter = router({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        action: z.string().optional(),
        entityType: z.string().optional(),
        userId: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 50, action, entityType, userId } = input || {};
      const db = await getDb();
      if (!db) return { logs: [], total: 0, page, totalPages: 0 };

      const conditions = [];
      if (action) {
        conditions.push(like(auditLogs.action, `%${action}%`));
      }
      if (entityType) {
        conditions.push(eq(auditLogs.entityType, entityType));
      }
      if (userId) {
        conditions.push(eq(auditLogs.userId, userId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const countResult = await db
        .select({ count: count() })
        .from(auditLogs)
        .where(whereClause);
      const total = countResult[0]?.count || 0;

      const offset = (page - 1) * limit;
      const results = await db
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        logs: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),
});

// ===== Main Admin Router =====
export const adminRouter = router({
  users: usersRouter,
  contracts: contractsAdminRouter,
  disputes: disputesRouter,
  kyc: kycRouter,
  analytics: analyticsRouter,
  auditLogs: auditLogsRouter,
});
