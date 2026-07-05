# AllSquared A2A — Technical Architecture

**Date:** 2026-02-12  
**Status:** Draft  

## Key Decisions (Eli — 2026-02-12)

| Decision | Choice | Notes |
|----------|--------|-------|
| **Repo structure** | Monorepo | SDK + server + demo in one repo |
| **Open source** | Yes, eventually | Keep private until reviewed by **Corrado Fiore** |
| **Approach** | Spec-first | Finalize spec before building |
| **Demo format** | Mini web UI | Investor/demo-ready visual interface |

---

## 1. The Pivot: Human Platform → Agent Commerce Layer

AllSquared v1 is a UK freelancing platform (contracts, milestones, escrow, Clerk auth, PostgreSQL, Express, React). The pivot doesn't throw this away — it **extends** it.

### What we keep:
- Express server + API structure
- PostgreSQL database (Vercel Postgres)
- Clerk auth (for agent *owners*, not agents themselves)
- Contract primitives (contracts, milestones tables)
- Escrow concepts (fund → hold → release)
- React dashboard (becomes agent owner dashboard)

### What we add:
- Agent identity layer (separate from user auth)
- A2A protocol integration
- Commercial extension to Agent Cards
- Machine-readable contracts with cryptographic signing
- Automated verification engine
- Reputation system
- Agent SDK

### What changes:
- Contracts become machine-generated (not wizard-created)
- Milestones have automated verification (not human approval)
- Payments start as credits (real money in Phase 2)
- Users become "agent owners" — they register and manage agents, not themselves

---

## 2. Database Architecture

### Existing Tables (kept, extended)

```
users                    → Agent owners (human users via Clerk)
contracts                → Extended with agent-specific fields
milestones               → Extended with verification methods
escrowTransactions       → Extended for credit-based escrow
```

### New Tables

```
agent_identities         → Agent profiles (name, keys, wallet, reputation)
agent_skills             → Skills with commercial pricing
agent_contracts          → Agent-to-agent contracts (new lifecycle)
agent_milestones         → Milestones with auto-verification
negotiations             → Negotiation message history
verification_results     → Verification pass/fail records
reputation_events        → Rating events
agent_ratings            → Mutual ratings per contract
```

### Entity Relationship

```
users (Clerk)
  └── agent_identities (1:N — one user can own many agents)
        ├── agent_skills (1:N — each agent has many skills)
        ├── agent_contracts (as client or provider)
        │     ├── agent_milestones (1:N)
        │     │     └── verification_results (1:N)
        │     ├── negotiations (1:N)
        │     └── agent_ratings (2 per contract — mutual)
        └── reputation_events (1:N)
```

---

## 3. API Architecture

### Existing API (v1 — human platform)
```
/api/contracts/*         → Human contract CRUD
/api/milestones/*        → Human milestone management  
/api/escrow/*            → Escrow operations
/api/users/*             → User profiles
```

### New API (v2 — agent commerce)
```
/api/v1/agents/          → Agent registry & identity
/api/v1/agents/:id/card  → A2A Agent Card generation
/api/v1/agents/search    → Capability-based registry search
/api/v1/contracts/       → Agent-to-agent contracts
/api/v1/contracts/rfp    → Request for proposal
/api/v1/verification/    → Verification operations
/api/v1/reputation/      → Ratings and reputation
```

### Authentication (Dual-Layer)

```
Human (agent owner):  Clerk JWT → access dashboard, manage agents
Agent (programmatic): API key (as_key_xxx) → SDK operations, contract execution
```

Agent API keys are generated when an agent is registered. Scoped to:
- The agent's own operations
- The agent owner's budget limits
- The agent's registered capabilities

---

## 4. Contract State Machine

```
                  ┌──────────────────────────────────┐
                  │                                  │
    ┌─────┐    ┌─▼──────┐    ┌────────────┐    ┌───┴─────┐
    │DRAFT├───►│PROPOSED├───►│NEGOTIATING ├───►│AGREED   │
    └─────┘    └────────┘    └──────┬─────┘    └────┬────┘
                                    │               │
                              ┌─────▼───┐     ┌─────▼────┐
                              │REJECTED │     │FUNDED    │
                              └─────────┘     └─────┬────┘
                                                    │
                                              ┌─────▼────┐
                                              │ACTIVE    │
                                              └─────┬────┘
                                                    │
                                    ┌───────────────┼───────────────┐
                                    │               │               │
                              ┌─────▼────┐   ┌─────▼────┐   ┌─────▼────┐
                              │VERIFYING │   │DISPUTED  │   │CANCELLED │
                              └─────┬────┘   └──────────┘   └──────────┘
                                    │
                              ┌─────▼────┐
                              │SETTLED   │
                              └─────┬────┘
                                    │
                              ┌─────▼────┐
                              │CLOSED    │
                              └──────────┘
```

### State Transitions

| From | To | Trigger | Validation |
|------|----|---------|-----------|
| — | DRAFT | Contract created | Client agent exists |
| DRAFT | PROPOSED | Terms sent to provider | Provider agent exists |
| PROPOSED | NEGOTIATING | Counter-offer | Within negotiation limits |
| PROPOSED | AGREED | Provider accepts | Terms within provider's pricing rules |
| NEGOTIATING | AGREED | Both accept | Terms signed by both |
| NEGOTIATING | REJECTED | Either rejects | — |
| AGREED | FUNDED | Client funds escrow | Sufficient wallet balance |
| FUNDED | ACTIVE | Execution starts | A2A task created |
| ACTIVE | VERIFYING | Artifact submitted | Artifact matches expected format |
| VERIFYING | SETTLED | Verification passes | All milestones verified |
| VERIFYING | ACTIVE | Verification fails (retryable) | Retries remaining |
| ACTIVE | DISPUTED | Either party disputes | Dispute reason provided |
| ACTIVE | CANCELLED | Mutual cancellation | Both parties agree |
| SETTLED | CLOSED | Ratings submitted | Both ratings received (or timeout) |

---

## 5. Verification Architecture

### Verification Pipeline

```
Artifact submitted
       │
       ▼
┌──────────────┐
│ Format Check  │  → Is it valid JSON/CSV/etc?
└──────┬───────┘
       │ pass
       ▼
┌──────────────┐
│ Schema Match  │  → Does it match the contract's output_schema?
└──────┬───────┘
       │ pass
       ▼
┌──────────────┐
│ Completeness  │  → All required fields present? No unexpected nulls?
└──────┬───────┘
       │ pass
       ▼
┌──────────────┐
│ Quality Score │  → (Phase 2: AI-powered quality assessment)
└──────┬───────┘
       │ pass
       ▼
  ✅ VERIFIED → Release escrow
```

### Verification Methods (Phase 1)

```typescript
interface VerificationMethod {
  name: string;
  verify(artifact: any, config: any): Promise<VerificationResult>;
}

interface VerificationResult {
  passed: boolean;
  score: number;        // 0.0 - 1.0
  method: string;
  details: {
    checks: Array<{
      name: string;
      passed: boolean;
      message?: string;
    }>;
  };
}

// Phase 1 methods:
class SchemaMatchVerifier implements VerificationMethod { ... }
class CompletenessVerifier implements VerificationMethod { ... }
class RowCountVerifier implements VerificationMethod { ... }

// Phase 2 methods:
class AIQualityVerifier implements VerificationMethod { ... }
class PeerReviewVerifier implements VerificationMethod { ... }
class HumanReviewVerifier implements VerificationMethod { ... }
```

---

## 6. Reputation Algorithm

### Score Calculation

```
R(agent) = Σ(r_i × w_i × d_i) / Σ(w_i × d_i)

where:
  r_i = rating from contract i (1.0 - 5.0)
  w_i = weight = log₂(contract_value_i + 1)
  d_i = decay = e^(-0.01 × age_in_days_i)
```

### Properties:
- **Recent contracts matter more** — 70% weight within last 70 days
- **Larger contracts matter more** — logarithmic scaling prevents gaming
- **New agents start at 0** — no reputation until first completed contract
- **Both parties rate** — prevents one-sided reputation manipulation

### Anti-Gaming:
- Can't rate without completing a verified contract
- Self-dealing detection (same owner on both sides)
- Minimum contract value for rating weight
- Outlier detection (sudden rating drops flagged for review)

---

## 7. SDK Architecture

```
@allsquared/agent-sdk
├── AllSquaredClient         # Main entry point
│   ├── .registry            # RegistryClient
│   │   ├── register()       # Register agent identity
│   │   ├── registerSkill()  # Add skill with pricing
│   │   ├── search()         # Search for agents by capability
│   │   └── getCard()        # Get A2A Agent Card
│   ├── .contracts           # ContractClient
│   │   ├── hire()           # Create contract (instant flow)
│   │   ├── rfp()            # Send RFP (negotiation flow)
│   │   ├── propose()        # Respond to RFP
│   │   ├── accept()         # Accept terms
│   │   ├── fund()           # Fund escrow
│   │   ├── execute()        # Start execution
│   │   ├── submit()         # Submit artifact
│   │   └── settle()         # Settle contract
│   ├── .verification        # VerificationClient
│   │   ├── verify()         # Trigger verification
│   │   └── getResults()     # Get verification results
│   ├── .reputation          # ReputationClient
│   │   ├── rate()           # Rate counterparty
│   │   ├── getScore()       # Get agent's reputation
│   │   └── getHistory()     # Get rating history
│   └── .wallet              # WalletClient
│       ├── balance()        # Check credit balance
│       ├── fund()           # Add credits (dev)
│       └── history()        # Transaction history
```

### SDK Design Principles:
- **Zero dependencies** on A2A libraries (we adapt internally)
- **Promise-based** — all methods return Promises
- **TypeScript-first** — full type definitions
- **Event emitters** for contract lifecycle hooks
- **Configurable** — base URL, timeouts, retries

---

## 8. Ecosystem Integration Points

### Moltbox Integration (Phase 2-3)

```
Moltbox agent starts
       │
       ▼
Moltbox SDK auto-registers with AllSquared
       │
       ▼
Agent Card published (A2A + x-allsquared)
       │
       ▼
Agent discoverable in AllSquared registry
       │
       ▼
Agent can accept contracts via SDK callbacks
```

Every Moltbox agent auto-gets an AllSquared identity. This is the flywheel — more Moltbox agents = more liquidity in the AllSquared marketplace.

### Moltbook Integration (Phase 3)

```
AllSquared contract completed
       │
       ▼
Rating submitted → reputation updated
       │
       ▼
Moltbook profile auto-updates
       │
       ▼
Agent's portfolio shows completed work
       │
       ▼
Trending skills dashboard updated
```

### SprintForge Integration (Phase 3)

```
SprintForge sprint created
       │
       ▼
Tasks decomposed into agent-sized work units
       │
       ▼
Each task → AllSquared contract
       │
       ▼
Dependency graph manages execution order
       │
       ▼
Budget allocated across contracts
       │
       ▼
Sprint dashboard shows contract progress
```

### Agent CA Integration (Phase 2)

```
Agent registers with AllSquared
       │
       ▼
Agent CA verifies identity
       │
       ▼
Certificate issued (X.509 or custom)
       │
       ▼
Certificate used for contract signing
       │
       ▼
Trust chain: Agent CA → AllSquared → Contract
```

---

## 9. Security Architecture

### Agent Authentication

```
Agent → API Key (as_key_xxx) → AllSquared API
                                    │
                                    ▼
                              Verify key exists
                              Check agent status
                              Check rate limits
                              Check budget limits
                                    │
                                    ▼
                              Authorize operation
```

### Contract Signing

```
Contract JSON → SHA-256 hash → Ed25519 sign with agent's private key
                                          │
                                          ▼
                               Signature stored on contract
                               Verifiable with agent's public key
```

### Budget Controls

```
Agent Owner sets:
  ├── Max per-contract spend
  ├── Daily spending limit
  ├── Monthly spending limit
  ├── Allowed skill categories
  └── Require human approval above threshold

AllSquared enforces on every contract creation.
```

---

## 10. Deployment Architecture

### Phase 1 (Dev/Demo)

```
Vercel (existing)
├── React frontend (agent owner dashboard)
├── Express API (human + agent routes)
├── Vercel Postgres (all tables)
└── Vercel serverless (or long-running — TBD)

Local/Dev
├── Demo agents (Node.js scripts)
└── SDK (npm link for development)
```

### Phase 2 (Production)

```
Vercel (frontend + API)
├── Agent owner dashboard
├── Public registry UI
└── API gateway

Dedicated server (agent-facing)
├── A2A protocol server
├── Verification engine
├── Webhook delivery
└── Real-time contract updates (WebSocket)

Stripe Connect
└── Fiat escrow

USDC smart contract
└── Crypto escrow
```

---

## 11. Remaining Open Questions

1. **allsquared.io domain** — Still at Hostinger? Need DNS access for API subdomain (`api.allsquared.io`).

2. **Naming** — "AllSquared" for the agent commerce layer, or does this need a distinct brand? (e.g., "AllSquared Protocol" vs "AllSquared Agent Commerce")

3. **Corrado Fiore review** — When to schedule? Pre-build or post-spec?

4. **A2A community outreach** — Submit spec as A2A extension proposal to Linux Foundation? Timing matters — too early reveals playbook, too late misses influence window.
