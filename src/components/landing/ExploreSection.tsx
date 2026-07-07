"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Brain, DollarCircle, Mail } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { ExploreContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";
import { GoldText } from "./GoldText";

const ICONS: Record<string, typeof Brain> = {
  brain: Brain,
  pricing: DollarCircle,
  contact: Mail,
};

const ExploreSection = ({ dbContent }: { dbContent?: SectionContent<ExploreContent> }) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content = dbContent?.[currentLang];
  if (!content) return null;

  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section className="relative py-20 md:py-28 border-t border-border/50 overflow-hidden">
      <SeamAccent />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            {content.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
            <GoldText text={content.title} />
          </h2>
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] || Brain;
            return (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="group relative rounded-2xl border border-border bg-card/80 p-6 sm:p-8 hover:border-primary/30 hover:bg-card hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 wash-gold-top opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.08] text-primary transition-transform duration-200 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {item.desc}
                  </p>
                  <span className="text-xs font-medium text-primary/80 group-hover:text-primary transition-colors duration-200">
                    {item.cta} →
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
