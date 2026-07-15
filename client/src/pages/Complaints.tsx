import {
  MarketingLegalPage,
  type MarketingLegalSection,
} from "@/components/marketing/MarketingLegalPage";

const sections: MarketingLegalSection[] = [
  {
    title: "1. Our Commitment",
    paragraphs: [
      "AllSquared aims to resolve any complaint promptly, fairly, and consistently with our obligations under UK law. This procedure explains how to raise a complaint, what to expect from us, and the remedies available if you are not satisfied with our response.",
      "If your complaint relates to escrow services, please note that those services are provided by our independent FCA-authorised payment institution partner (currently Transpact). Complaints about escrow funds held by that partner are handled under the partner's own complaints procedure and may be eligible for referral to the Financial Ombudsman Service.",
    ],
  },
  {
    title: "2. What You Can Complain About",
    paragraphs: [
      "You can complain about any aspect of the platform, including:",
    ],
    bullets: [
      "How an account, contract, milestone, or dispute was handled",
      "Behaviour of our team, partners, or platform features",
      "Decisions affecting your use of the service",
      "How we have handled your personal data (in addition to your rights under our Privacy Policy)",
      "Anything we have said or published that you believe is inaccurate, misleading, or unfair",
    ],
  },
  {
    title: "3. How to Raise a Complaint",
    paragraphs: [
      "Please contact us using one of the channels below so we can log your complaint and begin the investigation. Providing the following information helps us resolve your complaint quickly:",
    ],
    bullets: [
      "Your name, registered email, and account ID (if you have one)",
      "A clear description of the issue and the dates involved",
      "Copies or screenshots of any relevant messages, contracts, or transactions",
      "What outcome you are seeking",
    ],
  },
  {
    title: "4. What Happens Next",
    paragraphs: [
      "We will acknowledge your complaint within 2 business days of receipt. We will then investigate, aiming to provide a final response within 15 business days. If we need longer (for example, because we are waiting on a partner), we will explain why and give you an updated timeline.",
      "Our final response will set out what we found, whether we agree with your complaint, and any remedy we are offering.",
    ],
  },
  {
    title: "5. If You Are Not Satisfied",
    paragraphs: [
      "If you are not satisfied with our final response, you can ask us to escalate the matter for an internal review by a senior team member who was not involved in the original decision.",
      "If your complaint involves an FCA-regulated activity (such as escrow services provided by our partner), and we are unable to resolve it within 8 weeks, or if you are unhappy with our final response, you may be entitled to refer the matter to the Financial Ombudsman Service free of charge.",
    ],
    bullets: [
      "Financial Ombudsman Service — exchange.foi.org.uk",
      "Telephone: 0800 023 4567 (free) or 0300 123 9123",
      "Email: complaint.info@financial-ombudsman.org.uk",
    ],
  },
  {
    title: "6. Alternative Dispute Resolution",
    paragraphs: [
      "For complaints unrelated to regulated financial services, you may also be able to use an alternative dispute resolution provider. We will provide details of any ADR scheme we are registered with on request.",
    ],
  },
  {
    title: "7. Recording and Learning",
    paragraphs: [
      "We record all complaints and use them to improve our service. Anonymised complaint data is reviewed quarterly by the leadership team.",
    ],
  },
  {
    title: "8. Legal Entity",
    paragraphs: [
      "This complaints procedure is operated by the company identified below. Where statutory timeframes apply (for example, FCA complaints-handling rules), they run from receipt of your complaint by the entity named.",
    ],
    bullets: [
      "Company name: AllSquared Ltd",
      "Company number: 17313974 (Companies House, England & Wales)",
      "Registered office: Suite 15, 137–139 Brent Street, London NW4 4DJ, United Kingdom",
      "Registered email: hi@allsquared.uk",
      "Complaints contact: complaints@allsquared.uk",
    ],
  },
];

export default function Complaints() {
  return (
    <MarketingLegalPage
      badge="Complaints procedure"
      title="How to raise a complaint and what to expect from us."
      accent="expect from us"
      description="This procedure explains how to raise a complaint with AllSquared, how we handle it, and the options available if you are not satisfied with our response."
      lastUpdated={new Date().toLocaleDateString("en-GB")}
      sections={sections}
      contactLabel="8. How to contact us"
      contactHref="mailto:complaints@allsquared.uk"
      contactText="To raise a complaint or follow up on an existing one, please email"
    />
  );
}