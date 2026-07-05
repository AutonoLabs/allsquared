# AllSquared — Updated Business Plan
### Dual-Strategy: Classic + Protocol
**Version:** 2.0 | **Date:** February 2026 | **Author:** AutonoLabs Strategic Team

---

## Executive Summary

AllSquared is evolving from a UK freelance contracts platform into a **dual-track venture** that bridges human freelancing and autonomous agent commerce:

1. **AllSquared Classic** — A UK-focused freelance contracts platform combining AI-generated, UK-compliant service agreements with FCA-backed escrow and milestone payments. Target: the £30B UK freelance economy, specifically 500K+ high-value freelancers and their clients.

2. **AllSquared Protocol** — An open commercial infrastructure layer for the emerging agent economy, providing contract negotiation, escrow, verification, and reputation primitives on top of Google A2A, Coinbase x402, OpenAI/Stripe ACP, and Accord Project. Target: the $7.6B (2025) → $199B (2034) agentic AI market.

**The thesis:** The same commercial primitives that protect a £10K web development contract between a freelancer and a startup (scope, milestones, escrow, dispute resolution, reputation) are exactly what autonomous AI agents need to transact with each other. AllSquared builds these once and deploys them twice — first for humans, then for agents.

**Revenue model:** Classic generates near-term SaaS + transaction revenue (£30/month subscriptions + 2.5% escrow fees). Protocol generates medium-term infrastructure revenue (SDK licensing, per-contract API fees, registry listings, verification fees, and on-chain settlement commissions).

**Financial targets:**

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| Classic MRR | £5,000 | £20,000 | £80,000 |
| Protocol MRR | — | £2,000 | £50,000 |
| Combined ARR | £60,000 | £264,000 | £1,560,000 |
| Headcount | 2 | 5 | 12 |

---

## 1. Market Analysis

### 1.1 AllSquared Classic — UK Freelance Market

**Market size:**
- **TAM:** £33.5B — Total UK freelance economy (3.8M freelancers, ONS/IPSE 2025)
- **SAM:** £5B — 500K high-value freelancers (£30K+/year, £1K+ contracts, digitally active)
- **SOM Year 1:** £95K ARR — 500 paying customers × £190 ARPU
- **SOM Year 3:** £2.5M ARR — 10,000 customers × £250 ARPU

**Key drivers:**
- 67% of UK freelancers report late/non-payment (IPSE 2025)
- 10% YoY growth in self-employment (ONS Labour Force Survey)
- IR35 reform anxiety creating compliance demand
- Making Tax Digital (MTD) 2026 rollout driving software adoption
- No UK competitor combines contracts + FCA-backed escrow

**Competitive landscape:**
| Competitor | Contracts | Escrow | UK Law | Price |
|-----------|-----------|--------|--------|-------|
| HoneyBook | ✅ | ❌ | ❌ (US) | £15-62/mo |
| Bonsai | ✅ | ❌ | ❌ (US) | £16-62/mo |
| YunoJuno | ✅ | ❌ | ✅ | ~5-10% fee |
| Transpact | ❌ | ✅ | ✅ | 0.5-2% |
| **AllSquared** | **✅** | **✅** | **✅** | **£30/mo + 2.5%** |

**Positioning:** Only player offering UK compliance + escrow + AI contracts in one platform. The "Stripe for UK freelance contracts."

### 1.2 AllSquared Protocol — Agent Commerce Market

**Market size:**
- **Global agentic AI market:** $7.6B (2025) → $10.9B (2026) → $199B (2034) at 43.8% CAGR (Precedence Research, Grand View Research)
- **Agent commerce TAM:** We estimate 5-10% of the agentic AI market involves inter-agent commercial transactions, yielding a $550M (2026) → $10-20B (2034) agent commerce opportunity
- **SAM:** Agent-to-agent contracting infrastructure = $50M (2026) → $2B (2034)
- **SOM Year 1:** $200K — 500 registered agents, 10K contracts/month
- **SOM Year 3:** $5M — 50K registered agents, 1M contracts/month

**Key drivers:**
- Google A2A spec (v0.2.2) adopted by Linux Foundation, ServiceNow, SAP — creating interoperable agent communication
- Coinbase x402 live in production (75M+ transactions, $24M+ volume on Base and Solana)
- OpenAI + Stripe ACP in production on ChatGPT — agents already purchasing
- Accord Project's TypeScript smart legal contracts enabling programmable legal agreements
- No protocol exists for scoped work with milestones, verification, and dispute resolution between agents

**The gap AllSquared fills:**

```
x402 (Coinbase)    → Micropayments (pay-per-request)
ACP (OpenAI/Stripe) → Structured purchases (buy products)
AllSquared Protocol → Scoped work with milestones (contract services)
```

x402 handles "pay $0.001 per API call." ACP handles "buy this product for $49." Neither handles "hire this agent to clean 50K rows of CSV data for $27.50, paid across 2 milestones, with automated quality verification and dispute resolution." That's AllSquared Protocol.

---

## 2. Revenue Model

### 2.1 Classic Revenue

| Stream | Model | Year 1 Projection |
|--------|-------|-------------------|
| **Subscriptions** | Free / £29.99/mo Pro | £54K (150 avg Pro × £30 × 12) |
| **Escrow fees** | 2.5% of contract value | £25K (£1M GMV × 2.5%) |
| **Verification fees** | £0 (included in escrow) | — |
| **LITL referrals** | £50-100/referral commission | £5K (100 referrals) |
| **Total Classic Year 1** | | **~£84K** |

**Unit economics:**
- ARPU: £190/year (blended free + paid)
- CAC: £20-25 (community-driven, low paid spend)
- LTV: £570 (3-year average retention)
- LTV:CAC ratio: 23-28x (excellent)
- Gross margin: ~85% (SaaS + platform fees)

### 2.2 Protocol Revenue

| Stream | Model | Year 1 Projection | Year 2 Projection |
|--------|-------|------|------|
| **Per-contract API fees** | $0.01-0.10 per contract | $12K (1M contracts) | $120K (10M) |
| **Escrow settlement** | 1-3% of on-chain value | $5K ($500K vol) | $150K ($5M vol) |
| **Registry listings** | $50-500/mo premium tiers | $6K (20 premium agents) | $60K (200) |
| **Verification fees** | $0.005-0.50 per check | $3K | $30K |
| **SDK licensing** | Free tier + Enterprise | $0 (adoption) | $50K (10 enterprise) |
| **Insurance/derivatives** | 0.5-2% premiums | $0 (future) | $10K (early) |
| **Total Protocol Year 1** | | **~$26K** | **~$420K** |

**Note:** Protocol revenue is deliberately low in Year 1 — the strategy is adoption-first, monetization-second. The compounding moat is data (agent performance, reliability, quality scores) that makes AllSquared's reputation system indispensable.

### 2.3 Combined Financial Projections (24-Month)

| Month | Classic MRR | Protocol MRR | Total MRR | Cumulative Revenue | Headcount |
|-------|------------|-------------|-----------|-------------------|-----------|
| 1 | £1,200 | £0 | £1,200 | £1,200 | 2 |
| 3 | £3,000 | £0 | £3,000 | £7,200 | 2 |
| 6 | £5,000 | £500 | £5,500 | £25,200 | 3 |
| 9 | £10,000 | £1,500 | £11,500 | £58,200 | 4 |
| 12 | £20,000 | £4,000 | £24,000 | £120,000 | 5 |
| 18 | £50,000 | £20,000 | £70,000 | £402,000 | 8 |
| 24 | £80,000 | £50,000 | £130,000 | £1,002,000 | 12 |

**Key assumptions:**
- Classic: 20% MoM growth for months 1-12, moderating to 10% MoM months 12-24
- Protocol: MVP launches Month 6, accelerates Month 9+ as A2A ecosystem matures
- Blended take rate increases as volume grows and premium features launch
- Headcount grows with revenue milestones, not ahead of them

---

## 3. Competitive Positioning

### 3.1 The Protocol Landscape

AllSquared Protocol occupies a unique position in the emerging agent commerce stack:

```
┌─────────────────────────────────────────────────────────────────┐
│                     AGENT COMMERCE STACK                         │
├─────────────────────────────────────────────────────────────────┤
│  ORCHESTRATION    SprintForge, CrewAI, LangGraph                │
├─────────────────────────────────────────────────────────────────┤
│  COMMERCE (scoped) AllSquared Protocol ← THE GAP WE FILL       │
├─────────────────────────────────────────────────────────────────┤
│  COMMERCE (simple) ACP (OpenAI/Stripe) — product purchases     │
├─────────────────────────────────────────────────────────────────┤
│  PAYMENTS          x402 (Coinbase) — micropayments              │
├─────────────────────────────────────────────────────────────────┤
│  LEGAL             Accord Project — smart legal templates       │
├─────────────────────────────────────────────────────────────────┤
│  COMMUNICATION     A2A (Google) — agent-to-agent messaging      │
├─────────────────────────────────────────────────────────────────┤
│  SETTLEMENT        Base / Solana / Ethereum — on-chain          │
└─────────────────────────────────────────────────────────────────┘
```

**Why AllSquared Protocol is needed:**

| Protocol | What It Does | What It Doesn't Do |
|----------|-------------|-------------------|
| **A2A** | Agent discovery + communication | Pricing, payments, contracts, reputation |
| **x402** | Instant micropayments per request | Milestones, verification, disputes, SLAs |
| **ACP** | Structured product purchases | Scoped work, ongoing delivery, quality checks |
| **Accord** | Legal contract templates | Agent identity, escrow, reputation scoring |

AllSquared Protocol is the **commercial middleware** that connects all of these into a complete agent commerce experience: discover (A2A) → negotiate → contract (Accord) → fund (x402/ACP) → execute → verify → settle → rate.

### 3.2 Competitive Moats

1. **First mover in agent contracting** — No one else is building scoped-work-with-milestones infrastructure for agents
2. **Network effects** — Agents with AllSquared reputation get more contracts → more data → better matching
3. **Data moat** — Largest dataset of agent performance, reliability, and quality over time
4. **Full-stack ecosystem** — Moltbox (runtime), Moltbook (reputation), SprintForge (orchestration), AllSquared (commerce)
5. **Regulatory advantage** — Already operating in FCA/GDPR/UK-law space; agent commerce will need regulatory frameworks
6. **Shared DNA** — Classic contracts → Protocol contracts migration is trivial; same primitives, different participants

---

## 4. Team & Resource Plan

### Current Team (Month 1-6)

| Role | Person | Focus |
|------|--------|-------|
| **Founder / Full-Stack** | Eli Bernstein | Classic V2 development, Protocol architecture |
| **AI Orchestrator** | Claudia (AutonoLabs) | Strategy, documentation, coordination, QA |

### Planned Hires (Month 6-12)

| Role | When | Cost (Annual) | Why |
|------|------|---------------|-----|
| **Senior Backend Engineer** | Month 6 | £65-80K | Protocol SDK + escrow infrastructure |
| **Frontend/Product Engineer** | Month 8 | £55-70K | Classic V2.1 + Protocol dashboard |
| **DevRel / Community** | Month 10 | £50-60K | Protocol adoption, SDK documentation, A2A community |

### Planned Hires (Month 12-24)

| Role | When | Cost (Annual) | Why |
|------|------|---------------|-----|
| **Smart Contract Engineer** | Month 12 | £70-90K | On-chain escrow, reputation tokens |
| **Product Manager** | Month 14 | £60-75K | Classic + Protocol product strategy |
| **Security Engineer** | Month 16 | £70-85K | Escrow security, agent identity, audit |
| **Business Development** | Month 18 | £55-65K + commission | Enterprise partnerships, agent runtime integrations |

### Advisory / Ecosystem

- **Accord Project** — Potential collaboration on APAI agent contract interface
- **Coinbase Developer Relations** — x402 integration support
- **UK FCA contacts** — Regulatory guidance for agent escrow
- **AutonoLabs agents** — Dogfooding with Moltbox agent fleet

### Total Burn Rate

| Period | Monthly Burn | Funding Source |
|--------|-------------|----------------|
| Month 1-6 | £3-5K | Bootstrap (Eli + AutonoLabs) |
| Month 6-12 | £12-18K | Revenue + Seed (target: £250-500K) |
| Month 12-24 | £30-50K | Revenue + Series A prep |

---

## 5. Financial Projections (24-Month Detail)

### Revenue Waterfall

| Quarter | Classic Subs | Classic Escrow | Protocol API | Protocol Escrow | Protocol Registry | Total |
|---------|-------------|---------------|-------------|----------------|-------------------|-------|
| Q1 2026 | £3,600 | £1,500 | £0 | £0 | £0 | £5,100 |
| Q2 2026 | £12,000 | £5,000 | £0 | £0 | £0 | £17,000 |
| Q3 2026 | £24,000 | £12,000 | £1,500 | £500 | £600 | £38,600 |
| Q4 2026 | £42,000 | £22,000 | £6,000 | £2,000 | £3,000 | £75,000 |
| Q1 2027 | £60,000 | £35,000 | £15,000 | £6,000 | £6,000 | £122,000 |
| Q2 2027 | £80,000 | £50,000 | £30,000 | £12,000 | £10,000 | £182,000 |
| Q3 2027 | £105,000 | £65,000 | £50,000 | £20,000 | £15,000 | £255,000 |
| Q4 2027 | £130,000 | £80,000 | £75,000 | £35,000 | £20,000 | £340,000 |
| **Year 1** | **£81,600** | **£40,500** | **£7,500** | **£2,500** | **£3,600** | **£135,700** |
| **Year 2** | **£375,000** | **£230,000** | **£170,000** | **£73,000** | **£51,000** | **£899,000** |

### Cost Structure

| Category | Month 6 | Month 12 | Month 24 |
|----------|---------|----------|----------|
| **Engineering salaries** | £5,000 | £15,000 | £35,000 |
| **Infrastructure** | £200 | £500 | £2,000 |
| **Stripe/escrow fees** | £100 | £800 | £3,000 |
| **Marketing/CAC** | £500 | £2,000 | £5,000 |
| **Legal/compliance** | £500 | £1,000 | £2,000 |
| **Office/misc** | £300 | £500 | £1,000 |
| **Total Monthly** | **£6,600** | **£19,800** | **£48,000** |

### Path to Profitability

- **Classic breakeven:** Month 8-10 (£5K MRR covers 2-person team)
- **Combined breakeven:** Month 14-16 (£20K MRR covers 5-person team)
- **Cash-flow positive:** Month 18-20 (revenue growth outpaces hiring)

### Funding Strategy

| Round | Amount | Timing | Use of Funds |
|-------|--------|--------|-------------|
| **Bootstrap** | £10K | Months 1-6 | Classic V2 launch, Protocol concept validation |
| **Seed** | £250-500K | Month 6-9 | Hire 3 engineers, Protocol MVP, marketing |
| **Series A** | £2-5M | Month 18-24 | Scale team to 15+, international, enterprise |

**Seed investors:** Target crypto-native VCs who understand protocol plays (a]16z crypto, Paradigm, Framework, Coinbase Ventures) and UK enterprise VCs who understand freelance/GovTech (LocalGlobe, Balderton, Seedcamp).

---

## 6. Risk Analysis

### 6.1 Market Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Agent economy is premature (2-5 years away)** | MEDIUM | HIGH | Classic generates revenue NOW; Protocol is funded by Classic cash flow |
| **A2A doesn't win (different protocol dominates)** | LOW | MEDIUM | Build protocol-agnostic commercial primitives; adapt to any agent communication layer |
| **UK freelance market too crowded** | MEDIUM | MEDIUM | Escrow is the moat; FCA compliance takes 12+ months for competitors to replicate |
| **HoneyBook enters UK** | MEDIUM | MEDIUM | They'd need FCA escrow partnership (12 months) + UK legal templates; we're already there |
| **Big tech builds agent marketplace** | LOW | HIGH | Google/Microsoft would be walled gardens; AllSquared is open/neutral; potential acquisition target |

### 6.2 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Escrow integration delays** | MEDIUM | HIGH | Start Transpact/Riverside partnership Week 2; manual fallback via dashboard |
| **Agent identity/auth at scale** | LOW | MEDIUM | Leverage A2A Agent Cards + AllSquared keypair model; KYA (Know Your Agent) framework |
| **Smart contract vulnerabilities** | LOW | CRITICAL | Professional audit before mainnet; start on Base testnet; bug bounty program |
| **Verification of arbitrary outputs** | MEDIUM | MEDIUM | Start with structured data (schema match); add AI quality scoring iteratively |

### 6.3 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Clients won't deposit into escrow** | MEDIUM | CRITICAL | Client-focused messaging ("only pay for approved work"); test with 10 clients pre-launch |
| **Race to zero on fees** | LOW | MEDIUM | Data moat (reputation), verification quality, full-stack ecosystem create switching costs |
| **Chicken-and-egg (Protocol)** | HIGH | MEDIUM | Bootstrap with Moltbox agents; AutonoLabs controls initial supply; free tier drives adoption |
| **Regulatory uncertainty (agent commerce)** | MEDIUM | MEDIUM | Early engagement with FCA; shape emerging regulations rather than react |

### 6.4 Legal Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Agent contracts not legally enforceable** | MEDIUM | MEDIUM | Contracts bind agent OWNERS (legal entities), not agents themselves; clear terms |
| **Cross-jurisdiction complexity** | HIGH | LOW | Start UK-only; add jurisdictions with legal partnerships |
| **FCA regulatory changes** | LOW | MEDIUM | Maintain close relationship with escrow partner (Transpact/Riverside handles compliance) |

---

## 7. Strategic Milestones

### Phase 1: Classic V2 Launch (March 2026)
- [x] SprintForge review complete (Feb 10)
- [ ] Stripe + escrow integration (Week 2-3)
- [ ] Client dashboard + notifications (Week 4)
- [ ] Beta test with 10 users (Week 5)
- [ ] Public launch (March 24)
- **Success:** 200 signups, 40 paid, £80K escrow GMV in 30 days

### Phase 2: Classic Traction + Protocol Design (April-June 2026)
- [ ] 100 paying Classic customers
- [ ] £2K+ MRR
- [ ] Protocol whitepaper published
- [ ] AllSquared Commercial Extension spec drafted
- [ ] SDK alpha (TypeScript)
- **Success:** Product-market fit for Classic; Protocol spec peer-reviewed

### Phase 3: Protocol MVP + Seed Round (July-September 2026)
- [ ] Protocol MVP: two agents can discover, contract, execute, verify, settle
- [ ] Moltbox integration (auto-register agents)
- [ ] x402 payment support for agent contracts
- [ ] Agent Registry with commercial extensions
- [ ] Seed round closed (£250-500K)
- **Success:** 100+ registered agents; 1K+ agent contracts processed

### Phase 4: Scale (October 2026 - February 2027)
- [ ] On-chain escrow on Base (USDC smart contracts)
- [ ] ACP integration for product-embedded agent purchases
- [ ] Accord Project integration for legal template engine
- [ ] 10K+ agents registered
- [ ] Enterprise partnerships (3+)
- **Success:** £20K+ combined MRR; Protocol showing exponential growth

---

## Appendix A: Key Protocol References

| Protocol | Maintainer | Spec Version | Link |
|----------|-----------|-------------|------|
| A2A | Google / Linux Foundation | v0.2.2 | https://github.com/google/A2A |
| x402 | Coinbase | Production | https://www.x402.org / https://github.com/coinbase/x402 |
| ACP | OpenAI + Stripe | Beta | https://github.com/agentic-commerce-protocol |
| Accord Project | Linux Foundation | TypeScript (2025) | https://accordproject.org |
| Agent Escrow Protocol | Community | Concept | On-chain USDC escrow + reputation |

## Appendix B: AutonoLabs Ecosystem

| Venture | Role in Dual Strategy |
|---------|----------------------|
| **AllSquared** | Commerce layer (contracts, escrow, verification) |
| **Moltbox** | Agent runtime + wallet (where agents live and transact) |
| **Moltbook** | Agent reputation + discovery (LinkedIn for agents) |
| **SprintForge** | Multi-agent orchestration (project management for agent teams) |
| **MintIP** | IP licensing (agents license/sell intellectual property) |

---

*This business plan is a living document. Updated as Classic traction data and Protocol ecosystem signals emerge.*
