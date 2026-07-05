# Roadmap

## Milestone: AllSquared App Upgrade

### Phase 1: Marketing Component Foundation
**Goal**: Extract the homepage into reusable marketing sections while preserving fidelity to `AllSquared.html`.

Plans:
- [x] 01-01: Extract marketing data and section components from `Home.tsx`
- [x] 01-02: Verify the new section library and close the matching marketing task in Linear

### Phase 2: Remaining Public Routes
**Goal**: Rebuild the rest of the public route set with the same brand system and shared primitives.

Plans:
- [x] 02-01: Apply the brand system to the core public pages and audience pages
- [x] 02-02: Resolve footer/header route parity and cookie-policy coverage

### Phase 3: Product Surface Reskin
**Goal**: Bring dashboard and admin surfaces into the same token system without turning them into marketing pages.

Plans:
- [x] 03-01: Replace product-shell hardcoded styling with shared brand tokens
- [ ] 03-02: Normalize shared operational components such as badges, page headers, and empty states

### Phase 4: Verification and Release Readiness
**Goal**: Restore confidence in the upgraded app through verification, docs, and CI.

Plans:
- [ ] 04-01: Restore executable TS/test verification in a working install
- [ ] 04-02: Tighten CI/docs around the upgraded marketing and product surfaces
- [x] 04-03: Deploy upgraded app to Vercel production
