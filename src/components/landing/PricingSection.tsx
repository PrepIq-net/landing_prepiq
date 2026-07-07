import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { PricingContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";
import { GoldText } from "./GoldText";
import { APP_URL } from "@/lib/constants";

const PLAN_META = {
  core: {
    monthlyPrice: 49,
    yearlyPrice: 499,
    trial: true,
    popular: false,
    limits: { branches: "1", staffEn: "Up to 15", staffFr: "Jusqu'à 15" },
  },
  intelligence: {
    monthlyPrice: 149,
    yearlyPrice: 1519,
    trial: false,
    popular: true,
    limits: { branches: "10", staffEn: "Unlimited", staffFr: "Illimité" },
  },
  command: {
    monthlyPrice: 349,
    yearlyPrice: 3559,
    trial: false,
    popular: false,
    limits: {
      branchesEn: "Unlimited",
      branchesFr: "Illimité",
      staffEn: "Unlimited",
      staffFr: "Illimité",
    },
  },
} as const;

const ADDON_META = [
  { price: 79, plans: ["Command"] },
  { price: 59, plans: ["Command"] },
  { price: 99, plans: ["Intelligence", "Command"] },
  { price: 49, plans: ["Intelligence", "Command"] },
  { price: 299, plans: ["Command"] },
];

const FALLBACK_FEATURES = {
  en: {
    core: [
      "Single-branch operations",
      "Basic role & permission management",
      "POS integration + CSV fallback",
      "Daily prep forecast engine",
      "Manual override & waste logging",
      "Manual 86 tracking",
      "7–14 day variance history",
    ],
    intelligence: [
      "Everything in Core",
      "POS + inventory auto-reconciliation",
      "Waste-to-cost attribution",
      "Staff accountability engine",
      "Forecast confidence + learning loop",
      "Predictive drift detection",
      "Margin protection signals",
      "30–90 day trend analysis",
      "6 AM executive PDF report",
      "CSV & PDF exports",
    ],
    command: [
      "Everything in Intelligence",
      "Multi-branch rollup & comparison",
      "Executive command center",
      "Procurement anomaly detection",
      "Advanced forecasting & benchmarking",
      "Audit/compliance exports + API",
      "Centralized admin controls",
      "Custom enterprise pricing at scale",
    ],
  },
  fr: {
    core: [
      "Gestion d'un seul site",
      "Rôles et permissions de base",
      "Intégration POS + import CSV",
      "Moteur de prévision quotidien",
      "Ajustements manuels et saisie des pertes",
      "Suivi manuel des ruptures",
      "Historique des écarts (7–14 jours)",
    ],
    intelligence: [
      "Tout ce qui est dans Core",
      "Réconciliation POS + inventaire auto",
      "Attribution coût des pertes",
      "Moteur de responsabilité équipe",
      "Confiance prévision + boucle d'apprentissage",
      "Détection prédictive de dérive",
      "Signaux de protection de marge",
      "Analyse de tendances (30–90 jours)",
      "Rapport PDF exécutif à 6h00",
      "Exports CSV et PDF",
    ],
    command: [
      "Tout ce qui est dans Intelligence",
      "Consolidation et comparaison multi-sites",
      "Centre de commande exécutif",
      "Détection d'anomalies d'achats",
      "Prévisions avancées et benchmarking",
      "Exports conformité + API",
      "Contrôles admin centralisés",
      "Tarification entreprise sur mesure",
    ],
  },
};

const FALLBACK_ADDONS = {
  en: [
    {
      name: "Tax Engine",
      desc: "Automatically calculate and apply local tax rules across jurisdictions, so every location stays compliant without manual work.",
    },
    {
      name: "Liability Shield",
      desc: "Generates audit-ready waste logs, HACCP-aligned reports, and timestamped records for regulatory inspections and insurance claims.",
    },
    {
      name: "Enterprise SSO",
      desc: "Single sign-on via SAML/OIDC for your entire org. One login, centralized access control, and automatic provisioning.",
    },
    {
      name: "Advanced API",
      desc: "Full REST API access to push forecasts, pull waste data, and integrate PrepIQ into your existing ERP, BI, or procurement systems.",
    },
    {
      name: "Dedicated Analyst",
      desc: "A named PrepIQ analyst reviews your data weekly, delivers optimization recommendations, and helps you hit waste-reduction targets.",
    },
  ],
  fr: [
    {
      name: "Moteur Fiscal",
      desc: "Calcul et application automatique des taxes locales selon les juridictions pour rester conforme sans effort.",
    },
    {
      name: "Bouclier Légal",
      desc: "Génère des registres de pertes conformes HACCP et des rapports horodatés pour les inspections et assurances.",
    },
    {
      name: "SSO Entreprise",
      desc: "Connexion unique via SAML/OIDC pour toute l'organisation. Un seul login, accès centralisé.",
    },
    {
      name: "API Avancée",
      desc: "Accès complet à l'API REST pour pousser les prévisions et intégrer PrepIQ à vos ERP ou BI existants.",
    },
    {
      name: "Analyste Dédié",
      desc: "Un analyste PrepIQ examine vos données chaque semaine et vous aide à atteindre vos objectifs de réduction des pertes.",
    },
  ],
};

const PricingSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<PricingContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const [annual, setAnnual] = useState(true);

  const content: PricingContent = dbContent?.[currentLang] || {
    badge: t("pricing.badge"),
    title: t("pricing.title"),
    subtitle: t("pricing.subtitle"),
    monthly: t("pricing.monthly"),
    annual: t("pricing.annual"),
    save: t("pricing.save"),
    perMonth: t("pricing.perMonth"),
    perYear: t("pricing.perYear"),
    billedAnnually: t("pricing.billedAnnually"),
    billedMonthly: t("pricing.billedMonthly"),
    branches: t("pricing.branches"),
    staff: t("pricing.staff"),
    mostPopular: t("pricing.mostPopular"),
    footer: t("pricing.footer"),
    plans: {
      core: {
        name: t("pricing.plans.core.name"),
        tagline: t("pricing.plans.core.tagline"),
        cta: t("pricing.plans.core.cta"),
        features: FALLBACK_FEATURES[currentLang].core,
      },
      intelligence: {
        name: t("pricing.plans.intelligence.name"),
        tagline: t("pricing.plans.intelligence.tagline"),
        cta: t("pricing.plans.intelligence.cta"),
        features: FALLBACK_FEATURES[currentLang].intelligence,
      },
      command: {
        name: t("pricing.plans.command.name"),
        tagline: t("pricing.plans.command.tagline"),
        cta: t("pricing.plans.command.cta"),
        features: FALLBACK_FEATURES[currentLang].command,
      },
    },
    addOns: {
      title: t("pricing.addOns.title"),
      subtitle: t("pricing.addOns.subtitle"),
      items: FALLBACK_ADDONS[currentLang],
    },
  };

  const staffLabel = (key: keyof typeof PLAN_META) => {
    const limits = PLAN_META[key].limits as Record<string, string>;
    return currentLang === "fr" ? limits.staffFr : limits.staffEn;
  };
  const branchesLabel = (key: keyof typeof PLAN_META) => {
    const limits = PLAN_META[key].limits as Record<string, string>;
    if (limits.branches) return limits.branches;
    return currentLang === "fr" ? limits.branchesFr : limits.branchesEn;
  };

  const plans = useMemo(
    () =>
      (["core", "intelligence", "command"] as const).map((key) => {
        const meta = PLAN_META[key];
        const planContent = content.plans[key] || {
          name: "",
          tagline: "",
          cta: "",
          features: [],
        };
        return {
          key,
          name: planContent.name,
          tagline: planContent.tagline,
          cta: planContent.cta,
          features: Array.isArray(planContent.features)
            ? planContent.features
            : [],
          monthlyPrice: meta.monthlyPrice,
          yearlyPrice: meta.yearlyPrice,
          trial: meta.trial
            ? currentLang === "fr"
              ? "Essai gratuit de 30 jours"
              : "30-day free pilot"
            : null,
          popular: meta.popular,
          limits: { branches: branchesLabel(key), staff: staffLabel(key) },
        };
      }),
    [content, currentLang],
  );

  const addOns = useMemo(() => {
    const items = Array.isArray(content.addOns?.items)
      ? content.addOns.items
      : [];
    return items.map((item, i) => ({ ...item, ...ADDON_META[i] }));
  }, [content]);

  const [footerBefore, footerLink, footerAfter] = useMemo(() => {
    const match = content.footer?.match(/^(.*)<primary>\s*(.*?)\s*<\/primary>(.*)$/s);
    if (!match) return [content.footer, null, ""];
    return [match[1], match[2], match[3]];
  }, [content.footer]);

  return (
    <section
      id="pricing"
      className="relative py-20 md:py-32 border-t border-border/50 scroll-mt-20"
    >
      <SeamAccent />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            {content.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            <GoldText text={content.title} />
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10 md:mb-16 flex-wrap">
          <span
            className={`text-sm font-medium transition-colors duration-200 ${!annual ? "text-foreground" : "text-muted-foreground/40"}`}
          >
            {content.monthly}
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-8 w-14 rounded-full border transition-colors duration-200 ${
              annual
                ? "bg-primary/20 border-primary/30"
                : "bg-accent border-border"
            }`}
          >
            <motion.div
              animate={{ x: annual ? 28 : 3 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className={`absolute top-1 h-6 w-6 rounded-full transition-colors duration-200 ${
                annual ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors duration-200 ${annual ? "text-foreground" : "text-muted-foreground/40"}`}
          >
            {content.annual}
          </span>
          {annual && (
            <span className="text-xs font-medium text-[hsl(var(--success))] bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)] rounded-full px-3 py-1">
              {content.save}
            </span>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-14 md:mb-20">
          {plans.map((plan, i) => {
            const price = annual
              ? Math.round(plan.yearlyPrice / 12)
              : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2, delay: 0 } }}
                transition={{ delay: i * 0.06 }}
                className={`relative rounded-2xl border flex flex-col hover:shadow-l2 transition-[border-color,box-shadow] duration-200 ${
                  plan.popular
                    ? "border-primary/40 bg-card shadow-l3"
                    : "border-border bg-card/80 hover:border-primary/25"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-primary-foreground bg-primary px-4 py-1.5 rounded-full">
                      {content.mostPopular}
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-7 md:p-8 flex flex-col flex-1">
                  <div className="mb-7">
                    <p className="text-base font-semibold text-foreground mb-2">
                      {plan.name}
                    </p>
                    <p className="text-sm text-muted-foreground/60">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-7">
                    <div className="flex items-baseline gap-1.5 overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={price}
                          initial={{ y: "0.6em", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "-0.6em", opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="inline-block text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground"
                        >
                          {currentLang === "fr" ? `${price} €` : `$${price}`}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-muted-foreground/40">
                        {content.perMonth}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-2">
                      {currentLang === "fr" ? "par site" : "per location"} ·{" "}
                      {annual ? content.billedAnnually : content.billedMonthly}
                      {annual && (
                        <span className="text-muted-foreground/50">
                          {" "}
                          ·{" "}
                          {currentLang === "fr"
                            ? `${plan.yearlyPrice} €`
                            : `$${plan.yearlyPrice}`}
                          {content.perYear}
                        </span>
                      )}
                    </p>
                    {plan.trial && (
                      <p className="text-xs text-[hsl(var(--success))] font-medium mt-2.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                        {plan.trial}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mb-7">
                    <div className="rounded-xl bg-accent/40 border border-border/20 px-4 py-3 flex-1 text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {plan.limits.branches}
                      </p>
                      <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mt-0.5">
                        {content.branches}
                      </p>
                    </div>
                    <div className="rounded-xl bg-accent/40 border border-border/20 px-4 py-3 flex-1 text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {plan.limits.staff}
                      </p>
                      <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mt-0.5">
                        {content.staff}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-snug">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant={plan.popular ? "hero" : "hero-outline"}
                    size="lg"
                    className="w-full group"
                  >
                    {plan.key === "command" ? (
                      <a
                        href="/contact"
                        className="flex items-center justify-center gap-2"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <a
                        href={APP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium mb-3">
              {content.addOns.title}
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {content.addOns.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6 flex flex-col hover:border-primary/25 hover:bg-card transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {addon.name}
                  </p>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-base font-semibold text-foreground">
                      {currentLang === "fr"
                        ? `${addon.price} €`
                        : `$${addon.price}`}
                    </span>
                    <span className="text-xs text-muted-foreground/40">
                      {content.perMonth}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                  {addon.desc}
                </p>
                <div className="flex items-center gap-1.5">
                  {addon.plans.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-medium text-muted-foreground/50 bg-accent/60 border border-border/30 rounded-md px-2 py-0.5"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-10 md:mt-14 max-w-lg mx-auto leading-relaxed px-2">
          {footerBefore}
          {footerLink && (
            <a
              href="/contact"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              {footerLink}
            </a>
          )}
          {footerAfter}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
