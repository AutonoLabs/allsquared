# AllSquared Security Audit — 24 Jun 2026

## Scope

End-to-end review of auth, API authorization, LLM/chat, legal templates, file uploads, webhooks, and contract lifecycle.

## A–Z System Flow (verified in code)

| Step | Route / API | Status |
|------|-------------|--------|
| 1. Sign up / in | Clerk → `auth.syncClerkUser` | ✅ |
| 2. Profile / onboarding | `/dashboard/profile` | ✅ |
| 3. Pick template | `templateBuilder.listLegalTemplates` → builder step 0 | ✅ |
| 4. Build contract | `/dashboard/contracts/new` (modules + parties) | ✅ |
| 5. AI assistant | `trpc.ai.chatMessage` (builder + typeform chatbot) | ✅ server-side |
| 6. Save draft | `contracts.create` / `contracts.update` | ✅ draft-only edits |
| 7. Send for signature | `signatures.createSignatureRequest` or internal | ✅ |
| 8. Sign | `contracts.sign` or DocuSeal | ✅ |
| 9. Milestones | `milestones.*` workflow | ✅ status via dedicated mutations |
| 10. Disputes | `disputes.file` → AI mediation | ✅ rate-limited |

## Legal Templates

- **Source:** `legal/` (6 UK templates with `[VAR]`) + `templates/` (10 YAML `{{var}}` files)
- **Seed:** `seedAllTemplates()` on boot when DB empty; CLI `pnpm seed-templates`
- **UI:** Template picker in contract builder; classic typeform at `/dashboard/contracts/new/classic`
- **Render:** `shared/template-render.ts` unified substitution

## LLM / Chat Integration

| Surface | Endpoint | Auth | Rate limit |
|---------|----------|------|------------|
| Contract builder sidebar | `ai.chatMessage` | ✅ protected | ✅ per-user |
| Typeform Squario sheet | `ai.chatMessage` via `ContractChatbot` | ✅ protected | ✅ per-user |
| Contract generation | `ai.generateContract` | ✅ protected | ✅ per-user |
| Dispute analysis | `disputes.analyze` | ✅ protected | ✅ (added) |
| Dispute mediation | `disputes.mediate` | ✅ protected | ✅ (added) |

**Prompt injection mitigation:** Client `history` now accepts **user messages only** (`server/lib/ai-safety.ts`).

Requires `OPENAI_API_KEY` in production for live LLM responses; falls back to heuristics when unset.

## Fixes Applied (this PR)

### Critical / High

| Issue | Fix |
|-------|-----|
| IDOR on `templateBuilder.saveContractDraft` | Ownership + draft-only check |
| Contract status bypass via `contracts.update` | Removed client-writable `status` |
| Escrow payment without contract auth | Client-only check on `createEscrowPayment` |
| Platform template delete/update by any user | Admin-only when `templateSlug` set |
| Milestone status escalation | Removed `status` from generic `milestones.update` |
| DocuSeal HTML injection | `escapeHtml()` on title/body |
| DocuSeal wrong `userId` on signature records | Match submitter to signer list |
| DocuSign webhook stub | Verify HMAC + call `processDocuSignWebhook` |
| Transpact webhook skipped in non-prod | Always verify when secret configured |
| Health endpoint leaks config | Production returns `{ ok: true }` only |
| AI chat prompt injection via history | `sanitizeChatHistory()` |
| File upload size spoofing | Validate decoded buffer length |

## Remaining Risks (track separately)

| Severity | Item | Recommendation |
|----------|------|----------------|
| High | AI rate limit is in-memory on serverless | Require Upstash in production |
| High | Settlement escrow DB-only updates | Call Transpact/Stripe before status change |
| High | Internal signature is typed name only | DocuSeal in prod; step-up auth |
| Medium | 50MB JSON body limit | Reduce default; dedicated upload path |
| Medium | CSP `unsafe-inline` | Nonce-based CSP |
| Medium | No magic-byte file validation | Add content sniffing |
| Medium | LexAI has no service auth | Network isolate + API key |
| Low | Ban uses `verified:no` | Add dedicated `banned` column |

## Production Checklist

```bash
# Required
DATABASE_URL
CLERK_SECRET_KEY / VITE_CLERK_PUBLISHABLE_KEY
JWT_SECRET
OPENAI_API_KEY          # live Squario + contract AI
UPSTASH_REDIS_*         # distributed rate limits

# Recommended
DOCUSEAL_API_KEY        # e-signature
CLOUDFLARE_R2_*         # attachments
STRIPE_*                # payments
TRANSPACT_*             # escrow
DOCUSIGN_WEBHOOK_SECRET # if using DocuSign
```

## Tests

- `server/lib/ai-safety.test.ts` — chat history sanitization
- `server/lib/template-render.test.ts` — template variable rendering
- Run: `pnpm test && pnpm check`
