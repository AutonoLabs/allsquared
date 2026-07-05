# AllSquared Implementation Plan

## P1 - Critical (TypeScript errors, security issues, broken functionality)

- [ ] Fix: `.env.production`:1-32 - **LIVE PRODUCTION SECRETS COMMITTED TO GIT** — Clerk secret key, Stripe live keys, database URL, JWT secret, Vercel OIDC token all in version control. Must rotate ALL credentials immediately and remove from git history.
- [ ] Fix: `server/_core/index.ts`:239-252 - Transpact webhook has NO signature verification — reads `x-transpact-signature` but never validates. Attacker can forge webhook events to manipulate escrow state.
- [ ] Fix: `server/_core/index.ts`:254-264 - DocuSign webhook has NO signature verification — accepts any POST body. Attacker can spoof contract signature events.
- [ ] Fix: `server/routers/escrow.ts`:470 - `processRefund` uses `protectedProcedure` instead of `adminProcedure` — any authenticated user can process refunds for any escrow transaction.
- [ ] Fix: `server/_core/env.ts`:56 - Hardcoded cookie secret fallback `"dev-secret-change-in-production"` used if JWT_SECRET is missing. Production silently runs with insecure default.
- [ ] Fix: `vercel.json`:20 - CSP header allows `'unsafe-inline'` and `'unsafe-eval'` in script-src, defeating XSS protection.
- [ ] Fix: `server/routers.ts`:69-85 - Race condition in first-user admin promotion — concurrent requests during initial setup can create multiple admins. Needs atomic check-and-set.
- [ ] Fix: `client/src/App.tsx`:171-210 - Admin routes (`/admin/*`) have no client-side role guard — any authenticated user can navigate directly to admin pages before backend rejects the request.
- [ ] Fix: `server/routers/contracts.ts`:90 - Contract content uses `z.any()` — no structural validation. Allows arbitrary payloads into database.
- [ ] Fix: `drizzle/schema.ts`:392-394 - PII fields (`firstName`, `lastName`, `dateOfBirth`) in KYC verifications stored as plaintext. GDPR compliance risk.

## P2 - Important (UI/UX gaps, missing states, performance)

- [ ] Fix: `drizzle/schema.ts` (multiple) - Missing foreign key constraints across schema — `contracts.clientId`, `milestones.contractId`, `payments.userId` etc. have no FK relationships. Risk of orphaned/inconsistent data.
- [ ] Fix: `drizzle/schema.ts` (multiple) - Missing database indexes on frequently-queried columns: `contracts.clientId`, `contracts.providerId`, `milestones.contractId`, `payments.userId`, `notifications.userId`.
- [ ] Fix: `drizzle/schema.ts`:348,190,216,239 - Financial amounts stored as `varchar` instead of `numeric` — `payments.amount`, `contracts.totalAmount`, `milestones.amount`. Risk of precision loss and string arithmetic bugs.
- [ ] Fix: `drizzle/schema.ts`:141,477 - `email` fields on users/partyProfiles are nullable and have no unique constraint. Allows duplicates and missing emails.
- [ ] Fix: `server/routers/escrow.ts`:107-149 - Escrow creation inserts local DB record then calls Transpact API. If Transpact fails, orphaned record with no rollback.
- [ ] Fix: `server/routers/payments.ts`,`escrow.ts` - Missing idempotency keys for payment/escrow operations. Network retries can create duplicate transactions.
- [ ] Fix: `server/routers/ai.ts`,`disputes.ts`,`signatures.ts` - No timeout on external API calls (OpenAI, LexAI, DocuSeal). Hung requests block indefinitely.
- [ ] Fix: `client/src/pages/admin/AdminAuditLogs.tsx`:274,283,292 - Three `JSON.parse()` calls without try-catch. Page crashes on non-JSON audit log data.
- [ ] Fix: `client/src/pages/Billing.tsx`:104-112 - Upgrade/cancel buttons have no loading/disabled state during mutation. Users can double-click causing duplicate purchases.
- [ ] Fix: `client/src/components/NotificationCenter.tsx`:17-22 - No polling or real-time updates for notifications. User misses time-sensitive contract updates.
- [ ] Fix: `client/src/components/FileUpload.tsx`:82-97 - Progress bar jumps from 0% to 50% then upload completes without reaching 100%. Misleading UX.
- [ ] Fix: `client/src/pages/ContractDetail.tsx`:150-161 - Delete uses `confirm()` dialog, no loading state, no error recovery if deletion fails.
- [ ] Fix: `server/routers/files.ts`:15-40 - File upload only validates MIME type, not file contents (magic bytes). Users can upload disguised malicious files.
- [ ] Fix: `server/routers/templateBuilder.ts`:28-29 - `JSON.parse()` without try-catch on template `variables` and `clauseBanks`. Crashes on corrupted DB data.
- [ ] Fix: `server/routers/admin.ts`:109-152 - Admin `get` endpoint returns full user object including `stripeCustomerId`, `stripeConnectedAccountId`. Internal IDs exposed in API response.

## P3 - Nice to Have (cleanup, dead code, minor improvements)

- [ ] Fix: `drizzle/schema.ts`:217,312,457,460 - Multiple columns use `varchar` for numeric data: `milestone.order`, `fileSize`, `tokensUsed`, `revisionCount`. Should be `integer`.
- [ ] Fix: `drizzle/relations.ts`:1-2 - Relations file exists but is empty. No Drizzle relationship definitions.
- [ ] Fix: `server/_core/clerk.ts`:32 - Logs auth token (first 20 chars) for debugging. Should not log tokens in production.
- [ ] Fix: `client/src/pages/Contact.tsx`:27 - TODO: contact form doesn't submit anywhere. Either implement or remove.
- [ ] Fix: `client/src/pages/Profile.tsx`:215 - TODO: notification preferences toggles don't persist. Implement or remove.
- [ ] Fix: `client/src/pages/Templates.tsx`:196 - TODO: duplicate template button exists but doesn't work. Implement or remove.
- [ ] Fix: `client/src/hooks/useAuth.ts`:27,47,52,61 - Multiple `console.log`/`console.error` debug statements left in production code.
- [ ] Fix: `server/_core/env.ts`:10,34,35 - `CLERK_SECRET_KEY` and `STRIPE_SECRET_KEY` marked optional in schema. Should be required in production.
- [ ] Fix: `vercel.json`:12-18 - Missing `Strict-Transport-Security` header in Vercel config (present in Express middleware but not in static asset responses).
- [ ] Fix: `server/routers/payments.ts`:330 - Amount validation is `z.number().positive()` with no maximum. Allows `Number.MAX_VALUE`.
- [ ] Fix: `server/routers` (multiple) - Inconsistent error messages across routers ("Unauthorized" vs "Not authorized" vs "Only the client can...").
- [ ] Fix: `CLAUDE.md` - Project description references Prisma ORM and `src/` directory structure, but codebase uses Drizzle ORM and `client/`+`server/` layout. Stale documentation.
