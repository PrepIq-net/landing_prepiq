"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SeamAccent } from "@/components/landing/motion-primitives";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";

/**
 * Always-visible pitch below the wizard, independent of what step a visitor
 * is on — a second path to conversion for anyone who isn't going to finish
 * the assessment, and context for what the estimate is a preview of.
 */
export function KitchenCalculatorPromoSection() {
  const { t } = useTranslation();
  const points = (t("kitchenCalculator.promo.points", { returnObjects: true }) as string[]) ?? [];

  return (
    <section className="relative border-t border-border/50 py-24 md:py-32 overflow-hidden section-band">
      <SeamAccent />
      <div className="pattern-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] lg:items-center gap-12 lg:gap-20"
        >
          {/* Image */}
          <div className="relative order-1 lg:order-none">
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/[0.08] blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-l2 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px]">
              <Image
                src="/images/kitchen-calculator/promo-kitchen-tech.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center py-4 lg:py-0">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-primary mb-6">
              {t("kitchenCalculator.promo.badge")}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-semibold text-foreground leading-[1.08] tracking-[-0.02em] text-balance mb-5">
              {t("kitchenCalculator.promo.title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {t("kitchenCalculator.promo.subtitle")}
            </p>

            <ul className="space-y-3.5 mb-10">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm sm:text-base text-foreground/90">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 mb-4">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  {t("kitchenCalculator.promo.cta")}
                  <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden />
                </Button>
              </a>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
                  {t("kitchenCalculator.promo.ctaSecondary")}
                </Button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground/70">{t("kitchenCalculator.promo.disclaimer")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
