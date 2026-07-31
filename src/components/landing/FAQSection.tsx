"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { FAQContent, SectionContent } from "@/types/cms";

const FALLBACK_ITEMS = {
  en: [
    {
      q: "How does PrepIQ generate daily prep forecasts?",
      a: "PrepIQ analyzes your historical sales, day-of-week patterns, weather signals, holidays, and recent kitchen behavior to predict tomorrow's demand. Each day's service improves the system — the more you use PrepIQ, the smarter the forecasts become.",
    },
    {
      q: "How accurate are the forecasts?",
      a: "We deliberately don't publish an accuracy percentage. We're early, and any number we quoted would come from too few kitchens to mean anything for yours. What we do instead: PrepIQ scores every forecast against what actually sold and shows you that number in your own dashboard from week one, so you can judge it on your data rather than ours.",
    },
    {
      q: "How many kitchens use PrepIQ today?",
      a: "A small number — we're at the start. PrepIQ runs daily in a restaurant group operating two branches, and we're onboarding our next kitchens now. We'd rather tell you that than pad the number. Being early means you get direct access to the team building it, and real influence over what we build next.",
    },
    {
      q: "Do I need a POS system to use PrepIQ?",
      a: "No. While POS integration provides the best real-time data, you can also upload sales data via CSV or enter it manually. PrepIQ is designed to work with the tools your kitchen already uses.",
    },
    {
      q: "How long does it take to set up?",
      a: "Connecting your sales data and confirming your menu items usually takes an afternoon. From there PrepIQ gives you a plan on day one — built from comparable items and your operating hours — and sharpens it as your own sales history accumulates over the following weeks.",
    },
    {
      q: "Can chefs override the AI suggestions?",
      a: "Yes. PrepIQ is designed to support chefs, not replace them. Your team can adjust any recommended prep quantity, and the system learns from those adjustments to improve future forecasts.",
    },
    {
      q: "What happens during service if demand is higher than expected?",
      a: "PrepIQ's Live Mode tracks sales during service and alerts you if an item is trending toward a stockout. It can suggest adjustments like preparing an additional batch or slowing production to minimize waste.",
    },
    {
      q: "How does multi-branch management work?",
      a: "Each branch gets its own localized forecasts based on its unique sales patterns. Managers can monitor all locations from a centralized dashboard and compare forecast accuracy, waste, and performance across the network.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes — a 30-day pilot on a branch, with no credit card. You get the full forecasting workflow on your own sales data, and if it isn't earning its keep by the end you simply stop.",
    },
  ],
  fr: [
    {
      q: "Comment PrepIQ génère-t-il les prévisions quotidiennes ?",
      a: "PrepIQ analyse vos ventes historiques, les modèles par jour de la semaine, la météo, les jours fériés et le comportement récent de votre cuisine. Chaque service améliore le système.",
    },
    {
      q: "Quel est le niveau de précision des prévisions ?",
      a: "Nous ne publions volontairement aucun pourcentage de précision : nous débutons, et un chiffre tiré de si peu de cuisines ne dirait rien de la vôtre. À la place, PrepIQ compare chaque prévision aux ventes réelles et affiche ce score dans votre tableau de bord dès la première semaine — vous jugez sur vos données, pas sur les nôtres.",
    },
    {
      q: "Combien de cuisines utilisent PrepIQ aujourd'hui ?",
      a: "Peu — nous démarrons. PrepIQ tourne chaque jour dans un groupe de restauration exploitant deux établissements, et nous intégrons les suivants en ce moment. Nous préférons le dire clairement plutôt que gonfler le chiffre. Arriver tôt, c'est un accès direct à l'équipe et une vraie influence sur la suite.",
    },
    {
      q: "Ai-je besoin d'un système POS ?",
      a: "Non. Vous pouvez aussi importer vos ventes via CSV ou les saisir manuellement.",
    },
    {
      q: "Combien de temps prend la configuration ?",
      a: "Connecter vos ventes et confirmer votre carte prend en général un après-midi. PrepIQ vous donne un plan dès le premier jour, puis l'affine à mesure que votre historique s'accumule.",
    },
    {
      q: "Les chefs peuvent-ils modifier les suggestions ?",
      a: "Oui. Votre équipe peut ajuster n'importe quelle quantité, et le système apprend de ces corrections.",
    },
    {
      q: "Que se passe-t-il si la demande dépasse les prévisions ?",
      a: "Le Mode Live suit les ventes en direct et vous alerte si un produit risque la rupture.",
    },
    {
      q: "Comment fonctionne la gestion multi-sites ?",
      a: "Chaque établissement dispose de ses propres prévisions localisées. Les managers peuvent piloter tout le réseau depuis un tableau de bord centralisé.",
    },
    {
      q: "Existe-t-il un essai gratuit ?",
      a: "Oui — un pilote de 30 jours sur un établissement, sans carte bancaire. Vous obtenez le flux de prévision complet sur vos propres ventes.",
    },
  ],
};

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
    items: FALLBACK_ITEMS[currentLang] || FALLBACK_ITEMS.en,
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
