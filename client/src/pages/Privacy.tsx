export default function Privacy() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              AllSquared ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                Personal information (name, email address, phone number)
              </li>
              <li>Account credentials</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Contract details and project information</li>
              <li>Communications with us and other users</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage escrow payments</li>
              <li>Generate and manage contracts</li>
              <li>Communicate with you about your account and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Detect, prevent, and address fraud and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Information Sharing
            </h2>
            <p className="text-muted-foreground mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                Service providers who assist in operating our platform (payment
                processors, escrow partners, cloud hosting)
              </li>
              <li>
                Other users as necessary to facilitate contracts and transactions
              </li>
              <li>
                Legal authorities when required by law or to protect our rights
              </li>
              <li>
                Professional advisors (lawyers, accountants) under confidentiality
                obligations
              </li>
            </ul>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to
              protect your information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage with reputable cloud providers</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              However, no method of transmission over the internet is 100% secure.
              We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under UK GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:privacy@allsquared.uk"
                className="text-primary hover:underline"
              >
                privacy@allsquared.uk
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your information for as long as necessary to provide our
              services and comply with legal obligations. Contract data may be
              retained for up to 7 years for legal and tax purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to improve your
              experience, analyze usage, and deliver personalized content. You can
              control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Third-Party Links
            </h2>
            <p className="text-muted-foreground mb-4">
              Our platform may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes by email or through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a
                href="mailto:privacy@allsquared.uk"
                className="text-primary hover:underline"
              >
                privacy@allsquared.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

