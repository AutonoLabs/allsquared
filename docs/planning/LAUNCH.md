# AllSquared — Launch Checklist

**Last updated:** 2026-02-08
**Status:** 🟡 Deployed to Vercel, NOT fully functional  
**Live URL:** https://allsquared.io (serves static frontend only)

---

## Current State Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Codebase** | ✅ Complete | 26K+ LoC TypeScript, 96 pages/components |
| **GitHub** | ✅ `Nakamoto-Labs/allsquared` | 20 commits, Clerk auth merged |
| **Vercel Project** | ✅ Deployed | `nakamoto-labs/allsquared`, last deploy Feb 1 |
| **Domain** | ✅ `allsquared.io` on Vercel | DNS via CloudFlare, SSL active |
| **Auth (Clerk)** | ⚠️ Code ready, keys missing | `VITE_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` not set |
| **Database** | ❌ Not provisioned | Vercel Postgres not attached; 0 env vars set |
| **Firebase Storage** | ❌ Not configured | File uploads won't work |
| **Env Variables** | ❌ None set on Vercel | `vercel env ls` → empty |

**Bottom line:** The marketing site renders at allsquared.io but the app is non-functional — no auth, no database, no file storage. It's a ~2-3 hour setup to go live.

---

## 🔴 Blockers (Need Eli)

### 1. Clerk Account + API Keys
- **What:** Create a Clerk application at https://clerk.com
- **Keys needed:**
  - `VITE_CLERK_PUBLISHABLE_KEY` (client-side)
  - `CLERK_SECRET_KEY` (server-side)
- **Time:** 5 min
- **Impact:** Without this, nobody can sign up or log in

### 2. Database — Vercel Postgres
- **What:** Provision a Postgres database in Vercel dashboard
- **Steps:**
  1. Go to https://vercel.com/nakamoto-labs/allsquared → Storage tab
  2. Create Database → Postgres
  3. Name: `allsquared-db`
  4. Region: `lhr1` (London) — closest to UK users
  5. Link to project
- **Auto-sets:** `DATABASE_URL`, `POSTGRES_URL`, etc.
- **Then run:** `pnpm db:push` to create 17 tables
- **Time:** 15 min
- **Impact:** All data operations crash without this

### 3. Firebase Project (for file uploads)
- **What:** Create Firebase project → enable Storage
- **Keys needed:**
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_STORAGE_BUCKET`
- **Time:** 20 min
- **Impact:** Milestone deliverable uploads won't work (soft blocker — MVP can launch without)

---

## 🟢 Environment Variables — Full List

Set all of these in Vercel → Settings → Environment Variables:

### Required for Launch

| Variable | Value | Source |
|----------|-------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Clerk dashboard |
| `CLERK_SECRET_KEY` | `sk_live_...` | Clerk dashboard |
| `DATABASE_URL` | `postgres://...` | Auto from Vercel Postgres |
| `JWT_SECRET` | `openssl rand -hex 32` | Generate |
| `NODE_ENV` | `production` | Set manually |
| `VITE_APP_TITLE` | `AllSquared` | Set manually |
| `VITE_APP_LOGO` | `/logo.png` | Set manually |

### Required for Phase 2

| Variable | Purpose | Source |
|----------|---------|--------|
| `STRIPE_SECRET_KEY` | Payments | Stripe dashboard |
| `STRIPE_PUBLISHABLE_KEY` | Client payments | Stripe dashboard |
| `FIREBASE_PROJECT_ID` | File storage | Firebase console |
| `FIREBASE_CLIENT_EMAIL` | File storage | Firebase service account |
| `FIREBASE_PRIVATE_KEY` | File storage | Firebase service account |
| `FIREBASE_STORAGE_BUCKET` | File storage | Firebase console |
| `OPENAI_API_KEY` | AI contract generation | OpenAI dashboard |
| `SENTRY_DSN` | Error tracking | Sentry project |

---

## Deployment Steps (After Blockers Resolved)

### Step 1: Set Env Vars (10 min)
```bash
# Generate JWT secret
openssl rand -hex 32

# Set vars in Vercel (or via CLI)
vercel env add VITE_CLERK_PUBLISHABLE_KEY --scope nakamoto-labs
vercel env add CLERK_SECRET_KEY --scope nakamoto-labs
vercel env add JWT_SECRET --scope nakamoto-labs
vercel env add NODE_ENV --scope nakamoto-labs  # value: production
vercel env add VITE_APP_TITLE --scope nakamoto-labs  # value: AllSquared
```

### Step 2: Provision Database (15 min)
```bash
# After Vercel Postgres is created and linked:
cd /tmp/allsquared
vercel env pull .env.local --scope nakamoto-labs
pnpm install
pnpm db:push
```

### Step 3: Redeploy (5 min)
```bash
vercel --prod --scope nakamoto-labs
# Or just push to main — auto-deploys
```

### Step 4: Verify
- [ ] Homepage loads at https://allsquared.io
- [ ] Sign up with Clerk works
- [ ] Dashboard loads after login
- [ ] Create a test contract (wizard flow)
- [ ] Add milestones to contract
- [ ] Notifications appear
- [ ] Profile page works
- [ ] Admin panel at /admin works

---

## Domain Setup

### allsquared.io ✅ Done
- Already added to Vercel project
- DNS routed via CloudFlare
- SSL active
- Serving `x-vercel-cache: HIT`

### allsquared.uk ❓ Status Unknown
- Referenced in meta tags and README
- Not confirmed where DNS is managed
- **Action:** Eli to confirm registrar → add CNAME `cname.vercel-dns.com`

### DNS Records (if needed elsewhere)
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

---

## What's Built (Feature Inventory)

### Marketing Pages (11 pages) ✅
- Home, About, How It Works, Features, Pricing
- Freelancers, Clients, Legal Services
- Contact, Terms, Privacy

### App Pages (12 pages) ✅
- Dashboard (stats overview)
- Contracts (list, detail, create wizard)
- Milestones (submission, approval/rejection)
- Templates (browse, edit)
- Profile management
- Billing & Payment Settings
- Notification center

### Admin Panel (7 pages) ✅
- Dashboard, Users, User Detail
- Contracts, Disputes, KYC
- Analytics, Audit Logs

### Backend API (10 routers) ✅
- contracts, milestones, notifications, templates
- files, ai, payments, escrow, signatures, admin

### Database (17 tables) ✅
- users, contracts, milestones, escrowTransactions
- disputes, litlReferrals, notifications, contractTemplates
- fileAttachments, subscriptions, payments, auditLogs
- kycVerifications, signatures, webhookEvents, aiGenerations

---

## What's Missing for Launch

### Critical Path (Must Have)
1. ❌ Clerk keys configured
2. ❌ Database provisioned
3. ❌ End-to-end smoke test

### Important (Should Have for Credibility)
4. ❌ Real contract templates seeded
5. ❌ Email notifications (SendGrid/Resend)
6. ❌ Analytics (PostHog/Vercel Analytics is included)
7. ❌ Error monitoring (Sentry)

### Phase 2 (Not Blocking Launch)
8. ❌ Stripe payments integration
9. ❌ Escrow provider (Riverside/Transpact)
10. ❌ AI contract generation (OpenAI)
11. ❌ File uploads (Firebase)
12. ❌ Mobile responsive testing
13. ❌ SEO optimization (meta tags exist but need OG images)

---

## Pre-Launch Testing Checklist

### Authentication
- [ ] Sign up with email
- [ ] Sign up with Google OAuth
- [ ] Log in / Log out
- [ ] Session persistence across page refresh
- [ ] Protected routes redirect to login

### Core Flow
- [ ] Create contract via wizard (all 5 categories)
- [ ] Add milestones to contract
- [ ] Submit milestone for approval
- [ ] Approve/reject milestone
- [ ] Contract status transitions (draft → pending → active → completed)
- [ ] Notifications appear for contract events

### User Experience
- [ ] Dashboard stats populate correctly
- [ ] Profile update works
- [ ] Template browsing works
- [ ] Mobile responsive (key pages)
- [ ] Error states handled gracefully

### Admin
- [ ] Admin can view all users
- [ ] Admin can view all contracts
- [ ] Admin dashboard shows platform stats

### Security
- [ ] Non-admin can't access /admin routes
- [ ] Users can only see their own contracts
- [ ] CSRF / XSS protections active (headers confirmed)

---

## Timeline to Launch

| Task | Owner | Time | Dependency |
|------|-------|------|------------|
| Create Clerk account + keys | Eli | 5 min | None |
| Provision Vercel Postgres | Eli/Ada | 15 min | None |
| Set env vars | Ada | 10 min | Clerk keys |
| Run db:push | Ada | 5 min | Database |
| Seed templates | Ada | 30 min | Database |
| Redeploy | Ada | 5 min | All above |
| Smoke test | Ada | 1 hour | Deploy |
| **Total** | | **~2-3 hours** | |

---

*Sprint reviewed: 2026-02-08 by Ada*
