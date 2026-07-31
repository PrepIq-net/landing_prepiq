"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BuiltForScaleContent, SectionContent, ProofFact } from "@/types/cms";

const PERSONA_PHOTOS = [
  "/images/persona-chef.jpg",
  "/images/persona-ops.jpg",
  "/images/persona-owner.jpg",
  "/images/persona-foh.jpg",
];

const BuiltForScaleSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<BuiltForScaleContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  /*
   * The `stat` line names what each role gets out of PrepIQ. It is intentionally
   * not a number: we do not have a customer base large enough to average
   * accuracy, waste or locations, and a made-up figure here would be read as one.
   */
  const fallbackPersonas = [
    {
      title: "Head Chefs",
      stat: "Prep you review, not guess",
      desc: "Prep decisions backed by your own sales history, not memory. You stay in control — the AI learns from your overrides.",
    },
    {
      title: "Ops Managers",
      stat: "Daily cost visibility",
      desc: "Cost impact and forecast accuracy, measured on your data every day. Know exactly where the margin leaks.",
    },
    {
      title: "Owners & Brands",
      stat: "Every branch in one view",
      desc: "Compare kitchens side by side and roll results up. One dashboard, every kitchen aligned.",
    },
    {
      title: "Front of House",
      stat: "Stock alerts before the table",
      desc: 'Live stock alerts reach the pass before the table hears "we\'re out."',
    },
  ];

  const fallbackStats: ProofFact[] = [
    {
      value: t("builtForScale.stats.perBranch.value", "Per branch"),
      label: t("builtForScale.stats.perBranch.label", "Every kitchen gets its own forecast, prep list and staffing plan"),
    },
    {
      value: t("builtForScale.stats.compare.value", "Side by side"),
      label: t("builtForScale.stats.compare.label", "Compare accuracy, waste and cost across kitchens in one view"),
    },
    {
      value: t("builtForScale.stats.currency.value", "Local currency"),
      label: t("builtForScale.stats.currency.label", "Each branch keeps its own currency; group totals normalise for you"),
    },
  ];

  const fallbackContent: BuiltForScaleContent = {
    badge: t("builtForScale.badge", "Purpose-Built"),
    title: t("builtForScale.title", "Built for the whole pass."),
    subtitle: t(
      "builtForScale.subtitle",
      "From the chef calling the prep to the manager watching the margin — everyone works from the same numbers.",
    ),
    personas: fallbackPersonas,
    networkTitle: "",
    networkSubtitle: "",
    sidebarTitle: "",
    stats: fallbackStats,
    branches: [],
    globalTitle: "",
    globalSubtitle: "",
    globalFeatures: [],
    regions: [],
  };

  const localizedContent = dbContent?.[currentLang] as
    | Partial<BuiltForScaleContent>
    | undefined;
  const content: BuiltForScaleContent = {
    ...fallbackContent,
    ...localizedContent,
    personas: Array.isArray(localizedContent?.personas)
      ? localizedContent.personas
      : fallbackContent.personas,
    // Sections seeded before the stat bar became a list still hold the old
    // {margin,waste,accuracy} object of network averages — ignore it.
    stats: Array.isArray(localizedContent?.stats)
      ? localizedContent.stats
      : fallbackStats,
  };

  const personas = content.personas ?? fallbackPersonas;
  const networkStats = content.stats;

  return (
    <section className="relative py-20 sm:py-24 md:py-36 border-t border-border/50">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 mb-14"
        >
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-px bg-primary" />
              <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {content.badge}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] text-balance">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-[440px] leading-relaxed lg:mb-2">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Photo cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-l2 transition-all duration-300 cursor-default"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={PERSONA_PHOTOS[i]}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "saturate(0.92) brightness(0.96)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(240 7% 8% / 0.1) 30%, hsl(240 7% 8% / 0.92) 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                  {p.stat}
                </p>
                <p className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {p.title}
                </p>
                <p className="text-[13px] text-foreground/65 leading-[1.55] max-w-[28ch]">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Network stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border mt-12"
        >
          {networkStats.map((s) => (
            <div
              key={s.label}
              className="bg-card px-6 sm:px-7 py-6 sm:py-7 text-center hover:bg-accent/40 transition-colors"
            >
              <p className="font-display text-[22px] sm:text-[26px] font-semibold text-primary tracking-[-0.02em] mb-1.5">
                {s.value}
              </p>
              <p className="text-[13px] leading-snug text-muted-foreground max-w-[30ch] mx-auto">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BuiltForScaleSection;
