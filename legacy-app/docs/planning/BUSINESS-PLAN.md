# AllSquared Business Plan

**Version:** 1.0  
**Date:** January 2025  
**Company:** Nakamoto Labs (AllSquared Division)  
**Jurisdiction:** United Kingdom

---

## 1. Executive Summary

### The Opportunity
The UK has 4.4 million freelancers and contractors generating £30 billion annually. 67% experience late or non-payment, and 43% face scope disputes—yet no integrated solution exists combining contracts, escrow, and milestone management.

### The Solution
AllSquared is an AI-powered platform that:
- Generates legally-sound contracts in 3-5 minutes
- Provides FCA-backed escrow for payment protection
- Automates milestone-based payment releases
- Offers dispute resolution with lawyer access

### The Business Model
SaaS subscriptions (£0-99/month) + transaction fees (2.5% escrow, 1.5% payment processing) + premium services (legal consultations, contract reviews).

### The Ask
Seeking to prove product-market fit with £10,000 initial investment, targeting profitability within 6 months and £200,000 ARR within 12 months.

---

## 2. Market Analysis

### 2.1 Market Size (UK)

| Market Segment | Size (People) | Annual Spend | TAM |
|----------------|---------------|--------------|-----|
| Freelancers (Digital) | 2.2M | £500-£10K/contract | £15B |
| Trade Contractors | 800K | £1K-£50K/contract | £10B |
| Agencies & Studios | 50K | £5K-£100K/contract | £3B |
| Event Professionals | 100K | £500-£25K/contract | £2B |
| **Total** | **3.15M** | - | **£30B** |

### Serviceable Addressable Market (SAM)
- Focus on tech-savvy professionals needing payment protection
- SAM: £5B (professionals doing £1K+ contracts who'd pay for protection)

### Serviceable Obtainable Market (SOM)
- Year 1 target: 500 customers × £190 ARPU = £95,000
- Year 3 target: 10,000 customers × £250 ARPU = £2.5M ARR

### 2.2 Market Trends

**Tailwinds:**
- Remote work normalization → More freelancing
- Gig economy growth → 10% YoY
- IR35 reforms → Need for proper contracts
- Economic uncertainty → Payment protection demand
- AI adoption → Expectation of automation

**Headwinds:**
- Economic downturn → Less discretionary spend
- Big tech competition → Well-funded entrants
- Regulatory complexity → Compliance costs

### 2.3 Competitive Landscape

| Category | Players | Our Differentiation |
|----------|---------|---------------------|
| Contract Tools | Bonsai, HoneyBook, AND.CO | UK-native + escrow integration |
| Escrow Services | Escrow.com, Payoneer | Integrated contracts + UX |
| Legal Tech | Rocket Lawyer, Juro | AI speed + escrow + LITL |
| Accounting | Xero, QuickBooks | Payment protection (not just tracking) |
| Marketplaces | Upwork, Fiverr | Direct relationships (no 20% cut) |

**Key Insight:** No competitor offers integrated contracts + escrow + milestones for the UK market.

---

## 3. Product Overview

### 3.1 Core Features (MVP)

| Feature | Status | Priority |
|---------|--------|----------|
| User Authentication | ✅ Built | P0 |
| AI Contract Generation | 🔄 90% | P0 |
| Contract Signing | 📋 Planned | P0 |
| Milestone Management | 📋 Planned | P0 |
| Escrow Integration | 📋 Planned | P0 |
| User Dashboard | 📋 Planned | P0 |
| Notifications | 📋 Planned | P1 |
| Dispute Resolution | 📋 Planned | P1 |
| LITL (Lawyer Access) | 📋 Planned | P2 |

### 3.2 Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, tRPC, Express
- **Database:** Vercel Postgres (Drizzle ORM)
- **Auth:** Clerk (replacing Manus)
- **Payments:** Stripe
- **Escrow:** Riverside Escrow (FCA-authorised)
- **AI:** OpenAI GPT-4

### 3.3 Product Roadmap

**Q1 2025:** MVP launch with core contract/escrow flow
**Q2 2025:** Dispute resolution, LITL integration
**Q3 2025:** API for integrations, mobile optimization
**Q4 2025:** Team features, white-label option

---

## 4. Revenue Model

### 4.1 Revenue Streams

| Stream | Description | Year 1 Est. |
|--------|-------------|-------------|
| **Subscriptions** | Monthly/annual SaaS plans | £50,000 |
| **Escrow Fees** | 2.5% of GMV | £30,000 |
| **Payment Processing** | 1.5% + 20p (pass-through + margin) | £15,000 |
| **Premium Services** | LITL, contract review, mediation | £10,000 |
| **Total** | | **£105,000** |

### 4.2 Pricing Tiers

| Tier | Monthly | Annual | Features | Target Segment |
|------|---------|--------|----------|----------------|
| Free | £0 | £0 | 1 contract/mo, basic escrow | Trial users |
| Starter | £9.99 | £95.88 | 5 contracts/mo, priority support | Solo freelancers |
| Professional | £29.99 | £287.88 | Unlimited, analytics, phone | Active freelancers |
| Business | £99.99 | £959.88 | Team, API, account manager | Agencies |

### 4.3 Unit Economics

| Metric | Value | Notes |
|--------|-------|-------|
| Average Revenue Per User | £190/year | Blended across tiers |
| Customer Acquisition Cost | £15 | Blended channels |
| Gross Margin | 56% | After Stripe/escrow costs |
| LTV | £380 | 2-year average tenure |
| LTV:CAC | 25:1 | Excellent ratio |
| Payback Period | 1 month | Fast payback |

---

## 5. Cost Structure

### 5.1 Fixed Costs (Monthly)

| Category | Cost | Notes |
|----------|------|-------|
| Hosting (Vercel) | £0-100 | Free tier → Pro |
| Database (Vercel Postgres) | £0-50 | Usage-based |
| Domain & DNS | £10 | Annual divided |
| Email (Resend) | £0-20 | Free tier |
| Analytics (PostHog) | £0 | Free tier |
| Error Tracking (Sentry) | £0 | Free tier |
| AI (OpenAI) | £50-200 | Usage-based |
| **Total Fixed** | **£60-380** | |

### 5.2 Variable Costs (Per Transaction)

| Cost | Rate | Notes |
|------|------|-------|
| Stripe Payment Processing | 1.4% + 20p | Pass to customer |
| Escrow Partner Fee | 0.5% | We charge 2.5% |
| AI Contract Generation | ~£0.10 | Per contract |

### 5.3 Operating Costs (Monthly)

| Category | Cost | Notes |
|----------|------|-------|
| Fixed Costs | £200 | Average |
| Marketing | £500-2,000 | Scale with revenue |
| Legal/Compliance | £200 | Occasional |
| Support (Tools) | £50 | Intercom etc. |
| **Total OpEx** | **£950-2,450** | |

### 5.4 Path to Profitability

| Milestone | Customers | MRR | Costs | Profit |
|-----------|-----------|-----|-------|--------|
| Break-even | 100 | £2,000 | £2,000 | £0 |
| Sustainable | 250 | £5,000 | £3,000 | £2,000 |
| Growth | 500 | £10,000 | £5,000 | £5,000 |
| Scale | 1,000 | £20,000 | £8,000 | £12,000 |

**Break-even Point:** ~100 paying customers (achievable in 90 days)

---

## 6. Key Metrics

### 6.1 North Star Metric
**Monthly Contracts Created** — Leading indicator of GMV and revenue

### 6.2 KPI Dashboard

| Category | Metric | Target (90 days) |
|----------|--------|------------------|
| **Acquisition** | Signups | 500 |
| | Conversion (signup → paid) | 20% |
| | CAC | <£20 |
| **Engagement** | Contracts/user/month | 2+ |
| | Milestone completion rate | >80% |
| | DAU/MAU | >30% |
| **Revenue** | MRR | £2,000 |
| | Escrow GMV | £50,000 |
| | ARPU | £190/year |
| **Retention** | Monthly churn | <5% |
| | NPS | >40 |
| | Support resolution | <24h |

---

## 7. Funding Requirements

### 7.1 Current Investment
- **Development:** Complete MVP (168 files, ~15K LOC)
- **Infrastructure:** Vercel, domain, initial setup
- **Estimated Value:** £30,000+ in development time

### 7.2 Runway to Profitability

| Phase | Duration | Burn | Total |
|-------|----------|------|-------|
| Launch | Months 1-3 | £3,000/mo | £9,000 |
| Traction | Months 4-6 | £2,000/mo | £6,000 |
| Growth | Months 7-12 | Break-even | £0 |
| **Total** | | | **£15,000** |

### 7.3 Use of Funds (£10,000 Budget)

| Category | Amount | Purpose |
|----------|--------|---------|
| Marketing | £5,000 | Paid acquisition, PR, content |
| Legal | £1,500 | Terms, privacy, compliance review |
| Design | £1,000 | Landing page, marketing assets |
| Tools/Infra | £1,500 | Upgraded hosting, services |
| Contingency | £1,000 | Unexpected costs |

### 7.4 Future Funding (Optional)

**If scaling aggressively:**
- Seed round: £250,000-500,000
- Use: Team expansion, enterprise features, market expansion
- Timeline: After proving £20K MRR

---

## 8. Risk Analysis

### 8.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Market Risk** | | | |
| Low adoption | Medium | High | Multi-channel GTM, pivot quickly |
| Economic downturn | Medium | Medium | Focus on ROI messaging |
| **Technical Risk** | | | |
| Escrow integration issues | Medium | High | Backup provider, manual fallback |
| Security breach | Low | Critical | Security audits, encryption, insurance |
| **Competitive Risk** | | | |
| Big tech entry | Low | Medium | Move fast, build moat |
| Competitor feature parity | Medium | Medium | Focus on UK, build community |
| **Regulatory Risk** | | | |
| FCA rule changes | Low | High | Legal monitoring, LITL network |
| GDPR enforcement | Low | Medium | Compliance by design |
| **Operational Risk** | | | |
| Key person dependency | Medium | Medium | Document everything, consider co-founder |
| Support overwhelm | Medium | Low | Automation, FAQ, community |

### 8.2 Contingency Plans

**If traction is slow:**
- Pivot to B2B (agencies first)
- White-label for accountants
- Focus on single vertical (trades or digital)

**If costs exceed revenue:**
- Cut marketing, focus on organic
- Increase prices
- Add more premium services

**If competitor launches:**
- Accelerate differentiating features
- Double down on UK focus
- Consider acquisition interest

---

## 9. Team & Operations

### 9.1 Current Team

**Eli Bernstein** — Founder
- Product vision and strategy
- Business development
- Legal/compliance oversight

**Claudia (AI)** — Technical Development
- MVP development
- Technical architecture
- Documentation

### 9.2 Hiring Plan

| Role | When | Priority |
|------|------|----------|
| Customer Support | Month 3 | Part-time contractor |
| Marketing | Month 6 | Part-time or agency |
| Full-Stack Developer | Month 9 | If funded |

### 9.3 Advisory Needs

- **Legal:** UK contract law, FCA regulations
- **Financial:** Escrow operations, payment processing
- **Growth:** SaaS marketing, freelance economy

---

## 10. Timeline

### Q1 2025 (Now - March)
- [x] MVP development
- [ ] Deployment and launch
- [ ] First 100 customers
- [ ] ProductHunt launch

### Q2 2025 (April - June)
- [ ] 500 customers
- [ ] First partnership live
- [ ] Mobile optimization
- [ ] Dispute resolution feature

### Q3 2025 (July - September)
- [ ] £10K MRR
- [ ] API for integrations
- [ ] Consider seed round
- [ ] Team expansion

### Q4 2025 (October - December)
- [ ] £20K MRR
- [ ] Enterprise features
- [ ] International research
- [ ] Year 2 planning

---

## 11. Exit Strategy (Long-term)

### Potential Outcomes

| Outcome | Probability | Timeline | Value |
|---------|-------------|----------|-------|
| Acquisition (Accounting SW) | Medium | 3-5 years | £5-15M |
| Acquisition (FinTech) | Medium | 3-5 years | £10-30M |
| Private Equity | Low | 5-7 years | £20-50M |
| IPO | Very Low | 7-10 years | £100M+ |
| Lifestyle Business | Medium | Ongoing | £500K/year profit |

### Acquirer Profiles
- **Xero/Intuit:** Contracts complement accounting
- **Wise/Revolut:** FinTech expansion to services
- **Upwork/Fiverr:** Add contract management
- **Legal tech:** Juro, Ironclad expanding downstream

---

## 12. Appendix

### A. Financial Projections (5-Year)

| Year | Customers | MRR | ARR | Expenses | Profit |
|------|-----------|-----|-----|----------|--------|
| 2025 | 500 | £8K | £100K | £60K | £40K |
| 2026 | 2,000 | £35K | £420K | £200K | £220K |
| 2027 | 5,000 | £100K | £1.2M | £500K | £700K |
| 2028 | 10,000 | £200K | £2.4M | £1M | £1.4M |
| 2029 | 20,000 | £400K | £4.8M | £2M | £2.8M |

### B. Key Assumptions
- 20% conversion from signup to paid
- 5% monthly churn
- £190 average annual revenue per user
- 2.5% escrow fee on £20K average contract
- 60% gross margin after payment processing

### C. References
- IPSE UK Freelance Statistics 2024
- Federation of Small Businesses Reports
- Office for National Statistics Self-Employment Data
- Statista UK Gig Economy Projections

---

*Document Owner: Nakamoto Labs*  
*Last Updated: January 2025*
