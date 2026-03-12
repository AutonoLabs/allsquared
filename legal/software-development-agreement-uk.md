# SOFTWARE DEVELOPMENT AGREEMENT (UK)

**AllSquared — Service Marketplace Platform**

---

**THIS SOFTWARE DEVELOPMENT AGREEMENT** ("Agreement") is made on **[START_DATE]**

**BETWEEN:**

1. **[CLIENT_NAME]**, a company incorporated in [CLIENT_JURISDICTION] with company number [CLIENT_COMPANY_NUMBER], whose registered office is at [CLIENT_ADDRESS] (the "**Client**"); and

2. **[DEVELOPER_NAME]**, a company/individual [incorporated in / resident in] [DEVELOPER_JURISDICTION] [with company number [DEVELOPER_COMPANY_NUMBER]], whose [registered office / address] is at [DEVELOPER_ADDRESS] (the "**Developer**").

Each a "**Party**" and together the "**Parties**".

---

## RECITALS

A. The Client wishes to engage the Developer to design, develop, test, and deliver certain software and related deliverables as described in this Agreement.

B. The Developer has the necessary skills, experience, and resources to perform such development services.

C. This Agreement has been facilitated through AllSquared (allsquared.io), a digital service marketplace platform operated by [PLATFORM_OPERATOR_NAME] (the "**Platform**").

---

## 1. DEFINITIONS AND INTERPRETATION

### 1.1 Definitions

**"Acceptance Criteria"** means the functional, performance, and quality criteria against which the Software and Deliverables will be tested, as set out in the Specification or any applicable SOW.

**"Acceptance Testing"** means the testing of the Software or Deliverables against the Acceptance Criteria in accordance with clause 6.

**"Applicable Law"** means all applicable laws, statutes, regulations, and codes of practice in England and Wales and the United Kingdom.

**"Background IPR"** means Intellectual Property Rights owned by or licensed to a Party prior to the Effective Date, or developed independently of this Agreement.

**"Bug"** means a defect, error, or malfunction in the Software that causes it to fail to conform to the Specification or Acceptance Criteria. Bugs are classified as:
- **Critical Bug**: renders the Software wholly or substantially unusable;
- **Major Bug**: materially impairs functionality but a workaround exists;
- **Minor Bug**: a cosmetic or low-impact defect that does not materially affect functionality.

**"Change Request"** means a written request for a change to the Specification, Deliverables, timeline, or Fees in accordance with clause 5.

**"Code"** means all source code, object code, scripts, configuration files, and build files comprised in or necessary for the operation of the Software.

**"Contract Value"** means **[CONTRACT_VALUE]** (exclusive of VAT).

**"Data Protection Legislation"** means the UK GDPR, the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations 2003.

**"Deliverables"** means the Software, documentation, and all other materials to be delivered by the Developer under this Agreement or any SOW.

**"Development Environment"** means the technical environment (including hardware, software, tools, and platforms) used by the Developer to develop and test the Software.

**"Documentation"** means all technical documentation, user manuals, API documentation, architectural diagrams, and other written materials describing the Software.

**"Effective Date"** means **[START_DATE]**.

**"Escrow"** means the escrow service provided by the Platform or a third-party escrow agent, if applicable.

**"Fees"** means the amounts payable to the Developer for the Services as set out in clause 8 and/or the applicable SOW.

**"Force Majeure Event"** has the meaning given in clause 16.

**"Foreground IPR"** means all Intellectual Property Rights in the Deliverables created by the Developer in the performance of this Agreement.

**"Intellectual Property Rights"** means patents, copyright, database rights, design rights, trade marks, trade secrets, rights in know-how, and all other intellectual property rights, whether registered or unregistered, including applications for any of the foregoing.

**"Milestone"** means a key stage of the project as set out in the project plan or SOW, completion of which triggers a payment and/or acceptance event.

**"Open Source Software"** means software distributed under a licence approved by the Open Source Initiative (www.opensource.org) or any substantially similar licence.

**"Personal Data"** has the meaning given in the Data Protection Legislation.

**"Project Plan"** means the detailed plan for the development, testing, and delivery of the Software, including Milestones, timelines, and resource allocation, as set out in Schedule 1 or the applicable SOW.

**"Services"** means the software development services, including design, coding, testing, integration, deployment, and support services, to be provided by the Developer under this Agreement.

**"Software"** means the software application(s) and system(s) to be developed by the Developer as described in the Specification.

**"Source Code"** means the human-readable version of the Code, including all comments, build scripts, and configuration files necessary to compile, build, and maintain the Software.

**"Specification"** means the technical and functional specification for the Software as set out in Schedule 2 or the applicable SOW.

**"Sprint"** means a development iteration, typically of **[SPRINT_DURATION]** weeks' duration, during which specific features or functionality are developed and delivered.

**"Testing Environment"** means the environment in which Acceptance Testing is conducted, as specified in the Specification or SOW.

**"Warranty Period"** means the period of **[WARRANTY_PERIOD]** months following acceptance of the final Deliverable (or such other period as specified in the SOW).

### 1.2 Interpretation

As per standard interpretation provisions (see clause 1.2 of the Master Services Agreement template).

---

## 2. ENGAGEMENT AND SCOPE

### 2.1 Engagement

The Client engages the Developer, and the Developer agrees, to design, develop, test, and deliver the Software and provide the Services in accordance with this Agreement.

### 2.2 Scope

The scope of the Software and Services is as described in the Specification. Any work outside the Specification shall be subject to the change control procedure in clause 5.

### 2.3 Project Plan

The Developer shall perform the Services in accordance with the Project Plan. The Developer shall notify the Client promptly if it becomes aware of any circumstances that may delay the Project Plan.

### 2.4 Agile Development

Where the Parties agree to follow an agile development methodology:

(a) the Services shall be performed in Sprints;

(b) at the start of each Sprint, the Parties shall agree a Sprint backlog setting out the user stories, features, and tasks to be completed during that Sprint;

(c) the Developer shall conduct Sprint reviews and retrospectives at the end of each Sprint, providing the Client with a demonstration of completed work;

(d) the Client shall provide timely feedback and decisions on Sprint deliverables; and

(e) any changes to requirements during a Sprint shall be managed through the change control procedure in clause 5, unless the Parties agree to incorporate minor changes within the existing Sprint scope.

---

## 3. DEVELOPER OBLIGATIONS

### 3.1 Standard of Care

The Developer shall:

(a) perform the Services with reasonable care, skill, and diligence;

(b) use suitably qualified, skilled, and experienced personnel;

(c) follow Good Industry Practice and recognised software development standards;

(d) comply with all Applicable Law;

(e) use the development tools, languages, and frameworks specified in the Specification or as otherwise agreed with the Client; and

(f) maintain and use appropriate development, testing, and version control environments.

### 3.2 Code Quality

The Developer shall ensure that the Code:

(a) is well-structured, readable, and adequately commented;

(b) follows the coding standards and conventions specified in the Specification or as otherwise agreed;

(c) is developed using version control (Git or equivalent);

(d) includes appropriate unit tests with a minimum code coverage of **[MINIMUM_CODE_COVERAGE]**%;

(e) passes static code analysis without critical or high-severity findings; and

(f) does not contain any malware, viruses, backdoors, time-bombs, or other malicious code.

### 3.3 Open Source Compliance

(a) The Developer shall not incorporate any Open Source Software into the Software without the Client's prior written consent.

(b) The Developer shall maintain a register of all Open Source Software used in or bundled with the Software, including the applicable licence for each component.

(c) The Developer shall ensure that no Open Source Software is used in a manner that would impose obligations on the Client to disclose or distribute the Source Code of the Software (e.g. copyleft licences such as GPL, unless expressly agreed).

### 3.4 Security

The Developer shall:

(a) follow OWASP Top 10 guidelines and secure coding practices;

(b) implement appropriate authentication, authorisation, and encryption mechanisms;

(c) conduct security testing (including vulnerability scanning and, where agreed, penetration testing) prior to delivery; and

(d) promptly notify the Client of any security vulnerability discovered in the Software during the Term.

### 3.5 Key Personnel

(a) The Developer shall assign the key personnel identified in the Project Plan to the project.

(b) The Developer shall not remove or replace key personnel without the Client's prior written consent, such consent not to be unreasonably withheld.

---

## 4. CLIENT OBLIGATIONS

### 4.1 Cooperation

The Client shall:

(a) provide timely access to information, systems, and personnel as reasonably required;

(b) review and provide feedback on Deliverables within **[CLIENT_REVIEW_PERIOD]** Business Days of receipt;

(c) make decisions and provide approvals within **[CLIENT_DECISION_PERIOD]** Business Days of a request;

(d) designate a project manager to serve as the primary point of contact; and

(e) provide a suitable Testing Environment (unless otherwise agreed).

### 4.2 Delays

If the Client fails to fulfil its obligations under clause 4.1 and such failure causes a delay, the Developer shall be entitled to a reasonable extension of the affected Milestones and timelines.

---

## 5. CHANGE CONTROL

### 5.1 Change Requests

Either Party may propose changes to the Specification, Deliverables, Project Plan, or Fees by submitting a written Change Request.

### 5.2 Impact Assessment

Within **[CHANGE_ASSESSMENT_PERIOD]** Business Days of receiving a Change Request, the Developer shall provide the Client with a written impact assessment, including:

(a) the effect on the Specification and Deliverables;

(b) the effect on the Project Plan, Milestones, and timelines;

(c) the estimated additional Fees (if any); and

(d) any risks or dependencies.

### 5.3 Approval

No change shall be implemented unless a Change Request has been approved in writing by both Parties. Pending approval, the Developer shall continue to perform the Services in accordance with the existing Specification.

---

## 6. TESTING AND ACCEPTANCE

### 6.1 Developer Testing

Prior to submitting any Deliverable for Acceptance Testing, the Developer shall:

(a) conduct thorough internal testing, including unit testing, integration testing, and system testing;

(b) fix all Critical and Major Bugs identified during internal testing; and

(c) provide the Client with test reports documenting the testing performed and results obtained.

### 6.2 Acceptance Testing

(a) Upon delivery of a Deliverable, the Client shall have **[ACCEPTANCE_PERIOD]** Business Days to conduct Acceptance Testing against the Acceptance Criteria (the "**Acceptance Period**").

(b) If the Deliverable passes Acceptance Testing, the Client shall issue written acceptance.

(c) If the Deliverable fails Acceptance Testing, the Client shall provide the Developer with a written deficiency report specifying each Bug or non-conformance. The Developer shall rectify such deficiencies within **[RECTIFICATION_PERIOD]** Business Days at its own cost and resubmit the Deliverable.

### 6.3 Repeated Failure

If, after **[MAX_RESUBMISSIONS]** rounds of Acceptance Testing, a Deliverable still fails to pass:

(a) the Client may accept the Deliverable with an equitable reduction in the applicable Fees;

(b) the Client may require the Developer to continue to rectify the deficiencies at no additional cost; or

(c) the Client may terminate this Agreement (or the applicable SOW) for material breach in accordance with clause 14.

### 6.4 Deemed Acceptance

If the Client fails to conduct Acceptance Testing or notify the Developer of deficiencies within the Acceptance Period, the Deliverable shall be deemed accepted on the expiry of the Acceptance Period.

### 6.5 Beta/UAT

Where the Parties agree to a User Acceptance Testing ("**UAT**") phase:

(a) the Developer shall deploy the Software to a UAT environment;

(b) the Client shall conduct testing with representative end-users for a period of **[UAT_PERIOD]** Business Days;

(c) the Client shall provide a consolidated list of issues to the Developer; and

(d) the Developer shall address all Critical and Major issues prior to production deployment.

---

## 7. DEPLOYMENT AND GO-LIVE

### 7.1 Deployment

(a) The Developer shall deploy the Software to the agreed production environment in accordance with the Project Plan.

(b) The Developer shall provide a deployment checklist and rollback plan prior to each deployment.

(c) The Client shall approve each production deployment in writing before it is executed.

### 7.2 Go-Live Support

The Developer shall provide on-call support for **[GO_LIVE_SUPPORT_PERIOD]** Business Days following each production deployment, during which:

(a) the Developer shall respond to Critical Bugs within **[CRITICAL_RESPONSE_TIME]** hours;

(b) the Developer shall respond to Major Bugs within **[MAJOR_RESPONSE_TIME]** hours; and

(c) the Developer shall be available during **[SUPPORT_HOURS]** (UK time).

---

## 8. FEES AND PAYMENT

### 8.1 Fees

The Client shall pay the Developer the Fees as set out in this Agreement or the applicable SOW. Fees may be structured as:

(a) **Fixed price**: a total fixed amount for the entire project or each Milestone;

(b) **Time and materials**: based on an agreed day rate of **[DAY_RATE]** per person per day, plus agreed expenses; or

(c) **Hybrid**: a combination of fixed-price Milestones and time-and-materials elements.

### 8.2 Milestone Payments

Where Fees are payable on a Milestone basis:

(a) **[DEPOSIT_PERCENTAGE]**% of the Contract Value shall be payable upon execution of this Agreement as a deposit (which may be held in Escrow);

(b) Milestone payments shall be triggered by the Client's acceptance (or deemed acceptance) of the relevant Deliverable; and

(c) the final **[FINAL_RETENTION]**% shall be payable upon final acceptance of the complete Software.

### 8.3 Invoicing and Payment

(a) The Developer shall submit invoices in accordance with the payment schedule in the SOW.

(b) Invoices are payable within **[PAYMENT_TERMS]** days of receipt.

(c) All Fees are exclusive of VAT.

(d) Late payments shall accrue interest in accordance with the Late Payment of Commercial Debts (Interest) Act 1998.

### 8.4 Escrow Payments

Where the Parties elect to use the Platform's escrow service:

(a) the Client shall fund the escrow account in accordance with the Milestone payment schedule;

(b) funds shall be released to the Developer upon the Client's acceptance of the relevant Deliverable; and

(c) the escrow arrangements are governed by the Platform's Escrow Annexure.

### 8.5 Expenses

The Developer shall not incur expenses chargeable to the Client without prior written approval. Approved expenses shall be reimbursed at cost upon submission of receipts.

---

## 9. INTELLECTUAL PROPERTY

### 9.1 Background IPR

Each Party retains ownership of its Background IPR. Nothing in this Agreement transfers any Background IPR.

### 9.2 Assignment of Foreground IPR

(a) The Developer hereby assigns to the Client, with full title guarantee, all Foreground IPR, effective upon creation (or, if not assignable upon creation, upon the earliest date permitted by law).

(b) This assignment is conditional upon payment of all Fees properly due in respect of the relevant Deliverables.

(c) The Developer shall execute all documents and do all things necessary to perfect the assignment.

(d) The Developer irrevocably and unconditionally waives all moral rights in the Deliverables under Chapter IV of the Copyright, Designs and Patents Act 1988 (and any analogous rights in other jurisdictions).

### 9.3 Licence to Background IPR

Where any Deliverable incorporates the Developer's Background IPR, the Developer grants the Client a non-exclusive, perpetual, irrevocable, royalty-free, worldwide licence (with the right to sublicence) to use, copy, modify, and distribute such Background IPR to the extent necessary for the Client to use, maintain, and develop the Software.

### 9.4 Source Code Delivery

(a) The Developer shall deliver the Source Code to the Client upon acceptance of the final Deliverable (and, if requested, at each Milestone).

(b) The Source Code shall be delivered together with all Documentation necessary to build, compile, deploy, and maintain the Software.

(c) The Source Code shall be hosted in a version control repository accessible to the Client throughout the Term.

### 9.5 Third-Party and Open Source Components

(a) The Developer shall provide the Client with a complete software bill of materials ("**SBOM**") listing all third-party and Open Source Software components.

(b) The Developer warrants that all third-party software is properly licensed and that no component will impose copyleft obligations on the Client without the Client's prior written consent.

### 9.6 Non-Infringement

The Developer warrants that the Software and Deliverables will not infringe the Intellectual Property Rights of any third party.

---

## 10. WARRANTY

### 10.1 Warranty Period

During the Warranty Period, the Developer warrants that:

(a) the Software will conform to the Specification and Acceptance Criteria;

(b) the Software will be free from Critical and Major Bugs;

(c) the Software will function in the specified operating environments; and

(d) the Documentation will accurately describe the Software.

### 10.2 Bug Fixes

During the Warranty Period, the Developer shall:

(a) fix Critical Bugs within **[CRITICAL_FIX_TIME]** hours of notification;

(b) fix Major Bugs within **[MAJOR_FIX_TIME]** Business Days of notification;

(c) fix Minor Bugs within **[MINOR_FIX_TIME]** Business Days of notification; and

(d) provide bug fixes at no additional charge.

### 10.3 Exclusions

The warranty shall not apply to defects caused by:

(a) modifications made by the Client or third parties without the Developer's consent;

(b) use of the Software outside its specified operating environment;

(c) integration with software or hardware not specified in the Specification; or

(d) the Client's failure to implement updates or patches provided by the Developer.

---

## 11. SUPPORT AND MAINTENANCE

### 11.1 Post-Warranty Support

Following the Warranty Period, the Developer may provide ongoing support and maintenance services under a separate support agreement or SOW, including:

(a) bug fixes and patches;

(b) security updates;

(c) minor enhancements;

(d) helpdesk and technical support; and

(e) performance monitoring and optimisation.

### 11.2 Support Terms

The terms, scope, and fees for post-warranty support shall be as set out in a separate Support and Maintenance Agreement or SOW.

---

## 12. CONFIDENTIALITY

As per clause 9 of the Master Services Agreement template (mutatis mutandis). The confidentiality obligations survive termination for **[CONFIDENTIALITY_PERIOD]** years.

---

## 13. DATA PROTECTION

### 13.1 Compliance

Each Party shall comply with the Data Protection Legislation.

### 13.2 Processing

Where the Developer processes Personal Data in the course of the Services, the Parties shall enter into a data processing agreement compliant with Article 28 of the UK GDPR.

### 13.3 Security Measures

The Developer shall implement appropriate technical and organisational measures to protect Personal Data, including encryption, access controls, and regular security assessments.

---

## 14. TERMINATION

### 14.1 Termination for Convenience

The Client may terminate this Agreement at any time by giving **[TERMINATION_NOTICE_PERIOD]** days' written notice, subject to payment for all Services satisfactorily performed and accepted up to the termination date.

### 14.2 Termination for Cause

Either Party may terminate this Agreement immediately upon written notice if the other Party:

(a) commits a material breach and fails to remedy it within **[CURE_PERIOD]** days of notice;

(b) becomes insolvent or enters into administration; or

(c) is unable to perform its obligations for more than **[FORCE_MAJEURE_PERIOD]** consecutive days due to a Force Majeure Event.

### 14.3 Consequences of Termination

On termination:

(a) the Developer shall deliver all work in progress, Source Code, Documentation, and Client materials;

(b) the Client shall pay for all accepted work up to the termination date;

(c) Escrow funds shall be dealt with in accordance with the Escrow Annexure; and

(d) clauses 9, 10 (for the remainder of the Warranty Period), 12, 13, and 15 shall survive termination.

---

## 15. LIMITATION OF LIABILITY

### 15.1 Cap

Subject to clause 15.3, the total aggregate liability of either Party shall not exceed **[LIABILITY_CAP_MULTIPLIER]** times the Contract Value (or total Fees paid/payable in the preceding **[LIABILITY_LOOKBACK_PERIOD]** months, whichever is greater).

### 15.2 Exclusions

Subject to clause 15.3, neither Party shall be liable for loss of profits, revenue, data, goodwill, or any indirect or consequential loss.

### 15.3 Unlimited Liability

Nothing limits liability for: death or personal injury from negligence; fraud; breaches of clause 9.2 (IPR assignment); or any liability that cannot be excluded by law.

---

## 16. FORCE MAJEURE

As per clause 16 of the Master Services Agreement template (mutatis mutandis).

---

## 17. DISPUTE RESOLUTION

### 17.1 Escalation

Disputes shall first be referred to the Parties' project managers, then to senior management representatives.

### 17.2 Mediation

If not resolved within **[NEGOTIATION_PERIOD]** Business Days, the Parties shall attempt mediation under the CEDR Model Mediation Procedure.

### 17.3 Litigation

If mediation fails, the courts of **England and Wales** shall have exclusive jurisdiction.

---

## 18. GENERAL PROVISIONS

### 18.1 Entire Agreement

This Agreement constitutes the entire agreement between the Parties in respect of its subject matter.

### 18.2 Variation

No variation is effective unless in writing and signed by both Parties.

### 18.3 Assignment

The Developer may not assign this Agreement without the Client's consent. The Client may assign to an affiliate or successor.

### 18.4 Subcontracting

The Developer may not subcontract any part of the Services without the Client's prior written consent. The Developer remains liable for the acts and omissions of any approved subcontractor.

### 18.5 No Partnership or Agency

Nothing in this Agreement creates a partnership, joint venture, or agency relationship.

### 18.6 Third-Party Rights

No third party has rights under this Agreement pursuant to the Contracts (Rights of Third Parties) Act 1999.

### 18.7 Severability

Invalid provisions shall be severed without affecting the remainder of this Agreement.

### 18.8 Notices

As per clause 17.8 of the Master Services Agreement template.

### 18.9 Governing Law

This Agreement is governed by the laws of **England and Wales**.

### 18.10 Counterparts

This Agreement may be executed in counterparts. Electronic signatures are valid and binding.

---

## SCHEDULES

### Schedule 1 — Project Plan

| Field | Detail |
|-------|--------|
| Project Name | [PROJECT_NAME] |
| Development Methodology | [METHODOLOGY] (Agile/Waterfall/Hybrid) |
| Sprint Duration | [SPRINT_DURATION] weeks |
| Total Sprints/Phases | [TOTAL_SPRINTS] |
| Key Milestones | [MILESTONES_AND_DATES] |
| Key Personnel | [KEY_PERSONNEL] |
| Technology Stack | [TECHNOLOGY_STACK] |
| Hosting/Infrastructure | [HOSTING_DETAILS] |

### Schedule 2 — Specification

*[Attach or reference the detailed technical and functional specification]*

### Schedule 3 — Acceptance Criteria

*[Attach detailed acceptance criteria for each Milestone/Deliverable]*

---

## EXECUTION

**Signed** by **[CLIENT_SIGNATORY_NAME]** for and on behalf of **[CLIENT_NAME]**:

Signature: ________________________

Name: [CLIENT_SIGNATORY_NAME]

Title: [CLIENT_SIGNATORY_TITLE]

Date: [SIGNATURE_DATE]

---

**Signed** by **[DEVELOPER_SIGNATORY_NAME]** for and on behalf of **[DEVELOPER_NAME]**:

Signature: ________________________

Name: [DEVELOPER_SIGNATORY_NAME]

Title: [DEVELOPER_SIGNATORY_TITLE]

Date: [SIGNATURE_DATE]

---

*This document is a template prepared for AllSquared (allsquared.io). It is not legal advice. Parties should seek independent legal counsel before execution. Governed by the laws of England and Wales.*
