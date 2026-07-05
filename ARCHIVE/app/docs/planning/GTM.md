# AllSquared — Go-To-Market Plan

**Last updated:** 2026-02-08  
**Stage:** Pre-launch (MVP built, deployment pending)  
**Target launch:** 2-3 hours from blocker resolution

---

## 1. Product Summary

**AllSquared** is a platform for secure service contracts in the UK freelance economy. It combines:
- AI-powered contract generation
- FCA-backed milestone escrow
- Dispute resolution with optional lawyer referrals (LITL)

**One-liner:** "Sort out your contracts, payments, and disputes — all squared."

---

## 2. Target Market

### Primary: UK Freelancers & Contractors
- **Market size:** 10M+ freelancers and SMEs in the UK
- **TAM:** £30B (freelance + home improvement services)
- **Pain points:**
  - 43% of freelancers experience late or non-payment
  - Average cost of legal contract drafting: £500-2000
  - No single platform handles contracts + payments + disputes

### Segments (by service category — built into the product)

| Segment | Size | Pain Level | Willingness to Pay |
|---------|------|------------|-------------------|
| **Freelance services** (dev, design, writing) | Largest | High | Medium-High |
| **Trade services** (plumbing, electrical) | Large | Very High | High |
| **Home improvements** (renovations) | Large | Very High | High |
| **Event services** (catering, photo) | Medium | Medium | Medium |

### Ideal Customer Profile (ICP)
- UK-based freelancer or small business (1-5 people)
- Earns £30K-100K/year from services
- Has been burned by non-payment or scope creep at least once
- Currently uses Word docs, PDFs, or nothing for contracts
- Ages 25-45, digitally comfortable

### Secondary: Clients/Buyers
- SMEs hiring freelancers/contractors
- Homeowners commissioning improvements
- Event planners

---

## 3. Competitive Landscape

| Competitor | What They Do | AllSquared Advantage |
|------------|-------------|---------------------|
| **Upwork/Fiverr** | Marketplace + escrow | We're contract-first, not marketplace. No 20% fees. 2.5% escrow only |
| **HelloSign/DocuSign** | E-signatures | We include AI contract generation, not just signing |
| **AND CO (Fiverr)** | Invoicing | We add escrow + dispute resolution |
| **Bonsai** | Freelance admin | US-focused. We're UK-first with FCA compliance |
| **PayPal/Escrow.com** | Payment escrow | We combine contracts + milestones + escrow in one flow |
| **Solicitors** | Legal drafting | We're 100x cheaper and 100x faster |

**Moat:** Only platform combining AI contracts + milestone escrow + dispute resolution specifically for UK freelancers.

---

## 4. Pricing Strategy

### Proposed Tiers

| Tier | Price | Includes | Target |
|------|-------|----------|--------|
| **Free** | £0/mo | 1 contract/month, basic templates | Try before you buy |
| **Starter** | £9.99/mo | 5 contracts, all templates, email support | Part-time freelancers |
| **Professional** | £29.99/mo | Unlimited contracts, priority support, analytics | Full-time freelancers |
| **Business** | £99.99/mo | Team features, API access, dedicated support | Small agencies |

### Transaction Fees
- **Escrow fee:** 2.5% of milestone value (competitive vs Upwork's 20%)
- **LITL referral:** £49-199 per consultation (revenue share with solicitors)

### Unit Economics
- **CAC target:** £15-25
- **LTV target:** £340+ (22.8:1 LTV:CAC)
- **Gross margin:** 56%+ (SaaS + transaction fees)
- **Break-even:** ~500 paying customers

---

## 5. Launch Strategy

### Phase 0: Soft Launch (Week 1-2)
**Goal:** 10-20 beta users from personal network

1. **Fix blockers** — Clerk auth, database, env vars (~2-3 hours)
2. **Smoke test** — full flow: signup → contract → milestone
3. **Seed templates** — 5 category templates pre-loaded
4. **Invite beta testers:**
   - Eli's network (UK freelancers, contractors)
   - Nakamoto Labs contacts
   - 3-5 real freelancer-client pairs for live testing
5. **Collect feedback** — bugs, UX issues, missing features
6. **Iterate daily** — ship fixes fast

### Phase 1: Early Adopters (Week 3-4)
**Goal:** 50 signups, 10 active contracts

1. **ProductHunt launch** — prepare assets (screenshots, video demo, description)
2. **Reddit posts** — r/freelanceUK, r/UKPersonalFinance, r/ContractorUK
3. **Twitter/X campaign** — daily posts, engage with freelancer communities
4. **LinkedIn outreach** — target UK freelance leaders and influencers
5. **Blog content** — "Why freelancers need contracts" (SEO play)

### Phase 2: Growth (Month 2-3)
**Goal:** 100 paying customers, £2K MRR

1. **Referral program** — 1 free month for each referred paying user
2. **Partnership outreach:**
   - IPSE (Association of Independent Professionals)
   - UK freelancer communities (Leapers, Being Freelance)
   - Co-working spaces (WeWork, Huckletree)
3. **Content marketing** — case studies from beta users
4. **Google Ads** — "freelance contract template UK", "escrow for freelancers"
5. **Email sequences** — nurture signups to paid conversion

### Phase 3: Scale (Month 4-6)
**Goal:** 500 users, £10K MRR

1. **Stripe integration** — real payment processing
2. **Escrow provider** — Riverside Finance or Transpact API
3. **AI features** — OpenAI contract generation goes live
4. **Mobile optimization** — responsive or PWA
5. **Press/PR** — TechCrunch, Sifted, UK tech press

---

## 6. Marketing Channels

### Organic (Low Cost, High Value)

| Channel | Strategy | Effort | Expected Impact |
|---------|----------|--------|-----------------|
| **SEO / Blog** | "UK freelance contract" keyword cluster | Medium | High (long-term) |
| **Reddit** | Value posts in freelance subs | Low | Medium |
| **Twitter/X** | Daily freelancer tips + product mentions | Medium | Medium |
| **LinkedIn** | Thought leadership + direct outreach | Medium | High |
| **ProductHunt** | Timed launch with assets | High (one-time) | High (spike) |

### Paid (Targeted, Measurable)

| Channel | Budget | Strategy |
|---------|--------|----------|
| **Google Ads** | £500/mo | "freelance contract UK", "escrow service" |
| **LinkedIn Ads** | £300/mo | Target UK freelancers by job title |
| **Facebook/Insta** | £200/mo | Retargeting website visitors |

### Partnership (High Trust, Slow Build)

| Partner Type | Examples | Value |
|-------------|----------|-------|
| **Freelancer associations** | IPSE, PCG | Credibility + distribution |
| **Accounting platforms** | FreeAgent, Xero | Integration + referrals |
| **Co-working spaces** | WeWork, Huckletree | Physical presence |
| **Legal firms** | LITL partners | Revenue share + credibility |

---

## 7. First 100 Users Plan

### Users 1-10: Inner Circle (Week 1)
- Eli's direct network
- Nakamoto Labs contacts
- Friends/colleagues who freelance
- **Method:** Personal invite, 1-on-1 onboarding
- **Goal:** Validate core flow, find critical bugs

### Users 11-30: Extended Network (Week 2)
- LinkedIn connections
- Twitter mutuals in freelance space
- UK startup community
- **Method:** Personal DMs with value proposition
- **Goal:** First organic contract creation (not demo)

### Users 31-50: Community Launch (Week 3)
- ProductHunt launch
- Reddit posts (with genuine value, not spam)
- Twitter thread: "We built AllSquared — here's why"
- **Method:** Public launch with tracking links
- **Goal:** First stranger signs up and creates a contract

### Users 51-100: Growth Loops (Week 4-6)
- Referral program activates
- SEO content starts ranking
- Google Ads begin
- **Method:** Mix of organic + paid + referral
- **Goal:** First paying customer, first organic referral

### Metrics to Track
| Metric | Target (Day 30) | Target (Day 90) |
|--------|-----------------|-----------------|
| Signups | 50 | 250 |
| Active contracts | 10 | 100 |
| Paying customers | 5 | 100 |
| MRR | £50 | £2,000 |
| NPS | >50 | >60 |
| Contract completion rate | >60% | >75% |

---

## 8. Content Strategy

### Blog Topics (SEO)
1. "Do UK Freelancers Need Contracts? (Yes, and Here's Why)"
2. "How to Protect Yourself from Non-Payment as a Freelancer"
3. "Freelance Contract Template: What to Include (2026 Guide)"
4. "Escrow for Freelancers: The Payment Protection You're Missing"
5. "Scope Creep: How to Prevent It with Milestone Contracts"
6. "IR35 and Contracts: What UK Contractors Need to Know"

### Social Templates
- **Twitter:** Freelancer tips, stats, polls, product updates
- **LinkedIn:** Industry insights, case studies, thought leadership
- **Instagram:** Visual tips, contract horror stories, founder journey

### Email Sequences
1. **Welcome (Day 0):** What AllSquared does + quick start guide
2. **Day 3:** "Create your first contract" tutorial
3. **Day 7:** Case study — how a freelancer protected £5K payment
4. **Day 14:** Feature spotlight — milestone management
5. **Day 21:** Upgrade prompt — "You've used your free contract"

---

## 9. Budget (First 90 Days)

| Category | Budget | Notes |
|----------|--------|-------|
| Google Ads | £1,500 | Targeted UK keywords |
| LinkedIn Ads | £900 | Freelancer targeting |
| Facebook/Insta | £600 | Retargeting |
| Content creation | £500 | Blog posts, graphics |
| ProductHunt prep | £250 | Video, assets |
| Tools (analytics, email) | £500 | PostHog, Resend |
| Legal review (ToS) | £750 | Solicitor review |
| Contingency | £1,000 | Buffer |
| **Total** | **£6,000** | |

---

## 10. Success Criteria

### 30 Days
- [ ] Platform live and functional at allsquared.io
- [ ] 50+ signups
- [ ] 10+ contracts created
- [ ] 0 critical bugs in production
- [ ] NPS > 40 from beta users

### 90 Days
- [ ] 100 paying customers
- [ ] £2K MRR
- [ ] 3 case studies published
- [ ] SEO content ranking for 5+ keywords
- [ ] Stripe payments live
- [ ] At least 1 partnership (IPSE, co-working, etc.)

### 6 Months
- [ ] 500 active users
- [ ] £10K MRR
- [ ] Escrow feature live (FCA-backed)
- [ ] AI contract generation live
- [ ] Press coverage in 2+ UK tech publications

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low adoption | Medium | High | Focus on pain points (non-payment), free tier, referral program |
| FCA escrow complexity | High | High | Launch without escrow, add later with authorized partner |
| Competition from Bonsai/AND CO | Medium | Medium | UK-first positioning, local compliance |
| Technical debt from Manus→Clerk migration | Low | Medium | Thorough testing before launch |
| Pricing too high/low | Medium | Medium | Start with free tier, adjust based on data |

---

*Sprint reviewed: 2026-02-08 by Ada*
