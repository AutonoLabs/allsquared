import {
  MarketingLegalPage,
  type MarketingLegalSection,
} from "@/components/marketing/MarketingLegalPage";

const sections: MarketingLegalSection[] = [
  {
    title: "1. What Cookies Are",
    paragraphs: [
      "Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage, pixels, and analytics identifiers.",
      "They help the site remember state, keep sessions secure, understand aggregate usage, and improve reliability.",
    ],
  },
  {
    title: "2. Cookies We Use",
    paragraphs: [
      "AllSquared uses cookies and similar technologies for the categories below.",
    ],
    bullets: [
      "Strictly necessary cookies required for authentication, security, routing, and core platform operation",
      "Preference cookies that remember interface state, such as persisted sidebar or display choices",
      "Analytics cookies or identifiers that help us understand aggregate usage and improve the product",
      "Third-party cookies that may be set by authentication, analytics, hosting, or payment-related providers",
    ],
  },
  {
    title: "3. Strictly Necessary Cookies",
    paragraphs: [
      "These cookies are required for the platform to function. They support login, session management, fraud prevention, security, and reliable delivery of the service.",
      "Because these cookies are necessary, they cannot be disabled through the platform without affecting core functionality.",
    ],
  },
  {
    title: "4. Analytics and Product Improvement",
    paragraphs: [
      "We may use privacy-conscious analytics to understand how visitors and users interact with the public site and platform. This helps us improve navigation, performance, content, and reliability.",
      "Where required by law, analytics that are not strictly necessary will be used only with the relevant consent or lawful basis.",
    ],
  },
  {
    title: "5. Third-Party Providers",
    paragraphs: [
      "Some cookies or similar technologies may be set by third-party providers that help us operate the service. These may include providers for authentication, analytics, hosting, payments, escrow-related workflows, or customer communications.",
      "Those providers process data under their own terms and privacy notices where applicable.",
    ],
  },
  {
    title: "6. Managing Cookies",
    paragraphs: [
      "You can control or delete cookies through your browser settings. Blocking some cookies may affect whether the platform works correctly, especially for account access and security-sensitive workflows.",
      "If the site presents a cookie banner or consent preference control, you can use that control to update your non-essential cookie preferences where available.",
    ],
  },
  {
    title: "7. Changes to This Policy",
    paragraphs: [
      "We may update this Cookie Policy as our product, providers, or legal obligations change. The latest version will be published on this page.",
    ],
  },
  {
    title: "8. Legal Entity & Registered Office",
    paragraphs: [
      "This Cookie Policy is issued by the company identified below. We publish it on behalf of that entity and on behalf of any group companies where relevant.",
    ],
    bullets: [
      "Company name: AllSquared Ltd",
      "Company number: 17313974 (Companies House, England & Wales)",
      "Registered office: Suite 15, 137–139 Brent Street, London NW4 4DJ, United Kingdom",
      "Registered email: hi@allsquared.uk",
      "Cookie / privacy enquiries: privacy@allsquared.uk",
    ],
  },
];

export default function CookiePolicy() {
  return (
    <MarketingLegalPage
      badge="Cookie policy"
      title="How AllSquared uses cookies and similar technologies."
      accent="cookies"
      description="This policy explains the cookies and similar technologies used by the public site and platform, why they are used, and how you can manage them."
      lastUpdated={new Date().toLocaleDateString("en-GB")}
      sections={sections}
      contactLabel="8. Contact"
      contactHref="mailto:privacy@allsquared.uk"
      contactText="For questions about this Cookie Policy, please contact us at"
    />
  );
}
