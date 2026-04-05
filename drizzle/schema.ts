import { bigint, boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

// Define enums at the top of the file
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const userTypeEnum = pgEnum("user_type", ["provider", "client", "both"]);
export const categoryEnum = pgEnum("category", [
  "freelance",
  "home_improvement",
  "event_services",
  "trade_services",
  "other",
]);
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
export const signatureProviderEnum = pgEnum("signature_provider", ["docuseal", "docusign", "signwell", "internal"]);
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

// ---- DEPRECATED enums kept for backward-compatible migration ----
// These were previously used for boolean-like columns. Existing data stores 'yes'/'no'.
// New columns use native boolean. A data migration should convert old rows.
export const verifiedEnum = pgEnum("verified", ["yes", "no"]);
export const isActiveEnum = pgEnum("is_active", ["yes", "no"]);
export const isReadEnum = pgEnum("is_read", ["yes", "no"]);
export const cancelAtPeriodEndEnum = pgEnum("cancel_at_period_end", ["yes", "no"]);
export const addressVerifiedEnum = pgEnum("address_verified", ["yes", "no"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  clerkId: varchar("clerkId", { length: 64 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  userType: userTypeEnum("userType"),
  businessName: varchar("businessName", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  profilePhoto: varchar("profilePhoto", { length: 500 }),
  verified: boolean("verified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  companyNumber: varchar("companyNumber", { length: 20 }),
  vatNumber: varchar("vatNumber", { length: 20 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeConnectedAccountId: varchar("stripeConnectedAccountId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
}, (table) => [
  uniqueIndex("users_email_unique").on(table.email),
  uniqueIndex("users_clerk_id_unique").on(table.clerkId),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Contract templates for different service categories
export const contractTemplates = pgTable("contractTemplates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: categoryEnum("category").notNull(),
  description: text("description"),
  templateContent: jsonb("templateContent").notNull(), // JSON structure
  isActive: boolean("isActive").default(true).notNull(),
  variables: jsonb("variables"), // JSON - variable definitions
  clauseBanks: jsonb("clauseBanks"), // JSON - clause bank options
  templateMarkdown: text("templateMarkdown"), // raw markdown template
  templateSlug: varchar("templateSlug", { length: 100 }), // unique identifier like "msa-uk"
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
}, (table) => [
  uniqueIndex("contract_templates_slug_unique").on(table.templateSlug),
]);

export type ContractTemplate = typeof contractTemplates.$inferSelect;
export type InsertContractTemplate = typeof contractTemplates.$inferInsert;

// Contracts between users
export const contracts = pgTable("contracts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  templateId: varchar("templateId", { length: 64 }).references(() => contractTemplates.id),
  clientId: varchar("clientId", { length: 64 }).notNull().references(() => users.id),
  providerId: varchar("providerId", { length: 64 }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  totalAmount: varchar("totalAmount", { length: 20 }).notNull(), // Store as string to avoid decimal issues
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: contractStatusEnum("status").default("draft").notNull(),
  contractContent: text("contractContent").notNull(), // Full contract text
  selectedClauses: jsonb("selectedClauses"), // JSON - which clauses were selected
  filledVariables: jsonb("filledVariables"), // JSON - filled variable values
  generatedMarkdown: text("generatedMarkdown"), // final generated markdown
  partyAId: varchar("partyAId", { length: 64 }).references(() => users.id),
  partyBId: varchar("partyBId", { length: 64 }).references(() => users.id),
  clientSignedAt: timestamp("clientSignedAt"),
  providerSignedAt: timestamp("providerSignedAt"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// Indexes for contracts table
export const contractsClientIdx = index("contracts_client_status_idx").on(contracts.clientId, contracts.status);
export const contractsProviderIdx = index("contracts_provider_status_idx").on(contracts.providerId, contracts.status);

// Milestones for each contract
export const milestones = pgTable("milestones", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull().references(() => contracts.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: varchar("amount", { length: 20 }).notNull(),
  order: integer("order").notNull(), // Sequence number (was varchar)
  status: milestoneStatusEnum("status").default("pending").notNull(),
  deliverables: jsonb("deliverables"), // JSON array of file URLs
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

// Index for milestones table
export const milestonesContractIdx = index("milestones_contract_idx").on(milestones.contractId);

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

// Escrow transactions
export const escrowTransactions = pgTable("escrowTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contractId: varchar("contractId", { length: 64 }).notNull().references(() => contracts.id),
  milestoneId: varchar("milestoneId", { length: 64 }).references(() => milestones.id),
  amount: varchar("amount", { length: 20 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: escrowStatusEnum("status").default("pending").notNull(),
  escrowProvider: varchar("escrowProvider", { length: 100 }),
  escrowReference: varchar("escrowReference", { length: 255 }),
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
  contractId: varchar("contractId", { length: 64 }).notNull().references(() => contracts.id),
  milestoneId: varchar("milestoneId", { length: 64 }).references(() => milestones.id),
  raisedBy: varchar("raisedBy", { length: 64 }).notNull().references(() => users.id),
  reason: text("reason").notNull(),
  evidence: jsonb("evidence"), // JSON array of file URLs
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
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  contractId: varchar("contractId", { length: 64 }).references(() => contracts.id),
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
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
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
  uploadedBy: varchar("uploadedBy", { length: 64 }).notNull().references(() => users.id),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: bigint("fileSize", { mode: "number" }).notNull(), // in bytes (was varchar)
  fileType: varchar("fileType", { length: 100 }), // MIME type
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 URL or path
  createdAt: timestamp("createdAt").defaultNow(),
});

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type InsertFileAttachment = typeof fileAttachments.$inferInsert;

// Subscriptions for billing
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  tier: subscriptionTierEnum("tier").default("free").notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Payment transactions history
export const payments = pgTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  contractId: varchar("contractId", { length: 64 }).references(() => contracts.id),
  milestoneId: varchar("milestoneId", { length: 64 }).references(() => milestones.id),
  subscriptionId: varchar("subscriptionId", { length: 64 }).references(() => subscriptions.id),
  type: paymentTypeEnum("type").notNull(),
  amount: varchar("amount", { length: 20 }).notNull(), // in smallest currency unit (pence)
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeChargeId: varchar("stripeChargeId", { length: 255 }),
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  description: text("description"),
  metadata: jsonb("metadata"), // JSON for additional info
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
  userId: varchar("userId", { length: 64 }).references(() => users.id), // null for system events
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: varchar("entityId", { length: 64 }),
  previousValue: jsonb("previousValue"), // JSON of previous state
  newValue: jsonb("newValue"), // JSON of new state
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  metadata: jsonb("metadata"), // Additional context as JSON
  createdAt: timestamp("createdAt").defaultNow(),
});

// Index for auditLogs table
export const auditLogsEntityIdx = index("audit_logs_entity_idx").on(auditLogs.entityId, auditLogs.entityType);
export const auditLogsUserIdx = index("audit_logs_user_idx").on(auditLogs.userId);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// KYC verifications for identity compliance
export const kycVerifications = pgTable("kycVerifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  status: kycStatusEnum("status").default("pending").notNull(),
  provider: kycProviderEnum("provider").notNull(),
  providerVerificationId: varchar("providerVerificationId", { length: 255 }),
  verificationType: verificationTypeEnum("verificationType").default("identity").notNull(),
  documentType: varchar("documentType", { length: 50 }),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }),
  addressVerified: boolean("addressVerified").default(false).notNull(),
  riskScore: varchar("riskScore", { length: 10 }),
  failureReason: text("failureReason"),
  metadata: jsonb("metadata"), // Additional verification data as JSON
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
  contractId: varchar("contractId", { length: 64 }).notNull().references(() => contracts.id),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  provider: signatureProviderEnum("provider").default("internal").notNull(),
  providerEnvelopeId: varchar("providerEnvelopeId", { length: 255 }),
  providerSignerId: varchar("providerSignerId", { length: 255 }),
  status: signatureStatusEnum("status").default("pending").notNull(),
  signatureName: varchar("signatureName", { length: 255 }),
  signatureImage: text("signatureImage"),
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
  eventId: varchar("eventId", { length: 255 }),
  payload: jsonb("payload").notNull(), // Full JSON payload
  status: webhookStatusEnum("status").default("pending").notNull(),
  errorMessage: text("errorMessage"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => [
  uniqueIndex("webhook_events_event_id_unique").on(table.eventId),
]);

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// AI contract generation history
export const aiGenerations = pgTable("aiGenerations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  contractId: varchar("contractId", { length: 64 }).references(() => contracts.id),
  templateId: varchar("templateId", { length: 64 }).references(() => contractTemplates.id),
  prompt: text("prompt").notNull(),
  generatedContent: text("generatedContent").notNull(),
  model: varchar("model", { length: 50 }).notNull(),
  tokensUsed: integer("tokensUsed"), // was varchar
  status: aiStatusEnum("status").default("completed").notNull(),
  userFeedback: userFeedbackEnum("userFeedback"),
  revisionCount: integer("revisionCount").default(0).notNull(), // was varchar
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AiGeneration = typeof aiGenerations.$inferSelect;
export type InsertAiGeneration = typeof aiGenerations.$inferInsert;

// ===== Party Profiles (for Contract Builder) =====

export const partyTypeEnum = pgEnum("party_type", ["client", "contractor", "individual", "company"]);

export const partyProfiles = pgTable("partyProfiles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  companyNumber: varchar("companyNumber", { length: 20 }),
  address: text("address"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  type: partyTypeEnum("type").default("company").notNull(),
  companiesHouseData: jsonb("companiesHouseData"), // JSON cache of CH response
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PartyProfile = typeof partyProfiles.$inferSelect;
export type InsertPartyProfile = typeof partyProfiles.$inferInsert;

// ===== SquaredNow Dispute System =====

export const mediationRoleEnum = pgEnum("mediation_role", ["claimant", "respondent"]);
export const settlementProposerEnum = pgEnum("settlement_proposer", ["ai", "claimant", "respondent"]);
export const settlementStatusEnum = pgEnum("settlement_status", ["proposed", "accepted", "rejected", "expired"]);
export const confidenceEnum = pgEnum("confidence", ["high", "medium", "low"]);

// AI dispute analyses
export const disputeAnalyses = pgTable("disputeAnalyses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  disputeId: varchar("disputeId", { length: 64 }).notNull().references(() => disputes.id),
  contractSummary: text("contractSummary"),
  claimantPosition: text("claimantPosition"),
  respondentPosition: text("respondentPosition"),
  strengthAssessment: jsonb("strengthAssessment"), // JSON
  relevantClauses: jsonb("relevantClauses"), // JSON array
  recommendedAction: varchar("recommendedAction", { length: 100 }),
  confidence: confidenceEnum("confidence"),
  aiModel: varchar("aiModel", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type DisputeAnalysis = typeof disputeAnalyses.$inferSelect;
export type InsertDisputeAnalysis = typeof disputeAnalyses.$inferInsert;

// Mediation responses (back-and-forth between parties)
export const mediationResponses = pgTable("mediationResponses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  disputeId: varchar("disputeId", { length: 64 }).notNull().references(() => disputes.id),
  responderId: varchar("responderId", { length: 64 }).notNull().references(() => users.id),
  role: mediationRoleEnum("role").notNull(),
  message: text("message").notNull(),
  aiSuggestion: text("aiSuggestion"),
  round: integer("round").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type MediationResponse = typeof mediationResponses.$inferSelect;
export type InsertMediationResponse = typeof mediationResponses.$inferInsert;

// Settlement options (proposed by AI or either party)
export const settlementOptions = pgTable("settlementOptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  disputeId: varchar("disputeId", { length: 64 }).notNull().references(() => disputes.id),
  proposedBy: settlementProposerEnum("proposedBy").notNull(),
  description: text("description").notNull(),
  financialTerms: jsonb("financialTerms"), // JSON: {amount, currency, splitPercentage, escrowAction}
  acceptedByClaimant: boolean("acceptedByClaimant").default(false).notNull(),
  acceptedByRespondent: boolean("acceptedByRespondent").default(false).notNull(),
  status: settlementStatusEnum("status").default("proposed").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type SettlementOption = typeof settlementOptions.$inferSelect;
export type InsertSettlementOption = typeof settlementOptions.$inferInsert;
