# AI Development Services Agreement

**This Agreement** is between:

**Client:** [Name] ("Client")
**Developer:** [Name] ("Developer")

**Effective Date:** [Date]

## 1. SCOPE OF SERVICES

Developer shall develop, train, and deliver the AI System described in the Statement of Work (Exhibit A), including:
- (a) Data preparation and preprocessing
- (b) Model selection, architecture design, and development
- (c) Training, fine-tuning, and optimization
- (d) Testing, validation, and evaluation
- (e) Documentation and knowledge transfer
- (f) Deployment support and integration
- (g) Post-deployment monitoring and maintenance (if applicable)

## 2. DELIVERABLES

### 2.1 Core Deliverables
- Trained AI Model(s) as specified in the SOW
- Source code and configuration files
- Model documentation (architecture, training methodology, hyperparameters)
- Performance evaluation reports (accuracy, precision, recall, F1, etc.)
- Bias and fairness assessment report
- Deployment guide and API documentation
- Training data documentation and provenance records

### 2.2 Acceptance Criteria
The AI System shall meet the performance criteria specified in Exhibit A. Client shall have [30] days to test and accept each deliverable.

## 3. DATA

### 3.1 Client Data
Client shall provide training data as described in the SOW. Client represents that it has the right to provide such data and that the data was collected in compliance with applicable laws.

### 3.2 Data Handling
Developer shall:
- (a) Use Client data solely for the purpose of this Agreement;
- (b) Implement appropriate security measures;
- (c) Not use Client data to train models for other clients;
- (d) Return or delete Client data upon project completion;
- (e) Comply with the Data Processing Addendum (Exhibit C).

### 3.3 Third-Party Data
If Developer uses third-party training data, Developer shall: (a) disclose all such data sources; (b) ensure proper licensing; (c) document all data sources in the model documentation.

## 4. INTELLECTUAL PROPERTY

### 4.1 Client Owns Custom Model (Option A)
Client shall own all rights in the custom AI Model developed under this Agreement, including trained weights, architecture, and documentation. Developer retains rights in pre-existing tools, libraries, and frameworks.

### 4.2 Developer Retains Model, Client Gets License (Option B)
Developer retains ownership of the AI Model. Developer grants Client a perpetual, non-exclusive, worldwide license to use, modify, and deploy the AI Model for Client's internal business purposes.

### 4.3 Pre-Existing IP
Each party retains ownership of its pre-existing intellectual property. Developer grants Client a license to use Developer's pre-existing IP solely as necessary to use the deliverables.

### 4.4 Open Source
Developer shall disclose all open-source components used and ensure compatibility with the IP ownership structure above.

## 5. AI-SPECIFIC WARRANTIES

Developer warrants that:
- (a) The AI Model shall meet the performance criteria in the SOW upon delivery;
- (b) The AI Model does not, to Developer's knowledge, infringe third-party IP rights;
- (c) Developer has disclosed all known biases, limitations, and failure modes;
- (d) The AI Model was developed using ethical AI practices;
- (e) All third-party training data was properly licensed;
- (f) The AI Model complies with applicable AI regulations.

## 6. RESPONSIBLE AI

### 6.1 Bias and Fairness
Developer shall: (a) test for bias across protected categories; (b) document bias testing methodology and results; (c) implement mitigation measures where bias is detected.

### 6.2 Explainability
Developer shall provide: (a) documentation of how the AI Model makes decisions; (b) tools or methods for explaining individual predictions (where technically feasible); (c) model cards describing intended use, limitations, and ethical considerations.

### 6.3 Safety
Developer shall: (a) implement appropriate guardrails and safety filters; (b) test for adversarial inputs and edge cases; (c) document known failure modes and mitigation strategies.

## 7. FEES AND PAYMENT

7.1 **Fixed Fee:** $[Amount] payable per the milestone schedule in Exhibit B.
7.2 **Time and Materials:** [Alternatively: $X/hour with estimated total of $Y]
7.3 **Compute Costs:** [Client / Developer] shall be responsible for cloud computing and GPU costs incurred during training.

## 8. TERM AND TERMINATION

8.1 This Agreement shall continue until completion of the Services or termination.
8.2 Either party may terminate for material breach upon [30] days' notice.
8.3 Client may terminate for convenience upon [15] days' notice and payment of fees for work completed.
8.4 Upon termination, Developer shall deliver all work product completed to date.

## 9. LIMITATION OF LIABILITY

NEITHER PARTY'S TOTAL LIABILITY SHALL EXCEED THE FEES PAID UNDER THIS AGREEMENT.

---

## EXHIBIT A - STATEMENT OF WORK

| Item | Specification |
|------|-------------|
| Project Name | [Name] |
| AI System Type | [Classification / NLP / Computer Vision / Recommendation / etc.] |
| Model Architecture | [Transformer / CNN / etc.] |
| Training Data | [Description, volume, format] |
| Performance Criteria | [Accuracy ≥X%, Latency ≤Yms, etc.] |
| Deployment Target | [Cloud / Edge / On-premises] |
| Timeline | [Milestones and dates] |

## EXHIBIT B - MILESTONE PAYMENT SCHEDULE

| Milestone | Deliverable | Amount | Due Date |
|-----------|-------------|--------|----------|
| 1 | Project kickoff | $X | [Date] |
| 2 | Data preparation complete | $X | [Date] |
| 3 | Model v1 delivery | $X | [Date] |
| 4 | Final model delivery + acceptance | $X | [Date] |
| 5 | Post-deployment support complete | $X | [Date] |

## EXHIBIT C - DATA PROCESSING ADDENDUM

[Reference DPA template]
