# Sprint Brief: AllSquared
**Date:** 2026-02-10
**Sprint Lead:** Claudia (Orchestrator)
**Sprint Type:** 🔍 REVIEW SPRINT (Not greenfield build)
**Status:** 🟢 Phase 0 — Complete

---

## The Idea
AI-powered contract management platform combining contract generation, FCA-backed escrow, and milestone payments for UK freelancers and contractors. This is a **REVIEW** sprint assessing the existing V1 product and identifying V2 priorities.

## The Problem  
The £30B UK freelance market faces three critical pain points:
1. **Payment risk** - 67% of freelancers experience late or non-payment
2. **Scope creep** - 43% face deliverable disputes without clear contracts
3. **Fragmented solutions** - Existing tools require 3-4 separate services (contracts, payments, escrow, legal)

Current solutions are either US-focused (HoneyBook, Bonsai) lacking UK compliance, or UK-specific (IR35 Shield, Qdos) but only addressing tax status without solving payment protection.

## Target User
**Primary**: UK-based digital freelancers (developers, designers, consultants) earning £50K-150K/year, working on £1K-25K contracts, who are tech-savvy and payment-anxious.

**Profile**: "Sarah, 34, freelance React developer in Manchester. Works with 3-5 clients simultaneously. Lost £8K last year to a client who disappeared. Spends 6 hours/month chasing invoices. Would pay £30/month to never experience that stress again."

**Secondary** (Phase 2): Home improvement contractors (builders, plumbers, electricians) doing £10K+ jobs.

## Why Now?
1. **IR35 reforms** (2021) created anxiety around contractor status and compliance
2. **Post-pandemic freelance boom** - 10% YoY growth in self-employment
3. **Payment anxiety peak** - Economic uncertainty makes late payment intolerable
4. **AI maturity** - GPT-4 enables contract generation that actually works
5. **FCA innovation** - Escrow partners now viable at startup scale (Riverside, Transpact)

## Differentiator
**UK-first compliance + Escrow + AI** = unique combination.

- **vs HoneyBook/Bonsai**: We have UK-specific contract law, escrow protection, and local payment rails
- **vs IR35 Shield/Qdos**: We solve the full contract-to-payment lifecycle, not just tax status
- **vs Upwork/Fiverr**: Direct client relationships (no 20% marketplace cut), professional positioning
- **vs Transpact**: Integrated contract generation (not just escrow)

The moat is **integration depth** - every competitor solves one piece. We solve the full workflow.

## Success Metric
**For this review sprint**: Identify top 10 changes needed for V2 that would drive:
- 20% conversion rate (signup → paid)
- £190 ARPU (annual revenue per user)
- <5% monthly churn
- 2+ contracts created per user per month

**For V2 launch**: 
- 100 paying customers in first 90 days
- £2,000 MRR
- 80% of users who create 1 contract create a 2nd within 30 days

## Constraints
- **Budget**: £10K for V2 iteration (marketing, legal, design, infrastructure)
- **Technical**: Must maintain existing React/Express/tRPC/Drizzle stack (migration risk too high)
- **Timeline**: 
  - This sprint: 1 day (review + V2 roadmap)
  - V2 development: 30 days max
  - V2 launch target: March 2026
- **Compliance**: FCA escrow partnership required (cannot self-custody client funds)
- **Legal**: Must operate within SRA unreserved legal services framework

## Current State Assessment

### ✅ What Exists (V1)
- **Codebase**: 168 files, ~15K LOC, fully functional MVP
- **Features built**:
  - Manus OAuth authentication
  - User dashboard with contract stats
  - Contract wizard (Typeform-style, 5 service categories)
  - Milestone management (create, submit, approve/reject)
  - Contract signing workflow
  - Notification system
  - Template management (5 pre-built templates)
  - User profile management
- **Infrastructure**: Deployed on Vercel, MySQL database, S3/Firebase storage
- **Documentation**: Business plan, GTM strategy, launch plan, compliance checklist, PRD

### ⚠️ What's Missing (V2 Priorities)
- Escrow integration (API ready but not connected)
- Payment processing (Stripe setup incomplete)
- AI contract generation (OpenAI integration planned but not built)
- Email/SMS notifications (currently in-app only)
- Dispute resolution workflow
- LITL (Lawyer-in-the-Loop) referral system
- Admin panel for monitoring
- Analytics dashboard

### 🚨 Identified Issues (From Repo Review)
- Auth migration in progress (Manus → Clerk transition incomplete)
- Firebase migration complexity (S3 → Firebase Storage)
- Environment variable management scattered across files
- Test coverage minimal
- No error monitoring (Sentry planned but not configured)
- Mobile responsiveness gaps
- No onboarding flow (users land in empty dashboard)

## Sprint Type
- [ ] Vibe Build (simple, use Bolt/Lovable)
- [ ] Guided Build (medium, use Cursor + Claude)  
- [x] **Architect Build (complex, use Claude Code + review)**

**Rationale**: This is a REVIEW sprint, not a build. We're assessing architecture, code quality, and strategic direction for an existing product with substantial complexity.

---

## Sprint Timeline
| Phase | Start | End | Status | Deliverable |
|-------|-------|-----|--------|-------------|
| 0: Intake | 2026-02-10 09:00 | 2026-02-10 09:30 | ✅ | Sprint brief with real context |
| 0.5: Strawman | 2026-02-10 09:30 | 2026-02-10 10:00 | ✅ | Critical concept analysis |
| 1: Validate | 2026-02-10 10:00 | 2026-02-10 12:00 | ✅ | Market research + competitor analysis |
| 2: Define | 2026-02-10 12:00 | 2026-02-10 13:30 | ✅ | V2 PRD (what to keep/cut/add) |
| 3: Architect | 2026-02-10 13:30 | 2026-02-10 14:30 | ✅ | Tech design + migration plan |
| 4: Build Review | 2026-02-10 14:30 | 2026-02-10 17:00 | ✅ | Code review + top 10 improvements |
| 4.5: Brand | 2026-02-10 17:00 | 2026-02-10 18:00 | ✅ | Brand identity assessment |
| 5: Launch Prep | 2026-02-10 18:00 | 2026-02-10 19:30 | ✅ | UK-specific launch kit |
| 6: Retrospective | 2026-02-10 19:30 | 2026-02-10 20:00 | ✅ | Findings + day 2 priorities |

---

## Key Questions for This Sprint
1. **Market**: Is the UK freelance contract market real and addressable? Who's our actual competitor?
2. **Product**: What features drive conversion vs what's just noise?
3. **Tech**: Is the current stack viable for scale, or do we need changes?
4. **Business**: Can we hit £2K MRR in 90 days with the resources available?
5. **Brand**: Does the current identity differentiate us in a crowded market?

## Riskiest Assumptions to Validate
1. **Freelancers will pay £10-30/month** for contract + escrow (not just use free tools)
2. **2.5% escrow fee is acceptable** vs doing bank transfers themselves
3. **AI-generated contracts are "good enough"** vs needing lawyer review
4. **Escrow is the differentiator** vs just being a nice-to-have
5. **We can acquire customers for <£20** in a competitive market

---

## Notes
- Existing business plan is comprehensive and well-researched
- GTM strategy is detailed but untested (no customer validation yet)
- Codebase is substantial (~15K LOC) but has integration gaps
- No customers yet - this is pre-launch review
- Founder (Eli) has strong vision but needs validation data
