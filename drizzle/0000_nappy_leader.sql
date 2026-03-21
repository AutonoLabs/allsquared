CREATE TYPE "public"."address_verified" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."ai_status" AS ENUM('completed', 'failed', 'revised');--> statement-breakpoint
CREATE TYPE "public"."cancel_at_period_end" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('freelance', 'home_improvement', 'event_services', 'trade_services', 'other');--> statement-breakpoint
CREATE TYPE "public"."confidence" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('draft', 'pending_signature', 'active', 'completed', 'disputed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."dispute_status" AS ENUM('open', 'under_review', 'resolved', 'escalated', 'closed');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('contract', 'milestone', 'dispute', 'profile', 'verification');--> statement-breakpoint
CREATE TYPE "public"."escrow_status" AS ENUM('pending', 'held', 'released', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."is_active" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."is_read" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."kyc_provider" AS ENUM('stripe_identity', 'onfido', 'manual');--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'processing', 'verified', 'failed', 'expired', 'requires_input');--> statement-breakpoint
CREATE TYPE "public"."litl_request_type" AS ENUM('contract_review', 'legal_advice', 'custom_contract', 'dispute_assistance');--> statement-breakpoint
CREATE TYPE "public"."litl_status" AS ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."mediation_role" AS ENUM('claimant', 'respondent');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('contract', 'milestone', 'payment', 'dispute', 'system');--> statement-breakpoint
CREATE TYPE "public"."party_type" AS ENUM('client', 'contractor', 'individual', 'company');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('subscription', 'escrow_deposit', 'escrow_release', 'escrow_refund', 'platform_fee', 'litl_fee');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."settlement_proposer" AS ENUM('ai', 'claimant', 'respondent');--> statement-breakpoint
CREATE TYPE "public"."settlement_status" AS ENUM('proposed', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."signature_provider" AS ENUM('docuseal', 'docusign', 'signwell', 'internal');--> statement-breakpoint
CREATE TYPE "public"."signature_status" AS ENUM('pending', 'sent', 'viewed', 'signed', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'past_due', 'cancelled', 'paused', 'trialing');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'starter', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."user_feedback" AS ENUM('positive', 'negative', 'neutral');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('provider', 'client', 'both');--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('identity', 'address', 'business');--> statement-breakpoint
CREATE TYPE "public"."verified" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."webhook_provider" AS ENUM('stripe', 'docusign', 'transpact', 'signwell');--> statement-breakpoint
CREATE TYPE "public"."webhook_status" AS ENUM('pending', 'processing', 'processed', 'failed');--> statement-breakpoint
CREATE TABLE "aiGenerations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"contractId" varchar(64),
	"templateId" varchar(64),
	"prompt" text NOT NULL,
	"generatedContent" text NOT NULL,
	"model" varchar(50) NOT NULL,
	"tokensUsed" varchar(20),
	"status" "ai_status" DEFAULT 'completed' NOT NULL,
	"userFeedback" "user_feedback",
	"revisionCount" varchar(5) DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "auditLogs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64),
	"action" varchar(100) NOT NULL,
	"entityType" varchar(50) NOT NULL,
	"entityId" varchar(64),
	"previousValue" text,
	"newValue" text,
	"ipAddress" varchar(45),
	"userAgent" text,
	"metadata" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contractTemplates" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "category" NOT NULL,
	"description" text,
	"templateContent" text NOT NULL,
	"isActive" "is_active" DEFAULT 'yes' NOT NULL,
	"variables" text,
	"clauseBanks" text,
	"templateMarkdown" text,
	"templateSlug" varchar(100),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"templateId" varchar(64),
	"clientId" varchar(64) NOT NULL,
	"providerId" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" "category" NOT NULL,
	"totalAmount" varchar(20) NOT NULL,
	"currency" varchar(3) DEFAULT 'GBP' NOT NULL,
	"status" "contract_status" DEFAULT 'draft' NOT NULL,
	"contractContent" text NOT NULL,
	"selectedClauses" text,
	"filledVariables" text,
	"generatedMarkdown" text,
	"partyAId" varchar(64),
	"partyBId" varchar(64),
	"clientSignedAt" timestamp,
	"providerSignedAt" timestamp,
	"startDate" timestamp,
	"endDate" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "disputeAnalyses" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"disputeId" varchar(64) NOT NULL,
	"contractSummary" text,
	"claimantPosition" text,
	"respondentPosition" text,
	"strengthAssessment" text,
	"relevantClauses" text,
	"recommendedAction" varchar(100),
	"confidence" "confidence",
	"aiModel" varchar(50),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"contractId" varchar(64) NOT NULL,
	"milestoneId" varchar(64),
	"raisedBy" varchar(64) NOT NULL,
	"reason" text NOT NULL,
	"evidence" text,
	"status" "dispute_status" DEFAULT 'open' NOT NULL,
	"resolution" text,
	"resolvedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "escrowTransactions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"contractId" varchar(64) NOT NULL,
	"milestoneId" varchar(64),
	"amount" varchar(20) NOT NULL,
	"currency" varchar(3) DEFAULT 'GBP' NOT NULL,
	"status" "escrow_status" DEFAULT 'pending' NOT NULL,
	"escrowProvider" varchar(100),
	"escrowReference" varchar(255),
	"depositedAt" timestamp,
	"releasedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fileAttachments" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"entityType" "entity_type" NOT NULL,
	"entityId" varchar(64) NOT NULL,
	"uploadedBy" varchar(64) NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"fileSize" varchar(20) NOT NULL,
	"fileType" varchar(100),
	"fileUrl" varchar(500) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kycVerifications" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"status" "kyc_status" DEFAULT 'pending' NOT NULL,
	"provider" "kyc_provider" NOT NULL,
	"providerVerificationId" varchar(255),
	"verificationType" "verification_type" DEFAULT 'identity' NOT NULL,
	"documentType" varchar(50),
	"firstName" varchar(255),
	"lastName" varchar(255),
	"dateOfBirth" varchar(10),
	"addressVerified" "address_verified" DEFAULT 'no' NOT NULL,
	"riskScore" varchar(10),
	"failureReason" text,
	"metadata" text,
	"expiresAt" timestamp,
	"verifiedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "litlReferrals" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"contractId" varchar(64),
	"requestType" "litl_request_type" NOT NULL,
	"description" text,
	"status" "litl_status" DEFAULT 'pending' NOT NULL,
	"lawyerName" varchar(255),
	"callScheduledAt" timestamp,
	"completedAt" timestamp,
	"fee" varchar(20),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mediationResponses" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"disputeId" varchar(64) NOT NULL,
	"responderId" varchar(64) NOT NULL,
	"role" "mediation_role" NOT NULL,
	"message" text NOT NULL,
	"aiSuggestion" text,
	"round" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"contractId" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"amount" varchar(20) NOT NULL,
	"order" varchar(10) NOT NULL,
	"status" "milestone_status" DEFAULT 'pending' NOT NULL,
	"deliverables" text,
	"submissionNotes" text,
	"approvalNotes" text,
	"dueDate" timestamp,
	"submittedAt" timestamp,
	"completedAt" timestamp,
	"approvedAt" timestamp,
	"paidAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"isRead" "is_read" DEFAULT 'no' NOT NULL,
	"relatedId" varchar(64),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partyProfiles" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"companyNumber" varchar(20),
	"address" text,
	"email" varchar(320),
	"phone" varchar(20),
	"type" "party_type" DEFAULT 'company' NOT NULL,
	"companiesHouseData" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"contractId" varchar(64),
	"milestoneId" varchar(64),
	"subscriptionId" varchar(64),
	"type" "payment_type" NOT NULL,
	"amount" varchar(20) NOT NULL,
	"currency" varchar(3) DEFAULT 'GBP' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"stripePaymentIntentId" varchar(255),
	"stripeChargeId" varchar(255),
	"stripeTransferId" varchar(255),
	"description" text,
	"metadata" text,
	"failureReason" text,
	"processedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settlementOptions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"disputeId" varchar(64) NOT NULL,
	"proposedBy" "settlement_proposer" NOT NULL,
	"description" text NOT NULL,
	"financialTerms" text,
	"acceptedByClaimant" boolean DEFAULT false NOT NULL,
	"acceptedByRespondent" boolean DEFAULT false NOT NULL,
	"status" "settlement_status" DEFAULT 'proposed' NOT NULL,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "signatures" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"contractId" varchar(64) NOT NULL,
	"userId" varchar(64) NOT NULL,
	"provider" "signature_provider" DEFAULT 'internal' NOT NULL,
	"providerEnvelopeId" varchar(255),
	"providerSignerId" varchar(255),
	"status" "signature_status" DEFAULT 'pending' NOT NULL,
	"signatureName" varchar(255),
	"signatureImage" text,
	"ipAddress" varchar(45),
	"userAgent" text,
	"signedAt" timestamp,
	"sentAt" timestamp,
	"viewedAt" timestamp,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"stripeSubscriptionId" varchar(255),
	"stripePriceId" varchar(255),
	"currentPeriodStart" timestamp,
	"currentPeriodEnd" timestamp,
	"cancelAtPeriodEnd" "cancel_at_period_end" DEFAULT 'no' NOT NULL,
	"trialEndsAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"clerkId" varchar(64),
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"userType" "user_type",
	"businessName" varchar(255),
	"phone" varchar(20),
	"address" text,
	"profilePhoto" varchar(500),
	"verified" "verified" DEFAULT 'no' NOT NULL,
	"verificationToken" varchar(255),
	"companyNumber" varchar(20),
	"vatNumber" varchar(20),
	"stripeCustomerId" varchar(255),
	"stripeConnectedAccountId" varchar(255),
	"createdAt" timestamp DEFAULT now(),
	"lastSignedIn" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhookEvents" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"provider" "webhook_provider" NOT NULL,
	"eventType" varchar(100) NOT NULL,
	"eventId" varchar(255),
	"payload" text NOT NULL,
	"status" "webhook_status" DEFAULT 'pending' NOT NULL,
	"errorMessage" text,
	"processedAt" timestamp,
	"createdAt" timestamp DEFAULT now()
);
