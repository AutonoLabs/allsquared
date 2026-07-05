# CLAUDE.md — AllSquared

## What This Is
Freelance contracts platform for UK market. Allows freelancers and clients to create, sign, and manage contracts digitally.

## Stack
- **Frontend:** Vite + React 19, Wouter, TanStack Query, Tailwind 4, shadcn/ui
- **Backend:** Express 5, tRPC 11, Drizzle ORM, PostgreSQL
- **Auth:** Clerk (`@clerk/react`, `@clerk/backend`)
- **Payments:** Stripe (subscriptions + Connect)
- **Files:** Cloudflare R2 (`@aws-sdk/client-s3`)
- **E-Signature:** DocuSeal (primary), DocuSign/SignWell fallbacks, internal MVP signing
- **AI:** OpenAI via server `trpc.ai` + optional LexAI RAG
- **Deployment:** Vercel (capitelist account)

## Current State (as of Jun 2026)
- Clerk auth: ✅ done
- UK address verification: ✅ done
- Contract builder with UK legal templates: ✅ done
- Database: PostgreSQL via Drizzle (schema in `drizzle/schema.ts`)
- DocuSeal e-sign: ✅ server wired; set `DOCUSEAL_API_KEY`
- DNS: `allsquared.io` on Cloudflare

## Key Directories
- `client/src/` — React SPA pages and components
- `server/` — Express + tRPC API (`server/routers/`)
- `drizzle/` — PostgreSQL schema and migrations
- `legal/` — UK legal markdown templates (`[VARIABLE]` syntax)
- `templates/` — Category templates (`{{variable}}` YAML frontmatter)
- `shared/` — Cross-cutting types, template renderer, chatbot config

## Environment Variables Needed
- `DATABASE_URL` — PostgreSQL (Neon recommended)
- `CLERK_SECRET_KEY` / `VITE_CLERK_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY` — contract AI + Squario chatbot
- `DOCUSEAL_API_KEY` / `DOCUSEAL_URL` — e-signature (optional)
- `CLOUDFLARE_R2_*` — file uploads
- `LEXAI_API_URL` — legal RAG (optional)
- `UPSTASH_REDIS_REST_URL/TOKEN` — rate limiting (required in prod)

## Deploy
```bash
vercel --prod  # capitelist account
```

## GitHub
- `AutonoLabs/allsquared` (private) — use `git@github-allsquared:AutonoLabs/allsquared.git` remote alias

## Owner
Eli Bernstein / AutonoLabs
