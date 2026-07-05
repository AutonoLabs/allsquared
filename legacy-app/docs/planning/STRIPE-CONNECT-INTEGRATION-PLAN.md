# AllSquared — Stripe Connect Integration Plan

**Author:** Ada (subagent), commissioned by Claudia  
**Date:** 2025-07-17  
**For:** Eli Bernstein  
**Status:** Ready for review  
**Context:** Replacing Transpact escrow with native Stripe Connect for milestone-based escrow, subscriptions, KYC, and invoicing.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Design](#2-architecture-design)
3. [Feature Breakdown](#3-feature-breakdown)
4. [Implementation Phases](#4-implementation-phases)
5. [Technical Specifications](#5-technical-specifications)
6. [Database Schema Changes](#6-database-schema-changes)
7. [Frontend Components](#7-frontend-components)
8. [Testing Strategy](#8-testing-strategy)
9. [Onboarding & Compliance](#9-onboarding--compliance)
10. [Risk Register & Mitigations](#10-risk-register--mitigations)
11. [Decision Log](#11-decision-log)

---

## 1. Executive Summary

### What's Changing

The current codebase has a **Transpact escrow integration** (FCA Ref 546279) with mock responses and a **basic Stripe integration** for payments/subscriptions. We're consolidating everything into **Stripe Connect** as the single payment infrastructure:

| Current State | Target State |
|---|---|
| Transpact for escrow (mock, no live API) | Stripe Connect escrow via payment holds |
| Stripe for subscriptions (basic) | Stripe Billing for subscriptions (full) |
| No KYC | Stripe Identity for provider verification |
| Separate escrow + payment flows | Unified Stripe flow for everything |
| Manual capture PaymentIntents | Destination charges with delayed transfers |

### Why Stripe Connect Over Transpact

1. **Single integration** — payments, escrow, subscriptions, identity, invoicing all in one SDK
2. **Already partially built** — `payments.ts` has Express Connect account creation, customer management, webhook handling
3. **Developer experience** — Stripe's docs, test mode, and SDK are best-in-class
4. **No separate FCA relationship needed** — Stripe is the regulated entity; AllSquared operates under Stripe's EMI license
5. **90-day hold limit is acceptable** — milestones release funds well before 90 days in practice

### The Core Insight

AllSquared doesn't need a third-party escrow provider. **Stripe Connect itself IS the escrow mechanism.** The platform collects the payment, holds it in the platform's Stripe balance, and transfers to the provider's connected account when a milestone is approved. Stripe handles the regulatory complexity.

---

## 2. Architecture Design

### 2.1 Connect Account Type: **Express** (Recommended)

| Account Type | Onboarding UX | Dashboard | Payout Control | Effort | Verdict |
|---|---|---|---|---|---|
| **Standard** | Stripe-hosted (redirects away) | Full Stripe Dashboard | User controls | LOW | ❌ Too much user control, no escrow |
| **Express** | Stripe-hosted (embedded or redirect) | Lite Express Dashboard | Platform controls | MEDIUM | ✅ **Best fit** |
| **Custom** | Fully custom (you build KYC UI) | None (you build) | Full platform control | VERY HIGH | ❌ Overkill for MVP |

**Express is the right choice because:**
- Stripe handles KYC/onboarding UI (Identity, address verification, bank details)
- Platform controls when and how much money flows to providers
- Providers get a lightweight Express Dashboard to view their payouts
- Minimal frontend work — Stripe's hosted onboarding handles the hard part
- Can upgrade to Custom later if needed

### 2.2 Payment Flow — Milestone-Based Escrow

```
CLIENT                    ALLSQUARED              STRIPE                    PROVIDER
  │                          │                      │                          │
  │ 1. Contract signed       │                      │                          │
  │ ─────────────────────► │                      │                          │
  │                          │                      │                          │
  │ 2. Fund milestones       │                      │                          │
  │ ─────────────────────► │                      │                          │
  │                          │ 3. PaymentIntent     │                          │
  │                          │ (destination charge)  │                          │
  │                          │ ─────────────────► │                          │
  │                          │                      │                          │
  │    Stripe Checkout /     │                      │                          │
  │ ◄─── Elements UI  ────│                      │                          │
  │                          │                      │                          │
  │ 4. Payment confirmed     │                      │                          │
  │ ─────────────────────► │                      │                          │
  │                          │    Funds held in      │                          │
  │                          │    platform balance   │                          │
  │                          │    (escrow state)     │                          │
  │                          │                      │                          │
  │                          │ ... milestone work happens ...                   │
  │                          │                      │                          │
  │ 5. Approve milestone     │                      │                          │
  │ ─────────────────────► │                      │                          │
  │                          │ 6. Transfer to        │                          │
  │                          │    connected account  │                          │
  │                          │ ─────────────────► │ 7. Payout to bank        │
  │                          │                      │ ─────────────────────► │
  │                          │                      │                          │
  │                          │ 8. Platform fee       │                          │
  │                          │    kept in balance    │                          │
```

### 2.3 Two Escrow Strategies (Choose One)

#### Option A: Separate Charges with Manual Transfers ✅ RECOMMENDED

```typescript
// Step 1: Charge client (funds land in PLATFORM's Stripe balance)
const paymentIntent = await stripe.paymentIntents.create({
  amount: milestoneAmount + platformFee,
  currency: 'gbp',
  customer: clientStripeId,
  metadata: {
    contractId, milestoneId, type: 'escrow_deposit'
  },
  // NO transfer_data — funds stay with platform
});

// Step 2: On milestone approval, transfer to provider
const transfer = await stripe.transfers.create({
  amount: milestoneAmount, // Platform keeps the fee
  currency: 'gbp',
  destination: providerConnectedAccountId,
  metadata: {
    contractId, milestoneId, type: 'escrow_release'
  },
});
```

**Pros:**
- Maximum control over when money moves
- Platform fee naturally retained (charge minus transfer)
- Simple refund logic (refund before transfer = straightforward)
- Can hold funds indefinitely within Stripe's limits (90 days for UK)
- Clear audit trail: charge event → hold period → transfer event

**Cons:**
- Platform bears refund liability if funds already spent
- Must manage the "escrow balance" in your own DB

#### Option B: Destination Charges with `transfer_data[amount]`

```typescript
// Charge with transfer scheduled but not executed
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount,
  currency: 'gbp',
  customer: clientStripeId,
  transfer_data: {
    destination: providerConnectedAccountId,
    amount: providerAmount, // Stripe sends this to provider
  },
  // Transfer happens automatically when charge succeeds
});
```

**Cons:** Transfer happens immediately on charge success — no hold period. NOT suitable for escrow.

**→ USE OPTION A.** It gives us escrow-like behavior natively.

### 2.4 Integration with Existing Stack

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React 19)             │
│  Clerk Auth │ Stripe Elements │ tRPC Client      │
└──────────────────────┬──────────────────────────┘
                       │ tRPC calls
┌──────────────────────▼──────────────────────────┐
│                  BACKEND (Express + tRPC)         │
│                                                   │
│  server/routers/                                  │
│  ├── payments.ts  ← REFACTOR (Connect escrow)    │
│  ├── escrow.ts    ← REMOVE (Transpact → Stripe)  │
│  ├── milestones.ts ← MODIFY (trigger transfers)  │
│  ├── contracts.ts  ← MODIFY (escrow status)      │
│  └── webhooks.ts  ← NEW (proper Stripe handling) │
│                                                   │
│  server/_core/                                    │
│  ├── stripe.ts    ← NEW (Stripe SDK singleton)   │
│  └── index.ts     ← MODIFY (webhook routes)      │
│                                                   │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│            DATABASE (Vercel Postgres)              │
│            ORM: Drizzle                            │
│                                                   │
│  Modified tables:                                 │
│  ├── users (already has stripeConnectedAccountId) │
│  ├── escrowTransactions (→ stripeTransfers)        │
│  ├── payments (add transfer tracking)              │
│  └── webhookEvents (already supports stripe)       │
│                                                   │
│  New tables:                                      │
│  └── stripeEvents (idempotency dedup)             │
└─────────────────────────────────────────────────┘
```

### 2.5 Webhook Handling Strategy

The current webhook handlers are **stubs** (just `console.log`). Here's the proper architecture:

```
Stripe Event → POST /api/webhooks/stripe
                   │
                   ▼
              Verify signature (stripe.webhooks.constructEvent)
                   │
                   ▼
              Idempotency check (have we processed this event.id?)
                   │
                   ▼
              Store raw event in webhookEvents table
                   │
                   ▼
              Route to handler by event.type:
              ├── payment_intent.succeeded → update payment status, mark escrow as held
              ├── payment_intent.payment_failed → notify client, mark payment failed
              ├── transfer.created → mark escrow as released
              ├── transfer.reversed → handle reversal (dispute)
              ├── account.updated → update provider onboarding status
              ├── customer.subscription.* → update subscription state
              ├── identity.verification_session.* → update KYC status
              ├── charge.dispute.* → handle Stripe disputes
              └── payout.* → track provider payout status
                   │
                   ▼
              Mark event as processed
              Return 200 immediately (within 5s)
```

**Critical Webhook Events for V2:**

| Event | Priority | Action |
|---|---|---|
| `payment_intent.succeeded` | P0 | Mark escrow funded, notify provider |
| `payment_intent.payment_failed` | P0 | Mark payment failed, notify client |
| `transfer.created` | P0 | Mark escrow released, notify provider |
| `account.updated` | P0 | Update provider onboarding status |
| `customer.subscription.created` | P1 | Activate Pro tier |
| `customer.subscription.deleted` | P1 | Downgrade to Free |
| `charge.dispute.created` | P1 | Flag contract, freeze releases |
| `identity.verification_session.verified` | P1 | Mark KYC passed |
| `identity.verification_session.requires_input` | P2 | Prompt user to retry |
| `payout.failed` | P2 | Alert provider about bank issue |

---

## 3. Feature Breakdown

### 3.1 Milestone Creation & Fund Holding

**Current state:** Milestones exist in DB with basic CRUD. `payments.ts` creates PaymentIntents with `capture_method: 'manual'`.

**Target state:**

```
Contract Created → Milestones Defined → Client Funds All Milestones
                                              │
                                    PaymentIntent per milestone
                                    or single PaymentIntent for total
                                              │
                                    Funds land in platform balance
                                    (escrow state = "held")
                                              │
                            ┌─────────────────┤
                            ▼                 ▼
                    Milestone 1         Milestone 2      ...
                    Provider works      (locked until
                    Submits work         M1 approved)
                            │
                    Client approves
                            │
                    Transfer created to provider
                    escrow state → "released"
```

**Funding approach — two options:**

| Approach | Description | Pros | Cons |
|---|---|---|---|
| **Fund per milestone** | Client pays each milestone individually | Flexible, lower upfront cost | More payment friction |
| **Fund upfront (full)** | Client pays total contract value | One payment, simpler | Higher commitment upfront |

**Recommendation:** Fund per milestone for MVP, with an option to "fund all remaining" for clients who prefer it. This reduces client objections and maps naturally to the milestone lifecycle.

**Implementation:**

```typescript
// POST /api/payments/fund-milestone
async function fundMilestone(milestoneId: string, clientId: string) {
  const milestone = await getMilestone(milestoneId);
  const contract = await getContract(milestone.contractId);
  const tier = await getUserTier(clientId);
  
  const milestoneAmount = parseInt(milestone.amount); // pence
  const platformFee = calculatePlatformFee(milestoneAmount, tier);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: milestoneAmount + platformFee,
    currency: 'gbp',
    customer: clientStripeCustomerId,
    metadata: {
      contractId: contract.id,
      milestoneId: milestone.id,
      escrowAmount: milestoneAmount,
      platformFee: platformFee,
      type: 'escrow_deposit',
    },
  });
  
  // Store escrow record
  await db.insert(escrowTransactions).values({
    id: nanoid(),
    contractId: contract.id,
    milestoneId: milestone.id,
    amount: String(milestoneAmount),
    platformFee: String(platformFee),
    currency: 'GBP',
    status: 'pending',
    stripePaymentIntentId: paymentIntent.id,
    escrowProvider: 'stripe_connect',
  });
  
  return { clientSecret: paymentIntent.client_secret };
}
```

### 3.2 Release Conditions & Logic

Funds release when:

```
Provider submits milestone
    → Client reviews deliverables
        → Client clicks "Approve"
            → Backend verifies:
                ✅ Milestone status = "submitted"
                ✅ User is contract.clientId
                ✅ Escrow status = "held"
                ✅ Provider's Connect account is active
            → stripe.transfers.create()
            → Update milestone status → "paid"
            → Update escrow status → "released"
            → Notify provider
```

**Auto-release safety net (Phase 2):**
- If client doesn't respond within X days after submission, send escalating reminders
- After 14 days of no response → auto-release (configurable per contract)
- This protects providers from client ghosting

**Partial release (Phase 2):**
- Client can approve partial amounts for milestones
- e.g., "Work is 80% acceptable, releasing £800 of £1,000"
- Remaining amount stays in escrow for rework

### 3.3 Dispute Handling

**Phase 1 (MVP) — Manual disputes:**

```
Either party raises dispute
    → Contract status → "disputed"
    → All pending releases frozen
    → Email notification to both parties + AllSquared admin
    → Admin reviews and decides:
        a) Release funds to provider
        b) Refund to client (stripe.refunds.create)
        c) Split (partial release + partial refund)
    → Resolution recorded in disputes table
```

**Phase 2 — Structured dispute flow:**

```
Dispute raised with evidence (file uploads)
    → 48hr cooling period (encourage direct resolution)
    → If unresolved, AI-assisted mediation suggestion
    → If still unresolved, escalate to manual review
    → Resolution with audit trail
```

**Stripe's built-in dispute handling:**
- If a client files a chargeback via their bank, Stripe creates a `charge.dispute.created` event
- AllSquared should immediately freeze all releases for that contract
- Respond to the dispute with evidence via Stripe's API
- This is different from an in-platform dispute — it's a bank-level chargeback

### 3.4 Subscription Billing (Pro Tier)

**Current state:** `payments.ts` already has subscription checkout, cancel, and reactivate. Uses env vars for Stripe Price IDs.

**What needs to change:**

| Item | Current | Target |
|---|---|---|
| Price | £35/mo Pro, £99/mo Enterprise | £29.99/mo Pro (per business plan) |
| Products in Stripe | Not created yet | Create in Stripe Dashboard |
| Free tier limits | Not enforced | 1 contract/month |
| Starter tier | £15/mo, 5 contracts | Keep or remove (simplify to Free/Pro?) |
| Trial | None | 14-day free trial of Pro |
| Annual discount | None | £287.88/year (20% discount) |

**Recommendation:** Simplify to **Free + Pro (£29.99/mo)** for launch. Add Enterprise later when there's demand. Fewer tiers = less code, less confusion.

**Stripe setup needed:**
1. Create Product "AllSquared Pro" in Stripe Dashboard
2. Create two Prices: monthly (£29.99) and annual (£287.88)
3. Set Price IDs in env vars: `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`
4. Use Stripe Billing Portal for self-service management

```typescript
// Let Stripe handle subscription management UI
const portalSession = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: `${APP_URL}/settings/billing`,
});
// Redirect user to portalSession.url
```

### 3.5 KYC / Onboarding Flow

**Provider onboarding journey:**

```
Provider signs up (Clerk auth)
    │
    ▼
Dashboard prompt: "Set up payments to get paid"
    │
    ▼
Click "Connect with Stripe" → Stripe Express onboarding
    │
    ▼ (Stripe handles everything)
    ├── Identity verification (passport/driving licence)
    ├── Address verification
    ├── Business information (sole trader / Ltd)
    ├── Bank account details
    └── Tax information
    │
    ▼
Redirect back to AllSquared → /settings/payments?success=true
    │
    ▼
Webhook: account.updated → check details_submitted + charges_enabled
    │
    ▼
Provider can now receive payouts ✅
```

**This is already partially built** in `payments.ts` (`createConnectedAccount` procedure). Key enhancements needed:

1. **Embedded onboarding** (better UX than redirect):
```typescript
// Use AccountOnboarding component from @stripe/react-connect-js
import { ConnectAccountOnboarding } from '@stripe/react-connect-js';
// Renders Stripe's onboarding UI inline in your app
```

2. **Onboarding status tracking** — persist and display:
   - `not_started` → No Connected Account
   - `in_progress` → Account created, details not submitted
   - `pending_verification` → Submitted, Stripe reviewing
   - `verified` → charges_enabled + payouts_enabled = true
   - `restricted` → Account has restrictions (action required)

3. **KYC for high-value contracts** — Stripe Identity sessions for additional verification:
```typescript
// For contracts > £10,000, require additional identity verification
const verificationSession = await stripe.identity.verificationSessions.create({
  type: 'document',
  metadata: { userId: user.id },
  options: { document: { require_matching_selfie: true } },
});
```

---

## 4. Implementation Phases

### Phase 1: MVP — Core Escrow + Subscriptions (2–3 weeks)

**Goal:** Replace Transpact mocks with working Stripe Connect escrow. Ship V2.

| Week | Tasks | Files Affected |
|---|---|---|
| **Week 1** | **Stripe Foundation** | |
| | Install `stripe` SDK properly (already in deps) | `server/_core/stripe.ts` (NEW) |
| | Create Stripe singleton with proper error handling | |
| | Fix webhook endpoint — proper signature verification | `server/_core/index.ts` |
| | Create dedicated webhook handler module | `server/routers/webhooks.ts` (NEW) |
| | Set up Stripe products/prices in Dashboard | Stripe Dashboard |
| | Refactor `payments.ts` for Option A escrow | `server/routers/payments.ts` |
| | Remove Transpact integration | `server/routers/escrow.ts` → DELETE |
| | | |
| **Week 2** | **Connect Onboarding + Fund Flow** | |
| | Provider Connect onboarding (Express accounts) | `server/routers/payments.ts` |
| | Milestone funding flow (PaymentIntent per milestone) | `server/routers/payments.ts` |
| | Stripe Elements / Checkout on frontend | `client/src/components/StripePayment.tsx` (NEW) |
| | Payment Settings page enhancement | `client/src/pages/PaymentSettings.tsx` |
| | Fund milestone UI on Contract Detail page | `client/src/pages/ContractDetail.tsx` |
| | | |
| **Week 3** | **Release Flow + Subscriptions + Polish** | |
| | Milestone approval → Transfer creation | `server/routers/milestones.ts` |
| | Webhook handlers for all P0 events | `server/routers/webhooks.ts` |
| | Subscription flow with Billing Portal | `server/routers/payments.ts` |
| | Billing page with portal redirect | `client/src/pages/Billing.tsx` |
| | Error handling, loading states, edge cases | Various |
| | Environment variables documentation | `VERCEL_ENV_VARS.md` |

**Deliverables:**
- ✅ Providers can onboard via Stripe Express
- ✅ Clients can fund milestones via card payment
- ✅ Funds held in platform balance until milestone approved
- ✅ Milestone approval triggers transfer to provider
- ✅ Pro subscription with Stripe Billing
- ✅ Webhook handling for all critical events
- ✅ Basic refund capability (admin-triggered)

### Phase 2: Enhanced Features (Weeks 4–6)

| Feature | Effort | Priority |
|---|---|---|
| Stripe Identity for enhanced KYC | 3 days | P1 |
| Auto-release timer (14-day no-response) | 2 days | P1 |
| Stripe Invoicing for contract payments | 2 days | P1 |
| Embedded onboarding (vs redirect) | 2 days | P2 |
| Partial milestone releases | 2 days | P2 |
| Fund-all-milestones-at-once option | 1 day | P2 |
| Payout schedule configuration | 1 day | P2 |
| Revenue dashboard (Stripe reporting) | 3 days | P2 |
| Stripe Tax integration (UK VAT) | 2 days | P2 |
| Email receipts via Stripe | 1 day | P3 |

### Phase 3: Scale (Months 2–3)

| Feature | Notes |
|---|---|
| Multi-currency support | EUR, USD for international freelancers |
| Stripe Radar for fraud detection | Custom rules for high-risk patterns |
| Connected account dashboard (embedded) | `@stripe/react-connect-js` components |
| Instant payouts for providers | Stripe Instant Payouts (additional fee) |
| Subscription analytics | MRR, churn, LTV via Stripe Sigma |
| Custom branding on Stripe-hosted pages | Stripe Connect branding settings |

---

## 5. Technical Specifications

### 5.1 New/Modified API Endpoints (tRPC procedures)

#### Payments Router (refactored)

```typescript
// ===== CONNECT =====
payments.createConnectedAccount   // EXISTING — enhance with embedded onboarding
payments.getConnectStatus         // EXISTING — add detailed status fields
payments.getConnectDashboardLink  // NEW — Express Dashboard login link
payments.refreshOnboarding        // NEW — generate new onboarding link if expired

// ===== ESCROW =====
payments.fundMilestone            // NEW — create PaymentIntent for milestone
payments.fundAllMilestones        // NEW (Phase 2) — fund remaining milestones
payments.releaseMilestone         // NEW — create Transfer on milestone approval  
payments.refundEscrow             // NEW — refund unfunded milestone (admin)
payments.getEscrowStatus          // NEW — current escrow state for a contract

// ===== SUBSCRIPTIONS =====
payments.createSubscriptionCheckout  // EXISTING — simplify tiers
payments.getBillingPortalUrl         // NEW — Stripe Billing Portal session
payments.getSubscription             // EXISTING — keep
payments.cancelSubscription          // EXISTING — keep (or use Billing Portal)

// ===== INVOICING (Phase 2) =====  
payments.createInvoice            // NEW — Stripe Invoice for contract
payments.getInvoices              // NEW — list invoices for user
```

#### Milestones Router (modified)

```typescript
milestones.approve  // MODIFY — after approval, call payments.releaseMilestone
milestones.reject   // EXISTING — keep (no payment action)
milestones.submit   // EXISTING — keep (notifies client)
```

#### Webhooks Router (new)

```typescript
// Not tRPC — raw Express route
POST /api/webhooks/stripe → handleStripeWebhook()
  // Verifies signature
  // Routes to handler by event type
  // Returns 200 quickly
```

### 5.2 Stripe SDK Setup

**New file: `server/_core/stripe.ts`**

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY not set — Stripe features disabled');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia', // Pin to latest stable
      typescript: true,
      appInfo: {
        name: 'AllSquared',
        version: '2.0.0',
        url: 'https://allsquared.io',
      },
    })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) throw new Error('Stripe is not configured');
  return stripe;
}
```

**Why this matters:** The current code makes raw `fetch` calls to `https://api.stripe.com/v1` with URL-encoded params. The Stripe SDK handles:
- Automatic retries on network errors
- Type safety for all API calls
- Proper error types (CardError, InvalidRequestError, etc.)
- Webhook signature verification
- Idempotency key management

### 5.3 Environment Variables

```bash
# === STRIPE (REQUIRED for V2) ===
STRIPE_SECRET_KEY=sk_live_...          # or sk_test_ for development
STRIPE_PUBLISHABLE_KEY=pk_live_...      # or pk_test_ for development
STRIPE_WEBHOOK_SECRET=whsec_...         # from Stripe Dashboard → Webhooks

# === STRIPE PRODUCTS (create in Dashboard first) ===
STRIPE_PRICE_PRO_MONTHLY=price_...      # £29.99/mo
STRIPE_PRICE_PRO_ANNUAL=price_...       # £287.88/yr

# === STRIPE CONNECT ===
STRIPE_CONNECT_CLIENT_ID=ca_...         # from Connect settings (for OAuth flow if needed)

# === STRIPE IDENTITY (Phase 2) ===
# No additional keys — uses same STRIPE_SECRET_KEY

# === REMOVE THESE ===
# TRANSPACT_API_URL (no longer needed)
# TRANSPACT_API_KEY (no longer needed)  
# TRANSPACT_PARTNER_ID (no longer needed)
```

### 5.4 Webhook Signature Verification (Critical Fix)

The current webhook handler is **insecure** — it parses the body without verifying the signature:

```typescript
// CURRENT (INSECURE) — server/_core/index.ts line ~143
const event = JSON.parse(req.body.toString());
```

**Fixed implementation:**

```typescript
import { stripe } from './stripe';

app.post('/api/webhooks/stripe', 
  express.raw({ type: 'application/json' }), // Raw body required!
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!sig || !webhookSecret || !stripe) {
      return res.status(400).json({ error: 'Webhook not configured' });
    }
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Idempotency: check if we've already processed this event
    const existing = await db.select()
      .from(webhookEvents)
      .where(eq(webhookEvents.eventId, event.id))
      .limit(1);
    
    if (existing[0]?.status === 'processed') {
      return res.json({ received: true, duplicate: true });
    }
    
    // Store event
    const webhookId = `webhook_${nanoid(16)}`;
    await db.insert(webhookEvents).values({
      id: webhookId,
      provider: 'stripe',
      eventType: event.type,
      eventId: event.id,
      payload: JSON.stringify(event.data),
      status: 'processing',
      createdAt: new Date(),
    });
    
    // Process asynchronously (return 200 fast)
    res.json({ received: true });
    
    // Handle event
    try {
      await processStripeEvent(event);
      await db.update(webhookEvents)
        .set({ status: 'processed', processedAt: new Date() })
        .where(eq(webhookEvents.id, webhookId));
    } catch (error) {
      await db.update(webhookEvents)
        .set({ status: 'failed', errorMessage: String(error) })
        .where(eq(webhookEvents.id, webhookId));
    }
  }
);
```

### 5.5 Security Considerations

| Concern | Mitigation |
|---|---|
| **Webhook forgery** | Stripe signature verification (see above) |
| **Double-processing** | Idempotency check on event.id in webhookEvents |
| **Unauthorized releases** | Verify `ctx.user.id === contract.clientId` before transfer |
| **Overpayment** | Validate milestone amount matches escrow amount |
| **Race conditions** | Database transactions around status changes |
| **PCI compliance** | Stripe Elements handles card data — never touches our server |
| **Key exposure** | Secret key only in env vars, never in frontend code |
| **Provider impersonation** | Connect account tied to verified identity via Stripe KYC |
| **Platform fund access** | Use Stripe's restricted API keys for different operations |
| **GDPR** | Stripe DPA signed, data processing agreement in place |

---

## 6. Database Schema Changes

### 6.1 Modified: `escrowTransactions` table

```sql
-- Add Stripe-specific columns
ALTER TABLE "escrowTransactions" 
  ADD COLUMN "stripePaymentIntentId" VARCHAR(255),
  ADD COLUMN "stripeTransferId" VARCHAR(255),
  ADD COLUMN "stripeRefundId" VARCHAR(255),
  ADD COLUMN "platformFee" VARCHAR(20) DEFAULT '0',
  ADD COLUMN "providerAmount" VARCHAR(20);

-- Update escrowProvider default
-- Old: 'Transpact' → New: 'stripe_connect'
```

**In Drizzle schema:**

```typescript
export const escrowTransactions = pgTable("escrowTransactions", {
  // ... existing fields ...
  
  // NEW fields
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  stripeRefundId: varchar("stripeRefundId", { length: 255 }),
  platformFee: varchar("platformFee", { length: 20 }).default("0"),
  providerAmount: varchar("providerAmount", { length: 20 }),
});
```

### 6.2 Modified: `users` table

Already has `stripeCustomerId` and `stripeConnectedAccountId`. Add:

```typescript
// Add to users table
stripeConnectOnboardingStatus: varchar("stripeConnectOnboardingStatus", { length: 50 }),
// Values: 'not_started' | 'in_progress' | 'pending_verification' | 'verified' | 'restricted'
stripeConnectPayoutsEnabled: varchar("stripeConnectPayoutsEnabled", { length: 3 }).default("no"),
stripeConnectChargesEnabled: varchar("stripeConnectChargesEnabled", { length: 3 }).default("no"),
```

### 6.3 Modified: `webhookEvents` table

Add index and update provider enum:

```typescript
// Add 'stripe_connect' to webhookProviderEnum (or just use 'stripe')
// Add index on eventId for idempotency lookups
```

### 6.4 No New Tables Needed

The existing schema is well-designed. We just need to add Stripe-specific columns to existing tables. The `payments`, `escrowTransactions`, `webhookEvents`, and `subscriptions` tables already model the right concepts.

### 6.5 Migration Script

```typescript
// drizzle migration
import { sql } from 'drizzle-orm';

export async function up(db) {
  await db.execute(sql`
    ALTER TABLE "escrowTransactions" 
      ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "stripeTransferId" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "stripeRefundId" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "platformFee" VARCHAR(20) DEFAULT '0',
      ADD COLUMN IF NOT EXISTS "providerAmount" VARCHAR(20);
      
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "stripeConnectOnboardingStatus" VARCHAR(50) DEFAULT 'not_started',
      ADD COLUMN IF NOT EXISTS "stripeConnectPayoutsEnabled" VARCHAR(3) DEFAULT 'no',
      ADD COLUMN IF NOT EXISTS "stripeConnectChargesEnabled" VARCHAR(3) DEFAULT 'no';
  `);
}
```

---

## 7. Frontend Components

### 7.1 New Components

| Component | Purpose | Stripe Dependency |
|---|---|---|
| `StripeProvider.tsx` | Wraps app with Stripe Elements context | `@stripe/react-stripe-js` |
| `PaymentForm.tsx` | Card input for milestone funding | Stripe Elements `<PaymentElement>` |
| `ConnectOnboarding.tsx` | Provider onboarding UI | `@stripe/react-connect-js` |
| `EscrowStatus.tsx` | Shows escrow state per milestone | None (reads from DB) |
| `FundMilestoneButton.tsx` | "Fund This Milestone" CTA | Triggers PaymentIntent creation |
| `ReleaseFundsButton.tsx` | "Approve & Release" CTA (client) | Triggers Transfer creation |
| `ProviderPayoutBanner.tsx` | Prompt to complete Stripe onboarding | None |
| `SubscriptionCard.tsx` | Pro tier upgrade CTA | Redirects to Stripe Checkout |

### 7.2 Modified Pages

| Page | Changes |
|---|---|
| `ContractDetail.tsx` | Add escrow status per milestone, fund/release buttons |
| `PaymentSettings.tsx` | Enhance Connect onboarding status, payout info |
| `Billing.tsx` | Add Billing Portal link, simplify tier display |
| `Dashboard.tsx` | Show escrow summary (held, released, pending) |
| `NewContract.tsx` | Add payment terms to contract creation wizard |

### 7.3 Package Dependencies

```bash
# Already installed
stripe  # Backend SDK ✅

# Need to install
pnpm add @stripe/react-stripe-js @stripe/stripe-js
# For embedded Connect onboarding (Phase 2):
pnpm add @stripe/react-connect-js
```

### 7.4 Stripe Elements Setup

```tsx
// client/src/components/StripeProvider.tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise} options={{ locale: 'en-GB' }}>
      {children}
    </Elements>
  );
}
```

---

## 8. Testing Strategy

### 8.1 Stripe Test Mode

All development uses Stripe's test mode (keys starting with `sk_test_` / `pk_test_`).

**Test cards:**
| Card | Behavior |
|---|---|
| `4242 4242 4242 4242` | Succeeds |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure |
| `4000 0000 0000 3220` | 3D Secure 2 (required) |

**Test bank accounts (for Connect payouts):**
| Sort Code | Account Number | Behavior |
|---|---|---|
| `108800` | `00012345` | Succeeds |
| `108800` | `00000002` | Fails |

### 8.2 Test Scenarios

#### P0 — Must pass before launch

| # | Scenario | Steps | Expected |
|---|---|---|---|
| 1 | Provider onboarding | Create Connect account → Complete Stripe onboarding | `charges_enabled: true`, status shows verified |
| 2 | Client funds milestone | Create PaymentIntent → Complete payment | Payment succeeds, escrow status = "held" |
| 3 | Milestone release | Approve milestone → Verify transfer created | Transfer to connected account, escrow = "released" |
| 4 | Full contract lifecycle | Create → Sign → Fund → Submit → Approve → Paid | All statuses correct, money flows end-to-end |
| 5 | Webhook processing | Trigger test webhook from Stripe CLI | Events stored and processed correctly |
| 6 | Payment failure | Use declining test card | Error shown to client, escrow stays "pending" |
| 7 | Subscription signup | Subscribe to Pro → Verify in DB | Subscription active, tier = "pro" |
| 8 | Subscription cancel | Cancel subscription | `cancel_at_period_end: true`, downgrades at end |

#### P1 — Should pass before launch

| # | Scenario | Expected |
|---|---|---|
| 9 | 3D Secure payment | SCA challenge shown, payment completes after auth |
| 10 | Webhook idempotency | Same event sent twice → processed only once |
| 11 | Refund before transfer | Admin refunds → client gets money back |
| 12 | Provider without Connect | Milestone approved but provider not onboarded → release queued |
| 13 | Multiple milestones | Fund M1, fund M2, release M1, release M2 independently |
| 14 | Connect account restricted | Provider has issues → banner shown, releases paused |

#### P2 — Edge cases

| # | Scenario | Expected |
|---|---|---|
| 15 | Partial refund | Refund part of escrow, rest still held |
| 16 | Currency mismatch | All amounts in GBP, reject non-GBP |
| 17 | Extremely large payment (>£50K) | Stripe limits respected, proper error handling |
| 18 | Provider deletes Connect account | Transfers fail gracefully, admin notified |
| 19 | Client disputes charge with bank | Charge dispute webhook → freeze contract |
| 20 | Subscription + escrow on same customer | Both work independently, no interference |

### 8.3 Testing Tools

```bash
# Install Stripe CLI for local webhook testing
brew install stripe/stripe-cli/stripe  # macOS
# or
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# Forward webhooks to local dev server
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger account.updated
stripe trigger customer.subscription.created
```

---

## 9. Onboarding & Compliance

### 9.1 What Eli Needs to Do in Stripe Dashboard

| Step | Action | Time | Notes |
|---|---|---|---|
| 1 | **Create Stripe account** | 10 min | Use Nakamoto Labs business details |
| 2 | **Activate Connect** | 15 min | Settings → Connect → Enable |
| 3 | **Configure Connect settings** | 20 min | Set platform name, icon, brand color |
| 4 | **Set Express account countries** | 5 min | Enable UK (GB) initially |
| 5 | **Create Products & Prices** | 10 min | "AllSquared Pro" — £29.99/mo, £287.88/yr |
| 6 | **Set up webhook endpoint** | 5 min | URL: `https://allsquared.io/api/webhooks/stripe` |
| 7 | **Configure webhook events** | 10 min | Select all events listed in §2.5 |
| 8 | **Generate API keys** | 5 min | Secret key → env, Publishable key → env |
| 9 | **Set branding** | 15 min | Logo, colors for Checkout/Elements |
| 10 | **Enable Stripe Identity** (Phase 2) | 5 min | Settings → Identity → Enable |

**Total setup time: ~1.5 hours**

### 9.2 Business Verification for the Platform Account

Stripe will verify Nakamoto Labs as the platform operator:

| Requirement | What to Provide |
|---|---|
| Business name | Nakamoto Labs Ltd (or whatever entity) |
| Business type | Private limited company |
| Company number | Companies House registration |
| Registered address | UK business address |
| Director details | Eli's name, DOB, address |
| Bank account | UK business bank account for platform payouts |
| Website | allsquared.io (must be live) |
| Business description | "Freelance contract and escrow platform" |

**Timeline:** Stripe typically verifies UK businesses within 2-5 business days. Express Connect activation may take an additional 1-2 days for platform approval.

### 9.3 Regulatory Considerations

| Concern | Status |
|---|---|
| **FCA authorization** | NOT needed — Stripe holds the EMI license. AllSquared is the agent/platform. |
| **PCI DSS** | NOT needed — Stripe Elements/Checkout handles card data. AllSquared never sees card numbers. |
| **AML/KYC** | Handled by Stripe for connected accounts. Platform should keep own records. |
| **GDPR** | Stripe's DPA covers their processing. AllSquared needs its own privacy policy covering Stripe data sharing. |
| **Consumer credit** | NOT applicable — escrow is not credit. |
| **Payment Services Regulations** | Stripe is the regulated payment service provider. AllSquared operates under Stripe's license. |
| **SCA (Strong Customer Auth)** | Stripe handles SCA/3DS automatically for UK/EU cards. |

### 9.4 Terms of Service Updates

AllSquared's Terms need to cover:
- Platform fees and how they're calculated
- Escrow terms (funds held by Stripe, not AllSquared)
- Refund policy (when and how)
- Dispute resolution process
- Stripe's terms apply for payment processing
- 90-day maximum hold period
- Provider payout timelines (typically T+2 after transfer)

---

## 10. Risk Register & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Stripe rejects platform application | Low | Critical | Apply early, have backup (Transpact). Business model is legitimate. |
| 90-day hold limit exceeded | Low | High | Milestones should release well before 90 days. Add countdown warnings. |
| Provider doesn't complete onboarding | Medium | Medium | Queue releases, send reminders. Allow manual bank transfer as fallback. |
| Client chargeback after release | Medium | High | Keep escrow evidence, respond to disputes quickly. Consider chargeback insurance. |
| Double-release bug | Low | Critical | Database transactions, idempotency checks, status validation before every transfer. |
| Webhook delivery failure | Medium | Medium | Stripe retries for 72 hours. Idempotent handlers. Manual reconciliation script. |
| Stripe service outage | Low | High | Graceful degradation — show "Payment temporarily unavailable." Stripe has 99.99% uptime. |
| Exchange rate (multi-currency) | Low (GBP only at launch) | Low | Defer until Phase 3. GBP only for now. |

---

## 11. Decision Log

| Decision | Choice | Rationale | Date |
|---|---|---|---|
| Escrow provider | Stripe Connect (replacing Transpact) | Single integration, better DX, already partially built | 2025-07-17 |
| Account type | Express | Balance of control vs onboarding simplicity | 2025-07-17 |
| Escrow mechanism | Separate charges + manual transfers (Option A) | Maximum control over hold/release timing | 2025-07-17 |
| Funding approach | Per-milestone | Lower friction, natural mapping to workflow | 2025-07-17 |
| Subscription tiers | Free + Pro (£29.99) | Simplicity for launch, add tiers later | 2025-07-17 |
| Stripe SDK vs raw fetch | Stripe SDK | Type safety, retries, signature verification | 2025-07-17 |
| Webhook handling | Async processing, return 200 fast | Stripe 5-second timeout, reliability | 2025-07-17 |

---

## Quick-Start Checklist for Monday Morning

```
□ 1. Create Stripe account (or log into existing) at dashboard.stripe.com
□ 2. Enable Test Mode (toggle in Dashboard)
□ 3. Go to Connect → Get Started → Enable Express accounts for GB
□ 4. Create Product "AllSquared Pro" with monthly price £29.99
□ 5. Copy API keys (test mode) into .env:
      STRIPE_SECRET_KEY=sk_test_...
      STRIPE_PUBLISHABLE_KEY=pk_test_...
□ 6. Set up webhook endpoint in Dashboard:
      URL: http://localhost:5000/api/webhooks/stripe (dev)
      Copy signing secret → STRIPE_WEBHOOK_SECRET=whsec_...
□ 7. Install Stripe CLI: brew install stripe/stripe-cli/stripe
□ 8. Run: stripe listen --forward-to localhost:5000/api/webhooks/stripe
□ 9. Start coding Phase 1, Week 1 tasks
```

---

*This plan was built from a thorough review of the AllSquared codebase (`Nakamoto-Labs/allsquared`), including the Drizzle schema (17 tables), tRPC routers (payments, escrow, milestones, signatures), Express webhook stubs, and existing Stripe/Transpact integration code. All recommendations are grounded in the actual code, not hypothetical.*
