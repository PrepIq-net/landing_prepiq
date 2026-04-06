"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Plus, Minus } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const FAQItem = ({ faq, index }: { faq: { q: string; a: string }; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 sm:py-6 text-left group"
      >
        <span className="text-[13px] sm:text-sm md:text-[15px] font-medium text-foreground pr-6 sm:pr-8 group-hover:text-primary transition-colors duration-200 leading-snug">
          {faq.q}
        </span>
        <div className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 transition-all duration-300 ${open ? 'bg-primary/15 rotate-0' : 'bg-accent group-hover:bg-primary/10'}`}>
          {open ? (
            <Minus className="h-3 w-3 text-primary" />
          ) : (
            <Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-muted-foreground leading-[1.7] pb-4 sm:pb-6 pr-8 sm:pr-12 pl-0">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-px bg-border" />
    </motion.div>
  );
};

const FAQSection = () => {
  const { t, i18n } = useTranslation();

  const faqs = useMemo(() => i18n.resolvedLanguage === 'fr' ? [
    {
      q: "Comment PrepIQ aide-t-il à réduire le gaspillage et les ruptures ?",
      a: "PrepIQ prévoit la demande quotidienne pour que votre cuisine prépare la juste quantité. En éliminant les devinettes, vous réduisez le gaspillage lié à la sur-préparation tout en évitant les ruptures qui coûtent cher en CA et en confiance client.",
    },
    {
      q: "Comment PrepIQ génère-t-il les prévisions quotidiennes ?",
      a: "PrepIQ analyse vos ventes historiques, les modèles par jour de la semaine, la météo, les jours fériés et le comportement récent de votre cuisine. Chaque service améliore le système : plus vous l'utilisez, plus il devient précis.",
    },
    {
      q: "Quel est le niveau de précision des prévisions ?",
      a: "La précision s'améliore rapidement. La plupart des cuisines obtiennent des prévisions fiables dès la première semaine, et cette précision s'affine continuellement grâce aux données de ventes et aux retours des chefs.",
    },
    {
      q: "Ai-je besoin d'un système POS pour utiliser PrepIQ ?",
      a: "Non. Bien que l'intégration POS offre les meilleures données en temps réel, vous pouvez aussi importer vos ventes via CSV ou les saisir manuellement. PrepIQ est conçu pour s'adapter à vos outils actuels.",
    },
    {
      q: "Combien de temps prend la configuration ?",
      a: "La plupart des cuisines sont opérationnelles en moins de 48 heures. Il suffit de connecter vos données de ventes et de configurer vos produits pour que PrepIQ commence à apprendre.",
    },
    {
      q: "Les chefs peuvent-ils modifier les suggestions de l'IA ?",
      a: "Oui. PrepIQ est un outil d'aide à la décision, pas un remplaçant. Votre équipe peut ajuster n'importe quelle quantité, et le système apprend de ces corrections pour s'améliorer.",
    },
    {
      q: "PrepIQ aide-t-il vraiment à réduire le gaspillage alimentaire ?",
      a: "Oui. En prévoyant mieux la demande, PrepIQ évite la sur-préparation tout en sécurisant la disponibilité des plats clés. La réduction de la freinte est souvent visible dès les premières semaines.",
    },
    {
      q: "Que se passe-t-il si la demande est plus forte que prévu pendant le service ?",
      a: "Le Mode Live de PrepIQ suit les ventes en direct et vous alerte si un produit risque la rupture. Il suggère alors des ajustements, comme lancer une nouvelle fournée ou ralentir la cadence.",
    },
    {
      q: "Cela fonctionne-t-il pour mon type de cuisine ?",
      a: "PrepIQ fonctionne pour tout établissement préparant des produits frais quotidiennement : restaurants traditionnels, dark kitchens, traiteurs et chaînes multi-sites.",
    },
    {
      q: "Comment fonctionne la gestion multi-sites ?",
      a: "Chaque établissement dispose de ses propres prévisions localisées. Les managers peuvent piloter tout le réseau depuis un tableau de bord centralisé et comparer les performances entre sites.",
    },
    {
      q: "Qu'en est-il de la sécurité des données ?",
      a: "Toutes les données sont chiffrées en transit et au repos. Vos données de cuisine ne sont jamais partagées avec d'autres clients, et vous en restez le seul propriétaire.",
    },
    {
      q: "Existe-t-il un essai gratuit ?",
      a: "Oui. Vous pouvez commencer avec un essai pour un site et tester les capacités de prévision de PrepIQ. Vous pourrez évoluer ensuite vers des fonctions avancées ou multi-sites.",
    },
  ] : [
    {
      q: "How does PrepIQ help kitchens reduce waste and stockouts?",
      a: "PrepIQ forecasts daily demand so your kitchen preps the right amount — every day. By eliminating guesswork, kitchens consistently reduce over-prep waste while avoiding the stockouts that cost you revenue and customer trust.",
    },
    {
      q: "How does PrepIQ generate daily prep forecasts?",
      a: "PrepIQ analyzes your historical sales, day-of-week patterns, weather signals, holidays, and recent kitchen behavior to predict tomorrow's demand. Each day's service improves the system — the more you use PrepIQ, the smarter the forecasts become.",
    },
    {
      q: "How accurate are the forecasts?",
      a: "Accuracy improves quickly as PrepIQ learns your kitchen's patterns. Most kitchens begin seeing reliable forecasts within the first week, and accuracy continues improving as more sales data and chef feedback are captured.",
    },
    {
      q: "Do I need a POS system to use PrepIQ?",
      a: "No. While POS integration provides the best real-time data, you can also upload sales data via CSV or enter it manually. PrepIQ is designed to work with the tools your kitchen already uses.",
    },
    {
      q: "How long does it take to set up?",
      a: "Most kitchens are fully set up within 48 hours. You'll connect your sales data, configure menu items, and PrepIQ immediately begins learning from your operations.",
    },
    {
      q: "Can chefs override the AI suggestions?",
      a: "Yes. PrepIQ is designed to support chefs, not replace them. Your team can adjust any recommended prep quantity, and the system learns from those adjustments to improve future forecasts.",
    },
    {
      q: "Does PrepIQ help reduce food waste?",
      a: "Yes. By forecasting demand more accurately, PrepIQ helps kitchens avoid over-prepping while reducing the risk of running out of key items during service. Many kitchens see significant waste reduction within the first few weeks.",
    },
    {
      q: "What happens during service if demand is higher than expected?",
      a: "PrepIQ's Live Mode tracks sales during service and alerts you if an item is trending toward a stockout. It can suggest adjustments like preparing an additional batch or slowing production to minimize waste.",
    },
    {
      q: "Will it work for my type of kitchen?",
      a: "PrepIQ works for any food operation that prepares food daily — restaurants, cloud kitchens, catering operations, and multi-location brands. If your team preps food before service, PrepIQ can help optimize it.",
    },
    {
      q: "How does multi-branch management work?",
      a: "Each branch gets its own localized forecasts based on its unique sales patterns. Managers can monitor all locations from a centralized dashboard and compare forecast accuracy, waste, and performance across the network.",
    },
    {
      q: "What about data security?",
      a: "All data is encrypted in transit and at rest. Your kitchen data is never shared with other customers, and you retain full ownership of your information at all times.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes. You can start with a free plan for a single branch and experience PrepIQ's forecasting capabilities. Upgrade anytime to unlock advanced analytics, multi-branch intelligence, and team collaboration tools.",
    },
  ], [i18n.resolvedLanguage]);

  const leftFaqs = faqs.slice(0, 6);
  const rightFaqs = faqs.slice(6);

  return (
    <section className="py-20 md:py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.02),transparent_70%)] pointer-events-none" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            {t("faq.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            {t("faq.title")}
          </h2>
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid gap-x-8 lg:gap-x-16 grid-cols-1 lg:grid-cols-2">
          <div>
            {leftFaqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
          <div>
            {rightFaqs.map((faq, i) => (
              <FAQItem key={i + 6} faq={faq} index={i + 6} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 md:mt-14"
        >
          <p className="text-sm text-muted-foreground">
            <Trans
              i18nKey="faq.footer"
              components={{ contact: <a href="#contact" className="text-primary font-medium hover:underline underline-offset-4" /> }}
            />
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
