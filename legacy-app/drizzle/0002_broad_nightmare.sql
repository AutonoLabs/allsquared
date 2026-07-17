CREATE TABLE "waitlistEntries" (
	"email" varchar(320) PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
