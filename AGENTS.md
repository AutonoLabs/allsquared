# AllSquared

Multi-product repo. The **active** product is `checker/` (a Next.js pay-less-notice
validity checker). `legacy-app/` is a **frozen** legacy product, and `ARCHIVE/` +
`allsquared-plans/` + `docs/` are documentation/planning only.

## Cursor Cloud specific instructions

### Active service: `checker/`
- **What it is:** self-contained Next.js 14 (App Router) app — a UK construction
  "pay less notice" validity checker with SEO guide pages and a lead-capture API.
  No database, no auth, no external services are required to run or test it.
- **Package manager:** pnpm (there is no root workspace; run pnpm inside `checker/`).
  Node 22 and pnpm are already available on the VM; the update script runs
  `pnpm --dir checker install`.
- **Run / test commands** (see `checker/package.json`), from `checker/`:
  - `pnpm dev` — dev server on `http://localhost:3000` (routes: `/`, `/checker`, `/guides/[slug]`).
  - `pnpm test` — Vitest suite (21 tests across `lib/`, `components/`, and the lead API).
  - `pnpm build` / `pnpm start` — production build/serve. There is **no** dedicated
    `lint` script; `next build` performs type-checking and ESLint.
- **Lead API (`app/api/lead/route.ts`) gotcha:** the endpoint works with **no**
  secrets. When `RESEND_API_KEY` is unset it persists the lead as a structured
  JSON log line (`{"event":"checker_lead",...}`) and returns `{"ok":true}` — email
  send is skipped by design. To exercise real email delivery, set `RESEND_API_KEY`
  (optionally `RESEND_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`); these are optional.
- **Hello-world smoke test:** on `/checker`, fill Due date + Final date for payment +
  Notified sum (leave "pay less notice served date" blank) → "Check my notice" →
  submit an email on the result screen → confirmation appears and a `checker_lead`
  line is logged by the dev server.

### `legacy-app/` (frozen — usually skip)
- Vite + Express + tRPC + Drizzle/Postgres app that is explicitly frozen (see its
  `STATE.md`). Running it requires Postgres and several external service keys
  (Clerk/Stripe/etc., see `legacy-app/.env.example`). Not part of the active
  roadmap — only set it up if a task specifically targets `legacy-app/`.
