# AllSquared - Product Requirements Document

**Version:** 1.0  
**Date:** October 27, 2025  
**Author:** Nakamoto Labs

---

## 8. Integration Requirements

### 8.1 OpenAI Integration

**Purpose:** AI contract generation and dispute mediation  
**API Key:** Required  
**Model:** GPT-4 Turbo  
**Estimated Cost:** $0.01-0.03 per contract generation

**Implementation:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContract(params: ContractGenerationRequest): Promise<Contract> {
  // Implementation as shown in Feature 2
}

export async function analyzeDispute(params: DisputeAnalysis): Promise<MediationSuggestion> {
  // Implementation as shown in Feature 7
}
```

### 8.2 Stripe Integration

**Purpose:** Payment processing and payouts  
**API Keys:** Publishable Key + Secret Key  
**Webhook Secret:** Required for event handling

**Setup:**
1. Create Stripe account
2. Enable Stripe Connect for provider payouts
3. Configure webhook endpoints
4. Set up payment methods
5. Configure subscription products

**Webhook Events:**
- payment_intent.succeeded
- payment_intent.failed
- transfer.created
- transfer.failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

### 8.3 Escrow Provider Integration

**Primary:** Riverside Escrow  
**API Documentation:** Request from Riverside  
**Authentication:** API Key

**Endpoints:**
- POST /api/v1/escrow/create
- POST /api/v1/escrow/deposit
- POST /api/v1/escrow/release
- POST /api/v1/escrow/refund
- GET /api/v1/escrow/:id/balance

**Webhook Events:**
- escrow.created
- escrow.funded
- escrow.released
- escrow.refunded

### 8.4 Email Service (SendGrid/Resend)

**Purpose:** Transactional emails and notifications

**Email Types:**
- Welcome email
- Email verification
- Contract notifications
- Payment confirmations
- Dispute alerts
- LITL booking confirmations

**Templates:**
- Create branded email templates
- Use dynamic content
- Include CTAs
- Mobile-responsive

### 8.5 SMS Service (Twilio)

**Purpose:** Urgent notifications and 2FA

**Use Cases:**
- Milestone approval required
- Payment received
- Dispute opened
- 2FA codes
- Urgent system alerts

---

## 9. Security & Compliance

### 9.1 Data Protection (GDPR)

**Requirements:**
- Data processing lawful basis
- User consent management
- Right to access
- Right to erasure
- Right to portability
- Data breach notification
- Privacy by design

**Implementation:**
```typescript
// GDPR Compliance Features

// 1. Data Export
async function exportUserData(userId: string): Promise<UserDataExport> {
  const user = await getUser(userId);
  const contracts = await getUserContracts(userId);
  const milestones = await getUserMilestones(userId);
  const payments = await getUserPayments(userId);
  const notifications = await getUserNotifications(userId);

  return {
    user,
    contracts,
    milestones,
    payments,
    notifications,
    exportedAt: new Date(),
  };
}

// 2. Data Erasure
async function deleteUserData(userId: string): Promise<void> {
  // Anonymize instead of delete for legal/audit requirements
  await db.update(users)
    .set({
      name: 'Deleted User',
      email: `deleted_${userId}@allsquared.uk`,
      phone: null,
      address: null,
    })
    .where(eq(users.id, userId));

  // Delete non-essential data
  await db.delete(notifications).where(eq(notifications.userId, userId));
  await db.delete(notificationPreferences).where(eq(notificationPreferences.userId, userId));

  // Keep contracts for legal compliance but anonymize
  await db.update(contracts)
    .set({ clientName: 'Anonymous', providerName: 'Anonymous' })
    .where(or(
      eq(contracts.clientId, userId),
      eq(contracts.providerId, userId)
    ));
}

// 3. Consent Management
async function updateConsent(userId: string, consents: ConsentPreferences): Promise<void> {
  await db.update(userProfiles)
    .set({
      marketingConsent: consents.marketing ? 'yes' : 'no',
      analyticsConsent: consents.analytics ? 'yes' : 'no',
      thirdPartyConsent: consents.thirdParty ? 'yes' : 'no',
    })
    .where(eq(userProfiles.userId, userId));
}
```

### 9.2 Payment Security (PCI DSS)

**Compliance Level:** SAQ A (Stripe handles card data)

**Requirements:**
- No card data stored on servers
- Use Stripe.js for tokenization
- HTTPS for all transactions
- Secure API key storage
- Regular security audits

### 9.3 Legal Compliance

**UK Legal Services Compliance:**
- Operate within unreserved activities
- Clear disclaimers on AI-generated content
- LITL lawyers must be SRA-regulated
- Escrow providers must be FCA-authorised
- Terms of Service compliance

**Contract Enforceability:**
- Electronic Signatures Regulations 2002
- Electronic Communications Act 2000
- Consumer Rights Act 2015
- Unfair Contract Terms Act 1977

---

## 10. Performance Requirements

### 10.1 Response Time Targets

| Operation | Target | Max Acceptable |
|-----------|--------|----------------|
| Page Load | < 1s | < 2s |
| API Response | < 200ms | < 500ms |
| Contract Generation | < 5s | < 10s |
| Payment Processing | < 3s | < 5s |
| File Upload | < 2s | < 5s |

### 10.2 Scalability Targets

**Year 1:**
- 10,000 users
- 50,000 contracts
- 100,000 milestones
- £10M in escrow volume

**Year 3:**
- 100,000 users
- 500,000 contracts
- 1,000,000 milestones
- £100M in escrow volume

### 10.3 Optimization Strategies

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets
- Service worker caching

**Backend:**
- Database indexing
- Query optimization
- Redis caching
- Connection pooling
- Horizontal scaling

**Database:**
- Read replicas
- Partitioning
- Archiving old data
- Query optimization

---

## 11. Testing Strategy

### 11.1 Testing Pyramid

```
        /\
       /  \         E2E Tests (10%)
      /____\
     /      \       Integration Tests (30%)
    /________\
   /          \     Unit Tests (60%)
  /______________\
```

### 11.2 Unit Testing

**Tools:** Vitest + React Testing Library  
**Coverage Targets:**
- Business logic: 90%+
- API procedures: 85%+
- UI components: 70%+

**Example:**
```typescript
// server/routers/__tests__/contracts.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createCaller } from '../_core/trpc';
import { appRouter } from '../routers';

describe('Contracts Router', () => {
  let caller: ReturnType<typeof createCaller>;

  beforeEach(() => {
    caller = createCaller({
      user: { id: 'test-user-id', role: 'user' },
      req: {} as any,
      res: {} as any,
    });
  });

  it('should create a new contract', async () => {
    const result = await caller.contracts.create({
      title: 'Test Contract',
      description: 'Test description',
      category: 'freelance',
      totalAmount: 1000,
      content: { sections: [] },
    });

    expect(result.contractId).toBeDefined();
    expect(result.contract.title).toBe('Test Contract');
  });

  it('should not allow unauthorized contract access', async () => {
    await expect(
      caller.contracts.get({ id: 'other-user-contract' })
    ).rejects.toThrow('Unauthorized');
  });
});
```

### 11.3 Integration Testing

**Tools:** Vitest + Supertest

**Test Scenarios:**
- End-to-end contract creation flow
- Payment processing with Stripe test mode
- Escrow integration (mocked)
- Email sending (mocked)
- Webhook handling

### 11.4 E2E Testing

**Tools:** Playwright

**Critical User Journeys:**
1. Sign up → Create contract → Send for signature → Sign → Fund escrow
2. Create milestone → Submit → Approve → Receive payment
3. Open dispute → AI mediation → Resolution
4. Request LITL → Book lawyer → Complete consultation

---

## 12. Deployment & DevOps

### 12.1 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID}}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 12.2 Environment Configuration

**Environments:**
1. Development - Local development
2. Staging - Pre-production testing
3. Production - Live environment

**Environment Variables:**
```bash
# Development
DATABASE_URL=mysql://localhost:3306/allsquared_dev
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-test-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Staging
DATABASE_URL=mysql://staging.db.allsquared.uk:3306/allsquared
REDIS_URL=redis://staging.redis.allsquared.uk:6379
OPENAI_API_KEY=sk-test-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Production
DATABASE_URL=mysql://prod.db.allsquared.uk:3306/allsquared
REDIS_URL=redis://prod.redis.allsquared.uk:6379
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 12.3 Monitoring & Logging

**Tools:**
- Application Monitoring: Sentry
- Performance Monitoring: Vercel Analytics
- Log Management: Logtail or Papertrail
- Uptime Monitoring: UptimeRobot
- Error Tracking: Sentry

**Metrics to Track:**
- Response times
- Error rates
- User signups
- Contract creations
- Payment volumes
- Dispute rates
- API usage

---

## 13. Roadmap & Milestones

### 13.1 MVP (Months 1-3)

**Goal:** Launch functional platform with core features

**Features:**
- ✅ User authentication
- ✅ Basic dashboard
- 🔄 Contract creation (templates)
- 🔄 Milestone management
- 🔄 Basic escrow integration
- 🔄 Contract signing
- 🔄 Payment processing

**Success Criteria:**
- 100 beta users
- 500 contracts created
- £50K in escrow volume
- < 5% error rate

### 13.2 Phase 2 (Months 4-6)

**Goal:** Add AI features and improve UX

**Features:**
- AI contract generation
- Dispute resolution system
- LITL lawyer network (10 lawyers)
- Mobile-responsive improvements
- Advanced notifications
- Analytics dashboard

**Success Criteria:**
- 1,000 users
- 5,000 contracts
- £500K in escrow volume
- 50+ active lawyers
- 4.5+ star rating

### 13.3 Phase 3 (Months 7-12)

**Goal:** Scale and expand features

**Features:**
- Mobile apps (iOS + Android)
- Advanced analytics
- Team/business accounts
- API for integrations
- Multi-currency support
- International expansion (Australia)

**Success Criteria:**
- 10,000 users
- 50,000 contracts
- £5M in escrow volume
- 100+ lawyers
- Break-even

### 13.4 Phase 4 (Year 2+)

**Goal:** Market leadership and profitability

**Features:**
- AI-powered contract negotiation
- Smart contract integration (blockchain)
- Insurance products
- Marketplace for services
- White-label solution
- US market expansion

**Success Criteria:**
- 100,000 users
- 500,000 contracts
- £50M in escrow volume
- Profitability
- Series A funding

---

## 14. Success Metrics

### 14.1 Key Performance Indicators (KPIs)

**User Acquisition:**
- Monthly Active Users (MAU)
- New signups per month
- Conversion rate (visitor → signup)
- User retention rate

**Engagement:**
- Contracts created per user
- Average contract value
- Milestone completion rate
- Time to contract execution

**Revenue:**
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- LTV:CAC ratio

**Platform Health:**
- Dispute rate (target: < 5%)
- Payment success rate (target: > 98%)
- Contract completion rate (target: > 85%)
- User satisfaction score (target: > 4.5/5)

**Operational:**
- API response time
- Error rate
- Uptime (target: 99.9%)
- Support ticket resolution time

### 14.2 Success Targets

**Year 1:**
- 10,000 users
- 50,000 contracts
- £10M escrow volume
- £500K revenue
- 4.5+ star rating

**Year 3:**
- 100,000 users
- 500,000 contracts
- £100M escrow volume
- £5M revenue
- Market leader in UK

**Year 5:**
- 1M users
- 5M contracts
- £1B escrow volume
- £50M revenue
- International presence

---

## 15. Appendices

### 15.1 Glossary

**Terms:**
- **Escrow:** Third-party holding of funds until conditions are met
- **Milestone:** Defined project checkpoint with associated payment
- **LITL:** Lawyer-in-the-Loop, premium legal consultation service
- **FCA:** Financial Conduct Authority (UK regulator)
- **SRA:** Solicitors Regulation Authority (UK legal regulator)
- **tRPC:** TypeScript RPC framework for type-safe APIs
- **Drizzle ORM:** TypeScript ORM for database operations

### 15.2 References

**Legal & Regulatory:**
- [SRA Unreserved Legal Activities](https://www.sra.org.uk/)
- [FCA Authorised Firms](https://www.fca.org.uk/)
- [UK GDPR Guidelines](https://ico.org.uk/)
- [Electronic Signatures Regulations 2002](https://www.legislation.gov.uk/)

**Technical:**
- [React Documentation](https://react.dev/)
- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Stripe API](https://stripe.com/docs/api)
- [OpenAI API](https://platform.openai.com/docs)

**Market Research:**
- [UK Freelance Market Report 2024](https://www.ipse.co.uk/)
- [Home Improvement Market Analysis](https://www.statista.com/)
- [Legal Tech Market Trends](https://www.legalexecutiveinstitute.com/)

### 15.3 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-27 | Initial PRD | Nakamoto Labs |

---

## Document Approval

**Prepared by:** Nakamoto Labs  
**Reviewed by:** [Pending]  
**Approved by:** [Pending]  
**Date:** October 27, 2025

---

## UI Reference: Dashboard Component

```tsx
export default function Dashboard() {
  const { user } = useAuth();
  const { data: overview } = trpc.dashboard.overview.useQuery();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your contracts
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.stats.activeContracts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              £{(overview?.stats.pendingPayments / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.stats.upcomingMilestones}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              £{(overview?.stats.totalEarned / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Contracts</CardTitle>
          <Button variant="ghost" asChild>
            <Link href="/contracts">View All →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overview?.recentContracts.map(contract => (
              <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{contract.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {contract.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    £{(contract.totalAmount / 100).toFixed(2)}
                  </span>
                  <Badge variant={
                    contract.status === 'active' ? 'default' :
                    contract.status === 'completed' ? 'success' : 'secondary'
                  }>
                    {contract.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Milestones</CardTitle>
          <Button variant="ghost" asChild>
            <Link href="/milestones">View All →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overview?.upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Due {formatDate(milestone.dueDate)}
                  </p>
                </div>
                <span className="font-semibold">
                  £{(milestone.amount / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

**END OF DOCUMENT**
