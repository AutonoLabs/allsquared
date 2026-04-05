# AllSquared — Deployment Guide

> Single source of truth for deploying AllSquared. Replaces the previous
> `DEPLOYMENT_GUIDE.md`, `PM2_DEPLOYMENT.md`, `DEPLOY_RUNBOOK.md`, and
> `docs/planning/DEPLOYMENT-*.md` documents.

## Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS 4   |
| Backend     | Express (Node 22), tRPC          |
| Database    | PostgreSQL (Neon serverless)      |
| ORM         | Drizzle ORM                      |
| Auth        | Clerk                            |
| Payments    | Stripe                           |
| Hosting     | Vercel (primary), PM2 (staging)  |
| Storage     | Firebase Storage / S3             |

---

## 1. Prerequisites

- Node.js >= 20 (22 recommended)
- pnpm 9.x (`corepack enable && corepack prepare pnpm@9.0.0 --activate`)
- Vercel CLI (`pnpm add -g vercel`)
- Access to Neon / PostgreSQL database
- Clerk, Stripe, and Firebase credentials

---

## 2. Environment Variables

Copy `.env.example` (or set in Vercel dashboard):

```env
# Database
DATABASE_URL=postgresql://...

# Clerk
CLERK_SECRET_KEY=sk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Storage
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_STORAGE_BUCKET=...

# Misc
JWT_SECRET=<random-256-bit-hex>
NODE_ENV=production
```

Set each in Vercel:
```bash
vercel env add <KEY> production
```

---

## 3. Database Setup (Neon)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string into `DATABASE_URL`.
3. Push schema:
   ```bash
   pnpm db:push
   ```

---

## 4. Deploy to Vercel (Production)

```bash
# Link project (first time)
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod
```

The `vercel.json` at the repo root configures:
- Build command: `pnpm build`
- Output directory: `dist/public`
- CSP headers, rewrites, and security headers

### Automated deploys

Push to `main` branch → Vercel auto-deploys production.
Push to any other branch → Vercel creates a preview deployment.

---

## 5. Deploy with PM2 (Staging / Local Server)

For development or staging on a local machine (e.g., Mac Mini):

```bash
# Install PM2 globally
npm install -g pm2

# Build
pnpm build

# Start
pm2 start dist/index.js --name allsquared

# Save process list
pm2 save

# Auto-start on reboot
pm2 startup
```

Useful commands:
```bash
pm2 status
pm2 logs allsquared
pm2 restart allsquared
pm2 stop allsquared
```

---

## 6. Post-Deploy Checklist

- [ ] Verify health: `curl https://allsquared.io/api/health`
- [ ] Check Clerk webhook is registered and receiving events
- [ ] Check Stripe webhook endpoint is active
- [ ] Run smoke test: sign up → create contract → sign → pay
- [ ] Verify CSP headers with browser DevTools (no blocked resources)
- [ ] Check Sentry for any new errors

---

## 7. Rollback

```bash
# List recent deployments
vercel ls

# Promote a previous deployment
vercel promote <deployment-url>
```

---

## 8. Troubleshooting

| Symptom | Fix |
|---------|-----|
| 500 on API routes | Check `DATABASE_URL` is set and Neon is reachable |
| Clerk auth fails | Verify `CLERK_SECRET_KEY` matches the environment |
| Stripe webhooks fail | Check `STRIPE_WEBHOOK_SECRET`; re-register endpoint |
| Build fails on Vercel | Ensure `NODE_VERSION=22` in vercel.json build env |
| Stale chunks after deploy | The app auto-reloads once; clear CDN cache if persistent |
