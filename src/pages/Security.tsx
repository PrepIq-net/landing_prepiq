import { ArrowLeft, Shield, Lock, Server, Eye, FileCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption",
    description: "All data is encrypted in transit with TLS 1.3 and at rest using AES-256 encryption. Database connections use SSL certificates, and all API communications are encrypted end-to-end.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description: "Our infrastructure is hosted on SOC 2 Type II certified cloud providers with redundant systems across multiple availability zones. We maintain 99.9% uptime SLA with automated failover.",
  },
  {
    icon: Shield,
    title: "Access Controls",
    description: "Role-based access control (RBAC) ensures team members only see what they need. Multi-factor authentication (MFA) is available for all accounts. Session tokens expire automatically after inactivity.",
  },
  {
    icon: Eye,
    title: "Monitoring & Detection",
    description: "24/7 automated threat monitoring, intrusion detection systems, and real-time alerting. All access events are logged and auditable. Anomalous behavior triggers immediate investigation.",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    description: "PrepIQ maintains SOC 2 Type II compliance with annual third-party audits. We adhere to GDPR, CCPA, and industry best practices for data protection and privacy.",
  },
  {
    icon: Users,
    title: "Vendor Security",
    description: "All third-party vendors undergo rigorous security assessments before integration. We maintain a minimal vendor footprint and regularly review access permissions and data sharing agreements.",
  },
];

const Security = () => {
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

      <main className="section-container py-16 md:py-24 max-w-4xl">
        <div className="max-w-2xl mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Security at PrepIQ</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your kitchen data is the backbone of your operations. We treat it with the same care you put into every plate — protected at every layer, audited regularly, and never sold to third parties.
          </p>
        </div>

        {/* Security features grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-20">
          {securityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card/60 p-6 space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Practices */}
        <div className="max-w-3xl space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Secure Development Lifecycle</h2>
            <p>
              Every code change goes through automated security scanning, peer review, and staging validation before reaching production. We perform regular penetration testing through independent third-party firms and run a continuous vulnerability management program across all systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data Isolation</h2>
            <p>
              Each customer's data is logically isolated at the database level. Cross-tenant access is architecturally impossible. Backups are encrypted and stored in geographically separate regions with strict access controls.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Incident Response</h2>
            <p>
              We maintain a documented incident response plan with defined escalation paths. In the unlikely event of a security incident, affected customers will be notified within 72 hours in accordance with applicable regulations. Post-incident reviews are conducted to prevent recurrence.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Responsible Disclosure</h2>
            <p>
              If you discover a security vulnerability, please report it to{" "}
              <a href="mailto:security@prepiq.com" className="text-primary hover:underline">security@prepiq.com</a>.
              We appreciate responsible disclosure and will acknowledge receipt within 24 hours. We do not pursue legal action against good-faith security researchers.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Security;
