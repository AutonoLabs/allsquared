# ALLSQUARED — DISPUTE RESOLUTION PLAYBOOK: CONSUMER DISPUTES

**INTERNAL — NOT FOR PUBLICATION**

**Version:** 1.0  
**Date:** [DATE]  
**Audience:** AllSquared Dispute Team, ADR Official, Operations Staff  
**Confidentiality:** Internal Use Only

---

## INTRODUCTION

This Playbook provides operational guidance for resolving 10 common consumer dispute scenarios on the AllSquared Platform. Each scenario sets out:

- How the dispute typically arises
- Immediate triage and urgency assessment
- Key deadlines and timeline
- Evidence to collect
- Decision framework for ADR Official
- Focus areas for Tier 1 AI analysis
- Range of possible determinations
- Escalation triggers to CEDR (Tier 3)
- Template communications

This Playbook is internal guidance and does not constrain the ADR Official's independent judgment. Each case is assessed on its merits.

---

## SCENARIO 1: CLIENT CLAIMS NON-DELIVERY — FREELANCER CLAIMS FULL DELIVERY

### Overview

**Common situation:** Client asserts the Freelancer failed to deliver required Deliverables within the Dispute Window. Freelancer claims delivery was made and points to materials posted on the Platform or sent by email.

### Trigger

- Dispute Window initiated by Client within 14 Working Days of claimed delivery date
- OR
- Auto-Release occurs and Client subsequently disputes the milestone (must be within 12 months of delivery)

### Triage

**Urgency:** Medium-High  
**Category:** Delivery / Performance Dispute  
**Risk Level:** Medium (core contract obligation, but usually resolvable with evidence)

**Initial Questions:**
1. Did Freelancer notify the Client of delivery? (Check Platform notifications + email)
2. Does the SOW clearly specify what constitutes "delivery"? (E.g., upload to Platform, email, file transfer, physical delivery)
3. Is there a deliverables checklist or acceptance criteria specifying what must be included?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| AllSquared requests evidence from Freelancer | Day 1–3 |
| Freelancer provides evidence of delivery | Day 10 |
| AllSquared provides evidence to Client for response | Day 10 |
| Client submits rebuttal (if any) | Day 15 |
| Tier 1 AI analysis completed | Day 20 |
| Parties respond to AI proposal | Day 25 |
| **Tier 2 ADR Official determination (if needed)** | **Day 45–90** |

### Evidence Required

**From Freelancer:**
- Platform delivery notifications or emails confirming delivery
- Screenshots of uploaded files with timestamps
- Email correspondence showing delivery
- File transfer logs (if external tool used — Dropbox, Drive, etc.)
- Proof of delivery of physical items (tracking, receipt, photos)
- Freelancer statement (what was included, date, method)

**From Client:**
- SOW specifying deliverables and delivery method
- Complaint form explaining what is missing
- Evidence of Client's searches for the files (Screenshots showing "not found in email", Platform portal searches, etc.)
- Communication attempts to locate files (emails to Freelancer asking "where is X?")
- Client statement about impact (project delayed, had to hire replacement, etc.)

### Decision Framework (for ADR Official)

**Questions to Answer:**

1. **Was delivery required by the SOW?** — Check the SOW for Deliverables list and acceptance criteria.

2. **What does "delivery" mean under the contract?** — Most SOWs specify "upload to AllSquared Platform" or "email to Client". If not specified, check clause 4.1 of the MSA (delivery via Platform communication tools).

3. **Did the Freelancer attempt to deliver?** — Look for evidence of:
   - Upload attempts (even if unsuccessful)
   - Email sends (even if unread)
   - Good-faith notification to Client

4. **If delivery was attempted, what went wrong?** — Common scenarios:
   - File uploaded but Client missed notification (Client fault)
   - Email sent but bounced or went to spam (Freelancer fault — should have followed up)
   - Partial delivery (some files delivered, some missing — partial rejection of Deliverable)
   - Delivery format wrong (e.g., sent .zip instead of individual files, Freelancer fault)

5. **Are acceptance criteria met?** — Does the delivered content meet the acceptance criteria specified in the SOW?
   - If criteria unclear, favour the Freelancer (Client drafted unclear terms)
   - If Freelancer materially missed criteria, favour the Client

### Tier 1 AI Focus

- **Timeline:** Check timestamps of emails/uploads vs. claimed delivery date. Flag if discrepancies.
- **Notification:** Did the Platform automatically notify the Client? Has Client seen the notification (check read receipts)? If Client chose to ignore notification, that weighs against Client.
- **Content Completeness:** Based on SOW Deliverables list, is what was delivered complete, or are items clearly missing?
- **Alternative Explanations:** Could the Client have simply missed the delivery? (Check notification history, Client's own email activity during that time.)

### Possible Outcomes

**Favour Client (Full Refund):**
- Freelancer failed to deliver any material Deliverable
- Freelancer's delivery was incomplete and below acceptance criteria by significant margin
- Client has provided clear evidence of missing materials
- Freelancer has not rebutted

**Favour Freelancer (Full Payment Release):**
- Freelancer provided clear evidence of delivery
- Deliverables match SOW specification and acceptance criteria
- Client did not respond to delivery notification (Client fault)
- Client is seeking refund for frivolous reasons

**Partial Outcome (Partial Payment):**
- Freelancer delivered some Deliverables but not all
- Partial delivery meets say 60% of acceptance criteria
- Release pro-rata percentage of funds (e.g., 60% to Freelancer, 40% back to Client)

**Rework Order:**
- Deliverables were delivered but quality/completeness is borderline
- Order Freelancer to rework within 10 Working Days
- Client accepts reworked version before further payment release

### Escalation Criteria to CEDR

**Escalate if:**
- Evidence is genuinely conflicting and fact-finding beyond AI/ADR Official capacity needed
- Parties dispute the technical evidence (e.g., conflicting IT expert opinions on file corruption)
- Determination could be challenged on procedural grounds (either party claims unfair process)

### Template Communications

**To Client (on receipt of dispute):**

"Dear [CLIENT NAME],

Your dispute regarding non-delivery of [DELIVERABLE NAME] has been received. We will investigate the circumstances of delivery.

To support your claim, please provide:
1. A clear list of which Deliverables you claim are missing
2. Screenshots or evidence of your searches for these Deliverables
3. Any communications you sent to [FREELANCER NAME] asking about missing work
4. The SOW specifying what was to be delivered

Deadline for evidence: [DATE — 10 Working Days]

Your case will then proceed to Tier 1 AI analysis.

Regards,
AllSquared Dispute Team"

**To Freelancer (on receipt of dispute):**

"Dear [FREELANCER NAME],

[CLIENT NAME] claims you did not deliver [DELIVERABLE NAME]. We will investigate.

To support your position, please provide:
1. Evidence of delivery (email, Platform upload screenshots with timestamps, file transfer logs, etc.)
2. Your description of what was included in the delivery
3. Any confirmation from the Client that they received the materials (even if not explicitly accepting them)

Deadline for evidence: [DATE]

Regards,
AllSquared Dispute Team"

---

## SCENARIO 2: CLIENT CLAIMS DEFECTIVE WORK — FREELANCER DISPUTES QUALITY STANDARD

### Overview

**Common situation:** Client asserts the delivered work does not meet acceptance criteria (e.g., poor quality, wrong specifications, incomplete features). Freelancer argues the work meets the SOW and acceptance criteria, or that Client's expectations were unrealistic.

### Trigger

- Dispute Window initiated by Client within 14 Working Days of delivery
- Client states: "Work does not meet acceptance criteria," "Quality is below standard," "Doesn't match specifications"

### Triage

**Urgency:** Medium  
**Category:** Quality / Performance Dispute  
**Risk Level:** Medium-High (objective vs. subjective standards often disputed)

**Initial Assessment:**
1. Are acceptance criteria objective (e.g., "code compiles without errors") or subjective (e.g., "professional design")?
2. Did the SOW specify deliverable format, features, specifications? How detailed?
3. Has Client provided specific examples of defects?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Request evidence from Client (specific defects) | Day 1–2 |
| Request response from Freelancer | Day 10 |
| AllSquared conducts quality assessment (if needed — e.g., runs code, reviews design) | Day 15–20 |
| Tier 1 AI analysis with examples | Day 25 |
| Party responses to AI proposal | Day 30 |
| **Tier 2 Determination (if escalated)** | **Day 45–90** |

### Evidence Required

**From Client:**
- Specific examples of defects (screenshots, code errors, test results)
- How the work failed to meet acceptance criteria (reference SOW section by section)
- Evidence that Client attempted to work with Freelancer to fix issues (emails requesting rework)
- Professional assessment if needed (e.g., code review by third-party developer, design critique)
- Proof of impact (project delayed, had to hire replacement, additional costs incurred)

**From Freelancer:**
- SOW and acceptance criteria as written
- Explanation of how the work meets the acceptance criteria
- Evidence that work was tested and works as specified
- If Client's feedback is vague, Freelancer states that Client failed to provide specific defect reports
- Screenshots, test results, or professional assessment showing work quality

### Decision Framework (for ADR Official)

**Key Questions:**

1. **What do the acceptance criteria say, exactly?** — Quote the SOW verbatim.
   - Objective criteria (e.g., "Code must compile without errors", "Deliverable must include sections 1, 2, 3, 4") are easier to assess.
   - Subjective criteria (e.g., "Professional", "Attractive", "Well-written") are harder to assess without additional expert opinion.

2. **Did the Freelancer meet the objective criteria?** — If yes, the Freelancer has a strong case.

3. **Are the subjective criteria ambiguous?** — If yes, favour the Freelancer (Client drafted unclear terms).

4. **Did the Client provide specific, timely feedback during the engagement?** — If Client waited until the Dispute Window to complain, that weakens the claim.

5. **Did the Freelancer have a reasonable opportunity to fix issues?** — Check timeline: Did Client raise defects early enough for Freelancer to rework? If Client waited until after delivery to complain, harder to require rework.

6. **Is an expert assessment needed?** — For technical work (code, design), sometimes the ADR Official's judgment isn't enough. Consider appointing a technical expert to assess quality.

### Tier 1 AI Focus

- **Defect Specificity:** Are Client's complaints specific (e.g., "The logo appears pixelated at 200% zoom") or vague ("The design looks unprofessional")? Vague complaints favour Freelancer.
- **Criteria Mapping:** Does each complaint map to a stated acceptance criterion? If not, it's out of scope.
- **Frequency of Defects:** Are there isolated issues (e.g., one typo) or systemic problems (entire feature missing)? Systemic = favour Client.
- **Remediation Opportunity:** Did Client give Freelancer a chance to fix issues? If not, is Freelancer still willing to rework?

### Possible Outcomes

**Favour Client (Full or Partial Refund):**
- Work objectively fails to meet acceptance criteria
- Client provided specific defect reports
- Freelancer refused reasonable rework attempts
- Defects are material and not easily fixable

**Favour Freelancer (Full Payment Release):**
- Work meets acceptance criteria as written
- Client's complaints are subjective and not backed by specific criteria
- Freelancer offered rework and Client declined
- Client has unrealistic expectations beyond SOW scope

**Rework Order (Blended Outcome):**
- Work is mostly acceptable but has specific, fixable defects
- Order Freelancer to rework within 10 Working Days
- Once rework accepted, release payment
- Partial extension of Dispute Window to cover rework acceptance
- If Freelancer refuses to rework, release partial payment and Client pursues alternative remedy

**Change Request Route:**
- Client's complaint actually requests additional work beyond SOW scope
- Issue is not a "defect" but a "change request"
- Treat as out-of-scope work; Freelancer entitled to additional fee if Client wants changes

### Escalation Criteria to CEDR

**Escalate if:**
- Expert technical assessment is required (code audit, design critique) beyond ADR Official's expertise
- Subjectivity of acceptance criteria is so high that no fair determination is possible
- Client and Freelancer are genuinely unable to agree on what "meets criteria" means

### Template Communications

**To Client:**

"We have received your claim that the delivered work does not meet acceptance criteria. To assess this fairly, please provide:

1. The specific acceptance criteria from your SOW (cut and paste exact text)
2. Specific examples of how the work fails to meet each criterion (with screenshots or code samples)
3. Evidence of your communications with [FREELANCER NAME] about these defects (did you raise them during the engagement for a chance to rework?)

Please be as specific as possible. General statements like 'poor quality' are not sufficient.

Deadline: [DATE — 10 Working Days]"

**To Freelancer:**

"[CLIENT NAME] claims your deliverables do not meet the acceptance criteria. Please respond:

1. Copy of the acceptance criteria from the SOW
2. Your explanation of how your work meets each criterion
3. If Client claims specific defects, provide your response (Does the defect exist? If so, can you fix it? At what cost/timeline?)
4. Are you willing to provide rework if specific defects are identified?

Deadline: [DATE]"

---

## SCENARIO 3: CLIENT REFUSES TO PAY (ESCROW HOLD) — CLAIMS SCOPE CREEP / UNAUTHORISED CHANGES

### Overview

**Common situation:** Client has deposited funds into Escrow but refuses to release them, claiming the Freelancer made unauthorised changes or expanded scope beyond the SOW. Freelancer maintains the work is in-scope.

### Trigger

- Dispute Window initiated by Client (Client refuses to click "Accept" and trigger Auto-Release)
- Client dispute claim: "Freelancer did unauthorized scope changes", "Work goes beyond what was agreed", "Should have asked for change request"

### Triage

**Urgency:** High  
**Category:** Scope / Payment Dispute  
**Risk Level:** High (payment at risk; Freelancer's cash flow threatened)

**Initial Questions:**
1. What does the SOW say about "out-of-scope" work?
2. Did Freelancer make changes without Client approval?
3. Are the alleged changes material or trivial?
4. Did Freelancer request a formal change request or proceed unilaterally?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Immediate: Notify both parties about Escrow hold | Day 1 |
| Request SOW and change history from Freelancer | Day 2 |
| Request explanation from Client | Day 3 |
| Review for scope changes | Day 10 |
| Tier 1 AI proposal | Day 20 |
| **Tier 2 Determination (if needed)** | **Day 45–90** |

### Evidence Required

**From Client:**
- The original SOW (as signed)
- Specific description of which changes were unauthorised
- Communications to Freelancer about the changes (did Client approve implicitly? In email?)
- "Out of Scope" section of SOW (what was explicitly excluded)
- Proof that Freelancer made changes without asking (emails, messages)

**From Freelancer:**
- The original SOW (as signed)
- Detailed description of all changes made and the reason for each
- Evidence of Client approval (emails where Client said "Yes, add this feature", "Can you also do X?")
- If changes were made without prior approval, explain why (emergency fix, logical continuation of scope)
- Change request log (if any formal change requests were submitted)
- Communication trail showing Freelancer kept Client informed

### Decision Framework (for ADR Official)

**Key Questions:**

1. **Does the SOW have a scope definition and "out of scope" section?** — Clear scope = easier to assess. Vague scope = favour Freelancer.

2. **What changes did the Freelancer make that Client disputes?** — For each alleged change:
   - Was it in the original SOW? (If yes, Freelancer in scope.)
   - Did Client implicitly approve? (Check email: "That sounds great, go ahead.")
   - Was it a logical extension? (E.g., Client said "Design a logo", Freelancer produced multiple variations and Client picked one — reasonable or scope creep?)

3. **Did Freelancer follow the MSA change request procedure (Clause 4.4)?** — If yes, more defensible. If no, Freelancer weaker position (but may still have been in scope).

4. **Is the Client using "scope creep" as a pretext for non-payment?** — Check: Did Client use/benefit from the work? Did Client object at the time or only in the Dispute Window?

5. **Are the disputed changes material or trivial?** — Material changes (e.g., additional feature) justify Client dispute. Trivial changes (e.g., extra variation of a logo) don't.

### Tier 1 AI Focus

- **Scope Clarity:** How detailed and specific is the SOW? Vague scope = harder to say something is "out of scope".
- **Change Authorization:** For each alleged change, was there Client approval (email, Slack message, verbal confirmation noted)? AI should surface each approval moment.
- **Materiality:** How much additional work did the alleged changes require? Nominal effort = Freelancer gets paid anyway. Significant effort = Client may have point.
- **Timeline:** When were changes made relative to Client approval? If Freelancer made changes before asking, that's a process breach.

### Possible Outcomes

**Favour Client (Partial or Full Refund):**
- Freelancer made material unauthorised changes beyond the SOW
- Freelancer ignored Client direction to stick to scope
- Client objected at the time and Freelancer ignored objection
- Changes added significant extra work that should have triggered formal change request

**Favour Freelancer (Full Payment Release):**
- Changes were within scope as written in the SOW
- Client implicitly approved changes (can see approval in email chain)
- Changes were trivial extensions of core scope
- Client is using "scope creep" as pretext for non-payment (Client used the work and now refuses to pay)

**Partial Payment with Change Request:**
- Some changes are in-scope (Client pays 70%)
- Some changes are out-of-scope and require a formal change request (Freelancer must submit change request for additional fee; Client may accept or reject)
- Pro-rata payment based on proportion of in-scope work

**Freeze & Rework:**
- If Freelancer genuinely exceeded scope without authorization, order removal of out-of-scope elements
- Release payment only for in-scope work
- Client pays only for what was ordered

### Escalation Criteria to CEDR

**Escalate if:**
- SOW is ambiguous and different reasonable interpretations lead to very different scope conclusions
- Professional scope assessment needed (e.g., software development scope creep complex to quantify)
- Good-faith disagreement about what Client "implicitly approved" based on email tone

### Template Communications

**To Client:**

"You have withheld payment from Escrow claiming scope creep / unauthorised changes. To assess this, please provide:

1. The original SOW (as signed) with the Scope of Work section
2. A detailed list of each change you claim was unauthorised
3. The acceptance criteria the work was supposed to meet
4. Emails/messages where you objected to changes at the time (if any)
5. How much additional value/cost you believe the unauthorised changes added

Deadline: [DATE]"

**To Freelancer:**

"[CLIENT NAME] claims you made unauthorised scope changes. Please respond:

1. Your description of each change Client is disputing
2. For each change, cite the SOW section that authorized it OR provide Client email approving it
3. If a change was made without formal approval, explain the business reason
4. How much additional effort the disputed changes required (hours, cost)
5. Are you willing to remove changes if they are deemed out-of-scope?

Deadline: [DATE]"

---

## SCENARIO 4: FREELANCER ABANDONS PROJECT MID-WAY — CLIENT DEMANDS FULL REFUND

### Overview

**Common situation:** Freelancer starts work but stops midway (no communication, no update, goes silent) for an extended period (>10 Working Days). Client demands a full refund and threatens to hire replacement.

### Trigger

- Client initiates dispute claiming: "Freelancer has abandoned the project", "No contact for 2 weeks", "Work is incomplete"
- If within Dispute Window, Customer can claim failure to deliver and seek refund
- If outside Dispute Window, harder but possible if abandonment is recent

### Triage

**Urgency:** High  
**Category:** Performance / Abandonment  
**Risk Level:** High (core contract breach; Client has legitimate business need)

**Immediate Actions:**
1. Attempt to contact Freelancer directly (call, email, Platform message) — is Freelancer alive/responsive?
2. Check last activity date on Freelancer's account
3. Review communication history for signs of prior warning

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| AllSquared attempts urgent contact with Freelancer | Day 1–2 |
| If no response, proceed to notice of breach | Day 3 |
| Freelancer given 5 Working Days to respond | Day 3–10 |
| If Freelancer provides explanation, assess (e.g., Force Majeure) | Day 10–15 |
| Tier 1 AI assessment | Day 20 |
| **Tier 2 Determination** | **Day 30–90** |

### Evidence Required

**From Client:**
- Emails/messages sent to Freelancer asking for updates (dates and responses)
- Evidence of when work stopped (last email received, last file update, etc.)
- How long Freelancer has been unresponsive (exact dates)
- Proof of Client attempting to rescind (did Client raise the issue with Freelancer or jump straight to ADR?)
- Evidence of business impact (project delay, Client wasted time waiting, had to hire replacement)

**From Freelancer (if responding):**
- Explanation for silence (illness, emergency, technical issue)
- Proof of any ongoing engagement (even if not actively working)
- If Force Majeure, evidence of the Force Majeure Event (hospital discharge, proof of house fire, etc.)
- Any partial work completed and ready to hand over
- Willingness to resume or withdraw

### Decision Framework (for ADR Official)

**Key Questions:**

1. **For how long has the Freelancer been unresponsive?** — Distinction:
   - 2–5 days = possible technical issue (email down, on holiday), not yet abandonment
   - 10+ days = abandonment (material breach of clause 4.1 MSA: "keep Client reasonably informed")
   - 20+ days = clear abandonment

2. **Is this Force Majeure or neglect?** — If Freelancer was hospitalized or had a death in family, more sympathetic. If Freelancer simply got busy with other clients, abandonment.

3. **What work remains incomplete?** — How much of the SOW is unfinished?
   - 10% remaining = Client almost done, Freelancer is shirking the finish line
   - 50%+ remaining = significant breach

4. **Did Freelancer abandon with intent to breach, or due to genuine hardship?** — Intent matters for equitable remedies.

5. **Can Freelancer resume and complete, or is the project unsalvageable?** — Check timeline: If Freelancer can resume and finish on schedule, may be better outcome than refund.

### Tier 1 AI Focus

- **Communication Timeline:** Plot the last 5 communications. When did communication cease? Was there a trigger (e.g., Client feedback that Freelancer took badly)?
- **Pattern Analysis:** Is this Freelancer's first abandonment or a pattern?
- **Work Status:** How much is actually done? Can work be recovered/handed over?
- **Force Majeure Probability:** Is Freelancer's claimed reason (illness, emergency) plausible? (Not Client's job to verify; ADR Official will do that.)

### Possible Outcomes

**Favour Client (Full Refund + Return to Escrow):**
- Freelancer has been unresponsive for 10+ Working Days
- No Force Majeure or excuse provided
- Work is materially incomplete (50%+ unfinished)
- Freelancer shows no willingness to resume

**Conditional Resumption:**
- Freelancer provides a credible explanation (hospitalization, family emergency)
- Freelancer commits to resume within 5 Working Days with an accelerated timeline
- Client agrees to wait (alternative: Client may still opt for refund)
- Escrow held pending resumption

**Partial Refund:**
- Freelancer has completed 60% of work but abandoned
- Client is entitled to refund for the 40% unfinished
- Freelancer receives payment pro-rata for work completed

**Reinstatement + Penalty:**
- Freelancer's abandonment was temporary (e.g., 3-day hospitalization) and explains the delay
- Freelancer is credible and willing to resume
- ADR Official orders: Freelancer must resume and complete within accelerated timeline (e.g., 50% reduction in timeline) without additional fee

### Escalation Criteria to CEDR

**Escalate if:**
- Freelancer cannot be located despite multiple attempts (missing person situation) — may involve law enforcement
- Force Majeure claim is disputed and requires fact-finding beyond ADR Official capacity
- Project is complex and handing off to replacement is difficult to quantify

### Template Communications

**To Freelancer (Urgent):**

"URGENT NOTICE: You have not responded to [CLIENT NAME]'s requests for [X] days. This constitutes potential abandonment of the project in breach of the MSA.

You must respond within 24 hours with:
1. Explanation for your absence
2. Current status of work
3. Timeline to resume and complete OR confirmation you are withdrawing from the engagement

Failure to respond within 24 hours will result in a determination that you have abandoned the project, and a full refund will be ordered.

Respond to: [disputes@allsquared.io]"

**To Client:**

"We have received your claim that [FREELANCER NAME] has abandoned the project. We have sent an urgent notice to the Freelancer demanding a response within 24 hours.

Pending Freelancer's response, please provide:
1. Timeline of your communications with Freelancer (when did you last hear from them?)
2. Description of work completed vs. remaining
3. Impact on your business (delay, need to hire replacement, cost)

If Freelancer does not respond, we will move to Tier 1 AI assessment and likely recommend a refund."

---

## SCENARIO 5: IP OWNERSHIP DISPUTE — CLIENT CLAIMS FULL OWNERSHIP; FREELANCER CLAIMS RETAINED LICENCE/BACKGROUND IP

### Overview

**Common situation:** Disagreement about who owns the intellectual property created. Client claims "I paid, so I own everything." Freelancer claims "I retain rights to Background IP and tools I created."

### Trigger

- Dispute initiated by Client (typically at delivery or on using the work)
- Freelancer claims ownership or licence rights in:
  - Code libraries or software templates (Background IP)
  - Design systems or reusable assets
  - Customer lists or methodologies developed during project
- Client wants exclusive ownership and exclusive use

### Triage

**Urgency:** Medium-High  
**Category:** IP Ownership  
**Risk Level:** High (IP disputes are complex and precedent-setting)

**Initial Assessment:**
1. What does the SOW say about IP ownership? (Check clause 6 of MSA + SOW IP addendum if any)
2. Did the Freelancer create custom tools or use pre-existing tools?
3. What is the nature of the IP? (Code, designs, writings, brand assets, etc.)
4. Is there open-source or third-party software involved?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Request SOW + IP addendum from both parties | Day 1 |
| Request detailed IP specification from Client | Day 5 |
| Request IP source/Background IP disclosure from Freelancer | Day 5 |
| Analysis of IP overlap | Day 15 |
| Tier 1 AI proposal with detailed breakdown | Day 25 |
| **Tier 2 Determination (if escalated)** | **Day 60–90** |

### Evidence Required

**From Client:**
- The signed SOW
- Any IP addendum or separate IP agreement
- What specific IP Client claims to own (list all assets, code files, designs, etc.)
- Why Client believes they should own it (full title guarantee language in MSA, Client belief that "I paid so I own")
- Use case: How does Client intend to use the IP? (internally only, resale, licensing, etc.)

**From Freelancer:**
- The signed SOW
- Any IP addendum
- Identification of Background IP (tools, libraries, code templates, design systems that pre-existed the project)
- Evidence of Background IP pre-existence (GitHub repos, prior client projects, open-source licenses)
- Identification of Foreground IP (custom work created for this Client)
- Any open-source software incorporated (with licenses)
- Explanation of which IP Freelancer believes they are retaining and why

### Decision Framework (for ADR Official)

**Key Questions:**

1. **What does the MSA Clause 6 say?**
   - Clause 6.1: "Foreground IP assigned to Client on full payment" — if Freelancer has been paid, Client owns custom work
   - Clause 6.2: "Background IP licensed to Client non-exclusive, perpetual" — Freelancer retains ownership but grants Client a licence
   - Clause 6.3: "Open-source components are Client's responsibility" — Client must comply with open-source licences

2. **What is Foreground vs. Background IP here?**
   - **Foreground IP = custom work created for this Client** (e.g., custom code written to meet Client's specifications, custom designs created for Client's brand)
   - **Background IP = pre-existing tools/libraries** (e.g., code templates, design systems, Ruby gems, npm packages that Freelancer used)

3. **Can the Freelancer's Background IP be separated from the Foreground IP?**
   - If yes: Freelancer gets Background IP back, Client gets Foreground IP
   - If no: Entire work is entangled; need more complex solution (Client gets exclusive use but Freelancer retains underlying rights, or Client pays premium for full ownership)

4. **Is there open-source software involved?**
   - If yes: Client automatically accepts the open-source license terms (Clause 6.3). This may mean Client cannot use the software for proprietary/closed-source purposes.

5. **Has the Freelancer been fully paid?**
   - If yes: Ownership assignment (6.1) takes effect; Freelancer must assign
   - If no: Freelancer may condition assignment on full payment

### Tier 1 AI Focus

- **IP Classification:** For each asset (code file, design, document), classify as Foreground or Background
- **Licensing Review:** Search for open-source licenses in code (look for license headers, package.json, requirements.txt, package.json)
- **Pre-existence Evidence:** For claimed Background IP, check dates of creation (GitHub commits, file timestamps). If created during this project, it's Foreground.
- **Practical Separability:** Can the Background IP be extracted without damaging the deliverable? (Yes = Client gets clean separation; No = complex remedy needed)

### Possible Outcomes

**Favour Client (Full Ownership):**
- SOW clearly states "Client gets exclusive ownership of all IP"
- Freelancer has not identified any Background IP
- All work is custom and created for this Client
- Freelancer has been fully paid

**Favour Freelancer (Ownership + License):**
- SOW and MSA Clause 6.2 provide for Background IP to be licensed (non-exclusive) to Client
- Freelancer has identified specific Background IP with evidence of pre-existence
- Client's use does not require exclusive ownership (Client can licence non-exclusively)

**Blended Outcome (IP Carve-Out):**
- Foreground IP assigned to Client (custom work)
- Background IP licensed to Client non-exclusive perpetual (tools, libraries, methodologies)
- If Client wants exclusive ownership of Background IP, Client must pay a premium (e.g., additional 20–50% of project fee)

**Conditional Assignment (Payment Condition):**
- If Freelancer has not been fully paid, Freelancer may condition full IP assignment on completion of payment
- If dispute is about payment non-completion, resolve payment first; IP assignment follows

**Open-Source Compliance:**
- If open-source is involved, Client must accept and comply with open-source license terms
- Client cannot use the deliverable for proprietary purposes if GPL or similar license applies
- If Client wants proprietary use, Freelancer must recreate the work without open-source components (additional cost)

### Escalation Criteria to CEDR

**Escalate if:**
- Multiple open-source licenses are entangled and compatibility is unclear (needs IP specialist)
- IP is extremely valuable and parties want external expert validation (e.g., patent attorney review)
- Business context requires ongoing relationship post-dispute (mediation better than determination)

### Template Communications

**To Client:**

"Your dispute relates to IP ownership. Please provide:

1. Which specific assets do you claim to own? (List each file, code, design, etc.)
2. The SOW's IP ownership section
3. Any IP-specific agreement or addendum
4. Do you intend to use this IP exclusively (only you, not the Freelancer)? Or non-exclusively?
5. Have you used the IP yet? If so, how?

Deadline: [DATE]"

**To Freelancer:**

"[CLIENT NAME] disputes IP ownership. Please respond:

1. Which IP is your Background IP (pre-existing tools, libraries, templates)?
2. For each Background IP item, provide evidence of pre-existence (GitHub link, date of creation, link to prior client work)
3. Which IP is Foreground IP (custom work for this Client)?
4. Are you willing to assign Foreground IP to Client if fully paid?
5. Are you retaining Background IP? On what terms (exclusive or non-exclusive license)?

Deadline: [DATE]"

---

## SCENARIO 6: COMMUNICATION BREAKDOWN — ONE PARTY UNRESPONSIVE (SILENCE > 10 WORKING DAYS)

### Overview

**Common situation:** One party has gone silent (no response to messages) for more than 10 Working Days. Client cannot get updates on project progress. Freelancer cannot get feedback or clarification.

### Trigger

- Dispute initiated when silence exceeds 10 Working Days
- Complaining party claims inability to perform duties due to lack of input/feedback
- One party stuck unable to proceed (waiting for feedback, waiting for payment, etc.)

### Triage

**Urgency:** High  
**Category:** Conduct / Communication Breach  
**Risk Level:** Medium (may indicate project is abandoned or party is unwell)

**Immediate Assessment:**
1. Why is the party unresponsive? (Technical issue, illness, deliberately ignoring, overwhelmed, etc.)
2. Is the silence total, or is the party responding slowly?
3. Is work proceeding despite the silence, or is the project blocked?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| AllSquared attempts immediate contact with unresponsive party | Day 1 |
| Send notice of breach (must respond within 3 Working Days) | Day 1 |
| If no response to notice, assume abandonment | Day 5 |
| Document all communications and silence | Day 5 |
| Tier 1 assessment with default judgment if party unresponsive | Day 15 |
| **Tier 2 Determination** | **Day 30–60** |

### Evidence Required

**From Complaining Party:**
- Timeline of all communication attempts (emails, Platform messages, phone calls)
- Dates and content of each message
- No response from other party (prove silence)
- Impact of silence (project delayed, work blocked, Freelancer unable to proceed, Client unable to provide feedback)
- Evidence of good faith: Was complaining party's own communication clear and timely?

**From Unresponsive Party (if/when they respond):**
- Explanation for silence (illness, family emergency, technical issue, moved and lost email access, overwhelmed, etc.)
- Any partial responses or attempts to communicate (e.g., sent one email but it bounced)
- Evidence of ongoing commitment to project (even if not communicating)
- Willingness to resume communication and catch up

### Decision Framework (for ADR Official)

**Key Questions:**

1. **What is the duration of silence?** Distinguish:
   - 5 days = possible temporary issue (email problem, on holiday)
   - 10 days = material breach of Clause 4.1 (keep Client informed)
   - 15+ days = prolonged breach; presumption of abandonment if no explanation

2. **Did the complaining party do their part?** Check:
   - Was the complaining party's communication clear and timely?
   - Did complaining party try multiple channels (email, phone, Platform)?
   - Or did complaining party send one message and then abandon?

3. **Is the silence tied to another failure?** Often, silence indicates:
   - Freelancer is stuck on Client's feedback and hasn't asked for help
   - Client is stuck waiting for Deliverable and is checking silence
   - Payment is in dispute and one party is punishing the other with silence

4. **Can the silent party be reached now?** If unresponsive party has re-engaged, less severe remedy. If still silent, more severe.

5. **What remedy is proportionate?**
   - Warning (resume communication within 3 days)
   - Partial refund (for time lost to silence)
   - Termination (if silence has broken the relationship)
   - Default judgment (if unresponsive party ignores ADR notice)

### Tier 1 AI Focus

- **Communication Timeline:** Plot every message, response, delay. Identify when silence started.
- **Effort Evidence:** Count attempted contact channels. (One email = not enough effort. Multiple channels + phone calls = serious effort.)
- **Reciprocal Blame:** Is the complaining party also silent? (Check: Did Client respond when Freelancer messaged?)
- **Explanations:** If unresponsive party eventually responds with explanation (hospitalization, death in family), note credibility.

### Possible Outcomes

**Favour Complaining Party (Refund/Termination):**
- Unresponsive party has been silent for 10+ Working Days
- Silence is unexplained and party has not re-engaged despite AllSquared's notice
- Complaining party made good-faith contact efforts
- Project is blocked or materially delayed

**Favour Unresponsive Party (Conditional Reinstatement):**
- Unresponsive party provides credible explanation (hospitalization, family emergency, genuine technical issue)
- Unresponsive party is now re-engaged and willing to catch up
- Project timeline can be salvaged with accelerated work

**Mutual Compliance Order:**
- Both parties have been slow to communicate (shared responsibility)
- Order both parties to communicate with status updates every 3 Working Days, minimum
- Escrow released conditional on communication compliance

**Partial Refund + Continuation:**
- Complaining party is due compensation for the time lost (e.g., delay cost)
- Project is restarted with clearer communication expectations
- Escrow released pro-rata (e.g., 90% to Freelancer for work to date, 10% held pending completion with better communication)

### Escalation Criteria to CEDR

**Escalate if:**
- Relationship breakdown is severe and parties might benefit from mediation to restore communication
- Underlying issues (disrespect, cultural misunderstanding) are causing silence

### Template Communications

**Immediate Notice to Unresponsive Party:**

"URGENT: You have not responded to [COMPLAINING PARTY] for [X] days despite their repeated attempts to contact you. This is a material breach of the MSA Clause 4.1.

You must respond to [disputes@allsquared.io] within 24 hours with:
1. Explanation for your silence
2. Your current status and commitment to the project
3. Your plan to catch up on communication

Failure to respond within 24 hours may result in a determination that you have abandoned the project and a refund will be ordered."

**To Complaining Party:**

"We have sent an urgent notice to [UNRESPONSIVE PARTY] demanding a response within 24 hours. Meanwhile, please provide:

1. Full timeline of your communication attempts (dates, messages, no response received)
2. Impact of the silence on your project (delay, cost, inability to proceed)
3. Evidence of your good-faith efforts to reach out (screenshots of messages)

Depending on the Unresponsive Party's response, we will issue a Tier 1 assessment or move to Tier 2 Determination."

---

## SCENARIO 7: FRAUD SUSPECTED — EITHER DIRECTION (FABRICATED DELIVERY EVIDENCE / FALSE NON-DELIVERY CLAIM)

### Overview

**Common situation:** One party suspects the other of fraud, either:
- **Freelancer fraud:** Fabricated evidence of delivery (fake screenshots, doctored timestamps) when work was not actually delivered
- **Client fraud:** False claim of non-delivery when work was actually delivered, to obtain refund

### Trigger

- Either party alleges: "The other party has provided false evidence", "Screenshots are doctored", "Email is fabricated"
- Technical red flags: Metadata inconsistencies, timestamp anomalies, Photoshop evidence of image editing

### Triage

**Urgency:** Critical  
**Category:** Fraud / Dishonesty  
**Risk Level:** Critical (fraud is serious and may require law enforcement escalation)

**Immediate Assessment:**
1. What is the specific fraud allegation?
2. Is there technical evidence (metadata, forensics, inconsistencies)?
3. Has either party already involved law enforcement or a solicitor?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Preserve all evidence (don't delete, forensics) | Day 1 |
| Notify both parties of fraud allegation | Day 2 |
| Demand responses with right to legal representation | Day 3 |
| Technical expert review (if needed) | Day 10–20 |
| **Tier 2 ADR Official review with caution** | **Day 30–90** |

### Evidence Required

**From Alleging Party:**
- Specific description of the fraud claim
- Technical evidence (metadata discrepancies, timestamp anomalies, evidence of editing)
- Expert assessment (if fraud involves technical evidence, may need IT forensics)
- Prior warnings to other party (did you tell them the evidence looked fake?)
- Proof of falsity (do you have independent proof the claim is false?)

**From Accused Party:**
- Rebuttal of the fraud allegation
- Explanation for any technical anomalies (e.g., "Screenshot was taken after I edited the image to remove sensitive data")
- Proof of authenticity if possible (original file with metadata, independent witnesses)

### Decision Framework (for ADR Official)

**Key Questions:**

1. **Is this actually fraud or just poor evidence?** — Distinguish:
   - Fraud = intentional deception (fabricated evidence, false claims)
   - Poor evidence = genuine but not well-documented (lost email, unclear screenshot)

2. **What is the specific evidence of fraud?** — Examples:
   - Screenshot shows date "tomorrow" (time-travel fraud) — clear fraud
   - Metadata of image shows edit date after delivery date — fraud
   - Multiple "delivery" screenshots use the same image file, just renamed — fraud

3. **Or is the allegation plausible but unproven?** — Example:
   - Client claims work is fake, but Freelancer has email trail showing work was done
   - Absence of clear proof is not proof of fraud

4. **Should this be reported to law enforcement?** — If fraud appears credible and involves:
   - Forgery
   - Identity theft
   - Theft by deception
   - Large financial amounts
   — Advise reporting to police

5. **Can ADR Official make a determination, or is this beyond scope?** — Fraud may require:
   - Court proceedings (for criminal fraud)
   - Police investigation
   - Forensic expert analysis
   — ADR Official may decline jurisdiction and refer to courts

### Tier 1 AI Focus

- **Timeline Consistency:** Can the AI cross-check timestamps of emails vs. screenshots vs. file metadata?
- **Pattern Analysis:** Does the accused party have a history of fraud? (Check prior disputes)
- **Evidence Chain:** Is the evidence properly preserved or has it been altered/deleted?

### Possible Outcomes

**Fraud Finding Against Freelancer:**
- If Freelancer fabricated delivery evidence:
  - Full refund to Client
  - Termination of Freelancer account (permanent ban from Platform)
  - Referral to police if criminal fraud suspected
  - Client may seek damages in court

**Fraud Finding Against Client:**
- If Client falsely claimed non-delivery:
  - Full payment released to Freelancer
  - Potential damages claim by Freelancer
  - Client removed from Platform for dishonesty
  - Referral to police if fraud was criminal

**Insufficient Evidence of Fraud:**
- If evidence is merely suspicious but not conclusive:
  - ADR Official gives benefit of doubt to accused party
  - Disputing party's allegation is weak and doesn't overcome the other's evidence
  - Matter proceeds as normal dispute (non-fraud)

**Defer to Courts/Police:**
- If fraud allegation appears credible and serious:
  - ADR proceedings are paused
  - ADR Official declines to determine (says: "This is a matter for the courts")
  - Parties are advised to report to police and litigate
  - AllSquared assists with evidence preservation

### Escalation Criteria to CEDR

**Do NOT escalate to CEDR.** Fraud is beyond mediation's scope. Escalate to:
- Police (if criminal fraud is suspected)
- Courts (for civil fraud damages)
- Law enforcement referral

### Template Communications

**On Receipt of Fraud Allegation:**

"NOTICE: [ALLEGING PARTY] has alleged that [ACCUSED PARTY] has committed fraud by [SPECIFIC ALLEGATION].

[ACCUSED PARTY]: You have the right to respond, with legal representation if you wish. You must respond within 5 Working Days with:
1. Full rebuttal of the fraud allegation
2. Explanation of any technical anomalies
3. Your own evidence of authenticity (original files, witnesses, etc.)

Fraud is a serious matter. If fraud is found, this may be referred to law enforcement and your account may be suspended pending investigation.

You may contact a solicitor before responding. Your response must be submitted to [disputes@allsquared.io]"

**To Both Parties:**

"ADR Official will carefully review the fraud allegation and associated evidence. Fraud findings require a high standard of proof. The ADR Official will determine:

1. Is there clear evidence of fraud?
2. If yes, refer to police
3. If no, proceed as normal dispute

Pending the fraud investigation, Escrow funds remain held and Dispute Window may be extended."

---

## SCENARIO 8: DISPUTE RAISED AFTER AUTO-RELEASE HAS TRIGGERED (14-DAY WINDOW MISSED)

### Overview

**Common situation:** Client missed the 14-day Dispute Window. Auto-Release has occurred and funds have been released to the Freelancer. Client now (days or weeks later) claims non-delivery or defect and seeks to reverse the release.

### Trigger

- Client initiates dispute >14 Working Days after delivery
- Client says: "I just realized the work is bad", "I didn't see the notification", "I was on holiday"
- Freelancer has already received payment

### Triage

**Urgency:** Medium  
**Category:** Procedural / Time-Barred Dispute  
**Risk Level:** Medium (procedural question: can Client waive the Dispute Window?)

**Initial Assessment:**
1. When was delivery date?
2. When did Client notify AllSquared of the dispute?
3. How many days elapsed?
4. What is Client's reason for missing the window?
5. Is the underlying claim meritorious?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Verify delivery date and Auto-Release date | Day 1 |
| Assess whether Client should have received Dispute Window notice | Day 2 |
| Review Client's reason for missing window | Day 3 |
| Determine if Client had "good cause" to excuse the time-bar | Day 5 |
| Tier 1 AI assessment | Day 15 |
| **Tier 2 Determination** | **Day 30–60** |

### Evidence Required

**From Client:**
- Proof of delivery (date)
- Evidence that Client did not see the Dispute Window notice (no email, no notification received)
- Reason for missing the window (on holiday, in hospital, email filter, etc.)
- Date Client discovered the alleged defect
- Why didn't Client discover the issue within the 14 days? (Didn't use the work until after Auto-Release)
- The underlying claim (non-delivery, defect) with supporting evidence

**From Freelancer:**
- Proof of delivery and notification sent
- Email receipt or Platform notification showing notice was sent
- If Client is claiming "email didn't arrive", Freelancer can show the email was delivered to Client's server

### Decision Framework (for ADR Official)

**Key Questions:**

1. **Did the Dispute Window exist and was Client properly notified?** — Check:
   - MSA Clause 5.5 establishes 14 Working Day Dispute Window
   - Did AllSquared send proper notice to Client?
   - Is Client claiming didn't receive notice (technical failure) or didn't read it (Client's fault)?

2. **Is there a technical failure (AllSquared's fault) or a Client fault?**
   - AllSquared failed to send notice = ADR Official may excuse time-bar
   - Notice was sent but Client missed it (email filter, didn't read) = time-bar stands

3. **Did Client waive the Dispute Window by accepting Escrow release?**
   - MSA Clause 5.5 states: "Client waives right to dispute that Milestone post-Auto-Release (except fraud)"
   - If Auto-Release occurred without Client clicking "Reject", time-bar is strict

4. **Is there fraud exception?** — If Client claims Freelancer fabricated delivery evidence (fraud), the fraud exception in Clause 5.5 may override the time-bar.

5. **What is the underlying claim?** — Even if time-bar applies, the ADR Official will want to assess:
   - Is the claim meritorious?
   - Was the work genuinely defective or is Client's complaint frivolous?
   - Has Freelancer already spent the money or can Freelancer provide remedy?

### Tier 1 AI Focus

- **Notice Delivery:** Did the Platform send the Dispute Window notice? Check email logs. Was it delivered? Did Client open it?
- **Time-Bar Strict:** MSA is clear that post-Auto-Release disputes are time-barred unless fraud. AI should assess whether this is a strict procedural bar or whether exception applies.
- **Fraud Check:** Is Client claiming fraud (fabricated delivery)? If yes, may override time-bar.

### Possible Outcomes

**Time-Bar Upheld (Dispute Refused):**
- Dispute Window has passed
- Client had proper notice (or should have had notice)
- No fraud alleged
- Dispute is refused on procedural grounds (time-bar)
- Client's only remedy is to sue Freelancer in court (ADR no longer available)

**Time-Bar Excused (Rare):**
- AllSquared failed to send notice (technical fault)
- Client had no reasonable way to know about Dispute Window
- Underlying claim is meritorious (would have succeeded if raised in time)
- Determination on merits; may order Freelancer to refund or provide remedy

**Partial Remedy:**
- Client missed Dispute Window but has credible fraud allegation
- ADR Official finds fraud exception applies
- Determination on merits; order remedy (refund or rework)

**Time-Bar Stands but Document for Appeal:**
- Dispute Window is time-barred
- But ADR Official notes that the underlying claim appears meritorious
- Advises Client: "Dispute is time-barred for ADR purposes. However, you may pursue this in court within the 6-year limitation period for breach of contract."

### Escalation Criteria to CEDR

**Do NOT escalate.** Time-barred disputes are not suitable for mediation. Either:
- Time-bar is upheld (no more ADR)
- Time-bar is excused and matter is resolved in Tier 2

### Template Communications

**To Client (on late dispute submission):**

"Your dispute has been received but was submitted [X] days after the delivery of the Deliverable, which is outside the 14 Working Day Dispute Window established in the MSA Clause 5.5.

Please explain:
1. When did you first become aware of the defect or non-delivery?
2. Why did you not raise the dispute within the 14 Working Day window?
3. Did you receive AllSquared's Dispute Window notice? (Check your email spam folder)

Deadline: [DATE — 5 Working Days]

Note: If the Dispute Window has passed, ADR may not be available unless fraud is involved."

---

## SCENARIO 9: FORCE MAJEURE CLAIMED BY FREELANCER — CLIENT DISPUTES VALIDITY

### Overview

**Common situation:** Freelancer claims a Force Majeure Event prevented performance (illness, equipment failure, internet outage, etc.) and is seeking relief from payment obligations or timeline extension. Client disputes that the event qualifies as Force Majeure or disputes the severity/impact.

### Trigger

- Freelancer initiates discussion of Force Majeure (or raises it in response to non-delivery dispute)
- Freelancer claims inability to perform due to: illness, death in family, house fire, cyber attack, internet failure, natural disaster, pandemic, etc.
- Freelancer seeks: timeline extension, partial payment, or full excusal of non-performance

### Triage

**Urgency:** High (may involve urgent need for remedy to salvage project)  
**Category:** Force Majeure / Excuse  
**Risk Level:** Medium (depends on merit of Force Majeure claim and Client's urgency)

**Initial Assessment:**
1. What is the claimed Force Majeure Event?
2. Is it listed in MSA Clause 14.3 (cyber attacks, pandemic, etc.)?
3. How long will it prevent performance?
4. Did Freelancer notify Client promptly (within 5 days)?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Receive Force Majeure notice from Freelancer | Day 1 |
| Freelancer provides evidence of event (doctors note, photo, police report) | Day 3–5 |
| AllSquared assesses event and impact | Day 10 |
| Tier 1 AI assessment of Force Majeure merit | Day 15 |
| **Tier 2 Determination (if disputed)** | **Day 30–90** |

### Evidence Required

**From Freelancer:**
- Detailed description of the Force Majeure Event
- Evidence: Doctor's note (if illness), hospital discharge (if hospitalization), photos (if property damage), police report (if theft or accident), utility notice (if internet failure), etc.
- Duration: How long is/was the impact?
- Mitigation efforts: What has Freelancer done to minimize the impact? (Used hotspot, asked colleague to help, accelerated timeline post-recovery)
- Notification to Client: When was Client told? Was the timeline reasonable (within 5 days)?
- Residual obligation: Can Freelancer still perform and within what revised timeline?

**From Client:**
- Challenge to whether the event qualifies as Force Majeure (e.g., "You had an internet outage but could have used a hotspot")
- Evidence that Freelancer could still perform or could mitigate (e.g., "Can you ask a colleague to help?")
- Impact on Client (project delay, Client's downstream obligations, cost of delay)
- Proof that Freelancer was not overextended (was this Freelancer's fault for taking too many projects?)

### Decision Framework (for ADR Official)

**Key Questions:**

1. **Is the claimed event a "Force Majeure Event" under MSA Clause 14.3?** — Clause 14.3 lists:
   - Natural disasters (earthquake, flood, tornado)
   - War, terrorism
   - Government actions, sanctions
   - Pandemic or epidemic
   - Cyber attacks
   - AI system outages (including Platform failures)
   - Telecommunications failures
   - Third-party payment processor failures (e.g., Transpact outage)
   - [Other events beyond reasonable control]

   Common disputes: Does a minor illness count as "beyond reasonable control"? (No — everyone gets the flu.) Does hospitalization? (Yes.) Does losing internet for 1 day? (No — could use hotspot.)

2. **Was the event truly beyond Freelancer's reasonable control?** — Test:
   - Could Freelancer have prevented it through reasonable precautions? (If yes, not Force Majeure.)
   - Did Freelancer have a backup plan? (If not, Freelancer failed to be reasonably prepared.)

3. **How long does the impact last?** — Distinguish:
   - 1 day = trivial, can catch up (not Force Majeure relief)
   - 5+ days = material impact (Force Majeure relief likely)
   - 30+ days = project may be unsalvageable (consider termination option)

4. **Did Freelancer notify Client promptly?** — MSA Clause 14.1 requires prompt notice within 5 Working Days. Failure to notify is itself a breach.

5. **Can Freelancer still perform?** — Even if Force Majeure is valid, Freelancer must use reasonable efforts to resume (Clause 14.1(b)).

### Tier 1 AI Focus

- **Event Plausibility:** Is the claimed event credible? (Cross-check with news — was there really a large cyber attack that day? Is the timeline consistent with reported events?)
- **Mitigation Assessment:** Did Freelancer do enough to mitigate? (Hotspot available? Remote colleague who could help?)
- **Notification Timing:** When was Client notified? Was it timely (within 5 days)?
- **Recovery Timeline:** Has the Freelancer recovered or is still impacted? When can they resume?

### Possible Outcomes

**Force Majeure Upheld (Timeline Extension Granted):**
- Event qualifies as Force Majeure under MSA Clause 14.3
- Freelancer notified Client promptly
- Freelancer is using reasonable efforts to resume
- Grant timeline extension (e.g., 14 extra days) without penalty
- No penalty for delayed delivery

**Force Majeure Partially Upheld (Shortened Extension):**
- Event qualifies as Force Majeure, but Freelancer could have mitigated better
- Example: Internet down for 2 days, could have used hotspot same day (was avoidable)
- Grant shorter extension (e.g., 5 days instead of 14)

**Force Majeure Rejected (Freelancer in Breach):**
- Claimed event does not qualify as Force Majeure (e.g., "got busy with other projects")
- Or Freelancer failed to mitigate (refused to use hotspot, ask for help, etc.)
- Client entitled to refund or replacement

**Termination Option (Event is Severe):**
- Force Majeure is valid, but impact is so severe (30+ days) that project cannot continue
- Either party may terminate without liability (MSA Clause 14.2)
- Escrow returned pro-rata for work completed

### Escalation Criteria to CEDR

**Escalate if:**
- Relationship can be salvaged through discussion of revised timeline/terms
- Mediation helps parties agree on "reasonable efforts" post-recovery

### Template Communications

**To Freelancer (on Force Majeure Claim):**

"You have claimed Force Majeure due to [EVENT]. To assess this, please provide:

1. Detailed description of the event and how it prevents performance
2. Evidence: Doctor's note, photos, police report, utility notice, etc.
3. Duration: How long will it prevent performance?
4. Mitigation: What have you done to minimize the impact? (Hotspot, colleague help, etc.)
5. Recovery: When can you resume? Revised timeline to completion?
6. Notification: When did you tell [CLIENT NAME]? By what method?

Deadline: [DATE — 5 Working Days]"

**To Client:**

"[FREELANCER NAME] has claimed Force Majeure due to [EVENT]. Please respond:

1. Do you dispute that this qualifies as Force Majeure?
2. Could the Freelancer have mitigated (used hotspot, asked colleague, etc.)?
3. What is the impact on your project if the timeline is extended [X] days?
4. Are you willing to accept a revised timeline, or do you demand full refund?

Deadline: [DATE]"

---

## SCENARIO 10: BOTH PARTIES REJECT TIER 1 AI PROPOSAL — ESCALATION MECHANICS TO TIER 2

### Overview

**Common situation:** Tier 1 AI analysis proposes a settlement (e.g., "Freelancer refund 30%, Client keeps 70%"). Both Client and Freelancer reject the proposal. Neither party is willing to settle without full vindication of their position.

### Trigger

- Both parties reject Tier 1 AI proposal within response deadline
- Either party requests escalation to Tier 2 ADR Official
- Matter now proceeds to formal ADR with human judgment required

### Triage

**Urgency:** Medium  
**Category:** Escalation / Contested Matter  
**Risk Level:** Medium (Tier 2 will be more expensive in time and potentially money; stakes are higher)

**Initial Assessment:**
1. Why did each party reject the AI proposal?
2. Are the positions genuinely irreconcilable?
3. Is either party showing bad faith (rejecting all reasonable proposals)?

### Timeline

| Milestone | Days from Submission |
|-----------|---------------------|
| Both parties submit rejections of Tier 1 proposal | Day 25 |
| AllSquared confirms Tier 2 escalation to both parties | Day 26 |
| Assign ADR Official (check independence) | Day 27 |
| Request full submissions from both parties (Tier 2) | Day 28–30 |
| Both parties submit evidence and arguments | Day 40 |
| ADR Official reviews all materials | Day 45–50 |
| ADR Official conducts any hearings (if requested) | Day 50–70 |
| **Tier 2 Determination issued** | **Day 80–90** |

### Evidence Required

**From Both Parties (for Tier 2):**
- Full written submissions (2,000–3,000 words) explaining:
  1. The contract terms and how they apply
  2. The facts supporting their position
  3. Why they rejected the Tier 1 proposal (was it unfair? Did it miss key evidence?)
  4. What outcome they seek
  5. Legal argument (relevant clauses, precedent cases if appropriate)
- All evidence (supporting documents, emails, screenshots, expert assessments)
- Request for oral hearing (if desired) — explain why oral testimony is necessary
- Any new evidence not previously disclosed to Tier 1

### Decision Framework (for ADR Official)

**Key Questions:**

1. **Did the parties reject for good reasons or as a negotiating tactic?**
   - Good reason: AI missed key evidence, misapplied the contract, proposal was genuinely unfair
   - Bad reason: Party is making an "all or nothing" bet that ADR Official will fully agree with their position

2. **What does the contract clearly say?** — Is one party's interpretation obviously correct based on the SOW and MSA?

3. **Is there a legal principle that resolves the dispute?** — Example:
   - Non-delivery: Does Client have clear proof? (Yes = favour Client.) Or is evidence ambiguous? (Ambiguity = favour Freelancer, who drafted the contract.)
   - IP ownership: Clause 6.1 says "Client owns Foreground IP on full payment" — is this unambiguous or disputed?

4. **Should the ADR Official take a middle position or fully favour one party?** — Depends on evidence:
   - If evidence strongly favours one party, ADR Official should say so (not split the baby)
   - If evidence is genuinely mixed, ADR Official may propose a blended outcome
   - But ADR Official should explain the reasoning; must not appear arbitrary

5. **Is there a party in bad faith?** — Example:
   - Freelancer rejected Tier 1 proposal for sole reason that it didn't give full payment (no matter the merits)
   - Client rejected proposal claiming fraud (which is unfounded)
   - One party is using ADR as a delay tactic
   — If bad faith is found, ADR Official may shift costs to that party or recommend expedited court proceedings

### Tier 1 AI Focus (in retrospective analysis)

- **Completeness:** Did Tier 1 analysis miss material evidence that the parties are now raising? If yes, escalation is justified.
- **Reasoning:** Was Tier 1's reasoning transparent and logical, or did it make leaps that parties find unconvincing?

### Possible Outcomes

**Clear Vindication of One Party:**
- If evidence strongly supports one party's position, ADR Official issues a determination favoring that party fully
- Example: "Client's complaint that work was not delivered is proven. Refund is ordered in full."

**Blended Outcome:**
- Evidence is mixed and neither party's position is fully justified
- ADR Official proposes a middle-ground determination (e.g., 60/40 split, partial rework + payment)
- Explain reasoning to show it is not arbitrary

**Conditional Remedy:**
- Remedy is conditional on one party's future performance
- Example: "Refund is ordered unless Freelancer reworks the Deliverable within 10 days to Client's satisfaction, in which case full payment is released."

**Escalation to CEDR:**
- If parties remain at an impasse even after Tier 2 determination, parties may agree to Tier 3 CEDR mediation
- CEDR mediator attempts to find middle ground or facilitate settlement
- Not guaranteed to succeed

**Cost Implications (B2B disputes):**
- If B2B dispute and one party is found to be in bad faith, ADR Official may recommend shifting ADR fees to the bad-faith party
- Example: "Client made frivolous claims; Client should bear the B2B ADR fee of £500."

### Escalation Criteria to CEDR

**Escalate if:**
- Tier 2 ADR determination is issued but both parties reject it
- Parties have agreed in advance that Tier 2 determination is non-binding (not binding by agreement)
- Parties wish to attempt mediation before litigation

### Template Communications

**On Tier 1 Rejection by Both Parties:**

"Both parties have rejected the Tier 1 AI proposal. The matter now escalates to Tier 2 ADR Official Determination.

The ADR Official will conduct a full review of all evidence and submissions, and will issue a binding determination (if you agreed in advance) or non-binding opinion (if you did not agree in advance).

To proceed to Tier 2, please submit:

1. **Full Written Submission** (2,000–3,000 words) explaining:
   - Your position on the core dispute
   - Why the Tier 1 proposal was insufficient
   - All relevant evidence
   - The outcome you seek

2. **Supporting Evidence** (any new documents or materials not previously shared)

3. **Hearing Request** (do you want to speak to the ADR Official? Explain why.)

Deadline: [DATE — 10 Working Days]

Once both parties have submitted, the ADR Official will review and issue a determination within 90 days."

---

**END OF DISPUTE RESOLUTION PLAYBOOK — CONSUMER DISPUTES**

**For questions about these scenarios, contact the Dispute Team: [disputes@allsquared.io]**
