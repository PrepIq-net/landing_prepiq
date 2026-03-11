import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="section-container flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground">PrepIQ</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="section-container py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 8, 2026</p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              PrepIQ ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services. Please read this policy carefully. By using the Service, you consent to the practices described herein.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Account Information:</strong> Name, email address, company name, and role when you register</li>
              <li><strong className="text-foreground">Operational Data:</strong> Sales data, inventory records, menu items, and other kitchen-related data you upload</li>
              <li><strong className="text-foreground">Usage Data:</strong> How you interact with the Service, including pages visited, features used, and session duration</li>
              <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
              <li><strong className="text-foreground">Communication Data:</strong> Messages you send through our contact forms or support channels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide, maintain, and improve the Service</li>
              <li>Generate demand forecasts, prep plans, and operational recommendations</li>
              <li>Process transactions and manage your subscription</li>
              <li>Send service-related communications and updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Detect, prevent, and address technical or security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Sharing & Disclosure</h2>
            <p className="mb-3">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Service Providers:</strong> Trusted third parties that help us operate the Service (hosting, analytics, payment processing)</li>
              <li><strong className="text-foreground">Legal Compliance:</strong> When required by law, regulation, or legal process</li>
              <li><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong className="text-foreground">With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption in transit (TLS 1.3) and at rest (AES-256), regular security audits, and access controls. Our infrastructure is SOC 2 compliant. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide the Service. Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law. Anonymized, aggregated data may be retained indefinitely for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access, correct, or delete your personal information</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Restrict or object to certain data processing</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@prepiq.com" className="text-primary hover:underline">privacy@prepiq.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Cookies & Tracking</h2>
            <p>
              We use essential cookies to operate the Service and optional analytics cookies to understand usage patterns. You can manage cookie preferences through your browser settings. Disabling essential cookies may affect Service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. International Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including Standard Contractual Clauses, to protect your data in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Children's Privacy</h2>
            <p>
              The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the "Last updated" date. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@prepiq.com" className="text-primary hover:underline">privacy@prepiq.com</a>{" "}
              or by mail at PrepIQ, San Francisco, CA.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
