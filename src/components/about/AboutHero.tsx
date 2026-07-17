"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { GoldText } from "@/components/landing/GoldText";

const AboutHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(40 70% 39% / 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-3 sm:gap-3.5">
            <span className="h-px w-8 bg-primary sm:w-10" />
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.3em]">
              {t("about.hero.badge")}
            </span>
          </div>

          <h1 className="font-display text-[clamp(2rem,8vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-foreground text-balance sm:text-5xl md:text-6xl">
            <GoldText text={t("about.hero.headline")} />
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("about.hero.copy")}
          </p>

          <div className="mt-8 rounded-xl border border-border/60 bg-card/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("about.hero.missionLabel")}
            </p>
            <p className="mt-2 text-base font-medium text-foreground sm:text-lg">
              {t("about.hero.mission")}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <a href="/#contact">
                {t("about.hero.contact")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#careers">{t("about.hero.careers")}</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
