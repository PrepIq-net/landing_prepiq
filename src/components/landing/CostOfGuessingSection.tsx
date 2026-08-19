"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CostOfGuessingContent, SectionContent } from "@/types/cms";

const PROBLEM_COLORS = [
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--info))",
];

const CostOfGuessingSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<CostOfGuessingContent>;
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  // Copy and problem rows come from the CMS only — no hardcoded section copy.
  const content = dbContent?.[currentLang];
  if (!content) return null;

  const problems = Array.isArray(content.problems) ? content.problems : [];

  return (
    <section className="relative py-24 md:py-36">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-24 items-center">
          {/* Left: Photo with offset border */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute top-6 left-6 right-[-24px] bottom-[-24px] border border-primary/35 rounded-2xl pointer-events-none" />
            <div
              className="relative rounded-2xl overflow-hidden shadow-l2"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src="/images/prep-ingredients.jpg"
                alt="Fresh ingredients being prepped"
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.92) brightness(0.96)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, hsl(240 7% 8% / 0.75) 100%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl backdrop-blur-2xl bg-background/40 border border-white/10 px-4 py-3 w-fit max-w-full">
                <span className="font-display text-[28px] sm:text-[36px] font-semibold text-foreground tracking-[-0.02em]">
                  {problems[0]?.impact}
                </span>
                <span className="text-[13px] uppercase tracking-[0.15em] text-foreground/70">
                  {problems[0]?.impactLabel}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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

            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed mb-12 max-w-[480px]">
              {content.subtitle}
            </p>

            {/* Problem rows */}
            <div className="flex flex-col">
              {problems.map((p, i) => (
                <div
                  key={p.title}
                  className="grid grid-cols-[130px_1fr] gap-8 items-start py-7 border-t border-border hover:bg-accent/25 transition-colors"
                >
                  <p
                    className="font-display text-2xl font-semibold tracking-[-0.02em] leading-tight"
                    style={{ color: PROBLEM_COLORS[i] }}
                  >
                    {p.impact}
                  </p>
                  <div>
                    <p className="text-base font-semibold text-foreground mb-1.5">
                      {p.title} → {p.result}
                    </p>
                    <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-border" />
            </div>

            <p className="mt-8 text-[17px] font-medium text-primary">
              {content.cta}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CostOfGuessingSection;
