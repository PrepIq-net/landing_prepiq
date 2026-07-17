"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { GoldText } from "@/components/landing/GoldText";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const AboutHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      {/* Brand page-header backdrop (matches how-it-works / pricing / contact) */}
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
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 block text-xs font-medium uppercase tracking-[0.25em] text-primary/80"
          >
            {t("about.hero.badge")}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground text-balance sm:text-[2.6rem] md:text-[3.1rem]"
          >
            <GoldText text={t("about.hero.headline")} />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {t("about.hero.copy")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base"
          >
            <span className="font-medium text-primary">
              {t("about.hero.missionLabel")}:{" "}
            </span>
            {t("about.hero.mission")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild variant="hero" size="lg">
              <a href="/contact">
                {t("about.hero.contact")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#careers">{t("about.hero.careers")}</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
