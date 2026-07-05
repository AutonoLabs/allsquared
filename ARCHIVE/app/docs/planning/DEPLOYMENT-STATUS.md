# AllSquared Deployment Status

**Date**: 2025-01-21
**Target Domain**: allsquared.io

---

## Quick Status

| Component | Status | Blocker? |
|-----------|--------|----------|
| Codebase | ✅ Ready | No |
| GitHub Repo | ✅ Connected | No |
| Vercel Project | ✅ Exists | No |
| Vercel CLI | ✅ Logged in (capitelist) | No |
| Database | ⚠️ Not provisioned | Yes |
| Auth System | ❌ Wrong provider | **YES - CRITICAL** |
| Firebase Storage | ⚠️ Not configured | Soft blocker |
| Domain (allsquared.io) | ⚠️ Need DNS access | Yes |
| ENV Variables | ⚠️ Incomplete | Yes |

---

## Vercel Project

**Status**: ✅ Exists and configured

- **Team**: nakamoto-labs
- **Project ID**: `prj_XHUYrF0LqOo9H85SgoOdbiSwBClA`
- **CLI authenticated**: Yes (as `capitelist`)

**vercel.json**: Properly configured
- Build command: `pnpm build`
- Output directory: `dist/public`
- Node version: 20
- Rewrites configured for SPA + API

---

## Environment Variables Required

### Currently Required (with Manus auth)

| Variable | Status | Notes |
|----------|--------|-------|
| `VITE_APP_ID` | ❌ Missing | Manus app ID - **see AUTH-DECISION.md** |
| `JWT_SECRET` | ❌ Missing | Generate: `openssl rand -hex 32` |
| `DATABASE_URL` | ❌ Missing | From Vercel Postgres |
| `OAUTH_SERVER_URL` | ✅ Fixed | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | ✅ Fixed | `https://vida.manus.im` |
| `OWNER_OPEN_ID` | ❌ Missing | Manus owner ID |
| `NODE_ENV` | ✅ Default | `production` |

### If Swapping to Clerk

| Variable | Status | Notes |
|----------|--------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | ❌ Need | From Clerk dashboard |
| `CLERK_SECRET_KEY` | ❌ Need | From Clerk dashboard |
| `JWT_SECRET` | ❌ Need | Generate |
| `DATABASE_URL` | ❌ Need | From Vercel Postgres |

### Firebase (for file uploads)

| Variable | Status | Notes |
|----------|--------|-------|
| `FIREBASE_PROJECT_ID` | ❌ Missing | Create project first |
| `FIREBASE_CLIENT_EMAIL` | ❌ Missing | From service account |
| `FIREBASE_PRIVATE_KEY` | ❌ Missing | From service account |
| `FIREBASE_STORAGE_BUCKET` | ❌ Missing | `{project}.appspot.com` |

### Optional (Phase 2)

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | AI contract generation |
| `STRIPE_SECRET_KEY` | Payments |
| `STRIPE_PUBLISHABLE_KEY` | Payments |
| `SENTRY_DSN` | Error tracking |

---

## Database Setup

### Steps to Provision Vercel Postgres

1. Go to: https://vercel.com/nakamoto-labs/allsquared
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name: `allsquared-db`
5. Region: `iad1` (Washington DC) or `lhr1` (London) for UK users
6. Click **Create**

Vercel will auto-add these ENV vars:
- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Run Migrations

After Postgres is provisioned:

```bash
cd ~/repos/allsquared

# Pull env vars from Vercel
vercel env pull .env.local

# Run migrations
pnpm db:push
```

Or directly:

```bash
export DATABASE_URL="postgres://default:PASSWORD@HOST/verceldb?sslmode=require"
pnpm db:push
```

### Schema Validation

The schema at `drizzle/schema.ts` defines **17 tables**:
- users
- contracts
- contractTemplates
- milestones
- escrowTransactions
- disputes
- litlReferrals
- notifications
- fileAttachments
- subscriptions
- payments
- auditLogs
- kycVerifications
- signatures
- webhookEvents
- aiGenerations

All use Drizzle ORM with `pg` driver.

---

## Domain Configuration

### allsquared.io (Hostinger)

**Status**: ⚠️ Need Hostinger login

**Action needed**: Eli to provide Hostinger credentials or configure DNS:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### allsquared.uk

**Status**: ❓ Unknown location

Checked Bitwarden for Cloudflare credentials — no username found.

**Eli to confirm**: Is allsquared.uk in Cloudflare, Hostinger, or elsewhere?

### Adding Domains to Vercel

1. Go to Project → Settings → Domains
2. Add `allsquared.io`
3. Add `www.allsquared.io`
4. Optionally add `.uk` variants
5. Vercel will show DNS records needed
6. SSL auto-provisions after DNS propagates

---

## Deployment Commands

### Local Test

```bash
cd ~/repos/allsquared
pnpm install
pnpm build
```

### Deploy to Vercel

**Option A: Git push (recommended)**
```bash
cd ~/repos/allsquared
git push origin main
# Vercel auto-deploys on push
```

**Option B: Vercel CLI**
```bash
cd ~/repos/allsquared
vercel --prod --team nakamoto-labs
```

### Post-Deploy

```bash
# Pull production env vars
vercel env pull .env.production.local

# Push database schema
pnpm db:push
```

---

## Build Notes

From `package.json`:
- **Build**: `vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
- **Node**: 20.x required
- **pnpm**: 9.x required

The build produces:
- `dist/public/` — Static frontend assets
- `dist/index.js` — Server bundle

Vercel handles serving via `api/` serverless functions + static from `dist/public/`.

---

*Last Updated: 2025-01-21*
