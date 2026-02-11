# Technical Architecture: AllSquared V2
**Date:** 2026-02-10
**Architect:** Claudia (Technical Lead)
**Version:** 2.0
**Status:** ✅ Approved for Implementation

---

## Executive Summary

**V1 Assessment**: ✅ **Solid foundation, no major stack changes required**

The existing codebase (React 19 + Express + tRPC + Drizzle + Vercel Postgres) is well-architected for V2 requirements. **Recommendation: Enhance, don't rebuild.**

**Key V2 Additions**:
1. Stripe Connect for payments + escrow
2. Riverside Escrow API integration
3. Email/SMS notification infrastructure
4. Clerk migration (replace Manus)
5. OpenAI integration for AI contracts (V2.1)

**Migration Risk**: 🟢 **LOW** - V2 is additive, not destructive. Existing V1 features remain functional.

---

## 1. Current Stack Assessment (V1)

### ✅ What's Working Well (Keep)

| Layer | Technology | Why It's Good | V2 Changes |
|-------|-----------|---------------|------------|
| **Frontend** | React 19 + TypeScript | Modern, performant, type-safe | None - continue |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Fast development, consistent design | Add brand tokens |
| **Routing** | Wouter | Lightweight (3KB vs Next.js 300KB) | None |
| **State** | TanStack Query | Perfect for tRPC, cache mgmt | None |
| **API** | tRPC + Express | Type-safe client↔server, great DX | Add escrow procedures |
| **Database** | Vercel Postgres + Drizzle | Generous free tier, SQL ORM better than Prisma | Schema extensions |
| **Build** | Vite | Fast HMR, ESM-first | None |
| **Deploy** | Vercel | Git push = live, free SSL, CDN | None |
| **Package Mgr** | pnpm | Faster than npm, disk-efficient | None |

**Verdict**: Stack is excellent for V2. No rewrites needed.

---

### ⚠️ Areas Requiring Attention (Fix in V2)

| Issue | Current State | V2 Solution |
|-------|---------------|-------------|
| **Auth migration** | Manus OAuth (deprecated by founder) | Migrate to Clerk (already in package.json) |
| **No payment processing** | Placeholder code only | Stripe integration |
| **No escrow** | Database schema exists, no API | Riverside Escrow integration |
| **Storage inconsistency** | S3 + Firebase (migration incomplete) | Consolidate on Firebase Storage |
| **Missing email/SMS** | In-app notifications only | Resend + Twilio |
| **No error monitoring** | Sentry in package.json but not configured | Configure Sentry |
| **Test coverage** | Minimal (<10%) | Add critical path tests |

**Verdict**: These are integration gaps, not architectural flaws. V2 fills the gaps.

---

## 2. V2 Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  React 19 + Tailwind + shadcn/ui + tRPC Client              │
│  - Freelancer Dashboard  - Client Dashboard                  │
│  - Contract Wizard       - Milestone Manager                 │
│  - Escrow UI             - Dispute Resolution                │
└───────────────────┬─────────────────────────────────────────┘
                    │ tRPC over HTTP (type-safe)
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER (Express)                   │
│  tRPC Router (server/routers.ts)                            │
│  - auth.*        - contracts.*     - milestones.*           │
│  - escrow.*      - payments.*      - disputes.*             │
│  - notifications.*                                           │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┬──────────────┬──────────────┐
        ▼                       ▼              ▼              ▼
┌──────────────┐      ┌──────────────┐  ┌──────────┐  ┌──────────┐
│  Drizzle ORM │      │ Stripe API   │  │ Riverside│  │ Resend   │
│  (Postgres)  │      │ Connect      │  │ Escrow   │  │ (Email)  │
│              │      │ - Payments   │  │ API      │  │          │
│ - Users      │      │ - Payouts    │  │ - Deposit│  │ Twilio   │
│ - Contracts  │      │ - Webhooks   │  │ - Release│  │ (SMS)    │
│ - Milestones │      │              │  │ - Refund │  │          │
│ - Escrow     │      └──────────────┘  └──────────┘  └──────────┘
│ - Disputes   │               │              │              │
│ - Notifs     │               └──────────────┴──────────────┘
└──────────────┘                         │
        │                                │
        │                         ┌──────▼──────┐
        │                         │  Firebase   │
        │                         │  Storage    │
        │                         │  (Files)    │
        │                         └─────────────┘
        ▼
┌──────────────────────────────────────────────┐
│         Vercel Postgres (Production)          │
│  - 256MB storage (free tier)                  │
│  - Auto-scaling                               │
│  - Backups included                           │
└──────────────────────────────────────────────┘
```

---

## 3. Database Schema (V2 Extensions)

### Existing Tables (V1) ✅
- `users` - User accounts and profiles
- `contracts` - Contract lifecycle management
- `milestones` - Payment milestone tracking
- `contractTemplates` - Pre-built templates (5 categories)
- `notifications` - In-app notifications

### New Tables (V2) 🆕

#### `escrowTransactions`
```sql
CREATE TABLE escrow_transactions (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id),
  milestone_id TEXT REFERENCES milestones(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  status TEXT NOT NULL, -- pending | held | released | refunded | cancelled
  stripe_payment_intent_id TEXT,
  riverside_escrow_id TEXT,
  deposited_at TIMESTAMP,
  released_at TIMESTAMP,
  refunded_at TIMESTAMP,
  platform_fee DECIMAL(10,2), -- 2.5% escrow fee
  payment_processing_fee DECIMAL(10,2), -- Stripe 1.5% + 0.20
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_escrow_contract ON escrow_transactions(contract_id);
CREATE INDEX idx_escrow_status ON escrow_transactions(status);
```

#### `disputes`
```sql
CREATE TABLE disputes (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id),
  milestone_id TEXT REFERENCES milestones(id),
  raised_by TEXT NOT NULL, -- user_id (freelancer or client)
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL, -- open | under_review | resolved | escalated | closed
  ai_suggested_resolution TEXT,
  litl_lawyer_id TEXT, -- if escalated
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dispute_contract ON disputes(contract_id);
CREATE INDEX idx_dispute_status ON disputes(status);
```

#### `litlReferrals` (V2.1)
```sql
CREATE TABLE litl_referrals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  request_type TEXT NOT NULL, -- contract_review | legal_advice | custom_contract | dispute_assistance
  description TEXT,
  status TEXT NOT NULL, -- pending | assigned | in_progress | completed | cancelled
  lawyer_id TEXT,
  fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

#### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  tier TEXT NOT NULL, -- free | starter | pro | enterprise
  status TEXT NOT NULL, -- active | past_due | cancelled | paused | trialing
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sub_user ON subscriptions(user_id);
CREATE INDEX idx_sub_status ON subscriptions(status);
```

#### `payments`
```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  subscription_id TEXT REFERENCES subscriptions(id),
  escrow_transaction_id TEXT REFERENCES escrow_transactions(id),
  type TEXT NOT NULL, -- subscription | escrow_deposit | escrow_release | platform_fee | litl_fee
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  status TEXT NOT NULL, -- pending | processing | succeeded | failed | refunded
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_user ON payments(user_id);
CREATE INDEX idx_payment_type ON payments(type);
CREATE INDEX idx_payment_status ON payments(status);
```

---

## 4. API Design (tRPC Procedures)

### New V2 Procedures

#### `escrow.*` Router
```typescript
export const escrowRouter = router({
  // Deposit money into escrow
  deposit: protectedProcedure
    .input(z.object({
      contractId: z.string(),
      milestoneId: z.string().optional(),
      amount: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Create Stripe PaymentIntent
      // 2. Call Riverside Escrow API to create escrow account
      // 3. Insert escrowTransactions record (status: pending)
      // 4. Return clientSecret for frontend Stripe checkout
    }),

  // Release escrowed funds to freelancer
  release: protectedProcedure
    .input(z.object({
      escrowTransactionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Verify user is client and milestone is approved
      // 2. Call Riverside Escrow API to release funds
      // 3. Transfer to freelancer via Stripe Connect
      // 4. Update escrowTransactions (status: released)
      // 5. Send notifications
    }),

  // Refund escrowed funds to client
  refund: protectedProcedure
    .input(z.object({
      escrowTransactionId: z.string(),
      reason: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Verify user is client and reason is valid
      // 2. Call Riverside Escrow API to initiate refund
      // 3. Refund via Stripe
      // 4. Update escrowTransactions (status: refunded)
    }),

  // Get escrow balance for a contract
  getBalance: protectedProcedure
    .input(z.object({ contractId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Sum all held escrow for contract
    }),
});
```

#### `payments.*` Router
```typescript
export const paymentsRouter = router({
  // Create subscription checkout session
  createSubscriptionCheckout: protectedProcedure
    .input(z.object({
      tier: z.enum(['starter', 'pro', 'enterprise']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create Stripe Checkout Session
      // Redirect to checkout URL
    }),

  // Handle Stripe webhook events
  handleWebhook: publicProcedure
    .input(z.object({
      event: z.any(), // Stripe event object
    }))
    .mutation(async ({ input }) => {
      // Process:
      // - payment_intent.succeeded
      // - customer.subscription.created
      // - customer.subscription.deleted
      // - invoice.payment_failed
    }),

  // Get payment history for user
  getHistory: protectedProcedure
    .query(async ({ ctx }) => {
      // Return payments WHERE user_id = ctx.user.id
    }),
});
```

#### `disputes.*` Router
```typescript
export const disputesRouter = router({
  // Raise a dispute
  create: protectedProcedure
    .input(z.object({
      contractId: z.string(),
      milestoneId: z.string(),
      reason: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Insert dispute record
      // Notify other party
      // Trigger AI mediation workflow (V2.1)
    }),

  // Resolve a dispute
  resolve: protectedProcedure
    .input(z.object({
      disputeId: z.string(),
      resolutionNotes: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Update dispute (status: resolved)
      // Apply resolution (e.g., partial payment)
    }),

  // Escalate to LITL lawyer
  escalate: protectedProcedure
    .input(z.object({
      disputeId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Update dispute (status: escalated)
      // Create litlReferral record
      // Notify LITL lawyer
    }),
});
```

---

## 5. Integration Specifications

### Stripe Connect Integration

**Purpose**: Payment processing + escrow deposits + freelancer payouts

#### Setup
1. Create Stripe Connect account (platform model)
2. Enable payment intents, subscriptions, webhooks
3. Add freelancers as Connect accounts (Express accounts)

#### Key Flows
```typescript
// 1. Client deposits into escrow
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // £100.00 in pence
  currency: 'gbp',
  payment_method_types: ['card', 'apple_pay', 'google_pay'],
  metadata: {
    contractId: 'contract_123',
    milestoneId: 'milestone_456',
    escrowTransactionId: 'escrow_789',
  },
});

// 2. Release to freelancer (after approval)
const transfer = await stripe.transfers.create({
  amount: 9750, // £100 - £2.50 platform fee
  currency: 'gbp',
  destination: freelancerStripeAccountId, // Connect account
  metadata: {
    escrowTransactionId: 'escrow_789',
  },
});

// 3. Refund to client (if rejected)
const refund = await stripe.refunds.create({
  payment_intent: paymentIntent.id,
  reason: 'requested_by_customer',
});
```

#### Webhooks to Handle
- `payment_intent.succeeded` → Mark escrow as held
- `payment_intent.payment_failed` → Notify client, retry
- `transfer.created` → Mark escrow as released
- `customer.subscription.created` → Activate Pro tier
- `customer.subscription.deleted` → Downgrade to Free tier

---

### Riverside Escrow API Integration

**Purpose**: FCA-regulated escrow (legal requirement for holding client funds)

#### Why Riverside?
- FCA-authorised (legal compliance)
- API-first (no manual processes)
- 0.5% fee (we charge 2.5%, keep 2% margin)
- UK-based (faster payments)

#### Key Endpoints (Hypothetical - adapt to actual API)
```typescript
// Create escrow account
POST /v1/escrow/create
{
  "amount": 10000,
  "currency": "GBP",
  "beneficiary": "freelancer@example.com",
  "payer": "client@example.com",
  "reference": "allsquared_escrow_789",
  "releaseConditions": "milestone_approved"
}

// Release funds
POST /v1/escrow/{escrowId}/release
{
  "recipientBankAccount": {
    "sortCode": "12-34-56",
    "accountNumber": "12345678"
  }
}

// Refund
POST /v1/escrow/{escrowId}/refund
{
  "reason": "work_rejected"
}
```

#### Integration Pattern
- AllSquared acts as intermediary (receives Stripe payment → deposits to Riverside)
- Riverside holds funds until AllSquared signals release
- Riverside handles bank transfers (3-5 business days)

---

### Resend (Email) Integration

**Purpose**: Transactional emails (notifications, receipts)

#### Setup
1. Create Resend account (free tier: 100 emails/day, then $10/mo for 10K)
2. Add domain (allsquared.uk) for branded emails
3. Verify DNS records (SPF, DKIM)

#### Email Templates (10 critical)
1. **Contract received** → Client notification
2. **Signature required** → Reminder to sign
3. **Deposit required** → Client must fund escrow
4. **Escrow deposited** → Confirmation to both parties
5. **Milestone submitted** → Client review needed
6. **Milestone approved** → Freelancer payment releasing
7. **Payment released** → Freelancer bank transfer complete
8. **Milestone rejected** → Freelancer must revise
9. **Dispute opened** → Mediation process started
10. **Receipt** → Client tax/accounting record

#### Code Example
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContractReceivedEmail(clientEmail: string, contract: Contract) {
  await resend.emails.send({
    from: 'AllSquared <noreply@allsquared.uk>',
    to: clientEmail,
    subject: `Contract from ${contract.freelancerName} - Review & Sign`,
    html: `
      <h1>You've received a contract</h1>
      <p>${contract.freelancerName} has sent you a contract for ${contract.title}.</p>
      <a href="${process.env.APP_URL}/contracts/${contract.id}">Review Contract</a>
    `,
  });
}
```

---

### Twilio (SMS) Integration (V2.1)

**Purpose**: High-urgency notifications (deposit needed, payment released)

#### Setup
1. Twilio account (pay-as-you-go: £0.04/SMS)
2. UK phone number (£1/month)
3. Verify sender (A2P compliance)

#### SMS Triggers (critical only)
- Deposit required (client must act)
- Payment released (freelancer gets paid)
- Dispute escalated (urgent attention)

---

## 6. Frontend Architecture

### Component Structure

```
client/src/
├── pages/
│   ├── Dashboard.tsx         # Freelancer dashboard
│   ├── ClientDashboard.tsx   # Client-specific dashboard
│   ├── ContractWizard.tsx    # Multi-step contract creation
│   ├── ContractView.tsx      # Contract detail page
│   ├── MilestoneManager.tsx  # Milestone tracking
│   ├── EscrowView.tsx        # Escrow balance + history
│   └── DisputeView.tsx       # Dispute resolution
├── components/
│   ├── contracts/
│   │   ├── ContractCard.tsx
│   │   ├── SignatureFlow.tsx
│   │   └── TemplateSelector.tsx
│   ├── escrow/
│   │   ├── DepositButton.tsx
│   │   ├── EscrowBadge.tsx    # "Funded" status indicator
│   │   └── ReleaseButton.tsx
│   ├── milestones/
│   │   ├── MilestoneCard.tsx
│   │   ├── SubmitModal.tsx
│   │   └── ApprovalButtons.tsx
│   └── ui/                    # shadcn components (50+ pre-built)
├── lib/
│   ├── trpc.ts                # tRPC client config
│   ├── stripe.ts              # Stripe Elements wrapper
│   └── utils.ts
└── hooks/
    ├── useAuth.ts
    ├── useContract.ts
    └── useEscrow.ts
```

### Key UI Patterns

#### Escrow Deposit Flow (Stripe Checkout)
```tsx
import { loadStripe } from '@stripe/stripe-js';

function DepositButton({ contractId, amount }: Props) {
  const createCheckout = trpc.escrow.deposit.useMutation();
  
  async function handleDeposit() {
    const { clientSecret } = await createCheckout.mutateAsync({
      contractId,
      amount,
    });
    
    const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY!);
    await stripe?.redirectToCheckout({ sessionId: clientSecret });
  }
  
  return (
    <Button onClick={handleDeposit}>
      Deposit £{amount} into Escrow
    </Button>
  );
}
```

#### Milestone Approval (Client View)
```tsx
function MilestoneApprovalCard({ milestone }: Props) {
  const approveMutation = trpc.milestones.approve.useMutation();
  const rejectMutation = trpc.milestones.reject.useMutation();
  
  return (
    <Card>
      <CardHeader>
        <h3>{milestone.title}</h3>
        <Badge>{milestone.status}</Badge>
      </CardHeader>
      <CardContent>
        <p>{milestone.description}</p>
        <a href={milestone.deliverableUrl}>View Deliverable</a>
      </CardContent>
      <CardFooter>
        <Button onClick={() => approveMutation.mutate({ id: milestone.id })}>
          Approve & Release £{milestone.amount}
        </Button>
        <Button variant="outline" onClick={() => rejectMutation.mutate(...)}>
          Request Revision
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 7. Migration Plan (V1 → V2)

### Week 1: Database + Auth
- [ ] Add V2 schema tables (escrow, disputes, subscriptions, payments)
- [ ] Migrate from Manus to Clerk (parallel auth for 1 week)
- [ ] Test auth migration with beta users

### Week 2: Stripe Integration
- [ ] Set up Stripe Connect platform account
- [ ] Implement deposit flow (Stripe Checkout)
- [ ] Implement payout flow (Stripe Transfer)
- [ ] Add webhook handlers
- [ ] Test end-to-end with test mode

### Week 3: Escrow Integration
- [ ] Riverside Escrow partnership finalized
- [ ] API integration (create, release, refund)
- [ ] Test escrow flow (deposit → hold → release)
- [ ] Add escrow UI (balance, status badges)

### Week 4: Notifications + Polish
- [ ] Resend email templates (10 emails)
- [ ] Twilio SMS setup (3 critical SMS)
- [ ] Client dashboard (separate from freelancer view)
- [ ] Mobile responsive fixes
- [ ] Beta testing with 10 users

### Week 5: Launch Prep
- [ ] Security audit (escrow flows especially)
- [ ] Load testing (simulate 100 concurrent users)
- [ ] Sentry error monitoring configured
- [ ] Documentation (API docs, FAQ, guides)
- [ ] Legal review (Terms, Privacy, Escrow T&Cs)

---

## 8. Infrastructure & DevOps

### Environment Variables (V2 Additions)
```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Riverside Escrow
RIVERSIDE_API_KEY=...
RIVERSIDE_API_URL=https://api.riverside.escrow.com

# Email
RESEND_API_KEY=re_...

# SMS
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+442012345678

# OpenAI (V2.1)
OPENAI_API_KEY=sk-...

# Sentry
SENTRY_DSN=https://...
```

### Deployment Strategy
- **Production**: Vercel (main branch auto-deploy)
- **Staging**: Vercel (preview deployments on PR)
- **Database**: Vercel Postgres (256MB free tier → scale when needed)
- **Storage**: Firebase Storage (10GB free tier)

### Monitoring
- **Errors**: Sentry (10K events/month free)
- **Performance**: Vercel Analytics (included)
- **Uptime**: Better Uptime (free tier: 1 min checks)
- **Logs**: Vercel logs (included)

---

## 9. Security Considerations

### Payment Security
- [ ] PCI DSS compliance (via Stripe - no card data touches our servers)
- [ ] Stripe webhooks signature verification (prevent spoofing)
- [ ] Escrow transaction idempotency (prevent double-charging)
- [ ] Rate limiting on payment endpoints (prevent abuse)

### Data Protection
- [ ] GDPR compliance (UK GDPR)
- [ ] Encryption at rest (Vercel Postgres default)
- [ ] Encryption in transit (HTTPS only)
- [ ] Personal data minimization (only store what's needed)
- [ ] Right to erasure (delete account + all data)

### Auth Security
- [ ] Clerk handles passwords (bcrypt, salt, etc.)
- [ ] Session tokens (JWT, 7-day expiry)
- [ ] CSRF protection (sameSite cookies)
- [ ] Rate limiting on auth endpoints

---

## 10. Performance Targets

| Metric | Target | Current V1 | How to Achieve |
|--------|--------|------------|----------------|
| **Page load (p95)** | <2s | ~3s | Code splitting, lazy loading |
| **API response (p95)** | <500ms | ~800ms | Database indexing, caching |
| **Contract creation** | <5s | ~12s (with AI) | Async AI generation, progress bar |
| **Escrow deposit** | <10s | N/A | Stripe Checkout optimized |
| **Mobile load** | <3s | ~5s | Image optimization, Tailwind purge |

---

## 11. Testing Strategy

### Critical Path Tests (Must Have for V2)
1. **E2E: Freelancer creates contract → Client signs → Deposit → Approve → Payment**
2. **Integration: Stripe deposit → Riverside escrow → Stripe payout**
3. **Unit: Escrow release calculation (amount - fees)**
4. **Unit: Dispute resolution logic**
5. **Integration: Email sent on all 10 triggers**

### Testing Tools
- **Unit**: Vitest (already configured)
- **Integration**: Vitest + MSW (mock Stripe/Riverside APIs)
- **E2E**: Playwright (add in V2.1)

---

## 12. Rollback Plan

### If V2 Launch Fails (Critical Bugs)

**Scenario**: Escrow deposits failing, payments not releasing, data corruption

**Action**:
1. Revert to V1 deployment (Vercel rollback to previous deployment)
2. Disable escrow features (feature flag)
3. Email all users: "Experiencing technical issues, escrow temporarily disabled"
4. Refund any held escrow manually via Stripe dashboard
5. Fix bugs, test in staging, re-launch

**Mitigation**: Beta test with 10 real users (low-stakes contracts) before public launch.

---

## 13. Post-Launch Optimization (V2.1+)

### Month 2-3 Priorities
1. **AI contract generation** (OpenAI GPT-4)
2. **Dispute AI mediator** (suggest resolutions)
3. **Xero integration** (sync contracts → invoices)
4. **Analytics dashboard** (contract volume, escrow GMV, churn)

### Month 4-6 Priorities
1. **Team features** (agencies managing multiple contracts)
2. **LITL network** (lawyer partnerships for escalations)
3. **Mobile apps** (iOS/Android native)
4. **API** (for integrations, white-label)

---

## 14. Cost Projections (V2 Infrastructure)

### Monthly Costs (100 paying customers)

| Service | Free Tier | Paid Tier (100 users) |
|---------|-----------|----------------------|
| Vercel | ✅ Free | £0 (under limits) |
| Vercel Postgres | ✅ 256MB | £0 (scales at 512MB) |
| Firebase Storage | ✅ 10GB | £0 (under limits) |
| Stripe | ✅ Free | 1.5% + £0.20 per transaction |
| Riverside Escrow | - | 0.5% of escrow GMV |
| Resend | ✅ 100/day | £10/mo (10K emails) |
| Twilio | - | £50/mo (1K SMS × £0.04) |
| Clerk | ✅ 5K MAU | £0 (under limits) |
| Sentry | ✅ 10K events | £0 (under limits) |
| **Total Fixed** | | **£60/mo** |
| **Variable** | | **2% of GMV** |

**At 100 customers × £190 ARPU = £19K ARR:**
- Fixed: £60/mo = £720/year
- Variable (£200K GMV): £4K/year
- **Total infra cost**: £4,720/year (25% of revenue)

**Gross margin**: 75% (excellent for SaaS + marketplace)

---

## Final Recommendations

### ✅ Proceed with V2 on Existing Stack
- React 19 + tRPC + Drizzle + Vercel is solid
- No rewrites, only integrations (Stripe, Riverside, Resend)
- Migration risk is LOW (additive changes)

### 🎯 Focus Areas for V2
1. **Escrow integration** (Stripe + Riverside) - 40% of dev time
2. **Client-side UX** (two-sided market) - 30% of dev time
3. **Notifications** (email + SMS) - 20% of dev time
4. **Polish + testing** - 10% of dev time

### ⚠️ De-Scope for V2.0
- AI contract generation → V2.1 (use templates for launch)
- LITL lawyer network → V2.2 (complex partnerships)
- Team features → V2.3 (not enough multi-user demand yet)

### 📅 Timeline
- **Week 1**: Database + Clerk migration
- **Week 2**: Stripe integration
- **Week 3**: Riverside escrow integration
- **Week 4**: Notifications + client UX
- **Week 5**: Beta testing + launch prep
- **Week 6**: PUBLIC LAUNCH

**Target launch date**: March 15, 2026 (5 weeks from now)

---

*Architecture approved. Next: Phase 4 (Code Review).*
