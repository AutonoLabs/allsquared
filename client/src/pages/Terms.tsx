import {
  MarketingLegalPage,
  type MarketingLegalSection,
} from "@/components/marketing/MarketingLegalPage";

const sections: MarketingLegalSection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      'Welcome to AllSquared. These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using AllSquared, you agree to be bound by these Terms.',
    ],
  },
  {
    title: "2. Service Description",
    paragraphs: [
      "AllSquared provides an online platform for generating service contracts, managing escrow-related payment flows, and facilitating milestone-based project management.",
      "Our services may include the following platform features and related operational tools:",
    ],
    bullets: [
      "AI-powered contract generation",
      "Digital signature services",
      "Escrow payment coordination through authorised partners",
      "Milestone tracking and management",
      "Structured dispute-handling workflows",
      "Optional lawyer referral services",
    ],
  },
  {
    title: "3. User Eligibility",
    paragraphs: [
      "You must be at least 18 years old and legally capable of entering into binding contracts to use AllSquared. By using our services, you represent and warrant that you meet these requirements.",
    ],
  },
  {
    title: "4. Account Registration",
    paragraphs: [
      "To use AllSquared, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
    ],
  },
  {
    title: "5. Fees and Payments",
    paragraphs: [
      "AllSquared may charge platform fees, transaction-related fees, or partner pass-through fees as disclosed at the time of use or on applicable pricing materials.",
      "Unless required by law, fees are non-refundable once the relevant service has been delivered or the related partner transaction has been processed.",
    ],
  },
  {
    title: "6. Escrow Services",
    paragraphs: [
      "Escrow services are provided through our FCA-authorised partners. Funds held in escrow are subject to the terms and conditions of the relevant escrow partner. AllSquared acts as a facilitator and is not responsible for the escrow partner's independent actions or obligations.",
    ],
  },
  {
    title: "7. Legal Disclaimer",
    paragraphs: [
      "AllSquared provides technology tools for contract generation and management. We are not a law firm and do not provide legal advice. Contracts generated through our platform should be reviewed by a qualified solicitor where appropriate, especially for complex or high-value transactions.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, AllSquared shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.",
    ],
  },
  {
    title: "9. Termination",
    paragraphs: [
      "We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion.",
    ],
  },
  {
    title: "10. Changes to Terms",
    paragraphs: [
      "We may update these Terms from time to time. Continued use of AllSquared after changes constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "11. Legal Entity & Registered Office",
    paragraphs: [
      "AllSquared is a trading name of AllSquared Ltd, a private company limited by shares and incorporated in England and Wales. We are not a partnership and we are not a sole trader. The information below is provided in line with the UK Companies Act 2006 (electronic communications) Regulations.",
    ],
    bullets: [
      "Company name: AllSquared Ltd",
      "Company number: 17313974 (Companies House, England & Wales)",
      "Registered office: Suite 15, 137–139 Brent Street, London NW4 4DJ, United Kingdom",
      "Registered email (Companies House correspondence): hi@allsquared.uk",
      "Director: Eliahu Bernstein",
      "Shareholder of record: Autono Labs LLP (Companies House No. OC460890) — 75%+ ownership / voting control",
      "Standard email for general enquiries: hello@allsquared.uk",
    ],
  },
];

export default function Terms() {
  return (
    <MarketingLegalPage
      badge="Platform terms"
      title="Terms of service for using AllSquared."
      accent="AllSquared."
      description="These terms govern access to and use of the AllSquared platform, including contract workflows, escrow-related flows, and related services."
      lastUpdated={new Date().toLocaleDateString("en-GB")}
      sections={sections}
      contactLabel="11. Contact"
      contactHref="mailto:hello@allsquared.uk"
      contactText="For questions about these Terms, please contact us at"
    />
  );
}
