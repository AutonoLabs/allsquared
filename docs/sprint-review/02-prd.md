# Product Requirements Document (PRD): AllSquared V2
**Date:** 2026-02-10
**Product Owner:** Eli Bernstein (Founder)
**Author:** Claudia (Strategy + Product)
**Version:** 2.0
**Status:** ✅ Approved for Development

---

## Problem Statement

The UK's £5B freelance services market has three critical failures:
1. **Payment risk** - 67% of freelancers experience late/non-payment with no protection
2. **Scope disputes** - 43% face deliverable disagreements without clear contracts
3. **Tool fragmentation** - Existing solutions require 3-4 separate services (contracts, escrow, invoicing, legal)

AllSquared V1 built the foundation (contracts, milestones, auth) but **lacks the core differentiator: escrow integration**. V2 must complete the vision: UK-compliant contracts + FCA-backed escrow + milestone payments in one seamless platform.

---

## Target Users (from Persona Research)

### Primary: Tom (Tech Freelancer)
- £75K/year developer, lost £12K to client bankruptcy
- Needs: Payment guarantee, scope protection, time savings
- Will pay: £30/month + 2.5% escrow if it prevents one bad payment

### Secondary: Sarah (Creative Freelancer)
- £48K/year designer, loses £1K/month to unpaid revisions
- Needs: UK templates, professional UX, revision boundaries
- Will pay: £20/month if it saves 4+ hours monthly

### Critical: David (Client/Hirer)
- Startup founder, burned by £12K bad dev work
- Needs: Quality gates, milestone approvals, refund protection
- Will pay: 2.5% escrow fee if cheaper than Upwork (20%)

---

## V2 Vision Statement

> "The only platform where UK freelancers and clients can transact with confidence - clear contracts in 5 minutes, FCA-backed escrow, milestone-based payments, and built-in dispute resolution. Get paid what you're owed. Pay only for work you approve."

**What changed from V1:**
- V1: "AI-powered contracts" → V2: "Escrow-backed protection"
- V1: Freelancer-only focus → V2: Two-sided (freelancer + client)
- V1: Feature-rich → V2: Escrow-first (everything else supports this)

---

## Success Metrics (V2 Launch Goals)

### North Star Metric
**Escrow GMV (Gross Merchandise Value)** - Total £ deposited into escrow monthly

### 30-Day Targets (Post-V2 Launch)
| Metric | V2 Target | Why This Matters |
|--------|-----------|------------------|
| **Signups** | 200 | Validates messaging resonates |
| **Paid conversions** | 40 (20%) | Proves willingness to pay £30/month |
| **Contracts created** | 100 | Shows product utility |
| **Escrow deposits** | £80K GMV | **CRITICAL** - Proves escrow is adopted, not avoided |
| **Escrow adoption rate** | 50%+ | % of contracts with escrow vs without |
| **MRR** | £1,200 | Path to profitability visible |
| **Client signups** | 80 (40% of total) | Two-sided market validation |
| **NPS** | 50+ | Product love, not tolerance |

### 90-Day Targets
| Metric | Target |
|--------|--------|
| Paying customers | 100 |
| MRR | £2,000 |
| Escrow GMV | £200K |
| Monthly churn | <5% |
| Avg contract value | £8,000 |

**Kill criterion**: If escrow adoption rate is <20% after 30 days, escrow messaging/pricing is wrong.

---

## Core User Journeys

### Journey 1: Freelancer Creates Protected Contract (Happy Path)

1. **Signup** → Tom signs up with email (Google OAuth)
2. **Onboarding** → 2-minute wizard: "What do you do?" (selects Web Development)
3. **Create contract** → Clicks "New Contract", enters:
   - Client name/email
   - Project title
   - Total value (£10,000)
   - Milestones (3 milestones: £3K, £4K, £3K)
4. **Contract generation** → AI fills UK-compliant template in 30 seconds
5. **Review & send** → Tom reviews, tweaks scope section, clicks "Send to client"
6. **Client receives** → David gets email: "Review contract from Tom Richardson"
7. **Client signs** → David reviews, e-signs, sees "Deposit £3,000 to start"
8. **Escrow deposit** → David deposits via Stripe → £3K held by Riverside Escrow
9. **Work begins** → Tom sees "Milestone 1 funded" notification
10. **Delivery** → Tom submits "Milestone 1 complete" with deliverable link
11. **Approval** → David approves → £3K auto-releases to Tom's bank in 2-3 days
12. **Repeat** → Milestones 2 and 3 follow same flow

**Result**: Tom gets paid £10K in 3 secure tranches. David only pays for approved work. Zero chasing, zero disputes.

---

### Journey 2: Client Hires Freelancer (Discovery Path)

1. **Receives contract** → David gets email from freelancer Sarah: "Sign contract for brand design"
2. **Views contract** → Clicks link, sees AllSquared-branded contract page
3. **Questions escrow** → Sees "Secure payment with FCA-backed escrow" + FAQ
4. **Compares to Upwork** → Realizes 2.5% fee vs Upwork's 20% (saves £1,400)
5. **Signs + deposits** → E-signs, deposits £8,000 into escrow via Stripe
6. **Monitors progress** → Dashboard shows milestones, can approve/reject each
7. **Approves final** → Sarah delivers final brand files, David approves
8. **Money releases** → £8K goes to Sarah, David gets receipt for Xero
9. **Invited to sign up** → "Want to hire more freelancers? Create free account"
10. **Signs up as client** → Creates account, can now initiate contracts himself

**Result**: David discovers AllSquared through received contract, sees value, becomes paying client-side user.

---

### Journey 3: Dispute Resolution (Edge Case - Must Handle Well)

1. **Disagreement** → Tom submits Milestone 2, David rejects ("Not what we agreed")
2. **Negotiation** → In-app chat: Tom: "Can you clarify?", David: "Needs responsive design"
3. **Revision** → Tom: "OK, will fix in 3 days", David: "Approved pending revision"
4. **Re-submission** → Tom re-submits, David approves → money releases
5. **OR Escalation** → If they can't agree, either party clicks "Request mediation"
6. **AI mediator** → System reviews contract, milestone description, deliverable
7. **Suggests resolution** → "Deliverable meets 80% of requirements. Suggest 80% payment (£3,200) + close milestone."
8. **Manual escalation** → If still unresolved, escalate to human (LITL lawyer) for £100 fee

**Result**: Most disputes resolve through negotiation. AI mediates edge cases. LITL is final safety net.

---

## V2 Feature Specification

### ✅ V1 COMPLETE (Keep As-Is)
| Feature | Status | Notes |
|---------|--------|-------|
| User auth (Manus OAuth) | ✅ Built | Migrating to Clerk in V2.1 |
| User dashboard | ✅ Built | Shows contract stats, activity feed |
| Contract wizard | ✅ Built | 5 service categories, Typeform-style UX |
| Milestone manager | ✅ Built | Create, submit, approve/reject |
| E-signature | ✅ Built | Basic implementation (needs polish) |
| Notifications (in-app) | ✅ Built | Bell icon, activity feed |
| Template library | ✅ Built | 5 pre-built UK templates |

### 🔥 V2 CRITICAL (Must Build)
| Feature | Why Critical | Acceptance Criteria |
|---------|--------------|---------------------|
| **Escrow integration** | Core differentiator | ✅ Stripe Connect for deposits<br>✅ Riverside Escrow API integration<br>✅ Auto-release on milestone approval<br>✅ Manual release option<br>✅ Refund flow for rejections |
| **Payment processing** | Enables escrow | ✅ Stripe setup (UK GBP)<br>✅ 2.5% escrow fee collection<br>✅ 1.5% + £0.20 payment processing<br>✅ Payout to freelancer bank |
| **Client dashboard** | Two-sided UX | ✅ Client can view contracts<br>✅ Approve/reject milestones<br>✅ See escrow balance<br>✅ Download receipts |
| **Email notifications** | Critical for engagement | ✅ Contract received<br>✅ Signature required<br>✅ Deposit needed<br>✅ Milestone submitted<br>✅ Payment released<br>✅ Dispute opened |
| **Onboarding flow** | Reduce empty dashboard syndrome | ✅ 2-minute wizard (role, service type)<br>✅ Sample contract walkthrough<br>✅ "Create first contract" CTA |

### 🎯 V2 IMPORTANT (Should Build if Time Allows)
| Feature | Impact | Acceptance Criteria |
|---------|--------|---------------------|
| **AI contract generation** | Marketing hook, time saver | ✅ OpenAI GPT-4 integration<br>✅ Fills template from brief (100-word input)<br>✅ User can edit before sending<br>✅ Fallback to templates if AI fails |
| **Dispute workflow** | Safety net for edge cases | ✅ In-app chat per milestone<br>✅ "Request revision" button<br>✅ "Escalate to mediation" option<br>✅ AI mediator (Phase 2.1) |
| **Mobile responsive** | 40% of users on mobile | ✅ All core flows work on phone<br>✅ Dashboard readable on 375px<br>✅ Signature works on touch |
| **SMS notifications** | Higher open rate than email | ✅ Twilio integration<br>✅ Critical events only (deposit needed, payment released) |

### 📋 V2.1 FUTURE (Post-Launch)
| Feature | Timeline | Why Later |
|---------|----------|-----------|
| LITL (lawyer referrals) | Month 2 | Complex partnerships, not MVP-critical |
| Xero/QuickBooks integration | Month 3 | Requires API approval process |
| Analytics dashboard | Month 3 | Need data first |
| Team features | Month 4 | Not enough multi-user customers yet |
| API for integrations | Month 6 | Build specific integrations first |
| Mobile apps (iOS/Android) | Month 9 | Responsive web sufficient for now |

---

## OUT OF SCOPE (V2 Will NOT Include)

**Critical**: These are tempting but KILL them for V2 focus.

❌ **International expansion** - UK only for 12 months  
❌ **Multi-currency** - GBP only  
❌ **Video contracts** - Text/PDF sufficient  
❌ **Built-in accounting** - Integrate with Xero instead  
❌ **Freelancer marketplace** - Not Upwork, just contracts  
❌ **Time tracking** - Use Toggl/Harvest, don't rebuild  
❌ **Project management** - Notion/Linear do this, we don't  
❌ **White-label** - Enterprise feature for later  
❌ **Cryptocurrency payments** - Adds complexity, regulatory risk  

**Why this matters**: Every feature removed is 2 weeks saved for escrow polish.

---

## User Stories (Detailed)

### Epic 1: Escrow Integration

**US-1.1**: As a freelancer, I want to enable escrow on my contract so that I'm guaranteed payment when I deliver.

**Acceptance Criteria**:
- [ ] Contract wizard has "Enable escrow?" toggle (default: ON)
- [ ] Freelancer sees "Client must deposit £X before work starts" message
- [ ] Contract email to client says "Deposit required to begin"
- [ ] Client clicks "Deposit £X" → Stripe Checkout opens
- [ ] After deposit, freelancer sees "Funded" badge on milestone
- [ ] Escrow balance visible in both dashboards

---

**US-1.2**: As a client, I want to deposit money into escrow so that I can hire the freelancer with confidence.

**Acceptance Criteria**:
- [ ] After signing contract, client sees "Deposit £X to start" CTA
- [ ] Stripe Checkout accepts cards, Apple Pay, Google Pay
- [ ] Client receives confirmation email: "£X deposited, held securely until work approved"
- [ ] Client dashboard shows "£X in escrow for [Project Name]"
- [ ] Client can see escrow is FCA-regulated (badge + link to Riverside)

---

**US-1.3**: As a freelancer, I want to submit a milestone for approval so that I can get paid for completed work.

**Acceptance Criteria**:
- [ ] Freelancer clicks "Submit Milestone 1"
- [ ] Modal asks for deliverable link + message
- [ ] Client receives email: "[Freelancer] submitted Milestone 1 for review"
- [ ] Client clicks through to approval page
- [ ] Client can approve, reject (with reason), or request revision

---

**US-1.4**: As a client, I want to approve a milestone so that the freelancer gets paid automatically.

**Acceptance Criteria**:
- [ ] Client views deliverable, clicks "Approve Milestone"
- [ ] Confirmation: "£X will be released to [Freelancer] in 2-3 business days"
- [ ] Money transfers from escrow to freelancer's Stripe Connect account
- [ ] Both parties receive confirmation email
- [ ] Receipt generated for client (for accounting/Xero)

---

**US-1.5**: As a client, I want to reject a milestone if the work doesn't meet standards.

**Acceptance Criteria**:
- [ ] Client clicks "Reject Milestone", must provide reason
- [ ] Freelancer receives notification: "Milestone rejected: [Reason]"
- [ ] In-app chat opens for negotiation
- [ ] Client can approve revised submission
- [ ] OR escalate to mediation after 2 rejections

---

### Epic 2: Two-Sided Onboarding

**US-2.1**: As a new freelancer, I want a quick onboarding flow so I can create my first contract in under 5 minutes.

**Acceptance Criteria**:
- [ ] After signup, 2-screen wizard appears:
  - Screen 1: "What do you do?" (5 service categories)
  - Screen 2: "Create your first contract" (pre-filled with sample data)
- [ ] Wizard completion = first contract draft ready to customize
- [ ] "Skip" button for power users

---

**US-2.2**: As a client who received a contract, I want to understand what AllSquared is so I trust depositing money.

**Acceptance Criteria**:
- [ ] Contract page has "What is AllSquared?" dropdown
- [ ] Explains: FCA-backed escrow, only pay for approved work, secure
- [ ] Links to FAQ, security page, Riverside Escrow info
- [ ] Trustpilot rating visible (once we have reviews)

---

### Epic 3: Communication & Notifications

**US-3.1**: As a freelancer, I want to receive email notifications for key events so I don't miss important actions.

**Acceptance Criteria**:
- [ ] Email sent when:
  - Client signs contract
  - Client deposits into escrow
  - Client approves milestone
  - Client rejects milestone
  - Payment released to bank
- [ ] Emails are branded, mobile-responsive
- [ ] One-click actions (e.g., "View milestone" button)

---

**US-3.2**: As a client, I want SMS notifications for critical events so I respond quickly.

**Acceptance Criteria**:
- [ ] SMS sent when:
  - Contract received (with sign link)
  - Deposit required
  - Milestone submitted for approval
- [ ] SMS includes short link to action page
- [ ] Opt-out option in settings

---

### Epic 4: Dispute Resolution (V2.1)

**US-4.1**: As a freelancer or client, I want to request mediation if we can't agree on a milestone.

**Acceptance Criteria**:
- [ ] After 2 rejections, "Request Mediation" button appears
- [ ] Both parties receive notification: "Mediation requested"
- [ ] AI mediator reviews contract, milestone description, deliverable
- [ ] Suggests resolution (e.g., partial payment, revision timeline)
- [ ] Either party can accept suggestion or escalate to human (LITL)

---

## Technical Requirements

### Performance
- [ ] Page load time <2s (95th percentile)
- [ ] Contract generation <5s (AI) or <1s (template)
- [ ] Milestone approval → payment release in <10s (async job OK)
- [ ] Mobile responsive: works on iPhone SE (375px)

### Security
- [ ] All data encrypted at rest (AES-256)
- [ ] All API calls over HTTPS only
- [ ] PCI DSS compliant (via Stripe)
- [ ] GDPR compliant (UK GDPR)
- [ ] No client credentials stored (Stripe handles)

### Reliability
- [ ] 99.9% uptime (3 nines)
- [ ] Escrow deposits must be idempotent (no double-charging)
- [ ] Payment releases must be atomic (no partial payments)
- [ ] Graceful degradation if AI fails (fall back to templates)

### Integrations
- [ ] Stripe: Payment processing + Stripe Connect payouts
- [ ] Riverside Escrow: FCA-backed escrow API
- [ ] Resend/SendGrid: Transactional emails
- [ ] Twilio: SMS notifications
- [ ] OpenAI: AI contract generation (optional)

---

## Design Guidelines

### UI Principles (for V2)
1. **Escrow trust signals everywhere** - FCA badge, security icons, "Your money is protected"
2. **Two-sided clarity** - Freelancer vs client views clearly differentiated
3. **Progress visibility** - Always show: where you are, what's next
4. **Mobile-first** - 40% of users on phone, design for 375px first
5. **Speed over features** - One-click actions, minimal modals

### Key Screens (Wireframe Priorities)
1. **Onboarding wizard** (2 screens)
2. **Contract creation wizard** (5 steps)
3. **Contract review page** (client receives)
4. **Escrow deposit flow** (Stripe Checkout)
5. **Dashboard** (freelancer + client versions)
6. **Milestone submission** (modal)
7. **Approval page** (client approves)

---

## Migration Plan (V1 → V2)

### Existing V1 Users (if any exist)
- [ ] Email all users: "V2 launching with escrow - here's what's new"
- [ ] Grandfather existing contracts (no escrow required for old contracts)
- [ ] New contracts created after V2 launch = escrow enabled by default
- [ ] Offer early adopter discount (lifetime 20% off for first 50 users)

### Tech Stack Changes
| Component | V1 | V2 | Migration Plan |
|-----------|-----|-----|----------------|
| Auth | Manus OAuth | Clerk | Gradual - support both in V2.0, cut Manus in V2.1 |
| Storage | S3 + Firebase | Firebase only | Already migrated |
| Database | Vercel Postgres | Same | Schema additions for escrow tables |
| Payments | None | Stripe Connect | New integration |
| Escrow | None | Riverside API | New integration |

---

## Launch Checklist (V2 Go-Live)

### Pre-Launch (1 Week Before)
- [ ] Beta test with 10 users (5 freelancers, 5 clients)
- [ ] Stripe account approved (business verification)
- [ ] Riverside Escrow partnership live (API keys, legal agreement)
- [ ] Email templates finalized (10 transactional emails)
- [ ] Landing page updated (escrow-first messaging)
- [ ] FAQ page (20 questions answered)
- [ ] Terms of service + Privacy policy reviewed by lawyer
- [ ] Compliance checklist complete (FCA, GDPR, SRA)

### Launch Day
- [ ] Deploy V2 to production
- [ ] Announce on r/ContractorUK, IPSE, LinkedIn
- [ ] Email existing V1 users (if any)
- [ ] Post build-in-public update on Twitter
- [ ] Monitor for bugs (Sentry alerts)
- [ ] Support ready (help@allsquared.uk monitored)

### Week 1 Post-Launch
- [ ] Daily metrics review (signups, conversions, escrow GMV)
- [ ] User interviews (5-10 early adopters)
- [ ] Bug triage (P0/P1 fixed within 24h)
- [ ] Adjust messaging based on conversion data

---

## Open Questions (Require Decision Before Build)

### Pricing
- [ ] **Decision needed**: £19.99 vs £29.99 for Pro tier?
  - **Recommendation**: Start at £29.99, test £19.99 after 30 days if conversion <15%
- [ ] **Decision needed**: Charge escrow fee to freelancer, client, or split?
  - **Recommendation**: Charge client (they control deposit decision)

### Escrow
- [ ] **Decision needed**: Auto-release after X days if client doesn't approve/reject?
  - **Recommendation**: Yes, 14 days (protects freelancer from ghosting)
- [ ] **Decision needed**: Refund policy if client rejects?
  - **Recommendation**: Full refund if rejected within 48h, partial after mediation

### Features
- [ ] **Decision needed**: Launch with AI contracts or templates-only?
  - **Recommendation**: Templates-only for V2.0, AI in V2.1 (reduces launch risk)
- [ ] **Decision needed**: SMS notifications opt-in or opt-out?
  - **Recommendation**: Opt-in (GDPR safer, avoid spam perception)

---

## Appendix: V1 vs V2 Comparison

| Aspect | V1 (Current) | V2 (This PRD) |
|--------|-------------|---------------|
| **Core value prop** | AI contracts | Escrow protection |
| **User focus** | Freelancers only | Freelancers + clients (two-sided) |
| **Differentiation** | Templates | UK + escrow + AI |
| **Monetization** | Subscription only | Subscription + transaction fees |
| **Market position** | Contract tool | Payment protection platform |
| **Key features** | Contracts, milestones, signing | + Escrow, payments, client UX |
| **Competitive edge** | UK templates | Escrow (FCA-backed, no competitor has this) |

---

*PRD approved for development. Next: Phase 3 (Architecture).*
