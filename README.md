# AllSquared

Secure service contracts for the UK's freelance economy. AI-powered contract generation, FCA-backed escrow, milestone payments, and dispute resolution in one platform.

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, shadcn/ui (Radix), Wouter, TanStack Query
- **Backend:** Node.js 20, Express, tRPC 11, Drizzle ORM
- **Database:** PostgreSQL (Vercel Postgres)
- **Auth:** Clerk
- **Payments:** Stripe
- **AI:** OpenAI GPT-4
- **Storage:** Firebase
- **Monitoring:** Sentry, Vercel Analytics
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in Clerk, Stripe, OpenAI, Firebase, and database credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm check` | TypeScript type checking |
| `pnpm test` | Run tests |
| `pnpm db:push` | Generate and apply database migrations |

## Project Structure

```
.
├── api/              # Vercel serverless entry point
├── client/           # React frontend
│   ├── public/       # Static assets
│   └── src/
│       ├── components/  # UI components (shadcn/ui)
│       ├── contexts/    # React contexts
│       ├── hooks/       # Custom hooks
│       ├── lib/         # Utilities
│       └── pages/       # Route pages
├── server/           # Express + tRPC backend
│   ├── _core/        # Server infrastructure
│   └── routers/      # tRPC API routers
├── shared/           # Shared types and constants
├── drizzle/          # Database migrations
├── docs/             # Documentation
│   ├── business/     # Business plans, market research
│   ├── functional/   # PRD, legal policies, marketing
│   ├── technical/    # Deployment, setup guides
│   └── archive/      # Previous versions
└── patches/          # PNPM dependency patches
```

## Documentation

See [docs/README.md](docs/README.md) for full documentation index.
