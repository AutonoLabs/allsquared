# AllSquared A2A — Phase 1 Implementation Plan

**Status:** Draft  
**Date:** 2026-02-12  
**Goal:** Working proof-of-concept where two agents discover, contract, execute, verify, and settle through AllSquared  
**Timeline:** 4 weeks  

---

## Success Criteria

By the end of Phase 1, we can demo:

1. **Agent A** (a "Hiring Agent") searches the AllSquared registry for a CSV cleaning service
2. **Agent B** (a "Worker Agent") is registered with pricing, SLAs, and capability metadata
3. Agent A sends a structured RFP → Agent B responds with a proposal → contract is generated
4. Escrow is funded (AllSquared credits — no real money yet)
5. A2A task is created → Agent B processes the work → artifact produced
6. AllSquared auto-verifies the output against the contract spec (schema match)
7. Escrow releases → both agents are rated → reputation updates

All of this happens programmatically via the AllSquared Agent SDK. No human clicks required.

---

## Architecture Overview

```
Phase 1 keeps it simple:

┌─────────────────┐          ┌─────────────────┐
│  Demo Client     │          │  Demo Worker     │
│  Agent (Node.js) │◄──A2A──►│  Agent (Node.js) │
│  + AS SDK        │          │  + AS SDK        │
└────────┬────────┘          └────────┬────────┘
         │                            │
         └──────────┬─────────────────┘
                    │
         ┌──────────▼──────────┐
         │  AllSquared Platform │
         │  (Extended Backend)  │
         │                     │
         │  • Agent Registry   │
         │  • Contract Engine  │
         │  • Escrow (credits) │
         │  • Verification     │
         │  • Reputation       │
         └─────────────────────┘
```

### What we're building:
- **Backend extensions** to existing AllSquared Express server
- **New DB tables** for agent identities, skills, negotiations, verifications, reputation
- **AllSquared Agent SDK** (TypeScript, npm package)
- **Two demo agents** that exercise the full lifecycle
- **A2A protocol adapter** (minimal — enough for task creation + artifact delivery)

### What we're NOT building yet:
- Real payment integration (credits only)
- Production A2A server (we mock the A2A transport)
- Public registry UI
- Dispute resolution
- Subcontracting
- Agent owner dashboard

---

## Week 1: Foundation — Agent Identity & Registry

### 1.1 Database Schema Extensions

Add to existing AllSquared PostgreSQL:

```sql
-- Agent identity (linked to existing users table for owner)
CREATE TABLE agent_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id VARCHAR(64) REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  agent_card_url TEXT,          -- A2A Agent Card endpoint
  agent_type VARCHAR(20) DEFAULT 'autonomous',  -- autonomous | supervised | hybrid
  public_key TEXT,              -- Ed25519 public key for contract signing
  wallet_balance DECIMAL(12,4) DEFAULT 0,       -- AllSquared credits
  reputation_score DECIMAL(3,2) DEFAULT 0,
  total_contracts INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent skills with commercial terms
CREATE TABLE agent_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agent_identities(id) ON DELETE CASCADE,
  skill_id VARCHAR(255) NOT NULL,    -- maps to A2A skill ID
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pricing_model VARCHAR(50) NOT NULL,  -- per-task | per-token | per-hour | fixed | auction
  base_rate DECIMAL(10,4),
  currency VARCHAR(3) DEFAULT 'GBP',
  rate_unit VARCHAR(100),             -- e.g. "1000-rows", "hour", "task"
  max_budget DECIMAL(10,2),
  sla_max_latency_ms INTEGER,
  sla_uptime DECIMAL(5,4),
  verification_method VARCHAR(50),     -- schema-match | quality-score | completeness
  verification_config JSONB DEFAULT '{}',
  input_schema JSONB,                  -- expected input format
  output_schema JSONB,                 -- expected output format
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agent_skills_skill_id ON agent_skills(skill_id);
CREATE INDEX idx_agent_skills_agent_id ON agent_skills(agent_id);
```

### 1.2 Agent Registry API

New Express routes (`/api/v1/agents/`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agents/register` | Register a new agent identity |
| GET | `/agents/:id` | Get agent profile + commercial card |
| GET | `/agents/:id/card` | Get A2A Agent Card with x-allsquared extension |
| PUT | `/agents/:id` | Update agent profile |
| POST | `/agents/:id/skills` | Register a skill with pricing |
| GET | `/agents/:id/skills` | List agent's skills |
| GET | `/agents/search` | Search registry by capability, price, rating |
| POST | `/agents/:id/fund` | Add credits to agent wallet (dev/test) |

### 1.3 Agent Card Generation

The `/agents/:id/card` endpoint returns a standard A2A Agent Card enhanced with the `x-allsquared` commercial extension:

```json
{
  "name": "DataCleanerBot",
  "url": "https://datacleaner.example.com/a2a",
  "version": "1.0.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [{
    "id": "csv-cleaning",
    "name": "CSV Data Cleaning",
    "description": "Clean and normalize CSV datasets"
  }],
  "x-allsquared": {
    "version": "0.1.0",
    "agentId": "uuid-here",
    "pricing": { ... },
    "sla": { ... },
    "reputation": { ... },
    "escrow": { ... }
  }
}
```

### Deliverables Week 1:
- [ ] DB migration script for new tables
- [ ] Agent Registry CRUD API (6 endpoints)
- [ ] Agent Card generation endpoint
- [ ] Registry search (capability + price range + min rating)
- [ ] Unit tests for all endpoints

---

## Week 2: Contracts & Negotiation

### 2.1 Contract Tables

```sql
-- Agent-to-agent contracts
CREATE TABLE agent_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  client_agent_id UUID REFERENCES agent_identities(id),
  provider_agent_id UUID REFERENCES agent_identities(id),
  skill_id UUID REFERENCES agent_skills(id),
  status VARCHAR(20) DEFAULT 'draft',
  -- draft → proposed → negotiating → agreed → funded → active → verifying → settled → closed | disputed
  
  -- Terms
  scope JSONB NOT NULL,            -- task description, input/output specs
  total_amount DECIMAL(10,4) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  sla JSONB DEFAULT '{}',
  
  -- Signatures
  client_signature TEXT,
  client_signed_at TIMESTAMP,
  provider_signature TEXT,
  provider_signed_at TIMESTAMP,
  
  -- Execution tracking
  a2a_task_id VARCHAR(255),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contract milestones
CREATE TABLE agent_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES agent_contracts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10,4) NOT NULL,
  sequence INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  -- pending → active → submitted → verifying → verified → paid | failed
  verification_method VARCHAR(50),
  verification_config JSONB DEFAULT '{}',
  deadline TIMESTAMP,
  submitted_at TIMESTAMP,
  verified_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Negotiation messages
CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES agent_contracts(id) ON DELETE CASCADE,
  from_agent_id UUID REFERENCES agent_identities(id),
  message_type VARCHAR(20) NOT NULL,  -- rfp | proposal | counter | accept | reject
  terms JSONB NOT NULL,               -- proposed terms
  message TEXT,                        -- optional free-text
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Contract API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contracts/rfp` | Client agent sends RFP |
| POST | `/contracts/:id/propose` | Provider agent responds with proposal |
| POST | `/contracts/:id/counter` | Either party counter-offers |
| POST | `/contracts/:id/accept` | Accept current terms → status=agreed |
| POST | `/contracts/:id/sign` | Cryptographically sign contract |
| POST | `/contracts/:id/fund` | Fund escrow from client wallet |
| GET | `/contracts/:id` | Get contract details |
| GET | `/contracts/agent/:agentId` | List agent's contracts |

### 2.3 Negotiation Flow (Phase 1 — Simplified)

For the PoC, we support **instant acceptance** (no back-and-forth):

1. Client agent calls `POST /contracts/rfp` with skill requirements + budget
2. AllSquared matches to a provider agent
3. Provider agent's SDK auto-evaluates against its pricing rules
4. If within parameters → auto-accept → contract generated → signed by both
5. Client agent funds escrow from wallet credits

More complex negotiation strategies (auction, counter-offer) are Phase 2.

### Deliverables Week 2:
- [ ] Contract + milestone + negotiation DB tables
- [ ] Contract lifecycle API (8 endpoints)
- [ ] Ed25519 signing for contract signatures
- [ ] Instant-accept negotiation flow
- [ ] Escrow fund/hold from agent wallet credits
- [ ] Contract state machine with validation

---

## Week 3: Execution, Verification & Settlement

### 3.1 A2A Protocol Adapter (Minimal)

For Phase 1, we don't implement a full A2A server. Instead:

- AllSquared acts as A2A proxy — routes tasks between agents
- Uses HTTP POST for task submission (mimics A2A `message/send`)
- Agents register a webhook URL for receiving tasks
- Artifacts are returned via callback

```typescript
// Simplified A2A task flow for Phase 1
interface A2ATask {
  id: string;
  contractId: string;
  milestoneId: string;
  skill: string;
  input: Record<string, any>;
  status: 'pending' | 'working' | 'completed' | 'failed';
}

interface A2AArtifact {
  taskId: string;
  milestoneId: string;
  data: Record<string, any>;
  metadata: {
    completedAt: string;
    processingTimeMs: number;
  };
}
```

### 3.2 Verification Engine

```sql
CREATE TABLE verification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES agent_contracts(id),
  milestone_id UUID REFERENCES agent_milestones(id),
  method VARCHAR(50) NOT NULL,
  passed BOOLEAN NOT NULL,
  score DECIMAL(5,4),
  details JSONB DEFAULT '{}',
  verified_at TIMESTAMP DEFAULT NOW()
);
```

Phase 1 verification methods:

| Method | How it works |
|--------|-------------|
| `schema-match` | Validate output JSON against contract's output_schema using JSON Schema |
| `completeness` | Check all required fields present, no nulls where not allowed |
| `row-count` | For data tasks: verify output has expected number of rows |

```typescript
class VerificationEngine {
  async verify(artifact: A2AArtifact, milestone: AgentMilestone): Promise<VerificationResult> {
    const method = milestone.verification_method;
    
    switch (method) {
      case 'schema-match':
        return this.schemaMatch(artifact.data, milestone.verification_config.outputSchema);
      case 'completeness':
        return this.completenessCheck(artifact.data, milestone.verification_config);
      case 'row-count':
        return this.rowCountCheck(artifact.data, milestone.verification_config);
      default:
        return { passed: true, score: 1.0, details: { method: 'auto-pass' } };
    }
  }
}
```

### 3.3 Settlement Flow

On verification pass:
1. Milestone status → `verified`
2. Transfer credits: client_wallet → provider_wallet (minus platform fee)
3. Platform fee: 3% held in AllSquared platform account
4. Milestone status → `paid`
5. If all milestones paid → contract status → `settled`

### 3.4 Execution API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contracts/:id/execute` | Start execution (create A2A task) |
| POST | `/contracts/:id/milestones/:mid/submit` | Provider submits artifact |
| POST | `/contracts/:id/milestones/:mid/verify` | Trigger verification |
| GET | `/contracts/:id/verifications` | List verification results |
| POST | `/contracts/:id/settle` | Settle contract (release remaining escrow) |

### Deliverables Week 3:
- [ ] A2A task adapter (simplified HTTP proxy)
- [ ] Verification engine (schema-match, completeness, row-count)
- [ ] Settlement flow (credit transfer + platform fee)
- [ ] Verification results table + API
- [ ] End-to-end contract execution flow working

---

## Week 4: Reputation, SDK & Demo

### 4.1 Reputation System

```sql
CREATE TABLE reputation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agent_identities(id),
  contract_id UUID REFERENCES agent_contracts(id),
  event_type VARCHAR(50) NOT NULL,
  -- contract_completed, sla_met, sla_violated, dispute_won, dispute_lost, rating_received
  rating DECIMAL(3,2),            -- 1.00 - 5.00
  weight DECIMAL(5,4) DEFAULT 1,  -- weighted by contract value
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES agent_contracts(id),
  from_agent_id UUID REFERENCES agent_identities(id),
  to_agent_id UUID REFERENCES agent_identities(id),
  overall DECIMAL(3,2) NOT NULL,
  quality DECIMAL(3,2),
  timeliness DECIMAL(3,2),
  communication DECIMAL(3,2),
  value DECIMAL(3,2),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(contract_id, from_agent_id)
);
```

Reputation score = weighted average of ratings, decayed by recency:

```
score = Σ(rating_i × weight_i × decay_i) / Σ(weight_i × decay_i)
where:
  weight_i = log(contract_value_i + 1)  -- larger contracts count more
  decay_i = e^(-λ × age_in_days_i)      -- recent ratings matter more
  λ = 0.01                              -- ~70% weight within 70 days
```

### 4.2 AllSquared Agent SDK

```
@allsquared/agent-sdk/
├── src/
│   ├── index.ts           # Main exports
│   ├── client.ts          # AllSquaredClient class
│   ├── types.ts           # TypeScript interfaces
│   ├── contracts.ts       # Contract operations
│   ├── registry.ts        # Registry search/register
│   ├── verification.ts    # Verification types
│   ├── reputation.ts      # Rating operations
│   └── a2a-adapter.ts     # Simplified A2A bridge
├── package.json
├── tsconfig.json
└── README.md
```

Core SDK interface:

```typescript
import { AllSquared } from '@allsquared/agent-sdk';

// Initialize
const client = new AllSquared({
  apiKey: 'as_key_xxx',
  agentId: 'uuid',
  baseUrl: 'https://api.allsquared.io',
  signingKey: privateKey,  // Ed25519 private key
});

// Register capabilities
await client.skills.register({
  skillId: 'csv-cleaning',
  name: 'CSV Data Cleaning',
  pricing: { model: 'per-task', rate: 0.05, currency: 'GBP', unit: '1000-rows' },
  sla: { maxLatencyMs: 30000, uptime: 0.995 },
  verification: { method: 'schema-match', outputSchema: { ... } },
  inputSchema: { ... },
});

// Search for agents
const agents = await client.registry.search({
  skill: 'translation-en-fr',
  maxPrice: 50,
  currency: 'GBP',
  minRating: 4.0,
});

// Hire an agent (instant flow)
const contract = await client.contracts.hire({
  providerAgentId: agents[0].id,
  skillId: 'translation-en-fr',
  scope: { wordCount: 10000, quality: 'professional' },
  budget: { amount: 50, currency: 'GBP' },
  milestones: [
    { title: 'Translation delivery', amount: 50, verification: 'completeness' }
  ],
});

// Execute
const result = await client.contracts.execute(contract.id, {
  input: { text: 'Hello world', targetLang: 'fr' },
});

// Rate
await client.reputation.rate(contract.id, {
  overall: 4.5,
  quality: 5.0,
  timeliness: 4.0,
});
```

### 4.3 Demo Agents

Two standalone Node.js scripts that demonstrate the full flow:

**`demo/hiring-agent.ts`** — Searches for a CSV cleaner, creates a contract, funds escrow, executes, receives verified output, rates the worker.

**`demo/worker-agent.ts`** — Registers with the registry, listens for incoming tasks, processes CSV data, submits artifacts, gets paid, rates the client.

**`demo/run-demo.sh`** — Starts the AllSquared server, registers both agents, funds the hiring agent, and runs the full lifecycle.

### 4.4 Mini Web UI (Demo Dashboard)

A small React page (added to existing AllSquared frontend) that visualizes the agent commerce lifecycle in real-time:

- **Live contract flow** — See contracts move through states (PROPOSED → AGREED → FUNDED → ACTIVE → VERIFIED → SETTLED) with animated transitions
- **Agent registry browser** — Search and view registered agents with their commercial cards
- **Contract detail view** — Shows terms, milestones, verification results, escrow status
- **Activity feed** — Real-time log of negotiation messages, verification events, settlements
- **Dual agent view** — Split screen showing client agent and worker agent perspectives simultaneously

This is the investor demo surface. It answers: "What does agent-to-agent commerce actually look like?"

### Deliverables Week 4:
- [ ] Reputation system (events, ratings, score calculation)
- [ ] Rating API endpoints
- [ ] AllSquared Agent SDK (TypeScript package)
- [ ] Two demo agents (hiring + worker)
- [ ] End-to-end demo script
- [ ] Demo recording / walkthrough doc
- [ ] README with architecture diagrams

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Language** | TypeScript | Existing codebase is TS, SDK consumers expect TS |
| **Signing** | Ed25519 | Fast, compact signatures, standard for agent identity |
| **Payment** | Credits (Phase 1) | No payment provider integration needed for PoC |
| **A2A transport** | HTTP webhook | Simplest implementation, upgrade to full A2A later |
| **Verification** | JSON Schema | Deterministic, well-understood, works for structured data |
| **Database** | PostgreSQL (existing) | AllSquared already uses Vercel Postgres |
| **Package** | npm monorepo | SDK + server + demo in one repo |

---

## Codebase Changes

The existing AllSquared repo (`Nakamoto-Labs/allsquared`) needs:

### New directories:
```
server/
├── routers/
│   ├── agents.ts          # NEW: Agent registry routes
│   ├── agent-contracts.ts # NEW: A2A contract routes  
│   └── verification.ts    # NEW: Verification routes
├── services/
│   ├── registry.ts        # NEW: Registry search logic
│   ├── contract-engine.ts # NEW: Contract state machine
│   ├── escrow.ts          # NEW: Credit escrow service
│   ├── verification.ts    # NEW: Verification engine
│   └── reputation.ts      # NEW: Reputation calculation
├── a2a/
│   └── adapter.ts         # NEW: A2A protocol adapter
└── migrations/
    └── 002_agent_tables.sql  # NEW: Schema additions

packages/
└── agent-sdk/             # NEW: @allsquared/agent-sdk
    ├── src/
    ├── package.json
    └── tsconfig.json

demo/
├── hiring-agent.ts        # NEW: Demo client agent
├── worker-agent.ts        # NEW: Demo worker agent
└── run-demo.sh            # NEW: Full demo script
```

### Existing files modified:
- `server/index.ts` — mount new routers
- `server/db.ts` — add new table types
- `package.json` — add workspace for SDK package

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Scope creep | Strict "Phase 1 only" list above. Negotiation = instant only. Payment = credits only. |
| A2A complexity | We mock A2A transport with HTTP webhooks. Real A2A integration is Phase 2. |
| Over-engineering verification | Three simple methods only. AI quality scoring is Phase 2. |
| Demo fragility | Demo agents are standalone scripts, not production services. Keep them simple. |

---

## Phase 2 Preview (Months 2-3)

After Phase 1 is solid:
- Full A2A protocol support (proper Agent Cards, SSE streaming)
- Stripe Connect for real fiat escrow
- Counter-offer negotiation
- AI quality scoring verification
- Dispute resolution (AI arbitration)
- Agent owner dashboard
- Moltbox integration (auto-register agents)
- Public registry UI
- Crypto payment support (USDC)

---

## Definition of Done

Phase 1 is complete when:
- [ ] `demo/run-demo.sh` executes the full lifecycle end-to-end without human intervention
- [ ] All new API endpoints have unit tests
- [ ] SDK is usable as a standalone npm package
- [ ] Agent Card endpoint returns valid A2A card + x-allsquared extension
- [ ] Contract is cryptographically signed by both agents
- [ ] Escrow correctly holds and releases credits
- [ ] Verification correctly validates output against schema
- [ ] Both agents have updated reputation scores after settlement
- [ ] Architecture doc explains how this extends to Phase 2
