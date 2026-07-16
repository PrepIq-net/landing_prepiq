"use client";
import { motion } from "framer-motion";
import { Calendar, ViewGrid, RefreshDouble, Check } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { OperationsContent, OperationsPillar, SectionContent } from "@/types/cms";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  plan: Calendar,
  coordinate: ViewGrid,
  improve: RefreshDouble,
};

const FALLBACK: OperationsContent = {
  badge: "What PrepIQ does",
  title: "The operating system for your kitchen's day.",
  subtitle:
    "Not another forecast tool. PrepIQ runs the whole cycle — it plans the day, coordinates the line through service, and gets sharper every time you cook.",
  pillars: [
    {
      icon: "plan",
      phase: "Before open",
      title: "Plan the day",
      body: "Every morning, PrepIQ turns demand into a plan your team can act on — how much to prep, what to buy, and who's on the line.",
      features: [
        "Demand forecast from sales, weather, events & local signals",
        "Prep quantities with confidence scores — chefs stay in control",
        "Ingredient requirements & purchasing, calculated automatically",
        "Labor schedules built to match the day's demand",
      ],
    },
    {
      icon: "coordinate",
      phase: "During service",
      title: "Coordinate the line",
      body: "Once the plan is locked, PrepIQ turns it into assigned work and watches service live — so nothing slips and everyone knows what's next.",
      features: [
        "AI turns the plan into tasks, assigned to staff on shift",
        "A live board tracks what's to do, doing, and done",
        "Live alerts when an item is trending toward a stockout",
        "One place for the team to coordinate — web and mobile",
      ],
    },
    {
      icon: "improve",
      phase: "After close, every night",
      title: "Improve every service",
      body: "After service, PrepIQ reconciles the plan against what actually happened and learns — so tomorrow starts sharper than today.",
      features: [
        "End-of-day variance review — what missed, and why",
        "Separates demand surprises from operational causes",
        "Every override and outcome feeds the next forecast",
        "Waste, accuracy & margin, tracked over time",
      ],
    },
  ],
  footer: "One loop. Every day your kitchen runs tighter than the last.",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const OperationsSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<OperationsContent>;
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const content = dbContent?.[currentLang] || FALLBACK;
  const pillars: OperationsPillar[] = Array.isArray(content.pillars)
    ? content.pillars
    : FALLBACK.pillars;

  return (
    <section className="relative py-24 md:py-36 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-[720px]"
        >
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-px bg-primary" />
            <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
              {content.badge}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-5 text-balance">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-[560px]">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {pillars.map((pillar, i) => {
            const Icon = ICONS[pillar.icon] || Calendar;
            return (
              <motion.div
                key={pillar.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative flex flex-col bg-card p-8 lg:p-10 transition-colors hover:bg-accent/30"
              >
                {/* Step index */}
                <span className="absolute top-8 right-8 lg:right-10 font-display text-sm font-semibold text-muted-foreground/40 tabular-nums">
                  0{i + 1}
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="mt-6 text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.22em] text-primary/80 font-medium">
                  {pillar.phase}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground tracking-[-0.01em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  {pillar.body}
                </p>

                <ul className="mt-7 flex flex-col gap-3 border-t border-border pt-7">
                  {(pillar.features || []).map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="text-[13px] md:text-sm text-foreground/85 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Footer line */}
        {content.footer && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-center text-[15px] md:text-lg font-medium text-primary"
          >
            {content.footer}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default OperationsSection;
