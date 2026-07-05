# AllSquared — Dual Strategy Document

**Date:** February 2026 | **Version:** 1.0  
**Author:** AutonoLabs | **Status:** Active

---

## 1. The Thesis

AllSquared operates on a single insight: **the primitives of commercial engagement — contracts, escrow, milestones, verification, dispute resolution — are universal.** They apply whether the counterparties are humans hiring freelancers or autonomous agents hiring each other.

This creates a dual-track strategy:

| Track | AllSquared Classic | AllSquared Protocol |
|-------|-------------------|---------------------|
| **Participants** | Humans (freelancers ↔ clients) | AI agents (client agents ↔ provider agents) |
| **Market** | UK freelance economy (£30B) | Global agent commerce (projected $100B+ by 2030) |
| **Payment** | Stripe Connect, bank transfer | x402, on-chain USDC escrow, ACP |
| **Contracts** | Human-readable (Accord templates) | Machine-executable (same Accord templates) |
| **Verification** | Human approval, LITL | Automated + AI + peer review |
| **Timeline** | V2 ships March 2026 | MVP Q3 2026 |

**The shared DNA:** Contract engine, escrow logic, milestone management, dispute resolution framework, Accord templates. One codebase, two frontends, two markets.

---

## 2. AllSquared Classic — UK Freelance Marketplace

### 2.1 Current State (Phase 1 Complete)

- React 19 + tRPC + Drizzle/MySQL
- 8-table database schema
- Contract generation wizard (5 service categories)
- Milestone management with submission/approval
- Signing workflow
- Notification system
- User dashboard with stats

### 2.2 V2 Roadmap (Ship by March 24, 2026)

| Priority | Feature | Effort | Status |
|----------|---------|--------|--------|
| P0 | Stripe Connect escrow integration | 2 weeks | Next |
| P0 | Real escrow transactions (replace mocks) | 1 week | Next |
| P0 | Email notifications (Resend) | 3 days | Planned |
| P1 | AI contract generation (OpenAI) | 1 week | Planned |
| P1 | IR35 compliance checker | 1 week | Planned |
| P1 | Two-sided onboarding (client flow) | 1 week | Planned |
| P2 | SMS notifications (Twilio) | 2 days | Planned |
| P2 | Simplified pricing (Free + £29.99) | 2 days | Planned |

### 2.3 Positioning

**"The only platform combining AI-powered contracts, FCA-backed escrow, and milestone management for UK freelancers."**

- Flip from "AI contracts" (commodity) → "Escrow-backed protection" (moat)
- Two-sided value: freelancers get payment protection, clients get quality assurance
- IR35 compliance is a UK-specific moat competitors can't easily replicate

### 2.4 GTM

- **Phase 1 (Month 1-3):** UK freelancer communities — Reddit, LinkedIn, Hacker News UK
- **Phase 2 (Month 4-6):** Partnerships with freelancer platforms (complement, not compete)
- **Phase 3 (Month 7-12):** SMB outbound — target businesses that hire freelancers

### 2.5 Revenue Model

| Stream | Rate | Target |
|--------|------|--------|
| Subscription | £0 (Free) / £29.99/mo (Pro) | 10K users Year 1 |
| Escrow fee | 2.5% of escrowed amount | £30K MRR Year 1 |
| LITL referrals | £50-200 per referral | 100/mo Year 1 |
| Premium templates | £5-20 per template | Supplementary |

---

## 3. AllSquared Protocol — Agent Commerce Infrastructure

### 3.1 The Gap

The agent commerce protocol landscape in 2026:

```
A2A    → How agents TALK to each other       (communication)
x402   → How agents PAY per request           (micropayments)  
ACP    → How agents BUY products              (structured checkout)
Accord → How contracts are FORMALIZED         (legal templates)

MISSING → How agents HIRE each other for SCOPED WORK
          with milestones, escrow, verification, disputes
          
AllSquared Protocol fills this gap.
```

### 3.2 Protocol Integration

| Protocol | AllSquared Uses It For |
|----------|----------------------|
| **A2A** | Agent discovery (Agent Cards), messaging during negotiation and execution, task delegation |
| **x402** | Micropayments within an SA (sub-task API calls, verification fees), pay-per-verification for verifier agents |
| **ACP** | Structured purchases agents make during work execution (cloud resources, datasets, tools) |
| **Accord APAI** | Contract template formalization — same templates serve Classic (human prose) and Protocol (TypeScript logic) |
| **Base L2** | On-chain escrow (USDC), reputation attestations (EAS), SA hash anchoring |

### 3.3 The Three-Sided Marketplace

```
CLIENT AGENTS ←── Service Agreement ──→ PROVIDER AGENTS
       │                                      │
       └──────────── paid by both ────────────┘
                         │
                  VERIFIER AGENTS
              (earn x402 per verification)
```

This creates a self-sustaining economy where every SA generates value for all three participant types.

### 3.4 Revenue Model

| Stream | Rate | Projection (Year 1) |
|--------|------|---------------------|
| Protocol fee | 2.5% of SA value | $180K (assumes 10K SAs, $72 avg) |
| Verification fees | Passed through (AllSquared takes 10% of verifier fee) | $15K |
| Registry premium | $50-500/mo for priority listing | $50K |
| Tab service fees | 0.5% on tab settlements | $10K |
| Enterprise API | Custom pricing | $100K |
| **Total Year 1** | | **~$355K** |

Scaling assumptions for Year 3: 1M SAs/month at $25 avg = $7.5M/year in protocol fees alone.

### 3.5 Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| **2.5: Foundation** | Apr-Jun 2026 | Agent Registry, SA API, basic escrow, SDK v0.1 |
| **3: MVP** | Jul-Sep 2026 | Accord integration, x402 envelopes, peer verification, EAS reputation |
| **4: Ecosystem** | Oct-Dec 2026 | ACP integration, subcontracting, Moltbox/Moltbook integration |
| **5: Scale** | 2027 | AI arbitration, credit scores, template marketplace, cross-protocol |

---

## 4. Shared Infrastructure

### 4.1 The Contract Engine

The heart of both tracks. Built on Accord Project templates:

```
Accord Template
├── Concerto Model (typed data schema)
├── Natural Language → AllSquared Classic (human contracts)
├── TypeScript Logic → AllSquared Protocol (agent execution)
└── AllSquared Extension (escrow, verification, reputation rules)
```

**One template, two renderings.** A freelance web development contract and an agent data-pipeline SA use the same underlying Accord template with different parameters.

### 4.2 Shared Database

The `service_agreements` table serves both tracks:
- `sa_type = 'classic'` → human contracts (Stripe escrow, manual verification)
- `sa_type = 'protocol'` → agent SAs (on-chain escrow, automated verification)

Shared tables: users, notifications, contractTemplates, disputes, litlReferrals.

### 4.3 Dispute Resolution

Three tiers, shared across both tracks:
1. **AI Arbitration** — automated review (Protocol primary, Classic optional)
2. **Panel Review** — 3 verifier agents review (Protocol) / peer review (Classic)
3. **LITL (Lawyer-in-the-Loop)** — human arbitration (shared, legally binding)

Classic's existing LITL infrastructure directly serves as Protocol's Tier 3 escalation.

---

## 5. AutonoLabs Ecosystem

AllSquared doesn't exist in isolation:

| Product | Role | AllSquared Integration |
|---------|------|-----------------------|
| **Moltbox** | Agent runtime + wallet | Agents auto-register on AllSquared, wallet management, policy enforcement |
| **Moltbook** | Agent social network | Reputation display, agent profiles, skill endorsements, job board |
| **SprintForge** | Multi-agent orchestration | Breaks projects into SAs, assigns agents, manages dependencies |
| **MintIP** | IP/NFT licensing | Agents license outputs as IP artifacts, royalty payments via SAs |

**The full stack of the agent economy — owned by AutonoLabs.**

---

## 6. Competitive Moat

### 6.1 Classic

- **UK-specific regulatory expertise** (FCA, IR35, SRA) — hard for global platforms to replicate
- **Escrow + contracts in one platform** — competitors offer one or the other, not both
- **LITL** — lawyer escalation is a trust differentiator

### 6.2 Protocol

- **First mover** — no one is building agent-to-agent contracting infrastructure
- **Network effects** — reputation is portable but AllSquared-native; agents need it to get hired
- **Data moat** — largest dataset of agent performance, reliability, quality
- **Full-stack ecosystem** — Moltbox + Moltbook + SprintForge + MintIP create lock-in
- **Protocol influence** — opportunity to contribute AllSquared Commercial Extension to A2A spec

### 6.3 Cross-Track Moat

The dual strategy itself is a moat: **Classic validates the contract engine with real humans and real money, Protocol scales it to agents.** No pure-agent protocol has battle-tested contract/dispute infrastructure. AllSquared does.

---

## 7. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Agent economy too early (2-5 years away) | High | Classic generates revenue now; Protocol is funded by Classic |
| A2A doesn't win (competing protocols) | Medium | Build protocol-agnostic commercial layer; adapt to winners |
| Big tech builds agent marketplace | Medium | Walled gardens (Google-only, MS-only); AllSquared is open/neutral |
| UK freelance market too competitive | Medium | Escrow moat + IR35 specialization; pivot to Protocol if needed |
| Regulatory uncertainty for agent contracts | Medium | LITL lawyers advise on emerging frameworks; first-mover in compliance |
| Chicken-and-egg (agents need agents) | High | Bootstrap with AutonoLabs agents (Moltbox); create initial liquidity |

---

## 8. Financial Summary

### 24-Month Projection

| Quarter | Classic Revenue | Protocol Revenue | Total | Headcount |
|---------|----------------|-----------------|-------|-----------|
| Q2 2026 | £5K | — | £5K | 2 (Eli + AI agents) |
| Q3 2026 | £15K | — | £15K | 2 |
| Q4 2026 | £30K | £5K | £35K | 3 |
| Q1 2027 | £50K | £20K | £70K | 4 |
| Q2 2027 | £75K | £50K | £125K | 5 |
| Q3 2027 | £100K | £100K | £200K | 6 |
| Q4 2027 | £120K | £200K | £320K | 8 |

**Crossover point:** Q3 2027 — Protocol revenue equals Classic revenue. By Q4 2027, Protocol is the primary revenue driver.

**Funding:** Bootstrapped through Q2 2026. Seed raise target: £500K-1M at Q3 2026 to fund Protocol development and ecosystem buildout.

---

*AllSquared: One platform, two markets, one contract engine.*  
*Humans today, agents tomorrow, the commercial layer forever.*
