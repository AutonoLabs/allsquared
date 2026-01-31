# AllSquared Platform - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** October 27, 2025  
**Author:** Nakamoto Labs  
**Status:** Draft

---

## Executive Summary

AllSquared is a comprehensive legal technology platform that combines AI-powered contract generation, FCA-backed escrow services, and milestone-based project management to serve the UK's £30 billion freelance and home services market. This PRD outlines the complete technical specifications, features, and implementation roadmap for building a production-ready platform.

### Vision
To become the UK's leading platform for secure service contracts, protecting 1 million+ freelancers and service providers by 2027.

### Mission
Eliminate payment disputes and project failures through integrated contracts, escrow, and milestone management.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Personas](#2-user-personas)
3. [Core Features](#3-core-features)
4. [Technical Architecture](#4-technical-architecture)
5. [Database Schema](#5-database-schema)
6. [API Specifications](#6-api-specifications)
7. [User Interface Specifications](#7-user-interface-specifications)
8. [Integration Requirements](#8-integration-requirements)
9. [Security & Compliance](#9-security--compliance)
10. [Performance Requirements](#10-performance-requirements)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment & DevOps](#12-deployment--devops)
13. [Roadmap & Milestones](#13-roadmap--milestones)
14. [Success Metrics](#14-success-metrics)
15. [Appendices](#15-appendices)

---

## 1. Product Overview

### 1.1 Problem Statement

The UK freelance and home services market faces critical challenges:

- **Payment Risk**: 67% of freelancers experience late or non-payment
- **Scope Creep**: Unclear deliverables lead to disputes in 43% of projects
- **Fragmented Solutions**: Users must juggle separate tools for contracts, payments, and dispute resolution
- **High Legal Costs**: Traditional legal services cost £200-500 per contract
- **Trust Deficit**: Both clients and providers lack confidence in transactions

### 1.2 Solution Overview

AllSquared provides an integrated platform with five core capabilities:

1. **AI Contract Generation** - Create legally-sound contracts in 3-5 minutes
2. **FCA-Backed Escrow** - Secure milestone-based payments with regulatory protection
3. **Milestone Management** - Track progress and automate payment releases
4. **AI Dispute Resolution** - Mediate conflicts with AI assistance
5. **LITL (Lawyer-in-the-Loop)** - Premium access to SRA-regulated solicitors

### 1.3 Target Market

**Primary Markets:**
- Freelancers & Contractors (4.4M in UK)
- Home Improvement Providers (£29.7B market)
- Event Service Providers
- Trade Services (plumbing, electrical, carpentry)

**Geographic Focus:** United Kingdom (Phase 1), expanding to Australia and US (Phase 2-3)

### 1.4 Business Model

**Revenue Streams:**
1. **Subscription Tiers**
   - Free: 1 contract/month, basic features
   - Starter: £9.99/month, 5 contracts, standard escrow
   - Professional: £29.99/month, unlimited contracts, priority support
   - Business: £99.99/month, team features, API access

2. **Transaction Fees**
   - Escrow: 2.5% of transaction value (min £2.50)
   - Payment processing: 1.5% + £0.20

3. **Premium Services**
   - LITL lawyer consultation: £49-199 per session
   - Custom contract review: £99-299
   - Dispute mediation: £149-499

**Unit Economics:**
- Average Revenue Per User (ARPU): £190/year
- Customer Acquisition Cost (CAC): £8.33
- Lifetime Value (LTV): £190
- LTV:CAC Ratio: 22.8:1
- Gross Margin: 56%

---

## 2. User Personas

### 2.1 Primary Personas

#### Persona 1: Sarah - Freelance Web Developer
- **Age:** 32
- **Location:** London
- **Income:** £45,000/year
- **Pain Points:**
  - Clients requesting "just one more thing" beyond scope
  - Delayed payments affecting cash flow
  - Time spent on contract admin instead of coding
- **Goals:**
  - Secure upfront deposits
  - Clear project scope
  - Automated payment collection
- **Tech Savviness:** High

#### Persona 2: Mike - Home Renovation Contractor
- **Age:** 45
- **Location:** Manchester
- **Income:** £60,000/year
- **Pain Points:**
  - Material costs paid upfront without client payment guarantee
  - Disputes over "completed" work quality
  - Complex payment schedules
- **Goals:**
  - Milestone-based payments
  - Protection against non-payment
  - Professional contracts without lawyer fees
- **Tech Savviness:** Medium

#### Persona 3: Emma - Event Planner
- **Age:** 29
- **Location:** Edinburgh
- **Income:** £38,000/year
- **Pain Points:**
  - Last-minute cancellations without compensation
  - Scope changes during event planning
  - Managing multiple vendor contracts
- **Goals:**
  - Cancellation protection
  - Clear deliverables and timelines
  - Vendor payment coordination
- **Tech Savviness:** High

### 2.2 Secondary Personas

#### Persona 4: David - Small Business Owner (Client)
- **Age:** 52
- **Location:** Birmingham
- **Income:** £80,000/year
- **Pain Points:**
  - Uncertainty about service provider quality
  - No recourse if work is substandard
  - Complex contract negotiations
- **Goals:**
  - Quality assurance
  - Payment protection until work completion
  - Simple contract process
- **Tech Savviness:** Medium

#### Persona 5: Lisa - Homeowner (Client)
- **Age:** 38
- **Location:** Bristol
- **Income:** £55,000/year (household)
- **Pain Points:**
  - Fear of contractor scams
  - Unclear project timelines
  - No protection if contractor abandons project
- **Goals:**
  - Verified contractors
  - Milestone-based payment release
  - Dispute resolution support
- **Tech Savviness:** Low-Medium

---

## 3. Core Features

### 3.1 Feature Priority Matrix

| Feature | Priority | Complexity | Impact | MVP Status |
|---------|----------|------------|--------|------------|
| User Authentication | P0 | Low | High | ✅ Implemented |
| Contract Generation | P0 | High | High | 🔄 In Progress |
| Milestone Management | P0 | Medium | High | 📋 Planned |
| Escrow Integration | P0 | High | High | 📋 Planned |
| Contract Signing | P0 | Medium | High | 📋 Planned |
| User Dashboard | P0 | Medium | High | 📋 Planned |
| Payment Processing | P1 | High | High | 📋 Planned |
| Notifications System | P1 | Medium | Medium | 📋 Planned |
| Dispute Resolution | P1 | High | Medium | 📋 Planned |
| LITL Referrals | P2 | Medium | Medium | 📋 Planned |
| Admin Panel | P2 | Medium | Low | 📋 Planned |
| Analytics Dashboard | P2 | Medium | Low | 📋 Planned |
| Mobile Apps | P3 | High | Medium | 📋 Future |
| API for Integrations | P3 | High | Low | 📋 Future |

---

### 3.2 Feature Specifications

## Feature 1: User Authentication & Onboarding

### 3.2.1 User Registration

**Requirements:**
- Email/password registration
- OAuth integration (Google, Microsoft, Apple)
- Manus OAuth for existing users
- Email verification required
- Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special char

**User Flow:**
1. User lands on homepage
2. Clicks "Sign Up" or "Join Waitlist"
3. Chooses registration method (email or OAuth)
4. Enters required information:
   - Full name
   - Email address
   - Password (if email registration)
   - User type (Freelancer/Service Provider or Client)
   - Business name (optional)
5. Accepts Terms of Service and Privacy Policy
6. Receives verification email
7. Clicks verification link
8. Redirected to onboarding flow

**API Endpoints:**
```typescript
POST /api/auth/register
Body: {
  name: string;
  email: string;
  password: string;
  userType: 'provider' | 'client';
  businessName?: string;
}
Response: {
  success: boolean;
  userId: string;
  message: string;
}

POST /api/auth/verify-email
Body: {
  token: string;
}
Response: {
  success: boolean;
  message: string;
}
```

**Database Schema:**
```sql
users table (already implemented):
- id: varchar(255) PRIMARY KEY
- name: varchar(255)
- email: varchar(255) UNIQUE
- role: enum('user', 'admin')
- loginMethod: varchar(50)
- lastSignedIn: datetime
- createdAt: datetime
- updatedAt: datetime

Additional fields needed:
- userType: enum('provider', 'client', 'both')
- businessName: varchar(255)
- phone: varchar(20)
- address: text
- verified: enum('yes', 'no')
- verificationToken: varchar(255)
- stripeCustomerId: varchar(255)
```

### 3.2.2 User Onboarding

**Requirements:**
- Progressive disclosure (collect info as needed)
- Skip option for non-critical fields
- Profile completion indicator
- Contextual help tooltips

**Onboarding Steps:**

**Step 1: Profile Setup**
- Upload profile photo
- Add business description
- Select service categories (for providers)
- Add location/service area

**Step 2: Verification (for providers)**
- Upload business registration documents
- Verify identity (passport/driver's license)
- Professional credentials (if applicable)
- Bank account verification for payouts

**Step 3: Preferences**
- Notification preferences
- Default contract terms
- Payment preferences
- Timezone and language

**UI Components:**
- Progress bar showing completion %
- "Skip for now" buttons
- Inline validation
- Success animations

---

## Feature 2: AI Contract Generation

### 3.2.3 Contract Templates

**Requirements:**
- 5 pre-built contract categories
- AI-powered customization
- Legal compliance verification
- Version control
- Template marketplace (future)

**Contract Categories:**

**1. Freelance Services Contract**
- Scope: Web development, design, writing, consulting, marketing
- Key Clauses:
  - Scope of work
  - Deliverables and timeline
  - Payment terms and milestones
  - Intellectual property rights
  - Confidentiality
  - Termination conditions
  - Dispute resolution
- Typical Value: £500-£50,000
- Duration: 1 week - 6 months

**2. Home Improvement Contract**
- Scope: Renovations, repairs, installations, landscaping
- Key Clauses:
  - Detailed work description
  - Materials and labor breakdown
  - Payment schedule (deposit + milestones)
  - Timeline and completion date
  - Warranty terms
  - Change order process
  - Permits and inspections
- Typical Value: £1,000-£100,000
- Duration: 1 week - 12 months

**3. Event Services Contract**
- Scope: Catering, photography, entertainment, venue, planning
- Key Clauses:
  - Event details (date, time, location)
  - Services provided
  - Equipment and setup
  - Cancellation policy
  - Force majeure clause
  - Payment schedule
  - Liability and insurance
- Typical Value: £500-£25,000
- Duration: Single event (1 day - 1 week)

**4. Trade Services Contract**
- Scope: Plumbing, electrical, HVAC, carpentry
- Key Clauses:
  - Work description
  - Materials specification
  - Labor costs
  - Warranty on work
  - Safety compliance
  - Insurance requirements
  - Payment terms
- Typical Value: £200-£10,000
- Duration: 1 day - 4 weeks

**5. Professional Services Contract**
- Scope: Legal, accounting, consulting, coaching
- Key Clauses:
  - Service description
  - Deliverables
  - Confidentiality
  - Professional standards
  - Liability limitations
  - Payment terms
  - Termination rights
- Typical Value: £500-£50,000
- Duration: 1 month - 12 months

**Database Schema:**
```sql
contractTemplates table (already implemented):
- id: varchar(255) PRIMARY KEY
- name: varchar(255)
- category: enum('freelance', 'home_improvement', 'events', 'trades', 'professional')
- description: text
- templateContent: longtext (JSON structure)
- isActive: enum('yes', 'no')
- version: varchar(50)
- createdAt: datetime
- updatedAt: datetime
```

### 3.2.4 AI Contract Builder

**Requirements:**
- Natural language input
- Smart field extraction
- Legal clause suggestions
- Real-time preview
- Compliance checking

**User Flow:**
1. User selects contract category
2. Chooses between:
   - **Quick Start**: Answer 5-7 key questions
   - **AI Chat**: Describe project in natural language
   - **Template**: Start from blank template
3. System extracts key information:
   - Parties involved
   - Scope of work
   - Timeline
   - Payment terms
   - Special conditions
4. AI generates contract draft
5. User reviews and edits
6. System highlights potential issues
7. User finalizes contract
8. Contract saved as draft

**AI Integration:**

**OpenAI GPT-4 Integration:**
```typescript
interface ContractGenerationRequest {
  category: string;
  projectDescription: string;
  parties: {
    provider: {
      name: string;
      businessName?: string;
      email: string;
    };
    client: {
      name: string;
      businessName?: string;
      email: string;
    };
  };
  scope: string;
  timeline: {
    startDate: string;
    endDate: string;
  };
  paymentTerms: {
    totalAmount: number;
    currency: string;
    paymentSchedule: 'upfront' | 'milestones' | 'completion';
  };
  additionalTerms?: string[];
}

async function generateContract(request: ContractGenerationRequest): Promise<Contract> {
  const prompt = `
    Generate a legally-sound ${request.category} contract for the UK jurisdiction.
    
    Parties:
    Provider: ${request.parties.provider.name}
    Client: ${request.parties.client.name}
    
    Project: ${request.projectDescription}
    Scope: ${request.scope}
    Timeline: ${request.timeline.startDate} to ${request.timeline.endDate}
    Payment: £${request.paymentTerms.totalAmount} (${request.paymentTerms.paymentSchedule})
    
    Include standard clauses for:
    - Scope of work
    - Payment terms
    - Timeline and deliverables
    - Intellectual property
    - Confidentiality
    - Termination
    - Dispute resolution
    - Governing law (UK)
    
    Format as structured JSON with sections and clauses.
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are a legal contract expert specializing in UK service contracts. Generate clear, enforceable contracts that protect both parties."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}
```

**API Endpoints:**
```typescript
POST /api/contracts/generate
Body: ContractGenerationRequest
Response: {
  contractId: string;
  content: ContractContent;
  suggestions: string[];
  warnings: string[];
}

POST /api/contracts/validate
Body: {
  contractId: string;
  content: ContractContent;
}
Response: {
  isValid: boolean;
  issues: Issue[];
  suggestions: string[];
}
```

---

## Feature 3: Milestone Management

### 3.2.5 Milestone Creation

**Requirements:**
- Flexible milestone structure
- Automatic payment calculation
- Progress tracking
- Approval workflow
- Payment release automation

**Milestone Types:**
1. **Fixed Milestones**: Predefined deliverables with set amounts
2. **Percentage-Based**: % of total project value
3. **Time-Based**: Weekly/monthly payments
4. **Hybrid**: Combination of above

**User Flow:**
1. During contract creation, user adds milestones
2. For each milestone:
   - Title/description
   - Deliverables
   - Due date
   - Payment amount
   - Approval criteria
3. System validates total = contract value
4. Milestones attached to contract
5. Both parties review and approve

**Database Schema:**
```sql
milestones table (already implemented):
- id: varchar(255) PRIMARY KEY
- contractId: varchar(255) FOREIGN KEY
- title: varchar(255)
- description: text
- amount: int (in pence)
- dueDate: datetime
- status: enum('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid')
- order: int
- deliverables: text (JSON array)
- approvalNotes: text
- submittedAt: datetime
- approvedAt: datetime
- paidAt: datetime
- createdAt: datetime
- updatedAt: datetime
```

### 3.2.6 Milestone Tracking

**Requirements:**
- Visual progress indicators
- Status updates
- File attachments for deliverables
- Comments/feedback
- Automatic notifications

**Milestone States:**
1. **Pending**: Not yet started
2. **In Progress**: Provider working on deliverable
3. **Submitted**: Provider submitted for approval
4. **Under Review**: Client reviewing submission
5. **Approved**: Client approved, payment processing
6. **Rejected**: Client rejected, requires revision
7. **Paid**: Payment released to provider

**State Transitions:**
```
Pending → In Progress (Provider starts work)
In Progress → Submitted (Provider submits deliverable)
Submitted → Under Review (Auto-transition)
Under Review → Approved (Client approves)
Under Review → Rejected (Client rejects)
Rejected → In Progress (Provider revises)
Approved → Paid (Payment processed)
```

**UI Components:**
- Kanban board view
- Timeline view
- List view with filters
- Progress bars
- Status badges
- Action buttons (Submit, Approve, Reject, Pay)

**API Endpoints:**
```typescript
GET /api/contracts/:contractId/milestones
Response: Milestone[]

POST /api/milestones/:id/submit
Body: {
  deliverables: File[];
  notes: string;
}
Response: {
  success: boolean;
  milestone: Milestone;
}

POST /api/milestones/:id/approve
Body: {
  notes: string;
}
Response: {
  success: boolean;
  milestone: Milestone;
  paymentInitiated: boolean;
}

POST /api/milestones/:id/reject
Body: {
  reason: string;
  feedback: string;
}
Response: {
  success: boolean;
  milestone: Milestone;
}
```

---

## Feature 4: Escrow & Payment Management

### 3.2.7 Escrow Integration

**Requirements:**
- FCA-authorised escrow provider integration
- Secure fund holding
- Automatic milestone-based releases
- Dispute protection
- Multi-currency support (future)

**Escrow Providers:**

**Primary: Riverside Escrow**
- FCA-authorised
- API integration available
- Fees: 0.5% + £2.50 per transaction
- Settlement: T+2 days

**Backup: Transpact**
- FCA-authorised
- API integration available
- Fees: 0.75% + £2.00 per transaction
- Settlement: T+1 days

**Integration Architecture:**
```typescript
interface EscrowProvider {
  createEscrowAccount(params: CreateEscrowParams): Promise<EscrowAccount>;
  depositFunds(accountId: string, amount: number): Promise<Transaction>;
  releaseFunds(accountId: string, milestoneId: string): Promise<Transaction>;
  refundFunds(accountId: string, reason: string): Promise<Transaction>;
  getBalance(accountId: string): Promise<number>;
  getTransactions(accountId: string): Promise<Transaction[]>;
}

class RiversideEscrowProvider implements EscrowProvider {
  private apiKey: string;
  private baseUrl: string;
  
  async createEscrowAccount(params: CreateEscrowParams): Promise<EscrowAccount> {
    const response = await fetch(`${this.baseUrl}/escrow/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contractId: params.contractId,
        parties: params.parties,
        totalAmount: params.totalAmount,
        milestones: params.milestones
      })
    });
    
    return response.json();
  }
  
  async releaseFunds(accountId: string, milestoneId: string): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/escrow/${accountId}/release`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        milestoneId,
        releaseType: 'milestone_completion'
      })
    });
    
    return response.json();
  }
}
```

**Database Schema:**
```sql
escrowTransactions table (already implemented):
- id: varchar(255) PRIMARY KEY
- contractId: varchar(255) FOREIGN KEY
- milestoneId: varchar(255) FOREIGN KEY (nullable)
- type: enum('deposit', 'release', 'refund', 'fee')
- amount: int (in pence)
- status: enum('pending', 'processing', 'completed', 'failed', 'cancelled')
- escrowAccountId: varchar(255)
- transactionReference: varchar(255)
- provider: varchar(50)
- metadata: text (JSON)
- createdAt: datetime
- updatedAt: datetime
```

### 3.2.8 Payment Processing

**Requirements:**
- Stripe integration for card payments
- Bank transfer support
- Payment plans
- Automatic invoicing
- Receipt generation

**Payment Flow:**

**Initial Deposit:**
1. Contract signed by both parties
2. Client prompted to fund escrow
3. Payment options displayed:
   - Credit/debit card (Stripe)
   - Bank transfer
   - Payment plan (for large amounts)
4. Client completes payment
5. Funds held in FCA-regulated escrow
6. Provider notified to begin work

**Milestone Payment Release:**
1. Provider submits milestone deliverable
2. Client reviews and approves
3. System initiates escrow release
4. Funds transferred to provider's account
5. Both parties receive confirmation
6. Invoice/receipt generated

**Stripe Integration:**
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(
  contractId: string,
  amount: number,
  customerId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to pence
    currency: 'gbp',
    customer: customerId,
    metadata: {
      contractId,
      type: 'escrow_deposit'
    },
    description: `Escrow deposit for contract ${contractId}`
  });
}

async function processPayoutToProvider(
  providerId: string,
  amount: number,
  milestoneId: string
): Promise<Stripe.Transfer> {
  const provider = await getUser(providerId);
  
  return await stripe.transfers.create({
    amount: amount * 100,
    currency: 'gbp',
    destination: provider.stripeConnectedAccountId,
    metadata: {
      milestoneId,
      type: 'milestone_payment'
    }
  });
}
```

**API Endpoints:**
```typescript
POST /api/payments/create-intent
Body: {
  contractId: string;
  amount: number;
}
Response: {
  clientSecret: string;
  paymentIntentId: string;
}

POST /api/payments/confirm
Body: {
  paymentIntentId: string;
  contractId: string;
}
Response: {
  success: boolean;
  escrowAccountId: string;
}

POST /api/payments/release
Body: {
  milestoneId: string;
  contractId: string;
}
Response: {
  success: boolean;
  transactionId: string;
  amount: number;
}
```

---

## Feature 5: Contract Signing & Execution

### 3.2.9 Digital Signatures

**Requirements:**
- Legally-binding e-signatures
- Multi-party signing workflow
- Audit trail
- PDF generation
- Email notifications

**E-Signature Provider: DocuSign API**

**Signing Flow:**
1. Contract finalized by creator
2. System generates PDF
3. Signing request sent to counterparty
4. Email notification with signing link
5. Counterparty reviews contract
6. Counterparty signs electronically
7. Both parties receive fully-executed copy
8. Contract status updated to "Active"

**DocuSign Integration:**
```typescript
import docusign from 'docusign-esign';

async function sendContractForSignature(
  contractId: string,
  signers: Signer[]
): Promise<string> {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
  
  const envelopeDefinition = {
    emailSubject: 'Please sign your AllSquared contract',
    documents: [{
      documentBase64: contractPdfBase64,
      name: `Contract-${contractId}.pdf`,
      fileExtension: 'pdf',
      documentId: '1'
    }],
    recipients: {
      signers: signers.map((signer, index) => ({
        email: signer.email,
        name: signer.name,
        recipientId: String(index + 1),
        routingOrder: String(index + 1),
        tabs: {
          signHereTabs: [{
            documentId: '1',
            pageNumber: '1',
            xPosition: '100',
            yPosition: '100'
          }]
        }
      }))
    },
    status: 'sent'
  };
  
  const envelopesApi = new docusign.EnvelopesApi(apiClient);
  const result = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID,
    { envelopeDefinition }
  );
  
  return result.envelopeId;
}
```

**Alternative: Native E-Signature**

For MVP, implement simple native e-signature:
- Canvas-based signature drawing
- Typed signature with font selection
- Uploaded signature image
- IP address and timestamp capture
- Consent checkbox

```typescript
interface Signature {
  userId: string;
  contractId: string;
  signatureData: string; // Base64 image or typed text
  signatureType: 'drawn' | 'typed' | 'uploaded';
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  consent: boolean;
}

async function signContract(
  contractId: string,
  userId: string,
  signature: Signature
): Promise<void> {
  // Validate signature
  if (!signature.consent) {
    throw new Error('User must consent to electronic signature');
  }
  
  // Save signature to database
  await db.insert(contractSignatures).values({
    id: generateId(),
    contractId,
    userId,
    signatureData: signature.signatureData,
    signatureType: signature.signatureType,
    ipAddress: signature.ipAddress,
    userAgent: signature.userAgent,
    signedAt: new Date(),
    consent: signature.consent
  });
  
  // Check if all parties have signed
  const signatures = await getContractSignatures(contractId);
  const contract = await getContract(contractId);
  const requiredSigners = [contract.clientId, contract.providerId];
  
  const allSigned = requiredSigners.every(signerId =>
    signatures.some(sig => sig.userId === signerId)
  );
  
  if (allSigned) {
    // Update contract status
    await updateContract(contractId, {
      status: 'active',
      signedAt: new Date()
    });
    
    // Generate final PDF
    await generateSignedContractPdf(contractId);
    
    // Send notifications
    await sendContractExecutedNotifications(contractId);
    
    // Prompt for escrow deposit
    await sendEscrowDepositRequest(contractId);
  }
}
```

---

## Feature 6: User Dashboard

### 3.2.10 Dashboard Overview

**Requirements:**
- Personalized dashboard based on user role
- Real-time data updates
- Quick actions
- Contract status overview
- Payment tracking
- Notifications center

**Dashboard Sections:**

**1. Overview Panel**
- Active contracts count
- Pending payments
- Upcoming milestones
- Recent activity feed
- Quick stats (total earned/spent, success rate)

**2. Contracts Section**
- List of all contracts
- Filters: Status, Date, Amount, Category
- Search functionality
- Bulk actions
- Export to CSV/PDF

**3. Payments Section**
- Payment history
- Pending releases
- Escrow balances
- Invoices and receipts
- Payment methods

**4. Milestones Section**
- Upcoming milestones
- Overdue milestones
- Recently completed
- Approval queue (for clients)

**5. Notifications Center**
- Unread notifications
- Activity feed
- Settings

**UI Wireframe:**
```
┌─────────────────────────────────────────────────────────┐
│  AllSquared Logo    Contracts  Payments  Profile  🔔    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Welcome back, Sarah! 👋                                │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Active   │  │ Pending  │  │ Upcoming │  │ Total   ││
│  │ Contracts│  │ Payments │  │Milestones│  │ Earned  ││
│  │    5     │  │  £2,450  │  │    3     │  │ £45,230 ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│                                                          │
│  Recent Contracts                           View All → │
│  ┌────────────────────────────────────────────────────┐│
│  │ Website Redesign - Acme Corp      £5,000  Active  ││
│  │ Logo Design - StartupXYZ          £800    Pending ││
│  │ E-commerce Build - ShopLocal      £12,000 Active  ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  Upcoming Milestones                        View All → │
│  ┌────────────────────────────────────────────────────┐│
│  │ ⏰ Homepage Design - Due in 2 days    £1,500      ││
│  │ ⏰ Logo Concepts - Due in 5 days      £400        ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**API Endpoints:**
```typescript
GET /api/dashboard/overview
Response: {
  stats: {
    activeContracts: number;
    pendingPayments: number;
    upcomingMilestones: number;
    totalEarned: number;
    totalSpent: number;
  };
  recentContracts: Contract[];
  upcomingMilestones: Milestone[];
  recentActivity: Activity[];
}

GET /api/dashboard/contracts
Query: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
Response: {
  contracts: Contract[];
  total: number;
  page: number;
  totalPages: number;
}
```

---

## Feature 7: Dispute Resolution

### 3.2.11 Dispute Initiation

**Requirements:**
- Easy dispute filing
- Evidence upload
- AI-assisted mediation
- Escalation to human mediator
- Escrow hold during dispute

**Dispute Types:**
1. **Quality Issues**: Work doesn't meet specifications
2. **Scope Disputes**: Disagreement on deliverables
3. **Timeline Issues**: Missed deadlines
4. **Payment Disputes**: Disagreement on payment terms
5. **Breach of Contract**: Party not fulfilling obligations

**Dispute Flow:**
1. Party initiates dispute on contract/milestone
2. Selects dispute type and provides details
3. Uploads supporting evidence (photos, docs, messages)
4. System notifies counterparty
5. Counterparty responds with their position
6. AI analyzes both positions
7. AI suggests resolution
8. Parties can accept or request human mediation
9. If mediated, professional mediator assigned
10. Resolution implemented and escrow adjusted

**Database Schema:**
```sql
disputes table (already implemented):
- id: varchar(255) PRIMARY KEY
- contractId: varchar(255) FOREIGN KEY
- milestoneId: varchar(255) FOREIGN KEY (nullable)
- initiatedBy: varchar(255) FOREIGN KEY (users)
- type: enum('quality', 'scope', 'timeline', 'payment', 'breach')
- description: text
- evidence: text (JSON array of file URLs)
- status: enum('open', 'under_review', 'mediation', 'resolved', 'closed')
- aiSuggestion: text
- resolution: text
- resolvedAt: datetime
- createdAt: datetime
- updatedAt: datetime
```

### 3.2.12 AI Mediation

**Requirements:**
- Analyze dispute details
- Review contract terms
- Suggest fair resolutions
- Explain reasoning
- Learn from outcomes

**AI Mediation Process:**
```typescript
interface DisputeAnalysis {
  disputeId: string;
  contractTerms: string;
  initiatorClaim: string;
  respondentClaim: string;
  evidence: Evidence[];
}

async function analyzeDispute(analysis: DisputeAnalysis): Promise<MediationSuggestion> {
  const prompt = `
    You are a professional mediator analyzing a service contract dispute.
    
    Contract Terms:
    ${analysis.contractTerms}
    
    Initiator's Position:
    ${analysis.initiatorClaim}
    
    Respondent's Position:
    ${analysis.respondentClaim}
    
    Evidence Provided:
    ${JSON.stringify(analysis.evidence)}
    
    Analyze this dispute and suggest a fair resolution that:
    1. Considers both parties' positions
    2. References relevant contract clauses
    3. Proposes specific actions or compensation
    4. Explains the reasoning
    5. Aims for win-win outcome
    
    Format response as JSON with: analysis, suggestion, reasoning, actions
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert mediator specializing in service contract disputes. Provide fair, balanced resolutions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}
```

**API Endpoints:**
```typescript
POST /api/disputes/create
Body: {
  contractId: string;
  milestoneId?: string;
  type: DisputeType;
  description: string;
  evidence: File[];
}
Response: {
  disputeId: string;
  status: string;
}

POST /api/disputes/:id/respond
Body: {
  response: string;
  evidence: File[];
}
Response: {
  success: boolean;
  aiSuggestion: MediationSuggestion;
}

POST /api/disputes/:id/accept-resolution
Body: {
  accepted: boolean;
  notes?: string;
}
Response: {
  success: boolean;
  dispute: Dispute;
}

POST /api/disputes/:id/request-mediation
Response: {
  success: boolean;
  mediatorAssigned: boolean;
  estimatedCost: number;
}
```

---

## Feature 8: LITL (Lawyer-in-the-Loop)

### 3.2.13 Lawyer Referral System

**Requirements:**
- SRA-regulated solicitor network
- Specialization matching
- Booking system
- Secure communication
- Payment integration

**LITL Services:**
1. **Contract Review**: £99-299
   - Expert review of AI-generated contract
   - Suggested improvements
   - Risk assessment
   - 24-48 hour turnaround

2. **Legal Consultation**: £49-199/hour
   - Video/phone call with solicitor
   - Contract negotiation advice
   - Dispute guidance
   - General legal questions

3. **Custom Contract Drafting**: £299-999
   - Bespoke contract creation
   - Complex terms negotiation
   - Multi-party agreements
   - Industry-specific clauses

4. **Dispute Mediation**: £499-1,999
   - Professional mediation service
   - Binding arbitration option
   - Settlement negotiation
   - Legal representation

**Lawyer Onboarding:**
- SRA registration verification
- Specialization areas
- Hourly rate setting
- Availability calendar
- Profile and credentials
- Client reviews

**Database Schema:**
```sql
litlReferrals table (already implemented):
- id: varchar(255) PRIMARY KEY
- userId: varchar(255) FOREIGN KEY
- contractId: varchar(255) FOREIGN KEY (nullable)
- serviceType: enum('review', 'consultation', 'drafting', 'mediation')
- lawyerId: varchar(255) FOREIGN KEY (nullable)
- status: enum('requested', 'assigned', 'in_progress', 'completed', 'cancelled')
- amount: int
- scheduledAt: datetime (nullable)
- completedAt: datetime (nullable)
- notes: text
- createdAt: datetime
- updatedAt: datetime

lawyers table (new):
- id: varchar(255) PRIMARY KEY
- userId: varchar(255) FOREIGN KEY
- sraNumber: varchar(50)
- firmName: varchar(255)
- specializations: text (JSON array)
- hourlyRate: int
- reviewRate: int
- availability: text (JSON)
- rating: decimal(3,2)
- totalReviews: int
- verified: enum('yes', 'no')
- createdAt: datetime
- updatedAt: datetime
```

**API Endpoints:**
```typescript
POST /api/litl/request
Body: {
  serviceType: 'review' | 'consultation' | 'drafting' | 'mediation';
  contractId?: string;
  description: string;
  preferredDate?: string;
}
Response: {
  referralId: string;
  estimatedCost: number;
  availableLawyers: Lawyer[];
}

POST /api/litl/:id/select-lawyer
Body: {
  lawyerId: string;
  scheduledAt?: string;
}
Response: {
  success: boolean;
  bookingConfirmed: boolean;
  paymentRequired: number;
}

GET /api/litl/lawyers
Query: {
  specialization?: string;
  maxRate?: number;
  availability?: string;
}
Response: {
  lawyers: Lawyer[];
}
```

---

## Feature 9: Notifications System

### 3.2.14 Real-Time Notifications

**Requirements:**
- Multi-channel delivery (in-app, email, SMS)
- Customizable preferences
- Priority levels
- Read/unread tracking
- Notification history

**Notification Types:**

**Contract Notifications:**
- Contract created
- Contract signed by counterparty
- Contract activated
- Contract completed
- Contract cancelled

**Milestone Notifications:**
- Milestone started
- Milestone submitted for approval
- Milestone approved
- Milestone rejected
- Milestone payment released
- Milestone overdue

**Payment Notifications:**
- Payment received
- Payment pending
- Payment failed
- Refund processed
- Escrow deposit required

**Dispute Notifications:**
- Dispute opened
- Dispute response received
- AI mediation suggestion available
- Mediator assigned
- Dispute resolved

**LITL Notifications:**
- Lawyer assigned
- Consultation scheduled
- Review completed
- Invoice received

**System Notifications:**
- Account verification
- Password reset
- Security alerts
- Feature announcements

**Implementation:**

**Database Schema:**
```sql
notifications table (already implemented):
- id: varchar(255) PRIMARY KEY
- userId: varchar(255) FOREIGN KEY
- type: varchar(50)
- title: varchar(255)
- message: text
- link: varchar(255) (nullable)
- isRead: enum('yes', 'no')
- priority: enum('low', 'medium', 'high', 'urgent')
- createdAt: datetime
```

**Notification Service:**
```typescript
interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  channels?: ('in_app' | 'email' | 'sms')[];
}

class NotificationService {
  async send(payload: NotificationPayload): Promise<void> {
    // Create in-app notification
    await createNotification({
      id: generateId(),
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      link: payload.link,
      isRead: 'no',
      priority: payload.priority || 'medium',
      createdAt: new Date()
    });
    
    // Get user notification preferences
    const preferences = await getUserNotificationPreferences(payload.userId);
    
    // Send email if enabled
    if (preferences.email && payload.channels?.includes('email')) {
      await this.sendEmail(payload);
    }
    
    // Send SMS if enabled and high priority
    if (preferences.sms && payload.priority === 'urgent' && payload.channels?.includes('sms')) {
      await this.sendSMS(payload);
    }
    
    // Send push notification if enabled
    if (preferences.push) {
      await this.sendPush(payload);
    }
  }
  
  private async sendEmail(payload: NotificationPayload): Promise<void> {
    const user = await getUser(payload.userId);
    
    await sendEmail({
      to: user.email,
      subject: payload.title,
      html: `
        <h2>${payload.title}</h2>
        <p>${payload.message}</p>
        ${payload.link ? `<a href="${payload.link}">View Details</a>` : ''}
      `
    });
  }
  
  private async sendSMS(payload: NotificationPayload): Promise<void> {
    const user = await getUser(payload.userId);
    
    if (user.phone) {
      await sendSMS({
        to: user.phone,
        message: `${payload.title}: ${payload.message}`
      });
    }
  }
  
  private async sendPush(payload: NotificationPayload): Promise<void> {
    // Implement push notification via FCM or similar
  }
}
```

**API Endpoints:**
```typescript
GET /api/notifications
Query: {
  unread?: boolean;
  limit?: number;
  offset?: number;
}
Response: {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

POST /api/notifications/:id/mark-read
Response: {
  success: boolean;
}

POST /api/notifications/mark-all-read
Response: {
  success: boolean;
  count: number;
}

GET /api/notifications/preferences
Response: {
  email: boolean;
  sms: boolean;
  push: boolean;
  types: Record<string, boolean>;
}

PUT /api/notifications/preferences
Body: {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  types?: Record<string, boolean>;
}
Response: {
  success: boolean;
}
```

---

## Feature 10: Admin Panel

### 3.2.15 Admin Dashboard

**Requirements:**
- User management
- Contract oversight
- Dispute management
- Financial reporting
- System monitoring
- Content moderation

**Admin Sections:**

**1. Users Management**
- View all users
- User details and activity
- Account verification
- Suspend/ban users
- Impersonate user (for support)

**2. Contracts Management**
- View all contracts
- Contract details
- Force status changes (emergency)
- Export contracts
- Analytics

**3. Disputes Management**
- View all disputes
- Assign mediators
- Override AI suggestions
- Close disputes
- Dispute analytics

**4. Financial Management**
- Transaction history
- Escrow balances
- Revenue reports
- Payout management
- Refund processing

**5. LITL Management**
- Lawyer applications
- Verify SRA credentials
- Approve/reject lawyers
- Monitor consultations
- Review quality

**6. System Monitoring**
- Server health
- API performance
- Error logs
- User analytics
- Feature usage

**Admin Roles:**
- **Super Admin**: Full access
- **Support Admin**: User and contract management
- **Financial Admin**: Financial operations
- **Content Moderator**: Dispute and content review

**API Endpoints:**
```typescript
GET /api/admin/users
Query: {
  search?: string;
  status?: string;
  page?: number;
}
Response: {
  users: User[];
  total: number;
}

POST /api/admin/users/:id/suspend
Body: {
  reason: string;
  duration?: number;
}
Response: {
  success: boolean;
}

GET /api/admin/contracts
Query: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
Response: {
  contracts: Contract[];
  stats: ContractStats;
}

GET /api/admin/disputes
Query: {
  status?: string;
  priority?: string;
}
Response: {
  disputes: Dispute[];
  stats: DisputeStats;
}

GET /api/admin/analytics
Query: {
  metric: string;
  period: string;
}
Response: {
  data: AnalyticsData;
}
```

---

## 4. Technical Architecture

### 4.1 System Architecture

**Architecture Pattern:** Monolithic with modular structure (Phase 1), transitioning to microservices (Phase 2)

**High-Level Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │ │
│  │  (React 19)  │  │ (React Native│  │   (React)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      API Gateway                         │
│                   (tRPC + Express)                       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Business   │  │  Integration │  │   External   │
│    Logic     │  │    Layer     │  │   Services   │
│              │  │              │  │              │
│ • Contracts  │  │ • Escrow API │  │ • OpenAI     │
│ • Milestones │  │ • Stripe API │  │ • DocuSign   │
│ • Payments   │  │ • DocuSign   │  │ • Riverside  │
│ • Disputes   │  │ • Email/SMS  │  │ • Transpact  │
│ • LITL       │  │              │  │ • Twilio     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   MySQL/TiDB │  │   Redis      │  │   S3 Storage │ │
│  │   (Primary)  │  │   (Cache)    │  │   (Files)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

**Frontend:**
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query + React Context
- **Forms**: React Hook Form + Zod validation
- **API Client**: tRPC client with superjson

**Backend:**
- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **API**: tRPC for type-safe APIs
- **Database ORM**: Drizzle ORM
- **Authentication**: Manus OAuth + JWT
- **File Upload**: Multer + S3

**Database:**
- **Primary**: MySQL 8.0 or TiDB Cloud
- **Cache**: Redis (for sessions, rate limiting)
- **Search**: Elasticsearch (future for contract search)

**Infrastructure:**
- **Hosting**: Vercel (frontend + serverless functions)
- **Database**: TiDB Cloud or PlanetScale
- **Storage**: AWS S3 or Cloudflare R2
- **CDN**: Cloudflare
- **Monitoring**: Sentry + LogRocket
- **Analytics**: PostHog

**External Services:**
- **AI**: OpenAI GPT-4 Turbo
- **Payments**: Stripe
- **Escrow**: Riverside Escrow / Transpact
- **E-Signatures**: DocuSign (or native implementation)
- **Email**: SendGrid or Resend
- **SMS**: Twilio

### 4.3 Security Architecture

**Authentication:**
- OAuth 2.0 with Manus
- JWT tokens with refresh mechanism
- Session management with Redis
- Multi-factor authentication (optional)

**Authorization:**
- Role-based access control (RBAC)
- Resource-level permissions
- Contract party verification

**Data Security:**
- Encryption at rest (database)
- Encryption in transit (TLS 1.3)
- PII encryption for sensitive fields
- Secure file storage with signed URLs

**API Security:**
- Rate limiting (100 req/min per user)
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS protection

**Compliance:**
- UK GDPR compliance
- Data retention policies
- Right to erasure implementation
- Data export functionality
- Audit logging

---

## 5. Database Schema

### 5.1 Complete Schema

**Already Implemented:**
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role ENUM('user', 'admin') DEFAULT 'user',
  loginMethod VARCHAR(50),
  lastSignedIn DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contract Templates
CREATE TABLE contractTemplates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('freelance', 'home_improvement', 'events', 'trades', 'professional') NOT NULL,
  description TEXT,
  templateContent LONGTEXT NOT NULL,
  isActive ENUM('yes', 'no') DEFAULT 'yes',
  version VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contracts
CREATE TABLE contracts (
  id VARCHAR(255) PRIMARY KEY,
  clientId VARCHAR(255) NOT NULL,
  providerId VARCHAR(255) NOT NULL,
  templateId VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  totalAmount INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  status ENUM('draft', 'pending_signature', 'active', 'completed', 'cancelled', 'disputed') DEFAULT 'draft',
  content LONGTEXT,
  startDate DATETIME,
  endDate DATETIME,
  signedAt DATETIME,
  completedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES users(id),
  FOREIGN KEY (providerId) REFERENCES users(id),
  FOREIGN KEY (templateId) REFERENCES contractTemplates(id)
);

-- Milestones
CREATE TABLE milestones (
  id VARCHAR(255) PRIMARY KEY,
  contractId VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount INT NOT NULL,
  dueDate DATETIME,
  status ENUM('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  `order` INT NOT NULL,
  deliverables TEXT,
  approvalNotes TEXT,
  submittedAt DATETIME,
  approvedAt DATETIME,
  paidAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contractId) REFERENCES contracts(id)
);

-- Escrow Transactions
CREATE TABLE escrowTransactions (
  id VARCHAR(255) PRIMARY KEY,
  contractId VARCHAR(255) NOT NULL,
  milestoneId VARCHAR(255),
  type ENUM('deposit', 'release', 'refund', 'fee') NOT NULL,
  amount INT NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  escrowAccountId VARCHAR(255),
  transactionReference VARCHAR(255),
  provider VARCHAR(50),
  metadata TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contractId) REFERENCES contracts(id),
  FOREIGN KEY (milestoneId) REFERENCES milestones(id)
);

-- Disputes
CREATE TABLE disputes (
  id VARCHAR(255) PRIMARY KEY,
  contractId VARCHAR(255) NOT NULL,
  milestoneId VARCHAR(255),
  initiatedBy VARCHAR(255) NOT NULL,
  type ENUM('quality', 'scope', 'timeline', 'payment', 'breach') NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT,
  status ENUM('open', 'under_review', 'mediation', 'resolved', 'closed') DEFAULT 'open',
  aiSuggestion TEXT,
  resolution TEXT,
  resolvedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contractId) REFERENCES contracts(id),
  FOREIGN KEY (milestoneId) REFERENCES milestones(id),
  FOREIGN KEY (initiatedBy) REFERENCES users(id)
);

-- LITL Referrals
CREATE TABLE litlReferrals (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  contractId VARCHAR(255),
  serviceType ENUM('review', 'consultation', 'drafting', 'mediation') NOT NULL,
  lawyerId VARCHAR(255),
  status ENUM('requested', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'requested',
  amount INT,
  scheduledAt DATETIME,
  completedAt DATETIME,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (contractId) REFERENCES contracts(id)
);

-- Notifications
CREATE TABLE notifications (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  isRead ENUM('yes', 'no') DEFAULT 'no',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

**Additional Tables Needed:**

```sql
-- User Profiles (extended user info)
CREATE TABLE userProfiles (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) UNIQUE NOT NULL,
  userType ENUM('provider', 'client', 'both') DEFAULT 'both',
  businessName VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postcode VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United Kingdom',
  bio TEXT,
  website VARCHAR(255),
  profilePhoto VARCHAR(255),
  verified ENUM('yes', 'no') DEFAULT 'no',
  verificationToken VARCHAR(255),
  stripeCustomerId VARCHAR(255),
  stripeConnectedAccountId VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Contract Signatures
CREATE TABLE contractSignatures (
  id VARCHAR(255) PRIMARY KEY,
  contractId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  signatureData TEXT NOT NULL,
  signatureType ENUM('drawn', 'typed', 'uploaded') NOT NULL,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  consent ENUM('yes', 'no') NOT NULL,
  signedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Lawyers (for LITL)
CREATE TABLE lawyers (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) UNIQUE NOT NULL,
  sraNumber VARCHAR(50) UNIQUE NOT NULL,
  firmName VARCHAR(255),
  specializations TEXT,
  hourlyRate INT,
  reviewRate INT,
  availability TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  totalReviews INT DEFAULT 0,
  verified ENUM('yes', 'no') DEFAULT 'no',
  bio TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Lawyer Reviews
CREATE TABLE lawyerReviews (
  id VARCHAR(255) PRIMARY KEY,
  lawyerId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  referralId VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (referralId) REFERENCES litlReferrals(id)
);

-- File Attachments
CREATE TABLE fileAttachments (
  id VARCHAR(255) PRIMARY KEY,
  entityType ENUM('contract', 'milestone', 'dispute', 'message') NOT NULL,
  entityId VARCHAR(255) NOT NULL,
  uploadedBy VARCHAR(255) NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  fileSize INT NOT NULL,
  fileType VARCHAR(100),
  fileUrl VARCHAR(500) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES users(id)
);

-- Messages (for contract communication)
CREATE TABLE messages (
  id VARCHAR(255) PRIMARY KEY,
  contractId VARCHAR(255) NOT NULL,
  senderId VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  isRead ENUM('yes', 'no') DEFAULT 'no',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id)
);

-- Audit Log
CREATE TABLE auditLog (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entityType VARCHAR(50),
  entityId VARCHAR(255),
  changes TEXT,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Subscription Plans
CREATE TABLE subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) UNIQUE NOT NULL,
  plan ENUM('free', 'starter', 'professional', 'business') DEFAULT 'free',
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  stripeSubscriptionId VARCHAR(255),
  currentPeriodStart DATETIME,
  currentPeriodEnd DATETIME,
  cancelAtPeriodEnd ENUM('yes', 'no') DEFAULT 'no',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification Preferences
CREATE TABLE notificationPreferences (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) UNIQUE NOT NULL,
  emailEnabled ENUM('yes', 'no') DEFAULT 'yes',
  smsEnabled ENUM('yes', 'no') DEFAULT 'no',
  pushEnabled ENUM('yes', 'no') DEFAULT 'yes',
  contractUpdates ENUM('yes', 'no') DEFAULT 'yes',
  milestoneUpdates ENUM('yes', 'no') DEFAULT 'yes',
  paymentUpdates ENUM('yes', 'no') DEFAULT 'yes',
  disputeUpdates ENUM('yes', 'no') DEFAULT 'yes',
  marketingEmails ENUM('yes', 'no') DEFAULT 'no',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5.2 Database Relationships

```
users (1) ──< (M) contracts (as client)
users (1) ──< (M) contracts (as provider)
users (1) ──< (1) userProfiles
users (1) ──< (M) notifications
users (1) ──< (M) disputes
users (1) ──< (M) litlReferrals
users (1) ──< (1) lawyers
users (1) ──< (1) subscriptions
users (1) ──< (1) notificationPreferences

contracts (1) ──< (M) milestones
contracts (1) ──< (M) escrowTransactions
contracts (1) ──< (M) disputes
contracts (1) ──< (M) contractSignatures
contracts (1) ──< (M) messages
contracts (1) ──< (M) litlReferrals

milestones (1) ──< (M) escrowTransactions
milestones (1) ──< (M) disputes

lawyers (1) ──< (M) litlReferrals
lawyers (1) ──< (M) lawyerReviews

contractTemplates (1) ──< (M) contracts
```

### 5.3 Indexes

**Performance Optimization:**
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Contracts
CREATE INDEX idx_contracts_client ON contracts(clientId);
CREATE INDEX idx_contracts_provider ON contracts(providerId);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created ON contracts(createdAt);

-- Milestones
CREATE INDEX idx_milestones_contract ON milestones(contractId);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_due ON milestones(dueDate);

-- Escrow Transactions
CREATE INDEX idx_escrow_contract ON escrowTransactions(contractId);
CREATE INDEX idx_escrow_milestone ON escrowTransactions(milestoneId);
CREATE INDEX idx_escrow_status ON escrowTransactions(status);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(isRead);
CREATE INDEX idx_notifications_created ON notifications(createdAt);

-- Disputes
CREATE INDEX idx_disputes_contract ON disputes(contractId);
CREATE INDEX idx_disputes_status ON disputes(status);

-- Messages
CREATE INDEX idx_messages_contract ON messages(contractId);
CREATE INDEX idx_messages_created ON messages(createdAt);
```

---

## 6. API Specifications

### 6.1 tRPC Router Structure

```typescript
// server/routers.ts
import { router } from './_core/trpc';
import { authRouter } from './routers/auth';
import { contractsRouter } from './routers/contracts';
import { milestonesRouter } from './routers/milestones';
import { paymentsRouter } from './routers/payments';
import { disputesRouter } from './routers/disputes';
import { litlRouter } from './routers/litl';
import { notificationsRouter } from './routers/notifications';
import { adminRouter } from './routers/admin';

export const appRouter = router({
  auth: authRouter,
  contracts: contractsRouter,
  milestones: milestonesRouter,
  payments: paymentsRouter,
  disputes: disputesRouter,
  litl: litlRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
```

### 6.2 Contracts Router

```typescript
// server/routers/contracts.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import {
  getUserContracts,
  getContract,
  createContract,
  updateContract,
  getAllContractTemplates,
} from '../db';

export const contractsRouter = router({
  // List user's contracts
  list: protectedProcedure
    .input(z.object({
      status: z.enum(['draft', 'pending_signature', 'active', 'completed', 'cancelled', 'disputed']).optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const contracts = await getUserContracts(ctx.user.id);
      
      // Filter by status if provided
      let filtered = contracts;
      if (input.status) {
        filtered = contracts.filter(c => c.status === input.status);
      }
      
      // Pagination
      const start = (input.page - 1) * input.limit;
      const end = start + input.limit;
      const paginated = filtered.slice(start, end);
      
      return {
        contracts: paginated,
        total: filtered.length,
        page: input.page,
        totalPages: Math.ceil(filtered.length / input.limit),
      };
    }),
  
  // Get single contract
  get: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Verify user has access
      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      return contract;
    }),
  
  // Create new contract
  create: protectedProcedure
    .input(z.object({
      templateId: z.string().optional(),
      title: z.string().min(1),
      description: z.string(),
      category: z.string(),
      providerId: z.string().optional(),
      clientId: z.string().optional(),
      totalAmount: z.number().positive(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      content: z.any(),
    }))
    .mutation(async ({ ctx, input }) => {
      const contractId = generateId();
      
      const contract = await createContract({
        id: contractId,
        clientId: input.clientId || ctx.user.id,
        providerId: input.providerId || '',
        templateId: input.templateId,
        title: input.title,
        description: input.description,
        category: input.category,
        totalAmount: Math.round(input.totalAmount * 100), // Convert to pence
        currency: 'GBP',
        status: 'draft',
        content: JSON.stringify(input.content),
        startDate: input.startDate,
        endDate: input.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return { contractId, contract };
    }),
  
  // Update contract
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      totalAmount: z.number().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      content: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Only creator can update draft contracts
      if (contract.status !== 'draft' || contract.clientId !== ctx.user.id) {
        throw new Error('Cannot update this contract');
      }
      
      const updates: any = {};
      if (input.title) updates.title = input.title;
      if (input.description) updates.description = input.description;
      if (input.totalAmount) updates.totalAmount = Math.round(input.totalAmount * 100);
      if (input.startDate) updates.startDate = input.startDate;
      if (input.endDate) updates.endDate = input.endDate;
      if (input.content) updates.content = JSON.stringify(input.content);
      
      await updateContract(input.id, updates);
      
      return { success: true };
    }),
  
  // Send contract for signature
  sendForSignature: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      if (contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      if (contract.status !== 'draft') {
        throw new Error('Contract already sent');
      }
      
      await updateContract(input.id, {
        status: 'pending_signature',
      });
      
      // Send notification to provider
      await createNotification({
        userId: contract.providerId,
        type: 'contract_signature_request',
        title: 'New Contract Awaiting Signature',
        message: `${ctx.user.name} has sent you a contract to review and sign.`,
        link: `/contracts/${input.id}`,
      });
      
      return { success: true };
    }),
  
  // Sign contract
  sign: protectedProcedure
    .input(z.object({
      id: z.string(),
      signatureData: z.string(),
      signatureType: z.enum(['drawn', 'typed', 'uploaded']),
    }))
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      // Verify user is party to contract
      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      // Save signature
      await db.insert(contractSignatures).values({
        id: generateId(),
        contractId: input.id,
        userId: ctx.user.id,
        signatureData: input.signatureData,
        signatureType: input.signatureType,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers['user-agent'],
        consent: 'yes',
        signedAt: new Date(),
      });
      
      // Check if both parties have signed
      const signatures = await getContractSignatures(input.id);
      const allSigned = [contract.clientId, contract.providerId].every(userId =>
        signatures.some(sig => sig.userId === userId)
      );
      
      if (allSigned) {
        await updateContract(input.id, {
          status: 'active',
          signedAt: new Date(),
        });
        
        // Notify both parties
        await createNotification({
          userId: contract.clientId,
          type: 'contract_signed',
          title: 'Contract Fully Executed',
          message: 'All parties have signed the contract. Please fund the escrow to activate.',
          link: `/contracts/${input.id}`,
        });
        
        await createNotification({
          userId: contract.providerId,
          type: 'contract_signed',
          title: 'Contract Fully Executed',
          message: 'All parties have signed the contract. Awaiting escrow funding.',
          link: `/contracts/${input.id}`,
        });
      }
      
      return { success: true, allSigned };
    }),
  
  // Get contract templates
  templates: protectedProcedure
    .query(async () => {
      return await getAllContractTemplates();
    }),
  
  // Generate contract with AI
  generateWithAI: protectedProcedure
    .input(z.object({
      category: z.string(),
      projectDescription: z.string(),
      scope: z.string(),
      timeline: z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
      paymentTerms: z.object({
        totalAmount: z.number(),
        paymentSchedule: z.enum(['upfront', 'milestones', 'completion']),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      // Call OpenAI to generate contract
      const generatedContract = await generateContract({
        category: input.category,
        projectDescription: input.projectDescription,
        parties: {
          provider: {
            name: '', // To be filled
            email: '',
          },
          client: {
            name: ctx.user.name || '',
            email: ctx.user.email || '',
          },
        },
        scope: input.scope,
        timeline: input.timeline,
        paymentTerms: input.paymentTerms,
      });
      
      return generatedContract;
    }),
});
```

### 6.3 Milestones Router

```typescript
// server/routers/milestones.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import {
  getContractMilestones,
  getMilestone,
  createMilestone,
  updateMilestone,
} from '../db';

export const milestonesRouter = router({
  // List milestones for a contract
  list: protectedProcedure
    .input(z.object({
      contractId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Verify user has access to contract
      const contract = await getContract(input.contractId);
      if (!contract || (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)) {
        throw new Error('Unauthorized');
      }
      
      return await getContractMilestones(input.contractId);
    }),
  
  // Get single milestone
  get: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      // Verify access
      const contract = await getContract(milestone.contractId);
      if (!contract || (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)) {
        throw new Error('Unauthorized');
      }
      
      return milestone;
    }),
  
  // Create milestone
  create: protectedProcedure
    .input(z.object({
      contractId: z.string(),
      title: z.string(),
      description: z.string(),
      amount: z.number().positive(),
      dueDate: z.date(),
      order: z.number(),
      deliverables: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const contract = await getContract(input.contractId);
      
      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      const milestoneId = generateId();
      
      await createMilestone({
        id: milestoneId,
        contractId: input.contractId,
        title: input.title,
        description: input.description,
        amount: Math.round(input.amount * 100),
        dueDate: input.dueDate,
        status: 'pending',
        order: input.order,
        deliverables: JSON.stringify(input.deliverables),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return { milestoneId };
    }),
  
  // Submit milestone for approval
  submit: protectedProcedure
    .input(z.object({
      id: z.string(),
      notes: z.string(),
      deliverables: z.array(z.string()), // File URLs
    }))
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      await updateMilestone(input.id, {
        status: 'submitted',
        approvalNotes: input.notes,
        deliverables: JSON.stringify(input.deliverables),
        submittedAt: new Date(),
      });
      
      // Notify client
      await createNotification({
        userId: contract.clientId,
        type: 'milestone_submitted',
        title: 'Milestone Submitted for Approval',
        message: `${contract.providerId} has submitted "${milestone.title}" for your review.`,
        link: `/contracts/${milestone.contractId}#milestone-${input.id}`,
        priority: 'high',
      });
      
      return { success: true };
    }),
  
  // Approve milestone
  approve: protectedProcedure
    .input(z.object({
      id: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      await updateMilestone(input.id, {
        status: 'approved',
        approvalNotes: input.notes || 'Approved',
        approvedAt: new Date(),
      });
      
      // Initiate payment release
      const paymentReleased = await releaseEscrowPayment(milestone.contractId, input.id);
      
      // Notify provider
      await createNotification({
        userId: contract.providerId,
        type: 'milestone_approved',
        title: 'Milestone Approved',
        message: `"${milestone.title}" has been approved. Payment is being processed.`,
        link: `/contracts/${milestone.contractId}#milestone-${input.id}`,
        priority: 'high',
      });
      
      return { success: true, paymentReleased };
    }),
  
  // Reject milestone
  reject: protectedProcedure
    .input(z.object({
      id: z.string(),
      reason: z.string(),
      feedback: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const milestone = await getMilestone(input.id);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      
      const contract = await getContract(milestone.contractId);
      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      await updateMilestone(input.id, {
        status: 'rejected',
        approvalNotes: `Rejected: ${input.reason}\n\nFeedback: ${input.feedback}`,
      });
      
      // Notify provider
      await createNotification({
        userId: contract.providerId,
        type: 'milestone_rejected',
        title: 'Milestone Requires Revision',
        message: `"${milestone.title}" needs revision. Reason: ${input.reason}`,
        link: `/contracts/${milestone.contractId}#milestone-${input.id}`,
        priority: 'high',
      });
      
      return { success: true };
    }),
});
```

---

## 7. User Interface Specifications

### 7.1 Design System

**Color Palette:**
```css
:root {
  /* Primary - Deep Blue */
  --primary: #1E3A8A;
  --primary-light: #3B82F6;
  --primary-dark: #1E40AF;
  
  /* Secondary - Bright Green */
  --secondary: #10B981;
  --secondary-light: #34D399;
  --secondary-dark: #059669;
  
  /* Accent - Orange */
  --accent: #F97316;
  --accent-light: #FB923C;
  --accent-dark: #EA580C;
  
  /* Neutrals */
  --background: #FFFFFF;
  --foreground: #0F172A;
  --muted: #F1F5F9;
  --muted-foreground: #64748B;
  --border: #E2E8F0;
  
  /* Status Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}
```

**Typography:**
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

**Spacing:**
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 7.2 Component Library

**Using shadcn/ui components:**
- Button
- Card
- Dialog
- Form
- Input
- Select
- Textarea
- Badge
- Table
- Tabs
- Toast
- Dropdown Menu
- Avatar
- Progress
- Skeleton
- Alert

### 7.3 Key Page Layouts

**Dashboard Layout:**
```tsx
// client/src/pages/Dashboard.tsx
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
                    contract.status === 'completed' ? 'success' :
                    'secondary'
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
- `payment_intent.succeeded`
- `payment_intent.failed`
- `transfer.created`
- `transfer.failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 8.3 Escrow Provider Integration

**Primary: Riverside Escrow**

**API Documentation:** Request from Riverside
**Authentication:** API Key
**Endpoints:**
- `POST /api/v1/escrow/create`
- `POST /api/v1/escrow/deposit`
- `POST /api/v1/escrow/release`
- `POST /api/v1/escrow/refund`
- `GET /api/v1/escrow/:id/balance`

**Webhook Events:**
- `escrow.created`
- `escrow.funded`
- `escrow.released`
- `escrow.refunded`

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
      /  \     E2E Tests (10%)
     /____\    
    /      \   Integration Tests (30%)
   /________\  
  /          \ Unit Tests (60%)
 /____________\
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
1. **Development** - Local development
2. **Staging** - Pre-production testing
3. **Production** - Live environment

**Environment Variables:**
```env
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
- **Application Monitoring**: Sentry
- **Performance Monitoring**: Vercel Analytics
- **Log Management**: Logtail or Papertrail
- **Uptime Monitoring**: UptimeRobot
- **Error Tracking**: Sentry

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
- **Escrow**: Third-party holding of funds until conditions are met
- **Milestone**: Defined project checkpoint with associated payment
- **LITL**: Lawyer-in-the-Loop, premium legal consultation service
- **FCA**: Financial Conduct Authority (UK regulator)
- **SRA**: Solicitors Regulation Authority (UK legal regulator)
- **tRPC**: TypeScript RPC framework for type-safe APIs
- **Drizzle ORM**: TypeScript ORM for database operations

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

**END OF DOCUMENT**

*This PRD is a living document and will be updated as the product evolves.*

