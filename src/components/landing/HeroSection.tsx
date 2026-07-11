"use client";
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
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Background photo with ken burns */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/hero-kitchen.jpg"
          alt="Chef at work in a commercial kitchen"
          className="w-full h-[60%] md:h-full object-cover object-center object-top scale-110 translate-110 animate-kenburns"
          style={{ filter: "saturate(0.92) brightness(0.96)" }}
        />
        {/* Vertical gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(240 7% 8% / 0.72) 0%, hsl(240 7% 8% / 0.35) 40%, hsl(240 7% 8% / 0.92) 85%, hsl(240 7% 8%) 100%)",
          }}
        />
        {/* Left-side gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(240 7% 8% / 0.75) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 pt-28 sm:pt-32 md:pt-40 flex flex-col justify-end">
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
            className="font-display text-3xl md:text-7xl lg:text-[82px] font-semibold leading-[1.05] sm:leading-[1.02] tracking-[-0.03em] text-foreground text-balance"
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
            className="mt-7 sm:mt-9 flex flex gap-3 sm:gap-4 items-center"
          >
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold text-xs md:text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-[52px] rounded-[10px] shadow-l2 hover:bg-[hsl(40_70%_46%)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {content.ctaStart}
              <ArrowRight className="h-4 w-4 hidden md:inline-block" />
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs md:text-sm sm:text-base font-medium text-foreground border border-foreground/25 bg-background/30 backdrop-blur-sm px-6 sm:px-8 h-12 sm:h-[52px] rounded-[10px] hover:border-primary/60 hover:text-primary transition-all duration-200"
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
          className="grid grid-cols-3 gap-6 sm:gap-10 md:gap-20 justify-start mt-12 sm:mt-16 md:mt-[72px] py-6 sm:py-8 border-t border-foreground/[0.12] w-full md:w-fit"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 min-w-0">
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
