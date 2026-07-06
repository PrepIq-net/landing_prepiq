"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "iconoir-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { HeroContent, SectionContent } from "@/types/cms";
import { CountUp } from "./motion-primitives";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const wordUp = {
  hidden: { opacity: 0, y: "0.45em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const WordReveal = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i) => (
      <motion.span key={`${word}-${i}`} variants={wordUp} className="inline-block whitespace-pre">
        {word}{" "}
      </motion.span>
    ))}
  </>
);

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

  const videoWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoWrapRef,
    offset: ["start end", "start 0.35"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const videoY = useTransform(scrollYProgress, [0, 1], [28, 0]);

  const stats = [
    { value: "92%", label: content.stats.accuracy },
    { value: "−34%", label: content.stats.waste },
    { value: "0", label: content.stats.stockouts },
  ];

  return (
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-[0.1] pointer-events-none" />
        <div className="absolute inset-0 wash-gold-top pointer-events-none" />

        <div className="section-container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.06 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              variants={fadeUp}
              className="mb-5 block text-xs uppercase tracking-[0.25em] text-primary/80 font-medium"
            >
              {content.badge}
            </motion.span>

            <motion.h1
              transition={{ staggerChildren: 0.05 }}
              className="font-display text-[2.2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.8rem] md:text-[3.4rem]"
            >
              <WordReveal text={content.titleLine1} />
              <br />
              <motion.span variants={wordUp} className="text-gradient-gold inline-block">
                {content.titleLine2}
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-[1.05rem]"
            >
              {content.subtitle}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-sm"
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
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button asChild variant="hero" size="lg" className="group w-full sm:w-auto rounded-xl px-8">
                <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base">
                  {content.ctaStart}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="hero-outline" size="lg" className="w-full sm:w-auto rounded-xl px-8 text-base">
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                  {content.ctaDemo}
                </a>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex justify-center gap-10 sm:gap-16">
              {stats.map((stat, i) => (
                <div key={stat.label} className="space-y-1 text-center">
                  <p className={`font-display text-3xl font-semibold sm:text-4xl ${i === 0 ? "text-primary" : "text-foreground"}`}>
                    <CountUp value={stat.value} />
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
          ref={videoWrapRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative left-1/2 right-1/2 mt-14 w-screen -mx-[50vw] px-4 sm:px-6 md:mt-20 md:px-10"
        >
          <div className="relative mx-auto max-w-[1800px] rounded-[2rem] pattern-dots-accent p-6 sm:p-10 md:p-14 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_60%,transparent_100%)]">
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-l2"
              style={{ aspectRatio: "1906 / 1032", scale: videoScale, y: videoY }}
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
            </motion.div>
          </div>
        </motion.div>
      </section>
  );
};

export default HeroSection;
