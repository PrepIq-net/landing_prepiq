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

        {/* Pillars — one connected day: dot + rail sequence, the live middle
            phase elevated, features as hairline rows (same language as the
            Cost-of-Guessing and Intelligence rows). */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {pillars.map((pillar, i) => {
            const Icon = ICONS[pillar.icon] || Calendar;
            const isLive = i === 1;
            return (
              <motion.div
                key={pillar.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`group relative flex flex-col p-6 sm:p-8 lg:p-10 ${
                  isLive ? "bg-primary/[0.03]" : "bg-card"
                }`}
              >
                {/* Step index */}
                <span className="absolute top-6 right-6 lg:top-10 lg:right-10 font-display text-[13px] font-semibold text-muted-foreground/40 tabular-nums">
                  0{i + 1}
                </span>

                {/* Timeline rail: dot + connector running across the three cards
                    (connector only on desktop — the rail is a single column on
                    mobile, so a trailing line would float off the edge). */}
                <div className="flex items-center gap-2 mb-8">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isLive ? "bg-primary ring-4 ring-primary/15" : "bg-primary/60"
                    }`}
                    aria-hidden
                  />
                  {i < pillars.length - 1 && (
                    <span className="hidden md:block h-px flex-1 bg-primary/25" aria-hidden />
                  )}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 group-hover:bg-primary/15 group-hover:border-primary/25 transition-colors duration-200">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <span className="mt-6 inline-flex items-center gap-2 text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  {isLive && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                  )}
                  {pillar.phase}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground tracking-[-0.02em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  {pillar.body}
                </p>

                <ul className="mt-7 border-t border-border">
                  {(pillar.features || []).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 border-b border-border/50 py-3 last:border-b-0"
                    >
                      <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden />
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
