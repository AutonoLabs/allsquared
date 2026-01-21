import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Define enums at the top of the file
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const userTypeEnum = pgEnum("user_type", ["provider", "client", "both"]);
export const verifiedEnum = pgEnum("verified", ["yes", "no"]);
export const categoryEnum = pgEnum("category", [
  "freelance",
  "home_improvement",
  "event_services",
  "trade_services",
  "other",
]);
export const isActiveEnum = pgEnum("is_active", ["yes", "no"]);
export const contractStatusEnum = pgEnum("contract_status", [
  "draft",
  "pending_signature",
  "active",
  "completed",
  "disputed",
  "cancelled",
]);
export const milestoneStatusEnum = pgEnum("milestone_status", [
  "pending",
  "in_progress",
  "submitted",
  "approved",
  "rejected",
  "paid",
]);
export const escrowStatusEnum = pgEnum("escrow_status", [
  "pending",
  "held",
  "released",
  "refunded",
  "cancelled",
]);
export const disputeStatusEnum = pgEnum("dispute_status", [
  "open",
  "under_review",
  "resolved",
  "escalated",
  "closed",
]);
export const litlRequestTypeEnum = pgEnum("litl_request_type", [
  "contract_review",
  "legal_advice",
  "custom_contract",
  "dispute_assistance",
]);
export const litlStatusEnum = pgEnum("litl_status", [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "contract",
  "milestone",
  "payment",
  "dispute",
  "system",
]);
export const isReadEnum = pgEnum("is_read", ["yes", "no"]);
export const entityTypeEnum = pgEnum("entity_type", [
  "contract",
  "milestone",
  "dispute",
  "profile",
  "verification",
]);
export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "starter", "pro", "enterprise"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "past_due",
  "cancelled",
  "paused",
  "trialing",
]);
export const cancelAtPeriodEndEnum = pgEnum("cancel_at_period_end", ["yes", "no"]);
export const paymentTypeEnum = pgEnum("payment_type", [
  "subscription",
  "escrow_deposit",
  "escrow_release",
  "escrow_refund",
  "platform_fee",
  "litl_fee",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "refunded",
  "cancelled",
]);
export const kycStatusEnum = pgEnum("kyc_status", [
  "pending",
  "processing",
  "verified",
  "failed",
  "expired",
  "requires_input",
]);
export const kycProviderEnum = pgEnum("kyc_provider", ["stripe_identity", "onfido", "manual"]);
export const verificationTypeEnum = pgEnum("verification_type", [
  "identity",
  "address",
  "business",
]);
export const addressVerifiedEnum = pgEnum("address_verified", ["yes", "no"]);
export const signatureProviderEnum = pgEnum("signature_provider", ["docusign", "signwell", "internal"]);
export const signatureStatusEnum = pgEnum("signature_status", [
  "pending",
  "sent",
  "viewed",
  "signed",
  "declined",
  "expired",
]);
export const webhookProviderEnum = pgEnum("webhook_provider", ["stripe", "docusign", "transpact", "signwell"]);
export const webhookStatusEnum = pgEnum("webhook_status", [
  "pending",
  "processing",
  "processed",
  "failed",
]);
export const aiStatusEnum = pgEnum("ai_status", ["completed", "failed", "revised"]);
export const userFeedbackEnum = pgEnum("user_feedback", ["positive", "negative", "neutral"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  userType: userTypeEnum("userType"),
  businessName: varchar("businessName", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  profilePhoto: varchar("profilePhoto", { length: 500 }),
  verified: verifiedEnum("verified").default("no").notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeConnectedAccountId: varchar("stripeConnectedAccountId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Contract templates for different service categories
export const contractTemplates = pgTable("contractTemplates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: categoryEnum("category").notNull(),
  description: text("description"),
  templateContent: text("templateContent").notNull(), // JSON structure
  isActive: isActiveEnum("isActive").default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type ContractTemplate = typeof contractTemplates.$inferSelect;
export type InsertContractTemplate = typeof contractTemplates.$inferInsert;

// Contracts between users
export const contracts = pgTable("contracts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  templateId: varchar("templateId", { length: 64 }),
  clientId: varchar("clientId", { length: 64 }).notNull(),
  providerId: varchar("providerId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  totalAmount: varchar("totalAmount", { length: 20 }).notNull(), // Store as string to avoid decimal issues
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: contractStatusEnum("status").default("draft").notNull(),
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
export const milestones = pgTable("milestones", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: varchar("amount", { length: 20 }).notNull(),
  order: varchar("order", { length: 10 }).notNull(), // Sequence number
  status: milestoneStatusEnum("status").default("pending").notNull(),
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
export const escrowTransactions = pgTable("escrowTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  milestoneId: varchar("milestoneId", { length: 64 }),
  amount: varchar("amount", { length: 20 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: escrowStatusEnum("status").default("pending").notNull(),
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
export const disputes = pgTable("disputes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  milestoneId: varchar("milestoneId", { length: 64 }),
  raisedBy: varchar("raisedBy", { length: 64 }).notNull(), // userId
  reason: text("reason").notNull(),
  evidence: text("evidence"), // JSON array of file URLs
  status: disputeStatusEnum("status").default("open").notNull(),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

// LITL (Lawyer-in-the-Loop) referrals
export const litlReferrals = pgTable("litlReferrals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  contractId: varchar("contractId", { length: 64 }),
  requestType: litlRequestTypeEnum("requestType").notNull(),
  description: text("description"),
  status: litlStatusEnum("status").default("pending").notNull(),
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
export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: isReadEnum("isRead").default("no").notNull(),
  relatedId: varchar("relatedId", { length: 64 }), // contractId, milestoneId, etc.
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// File attachments for contracts, milestones, disputes, etc.
export const fileAttachments = pgTable("fileAttachments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  entityType: entityTypeEnum("entityType").notNull(),
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
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  tier: subscriptionTierEnum("tier").default("free").notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: cancelAtPeriodEndEnum("cancelAtPeriodEnd").default("no").notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Payment transactions history
export const payments = pgTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  contractId: varchar("contractId", { length: 64 }),
  milestoneId: varchar("milestoneId", { length: 64 }),
  subscriptionId: varchar("subscriptionId", { length: 64 }),
  type: paymentTypeEnum("type").notNull(),
  amount: varchar("amount", { length: 20 }).notNull(), // in smallest currency unit (pence)
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
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
export const auditLogs = pgTable("auditLogs", {
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
export const kycVerifications = pgTable("kycVerifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  status: kycStatusEnum("status").default("pending").notNull(),
  provider: kycProviderEnum("provider").notNull(),
  providerVerificationId: varchar("providerVerificationId", { length: 255 }),
  verificationType: verificationTypeEnum("verificationType").default("identity").notNull(),
  documentType: varchar("documentType", { length: 50 }), // passport, driving_license, etc.
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }), // YYYY-MM-DD
  addressVerified: addressVerifiedEnum("addressVerified").default("no").notNull(),
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
export const signatures = pgTable("signatures", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  provider: signatureProviderEnum("provider").default("internal").notNull(),
  providerEnvelopeId: varchar("providerEnvelopeId", { length: 255 }),
  providerSignerId: varchar("providerSignerId", { length: 255 }),
  status: signatureStatusEnum("status").default("pending").notNull(),
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
export const webhookEvents = pgTable("webhookEvents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  provider: webhookProviderEnum("provider").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventId: varchar("eventId", { length: 255 }), // Provider's event ID
  payload: text("payload").notNull(), // Full JSON payload
  status: webhookStatusEnum("status").default("pending").notNull(),
  errorMessage: text("errorMessage"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// AI contract generation history
export const aiGenerations = pgTable("aiGenerations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  contractId: varchar("contractId", { length: 64 }),
  templateId: varchar("templateId", { length: 64 }),
  prompt: text("prompt").notNull(), // User's input/requirements
  generatedContent: text("generatedContent").notNull(), // AI output
  model: varchar("model", { length: 50 }).notNull(), // gpt-4, gpt-4-turbo, etc.
  tokensUsed: varchar("tokensUsed", { length: 20 }),
  status: aiStatusEnum("status").default("completed").notNull(),
  userFeedback: userFeedbackEnum("userFeedback"),
  revisionCount: varchar("revisionCount", { length: 5 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AiGeneration = typeof aiGenerations.$inferSelect;
export type InsertAiGeneration = typeof aiGenerations.$inferInsert;
