"use client";

import { motion } from "framer-motion";
import { QuoteMessage, StarSolid } from "iconoir-react";
import { useTranslation } from "react-i18next";

const TestimonialsSection = () => {
  const { t, i18n } = useTranslation();

  const testimonials = [
    {
      quote: i18n.resolvedLanguage === 'fr' ? "Je devinais la mise en place chaque matin. Maintenant, je la valide. PrepIQ a changé notre vision du gaspillage." : "I used to guess prep every morning. Now I review it. PrepIQ changed how my kitchen thinks about waste.",
      name: "Chef Adamu",
      role: i18n.resolvedLanguage === 'fr' ? "Chef de Cuisine" : "Head Chef",
      company: "Lagos Kitchen Co.",
      metric: i18n.resolvedLanguage === 'fr' ? "-9 % de gaspillage" : "9% waste reduction",
    },
    {
      quote: i18n.resolvedLanguage === 'fr' ? "Nous avons réduit le gaspillage de 9 % dès le premier mois. La prévision fonctionne tout simplement. Notre marge a bondi." : "We cut waste by 9% in the first month. The forecast just works. Our margin improved before we even noticed.",
      name: "Sarah K.",
      role: i18n.resolvedLanguage === 'fr' ? "Responsable Opérations" : "Ops Manager",
      company: "FreshBite",
      metric: i18n.resolvedLanguage === 'fr' ? "3 200 €/mois sauvés" : "$3,200/mo saved",
    },
    {
      quote: i18n.resolvedLanguage === 'fr' ? "Enfin un système qui comprend la réalité d'une cuisine. Pas de superflu, pas de formation. Juste de l'intelligence." : "Finally, a system that understands how kitchens actually run. No bloat, no training needed. Just intelligence.",
      name: "Marcus T.",
      role: i18n.resolvedLanguage === 'fr' ? "Propriétaire" : "Owner",
      company: "3-Branch Network",
      metric: "92 % de précision",
    },
  ];

  const trustSignals = [
    { value: "40+", label: t("testimonials.stats.powered") },
    { value: "8,000+", label: t("testimonials.stats.processed") },
    { value: "48h", label: t("testimonials.stats.onboarding") },
    { value: "92%", label: t("testimonials.stats.accuracy") },
  ];

  return (
    <section className="py-28 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.02),transparent_60%)] pointer-events-none" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4 block">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 leading-tight lg:leading-[1.15]">
            {t("testimonials.title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 mb-14">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-7 md:p-8 group hover:border-primary/20 transition-colors duration-300 relative overflow-hidden flex flex-col"
            >
              {/* Subtle top hover glow */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/0 group-hover:from-primary/[0.03] to-transparent transition-all duration-500" />

              <div className="relative flex-1 flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <StarSolid key={j} className="h-3.5 w-3.5 text-primary" />
                  ))}
                </div>

                <QuoteMessage className="h-5 w-5 text-primary/30 mb-3" />
                <p className="text-sm text-foreground leading-relaxed flex-1">"{t.quote}"</p>

                <div className="mt-6 pt-5 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-primary">{t.metric}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust signals bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border"
        >
          {trustSignals.map((signal, i) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="bg-card px-5 py-5 text-center"
            >
              <p className="text-xl md:text-2xl font-semibold text-primary mb-1">{signal.value}</p>
              <p className="text-xs text-muted-foreground">{signal.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
