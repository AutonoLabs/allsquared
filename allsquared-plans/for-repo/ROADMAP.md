# Roadmap — AllSquared UK

## Milestone: UK v1 — "First £250K recovered"

### Phase 00 — Validation sprint (2–4 weeks, BEFORE any engine build)
**Goal:** Prove someone will pay before building the machine. Deliverables:
- Free pay-less-notice / notice-validity checker live (Phase 05's SEO wedge pulled forward;
  minimal build, no rules engine — a guided questionnaire with human-reviewed output is fine)
- 10 interviews with UK trade subcontractors who are currently owed money
- 1 conversation with an ANB (RICS / TeCSA / UK Adjudicators) about low-value scheme volume
- 1 conversation with a construction solicitor about referral flow both directions
**Kill criteria (written before starting):** if no interviewed subbie says they would pay
£990 for a prepared referral, or the checker gets meaningful traffic but zero qualified
leads in 4 weeks, stop and rethink before any Phase 02 spend.
**Satisfies:** de-risks everything **Status:** 🔶 In progress (2026-07-07)
- ✅ Checker + SEO pages LIVE at https://allsquared-checker.vercel.app (own Vercel project,
  separate from the legacy app; built via `docs/superpowers/plans/2026-07-05-*.md`, PR #16)
- ☐ Set `RESEND_API_KEY` on the Vercel project + verify sending domain in Resend —
  until then, submitted leads only appear in Vercel function logs, not email
- ☐ 10 subbie interviews  ☐ ANB conversation  ☐ solicitor conversation
- ☐ Kill-criteria review at 4 weeks (by ~2026-08-04)
**Rationale:** 8 months were spent building the freelance product without a single customer
conversation. This phase exists so that cannot happen again.

### Phase 01 — UK foundation (legal & ops)
**Goal:** AllSquared Ltd can lawfully trade: entity, ICO registration, PII quote/bind,
terms of engagement + "we are not solicitors" disclosures, partner solicitor firm signed
for enforcement handoffs, UK phone/registered office.
**Satisfies:** (enables all) **Status:** ☐ Not started
**Note:** mostly manual/founder tasks; run in parallel with 02–03.

### Phase 02 — Jurisdiction & date engine
**Goal:** E&W calendar + contract-driven payment-terms model + Scheme fallback, fully tested.
**Satisfies:** R1, R2, R3 **Status:** ☐ Not started
**Depends on:** Phase 00 passing its kill criteria; code review done (VERIFICATION.md:
new construction, not refactor).

### Phase 03 — Validity & eligibility engine
**Goal:** Deterministic notice-validity rules, smash-and-grab assessment with human gate,
s 105/s 106 screening, deadline tracker.
**Satisfies:** R4, R5, R6, R7 **Status:** ☐ Not started
**Depends on:** Phase 02

### Phase 04 — Documents, bundles, audit trail
**Goal:** Generate the full referral pack end-to-end (notice of adjudication → referral →
bundle → ANB forms) with versioned templates and immutable service log.
**Satisfies:** R8, R9, R10, R11 **Status:** ☐ Not started
**Depends on:** Phase 03

### Phase 05 — Launch wedge & GTM sprint
**Goal:** Free checker live + paid SKUs purchasable; first 10 pilot subbies through the funnel.
**Satisfies:** R12, R13 **Status:** ☐ Not started
**Depends on:** Phase 04
**GTM inside this phase:**
- SEO pages on high-intent queries: "no pay less notice", "main contractor not paying
  subcontractor", "smash and grab adjudication cost", "payment notice deadline calculator"
- Trade-body outreach: ECA, BESA, SEC Group, FMB, NFB (they campaign on late payment —
  we are the campaign, weaponised)
- Construction-lawyer referral loop: they send sub-£50K matters they turn away; we send
  enforcement + true-value work back
- One founder trip: Adjudication Society event + ANB meetings + 10 pilot interviews

### Phase 06 — Respondent-side SaaS
**Goal:** Recurring revenue from payers: cycle monitoring, pay-less generation, alerts.
**Satisfies:** R14, R17 **Status:** ☐ Not started **Depends on:** Phase 05

### Phase 07 — Depth & breadth
**Goal:** Scotland module, true-value support, enforcement-handoff workflow productised.
**Satisfies:** R15, R16, R18 **Status:** ☐ Not started **Depends on:** Phase 06

---

## Explicitly parked
- Australia (all of it) → Autono Legal, separate matter, separate plan
- Small-claims self-help mode → only after UK v1 success criteria met
