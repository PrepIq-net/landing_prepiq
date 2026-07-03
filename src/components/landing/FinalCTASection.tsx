import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "iconoir-react";
import { useState } from "react";
import CalendlyModal from "./CalendlyModal";
import { useTranslation } from "react-i18next";
import { FinalCTAContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";

const FALLBACK_PROOFS = {
  en: ["30-day free pilot — no credit card", "Live in under 48 hours", "Works with any POS system"],
  fr: ["Essai gratuit de 30 jours — sans CB", "Opérationnel en moins de 48h", "Compatible avec tout système POS"],
};

const FinalCTASection = ({ dbContent }: { dbContent?: SectionContent<FinalCTAContent> }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const [demoOpen, setDemoOpen] = useState(false);

  const content: FinalCTAContent = dbContent?.[currentLang] || {
    badge: t("finalCTA.badge"),
    title: t("finalCTA.title").replace(/<\/?gold>/g, ""),
    subtitle: t("finalCTA.subtitle"),
    ctaStart: t("finalCTA.ctaStart"),
    ctaDemo: t("finalCTA.ctaDemo"),
    proofs: FALLBACK_PROOFS[currentLang] || FALLBACK_PROOFS.en,
  };

  return (
    <>
      <section className="relative py-20 sm:py-28 md:py-36 border-t border-border/50 overflow-hidden">
        <SeamAccent />
        <div className="absolute inset-0 wash-gold-bottom pointer-events-none" />
        <div className="section-container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-2xl mx-auto px-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 sm:px-4 py-1.5 mb-6 sm:mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
              <span className="text-[11px] sm:text-xs font-medium text-primary">{content.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground leading-tight lg:leading-[1.15] mb-4 sm:mb-6">
              {content.title}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8 sm:mb-10">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                <span className="flex items-center gap-2">
                  {content.ctaStart}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => setDemoOpen(true)} className="w-full sm:w-auto">
                {content.ctaDemo}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-6 gap-y-2 items-center">
              {content.proofs.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                  <span className="text-xs sm:text-sm text-muted-foreground">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <CalendlyModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default FinalCTASection;
