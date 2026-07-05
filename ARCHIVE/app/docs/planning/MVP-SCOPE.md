# AllSquared MVP Scope

**Version**: 1.0  
**Date**: January 2025  
**Status**: Draft for Review

---

## Bottom Line Up Front

**Launch with less**. The PRD describes a full platform with 17 database tables and 168 files. That's over-built for launch. The core hypothesis is: *"UK freelancers will pay for contract + escrow protection."*

**MVP should test this with**:
1. AI contract creation (one template type)
2. Contract signing (native, not DocuSign)
3. Milestone tracking (basic)
4. Escrow integration (via Transpact API)
5. Dashboard (minimal)

**Leave for later**:
- LITL lawyer network
- Dispute resolution (AI or human)
- Multiple contract templates
- Admin panel
- Mobile apps
- API access

---

## 1. Essential Features (Must Launch)

### 1.1 User Authentication
**Status**: ✅ Implemented (Manus OAuth)

**Scope**:
- Sign up / Sign in via Manus OAuth
- Email/password fallback (if Manus fails)
- User profile (name, email, business name)
- User type selection (Provider / Client)

**Not needed for launch**:
- ❌ Social logins (Google, Apple)
- ❌ Multi-factor authentication
- ❌ Team accounts

### 1.2 Contract Creation
**Status**: 🔄 Partially built

**Scope**:
- ONE contract template: **Freelance Services**
- AI-assisted generation (OpenAI)
- 5-7 question wizard flow:
  1. What's the project? (description)
  2. Who's the client? (name, email)
  3. What are you delivering? (scope)
  4. When is it due? (timeline)
  5. How much? (total amount)
  6. Payment structure? (upfront/milestones/completion)
  7. Any special terms? (optional)
- Preview before finalization
- Edit capability
- PDF export

**Not needed for launch**:
- ❌ Multiple template types (home improvement, events, trades)
- ❌ Template marketplace
- ❌ Version control
- ❌ Contract analytics
- ❌ Natural language "describe your project" flow

### 1.3 Milestone Management
**Status**: 📋 Designed, needs implementation

**Scope**:
- Add milestones during contract creation
- Simple states: Pending → In Progress → Submitted → Approved → Paid
- Milestone list view on contract page
- File upload for deliverables (1 file per milestone)
- Client approval/rejection buttons
- Notes on rejection

**Not needed for launch**:
- ❌ Kanban board view
- ❌ Timeline view
- ❌ Automatic notifications (email OK, not in-app real-time)
- ❌ Multiple file uploads
- ❌ Comments/feedback thread

### 1.4 Contract Signing
**Status**: 📋 Needs implementation

**Scope**:
- Native e-signature (no DocuSign)
- Type-your-name signature (simple)
- Checkbox consent: "I agree to sign electronically"
- IP address + timestamp capture
- Email notification to counterparty
- Both parties must sign before "Active"

**Not needed for launch**:
- ❌ Canvas signature drawing
- ❌ DocuSign integration
- ❌ Signature image upload
- ❌ Multi-party (>2) signing

### 1.5 Escrow Integration
**Status**: 📋 Needs implementation (CRITICAL)

**Scope**:
- Integration with Transpact (or similar FCA provider)
- Deposit flow:
  1. Contract signed
  2. Client prompted to fund escrow
  3. Stripe payment intent created
  4. Funds held by escrow provider
- Release flow:
  1. Milestone approved
  2. Escrow release triggered
  3. Funds transferred to provider's bank

**Not needed for launch**:
- ❌ Bank transfer option (Stripe only)
- ❌ Payment plans
- ❌ Partial releases
- ❌ Refund flows (manual for v1)

### 1.6 Basic Dashboard
**Status**: 📋 Needs implementation

**Scope**:
- Simple stats:
  - Active contracts count
  - Total value in escrow
  - Pending approvals
- Contract list with filters (All / Active / Completed)
- Click to view contract detail
- "Create New Contract" button

**Not needed for launch**:
- ❌ Analytics charts
- ❌ Revenue tracking
- ❌ Activity feed
- ❌ Notifications center

### 1.7 Email Notifications
**Status**: 📋 Needs implementation

**Scope**:
- Transactional emails (SendGrid/Resend):
  - Contract invitation: "You've been invited to sign"
  - Contract signed: "Contract is now active"
  - Milestone submitted: "Deliverable ready for review"
  - Milestone approved: "Payment released"
- Simple templates, no HTML complexity

**Not needed for launch**:
- ❌ In-app notifications
- ❌ SMS notifications
- ❌ Push notifications
- ❌ Notification preferences UI

---

## 2. Nice-to-Have (Post-Launch)

### Phase 2 (Months 2-3)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **Multiple templates** | HIGH | MEDIUM | Home improvement, events |
| **In-app notifications** | MEDIUM | MEDIUM | Real-time updates |
| **Dispute flow (basic)** | MEDIUM | HIGH | Just open/close, no AI |
| **Contract search** | MEDIUM | LOW | Full-text search |
| **PDF download** | MEDIUM | LOW | Signed contract as PDF |

### Phase 3 (Months 4-6)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **Xero integration** | HIGH | HIGH | Contract → Invoice sync |
| **LITL referrals** | MEDIUM | HIGH | Lawyer booking flow |
| **AI dispute mediation** | MEDIUM | HIGH | Complex to get right |
| **Payment plans** | MEDIUM | MEDIUM | High-value projects |
| **Admin panel** | LOW | HIGH | Internal tooling |

### Phase 4 (6+ Months)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **Mobile app** | MEDIUM | VERY HIGH | React Native |
| **API access** | LOW | HIGH | Enterprise feature |
| **White-label** | LOW | HIGH | Agency reselling |
| **Multi-currency** | LOW | MEDIUM | International expansion |

---

## 3. Feature Prioritization Matrix

### Impact vs Effort Grid

```
                    HIGH IMPACT
                         │
    ┌────────────────────┼────────────────────┐
    │ QUICK WINS         │ MAJOR PROJECTS     │
    │                    │                    │
    │ • Contract PDF     │ • Escrow ⭐        │
    │ • Contract search  │ • Multiple temps   │
    │ • Email notifs ⭐  │ • Xero integration │
    │                    │ • LITL network     │
    │                    │                    │
LOW ├────────────────────┼────────────────────┤ HIGH
EFFORT                   │                    EFFORT
    │ FILL-INS           │ MONEY PITS         │
    │                    │                    │
    │ • Dark mode        │ • Mobile app       │
    │ • Analytics        │ • AI disputes      │
    │                    │ • API access       │
    │                    │ • Admin panel      │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    LOW IMPACT
```

### MVP Priority Order

1. **Contract Creation** — Core value prop
2. **Contract Signing** — Required for legal validity
3. **Escrow Integration** — Key differentiator (test hypothesis)
4. **Milestone Tracking** — Payment release trigger
5. **Dashboard** — User orientation
6. **Email Notifications** — Critical for counterparty flow

---

## 4. Critical User Journeys

### Journey 1: Provider Creates Contract
**Frequency**: Every new project
**Value**: Core of the product

```
Provider lands on dashboard
    ↓
Clicks "New Contract"
    ↓
Selects "Freelance Services" template
    ↓
Answers 5-7 questions (wizard)
    ↓
Reviews AI-generated contract
    ↓
Edits if needed
    ↓
Adds milestones (optional)
    ↓
Clicks "Send to Client"
    ↓
Signs contract (their signature)
    ↓
Client receives email invitation
```

**MVP Requirements**:
- [ ] Wizard flow UI
- [ ] OpenAI integration for contract generation
- [ ] Contract preview/edit
- [ ] Milestone creation UI
- [ ] Email send on contract creation

### Journey 2: Client Signs & Funds
**Frequency**: Every contract
**Value**: Revenue trigger (escrow fees)

```
Client receives email
    ↓
Clicks link, lands on contract view
    ↓
Reviews contract terms
    ↓
Signs (type name + consent)
    ↓
Prompted to fund escrow
    ↓
Stripe checkout flow
    ↓
Payment confirmed
    ↓
Contract status → "Active"
    ↓
Provider notified via email
```

**MVP Requirements**:
- [ ] Contract view page (no auth required for signing)
- [ ] E-signature component
- [ ] Stripe payment intent integration
- [ ] Escrow deposit API call
- [ ] Status update logic
- [ ] Confirmation emails

### Journey 3: Provider Submits Milestone
**Frequency**: Per milestone
**Value**: Progress visibility, payment release

```
Provider opens active contract
    ↓
Clicks on milestone
    ↓
Uploads deliverable file
    ↓
Adds completion notes
    ↓
Clicks "Submit for Review"
    ↓
Client notified via email
    ↓
Milestone status → "Submitted"
```

**MVP Requirements**:
- [ ] Milestone detail view
- [ ] File upload to Firebase/S3
- [ ] Notes input
- [ ] Submit action
- [ ] Email notification

### Journey 4: Client Approves & Releases Payment
**Frequency**: Per milestone
**Value**: Core escrow value prop

```
Client receives "Deliverable ready" email
    ↓
Clicks link, lands on milestone view
    ↓
Reviews deliverable (downloads file)
    ↓
Clicks "Approve" or "Request Changes"
    ↓
If approved:
    ↓
Escrow release triggered
    ↓
Provider receives funds (T+2)
    ↓
Confirmation emails sent
```

**MVP Requirements**:
- [ ] Milestone review view
- [ ] File download
- [ ] Approve/Reject buttons
- [ ] Rejection reason input
- [ ] Escrow release API call
- [ ] Confirmation emails

---

## 5. What NOT to Build Yet

### Red Zone: Don't Build

| Feature | Why Not | When |
|---------|---------|------|
| **AI Dispute Resolution** | Complex, liability risk, low frequency | Phase 3+ |
| **Mobile App** | Web works fine, high effort | Phase 4+ |
| **Multi-currency** | UK focus first, FX complexity | Year 2 |
| **Admin Panel** | Can use DB directly initially | Phase 3 |
| **API Access** | No enterprise customers yet | Phase 4 |
| **Team/Agency Features** | Solo freelancers first | Phase 3 |
| **Lawyer Network (LITL)** | Supply-side chicken/egg | Phase 3 |

### Yellow Zone: Defer

| Feature | Why Defer | Notes |
|---------|-----------|-------|
| **Multiple contract templates** | Focus on one, validate | Add after 100 customers |
| **In-app notifications** | Email works for launch | Nice UX improvement later |
| **Contract versioning** | Edge case initially | Add when requested |
| **Advanced milestones** | Kanban etc. is polish | Simple list is fine |
| **Bank transfer payments** | Stripe covers most | Add if conversion issue |

### Green Zone: Build Now

| Feature | Why Now |
|---------|---------|
| **Freelance contract template** | Core value |
| **Escrow integration** | Differentiator, test hypothesis |
| **Native e-signature** | Required for legal validity |
| **Stripe payments** | Revenue |
| **Basic dashboard** | User orientation |
| **Email notifications** | Critical for counterparty flow |

---

## 6. Technical Scope for MVP

### Database Tables Needed

From the 17 tables in the PRD, **use these 6 for MVP**:

| Table | Purpose | Status |
|-------|---------|--------|
| `users` | Authentication | ✅ Exists |
| `contracts` | Contract data | ✅ Exists |
| `contractTemplates` | Template storage | ✅ Exists (seed 1 template) |
| `milestones` | Milestone tracking | ✅ Exists |
| `contractSignatures` | Signature records | ⚠️ May need to add |
| `escrowTransactions` | Payment records | ✅ Exists |

**Don't need yet**:
- `disputes` — No disputes in v1
- `litlReferrals` — No lawyers in v1
- `notifications` — Email only in v1
- `lawyers` — No LITL in v1
- `mediationRecords` — No AI mediation in v1

### API Endpoints Needed

**Auth** (mostly exists):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Contracts**:
- `POST /api/contracts/generate` — AI contract creation
- `GET /api/contracts/:id` — Get contract detail
- `PUT /api/contracts/:id` — Update contract
- `POST /api/contracts/:id/send` — Send to counterparty
- `GET /api/contracts` — List user's contracts

**Milestones**:
- `POST /api/contracts/:id/milestones` — Add milestone
- `PUT /api/milestones/:id` — Update milestone
- `POST /api/milestones/:id/submit` — Submit for review
- `POST /api/milestones/:id/approve` — Approve milestone
- `POST /api/milestones/:id/reject` — Reject milestone

**Signatures**:
- `POST /api/contracts/:id/sign` — Sign contract

**Payments/Escrow**:
- `POST /api/payments/create-intent` — Stripe payment intent
- `POST /api/payments/confirm` — Confirm and deposit to escrow
- `POST /api/payments/release` — Release escrow to provider

### Third-Party Integrations

| Service | Purpose | Priority | Complexity |
|---------|---------|----------|------------|
| **OpenAI** | Contract generation | CRITICAL | LOW |
| **Stripe** | Payment processing | CRITICAL | MEDIUM |
| **Transpact/Escrow** | Fund holding | CRITICAL | HIGH |
| **SendGrid/Resend** | Transactional email | HIGH | LOW |
| **Firebase** | File storage | HIGH | LOW |

### Frontend Pages Needed

| Page | Route | Priority |
|------|-------|----------|
| Landing | `/` | HIGH |
| Sign In/Up | `/auth` | HIGH |
| Dashboard | `/dashboard` | HIGH |
| Create Contract | `/contracts/new` | CRITICAL |
| View Contract | `/contracts/:id` | CRITICAL |
| Sign Contract | `/sign/:token` | CRITICAL |
| Fund Escrow | `/fund/:contractId` | CRITICAL |
| Milestone Detail | `/milestones/:id` | HIGH |
| Profile/Settings | `/settings` | MEDIUM |

---

## 7. MVP Launch Checklist

### Week 1: Foundation
- [ ] Deploy to allsquared.io (Vercel)
- [ ] Database provisioned (Postgres)
- [ ] Auth working (Manus or fallback)
- [ ] Basic dashboard renders

### Week 2: Contract Flow
- [ ] Contract creation wizard
- [ ] OpenAI contract generation
- [ ] Contract preview/edit
- [ ] Milestone creation
- [ ] Contract send (email to counterparty)

### Week 3: Signing & Escrow
- [ ] Signature page (no auth required)
- [ ] Native e-signature capture
- [ ] Stripe payment flow
- [ ] Escrow partner integration
- [ ] Contract status updates

### Week 4: Milestone & Polish
- [ ] Milestone submission
- [ ] Client approval/rejection
- [ ] Escrow release on approval
- [ ] Email notifications (all flows)
- [ ] Bug fixes, edge cases

### Pre-Launch
- [ ] Security review
- [ ] Test with 5 beta users
- [ ] Legal review of contract template
- [ ] Privacy policy / ToS
- [ ] Error monitoring (Sentry)

---

## 8. Success Criteria for MVP

**Launch is successful if**:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Site is live | ✓ | allsquared.io resolves |
| Users can sign up | ✓ | 10+ successful registrations |
| Contracts can be created | ✓ | 5+ contracts created |
| Contracts can be signed | ✓ | 3+ contracts signed by both parties |
| Escrow can be funded | ✓ | 1+ escrow deposit |
| Milestones can be approved | ✓ | 1+ milestone approved with payment |
| No critical bugs | ✓ | 0 data loss or security issues |

**Post-launch success (Month 1)**:

| Metric | Target |
|--------|--------|
| Signed contracts | 20+ |
| Escrow volume | £5K+ |
| Paying customers | 10+ |
| NPS (survey) | 30+ |

---

## Summary: The 80/20 MVP

**Build this (20%)**:
1. Freelance contract template with AI
2. Simple e-signature
3. Escrow deposit/release
4. Basic milestone tracking
5. Email notifications
6. Simple dashboard

**Not this (80% of PRD)**:
- ❌ Multiple templates
- ❌ LITL lawyers
- ❌ AI disputes
- ❌ Admin panel
- ❌ Mobile apps
- ❌ API access
- ❌ Advanced analytics
- ❌ In-app notifications
- ❌ DocuSign integration
- ❌ Payment plans

**Time to MVP**: 4-6 weeks (solo developer)  
**Validation milestone**: 100 paying customers using escrow

---

*Last updated: January 2025*
