# State

## Project Reference

- Core value: one platform for contract, escrow, verified payment, and dispute safety
- Current focus: Phase 4 - Verification, source-control sync, and release ownership

## Current Position

- Phase: 4 of 4
- Plan: 04-02
- Status: In Progress

Progress: █████████░ 90%

## Recent Decisions

- `AllSquared.html` from `AutonoLabs/allsquared-website` is the marketing source of truth
- The live site is now a verification target, not the primary UI baseline
- The homepage extraction is complete and `LAB-110` is closed
- The core public-route rebuild is complete and `LAB-111` is closed
- Public shell parity and cookie coverage are complete; `LAB-112` and `LAB-40` are closed
- Production build and typecheck pass after dependency install and `tsconfig` cleanup
- Product dashboard/admin shell reskin is complete and `LAB-115` is closed
- Production deploy succeeded via Vercel prebuilt output and `LAB-116` is closed
- `allsquared-app` is now documented as the canonical production repo for marketing and app
- `allsquared-website` is now documented as historical brand reference/archive only
- Sign-up and draft-contract entry now route through explicit Clerk auth pages
- Production auth CSP now allows the AllSquared Clerk custom domain and Clerk worker runtime
- Cloudflare DNS now points `allsquared.io` and `www.allsquared.io` at Vercel instead of the old Pages site
- `LAB-121` production hardening added executable tests, dependency audit cleanup, DB constraints migration, AI rate limiting, contract state transitions, Stripe SDK usage, and production log/CSP tightening
- `pnpm test`, `pnpm check`, `pnpm build`, and `pnpm audit` pass locally

## Pending Todos

- Continue updating Linear when marketing tasks are completed or added
- Review refreshed Terms and Privacy copy for legal/compliance accuracy
- Confirm whether to actually archive `AutonoLabs/allsquared-website` in GitHub after checking external dependencies
- Complete remaining distributed security follow-ups: Redis/Vercel KV AI rate limiting and nonce-based CSP

## Blockers / Concerns

- `gsd-sdk` is not installed in this environment, so GSD orchestration is being bootstrapped manually
- CSP still permits inline scripts until a nonce strategy is implemented
- AI rate limiting is per-process; use Redis/Vercel KV before relying on it across multiple serverless instances

## Session Continuity

Last session: 2026-05-04
Stopped at: `LAB-121` local hardening complete; awaiting commit/push/deploy after Linear triage
Resume file: none
