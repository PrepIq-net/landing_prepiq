"use client";
import { ArrowLeft, Shield, Lock, Server, Eye, FileCheck, Users } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t, i18n } = useTranslation();

  const securityFeatures = i18n.resolvedLanguage === 'fr' ? [
    {
      icon: Lock,
      title: "Chiffrement",
      description: "Toutes les données sont chiffrées en transit via TLS 1.3 et au repos par AES-256. Les communications API sont protégées de bout en bout.",
    },
    {
      icon: Server,
      title: "Infrastructure",
      description: "Hébergement sur des serveurs certifiés SOC 2 Type II avec redondance multi-zones. Nous garantissons un SLA de disponibilité de 99,9 %.",
    },
    {
      icon: Shield,
      title: "Contrôle d'Accès",
      description: "L'accès basé sur les rôles (RBAC) limite la visibilité au nécessaire. La double authentification (MFA) est disponible pour tous.",
    },
    {
      icon: Eye,
      title: "Surveillance & Détection",
      description: "Détection d'intrusion 24/7 et alertes en temps réel. Chaque accès est journalisé et audité systématiquement.",
    },
    {
      icon: FileCheck,
      title: "Conformité",
      description: "PrepIQ maintient sa certification SOC 2 Type II. Nous respectons scrupuleusement le RGPD et les meilleures pratiques du secteur.",
    },
    {
      icon: Users,
      title: "Sécurité Fournisseurs",
      description: "Nos partenaires subissent des audits de sécurité rigoureux. Nous limitons le partage de données au strict minimum opérationnel.",
    },
  ] : [
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="section-container flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground">PrepIQ</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </div>
      </header>

      <main className="section-container py-16 md:py-24 max-w-4xl">
        <div className="max-w-2xl mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">{t("security.title")}</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("security.subtitle")}
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
            <h2 className="text-lg font-semibold text-foreground mb-3">{i18n.resolvedLanguage === 'fr' ? "Cycle de Développement Sécurisé" : "Secure Development Lifecycle"}</h2>
            <p>
              {i18n.resolvedLanguage === 'fr'
                ? "Chaque modification de code passe par des scans de sécurité automatisés, une revue par les pairs et une validation en environnement de test avant la mise en production. Nous effectuons des tests d'intrusion réguliers via des cabinets tiers indépendants."
                : "Every code change goes through automated security scanning, peer review, and staging validation before reaching production. We perform regular penetration testing through independent third-party firms and run a continuous vulnerability management program across all systems."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{i18n.resolvedLanguage === 'fr' ? "Isolation des Données" : "Data Isolation"}</h2>
            <p>
              {i18n.resolvedLanguage === 'fr'
                ? "Les données de chaque client sont isolées logiquement au niveau de la base de données. L'accès inter-clients est architecturalement impossible. Les sauvegardes sont chiffrées et stockées dans des régions géographiques séparées."
                : "Each customer's data is logically isolated at the database level. Cross-tenant access is architecturally impossible. Backups are encrypted and stored in geographically separate regions with strict access controls."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{i18n.resolvedLanguage === 'fr' ? "Gestion des Incidents" : "Incident Response"}</h2>
            <p>
              {i18n.resolvedLanguage === 'fr'
                ? "Nous maintenons un plan de réponse aux incidents documenté. En cas d'incident, les clients concernés seront informés sous 72 heures conformément aux réglementations en vigueur."
                : "We maintain a documented incident response plan with defined escalation paths. In the unlikely event of a security incident, affected customers will be notified within 72 hours in accordance with applicable regulations. Post-incident reviews are conducted to prevent recurrence."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{i18n.resolvedLanguage === 'fr' ? "Divulgation Responsable" : "Responsible Disclosure"}</h2>
            <p>
              {i18n.resolvedLanguage === 'fr'
                ? "Si vous découvrez une vulnérabilité, veuillez nous la signaler à security@prepiq.com. Nous accusons réception sous 24 heures et ne poursuivons pas les chercheurs en sécurité agissant de bonne foi."
                : "If you discover a security vulnerability, please report it to security@prepiq.com. We appreciate responsible disclosure and will acknowledge receipt within 24 hours. We do not pursue legal action against good-faith security researchers."}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
