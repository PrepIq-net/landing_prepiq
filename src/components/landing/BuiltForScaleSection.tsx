"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BuiltForScaleContent, SectionContent } from "@/types/cms";
import { CountUp } from "./motion-primitives";

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

  const fallbackPersonas = [
    {
      title: "Head Chefs",
      stat: "92% accuracy avg.",
      desc: "Prep decisions backed by real data, not memory. You stay in control — the AI learns from your overrides.",
    },
    {
      title: "Ops Managers",
      stat: "Real-time visibility",
      desc: "Cost impact and forecast accuracy, daily. Know exactly where the margin leaks.",
    },
    {
      title: "Owners & Brands",
      stat: "6+ locations managed",
      desc: "Scale production without scaling waste. One dashboard, every kitchen aligned.",
    },
    {
      title: "Front of House",
      stat: "0 surprise 86's",
      desc: 'Live stock alerts reach the pass before the table hears "we\'re out."',
    },
  ];

  const fallbackContent: BuiltForScaleContent = {
    badge: t("builtForScale.badge", "Purpose-Built"),
    title: t("builtForScale.title", "Built for the whole pass."),
    subtitle: t(
      "builtForScale.subtitle",
      "From the chef calling the prep to the manager watching the margin — everyone works from the same numbers."
    ),
    personas: fallbackPersonas,
    networkTitle: "",
    networkSubtitle: "",
    sidebarTitle: "",
    stats: {
      margin: { label: "Avg. margin uplift across branches" },
      waste: { label: "Monthly waste saved network-wide" },
      accuracy: { label: "Weighted forecast accuracy" },
    },
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
    stats: {
      ...fallbackContent.stats,
      ...(localizedContent?.stats ?? {}),
    },
  };

  const personas = content.personas ?? fallbackPersonas;
  const networkStats = [
    { value: "+2.8%", label: content.stats.margin.label },
    { value: "$22,500", label: content.stats.waste.label },
    { value: "92.5%", label: content.stats.accuracy.label },
  ];

  return (
    <section className="relative py-24 md:py-36 border-t border-border/50">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
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
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {content.badge}
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em]">
              {content.title}
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-[380px] leading-relaxed lg:mb-2">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Photo cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                  {p.stat}
                </p>
                <p className="font-display text-xl font-semibold text-foreground mb-2">
                  {p.title}
                </p>
                <p className="text-[13px] text-foreground/65 leading-[1.55]">
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
          className="grid grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border mt-12"
        >
          {networkStats.map((s) => (
            <div
              key={s.label}
              className="bg-card px-7 py-7 text-center hover:bg-accent/40 transition-colors"
            >
              <p className="font-display text-[32px] font-semibold text-primary tracking-[-0.02em] mb-1">
                <CountUp value={s.value} />
              </p>
              <p className="text-[13px] font-medium text-muted-foreground">
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
