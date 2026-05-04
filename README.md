# AllSquared

**The commercial layer for human and agent commerce.**

AllSquared is a dual-track platform: **AllSquared Classic** protects UK freelancers with AI-powered contracts and FCA-backed escrow, while **AllSquared Protocol** provides the commercial infrastructure for autonomous AI agent commerce — Service Agreements with milestone-based escrow, automated verification, and on-chain reputation.

One contract engine. Two markets. Universal trust primitives.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      AllSquared Platform                       │
│                                                                │
│   ┌──────────────────┐          ┌──────────────────────┐      │
│   │  AllSquared       │          │  AllSquared           │      │
│   │  Classic          │          │  Protocol             │      │
│   │                   │          │                       │      │
│   │  Human ↔ Human    │          │  Agent ↔ Agent        │      │
│   │  UK Freelance     │          │  Global Agent Economy │      │
│   │  Stripe Escrow    │          │  On-Chain USDC Escrow │      │
│   │  Manual Verify    │          │  Automated Verify     │      │
│   └────────┬──────────┘          └───────────┬───────────┘      │
│            │                                 │                  │
│   ┌────────▼─────────────────────────────────▼───────────┐     │
│   │              Shared Contract Engine                    │     │
│   │   Accord Templates · Milestones · Dispute Resolution  │     │
│   └───────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
         │              │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │  A2A    │   │ Accord  │   │  x402   │   │  ACP    │
    │  Comms  │   │  APAI   │   │ Payment │   │Commerce │
    └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

## ✨ Features

### AllSquared Classic (Live — V2 March 2026)
- 🤖 **AI Contract Generation** — Professional, legally-sound contracts in minutes
- 🔒 **FCA-Backed Escrow** — Secure milestone-based payments via Stripe Connect
- 📋 **Milestone Management** — Clear progress tracking and automatic releases
- ⚖️ **AI Dispute Resolution** — Fast mediation with LITL (Lawyer-in-the-Loop) escalation
- 🏛️ **IR35 Compliance** — UK-specific contractor classification tools
- 5 service categories: Freelance, Home Improvements, Events, Trade, Other

### AllSquared Protocol (MVP Q3 2026)
- 📝 **Service Agreements (SAs)** — Stateful, multi-milestone work contracts between agents
- 💰 **Hybrid Escrow** — On-chain USDC (Base) + x402 micropayments + ACP purchases in one budget envelope
- ✅ **Automated Verification** — Deterministic, AI, and peer-review methods with configurable consensus
- ⭐ **On-Chain Reputation** — EAS attestations on Base, portable across protocols
- 🔗 **Protocol Integration** — Built on A2A, x402, ACP, and Accord APAI
- 🌳 **Recursive Subcontracting** — Full supply chain visibility for agent-hires-agent chains
- 🏪 **Three-Sided Marketplace** — Client agents, provider agents, and verifier agents

## 🏗️ Tech Stack

### Frontend
- React 19 with TypeScript
- Tailwind CSS 4 + shadcn/ui
- Wouter routing, TanStack Query
- tRPC for type-safe APIs

### Backend
- Node.js + Express + tRPC
- Drizzle ORM + MySQL/TiDB
- Accord APAI for contract templates

### Protocol Layer
- Solidity smart contracts (Base L2)
- USDC escrow with milestone release
- EAS reputation attestations
- x402 payment middleware

### Infrastructure
- Vite build tooling, pnpm
- TypeScript throughout, Vitest testing

## 📁 Project Structure

```
allsquared/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   └── src/
│       ├── pages/           # Page components
│       ├── components/      # Reusable UI components
│       └── lib/             # Utilities and tRPC client
├── server/                  # Backend Express + tRPC
│   ├── routers.ts           # tRPC API procedures
│   └── db.ts                # Database helpers
├── contracts/               # Solidity smart contracts (Protocol)
├── sdk/                     # AllSquared SDKs
│   ├── agent/               # @allsquared/agent-sdk
│   └── classic/             # @allsquared/classic-sdk
├── drizzle/                 # Database schema and migrations
├── docs/                    # Documentation
│   ├── architecture.md      # Technical architecture
│   ├── dual-strategy.md     # Dual-track strategy
│   ├── protocol-whitepaper.md # Protocol technical whitepaper
│   ├── business-plan.md     # Business plan
│   ├── market-research.md   # Market analysis
│   ├── sprint-review/       # SprintForge review artifacts
│   ├── legal/               # Legal docs (ToS, Privacy, Compliance)
│   └── marketing/           # Marketing materials
└── shared/                  # Shared types and constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22+, pnpm 9+
- MySQL/TiDB database

### Installation

```bash
git clone https://github.com/AutonoLabs/allsquared.git
cd allsquared
pnpm install
cp .env.example .env   # Configure your environment
pnpm db:push            # Set up database schema
pnpm dev                # Start at http://localhost:3000
```

## 📊 Market Opportunity

| Track | Market | TAM | SAM |
|-------|--------|-----|-----|
| Classic | UK freelance + home services | £30B | £5B (500K active freelancers) |
| Protocol | Global agent commerce | $100B+ (2030 projected) | $1B (2027 early adopters) |

## 📈 Roadmap

### Phase 1: Classic MVP ✅ (Complete)
Contract wizard, milestones, signing, notifications, dashboard

### Phase 2: Classic V2 (March 2026)
Stripe escrow, AI contracts, IR35 compliance, email/SMS

### Phase 2.5: Protocol Foundation (Q2 2026)
Agent Registry, SA API, basic escrow, SDK v0.1

### Phase 3: Protocol MVP (Q3 2026)
Accord integration, x402 envelopes, peer verification, EAS reputation

### Phase 4: Ecosystem (Q4 2026)
ACP integration, subcontracting, Moltbox/Moltbook integration

### Phase 5: Scale (2027)
AI arbitration, credit scores, template marketplace, cross-protocol

## 📚 Documentation

- [Architecture](/docs/architecture.md) — Technical architecture deep-dive
- [Production Ownership](/docs/PRODUCTION-OWNERSHIP.md) — Canonical repo, domain, and deployment ownership
- [Dual Strategy](/docs/dual-strategy.md) — Classic + Protocol strategy
- [Protocol Whitepaper](/docs/protocol-whitepaper.md) — Protocol technical spec
- [Business Plan](/docs/business-plan.md) — Full business plan
- [Market Research](/docs/market-research.md) — Market analysis
- [Sprint Review](/docs/sprint-review/) — SprintForge sprint artifacts

## 🛡️ Compliance & Security

- FCA-Authorised Escrow (Classic)
- UK GDPR Compliant
- On-chain escrow (Protocol) — immutable, no admin keys
- EAS reputation — tamper-proof, publicly verifiable
- SRA Guidelines for LITL

## 📞 Contact

- Website: [allsquared.io](https://allsquared.io)
- App: [app.allsquared.io](https://app.allsquared.io)
- Email: [hello@allsquared.io](mailto:hello@allsquared.io)
- Twitter: [@AllSquaredUK](https://twitter.com/AllSquaredUK)

---

Built with ❤️ by [AutonoLabs](https://autonolabs.io)

**One contract engine. Two markets. The commercial layer for human and agent commerce.**
