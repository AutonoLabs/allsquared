# AllSquared Production Ownership

## Decision

`AutonoLabs/allsquared-app` is the canonical production repository for both the marketing website and authenticated application.

`AutonoLabs/allsquared-website` is now a historical brand reference only. Its `AllSquared.html` file remains useful as the design baseline for the current green/paper/navy brand system, but no new production work should be shipped from that repository.

## Production Topology

Production runs from one Vercel project:

- Vercel project: `autonolabs/allsquared`
- Source repository: `https://github.com/AutonoLabs/allsquared-app`
- Marketing domains: `https://allsquared.io`, `https://www.allsquared.io`, `https://allsquared.uk`, `https://www.allsquared.uk`
- App domains: `https://app.allsquared.io`, `https://app.allsquared.uk`

These domains should point at the same deployed app. The difference between marketing and app is routing, not separate repositories.

## Routing Model

Public marketing routes live in the app repo:

- `/`
- `/features`
- `/how-it-works`
- `/pricing`
- `/legal-services`
- `/freelancers`
- `/clients`
- `/about`
- `/contact`
- `/terms`
- `/privacy`
- `/cookies`

Authenticated/product routes also live in the app repo:

- `/dashboard/*`
- `/admin/*`
- contract, escrow, settings, and account flows exposed by the React router and tRPC API

## Deployment Rule

Deploy production only from `allsquared-app`.

Before a normal production deploy:

1. Commit the intended source changes.
2. Push the branch to GitHub.
3. Run `pnpm check` and `pnpm build`.
4. Deploy the app repo to the Vercel project.

Emergency deploys from a local dirty worktree are allowed only as a temporary exception. They must be followed by a commit/push that makes GitHub match production.

## Website Repo Retirement

Do not add new issues, copy, styling, or deployment work to `allsquared-website`.

Recommended GitHub handling:

1. Rename or update the repository description to say "Archived brand reference for AllSquared.html".
2. Add a README note pointing contributors to `AutonoLabs/allsquared-app`.
3. Archive the repository only after confirming no DNS, Vercel, GitHub Actions, or external links depend on it.

