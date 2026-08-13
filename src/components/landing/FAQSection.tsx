"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { FAQContent, SectionContent } from "@/types/cms";
import { FALLBACK_FAQ_ITEMS } from "@/lib/faq";

const FAQItem = ({
  faq,
  index,
}: {
  faq: { q: string; a: string };
  index: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-6 text-left group"
      >
        <span
          className={`text-md md:text-lg text-base font-medium pr-8 leading-snug transition-colors duration-200 ${
            open ? "text-primary" : "text-foreground"
          }`}
        >
          {faq.q}
        </span>
        <div
          className={`flex h-[26px] w-[26px] items-center justify-center rounded-full shrink-0 transition-colors duration-200 ${
            open ? "bg-primary/15" : "bg-accent"
          }`}
        >
          {open ? (
            <Minus className="h-3 w-3 text-primary" />
          ) : (
            <Plus className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-[1.7] pb-6 pr-14">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-px bg-border" />
    </div>
  );
};

const FAQSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<FAQContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: FAQContent = dbContent?.[currentLang] || {
    badge: t("faq.badge", "Q&A"),
    title: t("faq.title", "Everything kitchens ask us."),
    subtitle: t(
      "faq.subtitle",
      "From setup to daily operations. Still unsure about something?",
    ),
    footer: t("faq.footer", "Talk to our team"),
    items: FALLBACK_FAQ_ITEMS[currentLang] || FALLBACK_FAQ_ITEMS.en,
  };

  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section className="relative py-24 md:py-32 border-t border-border/50 section-band">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24 items-start">
          {/* Left: Sticky heading */}
          <div className="lg:sticky lg:top-[120px]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-px bg-primary" />
              <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {content.badge}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.08] tracking-[-0.02em] mb-5 text-balance">
              {content.title}
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-[320px]">
              {content.subtitle}
            </p>
            <a
              href="#contact"
              className="text-sm text-primary font-medium hover:underline underline-offset-4"
            >
              {currentLang === "fr"
                ? "Parler à l'équipe →"
                : "Talk to our team →"}
            </a>
          </div>

          {/* Right: FAQ items */}
          <div>
            {items.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
