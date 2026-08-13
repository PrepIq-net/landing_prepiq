"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";

/**
 * Always-visible pitch below the wizard, independent of what step a visitor
 * is on — a second path to conversion for anyone who isn't going to finish
 * the assessment, and context for what the estimate is a preview of.
 */
export function KitchenCalculatorPromoSection() {
  const { t } = useTranslation();
  const points = (t("kitchenCalculator.promo.points", { returnObjects: true }) as string[]) ?? [];
  const chipParts = (points[0] ?? "").split(",");
  const chipMain = chipParts[0].trim();
  const chipSub = chipParts.slice(1).join(",").trim();

  return (
    <section className="relative py-24 md:py-36 border-t border-border/50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-24 items-center"
        >
          {/* Photo with offset border */}
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
              <Image
                src="/images/kitchen-calculator/promo-kitchen-tech.jpg"
                alt=""
                fill
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
              {chipMain && (
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl backdrop-blur-2xl bg-background/40 border border-white/10 px-4 py-3 w-fit max-w-full">
                  <span className="font-display text-[28px] sm:text-[36px] font-semibold text-foreground tracking-[-0.02em]">
                    {chipMain}
                  </span>
                  {chipSub && (
                    <span className="text-[13px] uppercase tracking-[0.15em] text-foreground/70">
                      {chipSub}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-px bg-primary" />
              <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {t("kitchenCalculator.promo.badge")}
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl lg:text-[52px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-5 text-balance">
              {t("kitchenCalculator.promo.title")}
            </h2>

            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed mb-12 max-w-[480px]">
              {t("kitchenCalculator.promo.subtitle")}
            </p>

            <div className="flex flex-col">
              {points.map((point) => (
                <div
                  key={point}
                  className="grid grid-cols-[56px_1fr] gap-6 items-start py-7 border-t border-border hover:bg-accent/25 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/[0.08] border border-primary/15">
                    <CheckCircle className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <p className="font-display text-[17px] font-semibold text-foreground leading-snug pt-1.5">
                    {point}
                  </p>
                </div>
              ))}
              <div className="border-t border-border" />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  {t("kitchenCalculator.promo.cta")}
                  <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden />
                </Button>
              </a>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  {t("kitchenCalculator.promo.ctaSecondary")}
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/70">{t("kitchenCalculator.promo.disclaimer")}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}