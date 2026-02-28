import { eq, and, or, desc } from "drizzle-orm";
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
  contactNotes,
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
  type ContactNote,
  type InsertContactNote,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

    const textFields = ["name", "email", "loginMethod"] as const;
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
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
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

export async function getUserContracts(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(contracts)
    .where(
      or(
        eq(contracts.clientId, userId),
        eq(contracts.providerId, userId)
      )
    )
    .orderBy(desc(contracts.createdAt));
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

export async function markNotificationAsRead(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(notifications)
    .set({ isRead: "yes" })
    .where(eq(notifications.id, id));
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

// ── CRM: Contacts ──────────────────────────────────────────────

export async function getUserContacts(userId: string) {
  const db = await getDb();
  if (!db) return [];

  // Get all unique users this person has contracts with
  const userContracts = await db
    .select()
    .from(contracts)
    .where(
      or(
        eq(contracts.clientId, userId),
        eq(contracts.providerId, userId)
      )
    );

  // Extract unique contact IDs
  const contactIds = new Set<string>();
  for (const c of userContracts) {
    if (c.clientId !== userId) contactIds.add(c.clientId);
    if (c.providerId !== userId) contactIds.add(c.providerId);
  }

  if (contactIds.size === 0) return [];

  // Fetch user details for each contact
  const contactUsers = [];
  for (const id of contactIds) {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (user[0]) {
      // Count contracts with this contact
      const sharedContracts = userContracts.filter(
        c => c.clientId === id || c.providerId === id
      );
      const activeContracts = sharedContracts.filter(c => c.status === 'active').length;
      const totalValue = sharedContracts.reduce(
        (sum, c) => sum + parseInt(c.totalAmount || '0', 10), 0
      );

      contactUsers.push({
        ...user[0],
        contractCount: sharedContracts.length,
        activeContracts,
        totalValue,
        lastContractDate: sharedContracts
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0]
          ?.createdAt,
      });
    }
  }

  return contactUsers;
}

export async function getContactNotes(ownerId: string, contactId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(contactNotes)
    .where(
      and(
        eq(contactNotes.ownerId, ownerId),
        eq(contactNotes.contactId, contactId)
      )
    )
    .orderBy(desc(contactNotes.createdAt));
}

export async function createContactNote(note: InsertContactNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(contactNotes).values(note);
  return note;
}

export async function deleteContactNote(id: string, ownerId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(contactNotes)
    .where(
      and(
        eq(contactNotes.id, id),
        eq(contactNotes.ownerId, ownerId)
      )
    );
}
