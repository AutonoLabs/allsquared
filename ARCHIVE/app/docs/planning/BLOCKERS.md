# AllSquared Technical Blockers

**Date**: 2025-01-21
**Assessed by**: Tech Lead Agent

---

## 🚨 Critical Blockers

### 1. Auth System (CRITICAL)

**Problem**: App uses Manus OAuth — users need Manus.im accounts
**Impact**: Freelancers/contractors can't log in without Manus accounts
**Fix**: Swap to Clerk (4-6 hours work)
**Needs Eli**: Yes — decision to proceed with Clerk swap

See: `/root/clawd/allsquared/AUTH-DECISION.md`

---

### 2. Database Not Provisioned (BLOCKER)

**Problem**: No Vercel Postgres attached to project
**Impact**: App crashes on any data operation
**Fix**: 15 minutes — provision via Vercel dashboard
**Needs Eli**: No — can do after auth decision

---

### 3. Domain DNS Not Configured (BLOCKER)

**Problem**: allsquared.io DNS not pointing to Vercel
**Impact**: Custom domain won't work
**Fix**: 10 minutes + propagation time
**Needs Eli**: Yes — Hostinger credentials or manual DNS update

---

## ⚠️ Soft Blockers

### 4. Firebase Storage Not Configured

**Problem**: No Firebase project for file uploads
**Impact**: Users can't upload milestone deliverables
**Fix**: 30 minutes setup
**Needs Eli**: No — but need billing for production

---

### 5. Missing ENV Variables

**Problem**: Multiple required env vars not set
**Impact**: Build/runtime failures
**Fix**: 10 minutes once values available
**Needs Eli**: Partially — Clerk keys after account creation

---

## ✅ Not Blocking

| Item | Status |
|------|--------|
| Codebase quality | ✅ Clean, TypeScript, 168 files |
| GitHub connection | ✅ Nakamoto-Labs/allsquared |
| Vercel project | ✅ Exists, configured |
| vercel.json | ✅ Correct settings |
| Database schema | ✅ 17 tables defined |
| Build config | ✅ pnpm + Vite + esbuild |

---

## Action Items for Eli

### Required Decisions

1. **Auth swap**: Confirm switching from Manus → Clerk
   - [ ] Decision: Yes/No
   - If yes, I'll implement in next session

2. **allsquared.io DNS**: Either:
   - [ ] Share Hostinger credentials, or
   - [ ] Manually add DNS records (I'll provide exact values)

3. **allsquared.uk**: Where is this domain?
   - [ ] Cloudflare
   - [ ] Hostinger  
   - [ ] Somewhere else

### Tasks I Can Do (No Input Needed)

Once auth decision made:
- [ ] Implement Clerk (if approved)
- [ ] Provision Vercel Postgres
- [ ] Push database schema
- [ ] Set up Firebase Storage
- [ ] Configure all ENV vars
- [ ] Trigger first production deploy
- [ ] Add domains in Vercel

---

## Timeline Estimate

| Phase | Time | Blocker Owner |
|-------|------|---------------|
| Auth decision | 5 min | Eli |
| Clerk implementation | 4-6 hours | Me |
| Database setup | 15 min | Me |
| Firebase setup | 30 min | Me |
| DNS configuration | 10 min + propagation | Eli (or creds) |
| Testing & fixes | 1 hour | Me |
| **Total after blockers resolved** | **6-8 hours** | - |

---

## Go-Live Checklist

Once blockers resolved:

- [ ] Auth system working (Clerk or alternative)
- [ ] Database provisioned and migrated
- [ ] Firebase Storage configured
- [ ] All ENV vars set in Vercel
- [ ] First successful deploy
- [ ] allsquared.io DNS pointing to Vercel
- [ ] SSL certificate issued
- [ ] Test: signup → create contract → add milestone
- [ ] 🚀 **LIVE**

---

*Last Updated: 2025-01-21*
