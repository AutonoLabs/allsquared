CREATE TABLE `contractTemplates` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('freelance','home_improvement','event_services','trade_services','other') NOT NULL,
	`description` text,
	`templateContent` text NOT NULL,
	`isActive` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `contractTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` varchar(64) NOT NULL,
	`templateId` varchar(64),
	`clientId` varchar(64) NOT NULL,
	`providerId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('freelance','home_improvement','event_services','trade_services','other') NOT NULL,
	`totalAmount` varchar(20) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GBP',
	`status` enum('draft','pending_signature','active','completed','disputed','cancelled') NOT NULL DEFAULT 'draft',
	`contractContent` text NOT NULL,
	`clientSignedAt` timestamp,
	`providerSignedAt` timestamp,
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disputes` (
	`id` varchar(64) NOT NULL,
	`contractId` varchar(64) NOT NULL,
	`milestoneId` varchar(64),
	`raisedBy` varchar(64) NOT NULL,
	`reason` text NOT NULL,
	`status` enum('open','under_review','resolved','escalated','closed') NOT NULL DEFAULT 'open',
	`resolution` text,
	`resolvedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `disputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `escrowTransactions` (
	`id` varchar(64) NOT NULL,
	`contractId` varchar(64) NOT NULL,
	`milestoneId` varchar(64),
	`amount` varchar(20) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GBP',
	`status` enum('pending','held','released','refunded','cancelled') NOT NULL DEFAULT 'pending',
	`escrowProvider` varchar(100),
	`escrowReference` varchar(255),
	`depositedAt` timestamp,
	`releasedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `escrowTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `litlReferrals` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`contractId` varchar(64),
	`requestType` enum('contract_review','legal_advice','custom_contract','dispute_assistance') NOT NULL,
	`description` text,
	`status` enum('pending','assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`lawyerName` varchar(255),
	`callScheduledAt` timestamp,
	`completedAt` timestamp,
	`fee` varchar(20),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `litlReferrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` varchar(64) NOT NULL,
	`contractId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`amount` varchar(20) NOT NULL,
	`order` varchar(10) NOT NULL,
	`status` enum('pending','in_progress','submitted','approved','rejected','paid') NOT NULL DEFAULT 'pending',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`approvedAt` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('contract','milestone','payment','dispute','system') NOT NULL,
	`isRead` enum('yes','no') NOT NULL DEFAULT 'no',
	`relatedId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
