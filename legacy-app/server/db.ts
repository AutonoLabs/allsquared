import { eq, and, or, desc, SQL, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { 
  InsertUser, 
  users,
  contracts,
  milestones,
  escrowTransactions,
  disputes,
  litlReferrals,
  notifications,
  contractTemplates,
  waitlistEntries,
  type Contract,
  type InsertContract,
  type Milestone,
  type InsertMilestone,
  type EscrowTransaction,
  type InsertEscrowTransaction,
  type Dispute,
  type InsertDispute,
  type LitlReferral,
  type InsertLitlReferral,
  type Notification,
  type InsertNotification,
  type ContractTemplate,
  type InsertContractTemplate,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(/[\s,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "clerkId"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    const normalizedEmail = user.email?.toLowerCase() || "";
    const configuredAdminRole = normalizedEmail && getAdminEmails().has(normalizedEmail) ? "admin" : undefined;

    if (configuredAdminRole || user.role !== undefined) {
      const role = configuredAdminRole || user.role;
      values.role = role;
      updateSet.role = role;
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.id,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByClerkId(clerkId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by Clerk ID: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateUser(id: string, updates: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id));

  return getUser(id);
}

export type WaitlistJoinStatus = "added" | "already_registered";

export async function addWaitlistEmail(email: string): Promise<WaitlistJoinStatus> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const inserted = await db
    .insert(waitlistEntries)
    .values({ email })
    .onConflictDoNothing({ target: waitlistEntries.email })
    .returning({ email: waitlistEntries.email });

  return inserted.length > 0 ? "added" : "already_registered";
}

// ===== Contract Templates =====

export async function getAllContractTemplates() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(contractTemplates)
    .where(eq(contractTemplates.isActive, "yes"))
    .orderBy(contractTemplates.category);
}

export async function getContractTemplate(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(contractTemplates)
    .where(eq(contractTemplates.id, id))
    .limit(1);
  
  return result[0];
}

export async function createContractTemplate(template: InsertContractTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(contractTemplates).values(template);
  return template;
}

// ===== Contracts =====

export async function getUserContracts(userId: string, status?: string) {
  const db = await getDb();
  if (!db) return [];

  const { contracts } = await getUserContractsPage(userId, { status });
  return contracts;
}

function buildUserContractsFilter(userId: string, status?: string): SQL {
  const userFilter = or(
    eq(contracts.clientId, userId),
    eq(contracts.providerId, userId)
  );

  return status
    ? and(userFilter, eq(contracts.status, status as any))!
    : userFilter!;
}

export async function getUserContractsPage(
  userId: string,
  options: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const db = await getDb();
  if (!db) return { contracts: [], total: 0 };

  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  const whereClause = buildUserContractsFilter(userId, options.status);

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(contracts)
      .where(whereClause)
      .orderBy(desc(contracts.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db
      .select({ total: count() })
      .from(contracts)
      .where(whereClause),
  ]);

  return {
    contracts: rows,
    total: Number(totalRows[0]?.total ?? 0),
  };
}

export async function getContract(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, id))
    .limit(1);
  
  return result[0];
}

export async function createContract(contract: InsertContract) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(contracts).values(contract);
  return contract;
}

export async function updateContract(id: string, updates: Partial<InsertContract>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(contracts)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(contracts.id, id));
}

// ===== Milestones =====

export async function getContractMilestones(contractId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(milestones)
    .where(eq(milestones.contractId, contractId))
    .orderBy(milestones.order);
}

export async function getMilestone(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, id))
    .limit(1);
  
  return result[0];
}

export async function createMilestone(milestone: InsertMilestone) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(milestones).values(milestone);
  return milestone;
}

export async function updateMilestone(id: string, updates: Partial<InsertMilestone>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(milestones)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(milestones.id, id));
}

// ===== Escrow Transactions =====

export async function getContractEscrowTransactions(contractId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(escrowTransactions)
    .where(eq(escrowTransactions.contractId, contractId))
    .orderBy(desc(escrowTransactions.createdAt));
}

export async function createEscrowTransaction(transaction: InsertEscrowTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(escrowTransactions).values(transaction);
  return transaction;
}

export async function updateEscrowTransaction(id: string, updates: Partial<InsertEscrowTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(escrowTransactions)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(escrowTransactions.id, id));
}

// ===== Disputes =====

export async function getContractDisputes(contractId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(disputes)
    .where(eq(disputes.contractId, contractId))
    .orderBy(desc(disputes.createdAt));
}

export async function createDispute(dispute: InsertDispute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(disputes).values(dispute);
  return dispute;
}

export async function updateDispute(id: string, updates: Partial<InsertDispute>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(disputes)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(disputes.id, id));
}

// ===== LITL Referrals =====

export async function getUserLitlReferrals(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(litlReferrals)
    .where(eq(litlReferrals.userId, userId))
    .orderBy(desc(litlReferrals.createdAt));
}

export async function createLitlReferral(referral: InsertLitlReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(litlReferrals).values(referral);
  return referral;
}

export async function updateLitlReferral(id: string, updates: Partial<InsertLitlReferral>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(litlReferrals)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(litlReferrals.id, id));
}

// ===== Notifications =====

export async function getUserNotifications(userId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(notifications).values(notification);
  return notification;
}

export async function markNotificationAsRead(id: string, userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updated = await db
    .update(notifications)
    .set({ isRead: "yes" })
    .where(
      and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      )
    )
    .returning({ id: notifications.id });

  return updated.length > 0;
}

export async function markAllNotificationsAsRead(userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(notifications)
    .set({ isRead: "yes" })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, "no")
      )
    );
}
