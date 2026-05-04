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
- `pnpm test` still fails because no matching test files exist; `LAB-114` tracks executable test coverage

## Pending Todos

- Continue updating Linear when marketing tasks are completed or added
- Review refreshed Terms and Privacy copy for legal/compliance accuracy
- Add executable tests before treating the release as fully verified
- Commit/push the deployed local changes so source control matches production
- Confirm whether to actually archive `AutonoLabs/allsquared-website` in GitHub after checking external dependencies

## Blockers / Concerns

- `gsd-sdk` is not installed in this environment, so GSD orchestration is being bootstrapped manually
- Production currently matches a Vercel deployment from local changes; GitHub still needs commit/push parity

## Session Continuity

Last session: 2026-05-03
Stopped at: Production deployed; Phase 3 / Plan 03-02 and Phase 4 test coverage remain
Resume file: none
