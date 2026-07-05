# AllSquared Launch Plan - allsquared.io

**Created**: 2025-01-21
**Updated**: 2025-01-21 (Tech Lead Assessment Complete)
**Target**: Get AllSquared live at allsquared.io
**Estimated Total Time**: 6-8 hours (including auth swap)

---

## ✅ AUTH SWAP COMPLETE - Clerk Already Implemented!

**Good news: The codebase has already been migrated to Clerk authentication!**

**Evidence found:**
- `client/src/lib/clerk.tsx` — ClerkProvider component ✅
- `client/src/hooks/useAuth.ts` — Uses `@clerk/clerk-react` ✅
- `server/_core/env.ts` — Supports `CLERK_SECRET_KEY` ✅

**Remaining steps:**
1. Create Clerk account at clerk.com (5 min)
2. Create AllSquared application in Clerk dashboard
3. Add env vars to Vercel:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

**See: `/root/clawd/allsquared/DEPLOYMENT-GUIDE.md` for full setup**

---

---

## 📊 Current State Summary

| Item | Status | Notes |
|------|--------|-------|
| **Codebase** | ✅ Complete | MVP built, 168 files, ~15k LOC |
| **GitHub** | ✅ Connected | Nakamoto-Labs/allsquared, main branch clean |
| **Vercel Project** | ✅ Exists | prj_XHUYrF0LqOo9H85SgoOdbiSwBClA, CLI logged in |
| **Database** | ❌ Not provisioned | Needs Vercel Postgres setup (15 min) |
| **Auth (Clerk)** | ✅ **IMPLEMENTED** | Code ready, just needs Clerk credentials |
| **Firebase** | ❌ Not configured | Need to create project & credentials |
| **Domain (allsquared.io)** | 🔒 Pending | Hostinger - no creds in Bitwarden |
| **Domain (allsquared.uk)** | ❓ Unknown | Not found in Bitwarden/Cloudflare |

---

## 🚨 Critical Blockers

### 1. ✅ Auth System - CLERK ALREADY IMPLEMENTED

**The code swap is complete!** The hooks and providers are ready:
- `@clerk/clerk-react` already in use
- ClerkProvider wrapping app
- useAuth hook using Clerk

**To activate (15 min):**
1. Create Clerk account at https://clerk.com
2. Create "AllSquared" application
3. Enable Email + Google OAuth sign-in methods
4. Copy API keys to Vercel env vars:
   - `VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx`
   - `CLERK_SECRET_KEY=sk_live_xxx`

**Full guide**: `/root/clawd/allsquared/DEPLOYMENT-GUIDE.md`

---

### 2. Domain Access (NEEDS ELI)
- **allsquared.io**: Hosted at Hostinger - need login credentials
- **allsquared.uk**: Check if this is in your Cloudflare account

---

## ✅ Step-by-Step Deployment Checklist

### Phase 1: Database Setup (15 mins)
**Time estimate**: 15 minutes

- [ ] **1.1** Go to Vercel Dashboard → Project → Storage
- [ ] **1.2** Click "Create Database" → Select "Postgres"
- [ ] **1.3** Name it: `allsquared-db`
- [ ] **1.4** Select region: `iad1 (Washington D.C.)` or closest to UK users
- [ ] **1.5** Click "Create"
- [ ] **1.6** Vercel automatically adds `DATABASE_URL`, `POSTGRES_*` env vars
- [ ] **1.7** Note the connection string format:
  ```
  postgres://default:PASSWORD@HOST/verceldb?sslmode=require
  ```

---

### Phase 2: Firebase Setup (30 mins)
**Time estimate**: 30 minutes

#### 2.1 Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Name: `allsquared-production`
- [ ] Disable Google Analytics (not needed for MVP)
- [ ] Click "Create project"

#### 2.2 Enable Firebase Storage
- [ ] Go to Build → Storage
- [ ] Click "Get started"
- [ ] Select "Start in production mode"
- [ ] Choose location: `europe-west2 (London)`
- [ ] Click "Done"

#### 2.3 Generate Service Account Key
- [ ] Go to Project Settings (⚙️) → Service accounts
- [ ] Click "Generate new private key"
- [ ] **SAVE THE JSON FILE SECURELY**

#### 2.4 Configure Security Rules
Go to Storage → Rules, paste:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 2.5 Extract Credentials from JSON
From the downloaded JSON, you need:
```
FIREBASE_PROJECT_ID=allsquared-production
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@allsquared-production.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=allsquared-production.appspot.com
```

---

### Phase 3: Environment Variables (20 mins)
**Time estimate**: 20 minutes

Go to Vercel → Project → Settings → Environment Variables

#### 3.1 Required Variables

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `VITE_APP_ID` | `your-manus-app-id` | 🔒 Manus dashboard |
| `JWT_SECRET` | Generate (see below) | Generate yourself |
| `DATABASE_URL` | Auto-added by Vercel Postgres | Already set |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | Fixed value |
| `VITE_OAUTH_PORTAL_URL` | `https://vida.manus.im` | Fixed value |
| `OWNER_OPEN_ID` | `your-manus-owner-id` | 🔒 Manus dashboard |
| `OWNER_NAME` | `Eli Bernstein` (or similar) | Your name |
| `VITE_APP_TITLE` | `AllSquared` | Fixed |
| `VITE_APP_LOGO` | `/logo.png` | Fixed |
| `NODE_ENV` | `production` | Fixed |

#### 3.2 Firebase Variables

| Variable | Value |
|----------|-------|
| `FIREBASE_PROJECT_ID` | `allsquared-production` |
| `FIREBASE_CLIENT_EMAIL` | From service account JSON |
| `FIREBASE_PRIVATE_KEY` | From service account JSON (full key with \n) |
| `FIREBASE_STORAGE_BUCKET` | `allsquared-production.appspot.com` |

#### 3.3 Generate JWT Secret
Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Or:
```bash
openssl rand -hex 32
```

#### 3.4 Optional Variables (Phase 2)

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `OPENAI_API_KEY` | AI contract generation | OpenAI dashboard |
| `STRIPE_SECRET_KEY` | Payment processing | Stripe dashboard |
| `STRIPE_PUBLISHABLE_KEY` | Payment processing | Stripe dashboard |
| `SENTRY_DSN` | Error tracking | Sentry dashboard |

---

### Phase 4: Deploy to Vercel (10 mins)
**Time estimate**: 10 minutes

- [ ] **4.1** Ensure all env vars are set
- [ ] **4.2** Go to Vercel Dashboard → Project → Deployments
- [ ] **4.3** Click "Redeploy" on latest deployment
- [ ] **4.4** Or push any commit to trigger auto-deploy:
  ```bash
  cd ~/repos/allsquared
  git commit --allow-empty -m "trigger: initial deployment"
  git push origin main
  ```
- [ ] **4.5** Watch build logs for errors
- [ ] **4.6** Build command: `pnpm build`
- [ ] **4.7** Output directory: `dist/public`
- [ ] **4.8** Node version: `20.x`

#### Expected Build Settings (vercel.json already configured):
```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "framework": null
}
```

---

### Phase 5: Database Migration (5 mins)
**Time estimate**: 5 minutes

After first successful deploy, push the schema:

```bash
cd ~/repos/allsquared

# Set DATABASE_URL from Vercel (copy from Vercel dashboard)
export DATABASE_URL="postgres://default:PASSWORD@HOST/verceldb?sslmode=require"

# Install deps if needed
pnpm install

# Generate and run migrations
pnpm db:push
```

Or via Vercel CLI:
```bash
vercel env pull .env.local
source .env.local
pnpm db:push
```

---

### Phase 6: Domain Configuration (15-30 mins)
**Time estimate**: 15-30 minutes (depends on DNS propagation)

#### 6.1 Add Domains in Vercel
- [ ] Go to Project → Settings → Domains
- [ ] Add: `allsquared.io`
- [ ] Add: `www.allsquared.io`
- [ ] Optionally add: `allsquared.uk`, `www.allsquared.uk`

#### 6.2 Configure DNS at Hostinger (allsquared.io)

**For apex domain (allsquared.io)**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 6.3 Configure DNS at Cloudflare (allsquared.uk) - if applicable

Same records as above, but in Cloudflare:
- **A Record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`
- Set proxy status to "DNS only" (grey cloud) initially

#### 6.4 SSL Certificates
- Vercel auto-provisions SSL certificates
- Wait 5-30 minutes after DNS propagation
- Check: https://allsquared.io should show green lock

---

## 🧪 Post-Deployment Verification

### Checklist
- [ ] **Site loads**: https://allsquared.io
- [ ] **HTTPS works**: Green lock icon
- [ ] **Homepage renders**: No errors in console
- [ ] **Auth works**: Can click "Sign In" (redirects to Manus)
- [ ] **Dashboard loads**: After login
- [ ] **Database connected**: Can create test contract
- [ ] **File upload works**: Can upload to milestone

### Test Core Flows
1. [ ] Sign up / Sign in via Manus OAuth
2. [ ] Create a new contract (wizard flow)
3. [ ] Add milestones to contract
4. [ ] Sign contract (as provider)
5. [ ] Submit milestone with file upload
6. [ ] Approve/reject milestone
7. [ ] View notifications

### Performance Checks
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] Mobile responsive

---

## 🔧 Troubleshooting Guide

### Build Failures

**"DATABASE_URL is required"**
- Ensure Vercel Postgres is provisioned
- Check DATABASE_URL is in environment variables

**TypeScript errors**
```bash
cd ~/repos/allsquared
pnpm tsc --noEmit
```

**Missing dependencies**
```bash
pnpm install
```

### Auth Issues

**"Invalid URL" on login**
- Check `VITE_APP_ID` is set correctly
- Check `VITE_OAUTH_PORTAL_URL` is `https://vida.manus.im`

**"Unauthorized" after login**
- Check `JWT_SECRET` is set
- Check `OWNER_OPEN_ID` is correct

### Database Issues

**"Connection refused"**
- Verify DATABASE_URL format
- Ensure SSL mode: `?sslmode=require`
- Check Vercel Postgres is in same region

**"Table doesn't exist"**
- Run migrations: `pnpm db:push`

### Firebase Issues

**"Firebase credentials not configured"**
- Check all 4 Firebase env vars are set
- Private key must include `\n` for newlines
- Private key must be wrapped in quotes

---

## 🔒 Security Checklist

Before going live:
- [ ] JWT_SECRET is random 64+ character string
- [ ] DATABASE_URL uses SSL (`sslmode=require`)
- [ ] Firebase private key is secure (not in git)
- [ ] All API keys are in Vercel env vars, not in code
- [ ] HTTPS enforced on custom domain

---

## 📋 Questions for Eli

### Critical (Blocking Deployment)

1. **Manus OAuth**: Do you have a Manus account and app set up? Or should we replace with different auth (Clerk, NextAuth)?

2. **Hostinger Access**: Can you share credentials for allsquared.io domain?

3. **allsquared.uk**: Where is this domain registered? Cloudflare? Hostinger?

### Nice to Have

4. **Firebase Project**: Should I create a new Firebase project, or do you have an existing one?

5. **Stripe**: Do you have a Stripe account for future payments integration?

6. **Sentry**: Want error monitoring set up?

---

## 🎯 Quick Start Summary

**If all blockers resolved, here's the 2-hour sprint**:

| Step | Time | Action |
|------|------|--------|
| 1 | 15m | Provision Vercel Postgres |
| 2 | 30m | Set up Firebase Storage |
| 3 | 20m | Configure all env vars in Vercel |
| 4 | 10m | Trigger deployment |
| 5 | 5m | Run database migrations |
| 6 | 30m | Configure DNS at Hostinger |
| 7 | 10m | Test & verify |

**Total: ~2 hours** (plus DNS propagation time, typically 5-30 mins)

---

## 📁 Files Reference

| File | Location | Purpose |
|------|----------|---------|
| Main codebase | `~/repos/allsquared` | AllSquared repo |
| Deployment docs | `~/repos/allsquared/DEPLOYMENT.md` | Vercel deployment |
| Env vars reference | `~/repos/allsquared/VERCEL_ENV_VARS.md` | Required env vars |
| Firebase setup | `~/repos/allsquared/FIREBASE_SETUP_GUIDE.md` | Storage configuration |
| Database schema | `~/repos/allsquared/drizzle/schema.ts` | 17 tables |
| Vercel config | `~/repos/allsquared/vercel.json` | Build settings |

---

## 🔄 Alternative: Bypass Manus Auth

If Manus OAuth proves problematic, we can replace it with:

**Option 1: Clerk (Recommended)**
- Drop-in auth solution
- 10k MAU free
- Quick setup (~1 hour)
- Requires code changes to auth hooks

**Option 2: NextAuth / Auth.js**
- Self-hosted
- More flexible
- Requires more code changes

**Effort estimate to swap auth**: 2-4 hours

---

**Last Updated**: 2025-01-21
**Status**: Awaiting Eli's input on blockers
