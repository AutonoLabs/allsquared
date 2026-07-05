# AllSquared App Upgrade

## What This Is

AllSquared is a contract, escrow, verification, and dispute platform for serious UK project work. This upgrade keeps the existing React/Express/tRPC stack, fixes the verified security backlog, and replaces the public and product UI with the `AllSquared.html` brand system.

The production source of truth is `AutonoLabs/allsquared-app` for both the marketing site and authenticated app. `AutonoLabs/allsquared-website` is retained only as a historical brand reference.

## Core Value

Turn a fragmented workflow of contract drafting, payment risk, milestone proof, and dispute handling into one coherent product with credible UK trust signals.

## Requirements

### Validated

- Public marketing and authenticated product surfaces already exist in the app
- The public shell now uses the `AllSquared.html` paper/navy/green direction
- Critical security fixes have already landed in the server and error handling paths
- Production domains are served by one Vercel app sourced from `allsquared-app`

### Active

- [ ] Extract homepage sections into reusable marketing components
- [ ] Rebuild remaining public routes with the same brand system
- [ ] Reskin dashboard and admin surfaces to use the same token layer
- [ ] Restore executable verification with installed dependencies and clean TS/test checks

### Out of Scope

- Full stack rewrite
- Replacing Clerk, tRPC, or Drizzle as part of the marketing work
- Reworking core business flows before the public/product UI foundation is stable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use `AllSquared.html` as marketing source of truth | Local path provided by user was absent, but the repo source was fetched directly and is authoritative | Adopted |
| Make `allsquared-app` the production source for marketing and app | One repo avoids duplicated routing, deploy drift, analytics drift, and stale marketing code | Adopted |
| Treat `allsquared-website` as reference/archive only | The live green brand has been incorporated into React/Tailwind app pages | Adopted |
| Keep the current app stack | The repo already separates public, dashboard, and admin surfaces cleanly enough to evolve | Adopted |
| Sequence marketing before broader product reskin | The homepage and shared shell set the token system used by later authenticated surfaces | Adopted |

## Constraints

- `node_modules` is missing in this clone, so full TS/test verification is currently blocked
- `tsconfig.json` still errors on deprecated `baseUrl`
- Existing user/server changes in the dirty worktree must be preserved

---
*Last updated: 2026-05-03 during GSD bootstrap*
