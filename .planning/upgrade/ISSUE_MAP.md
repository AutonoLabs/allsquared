# AllSquared Linear Issue Map

This file groups the current Linear backlog into implementation clusters and points each cluster at the main code areas it will touch.

## Status Snapshot

- Done: `LAB-12`
- Open urgent: `LAB-13` to `LAB-17`
- Open high: `LAB-18` to `LAB-27`
- Open medium: `LAB-28` to `LAB-46`, `LAB-54`, `LAB-55`, `LAB-59`, `LAB-62`
- Open low: `LAB-47` to `LAB-53`, `LAB-56` to `LAB-58`, `LAB-60`, `LAB-61`

## Cluster 1 - Auth, Roles, and Access Control

Issues:

- `LAB-13` protect `syncClerkUser`
- `LAB-14` admin-only refund processing
- `LAB-18` notification ownership check
- `LAB-27` file access control
- `LAB-57` confirm file delete permission model
- `LAB-59` first-user admin race
- `LAB-62` integration coverage for these paths

Primary files:

- `server/routers.ts`
- `server/routers/escrow.ts`
- `server/routers/notifications.ts`
- `server/routers/files.ts`
- `server/_core/clerk.ts`
- `server/db.ts`
- `drizzle/schema.ts`

## Cluster 2 - Webhooks, Payments, and Escrow Safety

Issues:

- `LAB-15` webhook signature verification
- `LAB-29` transactional payment mutations
- `LAB-30` connection pooling
- `LAB-31` Stripe SDK migration
- `LAB-55` distributed AI rate limiting if shared infra is introduced
- `LAB-58` refund error code correctness

Primary files:

- `server/_core/index.ts`
- `server/routers/payments.ts`
- `server/routers/escrow.ts`
- `server/lib/transpact-client.ts`
- `server/db.ts`

## Cluster 3 - Runtime Security and Production Hygiene

Issues:

- `LAB-16` env validation and secret fallback removal
- `LAB-17` hide stack traces in production
- `LAB-23` upgrade vulnerable dependencies
- `LAB-34` redact PII from production logs
- `LAB-45` tighten CSP
- `LAB-54` dynamic nonce strategy on Vercel

Primary files:

- `server/_core/env.ts`
- `server/_core/index.ts`
- `server/_core/context.ts`
- `server/_core/clerk.ts`
- `client/src/components/ErrorBoundary.tsx`
- `vercel.json`
- `package.json`

## Cluster 4 - Contract and AI Domain Logic

Issues:

- `LAB-19` contract state machine
- `LAB-20` server-side pagination
- `LAB-21` sanitize generated HTML
- `LAB-22` AI endpoint rate limiting
- `LAB-28` `TRPCError` consistency
- `LAB-33` ID generation
- `LAB-56` rate limiter cleanup
- `LAB-60` shared contract filter builder
- `LAB-61` remove pagination `as any` casts

Primary files:

- `server/routers/contracts.ts`
- `server/routers/signatures.ts`
- `server/routers/ai.ts`
- `server/routers/templateBuilder.ts`
- `server/db.ts`
- `shared/types.ts`

## Cluster 5 - Schema and Data Model Hardening

Issues:

- `LAB-24` foreign keys
- `LAB-25` unique constraints
- `LAB-41` boolean types
- `LAB-42` `jsonb` types
- `LAB-43` numeric types
- `LAB-53` Drizzle relations

Primary files:

- `drizzle/schema.ts`
- `drizzle/relations.ts`
- `drizzle/*.sql`
- `server/db.ts`

Notes:

- This cluster should follow the contract/payment safety fixes because it can be migration-heavy.
- It may need staged migrations instead of one large schema rewrite.

## Cluster 6 - Frontend Structure, A11y, and UX Consistency

Issues:

- `LAB-35` split `NewContractBuilder`
- `LAB-36` shared `StatusBadge`
- `LAB-38` accessibility fixes
- `LAB-39` notification polling or subscription
- `LAB-40` cookie policy page
- `LAB-50` route-based Suspense boundaries
- `LAB-51` replace hardcoded colors

Primary files:

- `client/src/pages/NewContractBuilder.tsx`
- `client/src/pages/Dashboard.tsx`
- `client/src/pages/Contracts.tsx`
- `client/src/pages/ContractDetail.tsx`
- `client/src/components/NotificationCenter.tsx`
- `client/src/components/DashboardLayout.tsx`
- `client/src/components/Header.tsx`
- `client/src/pages/Privacy.tsx`
- `client/src/pages/Terms.tsx`

## Cluster 7 - Tooling, Docs, and Repo Cleanup

Issues:

- `LAB-26` package cleanup
- `LAB-44` deployment doc consolidation
- `LAB-46` ESLint
- `LAB-47` nested directory cleanup
- `LAB-48` storage strategy clarification
- `LAB-52` GitHub Actions CI

Primary files:

- `package.json`
- root deployment docs
- `docs/planning/*`
- `.github/workflows/*`
- storage integration files:
  - `server/firebase.ts`
  - `server/r2.ts`
  - `server/routers/files.ts`

## Cluster 8 - Tests and Enforcement

Issues:

- `LAB-62` integration coverage for critical code paths

Recommended first test targets:

1. `syncClerkUser` identity verification
2. refund authorization
3. webhook signature verification
4. notification ownership
5. file access control
6. contract state machine
7. AI rate limiting

Likely files:

- `vitest` config if needed
- new tests under `server/` or `tests/`

## Brand-System Work Not Fully Captured In Linear

The Linear backlog covers many frontend cleanup items, but it does not fully express the public-site redesign requested for this upgrade.

That redesign should be tracked as an additional workstream with these code areas:

- `client/src/index.css`
- `client/src/styles/md3-theme.css`
- `client/src/components/md3/*`
- `client/src/components/Header.tsx`
- `client/src/components/Footer.tsx`
- `client/src/pages/Home.tsx`
- `client/src/pages/HowItWorks.tsx`
- `client/src/pages/Pricing.tsx`
- `client/src/pages/Features.tsx`
- `client/src/pages/About.tsx`
- `client/src/pages/Clients.tsx`
- `client/src/pages/Freelancers.tsx`

## Recommended Sequencing

1. Cluster 1
2. Cluster 2
3. Cluster 3
4. Cluster 4
5. Cluster 5
6. Brand-system foundation
7. Cluster 6
8. Cluster 7
9. Cluster 8
