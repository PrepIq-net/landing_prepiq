"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GoldText } from "@/components/landing/GoldText";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function KitchenCalculatorHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-32 pb-10 md:pt-40 md:pb-14">
      {/* Brand page-header backdrop (matches how-it-works / pricing / about) */}
      <div className="pattern-grid pointer-events-none absolute inset-0 opacity-[0.1]" />
      <div className="wash-gold-top pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-px w-[min(640px,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      <div className="section-container relative">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.06 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 block text-xs font-medium uppercase tracking-[0.25em] text-primary/80"
          >
            {t("kitchenCalculator.hero.badge")}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground text-balance sm:text-[2.6rem] md:text-[2.9rem]"
          >
            <GoldText text={t("kitchenCalculator.hero.title")} />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {t("kitchenCalculator.hero.subtitle")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
