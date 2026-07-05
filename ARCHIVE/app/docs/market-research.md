# AllSquared — Market Research
### UK Freelance + Agent Commerce Landscape
**Version:** 2.0 | **Date:** February 2026 | **Author:** Maven (AutonoLabs Strategy)

---

## Executive Summary

AllSquared operates across two converging markets:

1. **UK Freelance Economy** — £33.5B market with 3.8M freelancers; 500K high-value professionals form the £5B serviceable market. Pain is validated (67% late payment), competition is fragmented, and no incumbent offers contracts + escrow in one UK-compliant platform.

2. **Agent Commerce** — $7.6B (2025) agentic AI market growing at 43.8% CAGR to $199B by 2034. Five key protocols are creating the infrastructure layer (A2A, x402, ACP, Accord, Agent Escrow Protocol), but **no protocol addresses scoped work with milestones, quality verification, and dispute resolution between agents**. This is AllSquared Protocol's opportunity.

---

## 1. UK Freelance Market

### 1.1 Market Sizing

| Segment | Population | Annual Revenue | Contract Size | Pain Level |
|---------|-----------|---------------|--------------|------------|
| Digital freelancers (tech, design, marketing) | 2.2M | £15B | £1-25K | HIGH |
| Trade contractors (builders, plumbers, electricians) | 800K | £10B | £5-50K | HIGH |
| Creative professionals (photographers, writers) | 400K | £2B | £500-5K | MEDIUM |
| Business consultants | 300K | £5B | £5-50K | MEDIUM |
| Event professionals | 100K | £1.5B | £1-10K | MEDIUM |
| **Total UK Freelance Market** | **3.8M** | **£33.5B** | | |

*Sources: IPSE 2025, ONS Labour Force Survey 2024-2025, FSB Reports*

**Serviceable Addressable Market (SAM):**
- Filter: Earning £30K+/year, project values £1K+, digitally active, experiencing payment pain
- **SAM: ~500K freelancers = £5B annual contract value**

**Serviceable Obtainable Market (SOM):**
- Year 1: 500 paying customers × £190 ARPU = £95K ARR
- Year 3: 10,000 customers × £250 ARPU = £2.5M ARR
- Year 5: 50,000 customers × £300 ARPU = £15M ARR

### 1.2 Pain Validation

**Primary pain points (validated across r/ContractorUK 80K members, IPSE forums, FSB reports):**

1. **Payment risk** — 67% of UK freelancers experience late or non-payment (IPSE 2025)
2. **Scope creep** — 43% face deliverable disputes without clear contracts
3. **Tool fragmentation** — Average UK freelancer uses 3-4 separate tools (contracts, invoicing, accounting, communications)
4. **Legal cost** — UK solicitors charge £200-500/hour; most freelancers can't afford contract review
5. **IR35 anxiety** — 2021 reforms created ongoing compliance uncertainty

**Willingness to pay (benchmarked):**
- HoneyBook: 100K+ users at $39/month (£31)
- Bonsai: 500K+ users at $21-79/month
- Upwork escrow: Freelancers accept 5-20% platform fees for payment protection
- **Conclusion:** £30/month + 2.5% escrow is well within market tolerance

### 1.3 UK Freelance Competitive Landscape

#### Direct Competitors

| Platform | Country | Contracts | Escrow | UK Law | AI | Price | Users | Threat |
|----------|---------|-----------|--------|--------|-----|-------|-------|--------|
| **HoneyBook** | US | ✅ | ❌ | ❌ | ✅ | £15-62/mo | 100K+ | 🔴 HIGH |
| **Bonsai** | US | ✅ | ❌ | ❌ | ✅ | £16-62/mo | 500K+ | 🟡 MED |
| **AND.CO** (Fiverr) | US | ✅ | ❌ | ❌ | ❌ | £0-19/mo | Unknown | 🟢 LOW |
| **YunoJuno** | UK | ✅ | ❌ | ✅ | ❌ | 5-10% fee | 50K+ | 🟡 MED |
| **IR35 Shield/Qdos** | UK | ❌ | ❌ | ✅ | ❌ | £99-300/yr | 150K+ | 🟢 LOW |
| **Transpact** | UK | ❌ | ✅ | ✅ | ❌ | 0.5-2% + fixed | B2B | 🟢 LOW |
| **Escrow.com** | Global | ❌ | ✅ | ❌ | ❌ | 3.25% | General | 🟢 LOW |

**Key insight:** No platform combines UK-compliant contracts + FCA-regulated escrow + AI generation. AllSquared's moat is the integration of all three, not any single feature.

#### Positioning Matrix

```
                        Payment Protection (Escrow)
                                HIGH
                                 │
                                 │
         Transpact               │           ⭐ AllSquared
         Escrow.com              │           (unique position)
                                 │
    ─────────────────────────────┼─────────────────────────────
                                 │
         YunoJuno                │           HoneyBook
         IR35 Shield             │           Bonsai
         Qdos                    │           AND.CO
                                 │
                                LOW
            UK Compliance ◄──────────────► Full-Stack Features
```

### 1.4 Market Trends

**Tailwinds:**
- 10% YoY freelance growth (ONS)
- Making Tax Digital (MTD) 2026 → digital tool adoption spike
- Post-pandemic remote work normalization
- AI expectations (users expect AI-powered features as baseline)
- FCA innovation enabling startup-scale escrow partnerships

**Headwinds:**
- Economic uncertainty → freelancers cutting subscriptions
- HoneyBook ($250M+ raised) could enter UK
- User education barrier ("why do I need escrow?")
- Two-sided adoption challenge (need both freelancers AND clients)

---

## 2. Agent Commerce Landscape 2026

### 2.1 The Emerging Protocol Stack

The agent economy is being built in layers, each by different organizations. Together they form the infrastructure for autonomous agent commerce:

```
┌────────────────────────────────────────────────────────────┐
│  Layer 5: ORCHESTRATION                                     │
│  SprintForge, CrewAI, LangGraph, AutoGen                    │
│  (Multi-agent coordination and workflow management)          │
├────────────────────────────────────────────────────────────┤
│  Layer 4: COMMERCE — SCOPED WORK                            │
│  ⭐ AllSquared Protocol (the missing layer)                  │
│  (Contracts, milestones, verification, disputes, reputation) │
├────────────────────────────────────────────────────────────┤
│  Layer 3: COMMERCE — STRUCTURED PURCHASES                   │
│  OpenAI + Stripe ACP (Agentic Commerce Protocol)            │
│  (Product purchases, checkout, merchant integration)         │
├────────────────────────────────────────────────────────────┤
│  Layer 2: PAYMENTS                                          │
│  Coinbase x402 (HTTP 402 micropayments)                     │
│  (Pay-per-request, instant stablecoin settlement)            │
├────────────────────────────────────────────────────────────┤
│  Layer 1: LEGAL                                             │
│  Accord Project (Smart Legal Contracts)                     │
│  (Programmable contract templates, APAI agent interface)     │
├────────────────────────────────────────────────────────────┤
│  Layer 0: COMMUNICATION                                     │
│  Google A2A (Agent-to-Agent Protocol)                       │
│  (Agent Cards, task delegation, messaging, artifacts)        │
├────────────────────────────────────────────────────────────┤
│  Settlement: Base / Solana / Ethereum (on-chain)            │
│  USDC / stablecoins for programmable escrow                  │
└────────────────────────────────────────────────────────────┘
```

### 2.2 Protocol Deep Dives

#### Google A2A (Agent-to-Agent Protocol)

| Attribute | Detail |
|-----------|--------|
| **Maintainer** | Google / Linux Foundation |
| **Spec version** | v0.2.2 (early 2025) |
| **Status** | Early adoption; ServiceNow, SAP, Koog integrating |
| **Core concepts** | Agent Cards (JSON identity), Tasks, Messages, Artifacts, Push Notifications |
| **What it provides** | Agent discovery, communication, task lifecycle, status tracking |
| **What it lacks** | Pricing, payments, contracts, reputation, quality verification, dispute resolution |
| **Relevance to AllSquared** | Foundation layer — AllSquared extends Agent Cards with commercial metadata (`x-allsquared` extension) |

**Key technical details:**
- Agent Cards served at `/.well-known/agent-card.json` — JSON documents describing capabilities, skills, endpoints
- Tasks are the primary work unit — created via `message/send`, tracked through lifecycle states
- Messages support structured and unstructured content with parts (text, files, data)
- Artifacts represent deliverables/outputs from completed work
- Push notifications enable real-time status updates via SSE or webhooks

**A2A's commercial gap:**
The spec explicitly states it is "communication-focused" and does not address commerce. From the spec: agents can discover and communicate, but there are no primitives for pricing, SLAs, escrow, or reputation. This is by design — commerce is expected to be built on top.

#### Coinbase x402

| Attribute | Detail |
|-----------|--------|
| **Maintainer** | Coinbase |
| **Status** | Production — live on Base and Solana |
| **Volume** | 75M+ transactions, $24M+ processed |
| **Mechanism** | HTTP 402 Payment Required → client pays → retries with receipt |
| **Settlement** | USDC stablecoins (on-chain, instant) |
| **What it provides** | Pay-per-request micropayments, API monetization, agent-to-agent payments |
| **What it lacks** | Milestones, scoped work, quality verification, disputes, reputation |
| **Relevance** | Payment rail for AllSquared Protocol; agents fund escrow via x402 |

**Key technical details:**
- Server responds with `402 Payment Required` + `PAYMENT-REQUIRED` header containing payment instructions
- Client constructs payment proof (on-chain USDC transfer), includes in `X-PAYMENT` header on retry
- Server verifies payment on-chain, serves resource
- Facilitator servers handle payment verification to offload resource servers
- One-line integration: add middleware to any HTTP server

**x402's scope limitation:**
x402 is brilliant for micropayments ("pay $0.001 per API call") but has no concept of:
- Multi-step work (milestones)
- Quality verification before payment release
- Refunds/disputes
- Contractual obligations or SLAs
- Reputation/trust scoring

AllSquared Protocol uses x402 as a **payment rail** within a larger commercial framework.

#### OpenAI + Stripe ACP (Agentic Commerce Protocol)

| Attribute | Detail |
|-----------|--------|
| **Maintainers** | OpenAI + Stripe |
| **Status** | Beta (production on ChatGPT) |
| **Mechanism** | Agent discovers merchant products → presents to user → checkout via Stripe |
| **What it provides** | Structured product purchases, merchant catalog integration, payment processing |
| **What it lacks** | Service contracts, milestone delivery, ongoing work, quality verification |
| **Relevance** | Complementary — ACP handles product purchases; AllSquared handles service contracts |

**Key technical details:**
- Merchants publish product/service catalogs via ACP-compatible endpoints
- AI agents (e.g., ChatGPT) discover catalogs, present options to users
- Stripe handles payment processing, refunds, merchant payouts
- OpenAI is NOT the merchant of record — commerce happens between buyer and merchant
- Currently supports one-time purchases; subscriptions and "buy for me" background capabilities in roadmap

**ACP's scope limitation:**
ACP is designed for **product purchases** (buy a $49 item). It does not handle:
- "Hire this agent to do work over 2 weeks with 3 milestones"
- Automated quality verification of deliverables
- Escrow with conditional release
- Bilateral rating/reputation

AllSquared Protocol handles the **service economy** that ACP doesn't address.

#### Accord Project (Linux Foundation)

| Attribute | Detail |
|-----------|--------|
| **Maintainer** | Linux Foundation |
| **Status** | Production — TypeScript support (2025), AI playground integration (GSoC 2025) |
| **Mechanism** | Templated smart legal contracts with programmable logic |
| **What it provides** | Legal contract templates, Cicero templating engine, Ergo logic, TypeScript support |
| **What it lacks** | Agent identity, payments, escrow, reputation |
| **Relevance** | Legal template engine for AllSquared's contract generation |

**Key technical details:**
- Contracts are natural language documents with embedded variables (Cicero templates)
- Contract logic is executable (Ergo language, now TypeScript)
- Templates can compute obligations, penalties, payment schedules
- 2025: AI-assisted contract modification via Template Playground
- APAI: Agent-Programmable Agreement Interface (emerging) — allows agents to interact with legal contracts programmatically

**Integration opportunity:**
AllSquared Protocol uses Accord templates as the legal backbone for agent contracts. When two agents negotiate and agree on terms, the resulting contract is an Accord-compatible smart legal contract that is:
- Human-readable (for agent owners)
- Machine-executable (for automated milestone tracking)
- Legally binding (between agent owner entities)

#### Agent Escrow Protocol (On-Chain)

| Attribute | Detail |
|-----------|--------|
| **Status** | Conceptual / early implementation |
| **Mechanism** | USDC escrow smart contracts on Base with reputation scoring |
| **Settlement** | On-chain (Base L2 on Ethereum) |
| **What it provides** | Programmable escrow, conditional release, reputation tokens |
| **What it lacks** | Agent discovery, negotiation, contract generation, off-chain integration |
| **Relevance** | On-chain settlement layer for AllSquared Protocol's escrow |

**Key concepts:**
- Escrow contracts hold USDC until release conditions are met
- Conditions can be: milestone approval, time-based auto-release, oracle verification, multi-sig
- Reputation is tracked as on-chain attestations (soulbound tokens or EAS attestations)
- Dispute resolution can involve multi-sig arbitration or DAO governance
- Base L2 provides low fees ($0.001-0.01 per transaction) suitable for micro-escrow

### 2.3 Protocol Comparison Table

| Dimension | A2A | x402 | ACP | Accord | Agent Escrow | AllSquared Protocol |
|-----------|-----|------|-----|--------|-------------|-------------------|
| **Agent discovery** | ✅ Agent Cards | ❌ | ❌ | ❌ | ❌ | ✅ Registry + Cards |
| **Communication** | ✅ Messages/Tasks | ❌ | ❌ | ❌ | ❌ | ✅ (via A2A) |
| **Pricing/negotiation** | ❌ | ❌ | ✅ Catalogs | ❌ | ❌ | ✅ Dynamic pricing |
| **Contracts/SLAs** | ❌ | ❌ | ❌ | ✅ Templates | ❌ | ✅ Machine-readable |
| **Micropayments** | ❌ | ✅ HTTP 402 | ❌ | ❌ | ❌ | ✅ (via x402) |
| **Structured purchases** | ❌ | ❌ | ✅ Checkout | ❌ | ❌ | ✅ (via ACP) |
| **Milestone payments** | ❌ | ❌ | ❌ | ❌ | Partial | ✅ Full lifecycle |
| **Escrow** | ❌ | ❌ | ❌ | ❌ | ✅ On-chain | ✅ Fiat + on-chain |
| **Quality verification** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Automated + AI |
| **Dispute resolution** | ❌ | ❌ | Stripe disputes | ❌ | Multi-sig | ✅ AI + human + on-chain |
| **Reputation** | ❌ | ❌ | ❌ | ❌ | ✅ On-chain | ✅ Cross-platform |
| **Legal enforceability** | ❌ | ❌ | Via Stripe ToS | ✅ Legal templates | Smart contract | ✅ Legal + smart contract |
| **Production status** | Early | ✅ Live | Beta | ✅ Live | Concept | Planned Q3 2026 |

### 2.4 Agent Commerce Market Sizing

**Global Agentic AI Market:**

| Year | Market Size | Growth | Source |
|------|------------|--------|--------|
| 2025 | $7.6B | — | Precedence Research, Grand View Research |
| 2026 | $10.9B | 43.8% | Precedence Research |
| 2028 | $22.5B | 43.8% CAGR | Projected |
| 2030 | $47B | 43.8% CAGR | Projected |
| 2034 | $199B | 43.8% CAGR | Precedence Research |

**Agent Commerce Subset:**

We define "agent commerce" as transactions where at least one party is an autonomous AI agent (agent-to-agent or agent-to-service).

| Metric | 2026 | 2028 | 2030 | 2034 |
|--------|------|------|------|------|
| **Agent Commerce TAM** (5-10% of agentic AI) | $550M-1.1B | $1.1-2.3B | $2.4-4.7B | $10-20B |
| **Agent Contracting SAM** (infrastructure layer) | $50-100M | $200-400M | $500M-1B | $2-4B |
| **AllSquared Protocol SOM** | $200K | $2M | $10M | $50M |

**TAM/SAM/SOM rationale:**
- **TAM:** The total addressable market is all agent commercial transactions — API calls, data processing, content generation, analysis, etc. We estimate 5-10% of the total agentic AI market involves billable inter-agent work (conservative).
- **SAM:** The serviceable market is the infrastructure layer (platforms enabling agent contracting, not the agents themselves). Comparable to what Stripe captures vs total e-commerce.
- **SOM:** AllSquared's obtainable share assumes first-mover advantage in the "scoped work" niche, growing with ecosystem adoption.

### 2.5 Competitive Analysis — Agent Commerce

**Who else is building agent-to-agent contracting?**

| Player | What They Do | Agent Contracting? | Threat Level |
|--------|-------------|-------------------|-------------|
| **Fetch.ai** | Decentralized agent network | Agent marketplace (general) | 🟡 MEDIUM |
| **SingularityNET** | AI marketplace | Service marketplace | 🟡 MEDIUM |
| **Morpheus** | Decentralized AI agents | Compute marketplace | 🟢 LOW |
| **Virtuals Protocol** | Agent token launchpad | Entertainment agents | 🟢 LOW |
| **Autonolas (Olas)** | Autonomous agent services | Agent composition | 🟡 MEDIUM |
| **Google (via A2A)** | Agent communication protocol | No (communication only) | 🟢 LOW (enabler) |
| **Coinbase (via x402)** | Payment protocol | No (payments only) | 🟢 LOW (enabler) |
| **OpenAI/Stripe (via ACP)** | Purchase protocol | No (products only) | 🟢 LOW (enabler) |

**Key insight:** Existing players either build general AI marketplaces (Fetch.ai, SingularityNET) or crypto-native compute networks (Morpheus). **None are building the contracting infrastructure** — milestones, SLAs, quality verification, dispute resolution — that makes professional agent commerce trustworthy.

**AllSquared Protocol differentiates by:**
1. Building on established protocols (A2A, x402, ACP, Accord) rather than creating a new silo
2. Offering both fiat and crypto settlement (not crypto-only)
3. Providing legal enforceability (Accord-backed contracts) not just smart contracts
4. Including human escalation paths (LITL) — critical for enterprise adoption
5. Having production experience from Classic (real escrow, real contracts, real disputes)

---

## 3. Key Market Insights

### 3.1 The Convergence Thesis

Human freelancing and agent commerce are **converging**. The same problems exist in both:

| Problem | Human Freelancing | Agent Commerce |
|---------|------------------|---------------|
| **Trust** | "Will this freelancer deliver?" | "Will this agent produce quality output?" |
| **Payment** | "Will this client pay?" | "Will funds be released after verification?" |
| **Scope** | "What exactly was agreed?" | "What are the input/output specs?" |
| **Quality** | "Is this deliverable good enough?" | "Does output match the validation schema?" |
| **Disputes** | "We disagree on quality" | "Verification failed — who's at fault?" |
| **Reputation** | "Is this freelancer reliable?" | "What's this agent's completion rate?" |

AllSquared solves these identically for both — same contract engine, same escrow logic, same dispute resolution, same reputation system. Different participants.

### 3.2 Protocol Timing

The agent commerce ecosystem is at an inflection point:

- **A2A** (2024-2025): Communication layer stabilizing. ServiceNow, SAP, Google Cloud adopting.
- **x402** (2025): Payment layer live with 75M+ transactions. Production-proven.
- **ACP** (2025): Purchase layer in beta on ChatGPT. Stripe integration live.
- **Accord** (2025): Legal layer mature with TypeScript support and AI integration.
- **AllSquared Protocol** (2026): Commercial layer — **the missing piece**.

**The window is NOW.** The communication and payment layers are stabilizing. The commercial layer (contracts, escrow, verification, reputation) hasn't been claimed. First mover advantage is significant because:
1. Network effects compound (agents with reputation get more work)
2. Data moats grow (agent performance data improves matching)
3. Protocol standards solidify (early entrants shape the spec)

### 3.3 Market Entry Strategy

**Classic (immediate):**
- UK freelancers via r/ContractorUK, IPSE, LinkedIn
- Escrow-first positioning
- 50/50 freelancer/client GTM
- Community-driven, low-CAC acquisition

**Protocol (Q3 2026):**
- Open-source SDK drives developer adoption (similar to Stripe's developer-first playbook)
- Bootstrap marketplace with Moltbox agents (AutonoLabs controls initial supply)
- Partner with A2A ecosystem companies (ServiceNow, SAP agents)
- Thought leadership: "The Agent Economy Needs Contract Law" — blog posts, conference talks, A2A working group participation

---

## 4. Data Sources

| Source | Used For |
|--------|---------|
| IPSE (Independent Professionals & Self-Employed Association) | UK freelance statistics 2025 |
| ONS Labour Force Survey 2024-2025 | Self-employment growth data |
| FSB (Federation of Small Businesses) | Late payment reports |
| r/ContractorUK (80K members) | Pain point validation |
| Precedence Research | Agentic AI market sizing ($7.6B → $199B) |
| Grand View Research | AI agents market ($7.63B → $183B) |
| DemandSage | US AI agents market data |
| Google A2A spec v0.2.2 | Protocol capabilities assessment |
| Coinbase x402 GitHub / docs.cdp.coinbase.com | x402 protocol details |
| OpenAI Commerce Developers / Stripe Blog | ACP specification |
| Accord Project docs / GitHub | Smart legal contract capabilities |
| CryptoSlate (Dec 2025) | x402 volume data (75M+ txns) |
| Competitor websites (Feb 2026) | Pricing and feature comparison |
| Capterra/G2 reviews | User sentiment for HoneyBook, Bonsai, YunoJuno |

---

*Market research complete. The dual-strategy thesis is validated: Classic addresses a proven £5B market with real pain, while Protocol targets the emerging $550M+ agent commerce gap that no protocol currently fills.*
