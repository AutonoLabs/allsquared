import { relations } from "drizzle-orm";
import {
  users,
  contracts,
  contractTemplates,
  milestones,
  escrowTransactions,
  disputes,
  litlReferrals,
  notifications,
  fileAttachments,
  subscriptions,
  payments,
  auditLogs,
  kycVerifications,
  signatures,
  webhookEvents,
  aiGenerations,
  partyProfiles,
  disputeAnalyses,
  mediationResponses,
  settlementOptions,
} from "./schema";

// ---- User relations ----
export const usersRelations = relations(users, ({ many }) => ({
  clientContracts: many(contracts, { relationName: "clientContracts" }),
  providerContracts: many(contracts, { relationName: "providerContracts" }),
  notifications: many(notifications),
  subscriptions: many(subscriptions),
  payments: many(payments),
  auditLogs: many(auditLogs),
  kycVerifications: many(kycVerifications),
  signatures: many(signatures),
  aiGenerations: many(aiGenerations),
  litlReferrals: many(litlReferrals),
  partyProfiles: many(partyProfiles),
  fileAttachments: many(fileAttachments),
  disputesRaised: many(disputes),
  mediationResponses: many(mediationResponses),
}));

// ---- Contract Template relations ----
export const contractTemplatesRelations = relations(contractTemplates, ({ many }) => ({
  contracts: many(contracts),
  aiGenerations: many(aiGenerations),
}));

// ---- Contract relations ----
export const contractsRelations = relations(contracts, ({ one, many }) => ({
  template: one(contractTemplates, {
    fields: [contracts.templateId],
    references: [contractTemplates.id],
  }),
  client: one(users, {
    fields: [contracts.clientId],
    references: [users.id],
    relationName: "clientContracts",
  }),
  provider: one(users, {
    fields: [contracts.providerId],
    references: [users.id],
    relationName: "providerContracts",
  }),
  partyA: one(users, {
    fields: [contracts.partyAId],
    references: [users.id],
    relationName: "partyAContracts",
  }),
  partyB: one(users, {
    fields: [contracts.partyBId],
    references: [users.id],
    relationName: "partyBContracts",
  }),
  milestones: many(milestones),
  escrowTransactions: many(escrowTransactions),
  disputes: many(disputes),
  signatures: many(signatures),
  payments: many(payments),
  litlReferrals: many(litlReferrals),
  aiGenerations: many(aiGenerations),
}));

// ---- Milestone relations ----
export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [milestones.contractId],
    references: [contracts.id],
  }),
  escrowTransactions: many(escrowTransactions),
  payments: many(payments),
}));

// ---- Escrow Transaction relations ----
export const escrowTransactionsRelations = relations(escrowTransactions, ({ one }) => ({
  contract: one(contracts, {
    fields: [escrowTransactions.contractId],
    references: [contracts.id],
  }),
  milestone: one(milestones, {
    fields: [escrowTransactions.milestoneId],
    references: [milestones.id],
  }),
}));

// ---- Dispute relations ----
export const disputesRelations = relations(disputes, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [disputes.contractId],
    references: [contracts.id],
  }),
  milestone: one(milestones, {
    fields: [disputes.milestoneId],
    references: [milestones.id],
  }),
  raisedByUser: one(users, {
    fields: [disputes.raisedBy],
    references: [users.id],
  }),
  analyses: many(disputeAnalyses),
  mediationResponses: many(mediationResponses),
  settlementOptions: many(settlementOptions),
}));

// ---- LITL Referral relations ----
export const litlReferralsRelations = relations(litlReferrals, ({ one }) => ({
  user: one(users, {
    fields: [litlReferrals.userId],
    references: [users.id],
  }),
  contract: one(contracts, {
    fields: [litlReferrals.contractId],
    references: [contracts.id],
  }),
}));

// ---- Notification relations ----
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ---- File Attachment relations ----
export const fileAttachmentsRelations = relations(fileAttachments, ({ one }) => ({
  uploader: one(users, {
    fields: [fileAttachments.uploadedBy],
    references: [users.id],
  }),
}));

// ---- Subscription relations ----
export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  payments: many(payments),
}));

// ---- Payment relations ----
export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  contract: one(contracts, {
    fields: [payments.contractId],
    references: [contracts.id],
  }),
  milestone: one(milestones, {
    fields: [payments.milestoneId],
    references: [milestones.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// ---- Audit Log relations ----
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// ---- KYC Verification relations ----
export const kycVerificationsRelations = relations(kycVerifications, ({ one }) => ({
  user: one(users, {
    fields: [kycVerifications.userId],
    references: [users.id],
  }),
}));

// ---- Signature relations ----
export const signaturesRelations = relations(signatures, ({ one }) => ({
  contract: one(contracts, {
    fields: [signatures.contractId],
    references: [contracts.id],
  }),
  user: one(users, {
    fields: [signatures.userId],
    references: [users.id],
  }),
}));

// ---- AI Generation relations ----
export const aiGenerationsRelations = relations(aiGenerations, ({ one }) => ({
  user: one(users, {
    fields: [aiGenerations.userId],
    references: [users.id],
  }),
  contract: one(contracts, {
    fields: [aiGenerations.contractId],
    references: [contracts.id],
  }),
  template: one(contractTemplates, {
    fields: [aiGenerations.templateId],
    references: [contractTemplates.id],
  }),
}));

// ---- Party Profile relations ----
export const partyProfilesRelations = relations(partyProfiles, ({ one }) => ({
  user: one(users, {
    fields: [partyProfiles.userId],
    references: [users.id],
  }),
}));

// ---- Dispute Analysis relations ----
export const disputeAnalysesRelations = relations(disputeAnalyses, ({ one }) => ({
  dispute: one(disputes, {
    fields: [disputeAnalyses.disputeId],
    references: [disputes.id],
  }),
}));

// ---- Mediation Response relations ----
export const mediationResponsesRelations = relations(mediationResponses, ({ one }) => ({
  dispute: one(disputes, {
    fields: [mediationResponses.disputeId],
    references: [disputes.id],
  }),
  responder: one(users, {
    fields: [mediationResponses.responderId],
    references: [users.id],
  }),
}));

// ---- Settlement Option relations ----
export const settlementOptionsRelations = relations(settlementOptions, ({ one }) => ({
  dispute: one(disputes, {
    fields: [settlementOptions.disputeId],
    references: [disputes.id],
  }),
}));
