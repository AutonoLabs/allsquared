# State — AllSquared

## Current Position
- Active milestone: UK v1
- Active phase: 00 (validation sprint — checker LIVE at allsquared-checker.vercel.app
  since 2026-07-07; interviews/outreach pending) + 01 (UK foundation) in parallel
- Last completed: Phase 00 build — checker app + SEO pages shipped (PR #16),
  deployed to its own Vercel project
- Open operational gap: RESEND_API_KEY not set on the Vercel project — leads land in
  function logs only until it is; sending domain must be verified in Resend

## Decisions Made
- **2026-07-05 (evening)** — **Pivot reconfirmed, validation-first.** After the repo audit
  (VERIFICATION.md) surfaced that substantive freelance-product work (KYC, escrow panel,
  security audit) had landed on main only 7 days before this plan was drafted, the pivot was
  paused and reconsidered with full knowledge. Findings: the freelance product has zero
  users/revenue after 8+ months and the June work was the founder's own agent runs, not a
  separate team's investment. Pivot stands. Roadmap resequenced: a Phase 00 validation
  sprint (free checker + 10 subbie interviews + kill criteria) now precedes the Phase 02
  engine build — the last 8 months' failure mode was building without customer contact, not
  picking the wrong product. Freelance product frozen: stays deployed from legacy-app/, zero
  further investment.
- **2026-07-05** — **UK-first.** E&W construction adjudication is the beachhead: unreserved
  under the Legal Services Act 2007 (no law practice needed), single national regime,
  record 2,264 referrals/yr, smash-and-grab ≈ ⅓ of cases and purely procedural, sub-£25K
  segment (~4% of referrals) is an unserved void with LVD schemes proving demand.
- **2026-07-05** — **Australia separated out entirely.** No AU features, entity, or marketing
  under AllSquared. AU = Autono Legal (ILP), beginning with crypto litigation recovery,
  planned in `autono-legal/PROJECT.md`. Construction SOPA in AU is parked indefinitely.
- **2026-07-05** — **IP architecture:** AutonoLabs owns platform, codebase, and brand IP;
  operating entities (AllSquared Ltd UK, Autono Legal ILP AU) take licences only.
  Rationale: Moto Legal separation experience — operating entities never own the brand.
- **2026-07-05** — Wedge product = smash-and-grab claimant stack; respondent compliance SaaS
  is v2; representation tier priced but delivered manually at first (do things that don't scale).
- **2026-07-05** — Deterministic rules engine for all dates/validity; LLM drafts only, behind
  a human-review gate, retrieval-grounded, cite-or-silent. Non-negotiable until proven at volume.
- **2026-07-05** — Enforcement (conduct of litigation, reserved) is handed to a partner
  solicitor firm; referral relationship to be negotiated in Phase 01.

## Open Questions
- Does the current repo hardcode an AU/NSW-style fixed-date model? (Determines Phase 02 =
  refactor vs. rebuild.) **Blocked on code access — zip upload or local Claude Code run.**
- UK entity: director/shareholding structure, registered office provider, VAT registration timing.
- PII: which broker/underwriter covers unregulated construction claims consultancy + AI drafting.
- Partner solicitor firm shortlist for TCC enforcement (referral terms both directions).
- Pricing validation: £990 vs £1,490 vs £2,490 referral pack — test in pilot interviews.
- Brand/domain check: allsquared.co.uk is a property-services business; confirm chosen domain
  and UK trade-mark position before spend.

## Blockers
- Code review pending: no access yet to repo or vault from claude.ai (private repo; local path).
  Resolve via zip upload to chat or by running the review in Claude Code/Desktop locally.
