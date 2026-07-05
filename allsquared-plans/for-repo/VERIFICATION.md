# VERIFICATION.md — Codebase Audit vs. REQUIREMENTS.md (UK Adjudication Pivot)

> Audit of `/Users/elibernstein/Code/allsquared-app/ARCHIVE/app/` (archived, content unchanged — a
> Vite + Express + Drizzle + Postgres app, formerly the "AllSquared" UK freelance-contracts /
> e-signature / escrow platform) against the new v1 requirements (R1–R18) for the AI-powered UK
> construction-payment/adjudication pivot. Performed per the "Audit procedure" in REQUIREMENTS.md.

## 1. Tree + dependency scan

Top-level: `client/`, `server/` (`_core/`, `lib/`, `prompts/`, `routers/`), `shared/`, `api/`,
`drizzle/`, `templates/`, `legal/`, `docs/`, `patches/`.

**Stack confirmed:** Vite 4 + React 19 + wouter (client), Express 5 + tRPC 11 (server),
Drizzle ORM 0.45 + `pg` driver + Postgres (`drizzle/schema.ts`, `drizzle/relations.ts`,
`drizzle/0000_nappy_leader.sql`, `drizzle/0001_condemned_sunfire.sql`), Zod validation,
Radix/shadcn UI component set, Tailwind 4.

**Auth:** `@clerk/backend` + `@clerk/react` (`package.json:24-25`), wired via
`client/src/lib/clerk.tsx`, `client/src/hooks/useAuth.ts`, `client/src/pages/Auth.tsx`, with a
`clerkId` column and unique index on `users` (`drizzle/schema.ts:139,158`).

**Payments:** `stripe` SDK (`package.json`, `server/routers/payments.ts:7,18-25`) — subscription
tiers priced in pence/GBP (`server/routers/payments.ts:10-15`: free/starter £15/pro £35/enterprise
£99), plus a `platformFees`/`escrowFees` module and a second escrow rail, **Transpact** (UK
FCA-authorised escrow — `.env.example:41-43`, `drizzle/schema.ts` `webhookProviderEnum` includes
`"transpact"` at line 122).

**Other integrations:** `@aws-sdk/client-s3` (file storage) and Firebase Admin
(`server/firebase.ts`) both present for file uploads (redundant — two storage backends
configured); `openai` (`package.json`) for LLM drafting/chat (see R4/R5/R11 below); Companies
House UK company lookup (`server/routers/companiesHouse.ts`); Sentry, Sanity CMS, Upstash Redis
rate-limiting.

**Date/calendar libraries:** only `date-fns` (generic date formatting), used in
`client/src/components/NotificationCenter.tsx`, `client/src/components/MilestoneManager.tsx`,
`client/src/pages/ComponentShowcase.tsx` — display formatting only. **No business-day, bank-holiday,
or timezone library or logic exists anywhere** (`grep -rni "bank.holiday|business.day|Europe/London|timezone"`
across `server/`, `shared/`, `client/src` returns zero hits for any calendar logic; the only
"business days" hits are plain-English strings inside notification copy, e.g.
`server/routers/escrow.ts:370,552`, `client/src/pages/Complaints.tsx:42`).

**Secrets scan:** No committed secrets found. Only `.env.example` is tracked in git
(`git ls-files | grep -i "\.env"` → `.env.example` only); all values in it are placeholders
(`sk_test_...`, `sk-...`, blank strings) — see `/Users/elibernstein/Code/allsquared-app/ARCHIVE/app/.env.example`.
A repo-wide grep for live-looking key patterns (`sk_live_`, `sk_test_[0-9A-Za-z]{10,}`, `pk_live_`,
`AKIA[A-Z0-9]{16}`, `whsec_[0-9A-Za-z]{10,}`, `-----BEGIN`) across all `.ts`/`.tsx`/`.json`/`.env*`
files returned no matches outside the example file. One notable but non-secret data point:
`.env.example:26` sets `ADMIN_EMAILS=eli@bernstein.com.au` as a default/example value (personal
email as a config default, not a credential — worth scrubbing before any public repo exposure,
but not a leaked secret).

---

## 2. Per-requirement verdicts

| R# | Status | File paths | Notes |
|----|--------|-----------|-------|
| **R1** — Jurisdiction as first-class module | ❌ absent | `server/routers/ai.ts:16-22` (`LEXAI_JURISDICTION = "England and Wales"`, `JURISDICTION_PREAMBLE`); `client/src/pages/NewContractBuilder.tsx:142` (governing-law **select** dropdown: E&W/Scotland/NI, free-text only, not data-modeled) | "Jurisdiction" exists only as (a) a hardcoded string constant baked into an LLM system prompt as a guardrail for general contract drafting, and (b) a cosmetic UI dropdown whose answer is stored as plain text inside a JSON blob (`filledVariables`). There is no jurisdiction table/module, no jurisdiction-keyed rule dispatch, nothing an adjudication engine could plug into. Not a refactor target — there is nothing to refactor. |
| **R2** — E&W business-day calendar | ❌ absent | n/a — no relevant code | No bank-holiday list, no `Europe/London` timezone handling, no BST-transition logic, no business-day-add function anywhere in `server/`, `shared/`, or `client/src`. Only generic `date-fns` display formatting exists (`client/src/components/NotificationCenter.tsx`, `client/src/components/MilestoneManager.tsx`). Must be built from scratch. |
| **R3** — Contract-driven payment terms with Scheme fallback | ❌ absent (not 🔥) | `drizzle/schema.ts:187-216` (`contracts` table: `totalAmount`, `currency`, `startDate`/`endDate` only — no due-date/payment-notice/pay-less-notice fields); `server/routers/ai.ts:718,725` (LLM-generated free-text clauses: "14 days' written notice", "uncured for 7 days" — plain contract boilerplate, not enforced logic) | No day-count constants tied to statutory notice periods exist anywhere (`grep` for 5/7/10/14/21/28-day patterns near notice/deadline/payment terms turns up only free-text LLM contract-clause output and a 7-day dispute-settlement-offer expiry in `server/routers/disputes.ts:340,722`, unrelated to Construction Act notices). Crucially: **the code does not hardcode AU SOPA statutory-maximum dates either** — it simply has no adjudication payment-cycle concept at all. This is a genuine absence, not a contradiction: the "load-bearing wall" question (R1–R3) resolves to **no wall exists yet**, which is actually the best-case finding — Phase 02 is new construction, not an un-refactor of AU-specific logic. |
| **R4** — Deterministic notice-validity rule engine | ❌ absent | `grep -rniE "validity|eligib|assess|rule|engine|notice|deadline|scheme"` across `server/`, `shared/` → only UI copy ("legalValidity" labels, `server/routers/signatures.ts:194-208`), a template field named `NOTICE_PERIOD` (`server/seed-templates.ts:68`), and an LLM-authored JSON key `strengthAssessment` (`server/routers/disputes.ts:35,56,69,125,137`) | The only "assessment" in the codebase is text the LLM itself produces (see R11) — there is no code that computes notice validity or a payment-cycle date deterministically. |
| **R5** — Human-review gate on every assessment | 🔥 contradicted | `server/routers/disputes.ts:45-144` (`analyzeDisputeWithAI`), `server/routers/disputes.ts:296-343` (dispute auto-transitions `open → under_review` on AI completion; when `recommendedAction === 'settlement'` the code auto-inserts a concrete `settlementOptions` row with `proposedBy: 'ai'` and real financial terms, no approval step in between) | This is the sharpest contradiction in the repo: an LLM call directly produces a `recommendedAction`/`confidence`, and the code **acts on it automatically** — creating and surfacing a financial settlement proposal to both parties with zero human-review gate and no feature flag controlling that gate. The new product's core safety requirement (no assessment reaches a client without a human review step) is actively violated by the existing dispute-mediation feature, not merely unimplemented. |
| **R6** — Scope screening (s105/s106 exclusions) | ❌ absent | `templates/construction.md` (generic homeowner "Construction Services Agreement" under category `home_improvement`, `server/routers/ai.ts` category enum `freelance/home_improvement/event_services/trade_services/other`) | No excluded-operations or residential-occupier screening exists; `construction.md` is itself a residential home-improvement consumer template — the polar opposite of what R6 requires (screening residential-occupier contracts *out*). |
| **R7** — Deadline tracker with email/SMS alerts | ❌ absent | `server/routers/notifications.ts` (58 lines: `list`, `markAsRead`, `markAllAsRead` only — pull API, no scheduling); `package.json` (no Twilio/SMS dependency; no SendGrid/Resend/Postmark/Nodemailer) | No cron/scheduled-task infrastructure exists anywhere (`grep` for cron/setInterval/setTimeout/scheduler/bullmq in `server/` — zero hits besides unrelated fee "schedule" strings, e.g. `server/_core/escrowFees.ts:4`). Full greenfield build required, including choosing an alerting channel from scratch. |
| **R8** — Adjudication document generation (chasers, notice of adjudication, referral, ANB forms) | ❌ absent | `templates/` (root): `freelance.md`, `master-services-agreement-uk.md`, `freelancer-contractor-agreement-uk.md`, `software-development-agreement-uk.md`, `escrow-annexure-uk.md`, `trade_services.md`, `event_services.md`, `construction.md`; `legal/` (root): ToS/Privacy/DPA/ADR-procedure docs and duplicated numbered/unnumbered copies of the same templates | Existing templates are 100% freelance-contract / platform-legal documents. Zero adjudication document types (no notice of adjudication, referral notice, service cover letter, or ANB application form for RICS/CIArb/TeCSA/UK Adjudicators). The *pattern* of Markdown template + variable-fill + versioned slug (`drizzle/schema.ts:166-181`, `contractTemplates.templateSlug`) is reusable scaffolding, but every template's content is dead weight. |
| **R9** — Evidence bundle builder (paginated indexed PDF) | ❌ absent | `package.json` (no PDF library of any kind — `grep -niE "pdf"` returns zero hits) | Nothing to build on; needs a PDF generation library added and a bundling/indexing feature built from scratch. |
| **R10** — Litigation-grade immutable audit trail | ⚠ partial | `drizzle/schema.ts:376-394` (`auditLogs` table: action/entityType/entityId/previousValue/newValue/ipAddress/userAgent/metadata); usage sites `server/routers/disputes.ts:302-311,847-856,949-958` | A basic append-style audit-log table and pattern exist and are actively used for discrete events (dispute filed/resolved/escalated). This is a reasonable starting schema shape, but it is not immutable (no hash-chaining, no WORM storage, no cryptographic tamper-evidence) and does not track "generated → approved → served" document lifecycle events, which R10 specifically requires given service-evidence is outcome-determinative in adjudication. Needs hardening and extension, not a full rebuild. |
| **R11** — Retrieval-grounded drafting LLM, cite-or-silent, reviewer diff view | 🔥 contradicted (drafting parts ⚠ partial) | `server/routers/ai.ts:107-115` (raw `fetch` to OpenAI chat-completions, no RAG/retrieval — falls back to static templates only if no API key, not as a grounding strategy); `server/routers/contractChat.ts:20-55` (`queryOpenAI`, plain Q&A chatbot, no citation constraints); `server/routers/disputes.ts:45-144` (LLM outputs a dispute-outcome recommendation that is auto-acted on, no diff/approval view) | The env file references an external `LEXAI_API_URL` "local legal RAG engine" (`.env.example:22-23`) suggesting a *separate*, not-present-in-this-repo retrieval service was intended for some grounding — but within this repo's own code, all three LLM call sites are un-grounded free-generation with no citation constraints and (in the dispute case) no reviewer diff/approval step before output reaches users. This directly contradicts R11's "cite-or-silent" and "reviewer approval workflow with diff view" requirements, and compounds the R5 finding: an LLM decides a dispute outcome and the code acts on it. |
| **R12** — Multi-entity (AllSquared UK / Autono Legal AU) with separated data/branding/templates, UK/EU residency | ❌ absent | `drizzle/schema.ts:66-72` (`entityTypeEnum` — this is a polymorphic-relation "entity type" tag for audit/notification targets, e.g. `contract`/`milestone`/`dispute`/`profile`/`verification`, **not** a multi-tenant business-entity concept); no `tenantId`/`organizationId` column anywhere in the schema; no region/data-residency config in `server/_core/` | No multi-tenancy exists at all — single-tenant schema, single brand, no data-residency configuration (no AWS/DB region pinning code found in `server/_core/index.ts` or `env.ts`). Would need to be designed and built from the ground up if AllSquared UK and Autono Legal AU are to share an engine with separated data. |
| **R13** — Stripe GBP + VAT + per-SKU incl. micro-SKUs | ⚠ partial | `server/routers/payments.ts:10-15,18-25` (Stripe client, GBP-denominated tiers: free/£15/£35/£99 flat subscription tiers); `drizzle/schema.ts:349-373` (`payments` table has `currency` default `"GBP"`) | Stripe + GBP billing plumbing exists and is reusable (client init, webhook table `drizzle/schema.ts:446-458`, subscription table). But **no VAT handling exists anywhere** (`grep -rni "vat" server shared` returns only a `vatNumber` free-text column on `users`, `drizzle/schema.ts:152` — captured but never used in tax calculation) and pricing is flat monthly-subscription tiers, not the R13 per-SKU/one-off/sub-£100 micro-transaction model the new pricing ladder (free/£29–99/£990–2,490/£3,500+) requires. Needs new SKU-based pricing logic and VAT calculation built on top of the existing Stripe integration. |
| **R14** — Respondent-side subscription (v2) | ❌ absent | n/a — no relevant code | Out of v1 scope; correctly nothing exists. Existing `subscriptionTierEnum`/`subscriptions` table (`drizzle/schema.ts:73-81,332-348`) is generic recurring-billing scaffolding that could be reused for this later. |
| **R15** — Scotland module (v2) | ❌ absent | `client/src/pages/NewContractBuilder.tsx:142` (Scotland appears only as a UI dropdown option, no logic) | v2; nothing to build against yet, consistent with R1's finding that jurisdiction isn't modeled at all. |
| **R16** — True-value adjudication support (v2) | ❌ absent | n/a — no relevant code | v2; no valuation/quantum logic of any kind exists in the repo. |
| **R17** — Xero/QuickBooks integration (v2) | ❌ absent | `client/src/components/Footer.tsx:144-145`, `client/src/components/marketing/homeContent.ts:74,76,264` | All hits are marketing copy citing Xero/QuickBooks *statistics* about late payment, and a marketing bullet "Xero & QuickBooks reconciliation" as an aspirational feature claim — **no actual API integration code exists**. Marketing text overpromises a capability that was never built even for the old product. |
| **R18** — Enforcement handoff workflow (v2) | ❌ absent | n/a — no relevant code | v2; no partner-solicitor handoff, packaging, or referral-tracking exists. The `litlReferrals` table (`drizzle/schema.ts:282-298`, "Lawyer-in-the-Loop") is a superficially similar-shaped referral/status table from the old product that could inspire the data shape but has zero UK-adjudication-specific content. |

---

## 3. Overall recommendation

**Verdict: salvageable as *infrastructure*, not as *domain logic*. This is a "keep the chassis, replace the engine" situation, and the engine is the entire point of the new product.**

### Worth keeping (genuine time savings)
- **Auth**: Clerk integration is complete and generic (`client/src/lib/clerk.tsx`, `client/src/hooks/useAuth.ts`, `drizzle/schema.ts:137-160`) — directly reusable, jurisdiction-agnostic.
- **Payments plumbing**: Stripe client setup, webhook handling table/pattern (`drizzle/schema.ts:446-458`), and platform-fee calculation module (`server/_core/platformFees.ts` referenced from `server/routers/payments.ts:8,29`) are solid scaffolding to build UK-adjudication SKU pricing and VAT on top of — but the actual pricing model (flat subscription tiers) needs replacing per R13.
- **UI component library**: full Radix/shadcn set (`package.json:26-56`) plus an existing admin console (`client/src/pages/admin/*` — Users, Disputes, KYC, Audit Logs, Analytics) — directly reusable shells for the new admin/ops surface.
- **Companies House integration** (`server/routers/companiesHouse.ts`) — UK company-number validation and lookup is exactly as useful for construction-industry claimant/respondent onboarding as it was for freelance clients.
- **Template engine pattern** (Markdown + variable-fill + versioned slug, `drizzle/schema.ts:166-184`, `contractTemplates`) — the *mechanism* for versioned, slug-keyed document templates is reusable; every template's *content* is dead weight (freelance/home-improvement/event-services boilerplate).
- **tRPC + Drizzle + Zod scaffolding** (`server/_core/`, router structure) — solid, modern, type-safe plumbing worth keeping as the app skeleton.
- **Audit log table shape** (`drizzle/schema.ts:376-394`) — a reasonable starting point for R10, needs hardening (immutability) and extension (document lifecycle events), not replacement.

### Dead weight / actively dangerous (must be removed or fully rebuilt)
- **Entire domain schema** (`contracts`, `milestones`, `escrowTransactions`, `disputes`, `litlReferrals`, `partyProfiles`, `disputeAnalyses`, `mediationResponses`, `settlementOptions` — all of `drizzle/schema.ts:186-559`) is freelance-contract/escrow/mediation-specific. None of it models a construction contract, payment cycle, payment notice, pay less notice, adjudication referral, or ANB relationship. This needs a from-scratch schema for the adjudication domain.
- **All templates** in `templates/` and `legal/` (root) — freelance/home-improvement/event-services/trade-services agreements, none are adjudication documents.
- **The AI dispute-mediation feature** (`server/routers/disputes.ts:45-144,296-343`) is not just unhelpful, it is **actively contradictory and should be disabled/removed rather than adapted** — it lets an LLM decide and auto-execute a financial settlement recommendation with no human gate, which is precisely the failure mode the new product's architecture is designed to prevent. This is the single highest-priority "rip it out" item.
- **LLM integration pattern** (`server/routers/ai.ts`, `server/routers/contractChat.ts`) — raw un-grounded OpenAI calls with no retrieval, no citation constraints, no diff/approval UI. The *pattern* (calling OpenAI, category-specific prompts) is a reasonable starting shape for drafting, but must be rebuilt with retrieval-grounding and a mandatory reviewer-diff workflow before it can touch anything UK-adjudication-related.
- **Escrow (Transpact) integration** — out of scope per the new PROJECT.md ("holding client money... trust/escrow of recovered funds" is explicitly out of scope forever); this entire subsystem (`server/routers/escrow.ts`, `escrowTransactions` table, Transpact webhook handling) should be removed, not adapted.
- **Marketing claims** (`client/src/components/Footer.tsx`, `homeContent.ts`) reference Xero/QuickBooks reconciliation and other capabilities that were never actually built — these need to be scrubbed regardless of the pivot, as they were already overstating the old product.

### Bottom line
R1–R3 (the "load-bearing wall") resolve cleanly: **no jurisdiction module and no hardcoded AU/SOPA logic exist — there is simply no adjudication date/jurisdiction logic of any kind.** That is the best possible finding for a pivot: Phase 02 is new construction on a clean slate for the jurisdiction/calendar/payment-terms layer, not an un-refactor of wrong-country logic. The real risk uncovered by this audit is different and more urgent: the **existing AI dispute-mediation feature already violates the new product's core safety principle** (LLM decides + auto-acts on a substantive outcome with no human gate) and must be treated as a "disable immediately, do not port" item alongside the escrow/Transpact subsystem. Auth, payments plumbing, UI components, and the tRPC/Drizzle skeleton are worth keeping; every piece of domain logic, every template, and the AI dispute-resolution pathway need to be replaced.
