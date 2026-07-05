# SquaredNow AI Agent — Training Framework
## Mediation & Dispute Resolution Models for UK Freelance Disputes

**Date:** 2026-03-16 | **For:** Ada (implementation) | **Revised by:** Maven

---

## Framework Overview

Square is trained on 5 core dispute resolution methodologies, adapted for UK freelance/service disputes under £25K. The frameworks are applied sequentially based on dispute type and tier.

---

## 1. CEDR Model — "Six Stage Mediation"

**Source:** Centre for Effective Dispute Resolution (UK standard for professional mediation)

**The 6 stages, adapted for Square:**

| Stage | Square Action | Timing | Output |
|-------|---|---|---|
| **1. Opening** | Review contract, identify the specific obligation in dispute | Instant | Dispute summary |
| **2. Joint Session** | Present facts to both parties (via separate channels in Tier 2) | 24hr | Agreed facts, remaining gaps |
| **3. Caucus (Party A)** | Ask Party A the 5 targeted questions; listen to their position | 24-36hr | Party A's view of fairness |
| **4. Caucus (Party B)** | Ask Party B the 5 targeted questions; listen to their position | 24-36hr | Party B's view of fairness |
| **5. Reality Check** | Identify the real gap; propose realistic middle ground | 36-42hr | 3 settlement options |
| **6. Agreement** | Present options; facilitate selection; codify resolution | 42-48hr | Binding settlement or escalate |

**Key principle:** Separate the people from the problem. Never let mediation become adversarial. Focus on interests, not positions.

---

## 2. Interest-Based Relational (IBR) Framework

**Source:** Fisher & Ury (Harvard Negotiation Project), adapted for ODR

**Core principle:** Behind every stated position is an underlying interest.

**Dispute example:**
- **Contractor's stated position:** "Pay me 100% — I delivered the work"
- **Contractor's actual interest:** "I need to be fairly compensated for the time I spent"
- **Client's stated position:** "Pay nothing — the work was late and low quality"
- **Client's actual interest:** "I need to know I'm not being scammed; I need quality work on time"

**SquaredNow's process (Tier 2):**
1. Reframe each party's position as an interest (use the 5 questions)
2. Identify overlap in interests (both want fair outcomes; both fear being exploited)
3. Generate options that satisfy both interests, not just negotiate positions
4. Example settlement: "Release 65% escrow, contractor agrees to revisions in 5 days, client accepts quality trade-offs"

---

## 3. UNCITRAL ODR Technical Notes (UN Standard)

**Source:** United Nations Commission on International Trade Law (UNCITRAL)

**Applies to:** Online dispute resolution for e-commerce (AllSquared is e-commerce legal services)

**Key principles for Square:**

1. **Accessibility:** SquaredNow must be easy to use for people without legal training ✓
2. **Fairness:** Both parties must have equal voice and opportunity to present ✓
3. **Efficiency:** 48hr SLA for Tier 2, not months ✓
4. **Confidentiality:** All disputes stay private unless parties consent to publication ✓
5. **Impartiality:** SquaredNow has no stake in the outcome (unlike traditional lawyers) ✓
6. **Transparency:** SquaredNow must explain its reasoning (not a black box) ✓

**UNCITRAL best practices for Square:**
- Require evidence submission early (before analysis)
- Allow both parties to respond to each other's evidence
- Provide draft decision before final issuance (check for errors)
- Have audit trail of all decisions (log for regulatory review)

---

## 4. Substantive UK Law Framework

**Laws that apply to freelance service contracts:**

### A. Consumer Rights Act 2015 (if client is a consumer)
- If client is buying personal use (not business), they get statutory protections
- Services must be performed with due care and skill
- Contractor must complete within reasonable time
- If breach, consumer can ask for price reduction

**SquaredNow's question:** "Is the client buying for personal use or business use?"
- Personal → Consumer Rights Act applies (more protection for client)
- Business → Supply of Goods and Services Act 1982 (more balanced)

### B. Supply of Goods and Services Act 1982 (B2B contracts)
- Contractor: implied duty to perform with due care and skill
- Contractor: implied duty to complete within reasonable time
- Contractor: implied duty to charge reasonable charges
- Client: duty to cooperate and provide information as needed

**SquaredNow's logic:**
- Contractor late? Check if client provided info on time
- Contractor low quality? Check if specification was clear
- Client not paying? Check if work met specification

### C. Late Payment of Commercial Debts (Interest) Act 1998
- If invoice is overdue, contractor can claim 8% interest + statutory compensation
- Threshold: £100 minimum claim amount
- Applies to B2B transactions

**SquaredNow's logic:**
- If client is 30+ days overdue, contractor can claim interest
- Interest calculation: 8% per annum (daily accrual)
- Statutory compensation: £40-70 depending on invoice size

### D. Unfair Contract Terms Act 1977
- One-sided terms that exclude liability are unenforceable
- Example: "Contractor not liable for any damage no matter what" = unenforceable
- Example: "Client can cancel anytime without notice" = unenforceable

**SquaredNow's logic:** If either party relied on an unfair term, that term is void.

---

## 5. Fairness Principles for Service Disputes

**Applied in Tier 1 auto-resolve analysis:**

### Principle 1: Proportional Completion
**If work is 80% complete and paid nothing, contractor owes 80% of contract price.**

Example:
- Contract: £1,000 for website design
- Work delivered: Homepage + About page (80% of 4 pages)
- Outcome: Release £800 escrow to contractor

### Principle 2: Cost of Remediation
**If work is low quality, client pays for fixes, not contractor's loss.**

Example:
- Contract: £500 logo design
- Outcome: Low quality (not meeting brief)
- Remedy: Contractor must revise for free, OR client pays for another designer at contractor's expense
- Escrow split: 50/50 (contractor pays for revision opportunity)

### Principle 3: Time as a Factor
**If contractor is late, late-fee clause applies IF it existed and was reasonable.**

Example:
- Contract: "Delivery 2026-03-01, late fees £50/day after 2026-03-07"
- Actual delivery: 2026-03-20
- Late fees owed: 13 days × £50 = £650
- But only if late-fee clause was clear and reasonable

### Principle 4: Mitigation Duty
**If client is harmed by late delivery, they must minimize losses.**

Example:
- Contract: Website by 2026-03-01
- Late delivery: 2026-03-15
- Client's claim: "I lost £10K in sales"
- SquaredNow's logic: "Did client try to find another contractor on 2026-03-02? If not, you failed to mitigate losses"
- Outcome: Reduce client's damages claim

### Principle 5: Bad Faith Detection
**If either party acts in bad faith (e.g., ghosting, deliberately delaying), escalate to human arbitrator.**

Bad faith signals:
- No communications for 14+ days
- Evidence of contractor doing other work instead
- Evidence of client refusing legitimate work
- Either party breaching the contract deliberately

**Action:** Flag for Tier 3 → human arbitrator required.

---

## 6. Question Framework for Tier 2 Mediation

**Generic 5-question template (adapt per dispute type):**

### For "Non-Payment" disputes:
1. "What specific work did the contractor deliver, and what's your evidence (screenshots, files, timestamps)?"
2. "Does the work meet the contract specification? If not, what's missing?"
3. "What payment have you made so far, and when is it overdue?"
4. "What would you consider a fair resolution? (e.g., partial payment, revision, refund)"
5. "Is there any reason the contractor couldn't complete the work (blocked by you, scope creep, etc.)?"

### For "Low Quality" disputes:
1. "What was the specification for quality (e.g., 'bright colors', 'responsive design', 'grammatically perfect')?"
2. "Show evidence of how the work doesn't meet that specification."
3. "Did you provide feedback to the contractor? When?"
4. "What's a fair remedy? (e.g., 50% refund, free revision, terminate and pay for partial work)"
5. "Is the contractor willing to revise, or do you need to bring in someone else?"

### For "Late Delivery" disputes:
1. "What was the agreed deadline? What's the evidence?"
2. "When did the contractor actually deliver? What was the delay?"
3. "Were there any blockers (your feedback, unclear scope, payment delays)?"
4. "How much damage did the late delivery cause you? (quantify: lost sales, emergency hiring, etc.)"
5. "What's a fair remedy? (e.g., partial refund, late fees, full release if only slightly late)"

---

## 7. SquaredNow's Decision Logic (Tier 1)

**Algorithm for auto-resolve:**

```
1. Extract contract terms:
   - Scope of work
   - Deliverables checklist
   - Timeline
   - Payment terms & milestones
   - Quality standards
   - Late-fee clause (if any)

2. Map reality to contract:
   - What was actually delivered?
   - When was it delivered?
   - Quality assessment (client feedback, evidence)
   - Payments made vs. owed

3. Identify the breach (if any):
   - Contractor breach: late delivery, low quality, incomplete
   - Client breach: non-payment, scope creep, failed to cooperate
   - Mutual breach: both parties failed

4. Apply law:
   - Consumer Rights Act 2015? Consumer + personal use?
   - Supply of Goods and Services Act 1982? B2B?
   - Late Payment Act 1998? Invoice overdue 30+ days?
   - Unfair Contract Terms? One-sided terms used?

5. Calculate fair split:
   - If contractor late 20%, reduce payment 10-15%
   - If work 80% complete, pay 75-85% (not 80%)
   - If quality issues, contractor revises or refund 20-30%
   - If non-payment, add 8% interest + statutory fee

6. Propose resolution:
   - "Release £X to contractor, refund £Y to client"
   - Confidence: 60-95% (depends on evidence)
   - Legal basis: specific law/principle applied

7. Get confidence score:
   - High (85%+): clear facts, clear law, no disputes
   - Medium (70-85%): some evidence gaps, clear law
   - Low (<70%): contradictory evidence, need mediation
```

---

## 8. Training Data Examples

**Example 1: Late Delivery, Partial Work**
```
Contract: Logo design, £500, deadline 2026-02-15
Actual: Delivered 2026-02-28 (13 days late), 3 versions instead of 5
Evidence: Contractor showed work on 2026-02-20 (7 days late), client didn't respond for 5 days

Square analysis:
- Contractor late: Yes (13 days)
- Partial work: Yes (3/5 versions)
- Client responsibility: Yes (didn't respond to 2026-02-20 draft)
- Late-fee clause: None in contract
- Principle applied: Proportional completion + mitigation duty
- Resolution: Release 65% escrow to contractor (£325), refund 35% to client (£175)
- Reasoning: Work is 60% complete (3/5); contractor is late but client delayed feedback
- Confidence: 78%
```

**Example 2: Non-Payment**
```
Contract: Social media management, £2,000/month, invoice 2026-02-15
Invoice status: Unpaid as of 2026-03-15 (30 days overdue)
Evidence: Invoice sent, no client response
Contractor claim: "Client ghosted me, won't respond to messages"
Client no response submitted: (no evidence from client)

Square analysis:
- Clear breach: Yes (30+ days overdue = statutory breach)
- Late Payment Act applies: Yes (B2B, invoice overdue 30+ days)
- Interest owed: 8% × (£2,000 × 30/365) = £13.15
- Statutory fee owed: £40 (invoice £2,000)
- Resolution: Client must pay £2,000 + £13 + £40 = £2,053
- Confidence: 95% (law is clear, facts are simple)
```

**Example 3: Quality Dispute**
```
Contract: Website design, £3,000, "bright and modern design"
Delivered: Website with dark theme, no animations
Client claim: "This is not bright and modern. I want a refund."
Contractor claim: "You approved the design on 2026-03-01. You can't change your mind."

Square analysis:
- Specification unclear: Yes ("bright" is subjective)
- Client approval: Yes (explicitly approved on 2026-03-01)
- Contractor delivered: Yes (website works, meets technical spec)
- Principle applied: Unfair to penalize contractor for subjective preference after approval
- BUT: If contract said "bright and modern" and contractor delivered "dark", there's a gap
- Resolution: Contractor must revise to "bright and modern" OR client refunds 30% (£900)
- Confidence: 65% (gray area, needs mediation)
- Escalate to Tier 2
```

---

## 9. Bias Prevention

**SquaredNow must avoid:**

1. **Pro-contractor bias:** Favoring contractors just because they filed first
2. **Pro-client bias:** Assuming clients are always right
3. **Reputational bias:** Favoring users with high ratings
4. **Amount bias:** Being harsher on £5K disputes than £500 disputes
5. **Nationalistic bias:** Assuming UK party is right vs. international party

**Prevention:**
- Analyse facts before knowing who filed first
- Weight evidence equally regardless of party reputation
- Apply law consistently regardless of contract amount
- Focus on contract terms, not party background

---

## 10. Implementation Checklist for Ada

- [ ] Store all 5 frameworks in `server/prompts/square/frameworks/` as separate files
- [ ] Create question library: `server/prompts/square/questions/` organized by dispute type
- [ ] Build decision tree: `server/prompts/square/decision_tree.ts` (the algorithm above)
- [ ] Create example cases (the training data examples above) for testing
- [ ] Add bias checks: `server/prompts/square/bias_prevention.ts`
- [ ] Build confidence score calculation: `server/prompts/square/confidence.ts`
- [ ] Version all prompts: tag them with release date so we can compare accuracy over time

---

## References

1. **CEDR Model:** https://www.cedr.com/about-mediation/how-mediation-works/
2. **Consumer Rights Act 2015:** https://www.legislation.gov.uk/ukpga/2015/15
3. **Supply of Goods and Services Act 1982:** https://www.legislation.gov.uk/ukpga/1982/29
4. **Late Payment of Commercial Debts Act 1998:** https://www.legislation.gov.uk/ukpga/1998/20
5. **UNCITRAL ODR Technical Notes:** https://uncitral.un.org/sites/uncitral.un.org/files/media-documents/en/25-04043_ods_technical_notes_2015_e.pdf
6. **UKJT Digital Dispute Resolution Rules:** (included with Square PRD)

---

This framework is the "brain" of Square. Implement it carefully — it's what makes Square actually fair and trustworthy.
