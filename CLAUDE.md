# CLAUDE.md — AllSquared

## What This Is
Freelance contracts platform for UK market. Allows freelancers and clients to create, sign, and manage contracts digitally.

## Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth:** Clerk (fully implemented)
- **Database:** PostgreSQL via Prisma ORM
- **Payments:** Stripe
- **Deployment:** Vercel (capitelist account)

## Current State (as of Mar 2026)
- Clerk auth: ✅ done
- UK address verification: ✅ done
- Email verification: ✅ done
- "Your Details" onboarding (Individual/Company toggle): ✅ done
- Database schema: ⚠️ pending — Prisma schema exists but DB not provisioned
- DNS: `allsquared.io` on Cloudflare (NS: aragorn/treasure), `allsquared.uk` registered but no NS set

## Key Directories
- `src/app/` — Next.js App Router pages
- `src/components/` — Reusable UI components
- `prisma/` — Database schema
- `src/lib/` — Utilities, Clerk config, Stripe

## Environment Variables Needed
- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

## Deploy
```bash
vercel --prod  # capitelist account
```

## GitHub
- `AutonoLabs/allsquared` (private) — use `git@github-allsquared:AutonoLabs/allsquared.git` remote alias
- SSH key: `~/.ssh/lexai-deploy-key` (may need separate allsquared deploy key)

## Owner
Eli Bernstein / AutonoLabs
Ada (AXIOM) — engineering
