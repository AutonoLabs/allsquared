# AllSquared — 48-Hour Sprint Scope
## For Ada — Locked Sprint Until Monday EOD
**Written by:** Maven | **Date:** 2026-03-21 | **Approved by:** Eli

---

## RULES
- Work ONLY on this list for 48 hours
- No LexAI, no system infra, no other channels
- Deploy after each fix — don't batch
- Test each fix on production before moving to next
- Post progress to #labs-allsquared after each item

---

## BLOCK 1: Critical Fixes (Tonight — 2-3 hours)

### 1.1 JSON.parse Crash on ContractDetail ⏱️ 30 min
**File:** `client/src/pages/ContractDetail.tsx`
**Bug:** `SyntaxError: Unexpected token '#', "# ESCROW A"...`
**Cause:** `selectedClauses` or `filledVariables` DB field contains raw markdown instead of JSON
**Fix:**
```typescript
// Wrap EVERY JSON.parse call in ContractDetail with:
function safeParse(str: string, fallback: any = {}) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
```
Also fix root cause in `server/routers/templateBuilder.ts` — verify `selectedClauses` and `filledVariables` are always `JSON.stringify()`'d before insert.
**Test:** Open `https://allsquared.io/dashboard/contracts/contract_yayR4LHj-0iOS6E3` — should render without crash.

### 1.2 Auth Flow Verification ⏱️ 30 min
**Test these flows on production:**
- [ ] New user: click "Join Waitlist" → sign up form → complete signup → lands on dashboard (not stuck on loading)
- [ ] Existing user: click "Sign In" → signs in → lands on dashboard
- [ ] Clerk production keys: verify `VITE_CLERK_PUBLISHABLE_KEY` starts with `pk_live_` and `CLERK_SECRET_KEY` starts with `sk_live_` in Vercel env vars
- [ ] "Development mode" badge should NOT appear
**Fix if broken.** Report results either way.

### 1.3 DocuSeal Status Check ⏱️ 15 min
```bash
# On Mac Studio:
colima status
docker ps | grep docuseal
curl http://localhost:3030/health
```
- [ ] Container running?
- [ ] Cloudflare tunnel live? (test from external: `curl https://sign.allsquared.io/health` or whatever the tunnel URL is)
- [ ] If down, restart: `docker start docuseal`
**Report status.**

---

## BLOCK 2: Save & Exit + Onboarding (Sunday — 6-8 hours)

### 2.1 Save Draft & Exit on Contract Wizard ⏱️ 2 hrs
**File:** `client/src/pages/NewContractTypeform.tsx`
**What:** Add a "Save & Exit" button visible on every step (Steps 1-4).
**Behaviour:**
- Saves current form state to DB as draft contract (use existing `saveContractDraft` mutation)
- Redirects to `/dashboard/contracts`
- When user returns to edit, pre-fills all fields from saved draft
- Button text: "Save & Exit" (outline style, left side of nav bar)
**Test:** Start a contract → fill 2 steps → click Save & Exit → go back → verify fields are pre-filled.

### 2.2 Onboarding Wizard (New Users) ⏱️ 4 hrs
**New component:** `client/src/pages/Onboarding.tsx`
**Trigger:** After first sign-up, before dashboard access (check if user profile is incomplete)

**Step 1: Account Type**
```
"How will you use AllSquared?"
○ I'm a freelancer/contractor (I do the work)
○ I'm a client (I hire people to do work)
○ Both
```

**Step 2: Individual or Company?**
```
"Are you operating as..."
○ Individual / Sole Trader
○ Limited Company → show company name field + Companies House lookup (Phase 2 — for now just text input)
○ Partnership / LLP
```

**Step 3: Your Details**
```
Full name (pre-filled from Clerk)
Email (pre-filled from Clerk)
Phone number
Address Line 1
Address Line 2
City
Postcode → [future: postcode lookup dropdown]
```

**Step 4: Done**
```
"You're all set! Create your first contract."
[Create Contract] button → /dashboard/contracts/new
```

**DB:** Add fields to `users` table: `userType` (already exists), `accountType` (individual/company/partnership), `phone`, `addressLine1`, `addressLine2`, `city`, `postcode`, `companyName`, `companyNumber`.
**Route guard:** If user has `accountType = null`, redirect to `/onboarding` from dashboard.

### 2.3 Expand Profile Page ⏱️ 1.5 hrs
**File:** `client/src/pages/Profile.tsx`
**Add:** All fields from onboarding wizard, editable. Plus:
- VAT number (optional)
- Business description (optional, text area)
- Profile completion indicator (X% complete)
**Save:** `updateProfile` tRPC mutation (already exists, extend input schema).

---

## BLOCK 3: Companies House + Address Lookup (Sunday/Monday — 3-4 hours)

### 3.1 Companies House API ⏱️ 2 hrs
**Setup:** Register at https://developer.company-information.service.gov.uk → get API key → add to `.env` and Vercel env vars as `COMPANIES_HOUSE_API_KEY`
**Backend:** New tRPC endpoint `company.search`:
```typescript
company.search: publicProcedure
  .input(z.object({ query: z.string().min(2) }))
  .query(async ({ input }) => {
    const res = await fetch(
      `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(input.query)}&items_per_page=10`,
      { headers: { Authorization: `Basic ${Buffer.from(API_KEY + ':').toString('base64')}` } }
    );
    return res.json();
  });
```
**Frontend:** In onboarding Step 2 + contract creation "Company Name" field:
- Debounced search as user types (300ms)
- Dropdown showing: company name, number, registered address, status
- On select: auto-fill company name, number, registered address
- Show badge: ✅ Active | ⚠️ Dormant | 🔴 Dissolved

### 3.2 UK Postcode Lookup ⏱️ 1.5 hrs
**API:** Ideal Postcodes (https://ideal-postcodes.co.uk) — first 100 lookups free, then 2.5p each
**Setup:** Register → get API key → env var `IDEAL_POSTCODES_KEY`
**Backend:** New tRPC endpoint `address.lookup`:
```typescript
address.lookup: publicProcedure
  .input(z.object({ postcode: z.string() }))
  .query(async ({ input }) => {
    const res = await fetch(
      `https://api.ideal-postcodes.co.uk/v1/postcodes/${encodeURIComponent(input.postcode)}?api_key=${API_KEY}`
    );
    return res.json();
  });
```
**Frontend:** In onboarding Step 3 + profile + contract party details:
- User types postcode → "Find Address" button
- Dropdown of matching addresses
- On select: auto-fill address line 1, line 2, city, county, postcode

### 3.3 Company Number Validation ⏱️ 30 min
**Frontend validation (regex):**
```typescript
const UK_COMPANY_NUMBER = /^(SC|NI|OC|SO|NC|NL|R|IP|SP|IC|SI|NP|NO|RC|NR|AC|FC|GE|LP|LL|SE|SA|SZ|SF|GS|SL|GN|CE)?\d{6,8}$/i;
```
**On input:** Validate format → if valid, hit Companies House API to confirm exists + show status badge.

---

## BLOCK 4: Polish + Test (Monday — 3-4 hours)

### 4.1 Clerk Production Keys ⏱️ 15 min
Verify Vercel env vars:
- `VITE_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
- `CLERK_SECRET_KEY` = `sk_live_...`
If still dev keys, create production Clerk instance at clerk.com → copy keys → update Vercel → redeploy.

### 4.2 Remove Duplicate "Already have an account?" ⏱️ 15 min
**File:** `client/src/components/DashboardLayout.tsx` → `AuthScreen` function
The Clerk `<SignUp>` component already shows this link. Remove the duplicate `<p>` below it.

### 4.3 Fix User Name Display ⏱️ 15 min
**File:** `client/src/hooks/useAuth.ts`
Ensure `syncClerkUser` mutation sends `clerkUser.fullName` to DB and the DB stores it. Dashboard should show user's real name, not "User".

### 4.4 Full End-to-End Test ⏱️ 2 hrs
Test on production (allsquared.io) — not localhost:

**Flow 1: New User**
- [ ] Visit allsquared.io → click "Join Waitlist" or "Get Started"
- [ ] Sign up with test email
- [ ] Redirected to onboarding wizard
- [ ] Complete all steps → lands on dashboard with profile data
- [ ] Name shows correctly (not "User")

**Flow 2: Create Contract**
- [ ] Click "Create Contract" → template selection loads (no "run seed script" error)
- [ ] Select template → fill variables → save draft works at every step
- [ ] Complete all steps → preview renders
- [ ] Send for signature → DocuSeal processes → email sent

**Flow 3: View Contract**
- [ ] Open contract detail → renders without JSON.parse crash
- [ ] Shows all contract data correctly
- [ ] Signing status shown

**Flow 4: Dispute**
- [ ] File a dispute from contract detail (if UI exists)
- [ ] AI analysis generates
- [ ] Accept/reject works

**Flow 5: Public Pages**
- [ ] Home, How It Works, Features, Pricing, About, Contact — all load, no errors

---

## DEFINITION OF DONE

All items deployed to production. All test flows passing. Post final status to #labs-allsquared with:
- Screenshot of each flow working
- Any items deferred with reason
- Total time taken

---

*This scope is locked. No scope creep. No "while I'm in there I'll also..." — just this list.*
