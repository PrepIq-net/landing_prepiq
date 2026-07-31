"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { HeroContent, SectionContent } from "@/types/cms";
import { CountUp } from "./motion-primitives";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const HeroSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<HeroContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const [videoPlaying, setVideoPlaying] = useState(false);

  const content: HeroContent = dbContent?.[currentLang] || {
    badge: t("hero.badge", "AI prep planning for professional kitchens"),
    titleLine1: t("hero.titleLine1", "Stop cooking on a hunch."),
    titleLine2: t("hero.titleLine2", "Prep exactly what tomorrow will sell."),
    subtitle: t("hero.subtitle", ""),
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
      stockouts: t("hero.stats.stockouts", "Stockouts avg / week"),
    },
  };

  const stats = [
    { value: "92%", label: content.stats.accuracy, color: "text-primary" },
    { value: "−34%", label: content.stats.waste, color: "text-foreground" },
    { value: "0", label: content.stats.stockouts, color: "text-foreground" },
  ];

  return (
    <section className="relative min-h-[88svh] md:min-h-[92vh] flex items-end overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden bg-[hsl(240_7%_8%)]">
        {/*
          The still is frame 0 of hero.mp4 (not a separate photo), so when the
          video fades in over it there is nothing visible to swap — it just
          starts moving. object-left below md keeps the chef in frame on
          portrait screens, where cover crops most of the 16:9 width away.
        */}
        <Image
          src="/images/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left md:object-center"
          style={{ filter: "saturate(0.92) brightness(0.96)" }}
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // Only reveal once frames are actually rendering; if autoplay is
          // blocked this never fires and the still stays as the background.
          onPlaying={() => setVideoPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover object-left md:object-center transition-opacity duration-700 ease-out ${
            videoPlaying ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "saturate(0.92) brightness(0.96)" }}
        >
          <source src="/images/hero.webm" type="video/webm" />
          <source src="/images/hero.mp4" type="video/mp4" />
        </video>
        {/* Vertical gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(240 7% 8% / 0.72) 0%, hsl(240 7% 8% / 0.35) 40%, hsl(240 7% 8% / 0.92) 85%, hsl(240 7% 8%) 100%)",
          }}
        />
        {/* Left-side gradient — held back below md, where the full-strength
            wash would sit right on top of the chef the crop is framing. */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(90deg, hsl(240 7% 8% / 0.32) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, hsl(240 7% 8% / 0.75) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 pt-20 sm:pt-28 md:pt-40 pb-8 sm:pb-0 flex flex-col justify-end">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="max-w-[860px]"
        >
          {/* Badge line */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 sm:gap-3.5 mb-5 sm:mb-7"
          >
            <div className="w-8 sm:w-10 h-px bg-primary shrink-0" />
            <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary font-medium">
              {content.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(2.25rem,10vw,5.125rem)] md:text-7xl lg:text-[82px] font-semibold leading-[1.05] sm:leading-[1.02] tracking-[-0.03em] text-foreground text-balance"
          >
            {content.titleLine1}
            <br />
            <span className="text-primary">{content.titleLine2}</span>
          </motion.h1>

          {/* Subtitle */}
          {content.subtitle && (
            <motion.p
              variants={fadeUp}
              className="max-w-[560px] mt-7 text-sm md:text-lg leading-relaxed text-foreground/80"
            >
              {content.subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center"
          >
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2.5 bg-primary text-primary-foreground font-semibold text-xs md:text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-[52px] rounded-[10px] shadow-l2 hover:bg-[hsl(40_70%_46%)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {content.ctaStart}
              <ArrowRight className="h-4 w-4 hidden md:inline-block" />
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto justify-center items-center text-xs md:text-sm sm:text-base font-medium text-foreground border border-white/15 bg-background/40 backdrop-blur-2xl px-6 sm:px-8 h-12 sm:h-[52px] rounded-[10px] hover:border-primary/60 hover:text-primary transition-all duration-200"
            >
              {content.ctaDemo}
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-10 md:gap-20 justify-start mt-12 sm:mt-16 md:mt-[72px] py-6 sm:py-8 border-t border-foreground/[0.12] w-full md:w-fit"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 min-w-0 text-center sm:text-left">
              <p
                className={`font-display text-2xl sm:text-3xl md:text-[44px] font-semibold tracking-[-0.02em] ${stat.color}`}
              >
                <CountUp value={stat.value} />
              </p>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] text-foreground/55 truncate">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
