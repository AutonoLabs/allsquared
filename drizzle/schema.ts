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
  userType: mysqlEnum("userType", ["provider", "client", "both"]),
  businessName: varchar("businessName", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  profilePhoto: varchar("profilePhoto", { length: 500 }),
  verified: mysqlEnum("verified", ["yes", "no"]).default("no").notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeConnectedAccountId: varchar("stripeConnectedAccountId", { length: 255 }),
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
  deliverables: text("deliverables"), // JSON array of file URLs
  submissionNotes: text("submissionNotes"),
  approvalNotes: text("approvalNotes"),
  dueDate: timestamp("dueDate"),
  submittedAt: timestamp("submittedAt"),
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
  evidence: text("evidence"), // JSON array of file URLs
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

// File attachments for contracts, milestones, disputes, etc.
export const fileAttachments = mysqlTable("fileAttachments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  entityType: mysqlEnum("entityType", [
    "contract",
    "milestone",
    "dispute",
    "profile",
    "verification",
  ]).notNull(),
  entityId: varchar("entityId", { length: 64 }).notNull(), // ID of the related entity
  uploadedBy: varchar("uploadedBy", { length: 64 }).notNull(), // userId
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: varchar("fileSize", { length: 20 }).notNull(), // in bytes
  fileType: varchar("fileType", { length: 100 }), // MIME type
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 URL or path
  createdAt: timestamp("createdAt").defaultNow(),
});

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type InsertFileAttachment = typeof fileAttachments.$inferInsert;

// Subscriptions for billing
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  tier: mysqlEnum("tier", ["free", "starter", "pro", "enterprise"]).default("free").notNull(),
  status: mysqlEnum("status", [
    "active",
    "past_due",
    "cancelled",
    "paused",
    "trialing",
  ]).default("active").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: mysqlEnum("cancelAtPeriodEnd", ["yes", "no"]).default("no").notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Payment transactions history
export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  contractId: varchar("contractId", { length: 64 }),
  milestoneId: varchar("milestoneId", { length: 64 }),
  subscriptionId: varchar("subscriptionId", { length: 64 }),
  type: mysqlEnum("type", [
    "subscription",
    "escrow_deposit",
    "escrow_release",
    "escrow_refund",
    "platform_fee",
    "litl_fee",
  ]).notNull(),
  amount: varchar("amount", { length: 20 }).notNull(), // in smallest currency unit (pence)
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "succeeded",
    "failed",
    "refunded",
    "cancelled",
  ]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeChargeId: varchar("stripeChargeId", { length: 255 }),
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  description: text("description"),
  metadata: text("metadata"), // JSON for additional info
  failureReason: text("failureReason"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Audit logs for compliance and security
export const auditLogs = mysqlTable("auditLogs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }), // null for system events
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(), // contract, user, payment, etc.
  entityId: varchar("entityId", { length: 64 }),
  previousValue: text("previousValue"), // JSON of previous state
  newValue: text("newValue"), // JSON of new state
  ipAddress: varchar("ipAddress", { length: 45 }), // supports IPv6
  userAgent: text("userAgent"),
  metadata: text("metadata"), // Additional context as JSON
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// KYC verifications for identity compliance
export const kycVerifications = mysqlTable("kycVerifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "verified",
    "failed",
    "expired",
    "requires_input",
  ]).default("pending").notNull(),
  provider: mysqlEnum("provider", ["stripe_identity", "onfido", "manual"]).notNull(),
  providerVerificationId: varchar("providerVerificationId", { length: 255 }),
  verificationType: mysqlEnum("verificationType", [
    "identity",
    "address",
    "business",
  ]).default("identity").notNull(),
  documentType: varchar("documentType", { length: 50 }), // passport, driving_license, etc.
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }), // YYYY-MM-DD
  addressVerified: mysqlEnum("addressVerified", ["yes", "no"]).default("no").notNull(),
  riskScore: varchar("riskScore", { length: 10 }), // low, medium, high
  failureReason: text("failureReason"),
  metadata: text("metadata"), // Additional verification data as JSON
  expiresAt: timestamp("expiresAt"),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type KycVerification = typeof kycVerifications.$inferSelect;
export type InsertKycVerification = typeof kycVerifications.$inferInsert;

// E-signature records
export const signatures = mysqlTable("signatures", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  provider: mysqlEnum("provider", ["docusign", "signwell", "internal"]).default("internal").notNull(),
  providerEnvelopeId: varchar("providerEnvelopeId", { length: 255 }),
  providerSignerId: varchar("providerSignerId", { length: 255 }),
  status: mysqlEnum("status", [
    "pending",
    "sent",
    "viewed",
    "signed",
    "declined",
    "expired",
  ]).default("pending").notNull(),
  signatureName: varchar("signatureName", { length: 255 }),
  signatureImage: text("signatureImage"), // Base64 or URL
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  signedAt: timestamp("signedAt"),
  sentAt: timestamp("sentAt"),
  viewedAt: timestamp("viewedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Signature = typeof signatures.$inferSelect;
export type InsertSignature = typeof signatures.$inferInsert;

// Webhook events for Stripe, DocuSign, Transpact, etc.
export const webhookEvents = mysqlTable("webhookEvents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  provider: mysqlEnum("provider", ["stripe", "docusign", "transpact", "signwell"]).notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventId: varchar("eventId", { length: 255 }), // Provider's event ID
  payload: text("payload").notNull(), // Full JSON payload
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "processed",
    "failed",
  ]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// AI contract generation history
export const aiGenerations = mysqlTable("aiGenerations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  contractId: varchar("contractId", { length: 64 }),
  templateId: varchar("templateId", { length: 64 }),
  prompt: text("prompt").notNull(), // User's input/requirements
  generatedContent: text("generatedContent").notNull(), // AI output
  model: varchar("model", { length: 50 }).notNull(), // gpt-4, gpt-4-turbo, etc.
  tokensUsed: varchar("tokensUsed", { length: 20 }),
  status: mysqlEnum("status", ["completed", "failed", "revised"]).default("completed").notNull(),
  userFeedback: mysqlEnum("userFeedback", ["positive", "negative", "neutral"]),
  revisionCount: varchar("revisionCount", { length: 5 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AiGeneration = typeof aiGenerations.$inferSelect;
export type InsertAiGeneration = typeof aiGenerations.$inferInsert;
