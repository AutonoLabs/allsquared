# AllSquared

> **Secure Service Contracts for the UK's Freelance Economy**

AllSquared is the only platform combining AI-powered contract generation, FCA-backed escrow, and milestone management. We protect payments and enable confident service delivery for freelancers, contractors, and service providers across the UK.

![AllSquared Platform](client/public/logo.png)

---

## 🎯 Problem

The £30 billion UK freelance and home services market is plagued by:
- **Payment disputes** and non-payment risks
- **Scope creep** and unclear deliverables  
- **Fragmented solutions** (separate contract, payment, and dispute tools)
- **High costs** for legal protection

## 💡 Solution

AllSquared provides an integrated platform with:

1. **AI Contract Generation** - Professional, legally-sound contracts in minutes
2. **FCA-Backed Escrow** - Secure milestone-based payments
3. **Milestone Management** - Clear progress tracking and automatic releases
4. **AI Dispute Resolution** - Fast mediation with optional lawyer referrals (LITL)
5. **Bank-Grade Security** - Enterprise encryption and regulatory compliance

---

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** + **shadcn/ui** components
- **Wouter** for routing
- **tRPC** for type-safe APIs
- **TanStack Query** for data fetching

### Backend
- **Node.js** + **Express**
- **tRPC** server with superjson
- **Drizzle ORM** for database
- **MySQL/TiDB** database
- **Manus OAuth** authentication

### Infrastructure
- **Vite** for build tooling
- **pnpm** for package management
- **TypeScript** throughout
- **Vitest** for testing

---

## 📊 Database Schema

The platform uses 8 core tables:

- **users** - Authentication and user profiles
- **contracts** - Full contract lifecycle management
- **milestones** - Payment milestone tracking
- **escrowTransactions** - FCA-backed payment security
- **disputes** - AI-assisted dispute resolution
- **litlReferrals** - Lawyer-in-the-Loop premium service
- **notifications** - Real-time user notifications
- **contractTemplates** - 5 service category templates

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- MySQL/TiDB database

### Installation

```bash
# Clone the repository
git clone https://github.com/Nakamoto-Labs/allsquared.git
cd allsquared

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
allsquared/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # Reusable UI components
│       ├── lib/           # Utilities and tRPC client
│       └── _core/         # Core hooks (auth, etc.)
├── server/                # Backend Express + tRPC
│   ├── routers.ts        # tRPC API procedures
│   ├── db.ts             # Database query helpers
│   └── _core/            # Core server infrastructure
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Database table definitions
├── shared/               # Shared types and constants
└── storage/              # S3 storage helpers
```

---

## 🔑 Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://vida.manus.im

# Application
VITE_APP_TITLE=AllSquared
VITE_APP_LOGO=/logo.png
PORT=3000

# Optional: AI Features
OPENAI_API_KEY=your-openai-key
```

---

## 🎨 Key Features

### For Freelancers & Service Providers
- Generate professional contracts in minutes
- Secure milestone-based payments
- Track project progress
- Resolve disputes quickly
- Access legal support when needed

### For Clients
- Clear contract terms and deliverables
- Payment protection with escrow
- Milestone approval workflow
- Quality assurance
- Dispute resolution support

### Service Categories
1. **Freelance Services** - Web dev, design, writing, consulting
2. **Home Improvements** - Renovations, repairs, installations
3. **Event Services** - Catering, photography, entertainment
4. **Trade Services** - Plumbing, electrical, carpentry
5. **Other Services** - Custom contracts for any service

---

## 📈 Market Opportunity

- **10M+** potential users in UK (freelancers + SMEs)
- **£30B** market opportunity (home improvements + freelance services)
- **56%** gross margin target
- **22.8:1** LTV:CAC ratio

---

## 🛡️ Compliance & Security

- **FCA-Authorised Escrow** - Regulated payment protection
- **UK GDPR Compliant** - Data protection and privacy
- **SRA Guidelines** - Legal service compliance
- **Bank-Grade Encryption** - Enterprise security standards
- **Unreserved Legal Services** - Operating within UK legal framework

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Complete)
- [x] Marketing website (8 pages)
- [x] Database schema (8 tables)
- [x] Authentication system (Manus OAuth)
- [x] User dashboard with stats
- [x] Contract generation (Typeform-style wizard)
- [x] Milestone management (submission, approval/rejection)
- [x] Contract signing workflow
- [x] Notifications system
- [x] Template management
- [x] User profile management

### Phase 2: Integrations (Next)
- [ ] Escrow integration (Riverside/Transpact API)
- [ ] Payment processing (Stripe)
- [ ] AI contract generation (OpenAI)
- [ ] Email notifications (SendGrid/Resend)
- [ ] SMS notifications (Twilio)

### Phase 3: Advanced Features
- [ ] AI dispute resolution
- [ ] LITL lawyer referrals
- [ ] Admin panel
- [ ] Analytics dashboard

### Phase 4: Scale
- [ ] Mobile apps
- [ ] International expansion
- [ ] Enterprise features
- [ ] API for integrations

---

## 📚 Documentation

- [Business Plan](docs/allsquared_business_plan.md)
- [Market Research](docs/uk_market_research_competitive_analysis.md)
- [Pitch Deck](docs/pitch_deck/) - 20-slide investor presentation
- [LITL Service Model](docs/litl_service_model_and_risk_framework.md)
- [Product Requirements](docs/prd/) - Coming soon

---

## 🤝 Contributing

This is a proprietary project. The source code is available for viewing only.

For collaboration inquiries, please contact: hello@allsquared.uk

---

## 📄 License

Copyright © 2025 Nakamoto Labs. All Rights Reserved.

This is proprietary software. See [LICENSE](LICENSE) for details.

---

## 📞 Contact

- **Website**: [allsquared.uk](https://allsquared.uk)
- **Email**: hello@allsquared.uk
- **Twitter**: [@AllSquaredUK](https://twitter.com/AllSquaredUK)
- **LinkedIn**: [AllSquared](https://linkedin.com/company/allsquared)

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Manus Platform](https://manus.im/)

---

**Made with ❤️ by Nakamoto Labs**

