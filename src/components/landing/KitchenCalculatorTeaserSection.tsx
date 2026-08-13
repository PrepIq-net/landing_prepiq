"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Clock, GraphUp, Package } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { KitchenCalculatorTeaserContent, SectionContent } from "@/types/cms";
import { GoldText } from "./GoldText";
import { Button } from "@/components/ui/button";

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
    <section className="relative py-24 md:py-36">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-24 items-center">
          {/* Left: Content */}
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
              <GoldText text={content.title} />
            </h2>

            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed mb-12 max-w-[480px]">
              {content.subtitle}
            </p>

            {/* Benefit rows - matching CostOfGuessingSection problem row style */}
            <div className="flex flex-col">
              {content.points.map((point, i) => {
                const Icon = ICONS[point.icon] || GraphUp;
                return (
                  <div
                    key={point.icon}
                    className="grid grid-cols-[56px_1fr] gap-6 items-center py-7 border-t border-border hover:bg-accent/25 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/[0.08] border border-primary/15">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <div>
                      <p className="font-display text-[17px] font-semibold text-foreground mb-1">
                        {point.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-border" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link href="/kitchen-intelligence-calculator">
                  {content.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {content.disclaimer}
              </span>
            </div>
          </motion.div>

          {/* Right: Photo with offset border */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute top-6 right-6 left-[-24px] bottom-[-24px] border border-primary/35 rounded-2xl pointer-events-none" />
            <div
              className="relative rounded-2xl overflow-hidden shadow-l2"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src="/images/kitchen-calculator/teaser-flame.jpg"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center"
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
                  {content.points[0]?.label || "Demand exposure across your locations"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KitchenCalculatorTeaserSection;