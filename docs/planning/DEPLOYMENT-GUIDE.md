# AllSquared Deployment Guide

**Version:** 1.0  
**Date:** January 2025  
**Status:** Ready for Deployment

---

## 🎉 Good News: Auth Already Migrated to Clerk!

The codebase has already been migrated from Manus OAuth to **Clerk**. The auth hooks and components are in place:
- `client/src/lib/clerk.tsx` - Clerk provider
- `client/src/hooks/useAuth.ts` - Uses `@clerk/clerk-react`
- Server-side: Supports `CLERK_SECRET_KEY`

**Original blocker (Manus) is RESOLVED.**

---

## 1. Pre-Deployment Checklist

### Required Services
- [ ] **Clerk Account** (clerk.com) - Authentication
- [ ] **Vercel Account** - Already connected (Nakamoto Labs)
- [ ] **Stripe Account** - Payment processing
- [ ] **Firebase Project** - File storage
- [ ] **Domain Access** - Hostinger (allsquared.io)

---

## 2. Step-by-Step Deployment

### Step 1: Create Clerk Application (15 min)

1. Go to https://clerk.com and sign up/login
2. Create new application:
   - Name: **AllSquared**
   - Authentication methods: Enable **Email** and **Google OAuth**
3. Go to **API Keys** in Clerk dashboard
4. Copy:
   - **Publishable Key** → `VITE_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

### Step 2: Set Up Vercel Postgres (10 min)

1. Go to Vercel Dashboard → AllSquared project
2. Click **Storage** tab → **Create Database** → **Postgres**
3. Name: `allsquared-db`
4. Region: `fra1` (Frankfurt) or `lhr1` (London) for UK users
5. Click **Create**

Environment variables automatically added:
- `DATABASE_URL` ✅
- `POSTGRES_*` variables ✅

### Step 3: Create Firebase Project (20 min)

1. Go to https://console.firebase.google.com
2. Create project: **allsquared-production**
3. Go to **Build** → **Storage** → **Get Started**
4. Select **Production mode**, Location: **europe-west2 (London)**
5. Go to **Project Settings** → **Service Accounts**
6. Click **Generate new private key** → Download JSON
7. Extract values from JSON:

```
FIREBASE_PROJECT_ID=allsquared-production
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@allsquared-production.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=allsquared-production.appspot.com
```

### Step 4: Configure Environment Variables (15 min)

Go to **Vercel** → **Project** → **Settings** → **Environment Variables**

Add these variables for **Production**, **Preview**, and **Development**:

#### Authentication (Clerk)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
```

#### Security
```
JWT_SECRET=<generate-64-char-random-string>
```

Generate with:
```bash
openssl rand -hex 32
```

#### Firebase Storage
```
FIREBASE_PROJECT_ID=allsquared-production
FIREBASE_CLIENT_EMAIL=<from-service-account-json>
FIREBASE_PRIVATE_KEY="<full-private-key-with-newlines>"
FIREBASE_STORAGE_BUCKET=allsquared-production.appspot.com
```

#### Application
```
VITE_APP_TITLE=AllSquared
NODE_ENV=production
```

#### Optional (Phase 2)
```
OPENAI_API_KEY=sk-xxxx (for AI contract generation)
STRIPE_SECRET_KEY=sk_live_xxxx (for payments)
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx (for payments)
```

### Step 5: Deploy Application (10 min)

Option A: Push a commit
```bash
cd ~/repos/allsquared
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

Option B: Manual redeploy in Vercel Dashboard

### Step 6: Run Database Migrations (5 min)

After deployment, push the schema:

```bash
cd ~/repos/allsquared

# Get DATABASE_URL from Vercel
# Option 1: Copy from Vercel dashboard
export DATABASE_URL="postgres://default:xxx@xxx/verceldb?sslmode=require"

# Option 2: Use Vercel CLI
vercel env pull .env.local
source .env.local

# Push schema
pnpm db:push
```

### Step 7: Configure Domain (20 min)

#### In Vercel:
1. Go to **Settings** → **Domains**
2. Add `allsquared.io`
3. Add `www.allsquared.io`
4. Note the required DNS records

#### In Hostinger DNS:
1. Log in to Hostinger account
2. Go to **Domains** → **allsquared.io** → **DNS Zone**
3. Add records:

**A Record (apex domain)**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME (www)**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

4. Wait 5-30 minutes for DNS propagation

### Step 8: Verify Deployment

- [ ] https://allsquared.io loads
- [ ] HTTPS certificate active (green lock)
- [ ] Signup/signin works
- [ ] Dashboard loads after auth
- [ ] Can create a contract (basic flow)

---

## 3. Required Credentials Summary

| Credential | Source | Status |
|------------|--------|--------|
| Clerk Publishable Key | Clerk Dashboard | 📋 Need to create |
| Clerk Secret Key | Clerk Dashboard | 📋 Need to create |
| JWT Secret | Generate | 📋 Need to generate |
| Database URL | Vercel Postgres | 📋 Auto-created |
| Firebase Project ID | Firebase Console | 📋 Need to create |
| Firebase Client Email | Firebase Console | 📋 Need to create |
| Firebase Private Key | Firebase Console | 📋 Need to create |
| Firebase Storage Bucket | Firebase Console | 📋 Need to create |
| Hostinger Login | Bitwarden | ✅ Check Bitwarden |

---

## 4. Bitwarden Credentials to Verify

Check Bitwarden for:
- **Hostinger** account (domain management)
- **Vercel** account (if not using org SSO)
- **Stripe** account (payments - future)
- **OpenAI** API key (AI features - future)

Search terms in Bitwarden:
- "hostinger"
- "allsquared"
- "vercel"
- "nakamoto"

---

## 5. Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Site accessible at allsquared.io
- [ ] Auth flow works end-to-end
- [ ] Create test contract
- [ ] Error tracking active (Sentry if configured)

### Week 1
- [ ] Real user signup (founder testing)
- [ ] Contract creation → PDF export
- [ ] Invite beta testers (5-10)
- [ ] Monitor error logs

### Week 2-4
- [ ] Stripe integration for payments
- [ ] Escrow provider integration
- [ ] Full milestone flow testing
- [ ] ProductHunt launch prep

---

## 6. Troubleshooting

### Auth Not Working
1. Check Clerk keys are correct in Vercel
2. Ensure both `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
3. Redeploy after adding env vars

### Database Errors
1. Check `DATABASE_URL` is set
2. Verify Postgres is provisioned in Vercel Storage
3. Run `pnpm db:push` to sync schema

### Firebase Upload Fails
1. Verify all 4 Firebase env vars are set
2. Private key must include `\n` newlines
3. Check Firebase Storage rules allow authenticated writes

### Domain Not Working
1. DNS propagation takes 5-30 minutes
2. Verify A record points to `76.76.21.21`
3. Check Vercel domain verification status

---

## 7. Deployment Script

For convenience, here's a bash script to help with local setup:

```bash
#!/bin/bash
# AllSquared Local Development Setup

echo "🚀 AllSquared Development Setup"

# Check prerequisites
command -v pnpm >/dev/null 2>&1 || { echo "pnpm required. Install with: npm i -g pnpm"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js required."; exit 1; }

cd ~/repos/allsquared

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate JWT secret if needed
if [ -z "$JWT_SECRET" ]; then
  JWT=$(openssl rand -hex 32)
  echo "Generated JWT_SECRET: $JWT"
  echo "Add this to your .env file"
fi

# Check for .env file
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Create one with required variables."
  echo "See DEPLOYMENT-GUIDE.md for required variables."
fi

# Type check
echo "🔍 Running type check..."
pnpm tsc --noEmit

# Build test
echo "🔨 Testing build..."
pnpm build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure environment variables in Vercel"
echo "2. Set up Clerk application"
echo "3. Configure Firebase Storage"
echo "4. Push to deploy"
```

---

## 8. Contact & Support

**Technical Issues:** Check GitHub Issues or contact Nakamoto Labs

**Deployment Help:** Follow this guide step-by-step

**Domain Issues:** Contact Hostinger support if DNS doesn't propagate

---

*Document Owner: Nakamoto Labs*  
*Last Updated: January 2025*
