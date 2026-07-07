"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TestimonialsContent, SectionContent } from "@/types/cms";
import { CountUp } from "./motion-primitives";

const FALLBACK_TESTIMONIALS = {
  en: [
    {
      quote:
        "I used to guess prep every morning. Now I review it. PrepIQ changed how my kitchen thinks about waste.",
      name: "Chef Adamu",
      role: "Head Chef",
      company: "Lagos Kitchen Co.",
      metric: "−9% waste",
    },
    {
      quote:
        "We cut waste by 9% in the first month. The forecast just works. Our margin improved before we even noticed.",
      name: "Sarah K.",
      role: "Ops Manager",
      company: "FreshBite",
      metric: "$3,200/mo",
    },
    {
      quote:
        "Finally, a system that understands how kitchens actually run. No bloat, no training needed. Just intelligence.",
      name: "Marcus T.",
      role: "Owner",
      company: "3-Branch Network",
      metric: "92% acc.",
    },
  ],
  fr: [
    {
      quote:
        "Je devinais la mise en place chaque matin. Maintenant, je la valide. PrepIQ a changé notre vision du gaspillage.",
      name: "Chef Adamu",
      role: "Chef de Cuisine",
      company: "Lagos Kitchen Co.",
      metric: "-9% gaspillage",
    },
    {
      quote:
        "Nous avons réduit le gaspillage de 9% dès le premier mois. La prévision fonctionne tout simplement.",
      name: "Sarah K.",
      role: "Responsable Opérations",
      company: "FreshBite",
      metric: "3 200€/mois",
    },
    {
      quote:
        "Enfin un système qui comprend la réalité d'une cuisine. Pas de superflu, pas de formation. Juste de l'intelligence.",
      name: "Marcus T.",
      role: "Propriétaire",
      company: "3-Branch Network",
      metric: "92% précision",
    },
  ],
};

const TestimonialsSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<TestimonialsContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: TestimonialsContent = dbContent?.[currentLang] || {
    badge: t("testimonials.badge", "From the Kitchen"),
    title: t("testimonials.title", "Real teams. Real margins."),
    subtitle: t("testimonials.subtitle", ""),
    items: FALLBACK_TESTIMONIALS[currentLang] || FALLBACK_TESTIMONIALS.en,
    stats: {
      powered: t("testimonials.stats.powered", "Kitchens powered"),
      processed: t("testimonials.stats.processed", "Meals / week"),
      onboarding: t("testimonials.stats.onboarding", "Avg. onboarding"),
      accuracy: t("testimonials.stats.accuracy", "Forecast accuracy"),
    },
  };

  const items = Array.isArray(content.items)
    ? content.items
    : FALLBACK_TESTIMONIALS[currentLang] || FALLBACK_TESTIMONIALS.en;

  const trustSignals = [
    { value: "40+", label: content.stats.powered },
    { value: "8,000+", label: content.stats.processed },
    { value: "48h", label: content.stats.onboarding },
    { value: "92%", label: content.stats.accuracy },
  ];

  return (
    <section className="relative py-24 md:py-32 border-t border-border/50 section-band">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3.5 mb-6">
            <div className="w-10 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
              {content.badge}
            </span>
            <div className="w-10 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em]">
            {content.title}
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid gap-5 md:grid-cols-3 mb-12">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-8 flex flex-col hover:border-primary/30 hover:shadow-l2 transition-all duration-300"
            >
              {/* Metric lead */}
              <p className="font-display text-[44px] font-semibold text-primary tracking-[-0.02em] leading-none mb-4">
                {item.metric}
              </p>

              {/* Quote */}
              <p className="text-[15px] text-foreground/90 leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-7 pt-5 border-t border-border flex items-center gap-3">
                <div className="h-[38px] w-[38px] rounded-full bg-primary/[0.12] border border-primary/25 flex items-center justify-center font-display font-semibold text-sm text-primary">
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex justify-center gap-16 flex-wrap">
          {trustSignals.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-[26px] font-semibold text-foreground">
                <CountUp value={s.value} />
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
