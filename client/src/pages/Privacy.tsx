import {
  MarketingLegalPage,
  type MarketingLegalSection,
} from "@/components/marketing/MarketingLegalPage";

const sections: MarketingLegalSection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      'AllSquared ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.',
    ],
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "We collect information that you provide directly to us, including the categories below.",
    ],
    bullets: [
      "Personal information such as name, email address, and phone number",
      "Account credentials",
      "Payment information processed by relevant payment partners",
      "Contract details and project information",
      "Communications with us and other users",
      "Usage data and analytics",
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: [
      "We use the information we collect to operate, maintain, and improve the platform.",
    ],
    bullets: [
      "Provide, maintain, and improve our services",
      "Process transactions and manage escrow-related payment flows",
      "Generate and manage contracts",
      "Communicate with you about your account and services",
      "Send marketing communications where you have consented",
      "Detect, prevent, and address fraud and security issues",
      "Comply with legal obligations",
    ],
  },
  {
    title: "4. Information Sharing",
    paragraphs: [
      "We may share your information with service providers who assist in operating our platform, with other users where necessary to facilitate contracts and transactions, with legal authorities when required by law, and with professional advisers under confidentiality obligations.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "5. Data Security",
    paragraphs: [
      "We implement appropriate technical and organisational measures to protect your information.",
    ],
    bullets: [
      "Encryption of data in transit and at rest",
      "Regular security assessments and audits",
      "Access controls and authentication",
      "Secure data storage with reputable cloud providers",
    ],
  },
  {
    title: "6. Your Rights",
    paragraphs: [
      "Under UK GDPR, you may have rights including access, correction, deletion, objection, portability, and withdrawal of consent where applicable.",
      "To exercise these rights, contact us using the address below.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We retain your information for as long as necessary to provide our services and comply with legal obligations. Contract and transaction data may be retained where required for legal, regulatory, or tax purposes.",
    ],
  },
  {
    title: "8. Cookies",
    paragraphs: [
      "We use cookies and similar tracking technologies to improve your experience, analyse usage, and deliver relevant content. You can control cookies through your browser settings.",
    ],
  },
  {
    title: "9. Third-Party Links",
    paragraphs: [
      "Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those external sites.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our platform where appropriate.",
    ],
  },
  {
    title: "11. Data Controller & Legal Entity",
    paragraphs: [
      "For the purposes of the UK GDPR and the Data Protection Act 2018, the data controller is identified below. Where personal data is processed by an escrow partner, payment processor, or solicitor on our behalf, that party acts as our data processor under a written contract.",
    ],
    bullets: [
      "Data controller: AllSquared Ltd",
      "Company number: 17313974 (Companies House, England & Wales)",
      "Registered office: Suite 15, 137–139 Brent Street, London NW4 4DJ, United Kingdom",
      "Registered email (Companies House correspondence): hi@allsquared.uk",
      "Privacy enquiries: privacy@allsquared.uk",
      "Information Commissioner's Office (ICO): AllSquared Ltd is registered with the ICO as a data controller. The registration reference can be provided on request.",
    ],
  },
];

export default function Privacy() {
  return (
    <MarketingLegalPage
      badge="Privacy policy"
      title="How AllSquared handles your information."
      accent="your information."
      description="This page explains what information we collect, how we use it, how we protect it, and the rights you may have in relation to that information."
      lastUpdated={new Date().toLocaleDateString("en-GB")}
      sections={sections}
      contactLabel="11. Contact Us"
      contactHref="mailto:privacy@allsquared.uk"
      contactText="If you have questions about this Privacy Policy, please contact us at"
    />
  );
}
