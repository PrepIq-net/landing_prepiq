import type { FAQItem, SectionContent } from "@/types/cms";

/**
 * Single source of truth for the homepage FAQ.
 *
 * FAQSection (client) renders from these, and the homepage emits FAQPage
 * JSON-LD from the same items — with the same CMS-override rule — so the
 * structured data can never drift from what visitors actually see.
 */
export const FALLBACK_FAQ_ITEMS: Record<"en" | "fr", FAQItem[]> = {
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

/**
 * The FAQ items actually shown for a language: CMS content wins when the
 * section has items, otherwise the fallback. Used identically by the visible
 * FAQSection and the FAQPage JSON-LD.
 */
export function getEffectiveFaqItems(
  dbContent: SectionContent<FAQContentLike> | undefined,
  lang: "en" | "fr",
): FAQItem[] {
  const cmsItems = dbContent?.[lang]?.items;
  if (Array.isArray(cmsItems) && cmsItems.length > 0) {
    return cmsItems;
  }
  return FALLBACK_FAQ_ITEMS[lang] || FALLBACK_FAQ_ITEMS.en;
}

type FAQContentLike = {
  items?: FAQItem[];
};