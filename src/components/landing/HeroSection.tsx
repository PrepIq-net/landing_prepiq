"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "iconoir-react";
import { useState } from "react";
import CalendlyModal from "./CalendlyModal";
import { useTranslation } from "react-i18next";
import { HeroContent, SectionContent } from "@/types/cms";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const HeroSection = ({ dbContent }: { dbContent?: SectionContent<HeroContent> }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: HeroContent = dbContent?.[currentLang] || {
    badge: t("hero.badge", "Precision prep planning, powered by AI"),
    titleLine1: t("hero.titleLine1", "Prep with confidence."),
    titleLine2: t("hero.titleLine2", "Know exactly what — and how much — to cook."),
    subtitle: t("hero.subtitle", "Every morning, PrepIQ gives your team a precise prep plan — built from your sales history, demand signals, and real kitchen patterns. No guesswork. No waste."),
    proof: {
      lessWaste: t("hero.proof.lessWaste", "Less waste"),
      noStockouts: t("hero.proof.noStockouts", "No stockouts"),
      betterMargins: t("hero.proof.betterMargins", "Better margins"),
    },
    ctaStart: t("hero.ctaStart", "Start Free"),
    ctaDemo: t("hero.ctaDemo", "Book a 10-min Demo"),
    stats: {
      accuracy: t("hero.stats.accuracy", "Forecast accuracy"),
      waste: t("hero.stats.waste", "Food waste"),
      stockouts: t("hero.stats.stockouts", "Stockouts avg/week"),
    }
  };

  const [demoOpen, setDemoOpen] = useState(false);

  const stats = [
    { value: "92%", label: content.stats.accuracy },
    { value: "−34%", label: content.stats.waste },
    { value: "0", label: content.stats.stockouts },
  ];

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-[0.1] pointer-events-none" />

        <div className="section-container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.06 }}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block"
            >
              {content.badge}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-display text-[2.2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.8rem] md:text-[3.4rem]"
            >
              {content.titleLine1}
              <br />
              <span className="text-gradient-gold">{content.titleLine2}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-[1.05rem]"
            >
              {content.subtitle}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-sm"
            >
              {[content.proof.lessWaste, content.proof.noStockouts, content.proof.betterMargins].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Button variant="hero" size="lg" className="group w-full sm:w-auto rounded-xl px-8">
                <span className="flex items-center gap-2 text-base">
                  {content.ctaStart}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => setDemoOpen(true)}
                className="w-full sm:w-auto rounded-xl px-8 text-base"
              >
                {content.ctaDemo}
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-start gap-10 sm:gap-16">
              {stats.map((stat, i) => (
                <div key={stat.label} className="space-y-1">
                  <p className={`font-display text-3xl font-semibold sm:text-4xl ${i === 0 ? "text-primary" : "text-foreground"}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="relative left-1/2 right-1/2 mt-14 w-screen -mx-[50vw] px-4 sm:px-6 md:mt-20 md:px-10"
        >
          <div
            className="relative mx-auto max-w-[1800px] overflow-hidden rounded-2xl border border-border bg-card shadow-l2"
            style={{ aspectRatio: "1906 / 1032" }}
          >
            <video
              src="/videos/app-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      <CalendlyModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default HeroSection;
