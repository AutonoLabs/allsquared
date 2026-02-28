# AllSquared Regulatory Compliance Checklist

**Last Updated:** [INSERT DATE]
**Compliance Officer:** [INSERT NAME]
**Next Review:** [INSERT DATE]

---

## Executive Summary

This document outlines the regulatory requirements for AllSquared's operations in the United Kingdom. It covers business registration, data protection, consumer protection, legal services regulation, and financial services considerations.

---

## 1. Business Registration

### 1.1 Companies House

| Requirement | Status | Action Required | Deadline |
|-------------|--------|-----------------|----------|
| Company Registration (Ltd) | [ ] Pending | Register Private Limited Company | Pre-launch |
| Confirmation Statement | [ ] N/A | Annual filing | 12 months from incorporation |
| Annual Accounts | [ ] N/A | File accounts | 9 months after year-end |
| Registered Office | [ ] Pending | Establish UK registered office | At incorporation |
| Persons of Significant Control | [ ] Pending | Register PSC details | At incorporation |

**Estimated Cost:** £12 (online registration) + professional fees

### 1.2 HMRC Registration

| Requirement | Status | Threshold | Action |
|-------------|--------|-----------|--------|
| Corporation Tax | [ ] Pending | All companies | Register within 3 months of trading |
| VAT Registration | [ ] Not Required | >£90,000/year | Register when threshold met |
| PAYE | [ ] Not Required | Employees | Register before first payday |

### 1.3 ICO Registration

| Requirement | Status | Fee | Notes |
|-------------|--------|-----|-------|
| Data Protection Registration | [ ] Pending | £40-£2,900/year | Required before processing personal data |

**Fee Tiers:**
- Tier 1 (£40): Turnover ≤£632k, <10 staff
- Tier 2 (£60): Turnover ≤£36m, <250 staff
- Tier 3 (£2,900): Turnover >£36m or >250 staff

---

## 2. Data Protection (UK GDPR)

### 2.1 Documentation Requirements

| Document | Status | Owner | Last Reviewed |
|----------|--------|-------|---------------|
| Privacy Policy | [ ] Draft Complete | Legal | [DATE] |
| Cookie Policy | [ ] Draft Complete | Legal | [DATE] |
| Data Processing Records (Article 30) | [ ] Pending | DPO | - |
| Lawful Basis Documentation | [ ] Pending | DPO | - |
| Consent Records | [ ] Pending | Tech | - |
| Data Retention Schedule | [ ] Draft | Legal | [DATE] |

### 2.2 Technical Requirements

| Requirement | Status | Owner | Notes |
|-------------|--------|-------|-------|
| Encryption at Rest | [ ] Implemented | Engineering | AES-256 |
| Encryption in Transit | [ ] Implemented | Engineering | TLS 1.3 |
| Access Controls | [ ] Implemented | Engineering | RBAC |
| Audit Logging | [ ] Implemented | Engineering | All data access logged |
| Data Subject Request Process | [ ] Pending | Support | 30-day response SLA |
| Breach Notification Process | [ ] Pending | DPO | 72-hour ICO notification |

### 2.3 Data Processing Agreements

| Processor | Status | Agreement Type | Review Date |
|-----------|--------|----------------|-------------|
| Stripe | [ ] Required | Stripe DPA | Pre-launch |
| OpenAI | [ ] Required | OpenAI DPA + SCCs | Pre-launch |
| Vercel | [ ] Required | Vercel DPA | Pre-launch |
| TiDB/PlanetScale | [ ] Required | DPA + SCCs | Pre-launch |
| Firebase | [ ] Required | Google Cloud DPA | Pre-launch |
| Transpact | [ ] Required | Custom DPA | Pre-launch |
| DocuSign | [ ] Required | DocuSign DPA | Pre-launch |

### 2.4 International Transfers

| Destination | Transfer Mechanism | Status |
|-------------|-------------------|--------|
| USA | Standard Contractual Clauses | [ ] In Progress |
| EU/EEA | Adequacy Decision | [ ] Compliant |

---

## 3. Legal Services Act 2007 Compliance

### 3.1 Reserved vs Unreserved Activities

**Reserved Legal Activities (AllSquared DOES NOT Provide):**
- [ ] Exercising rights of audience (court representation)
- [ ] Conducting litigation
- [ ] Reserved instrument activities (property transfers)
- [ ] Probate activities
- [ ] Notarial activities
- [ ] Administration of oaths

**Unreserved Legal Activities (AllSquared CAN Provide):**
- [x] Contract drafting (templates and AI-assisted)
- [x] Legal information (not advice)
- [x] Document preparation
- [x] Dispute resolution facilitation

### 3.2 Required Disclaimers

The following disclaimers must appear prominently:

**Contract Generation Disclaimer:**
```
"AllSquared provides contract templates and AI-assisted drafting for
informational purposes. This is not legal advice. For matters requiring
legal expertise, we recommend using our Lawyer-in-the-Loop service or
consulting an independent solicitor."
```

**LITL Referral Disclaimer:**
```
"Lawyers in our LITL network are independent, SRA-regulated solicitors.
AllSquared is not a law firm and does not provide legal advice. When you
engage a LITL solicitor, you contract directly with them under their
terms of engagement."
```

### 3.3 LITL Solicitor Requirements

| Requirement | Verification Method | Frequency |
|-------------|-------------------|-----------|
| SRA Registration | SRA Register Check | Before onboarding + annual |
| Professional Indemnity Insurance | Certificate copy | Annual |
| Practicing Certificate | SRA verification | Annual |
| No Outstanding Complaints | SRA Register | Before onboarding + annual |

---

## 4. Financial Conduct Authority (FCA) Considerations

### 4.1 AllSquared's FCA Status

**AllSquared is NOT directly FCA regulated because:**
- We do not hold client money (escrow partner does)
- We do not provide financial advice
- We are not a payment institution

### 4.2 Escrow Partner Requirements

| Requirement | Transpact | ShieldPay (Backup) |
|-------------|-----------|-------------------|
| FCA Authorisation | Ref: 546279 | Ref: 770210 |
| Verification | [ ] Verify on FCA Register | [ ] Verify on FCA Register |
| Client Money Rules | [ ] Confirm compliance | [ ] Confirm compliance |
| Annual Verification | [ ] Schedule | [ ] Schedule |

**FCA Register Check:** https://register.fca.org.uk/

### 4.3 Required Disclosures

```
"Payment protection is provided by Transpact Ltd (FCA Reference: 546279),
an FCA-authorised escrow service provider. AllSquared Ltd is not
FCA-regulated and does not hold client funds directly."
```

### 4.4 Anti-Money Laundering

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Customer Due Diligence | Via escrow partner + Stripe Identity | [ ] Implemented |
| Enhanced Due Diligence | For high-value transactions | [ ] Process defined |
| Suspicious Activity Reporting | Via escrow partner | [ ] Process defined |
| Record Keeping | 5-year retention | [ ] Implemented |

---

## 5. Consumer Protection

### 5.1 Consumer Rights Act 2015

| Requirement | Status | Notes |
|-------------|--------|-------|
| Services performed with reasonable care and skill | [ ] TOS included | Standard of service |
| Services performed within reasonable time | [ ] TOS included | Response times |
| Price transparency | [ ] Implemented | Clear pricing page |
| Unfair terms review | [ ] Pending | Legal review of TOS |

### 5.2 Consumer Contracts Regulations 2013

| Requirement | Status | Notes |
|-------------|--------|-------|
| 14-day cancellation right (subscriptions) | [ ] Implemented | Cancel within 14 days for full refund |
| Pre-contract information | [ ] Implemented | Pricing, features, terms visible |
| Confirmation of contract | [ ] Implemented | Email confirmation sent |
| Refund within 14 days of cancellation | [ ] Process defined | Automated via Stripe |

### 5.3 Complaint Handling

| Element | Status | Owner |
|---------|--------|-------|
| Complaints procedure | [ ] Draft | Support |
| Complaints email (complaints@allsquared.co.uk) | [ ] Pending | Tech |
| Response time (14 days acknowledgment, 28 days resolution) | [ ] Process defined | Support |
| Escalation path | [ ] Defined | Management |

---

## 6. Electronic Signatures

### 6.1 eIDAS Compliance (UK Retained)

| Signature Type | Legal Status | AllSquared Support |
|----------------|--------------|-------------------|
| Simple Electronic Signature | Valid, but lower evidential weight | [x] Internal signatures |
| Advanced Electronic Signature | Valid, higher evidential weight | [x] DocuSign/SignWell |
| Qualified Electronic Signature | Equivalent to handwritten | [ ] Not currently offered |

### 6.2 Evidence Requirements

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Audit trail | Timestamp, IP, user agent logged | [ ] Implemented |
| Intent to sign | Explicit agreement checkbox | [ ] Implemented |
| Signer identity | Account authentication | [ ] Implemented |
| Document integrity | Hash verification | [ ] Implemented |

---

## 7. Website Compliance

### 7.1 Required Information

| Information | Location | Status |
|-------------|----------|--------|
| Company name | Footer, Contact page | [ ] Pending |
| Company registration number | Footer, Terms | [ ] Pending |
| Registered address | Footer, Contact page | [ ] Pending |
| Contact email | Footer, Contact page | [ ] Implemented |
| VAT number (when applicable) | Footer, Pricing | [ ] N/A |

### 7.2 Accessibility (WCAG 2.1 AA)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Keyboard navigation | [ ] Testing required | All features accessible |
| Screen reader compatibility | [ ] Testing required | ARIA labels |
| Colour contrast | [ ] Testing required | 4.5:1 minimum |
| Alt text for images | [ ] Partial | Review needed |
| Accessibility statement | [ ] Pending | Required by law for public sector, best practice for all |

---

## 8. Insurance

### 8.1 Required Coverage

| Insurance Type | Minimum Cover | Status | Provider |
|----------------|---------------|--------|----------|
| Professional Indemnity | £1,000,000 | [ ] Required | TBC |
| Public Liability | £2,000,000 | [ ] Recommended | TBC |
| Employers' Liability | £5,000,000 | [ ] Required (with employees) | TBC |
| Cyber Insurance | £500,000 | [ ] Recommended | TBC |
| Directors & Officers | £1,000,000 | [ ] Recommended | TBC |

---

## 9. Compliance Calendar

### Monthly Tasks
- [ ] Review security logs for anomalies
- [ ] Process any pending data subject requests
- [ ] Review customer complaints

### Quarterly Tasks
- [ ] LITL solicitor verification checks
- [ ] Review and update cookie inventory
- [ ] Escrow partner status verification

### Annual Tasks
- [ ] Companies House confirmation statement
- [ ] ICO registration renewal
- [ ] Insurance policy review
- [ ] Full compliance audit
- [ ] Privacy Policy review
- [ ] Terms of Service review
- [ ] Staff data protection training

---

## 10. Pre-Launch Checklist

### Critical (Must Have Before Launch)

- [ ] Company incorporated at Companies House
- [ ] ICO data protection registration
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Cookie consent mechanism implemented
- [ ] Escrow partner agreement signed
- [ ] Stripe account verified
- [ ] Professional indemnity insurance
- [ ] Legal disclaimers implemented
- [ ] Contact information published

### Important (Launch Week)

- [ ] Cookie Policy published
- [ ] Data Processing Agreements signed
- [ ] Complaints procedure documented
- [ ] Support team trained on data protection
- [ ] Accessibility basic checks completed

### Post-Launch (First 30 Days)

- [ ] Full accessibility audit
- [ ] Security penetration testing
- [ ] DPIA for high-risk processing
- [ ] Staff training completed

---

## 11. Regulatory Contacts

### UK Regulators

| Regulator | Contact | Purpose |
|-----------|---------|---------|
| ICO | ico.org.uk | Data protection |
| FCA | fca.org.uk | Financial services (escrow partner) |
| SRA | sra.org.uk | Legal services (LITL) |
| Companies House | gov.uk/government/organisations/companies-house | Company registration |
| HMRC | gov.uk/government/organisations/hm-revenue-customs | Tax |
| CMA | gov.uk/government/organisations/competition-and-markets-authority | Consumer protection |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [DATE] | [NAME] | Initial version |

**Review Schedule:** Quarterly

**Next Review Due:** [DATE]

---

*This document is for internal compliance tracking. Requirements should be verified with qualified legal and compliance professionals.*
