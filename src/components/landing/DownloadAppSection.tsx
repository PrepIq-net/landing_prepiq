"use client";

import { motion } from "framer-motion";
import { CheckCircle, ClipboardCheck, GoogleCircle, GraphUp, TaskList } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { DownloadAppContent, SectionContent } from "@/types/cms";
import { GoldText } from "./GoldText";
import { Button } from "@/components/ui/button";
import { PLAY_STORE_CONFIG } from "@/lib/constants";

const ICONS: Record<string, typeof GraphUp> = {
  pace: GraphUp,
  close: ClipboardCheck,
  tasks: TaskList,
};

const DownloadAppSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<DownloadAppContent>;
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const mode = PLAY_STORE_CONFIG.mode;

  // Copy and points come from the CMS only — no hardcoded section copy. Only
  // the active Play Store mode's copy is ever shown.
  const localizedContent = dbContent?.[currentLang];
  if (!localizedContent || !localizedContent[mode]) return null;
  const content = localizedContent[mode];
  const points = Array.isArray(localizedContent.points)
    ? localizedContent.points
    : [];

  return (
    <section className="relative py-16 md:py-24 border-t border-border/50">
      <div className="section-container">
        <div className="intelligence-card relative overflow-hidden rounded-xl px-6 py-12 sm:px-10 md:px-16 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 wash-gold-top"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">
            {/* Left: pitch + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3 sm:px-4 py-1.5 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
                <span className="text-[0.6rem] md:text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  {content.badge}
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl lg:text-[52px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-5 text-balance">
                <GoldText text={content.title} />
              </h2>

              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-[480px]">
                {content.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Button asChild variant="hero" size="lg" className="w-full sm:w-auto justify-center">
                  <a
                    href={PLAY_STORE_CONFIG.urls[mode]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5"
                  >
                    <GoogleCircle className="h-5 w-5" aria-hidden />
                    {content.cta}
                  </a>
                </Button>
              </div>

              {content.disclaimer && (
                <p className="mt-4 text-xs text-muted-foreground/70 max-w-[440px]">
                  {content.disclaimer}
                </p>
              )}
            </motion.div>

            {/* Right: what's already live on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {points.map((point) => {
                const Icon = ICONS[point.icon] || CheckCircle;
                return (
                  <div
                    key={point.icon}
                    className="grid grid-cols-[56px_1fr] gap-6 items-center py-6 border-t border-border first:border-t-0 lg:first:border-t"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/[0.08] border border-primary/15">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="text-sm md:text-base text-foreground/90 leading-snug">
                      {point.label}
                    </p>
                  </div>
                );
              })}
              <div className="border-t border-border" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
