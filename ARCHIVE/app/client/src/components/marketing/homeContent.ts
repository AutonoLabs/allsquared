import { ArrowRight, CheckSquare, CreditCard, FileText, type LucideIcon } from "lucide-react";

export type MarketingStat = {
  value: string;
  label: string;
  source: string;
};

export type MarketingStep = {
  number: string;
  title: string;
  accent: string;
  body: string;
  icon: LucideIcon;
};

export type MarketingPersona = {
  tag: string;
  title: string;
  accent: string;
  body: string;
  items: string[];
};

export type MarketingService = {
  title: string;
  subtitle: string;
  items: string[];
};

export type MarketingWhenToUse = {
  numeral: string;
  title: string;
  body: string;
};

export type MarketingPricingPlan = {
  name: string;
  price: string;
  suffix: string;
  description: string;
  items: string[];
  featured: boolean;
  cta: string;
};

export type MarketingFaqPoint = {
  numeral: string;
  head: string;
  body: string;
};

export type MarketingFaqItem = {
  q: string;
  a: string;
  points?: MarketingFaqPoint[];
};

export type MatrixRow = [string, string, string, string, string];
export type SampleMilestone = [string, string, string, string, string];

export const tickerItems = [
  "Renovators & fit-out contractors",
  "Electrical & mechanical engineers",
  "Wedding & event photographers",
  "Boutique design & dev agencies",
  "Film & video production",
  "Independent consultants",
  "Logistics & haulage operators",
];

export const stats: MarketingStat[] = [
  { value: "52%", label: "UK small businesses paid late on B2B invoices", source: "FSB · 2024" },
  { value: "£22,000", label: "Average owed in overdue invoices, per UK SME", source: "FSB & Xero · 2024" },
  { value: "50k", label: "UK businesses closing each year due to late payment", source: "FSB · 2023" },
  { value: "56m", label: "Hours UK SMEs lose annually chasing late B2B payments", source: "QuickBooks · 2023" },
];

export const steps: MarketingStep[] = [
  {
    number: "01 / Draft",
    title: "A contract, drafted in minutes.",
    accent: "contract,",
    body: "Answer a short brief. Our AI writes a solicitor-reviewed agreement fit for the job - plumber, session cellist, freelance developer - in plain English. No clause-juggling.",
    icon: FileText,
  },
  {
    number: "02 / Fund",
    title: "Funds held, never held up.",
    accent: "never held up.",
    body: "The client transfers the project total into a regulated escrow account. The money is ring-fenced - neither party can touch it until agreed work is signed off.",
    icon: CreditCard,
  },
  {
    number: "03 / Verify",
    title: "Milestone proof - not promise.",
    accent: "proof",
    body: "Hit a milestone. Upload proof - photos, a timesheet, a commit, a deliverable, whatever fits the work. The client has 72 hours to approve or flag. Silence counts as approval.",
    icon: CheckSquare,
  },
  {
    number: "04 / Release",
    title: "Paid, same day.",
    accent: "same day.",
    body: "On approval the funds release to your account - typically within hours. No invoice chase, no 30-day terms, no excuses. The next milestone continues.",
    icon: ArrowRight,
  },
];

export const matrixRows: MatrixRow[] = [
  ["Contract drafted for you", "Copy-paste template", "Boilerplate only", "Yes", "Solicitor-certified"],
  ["Funds held in regulated escrow", "On trust", "Platform credit", "No", "UK-regulated"],
  ["Payment released on verified proof", "Invoice & hope", "Partial", "Signing only", "Every milestone"],
  ["Disputes handled by real solicitors", "Small claims court", "Slow mediation", "Not offered", "Independent UK"],
  ["No cut of your future work", "Yes", "10-20% forever", "Yes", "Per-contract fee"],
];

export const personas: MarketingPersona[] = [
  {
    tag: "Commercial trades & fit-out",
    title: "The contractor, the specialist, the project PM.",
    accent: "contractor,",
    body: "Office fit-outs. Renovations. Mechanical & electrical. Jobs with serious materials bills, subcontractor chains, and clients whose finance teams \"need another week\" on every release. One bad payer torches your margin for the quarter.",
    items: [
      "Stage payments tied to first fix, second fix, handover",
      "Materials pre-funded from escrow - cashflow stays yours",
      "Proof uploaded on each stage and released on sign-off",
      "Typical deal size £15K - £500K+",
    ],
  },
  {
    tag: "Boutique agencies & studios",
    title: "The founder, the partner, the producer.",
    accent: "founder,",
    body: "Design, development, marketing, video, engineering. You close a £60K statement of work on a good call, then spend the next five months managing scope, stakeholders, and an AP team that rotates quarterly. The money you earned becomes the money you're chasing.",
    items: [
      "SoW milestones defined in plain English, not jargon",
      "Change-orders priced and signed before the work starts",
      "Funds ring-fenced so client restructures can't touch them",
      "Typical deal size £10K - £250K",
    ],
  },
  {
    tag: "Events, weddings & productions",
    title: "The creative director, the planner, the producer.",
    accent: "creative director,",
    body: "Wedding photographers. Event planners. Film and video production. High-ticket bookings taken months in advance, big deposits, enormous reputational cost if anything goes sideways. The industry runs on goodwill - until it doesn't.",
    items: [
      "Deposits held in escrow - not a stranger's current account",
      "Stage releases on booking, delivery, final edit",
      "Kill fees and cancellation clauses priced upfront",
      "Typical deal size £5K - £75K",
    ],
  },
];

export const legalServices: MarketingService[] = [
  {
    title: "Quick Legal Review",
    subtitle: "15-20 minute consultation",
    items: [
      "Get specific contract questions answered, fast",
      "Understand your rights and obligations",
      "Practical guidance on next steps",
      "Ideal for a quick check before signing",
    ],
  },
  {
    title: "Contract Review",
    subtitle: "Written line-by-line analysis",
    items: [
      "Full line-by-line analysis of your contract",
      "Risk identification flagged in plain English",
      "Suggested amendments and red-line",
      "Written summary within 3 working days",
    ],
  },
  {
    title: "Custom Contract Drafting",
    subtitle: "Bespoke agreement, built for your deal",
    items: [
      "Initial consultation with a specialist solicitor",
      "Drafted to your specific commercial requirements",
      "Multiple revision rounds included",
      "Final signed version, stored in your AllSquared vault",
    ],
  },
  {
    title: "Dispute Support",
    subtitle: "Help navigating contract disputes",
    items: [
      "Assessment of your position and exposure",
      "Strategy recommendations, written",
      "Mediation representation (quoted separately)",
      "Litigation referral to network firm if escalated",
    ],
  },
];

export const legalCredentials = [
  "UK-qualified, with current professional registrations verified at engagement",
  "Carrying full professional indemnity insurance",
  "Experienced in contract & commercial law",
  "Committed to fixed-fee, transparent pricing",
];

export const whenToUse: MarketingWhenToUse[] = [
  {
    numeral: "i.",
    title: "Before you sign",
    body: "Have a solicitor review any contract, yours or theirs, before you commit. Identify risk, negotiate amendments, and walk in informed.",
  },
  {
    numeral: "ii.",
    title: "On complex projects",
    body: "For high-value or unusual work, commission a bespoke contract drafted for your specific commercial interests. Worth the investment on a £50K+ deal.",
  },
  {
    numeral: "iii.",
    title: "During a dispute",
    body: "When escrow mediation stalls, a network solicitor can assess your position and, if needed, represent you through to litigation.",
  },
];

export const pricingPlans: MarketingPricingPlan[] = [
  {
    name: "Small Deals",
    price: "£75",
    suffix: "flat",
    description: "For jobs between £1,000 and £5,000. One flat fee, no percentages, full platform access.",
    items: [
      "AI-drafted, solicitor-reviewed contract",
      "Regulated UK escrow",
      "Unlimited milestones per agreement",
      "Standard dispute routing",
    ],
    featured: false,
    cta: "Draft one now",
  },
  {
    name: "Pay Per Deal",
    price: "£100",
    suffix: "+ 1% of deal value",
    description: "For deals from £5,000 upward. Pay only when you use it - typically covered several times over by a single avoided dispute.",
    items: [
      "Everything in Small Deals, at scale",
      "Regulated UK escrow, no upper limit",
      "Priority dispute resolution",
      "Proof upload - photos, commits, timesheets, deliverables",
      "Email support, next working day",
    ],
    featured: true,
    cta: "Start a deal",
  },
  {
    name: "Practice",
    price: "£49",
    suffix: "/ month + 0.5%",
    description: "For agencies, firms, and studios running multiple deals a year. No flat fees, reduced percentage, team features.",
    items: [
      "Half the per-deal percentage",
      "No per-deal flat fee",
      "Team accounts & shared template library",
      "Xero & QuickBooks reconciliation",
      "Dedicated account manager",
    ],
    featured: false,
    cta: "Start 30-day trial",
  },
];

export const faqs: MarketingFaqItem[] = [
  {
    q: "How is my money actually protected?",
    a: "Client funds are held in a ring-fenced client account operated by a regulated UK escrow partner - completely separate from AllSquared's own accounts. Neither AllSquared nor the contracting parties can move those funds until the agreed milestone is approved and signed off. If AllSquared were to cease trading, the money would still be yours - held in a segregated account outside our control.",
  },
  {
    q: "How is AllSquared different from Shieldpay, PayTrustCare, or Escrow.com?",
    a: "Those are pure escrow providers. We're an end-to-end contract, escrow, verification, and dispute platform built for high-value UK professional services.",
    points: [
      {
        numeral: "i.",
        head: "Not just escrow - real, solicitor-reviewed contracts on demand.",
        body: "Competitors hold money. AllSquared drafts, reviews, and secures the whole agreement - with optional independent legal review through our partner network.",
      },
      {
        numeral: "ii.",
        head: "All four elements in one platform - no bolt-ons.",
        body: "Contract, payment, verification, dispute. Nobody else offers all four. You don't need to stitch five SaaS subscriptions together.",
      },
      {
        numeral: "iii.",
        head: "Built for high-value UK B2B services - not asset sales, not gig work.",
        body: "Engineered for project work - renovations, fit-outs, studios, agencies, weddings, productions.",
      },
      {
        numeral: "iv.",
        head: "Milestone-based, evidence-driven payment - no more chasing.",
        body: "Funds release on proof, not on client whim, not 30-day terms, not \"just trust us.\"",
      },
      {
        numeral: "v.",
        head: "Human assurance - real legal review, no AI slop.",
        body: "Every critical contract is reviewable by qualified UK legal professionals, not just bots or generic templates.",
      },
    ],
  },
  {
    q: "What happens if a dispute actually occurs?",
    a: "A structured resolution process begins: 72-hour response window, evidence review, independent certified mediation. Funds remain safely in escrow throughout. Most disputes resolve at the evidence stage - because the evidence exists, is timestamped, and both parties can see it. Court is genuinely the last resort, and the vast majority of deals never come close to needing one.",
  },
  {
    q: "What size of job is this really designed for?",
    a: "AllSquared is built for project-based deals from £5,000 upward, with no upper limit. That's the range where a late or disputed payment is a genuine business event, not just an annoyance. Between £1,000 and £5,000 we offer a flat-fee tier. Below £1,000, honestly, a plain invoice is fine. This is not a Fiverr or Upwork competitor, and we don't pretend to be.",
  },
  {
    q: "I'm the client hiring. Does this help me too?",
    a: "Significantly. You pay into a ring-fenced client account, not a stranger's. Your money doesn't leave until work you can see is delivered. You get a contract written in English, not jargon. And you avoid the most common bad outcome for commissioning clients: paying a deposit to a supplier who then disappears, restructures, or quietly degrades the work.",
  },
  {
    q: "Is AllSquared itself a law firm?",
    a: "No. AllSquared is a technology platform - not a law firm. We draft contracts using AI and present them clearly for both parties to review and sign. For users who want an additional layer of legal assurance, we offer an optional connection to independent UK-qualified solicitors who can review or advise on agreements under their own professional terms. That's an add-on, not the core product. This page is marketing material and does not constitute legal advice.",
  },
  {
    q: "Is there an upper limit on deal size?",
    a: "No set upper limit. Our escrow partner handles very large deal sizes routinely. For multi-million-pound programmes with unusual treasury or compliance requirements, talk to us - we'll set it up properly before your first deal goes through.",
  },
];

export const sampleMilestones: SampleMilestone[] = [
  ["i.", "Survey, drawings & regolith analysis", "Verified · 04 Apr 2089", "£8,400", "done"],
  ["ii.", "Strip-out & pressure-seal inspection", "Verified · 08 Apr 2089", "£11,200", "done"],
  ["iii.", "First fix - M&E, data, life-support", "Verified · 12 Apr 2089", "£18,600", "done"],
  ["iv.", "Partitions, services, vacuum glazing", "Proof submitted · 18:42", "£22,400", "active"],
  ["v.", "Ceilings, flooring, dust-mitigation", "Scheduled · 18 Apr 2089", "£14,800", "todo"],
  ["vi.", "Second fix & habitat commissioning", "Scheduled · 22 Apr 2089", "£12,600", "todo"],
  ["vii.", "Snagging & pressure-cycle defects period", "Scheduled · 30 Apr 2089", "£6,200", "todo"],
  ["viii.", "Final handover & Martian surveyor sign-off", "Scheduled · 06 May 2089", "£3,800", "todo"],
];

export const marketingShell = "mx-auto w-full max-w-[1240px] px-5 md:px-8 lg:px-10";
