export default function Terms() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to AllSquared. These Terms of Service ("Terms") govern your
              use of our platform and services. By accessing or using AllSquared,
              you agree to be bound by these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Service Description
            </h2>
            <p className="text-muted-foreground mb-4">
              AllSquared provides an online platform for generating service
              contracts, managing escrow payments, and facilitating milestone-based
              project management. Our services include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>AI-powered contract generation</li>
              <li>Digital signature services</li>
              <li>FCA-backed escrow payment management</li>
              <li>Milestone tracking and management</li>
              <li>AI-assisted dispute resolution</li>
              <li>Optional lawyer referral services (LITL)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              You must be at least 18 years old and legally capable of entering
              into binding contracts to use AllSquared. By using our services, you
              represent and warrant that you meet these requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Account Registration
            </h2>
            <p className="text-muted-foreground mb-4">
              To use AllSquared, you must create an account and provide accurate,
              complete information. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Fees and Payments</h2>
            <p className="text-muted-foreground mb-4">
              AllSquared charges subscription fees and transaction fees as outlined
              on our Pricing page. All fees are non-refundable except as required
              by law. Escrow transaction fees are separate and charged at 2.5% for
              Professional plan users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Escrow Services
            </h2>
            <p className="text-muted-foreground mb-4">
              Escrow services are provided through our FCA-authorised partners.
              Funds held in escrow are subject to the terms and conditions of our
              escrow partners. AllSquared acts as a facilitator and is not
              responsible for the escrow partner's actions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Legal Disclaimer
            </h2>
            <p className="text-muted-foreground mb-4">
              AllSquared provides technology tools for contract generation and
              management. We are not a law firm and do not provide legal advice.
              Contracts generated through our platform should be reviewed by a
              qualified solicitor for complex or high-value transactions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law, AllSquared shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Termination
            </h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate your account at any time
              for violation of these Terms or for any other reason at our sole
              discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-muted-foreground mb-4">
              We may update these Terms from time to time. Continued use of
              AllSquared after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:hello@allsquared.uk"
                className="text-primary hover:underline"
              >
                hello@allsquared.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

