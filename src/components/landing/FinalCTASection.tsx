"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import CalendlyModal from "./CalendlyModal";
import { useTranslation, Trans } from "react-i18next";

const FinalCTASection = () => {
  const { t, i18n } = useTranslation();
  const [demoOpen, setDemoOpen] = useState(false);

  const proofs = i18n.resolvedLanguage === 'fr' ? [
    "Essai gratuit de 30 jours — sans CB",
    "Opérationnel en moins de 48h",
    "Compatible avec tout système POS",
  ] : [
    "30-day free pilot — no credit card",
    "Live in under 48 hours",
    "Works with any POS system",
  ];

  return (
    <>
      <section className="relative py-20 sm:py-28 md:py-36 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_65%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="section-container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto px-2"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 sm:px-4 py-1.5 mb-6 sm:mb-8"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-medium text-primary">{t("finalCTA.badge")}</span>
            </motion.div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground leading-tight lg:leading-[1.15] mb-4 sm:mb-6">
              <Trans
                i18nKey="finalCTA.title"
                components={{ gold: <span className="text-gradient-gold" /> }}
              />
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8 sm:mb-10">
              {t("finalCTA.subtitle")}
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                <span className="flex items-center gap-2">
                  {t("finalCTA.ctaStart")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => setDemoOpen(true)} className="w-full sm:w-auto">
                {t("finalCTA.ctaDemo")}
              </Button>
            </motion.div>

            {/* Trust proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-6 gap-y-2 items-center"
            >
              {proofs.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                  <span className="text-xs sm:text-sm text-muted-foreground">{p}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>
      <CalendlyModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default FinalCTASection;
