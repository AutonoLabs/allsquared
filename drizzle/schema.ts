import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Contract templates for different service categories
export const contractTemplates = mysqlTable("contractTemplates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", [
    "freelance",
    "home_improvement",
    "event_services",
    "trade_services",
    "other",
  ]).notNull(),
  description: text("description"),
  templateContent: text("templateContent").notNull(), // JSON structure
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type ContractTemplate = typeof contractTemplates.$inferSelect;
export type InsertContractTemplate = typeof contractTemplates.$inferInsert;

// Contracts between users
export const contracts = mysqlTable("contracts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  templateId: varchar("templateId", { length: 64 }),
  clientId: varchar("clientId", { length: 64 }).notNull(),
  providerId: varchar("providerId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "freelance",
    "home_improvement",
    "event_services",
    "trade_services",
    "other",
  ]).notNull(),
  totalAmount: varchar("totalAmount", { length: 20 }).notNull(), // Store as string to avoid decimal issues
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: mysqlEnum("status", [
    "draft",
    "pending_signature",
    "active",
    "completed",
    "disputed",
    "cancelled",
  ]).default("draft").notNull(),
  contractContent: text("contractContent").notNull(), // Full contract text
  clientSignedAt: timestamp("clientSignedAt"),
  providerSignedAt: timestamp("providerSignedAt"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// Milestones for each contract
export const milestones = mysqlTable("milestones", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: varchar("amount", { length: 20 }).notNull(),
  order: varchar("order", { length: 10 }).notNull(), // Sequence number
  status: mysqlEnum("status", [
    "pending",
    "in_progress",
    "submitted",
    "approved",
    "rejected",
    "paid",
  ]).default("pending").notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  approvedAt: timestamp("approvedAt"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

// Escrow transactions
export const escrowTransactions = mysqlTable("escrowTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  milestoneId: varchar("milestoneId", { length: 64 }),
  amount: varchar("amount", { length: 20 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "held",
    "released",
    "refunded",
    "cancelled",
  ]).default("pending").notNull(),
  escrowProvider: varchar("escrowProvider", { length: 100 }), // e.g., "Riverside", "Transpact"
  escrowReference: varchar("escrowReference", { length: 255 }), // External reference
  depositedAt: timestamp("depositedAt"),
  releasedAt: timestamp("releasedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type EscrowTransaction = typeof escrowTransactions.$inferSelect;
export type InsertEscrowTransaction = typeof escrowTransactions.$inferInsert;

// Disputes
export const disputes = mysqlTable("disputes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  milestoneId: varchar("milestoneId", { length: 64 }),
  raisedBy: varchar("raisedBy", { length: 64 }).notNull(), // userId
  reason: text("reason").notNull(),
  status: mysqlEnum("status", [
    "open",
    "under_review",
    "resolved",
    "escalated",
    "closed",
  ]).default("open").notNull(),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

// LITL (Lawyer-in-the-Loop) referrals
export const litlReferrals = mysqlTable("litlReferrals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  contractId: varchar("contractId", { length: 64 }),
  requestType: mysqlEnum("requestType", [
    "contract_review",
    "legal_advice",
    "custom_contract",
    "dispute_assistance",
  ]).notNull(),
  description: text("description"),
  status: mysqlEnum("status", [
    "pending",
    "assigned",
    "in_progress",
    "completed",
    "cancelled",
  ]).default("pending").notNull(),
  lawyerName: varchar("lawyerName", { length: 255 }),
  callScheduledAt: timestamp("callScheduledAt"),
  completedAt: timestamp("completedAt"),
  fee: varchar("fee", { length: 20 }), // e.g., "99.00"
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type LitlReferral = typeof litlReferrals.$inferSelect;
export type InsertLitlReferral = typeof litlReferrals.$inferInsert;

// Notifications
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", [
    "contract",
    "milestone",
    "payment",
    "dispute",
    "system",
  ]).notNull(),
  isRead: mysqlEnum("isRead", ["yes", "no"]).default("no").notNull(),
  relatedId: varchar("relatedId", { length: 64 }), // contractId, milestoneId, etc.
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
