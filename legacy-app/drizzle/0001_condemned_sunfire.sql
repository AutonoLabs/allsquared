ALTER TABLE "aiGenerations" ADD CONSTRAINT "aiGenerations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aiGenerations" ADD CONSTRAINT "aiGenerations_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aiGenerations" ADD CONSTRAINT "aiGenerations_templateId_contractTemplates_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."contractTemplates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_templateId_contractTemplates_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."contractTemplates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_clientId_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_milestoneId_milestones_id_fk" FOREIGN KEY ("milestoneId") REFERENCES "public"."milestones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_raisedBy_users_id_fk" FOREIGN KEY ("raisedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrowTransactions" ADD CONSTRAINT "escrowTransactions_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrowTransactions" ADD CONSTRAINT "escrowTransactions_milestoneId_milestones_id_fk" FOREIGN KEY ("milestoneId") REFERENCES "public"."milestones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fileAttachments" ADD CONSTRAINT "fileAttachments_uploadedBy_users_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "litlReferrals" ADD CONSTRAINT "litlReferrals_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "litlReferrals" ADD CONSTRAINT "litlReferrals_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_milestoneId_milestones_id_fk" FOREIGN KEY ("milestoneId") REFERENCES "public"."milestones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_subscriptions_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_contractId_contracts_id_fk" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "auditLogs" USING btree ("entityId","entityType");--> statement-breakpoint
CREATE INDEX "audit_logs_user_idx" ON "auditLogs" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "contract_templates_slug_unique" ON "contractTemplates" USING btree ("templateSlug");--> statement-breakpoint
CREATE INDEX "contracts_client_status_idx" ON "contracts" USING btree ("clientId","status");--> statement-breakpoint
CREATE INDEX "contracts_provider_status_idx" ON "contracts" USING btree ("providerId","status");--> statement-breakpoint
CREATE INDEX "milestones_contract_idx" ON "milestones" USING btree ("contractId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_id_unique" ON "users" USING btree ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_events_provider_event_id_unique" ON "webhookEvents" USING btree ("provider","eventId");