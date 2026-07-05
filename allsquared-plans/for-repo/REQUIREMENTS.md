# Requirements — AllSquared (UK-first)

> These are verifiable requirements **and** the audit rubric for the code review.
> When the repo is reviewed, every R gets a status: ✅ supported / ⚠ partial / ❌ absent /
> 🔥 contradicted (code hardcodes something the plan forbids).

## v1 (UK Launch — Must Ship)

### Jurisdiction & dates (the foundation)
- **R1** — Jurisdiction is a first-class module, not config or hardcoding. E&W ships first;
  adding Scotland or (later, via Autono Legal) an AU state must not require touching core logic.
  *Audit check: grep for hardcoded statutes, state names, date constants in business logic.*
- **R2** — E&W business-day calendar: English & Welsh bank holidays, Europe/London timezone,
  BST-transition safe. All deadline maths runs through one tested calendar service.
- **R3** — Payment terms are **contract-driven with Scheme fallback**: due dates, payment-notice
  window (5 days after due date), pay less notice prescribed period (contract, else Scheme
  7 days before final date for payment). The data model stores per-contract terms; the Scheme
  for Construction Contracts is the default, never the only path.
  *This differs from AU SOPA's fixed statutory maxima — if the code assumes statute-fixed
  dates, it 🔥 contradicts the UK plan.*

### Assessment engine
- **R4** — Deterministic notice-validity rule engine (payment application validity, payment
  notice, pay less notice, notified-sum logic under s 110A/111). Rules in code with tests;
  the LLM never decides validity or a date.
- **R5** — Smash-and-grab eligibility assessment: given contract terms + payment cycle + notices
  served, output eligible / not eligible / needs-human, with reasons. Every assessment passes a
  human-review gate before the client sees it (feature-flagged so the gate can't be silently off).
- **R6** — Scope screening: s 105 excluded operations and s 106 residential-occupier contracts
  detected at intake and routed out with a clear explanation.
- **R7** — Per-contract, per-cycle deadline tracker with alerts (email/SMS) for every date that
  can extinguish a right.

### Documents & evidence
- **R8** — Document generation: chaser/letter before adjudication, notice of adjudication,
  referral notice, service cover letters, and ANB application forms (RICS, CIArb, TeCSA,
  UK Adjudicators) including low-value scheme variants. Templates versioned; jurisdiction-keyed.
- **R9** — Evidence bundle builder: paginated, indexed PDF bundle from uploaded contracts,
  applications, notices, correspondence.
- **R10** — Litigation-grade audit trail: immutable log of what was generated, approved, served,
  and when (service evidence wins and loses these cases — see the 2025 NSW/UK service case law).

### AI safety & platform
- **R11** — Drafting LLM is retrieval-grounded on our template + rule corpus; cannot cite case
  law that isn't in the corpus (cite-or-silent); reviewer approval workflow with diff view.
- **R12** — Multi-entity architecture: AllSquared (UK) and Autono Legal (AU) run on the shared
  engine with **separated data, branding, and templates**. UK client data resides UK/EU.
- **R13** — Payments: Stripe GBP, VAT handling, per-SKU pricing incl. sub-£100 micro-SKUs.

## v2 (Next)

- **R14** — Respondent-side subscription: payment-cycle monitoring for payers, pay-less-notice
  generator, "you have 3 days to serve" alerts.
- **R15** — Scotland module (same Act, Scottish Scheme differences + enforcement route).
- **R16** — True-value adjudication support (both sides) — the up-market move.
- **R17** — Xero/QuickBooks integration: overdue invoice = trigger event, pull application data.
- **R18** — Enforcement handoff workflow: package the decision + file for partner solicitor firm,
  track outcome, referral loop.

## Out of Scope

- County-court claim filing on clients' behalf (reserved activity — self-help mode only, if ever)
- AU SOPA modules under the AllSquared brand (parked; any AU work lives in Autono Legal)
- Consumer small-claims automation; holding client money; trust/escrow of recovered funds
- Crypto-recovery features in this codebase's UK product surface (shared-engine reuse is fine)

## Audit procedure (when code access lands)

1. Tree + dependency scan (secrets, vuln audit, licence check).
2. R1–R3 first — they're the load-bearing wall; a NSW-hardcoded date engine means Phase 02
   is a rebuild, not a port.
3. R4/R5/R11 — find where the LLM sits. If model output feeds dates/validity, flag 🔥.
4. Map every R to file paths; produce VERIFICATION.md with ✅/⚠/❌/🔥 per requirement.
