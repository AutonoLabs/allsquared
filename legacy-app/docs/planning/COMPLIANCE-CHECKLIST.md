# AllSquared Compliance Checklist

**Version:** 1.0  
**Date:** January 2025  
**Jurisdiction:** United Kingdom  
**Status:** Pre-Launch Review

---

## 1. GDPR Requirements

### 1.1 Legal Basis for Processing

| Data Type | Legal Basis | Justification |
|-----------|-------------|---------------|
| Account data (name, email) | Contract | Necessary to provide service |
| Payment data | Contract + Legal Obligation | Necessary for transactions, tax records |
| Contract content | Contract | Core service delivery |
| Usage analytics | Legitimate Interest | Service improvement (with opt-out) |
| Marketing communications | Consent | Only with explicit opt-in |
| Support conversations | Contract | Service delivery |

### 1.2 Data Subject Rights Checklist

- [ ] **Right to Access** — Users can download all their data
  - Implementation: "Download My Data" in settings
  - Format: JSON or CSV export
  - Timeline: Within 30 days

- [ ] **Right to Rectification** — Users can correct inaccurate data
  - Implementation: Editable profile fields
  - Process: Self-service or support request

- [ ] **Right to Erasure** ("Right to be Forgotten")
  - Implementation: "Delete Account" function
  - Caveats: Legal retention requirements for financial records
  - Process: Anonymize contracts, delete personal data

- [ ] **Right to Portability** — Export data in machine-readable format
  - Implementation: API or bulk export
  - Format: JSON

- [ ] **Right to Object** — Opt out of processing
  - Implementation: Marketing preferences, analytics opt-out

- [ ] **Right to Restrict Processing**
  - Implementation: Account suspension option

### 1.3 Privacy by Design Checklist

- [ ] Data minimization — Only collect necessary data
- [ ] Purpose limitation — Use data only for stated purposes
- [ ] Storage limitation — Define retention periods
- [ ] Encryption at rest — Database encryption enabled
- [ ] Encryption in transit — HTTPS enforced everywhere
- [ ] Access controls — Role-based permissions
- [ ] Audit logging — Track data access
- [ ] Pseudonymization — Where possible

### 1.4 Data Processing Agreements (DPAs)

Required with all sub-processors:

| Sub-processor | Service | DPA Status |
|---------------|---------|------------|
| Vercel | Hosting | ✅ Standard DPA |
| Stripe | Payments | ✅ Standard DPA |
| Firebase/Google | Storage | ✅ Standard DPA |
| OpenAI | AI processing | ⚠️ Review required |
| SendGrid/Resend | Email | ✅ Standard DPA |
| Clerk | Authentication | ✅ Standard DPA |
| Sentry | Error tracking | ✅ Standard DPA |
| Escrow provider | Fund holding | 📋 To be signed |

### 1.5 International Data Transfers

- **EU → UK:** Adequacy decision in place ✅
- **UK → US:** Standard Contractual Clauses required for:
  - OpenAI (US-based)
  - Vercel (US-based)
  - Stripe (US-based with EU entities)

### 1.6 Data Breach Procedures

- [ ] Breach detection monitoring
- [ ] 72-hour notification process to ICO
- [ ] User notification templates ready
- [ ] Breach register established
- [ ] Incident response plan documented

---

## 2. Terms of Service Outline

### 2.1 Structure

1. **Introduction & Acceptance**
   - Agreement to terms by using service
   - Eligibility (18+, UK-based for escrow)
   - Account registration requirements

2. **Service Description**
   - Contract generation platform
   - Escrow services (via third-party provider)
   - Milestone management
   - Limitations of service

3. **User Obligations**
   - Accurate information
   - Acceptable use
   - Prohibited activities
   - Compliance with laws

4. **Intellectual Property**
   - AllSquared owns platform IP
   - Users own their contract content
   - Limited license to use user content for service

5. **Payment Terms**
   - Subscription fees and billing
   - Escrow fees and processing
   - Refund policy
   - Fee changes notice

6. **Escrow Terms**
   - FCA-regulated provider details
   - Fund holding terms
   - Release conditions
   - Dispute procedures

7. **Disclaimers**
   - Not a law firm
   - AI limitations
   - No guarantee of outcomes
   - Third-party services

8. **Limitation of Liability**
   - Cap on damages
   - Exclusions (indirect, consequential)
   - Consumer rights preservation

9. **Termination**
   - User cancellation rights
   - AllSquared termination rights
   - Effect of termination
   - Data retention post-termination

10. **Dispute Resolution**
    - Governing law (England & Wales)
    - Jurisdiction
    - Informal resolution first
    - ODR platform link for consumers

11. **Changes to Terms**
    - Notice of changes (30 days)
    - Continued use = acceptance

12. **Contact Information**

### 2.2 Key Clauses to Draft

- [ ] Arbitration clause (optional, consider consumer rights)
- [ ] Force majeure
- [ ] Severability
- [ ] Entire agreement
- [ ] Assignment
- [ ] Waiver

---

## 3. Privacy Policy Requirements

### 3.1 Structure

1. **Introduction**
   - Who we are (company details)
   - Scope of policy
   - Last updated date

2. **Data We Collect**
   - Information you provide (account, contracts)
   - Automatic collection (usage, cookies)
   - Third-party sources (none currently)

3. **How We Use Data**
   - Service delivery
   - Communication
   - Analytics and improvement
   - Legal compliance

4. **Legal Basis for Processing**
   - Table by data type (as above)

5. **Data Sharing**
   - Sub-processors list
   - Legal requirements
   - Business transfers
   - With your consent

6. **International Transfers**
   - Safeguards used

7. **Data Retention**
   - Active account: Duration of relationship
   - Financial records: 7 years (legal requirement)
   - Inactive accounts: 2 years then deletion
   - Deleted accounts: 30 days then permanent

8. **Your Rights**
   - Full list per GDPR
   - How to exercise
   - Complaints to ICO

9. **Cookies**
   - Essential cookies
   - Analytics cookies
   - Preference management

10. **Security**
    - Measures we take
    - Your responsibilities

11. **Children**
    - Not for under-18s

12. **Changes to Policy**
    - Notification process

13. **Contact**
    - DPO / Privacy contact
    - Address
    - Email

### 3.2 Cookie Policy Addendum

- [ ] Cookie consent banner implementation
- [ ] Cookie preferences center
- [ ] Essential vs. non-essential categorization
- [ ] Cookie register documented

---

## 4. UK Employment Law Considerations

### 4.1 IR35 Awareness

**AllSquared's Position:**
- We provide contract templates and escrow—we do NOT determine employment status
- Users are responsible for their own IR35 assessments
- We are NOT providing legal advice on employment status

**Disclaimers Required:**
> "AllSquared contracts are designed for genuine freelance and contractor relationships. Determining whether a working arrangement falls inside or outside IR35 requires professional assessment of the specific circumstances. AllSquared does not provide employment status advice."

**Resources to Link:**
- HMRC CEST tool: https://www.gov.uk/guidance/check-employment-status-for-tax
- IPSE guidance
- Professional advice recommendation

### 4.2 Contract Clauses for IR35 Compliance

Standard clauses to include in freelancer contracts:

- [ ] **Substitution clause** — Right to send a substitute
- [ ] **Control clause** — Limited client control over how work is done
- [ ] **Mutuality of obligation** — No ongoing obligation
- [ ] **Right to work for others** — Not exclusive
- [ ] **Own equipment** — Contractor provides tools

**Note:** These clauses help but don't guarantee IR35 compliance—reality of working arrangement matters.

### 4.3 Worker Classification Warnings

For high-risk scenarios, flag:
- Long-term single-client relationships
- Client-provided equipment
- Set working hours
- Integration into client team
- Prohibition on other clients

**Recommendation:** Prompt users in high-risk scenarios to seek professional IR35 review.

### 4.4 AWR (Agency Workers Regulations)

**Not applicable** to AllSquared because:
- We don't supply workers to clients
- We facilitate direct relationships
- Not an employment business or agency

Keep this position documented.

---

## 5. Financial Regulation

### 5.1 Escrow / Payment Services

**Question:** Does AllSquared require FCA authorisation?

**Analysis:**
- AllSquared does NOT hold client funds directly
- We integrate with FCA-authorised escrow providers
- We are a technology platform, not a financial institution

**Conclusion:** AllSquared itself does not require FCA authorisation, provided:
- [ ] Escrow provider is FCA-authorised (confirmed: Riverside, Transpact)
- [ ] Funds never touch AllSquared accounts
- [ ] Clear disclosure that escrow is provided by third party

**Required Disclosures:**
> "Escrow services are provided by [Provider Name], which is authorised and regulated by the Financial Conduct Authority (FCA) under registration number [XXXXX]. AllSquared Limited is not authorised by the FCA and does not hold client funds."

### 5.2 Anti-Money Laundering (AML)

**Does AllSquared have AML obligations?**

- Not directly (not a regulated firm)
- But escrow provider will conduct KYC/AML checks
- May need to pass through identity verification requirements

**Best Practice:**
- [ ] Collect sufficient ID information for escrow provider
- [ ] Flag suspicious activity to escrow provider
- [ ] Maintain records as required

### 5.3 Consumer Credit

**Does AllSquared need consumer credit authorisation?**

- No, if we don't offer credit or payment plans ourselves
- If adding "pay later" features, reassess

---

## 6. Legal Disclaimers

### 6.1 Not a Law Firm Disclaimer

> **IMPORTANT LEGAL NOTICE**
>
> AllSquared is a technology platform that provides tools for creating and managing service contracts. AllSquared Limited is NOT a law firm and does not provide legal advice.
>
> The contracts generated by our platform are templates designed to be customised for your specific situation. They do not constitute legal advice and may not be suitable for all circumstances.
>
> For complex contracts, disputes, or significant financial commitments, we strongly recommend consulting with a qualified solicitor. Our LITL (Lawyer-in-the-Loop) service can connect you with SRA-regulated professionals.

### 6.2 AI Limitations Disclaimer

> **About AI-Generated Content**
>
> AllSquared uses artificial intelligence to help generate contract documents. While we strive for accuracy, AI-generated content:
> - May contain errors or omissions
> - Should be reviewed before use
> - Does not account for all specific circumstances
> - Is not a substitute for professional legal advice
>
> You are responsible for reviewing and confirming the accuracy of all AI-generated content before using it.

### 6.3 Escrow Disclaimer

> **About Escrow Services**
>
> Escrow services on AllSquared are provided by [Provider Name], an FCA-authorised payment institution. AllSquared Limited does not hold funds and is not responsible for the actions of the escrow provider.
>
> Funds held in escrow are subject to the terms and conditions of [Provider Name]. Please review their terms before funding an escrow account.

---

## 7. Compliance Implementation Checklist

### Pre-Launch (Critical)

- [ ] Privacy Policy drafted and published
- [ ] Terms of Service drafted and published
- [ ] Cookie consent banner implemented
- [ ] Data processing register created
- [ ] Sub-processor list documented
- [ ] Escrow provider disclosure added
- [ ] Legal disclaimers displayed
- [ ] "Not legal advice" warnings in UI
- [ ] HTTPS enforced
- [ ] Account deletion function

### Launch (Important)

- [ ] DPAs with all sub-processors
- [ ] Data retention policy implemented
- [ ] User data export function
- [ ] ICO notification (if required)
- [ ] Security measures documented

### Post-Launch (Ongoing)

- [ ] Regular privacy policy reviews
- [ ] Cookie audit (quarterly)
- [ ] Sub-processor review (annual)
- [ ] Security audit (annual)
- [ ] Staff training (if applicable)
- [ ] Breach simulation (annual)

---

## 8. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GDPR complaint to ICO | Medium | High | Privacy by design, responsive to requests |
| User claims contract invalid | Medium | Medium | Disclaimers, LITL option |
| Escrow provider failure | Low | High | Backup provider, FCA protection |
| IR35 dispute involving our contract | Low | Medium | Clear disclaimers, not advice |
| Data breach | Low | High | Security measures, encryption, insurance |
| AML/sanctions violation | Very Low | High | Escrow provider handles KYC |

---

## 9. Contacts & Resources

### Regulatory Bodies

- **ICO (Data Protection):** ico.org.uk
- **FCA (Financial):** fca.org.uk
- **HMRC (Tax/IR35):** gov.uk/hmrc
- **SRA (Solicitors):** sra.org.uk

### Professional Advisors

- **Data Protection Counsel:** [To be appointed]
- **Employment Law:** [To be appointed]
- **Financial Regulation:** [Escrow provider's compliance team]

### Templates & Resources

- ICO GDPR guidance: ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/
- HMRC CEST tool: gov.uk/guidance/check-employment-status-for-tax
- FCA register: register.fca.org.uk/

---

## 10. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | Nakamoto Labs | Initial version |

**Next Review:** 3 months post-launch or on material changes

---

*Document Owner: Nakamoto Labs*  
*Last Updated: January 2025*
