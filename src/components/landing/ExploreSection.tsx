"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Brain, DollarCircle, Mail } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { ExploreContent, SectionContent } from "@/types/cms";
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
    <section className="relative py-24 md:py-36 border-t border-border/50">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Header — same anatomy as every other section on the page */}
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
            <GoldText text={content.title} />
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-[560px]">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Stops — the same connected grid as the Operations pillars above */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] || Brain;
            return (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col bg-card p-8 lg:p-10 transition-colors hover:bg-accent/25"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 group-hover:bg-primary/15 group-hover:border-primary/25 transition-colors duration-200">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <h3 className="mt-6 font-display text-2xl font-semibold text-foreground tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed flex-1">
                  {item.desc}
                </p>

                <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary border-t border-border pt-6">
                  {item.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;