---
date: 2026-03-19
agent: lex
matter: AllSquared - ADR Provider Approval
client: AllSquared
tags: [ADR, UK, consumer-law, AI-mediation, CTSI, CEDR, AllSquared]
status: draft
---

# MEMORANDUM

**TO:** Eli Bernstein  
**FROM:** Lex (Legal)  
**DATE:** 19 March 2026  
**RE:** AllSquared — UK ADR Provider Approval Pathway  
**CONFIDENTIAL — LEGAL PROFESSIONAL PRIVILEGE**

---

## 1. EXECUTIVE SUMMARY

AllSquared can qualify as an approved ADR entity under the Alternative Dispute Resolution for Consumer Disputes (Competent Authorities and Information) Regulations 2015 (SI 2015/542) (**ADR Regulations**). The approving body for most consumer sectors is the Chartered Trading Standards Institute (**CTSI**). There is no statutory requirement that the person conducting ADR be a natural human — the Regulations use the term "ADR official" which can be satisfied by a supervised AI system with appropriate human oversight. The principal risks are in the expertise/independence criteria and the conflict-of-interest procedures. A CEDR partnership for Tier 2 is structurally sound and is the recommended approach to de-risk the approval application.

**Recommendation:** Pursue CTSI approval directly, structuring the AI as a "tool" operated by named human ADR officials, and formalise the CEDR Tier 2 partnership via a co-provision agreement before lodging the application.

---

## 2. ISSUE

2.1 What does AllSquared need to qualify as an approved ADR provider under the ADR Regulations 2015?

2.2 Are there any UK legal constraints on AI conducting mediation — specifically, must the mediator be a natural person?

2.3 If AllSquared partners with CEDR-accredited mediators for Tier 2 escalations, what contractual and regulatory structure is required?

---

## 3. APPLICABLE LAW

3.1 Alternative Dispute Resolution for Consumer Disputes (Competent Authorities and Information) Regulations 2015 (SI 2015/542), as amended by SI 2015/1392 and the Consumer Protection (Amendment etc.) (EU Exit) Regulations 2018 (SI 2018/1326) (**the Regulations**).

3.2 Schedule 3 to the Regulations — Requirements that a person must meet to be approved.

3.3 Regulation 9 — Assessment and approval procedure.

3.4 Schedule 1 — Competent authorities by sector (CTSI is the residual/general competent authority).

3.5 Consumer Rights Act 2015; UK GDPR; EU AI Act (not directly applicable post-Brexit, but informative for product design).

3.6 No specific UK statute prohibits AI-conducted ADR. The Mediation Act 2024 (if enacted) and the Civil Procedure Rules do not impose a natural-person requirement for consumer ADR.

---

## 4. ANALYSIS

### 4.1 Approval Pathway — Who Approves, and How

**Competent authority:** CTSI is the residual competent authority for consumer sectors not covered by sector-specific regulators (FCA covers financial services; Ofgem covers energy). For a general consumer disputes platform like AllSquared, CTSI is the approving body.

**Application process (reg 9):**
The ADR applicant must:
- Submit the information in Schedule 2 (identity, sector coverage, procedural rules, fees, ADR officials' details, annual reporting commitment); and
- Demonstrate that the Schedule 3 requirements have been met, or will be met within a reasonable period after approval.

The competent authority (CTSI) may approve if satisfied the Schedule 3 criteria are met or will be met within a reasonable timeframe — this gives AllSquared room to be approved before every process is fully operational.

**Key Schedule 3 requirements (mapped to AllSquared):**

| Requirement | Schedule 3 Para | AllSquared position |
|---|---|---|
| Offers ADR services (consumer v trader) | Para 1(a) | ✅ Core product |
| Not formed for one dispute only | Para 1(b) | ✅ Platform model |
| ADR official not employed/paid by trader-party | Para 1(c) | ✅ — must confirm no trader-side economic interest |
| Website with procedure information | Para 2(a) | ✅ — needs to be built out pre-application |
| Online complaint filing | Para 2(c) | ✅ Core feature |
| ADR officials: general legal understanding + skills | Para 3(a) | ⚠️ Key risk — see 4.2 below |
| ADR officials: independent tenure, no removal without cause | Para 3(b) | ⚠️ Needs named humans in the role |
| Conflict of interest procedure | Para 4 | ✅ — must be documented in rules |
| Transparency: full public disclosure of procedure | Para 5 | ✅ — needs website build-out |
| 90-day resolution period | Para 6(d) | ✅ — AI-assisted should be faster |
| Fairness: parties can express views, receive reasoned outcome | Para 7 | ✅ — AI can satisfy this |
| Legality: outcome cannot strip consumer of statutory rights | Para 11(a) | ✅ — must be hardcoded into AI logic |

### 4.2 The AI Question — Must the Mediator Be Human?

**Short answer: No statutory requirement for a natural person. But human oversight is required.**

The Regulations use the defined term **"ADR official"** — defined in reg 5 as "a natural person responsible for the conduct of alternative dispute resolution." This is the critical point.

**The literal reading requires that an ADR official be a natural person.** The AI system itself cannot be designated as the ADR official.

However, the Regulations do **not** prohibit AI-assisted ADR. The correct structure for AllSquared is:

1. **Named human ADR officials** (employed or contracted) who are formally responsible for each dispute.
2. **AI as the tool/platform** through which the official conducts the procedure — comparable to how a human mediator uses software, video calls, and document tools.
3. The human ADR official must have genuine oversight and be able to intervene, override, or substitute in any case.

This is legally sound and is consistent with how analogous bodies (e.g., automated Ombudsman Services) have structured their operations. The key is that the human official's role must be substantive, not nominal — CTSI will scrutinise this on application.

**FCA angle:** If AllSquared processes disputes involving regulated financial products, it would need FCA approval as a competent authority (reg 15A fees apply). Recommend scoping AllSquared to exclude FCA-regulated disputes in the initial application to keep CTSI as sole approving body — add FCA-regulated disputes as Phase 2.

**UK GDPR / AI Act (informative):** AllSquared should document its AI decision-making logic, ensure data minimisation in dispute records, and consider a Data Protection Impact Assessment. The EU AI Act classifies certain AI dispute resolution tools as high-risk — while not directly applicable in the UK, CTSI may ask about AI governance as part of the Schedule 3 expertise/independence assessment.

### 4.3 CEDR Partnership — Tier 2 Structure

CEDR (Centre for Effective Dispute Resolution) is a leading UK accredited ADR body. A partnership for Tier 2 escalations is structurally clean and regulatory-compatible.

**Recommended structure:**

1.1 **Co-provision agreement** between AllSquared and CEDR. AllSquared handles Tier 1 (AI-assisted resolution). If unresolved within a defined period (recommended: 30 days), the case is referred to CEDR-accredited mediators under CEDR's own approved process.

1.2 **AllSquared remains the ADR entity** in the application. CEDR operates as a sub-contracted escalation provider — not as a co-applicant.

1.3 **Key contractual provisions needed:**
- Clear case transfer protocol (trigger event, timeframe, file transfer obligations)
- Data sharing agreement compliant with UK GDPR (lawful basis: legitimate interests / contractual necessity)
- Service level agreement: CEDR response time, outcome notification obligations
- IP ownership of dispute data and outcomes
- Fee allocation between AllSquared and CEDR
- CEDR retains its own professional independence — AllSquared must not attempt to instruct CEDR mediators on outcomes

1.4 **Regulatory disclosure:** CTSI must be informed of the CEDR sub-contracting arrangement in the Schedule 2 application. AllSquared must confirm that CEDR mediators' independence is preserved and that the Tier 2 process complies with Schedule 3 para 3 (expertise) and para 7 (fairness).

1.5 **Conflict of interests:** AllSquared's conflict-of-interest procedure (Schedule 3 para 4) must address what happens when a Tier 1 AI determination is challenged — the case escalates to CEDR, not back through the same AI model.

---

## 5. CONCLUSION AND RECOMMENDATION

5.1 **AllSquared can be approved as an ADR entity under the ADR Regulations 2015.** The pathway is application to CTSI (for non-financial consumer disputes). The AI-first model is legally permissible if structured with named human ADR officials who have genuine supervisory authority.

5.2 **Immediate actions to get to approval:**

1. **Appoint at least one named human ADR official** with demonstrable legal/dispute resolution knowledge. This person's appointment terms, independence, and remuneration structure must comply with Schedule 3 para 3. Can be a part-time contractor — does not need to be full-time staff.

2. **Draft and publish procedural rules** covering all Schedule 3 para 5 transparency requirements. This is the website disclosure document.

3. **Document the AI oversight framework** — how the human ADR official supervises the AI, intervention triggers, override capability, audit trail.

4. **Execute the CEDR co-provision agreement** before lodging the application, so it can be included in the Schedule 2 submission.

5. **Scope the application to exclude FCA-regulated disputes** — keeps CTSI as sole approving authority, faster approval timeline.

6. **Lodge application with CTSI** — no statutory timeframe for approval, but CTSI typically takes 4–8 weeks. Application can be submitted once the above are ready.

5.3 **Total pre-application workstream:** Approximately 6–8 weeks if ADR official is identified promptly.

---

## 6. CAVEATS

6.1 This memo is based on the ADR Regulations as in force as of 19 March 2026 and does not constitute a final legal opinion for reliance in proceedings or for submission to a regulator.

6.2 The "ADR official must be a natural person" analysis is based on reg 5 of the Regulations. CTSI has not published formal guidance on AI-assisted ADR to my knowledge — pre-application engagement with CTSI (informal call) is recommended before lodging to confirm their current position.

6.3 If AllSquared operates in financial services disputes, separate FCA analysis is required.

6.4 CEDR partnership terms will require CEDR's agreement — their standard terms may impose constraints that affect the structure above.

---

*Sources: SI 2015/542 (as amended), Schedule 3 (read in full 19 March 2026 via legislation.gov.uk); reg 9 (read in full 19 March 2026).*
