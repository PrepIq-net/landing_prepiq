"use client";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { FinalCTAContent, SectionContent } from "@/types/cms";
import { GoldText } from "./GoldText";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";

const FALLBACK_PROOFS = {
  en: [
    "30-day free pilot — no credit card",
    "Live in under 48 hours",
    "Works with any POS system",
  ],
  fr: [
    "Essai gratuit de 30 jours — sans CB",
    "Opérationnel en moins de 48h",
    "Compatible avec tout système POS",
  ],
};

const FinalCTASection = ({
  dbContent,
}: {
  dbContent?: SectionContent<FinalCTAContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: FinalCTAContent = dbContent?.[currentLang] || {
    badge: t("finalCTA.badge", "Trusted by kitchens reducing waste daily"),
    title: t("finalCTA.title", "Tomorrow's prep list is *already waiting*."),
    subtitle: t(
      "finalCTA.subtitle",
      "Stop guessing. Start every morning with a clear, data-backed prep plan that protects your margins.",
    ),
    ctaStart: t("finalCTA.ctaStart", "Start Free Pilot"),
    ctaDemo: t("finalCTA.ctaDemo", "Book a 10-min Demo"),
    proofs: FALLBACK_PROOFS[currentLang] || FALLBACK_PROOFS.en,
  };

  const proofs = Array.isArray(content.proofs) ? content.proofs : [];

  return (
    <section id="contact" className="relative py-40 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="/images/restaurant-interior.jpg"
          alt="Warm restaurant interior"
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.92) brightness(0.96)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(240 7% 8%) 0%, hsl(240 7% 8% / 0.78) 35%, hsl(240 7% 8% / 0.78) 65%, hsl(240 7% 8%) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[720px] mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 backdrop-blur-sm px-4 py-1.5 mb-8">
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse-dot" />
            <span className="text-[0.6rem] md:text-xs font-medium text-primary">
              {content.badge}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-3xl md:text-5xl lg:text-[64px] font-semibold text-foreground leading-[1.04] tracking-[-0.025em] mb-6 text-balance">
            <GoldText text={content.title} />
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-lg text-foreground/82 max-w-[512px] mx-auto leading-relaxed mb-10">
            {content.subtitle}
          </p>

          {/* CTAs */}
          <motion.div className="mt-7 sm:mt-9 justify-center flex flex gap-3 items-center md:gap-4 mb-10">
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

          {/* Proof points */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
            {proofs.map((p) => (
              <div key={p} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                <span className="text-sm text-foreground/82">{p}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
