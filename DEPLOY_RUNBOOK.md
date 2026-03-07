# AllSquared — Deployment Runbook
## Run this the moment credentials arrive

### Step 1: Set Vercel ENV vars
```bash
cd /Users/elibernstein/clawd/labs/projects/allsquared-repo

# Set Clerk
vercel env add CLERK_SECRET_KEY production --scope nakamoto-labs
vercel env add VITE_CLERK_PUBLISHABLE_KEY production --scope nakamoto-labs

# Set JWT (already generated)
vercel env add JWT_SECRET production --scope nakamoto-labs
# Value: 0e6dffe777e5a42e6d91add4527ea74ffd3d898bea7b362f73ebb21536cace3a

# Set DB (after provisioning)
vercel env add DATABASE_URL production --scope nakamoto-labs

# Set Stripe
vercel env add STRIPE_SECRET_KEY production --scope nakamoto-labs
vercel env add STRIPE_PUBLISHABLE_KEY production --scope nakamoto-labs
```

### Step 2: Provision Vercel Postgres (Neon)
- Go to: https://vercel.com/nakamoto-labs/allsquared/stores
- Click "Connect Store" → "Create New" → "Neon"
- Name: `allsquared-db`, Region: `lhr1` (London)
- Vercel auto-adds DATABASE_URL and POSTGRES_* env vars

### Step 3: Run migrations
```bash
vercel env pull .env.local --scope nakamoto-labs
export DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d= -f2-)
npx drizzle-kit push --config=drizzle.config.ts
```

### Step 4: Deploy
```bash
git add -A
git commit -m "fix: CSP Clerk headers, node 24 compat"
git push origin main
# Vercel auto-deploys on push
```

### Step 5: Configure domain
allsquared.io DNS records:
- A: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com

Then add in Vercel:
```bash
vercel domains add allsquared.io --scope nakamoto-labs
```

### Step 6: Smoke test
1. Visit https://allsquared.io
2. Sign up with Clerk
3. Create a contract
4. Add a milestone
5. Confirm data persists in DB
