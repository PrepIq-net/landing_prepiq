import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const plans = [
  {
    name: "Core",
    tagline: "Daily Operational Visibility",
    monthlyPrice: 49,
    yearlyPrice: 499,
    trial: "30-day free pilot",
    perLocation: true,
    popular: false,
    features: [
      "Single-branch operations",
      "Basic role & permission management",
      "POS integration + CSV fallback",
      "Daily prep forecast engine",
      "Manual override & waste logging",
      "Manual 86 tracking",
      "7–14 day variance history",
    ],
    limits: { branches: "1", staff: "Up to 15" },
    cta: "Start Free Pilot",
  },
  {
    name: "Intelligence",
    tagline: "Margin Protection Intelligence",
    monthlyPrice: 149,
    yearlyPrice: 1519,
    trial: null,
    perLocation: true,
    popular: true,
    features: [
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
    limits: { branches: "Up to 10", staff: "Unlimited" },
    cta: "Get Started",
  },
  {
    name: "Command",
    tagline: "Multi-Branch Command Center",
    monthlyPrice: 349,
    yearlyPrice: 3559,
    trial: null,
    perLocation: true,
    popular: false,
    features: [
      "Everything in Intelligence",
      "Multi-branch rollup & comparison",
      "Executive command center",
      "Procurement anomaly detection",
      "Advanced forecasting & benchmarking",
      "Audit/compliance exports + API",
      "Centralized admin controls",
      "Custom enterprise pricing at scale",
    ],
    limits: { branches: "Unlimited", staff: "Unlimited" },
    cta: "Talk to Sales",
  },
];

const addOns = [
  {
    name: "Tax Engine",
    price: 79,
    plans: ["Command"],
    desc: "Automatically calculate and apply local tax rules across jurisdictions, so every location stays compliant without manual work.",
  },
  {
    name: "Liability Shield",
    price: 59,
    plans: ["Command"],
    desc: "Generates audit-ready waste logs, HACCP-aligned reports, and timestamped records for regulatory inspections and insurance claims.",
  },
  {
    name: "Enterprise SSO",
    price: 99,
    plans: ["Intelligence", "Command"],
    desc: "Single sign-on via SAML/OIDC for your entire org. One login, centralized access control, and automatic provisioning.",
  },
  {
    name: "Advanced API",
    price: 49,
    plans: ["Intelligence", "Command"],
    desc: "Full REST API access to push forecasts, pull waste data, and integrate PrepIQ into your existing ERP, BI, or procurement systems.",
  },
  {
    name: "Dedicated Analyst",
    price: 299,
    plans: ["Command"],
    desc: "A named PrepIQ analyst reviews your data weekly, delivers optimization recommendations, and helps you hit waste-reduction targets.",
  },
];

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 md:py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 pattern-squares opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.03),transparent_60%)] pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            One Kitchen or{" "}
            <span className="text-gradient-gold">Fifty</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Per-location pricing that scales with your operations. Start with a free pilot,
            upgrade as your network grows.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-10 md:mb-16 flex-wrap"
        >
          <span className={`text-sm font-medium transition-colors duration-300 ${!annual ? "text-foreground" : "text-muted-foreground/40"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-8 w-14 rounded-full border transition-all duration-300 ${
              annual ? "bg-primary/20 border-primary/30" : "bg-accent border-border"
            }`}
          >
            <motion.div
              animate={{ x: annual ? 28 : 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`absolute top-1 h-6 w-6 rounded-full transition-colors duration-300 ${
                annual ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors duration-300 ${annual ? "text-foreground" : "text-muted-foreground/40"}`}>
            Annual
          </span>
          {annual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-medium text-[hsl(var(--success))] bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)] rounded-full px-3 py-1"
            >
              Save ~15%
            </motion.span>
          )}
        </motion.div>

        {/* Plan cards */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-14 md:mb-20">
          {plans.map((plan, i) => {
            const price = annual ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? "border-primary/30 bg-card shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.1)]"
                    : "border-border bg-card/80 hover:border-border hover:shadow-[0_4px_24px_-4px_hsl(0_0%_0%/0.15)]"
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-primary-foreground bg-primary px-4 py-1.5 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-7 md:p-8 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2.5 mb-2">
                      <p className="text-base font-semibold text-foreground">{plan.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground/60">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-7">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground">${price}</span>
                      <span className="text-sm text-muted-foreground/40">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-2">
                      per location · billed {annual ? "annually" : "monthly"}
                      {annual && <span className="text-muted-foreground/50"> · ${plan.yearlyPrice}/yr</span>}
                    </p>
                    {plan.trial && (
                      <p className="text-xs text-[hsl(var(--success))] font-medium mt-2.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                        {plan.trial}
                      </p>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="flex gap-3 mb-7">
                    <div className="rounded-xl bg-accent/40 border border-border/20 px-4 py-3 flex-1 text-center">
                      <p className="text-sm font-semibold text-foreground">{plan.limits.branches}</p>
                      <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mt-0.5">Branches</p>
                    </div>
                    <div className="rounded-xl bg-accent/40 border border-border/20 px-4 py-3 flex-1 text-center">
                      <p className="text-sm font-semibold text-foreground">{plan.limits.staff}</p>
                      <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mt-0.5">Staff</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    variant={plan.popular ? "hero" : "hero-outline"}
                    size="lg"
                    className="w-full group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium mb-3">
              Optional Add-ons
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Extend PrepIQ with specialized modules. Each add-on is billed per location
              and can be added or removed anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 sm:p-6 flex flex-col hover:border-border hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.06)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{addon.name}</p>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-base font-semibold text-foreground">${addon.price}</span>
                    <span className="text-xs text-muted-foreground/40">/mo</span>
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground/40 mt-10 md:mt-14 max-w-lg mx-auto leading-relaxed px-2"
        >
          All plans include encrypted data, SOC 2 practices, and dedicated onboarding.
          Enterprise deployments with 10+ locations get custom pricing — <span className="text-primary/60">talk to sales</span>.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
