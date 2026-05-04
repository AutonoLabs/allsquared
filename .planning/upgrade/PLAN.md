# AllSquared Upgrade Plan

## Scope

- Target repo: `/Users/elibernstein/Code/allsquared-app-repo`
- Canonical backlog: Linear project `AllSquared - app`
- Canonical production repo: `AutonoLabs/allsquared-app` for both marketing and authenticated app
- Historical brand-reference repo: `AutonoLabs/allsquared-website`
- Current public-page implementation base: `AllSquared.html` from `AutonoLabs/allsquared-website`
- Source fetched from: `https://raw.githubusercontent.com/AutonoLabs/allsquared-website/main/AllSquared.html`
- Live site `https://allsquared.io/` is a production verification target
- Current app stack: React 19, Tailwind 4, Radix/shadcn-style primitives, Express, tRPC, Drizzle, Postgres

## Goal

Upgrade the app in three dimensions without rewriting the stack:

1. Close the open security and correctness backlog.
2. Harden the data, infra, and quality baseline.
3. Replace the current Material 3 visual layer with the `AllSquared.html` brand system.

## Working Principles

- Fix security before broad UI work.
- Recreate `AllSquared.html` as app-native React/Tailwind primitives.
- Keep public marketing, product dashboard, and admin surfaces structurally separate.
- Keep marketing and app in one deployable repo; separate by route and shell, not by repository.
- Share one token system across all surfaces.
- Remove the M3 layer only after the replacement design system is in place.

## Current Code Reality

- Public marketing routes already live separately from `/dashboard/*` and `/admin/*` in `client/src/App.tsx`.
- The current visual foundation is still M3-driven in `client/src/index.css`, `client/src/styles/md3-theme.css`, and `client/src/components/md3/*`.
- The highest-risk verified backend issues sit in:
  - `server/routers.ts`
  - `server/routers/escrow.ts`
  - `server/routers/payments.ts`
  - `server/routers/signatures.ts`
  - `server/routers/files.ts`
  - `server/routers/notifications.ts`
  - `server/_core/env.ts`
  - `server/_core/index.ts`

## Execution Phases

### Phase 0 - Baseline and Decisions

Purpose: establish the upgrade map in the correct repo and lock a few decisions before implementation branches start.

Main outputs:

- Repo-local plan and issue map
- Brand/system structure brief
- Decision log for:
  - storage strategy (`Firebase` vs `R2`/S3 remnants)
  - CSP approach on Vercel
  - production rate limiting strategy
  - dashboard visual adaptation rules vs marketing pages

Exit criteria:

- Every Linear issue is assigned to a workstream.
- The team has a single design-system migration path.

### Phase 1 - Security and Access Control

Purpose: remove the highest-impact risks before deeper refactors.

Primary issues:

- `LAB-13` auth impersonation via `syncClerkUser`
- `LAB-14` missing admin guard on `processRefund`
- `LAB-15` webhook verification gaps
- `LAB-16` env validation and fallback secret failure mode
- `LAB-17` stack trace exposure
- `LAB-18` notification ownership check
- `LAB-21` HTML injection in PDF generation
- `LAB-27` incomplete file access control

Primary files:

- `server/routers.ts`
- `server/routers/escrow.ts`
- `server/routers/payments.ts`
- `server/routers/signatures.ts`
- `server/routers/files.ts`
- `server/routers/notifications.ts`
- `server/_core/env.ts`
- `server/_core/index.ts`
- `client/src/components/ErrorBoundary.tsx`

Exit criteria:

- All public attack surfaces are authenticated or verified.
- Sensitive runtime output is removed in production.
- High-risk access control bugs are covered by tests.

### Phase 2 - Domain Logic and Data Hardening

Purpose: fix incorrect business logic, schema safety, and runtime platform gaps.

Primary issues:

- `LAB-19` contract status state machine
- `LAB-20` server-side pagination
- `LAB-22` AI endpoint rate limiting
- `LAB-23` tRPC upgrade and dependency security sweep
- `LAB-24` foreign keys
- `LAB-25` unique constraints
- `LAB-26` package cleanup
- `LAB-28` `TRPCError` consistency
- `LAB-29` multi-step DB transactions
- `LAB-30` connection pooling for serverless
- `LAB-31` Stripe SDK usage
- `LAB-32` presigned file uploads
- `LAB-33` ID generation standardization
- `LAB-41` boolean migration
- `LAB-42` `jsonb` migration
- `LAB-43` numeric column migration
- `LAB-53` Drizzle relations
- `LAB-55` production rate limiting backend
- `LAB-56` rate limiter memory cleanup
- `LAB-57` file delete permission decision
- `LAB-58` incorrect error code
- `LAB-59` first-user admin race
- `LAB-60` shared filter builder
- `LAB-61` remove `as any` pagination casts

Primary files:

- `server/db.ts`
- `drizzle/schema.ts`
- `drizzle/relations.ts`
- `server/routers/contracts.ts`
- `server/routers/ai.ts`
- `server/routers/payments.ts`
- `server/routers/escrow.ts`
- `server/routers/files.ts`
- `server/_core/context.ts`

Exit criteria:

- Contract and payment flows have safe state transitions.
- Schema reflects actual relational and data-type intent.
- Query and payment paths are production-ready for serverless runtime.

### Phase 3 - Brand System Reset

Purpose: replace the current M3 layer with a reusable design system derived from `AllSquared.html`.

Main tasks:

- Replace M3 tokens in `client/src/index.css`
- Stop using `client/src/styles/md3-theme.css` as the primary theme source
- Introduce shared brand tokens:
  - palette
  - typography
  - spacing rhythm
  - border and shadow rules
  - section numerals and motif usage
- Build new primitives and patterns in:
  - `client/src/components/brand/*`
  - `client/src/components/marketing/*`
  - optional `client/src/components/product/*`

Exit criteria:

- Public and product UIs share one brand token layer.
- New pages can be built without touching the legacy M3 components.

### Phase 4 - Public Marketing Rewrite

Purpose: rebuild the public site around the `AllSquared.html` storytelling and structure.

Primary routes:

- `/`
- `/how-it-works`
- `/features`
- `/pricing`
- `/about`
- `/contact`
- `/freelancers`
- `/clients`
- `/legal-services`
- `/terms`
- `/privacy`
- cookie policy page from `LAB-40`

Structural targets:

- sticky navigation
- long-scroll hero and narrative sections
- proof and trust sections
- comparison matrix
- pricing system
- FAQ
- strong terminal CTA

Exit criteria:

- Public pages visually match the static brand guide.
- Shared marketing sections are componentized rather than page-local.

### Phase 5 - Product and Admin Re-Skin

Purpose: bring the dashboard and admin surfaces into the same brand family without making them feel like marketing pages.

Primary files:

- `client/src/components/Header.tsx`
- `client/src/components/Footer.tsx`
- `client/src/components/DashboardLayout.tsx`
- `client/src/components/AdminLayout.tsx`
- `client/src/pages/*`

Primary issues tied to this phase:

- `LAB-35` decompose `NewContractBuilder`
- `LAB-36` shared `StatusBadge`
- `LAB-38` accessibility gaps
- `LAB-39` notification freshness
- `LAB-50` route-based code splitting boundaries
- `LAB-51` hardcoded color cleanup

Exit criteria:

- The authenticated product feels operational, not promotional.
- Shared product patterns use brand tokens instead of raw hex values or M3 wrappers.

### Phase 6 - Quality, Docs, and Deployment Readiness

Purpose: make the upgraded app maintainable and shippable.

Primary issues:

- `LAB-44` deployment doc consolidation
- `LAB-45` CSP tightening
- `LAB-46` ESLint
- `LAB-47` nested directory cleanup
- `LAB-48` storage strategy cleanup
- `LAB-52` CI/CD workflow
- `LAB-54` dynamic CSP nonce strategy
- `LAB-62` integration tests for critical paths

Exit criteria:

- CI runs type-check, lint, test, and build.
- Deployment docs are consolidated and current.
- Security-sensitive paths have automated coverage.

## Recommended First Implementation Batch

Start with one narrow branch that combines the minimum safety fixes needed before UI work:

1. `LAB-13`
2. `LAB-14`
3. `LAB-15`
4. `LAB-16`
5. `LAB-17`
6. `LAB-18`
7. `LAB-21`
8. `LAB-27`

This batch touches the highest-risk code, creates the first useful test harness, and reduces the chance that the redesign lands on top of insecure behavior.
