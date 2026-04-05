export default function CookiePolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <p className="text-muted-foreground mb-6">Last updated: April 2025</p>

      <section className="space-y-6 text-base leading-relaxed">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            This Cookie Policy explains how AllSquared Ltd (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses
            cookies and similar tracking technologies on our website at{" "}
            <strong>allsquared.io</strong> and <strong>allsquared.uk</strong>. This policy complies
            with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018,
            and the Privacy and Electronic Communications Regulations 2003 (PECR).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They help
            the website remember your preferences and understand how you interact with the site.
            Cookies may be &quot;session&quot; cookies (deleted when you close your browser) or
            &quot;persistent&quot; cookies (remain until they expire or you delete them).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Cookies We Use</h2>

          <h3 className="text-xl font-medium mt-4 mb-2">3.1 Strictly Necessary Cookies</h3>
          <p className="mb-2">
            These cookies are essential for the website to function and cannot be switched off. They
            include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Authentication cookies</strong> (Clerk) &mdash; maintain your signed-in
              session.
            </li>
            <li>
              <strong>CSRF protection</strong> &mdash; protect against cross-site request forgery.
            </li>
            <li>
              <strong>Load-balancing / infrastructure cookies</strong> (Vercel) &mdash; route
              requests to the correct server.
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Legal basis: these cookies do not require consent under PECR Regulation 6(4) as they are
            strictly necessary for the service you have requested.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">3.2 Analytics Cookies</h3>
          <p className="mb-2">
            We use Vercel Analytics to understand how visitors interact with our site. These cookies
            collect anonymised data such as page views and navigation patterns. No personal
            identifiers are stored.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Vercel Web Analytics</strong> &mdash; privacy-focused, cookieless analytics
              where possible.
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">3.3 Functional Cookies</h3>
          <p className="mb-2">These cookies enable enhanced functionality and personalisation:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Theme preference</strong> &mdash; remembers your light/dark mode choice.
            </li>
            <li>
              <strong>Cookie consent state</strong> &mdash; remembers your cookie preferences.
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">3.4 Third-Party Cookies</h3>
          <p className="mb-2">
            Some third-party services embedded in our site may set their own cookies:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Stripe</strong> &mdash; for secure payment processing and fraud prevention.
            </li>
            <li>
              <strong>Clerk</strong> &mdash; for authentication and session management.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Your Cookie Choices</h2>
          <p className="mb-2">Under PECR and UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Accept or reject non-essential cookies when first visiting our site.</li>
            <li>Change your cookie preferences at any time via your browser settings.</li>
            <li>Delete cookies already stored on your device.</li>
          </ul>
          <p className="mt-2">
            Please note that blocking strictly necessary cookies may prevent you from using core
            features of our platform such as signing in or making payments.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. How to Control Cookies</h2>
          <p className="mb-2">
            Most web browsers allow you to control cookies through their settings. Common browsers:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Chrome</strong>: Settings &rarr; Privacy and Security &rarr; Cookies
            </li>
            <li>
              <strong>Firefox</strong>: Settings &rarr; Privacy &amp; Security &rarr; Cookies
            </li>
            <li>
              <strong>Safari</strong>: Preferences &rarr; Privacy &rarr; Manage Website Data
            </li>
            <li>
              <strong>Edge</strong>: Settings &rarr; Cookies and site permissions
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
          <p>
            Session cookies are deleted when you close your browser. Persistent cookies remain for
            the duration specified in the cookie, typically between 30 days and 1 year. You can
            delete persistent cookies at any time through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">7. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology,
            legislation, or our business practices. We will post the updated policy on this page
            with a revised &quot;Last updated&quot; date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            If you have questions about our use of cookies or this policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>AllSquared Ltd</strong>
            <br />
            Email:{" "}
            <a href="mailto:privacy@allsquared.io" className="text-primary underline">
              privacy@allsquared.io
            </a>
          </p>
        </div>

        <div className="border-t pt-6 mt-8">
          <p className="text-sm text-muted-foreground">
            This policy has been prepared in accordance with the UK GDPR, the Data Protection Act
            2018, and the Privacy and Electronic Communications (EC Directive) Regulations 2003
            (PECR) as amended.
          </p>
        </div>
      </section>
    </div>
  );
}
