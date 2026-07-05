# SquaredNow — AI Dispute Mediator
## Product Requirements Document
**Author:** Maven 🎯 | **Date:** 2026-03-16 | **Status:** Approved by Eli — Build

---

## Overview

**SquaredNow** is AllSquared's AI-powered dispute resolution agent. It handles the full lifecycle from automatic triage through structured mediation to arbitration prep. Every AllSquared contract incorporates the UK Jurisdiction Taskforce (UKJT) Digital Dispute Resolution Rules — meaning SquaredNow's auto-resolve decisions are **legally binding** under Rule 4 of those rules.

---

## Legal Foundation

Every AllSquared contract template must include this clause:
> *"Any dispute arising under this agreement shall be resolved in accordance with the UKJT Digital Dispute Resolution Rules (Version 1.0, 2021). The parties consent to automatic dispute resolution by the AllSquared AI mediation system (Square) as an automatic dispute resolution process within the meaning of Rule 2(c) of those Rules. The juridical seat of any arbitration shall be England and Wales."*

This clause:
- Makes SquaredNow's auto-resolve decisions legally binding (UKJT Rule 4)
- Preserves escalation path to SCL-appointed arbitrators (UKJT Rule 8)
- Establishes English law jurisdiction
- Requires no further regulatory approval — UKJT rules are already government-endorsed

---

## Three-Tier Architecture

### Tier 1: Auto-Resolve (Free, Instant)
**Trigger:** Either party files a dispute via the AllSquared dashboard

**SquaredNow's process:**
1. Ingest full contract context: terms, milestones, payment history, all communications on record
2. Identify the contractual obligation in dispute (payment, deliverable, timeline, quality)
3. Map what was agreed vs what was delivered (using milestone completion data + escrow status)
4. Apply relevant UK law: Consumer Rights Act 2015, Supply of Goods and Services Act 1982, Late Payment of Commercial Debts Act 1998
5. Generate a **Dispute Intelligence Report** containing:
   - Summary of facts
   - Contractual obligations of each party
   - Assessment of breach (if any)
   - Proposed resolution (e.g., "Release 70% of escrow to contractor, 30% refunded to client")
   - Confidence score (%)
   - Legal basis for recommendation
6. Both parties notified, given 48 hours to Accept or Reject

**If both accept:** Decision implemented. Escrow released per recommendation. Case closed. Legally binding.
**If either rejects:** Escalate to Tier 2.

**Data inputs needed:**
- `contracts` table (all fields)
- `milestones` table (status, completion %, approval history)
- `escrow_transactions` table
- Any uploaded evidence (photos, screenshots, messages)

---

### Tier 2: Structured Mediation (£75, 48hr SLA)
**Trigger:** Auto-resolve rejected by either party

**SquaredNow's process:**
1. Open separate private channels for each party (they don't see each other's responses)
2. Ask each party 5 targeted questions (dynamically generated based on dispute type):
   - What specifically was not delivered as agreed?
   - What evidence do you have?
   - What outcome would you consider fair?
   - What is the minimum you would accept to resolve this now?
   - Is there anything Square should know about the relationship history?
3. Analyse both responses, identify the real gap (usually smaller than both parties think)
4. Generate 3 settlement options with rationale, presented to both parties simultaneously
5. Each party selects their preferred option or rejects all
6. If overlap: resolution adopted. If no overlap: escalate to Tier 3.

**Payment:** £75 charged to the disputing party at time of filing (refunded if Square resolves in their favour)

---

### Tier 3: Guided Arbitration Prep (£150 + arbitrator fees)
**Trigger:** Tier 2 mediation fails

**SquaredNow's process:**
1. Compile full **Case Brief** for SCL arbitrator:
   - Contract summary
   - Dispute timeline
   - Evidence log
   - Tier 1 & 2 summaries
   - SquaredNow's recommended outcome with legal basis
   - Both parties' final positions
2. Submit to Society for Computers and Law (SCL) as appointment body per UKJT Rules
3. SCL appoints arbitrator within 3 days
4. Arbitrator has 30 days to issue binding award
5. AllSquared holds escrow funds pending award
6. Award implemented automatically via escrow release

---

## Database Schema Additions

```sql
-- Disputes table
CREATE TABLE disputes (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  contract_id TEXT NOT NULL REFERENCES contracts(id),
  filed_by TEXT NOT NULL REFERENCES users(id),
  respondent_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'filed', 
  -- status: filed | tier1_pending | tier1_accepted | tier1_rejected | 
  --         tier2_active | tier2_resolved | tier2_failed |
  --         tier3_prep | tier3_submitted | resolved | closed
  tier INTEGER NOT NULL DEFAULT 1,
  filed_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolution_type TEXT, -- 'auto' | 'mediation' | 'arbitration' | 'withdrawn'
  escrow_release_amount INTEGER, -- pence
  escrow_refund_amount INTEGER,  -- pence
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- SquaredNow AI analysis
CREATE TABLE dispute_analyses (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  dispute_id TEXT NOT NULL REFERENCES disputes(id),
  tier INTEGER NOT NULL,
  analysis_json TEXT NOT NULL, -- SquaredNow's full reasoning
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  proposed_resolution TEXT NOT NULL,
  legal_basis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dispute evidence
CREATE TABLE dispute_evidence (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  dispute_id TEXT NOT NULL REFERENCES disputes(id),
  submitted_by TEXT NOT NULL REFERENCES users(id),
  evidence_type TEXT NOT NULL, -- 'document' | 'image' | 'message' | 'statement'
  file_path TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mediation responses (Tier 2)
CREATE TABLE mediation_responses (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  dispute_id TEXT NOT NULL REFERENCES disputes(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  question_set_json TEXT NOT NULL, -- questions asked
  answers_json TEXT NOT NULL,      -- responses given
  minimum_acceptable TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Settlement options (Tier 2)
CREATE TABLE settlement_options (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  dispute_id TEXT NOT NULL REFERENCES disputes(id),
  option_number INTEGER NOT NULL, -- 1, 2, 3
  description TEXT NOT NULL,
  escrow_split_json TEXT,  -- {"contractor": 70, "client": 30}
  rationale TEXT,
  selected_by TEXT, -- user_id if selected
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Routes (tRPC)

```typescript
// server/routers/disputes.ts
dispute.file        // File a new dispute
dispute.getById     // Get dispute + analysis + evidence
dispute.respond     // Accept/reject auto-resolve
dispute.submit_evidence  // Upload evidence
dispute.answer_questions // Tier 2 mediation answers
dispute.select_option    // Select settlement option
dispute.list        // List disputes for a contract/user

// server/routers/square.ts (internal — not exposed to client directly)
square.analyze      // Run Tier 1 analysis
square.generate_questions  // Generate Tier 2 questions
square.generate_options    // Generate Tier 2 settlement options
square.generate_brief      // Generate Tier 3 case brief
```

---

## Client Pages

```
/dashboard/disputes                    -- List all disputes
/dashboard/disputes/new?contract=:id   -- File a dispute
/dashboard/disputes/:id                -- Dispute detail + Square analysis
/dashboard/disputes/:id/mediation      -- Tier 2 mediation interface
/dashboard/disputes/:id/evidence       -- Evidence submission
```

---

## SquaredNow AI Prompt Architecture

**System prompt for Tier 1 analysis:**
```
You are Square, AllSquared's AI dispute mediator. You resolve disputes between 
UK freelancers and their clients under English law.

You have access to:
- The full contract terms
- Milestone completion history  
- Payment and escrow records
- Any submitted evidence

Your analysis must:
1. Identify the specific contractual obligation in dispute
2. Determine what was agreed vs what was delivered
3. Apply relevant UK law (Consumer Rights Act 2015, Supply of Goods and Services 
   Act 1982, Late Payment of Commercial Debts Act 1998)
4. Propose a fair resolution with specific escrow split
5. Provide a confidence score (0-1)
6. State the legal basis for your recommendation

Your decision, if accepted by both parties, is legally binding under the UKJT 
Digital Dispute Resolution Rules (Rule 4 — automatic dispute resolution).

Be fair. Be specific. Be brief.
```

---

## MVP Scope (Ada: build this first)

**Phase 1 (Week 1-2):**
- [ ] Database schema migrations
- [ ] `dispute.file` API endpoint
- [ ] `/dashboard/disputes/new` page (file a dispute)
- [ ] `/dashboard/disputes/:id` page (view dispute status)
- [ ] Square Tier 1 analysis (GPT-4o or Claude — use the AI router already in the codebase)
- [ ] Accept/reject auto-resolve flow
- [ ] Escrow hold on dispute filing (freeze Transpact release)

**Phase 2 (Week 3-4):**
- [ ] Evidence upload
- [ ] Tier 2 question generation + response collection
- [ ] Settlement option generation + selection
- [ ] Payment integration for £75 mediation fee

**Phase 3 (Week 5-6):**
- [ ] Tier 3 case brief generation
- [ ] SCL submission workflow (email-based initially)
- [ ] Dispute history + analytics dashboard
- [ ] UKJT clause injection into all contract templates

---

## Success Metrics

- Tier 1 resolution rate: >60% of disputes
- Tier 2 resolution rate: >85% of disputes reaching Tier 2
- Time to resolution: <48 hours for Tier 1-2
- User satisfaction: >4/5 for resolved disputes
- Revenue per 1,000 disputes: £25,000+

---

## Notes for Ada

- The AI infrastructure is already in the codebase (`server/routers/ai.ts` or similar)
- Use the same tRPC pattern as `contracts.ts`
- SquaredNow's prompts should be version-controlled in `server/prompts/square/`
- All Square decisions must be logged immutably — they're legally significant
- Escrow freeze/hold on dispute filing is critical — coordinate with Transpact integration
- UKJT clause must be added to ALL 6 existing contract templates immediately

Questions? Ask Maven or Eli.
