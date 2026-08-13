"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Calculator, Clock, GraphUp, Package } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { KitchenCalculatorTeaserContent, SectionContent } from "@/types/cms";
import { GoldText } from "./GoldText";
import { SeamAccent } from "./motion-primitives";

const ICONS: Record<string, typeof GraphUp> = {
  forecast: GraphUp,
  waste: ArrowDown,
  stockout: Package,
};

const KitchenCalculatorTeaserSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<KitchenCalculatorTeaserContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const fallbackContent: KitchenCalculatorTeaserContent = {
    badge: t("kitchenCalculatorTeaser.badge"),
    title: t("kitchenCalculatorTeaser.title"),
    subtitle: t("kitchenCalculatorTeaser.subtitle"),
    points: (t("kitchenCalculatorTeaser.points", { returnObjects: true }) as KitchenCalculatorTeaserContent["points"]) ?? [],
    cta: t("kitchenCalculatorTeaser.cta"),
    disclaimer: t("kitchenCalculatorTeaser.disclaimer"),
  };

  const localizedContent = dbContent?.[currentLang] as Partial<KitchenCalculatorTeaserContent> | undefined;
  const content: KitchenCalculatorTeaserContent = {
    ...fallbackContent,
    ...localizedContent,
    points: localizedContent?.points ?? fallbackContent.points,
  };

  return (
    <section className="relative py-24 md:py-32 border-t border-border/50 overflow-hidden section-band">
      <SeamAccent />
      <div className="pattern-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] lg:items-center gap-12 lg:gap-20"
        >
          {/* Copy */}
          <div className="flex flex-col justify-center py-4 lg:py-0">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-primary mb-6">
                <Calculator className="h-3.5 w-3.5" aria-hidden />
                {content.badge}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-semibold text-foreground leading-[1.08] tracking-[-0.02em] text-balance mb-5">
                <GoldText text={content.title} />
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                {content.subtitle}
              </p>

              {/* Compact inline tags instead of stacked cards — keeps the eye on the CTA */}
              <div className="flex flex-wrap gap-2.5 mb-10">
                {content.points.map((point) => {
                  const Icon = ICONS[point.icon] || GraphUp;
                  return (
                    <span
                      key={point.icon}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 pl-3 pr-3.5 py-2 text-xs text-muted-foreground"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                      {point.label}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/kitchen-intelligence-calculator"
                  className="group inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold text-sm sm:text-base px-8 h-14 rounded-[10px] shadow-l2 hover:bg-[hsl(40_70%_46%)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {content.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {content.disclaimer}
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/[0.08] blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-l2 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px]">
                <Image
                  src="/images/kitchen-calculator/teaser-flame.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KitchenCalculatorTeaserSection;
