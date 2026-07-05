# AllSquared

> **Status:** Plan reset 2026-07-05 — UK-first. Supersedes all prior AllSquared business plans.
> Australia is now a **separate matter** (see `autono-legal/PROJECT.md`) and is out of scope here.

## Vision

AllSquared is AI-powered construction payment recovery for UK subcontractors. It turns the
Construction Act's notice regime — payment applications, payment notices, pay less notices,
adjudication — into software, so a subbie owed £10K–£250K can enforce their statutory rights
for hundreds of pounds instead of writing the debt off or paying £10K+ in consultant and
solicitor fees.

## Core Value

**"No pay less notice? Then the full amount is payable — and we'll get it."**
The smash-and-grab adjudication is purely procedural (notice validity + dates, no valuation
argument), which makes it the most automatable dispute type in any legal system. AllSquared
checks validity, runs the deadlines, generates the referral, and shepherds the 28-day process.

## Audience

- **Primary (claimant side):** UK trade/specialist subcontractors — electrical, M&E, groundworks,
  fit-out, roofing — typically 1–50 staff, owed money by main contractors. Buyer = owner/director
  or the person doing the books.
- **Secondary (respondent side, v2):** main contractors and developers who fear smash-and-grabs
  and need notice-compliance discipline (subscription product).
- **Not:** residential occupiers / consumers (s 106 exclusion; also wrong buyer).

## Regulatory Position (England & Wales)

- Adjudication advice, drafting, and party representation are **unreserved** under the Legal
  Services Act 2007 — no SRA authorisation, no practising certificate required.
- Hard boundaries: never hold out as solicitors (Solicitors Act 1974); **conduct of litigation is
  reserved** → TCC enforcement is handed to a partner solicitor firm (or client acts as LiP);
  FCA claims-management regulation does not cover construction/commercial debt.
- Voluntary safeguards: professional indemnity insurance, ICO registration, human review of
  every assessment and outbound document until accuracy is proven at volume.

## Market Snapshot (evidence base)

- UK adjudication referrals hit a record **2,264 in 2023/24** (+9% YoY) — KCL / Adjudication
  Society annual report. One national regime (E&W; Scotland near-identical later).
- **Smash-and-grab ≈ one third of all UK adjudications** (Pinsent Masons decision data, 2025) —
  the single largest dispute category, and purely notice-based.
- **Only ~4% of referrals are claims under £25K** — the low end is a void, not a battlefield.
  Typical adjudicator fees £8K–£30K make small claims irrational today.
- Low-value/fast-track schemes (CIC MAP, TeCSA, RICS) already ~20% of referrals and growing —
  the ANBs have fixed adjudicator cost; nobody has fixed *preparation* cost. That's us.
- Adjudicators most often order the **loser to pay their fees**; TCC enforces ~77% of decisions
  in full. Claimant-side economics are strong.
- Adjacent players: Payapps etc. = prevention workflow for payers; claims consultants = humans
  at £125K+ disputes; Garfield AI = county-court debt (not adjudication). The productised,
  AI-prepared adjudication slot is open.

## Business Model

| Tier | What | Price (working) |
|---|---|---|
| Free | Notice-validity + deadline checker ("Has your payer served a valid pay less notice?") | £0 — SEO wedge |
| Docs | Chaser / letter before adjudication, payment application pack | £29–£99 |
| **Referral pack** | Full smash-and-grab: notice of adjudication, referral, bundle, ANB application, timeline management | **£990–£2,490** |
| Representation | Party representative through the 28 days | £3,500+ or day rate |
| Respondent SaaS (v2) | Payment-cycle monitoring + pay-less-notice generation for payers | £99–£299/mo |

## Tech Stack

(Confirm against repo — see REQUIREMENTS.md R1–R12 audit rubric.)
Target posture: web app; deterministic **rules engine** for dates/validity (LLM never decides a
deadline); LLM for drafting with retrieval-grounding + reviewer gate; UK/EU data residency;
Stripe GBP + VAT.

## Key Constraints

- **Date correctness is existential.** A wrong deadline = a client's lost statutory right.
  Rules engine + property-based tests + dual-calendar verification before anything ships.
- Human-in-the-loop approval on all assessments/documents until error rate proven ≈ 0.
- Founder is AU-based: UK ops must be async-native (UK phone/registered office, partner
  solicitor for enforcement, ANB relationships built remotely + one launch trip).
- Entity/IP: **AutonoLabs owns platform + brand IP**; AllSquared Ltd (UK) operates under
  licence. Operating entities never own IP (Moto Legal lesson).

## Out of Scope (Forever, for this entity)

- Consumer / residential-occupier disputes as clients
- Conducting litigation in-house; holding client money
- Australia (Autono Legal's lane), crypto recovery (ditto)
- General small-claims automation (revisit only as self-help mode, post-traction)

## Success Criteria (v1)

1. 10 paid referral packs completed with zero deadline/validity errors.
2. ≥£250K recovered for clients (aggregate notified sums paid).
3. Free checker → paid conversion ≥3%; one enforcement handoff executed cleanly via partner firm.
4. A main contractor asks for the defensive product unprompted (v2 signal).
