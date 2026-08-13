import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { BLOG_TEASER } from "./content/blog-teaser";

const prisma = new PrismaClient();

const stripTags = (s: string) => s.replace(/<\/?[a-zA-Z]+>/g, "");

/*
 * Testimonials are deliberately NOT seeded. They live in the Testimonial table
 * and are managed at /admin/testimonials, so the only quotes the site can ever
 * show are ones a real customer gave us. The seeded section carries the copy
 * around the quotes (heading, empty state, verifiable facts) and nothing else.
 */

const PRICING_FEATURES = {
  en: {
    core: ["Single-branch operations", "Basic role & permission management", "POS integration + CSV fallback", "Daily prep forecast engine", "Manual override & waste logging", "Manual 86 tracking", "7–14 day variance history"],
    intelligence: ["Everything in Core", "POS + inventory auto-reconciliation", "Waste-to-cost attribution", "Staff accountability engine", "Forecast confidence + learning loop", "Predictive drift detection", "Margin protection signals", "30–90 day trend analysis", "6 AM executive PDF report", "CSV & PDF exports"],
    command: ["Everything in Intelligence", "Multi-branch rollup & comparison", "Executive command center", "Procurement anomaly detection", "Advanced forecasting & benchmarking", "Audit/compliance exports + API", "Centralized admin controls", "Custom enterprise pricing at scale"],
  },
  fr: {
    core: ["Gestion d'un seul site", "Rôles et permissions de base", "Intégration POS + import CSV", "Moteur de prévision quotidien", "Ajustements manuels et saisie des pertes", "Suivi manuel des ruptures", "Historique des écarts (7–14 jours)"],
    intelligence: ["Tout ce qui est dans Core", "Réconciliation POS + inventaire auto", "Attribution coût des pertes", "Moteur de responsabilité équipe", "Confiance prévision + boucle d'apprentissage", "Détection prédictive de dérive", "Signaux de protection de marge", "Analyse de tendances (30–90 jours)", "Rapport PDF exécutif à 6h00", "Exports CSV et PDF"],
    command: ["Tout ce qui est dans Intelligence", "Consolidation et comparaison multi-sites", "Centre de commande exécutif", "Détection d'anomalies d'achats", "Prévisions avancées et benchmarking", "Exports conformité + API", "Contrôles admin centralisés", "Tarification entreprise sur mesure"],
  },
};

const ADDONS = {
  en: [
    { name: "Tax Engine", desc: "Automatically calculate and apply local tax rules across jurisdictions, so every location stays compliant without manual work." },
    { name: "Liability Shield", desc: "Generates audit-ready waste logs, HACCP-aligned reports, and timestamped records for regulatory inspections and insurance claims." },
    { name: "Enterprise SSO", desc: "Single sign-on via SAML/OIDC for your entire org. One login, centralized access control, and automatic provisioning." },
    { name: "Advanced API", desc: "Full REST API access to push forecasts, pull waste data, and integrate PrepIQ into your existing ERP, BI, or procurement systems." },
    { name: "Dedicated Analyst", desc: "A named PrepIQ analyst reviews your data weekly, delivers optimization recommendations, and helps you hit waste-reduction targets." },
  ],
  fr: [
    { name: "Moteur Fiscal", desc: "Calcul et application automatique des taxes locales selon les juridictions pour rester conforme sans effort." },
    { name: "Bouclier Légal", desc: "Génère des registres de pertes conformes HACCP et des rapports horodatés pour les inspections et assurances." },
    { name: "SSO Entreprise", desc: "Connexion unique via SAML/OIDC pour toute l'organisation. Un seul login, accès centralisé." },
    { name: "API Avancée", desc: "Accès complet à l'API REST pour pousser les prévisions et intégrer PrepIQ à vos ERP ou BI existants." },
    { name: "Analyste Dédié", desc: "Un analyste PrepIQ examine vos données chaque semaine et vous aide à atteindre vos objectifs de réduction des pertes." },
  ],
};

const FAQ_ITEMS = {
  en: [
    { q: "How does PrepIQ help kitchens reduce waste and stockouts?", a: "PrepIQ forecasts daily demand so your kitchen preps the right amount — every day. By eliminating guesswork, kitchens consistently reduce over-prep waste while avoiding the stockouts that cost you revenue and customer trust." },
    { q: "How does PrepIQ generate daily prep forecasts?", a: "PrepIQ analyzes your historical sales, day-of-week patterns, weather signals, holidays, and recent kitchen behavior to predict tomorrow's demand. Each day's service improves the system — the more you use PrepIQ, the smarter the forecasts become." },
    { q: "How accurate are the forecasts?", a: "We deliberately don't publish an accuracy percentage. We're early, and any number we quoted would come from too few kitchens to mean anything for yours. What we do instead: PrepIQ scores every forecast against what actually sold and shows you that number in your own dashboard from week one, so you can judge it on your data rather than ours." },
    { q: "How many kitchens use PrepIQ today?", a: "A small number — we're at the start. PrepIQ runs daily in a restaurant group operating two branches, and we're onboarding our next kitchens now. We'd rather tell you that than pad the number. Being early means direct access to the team building it, and real influence over what we build next." },
    { q: "Do I need a POS system to use PrepIQ?", a: "No. While POS integration provides the best real-time data, you can also upload sales data via CSV or enter it manually. PrepIQ is designed to work with the tools your kitchen already uses." },
    { q: "How long does it take to set up?", a: "Connecting your sales data and confirming your menu items usually takes an afternoon. From there PrepIQ gives you a plan on day one — built from comparable items and your operating hours — and sharpens it as your own sales history accumulates over the following weeks." },
    { q: "Can chefs override the AI suggestions?", a: "Yes. PrepIQ is designed to support chefs, not replace them. Your team can adjust any recommended prep quantity, and the system learns from those adjustments to improve future forecasts." },
    { q: "Does PrepIQ help reduce food waste?", a: "That's what it's built to do: forecasting demand more accurately means preparing closer to what will actually sell, without running out of key items mid-service. We won't promise you a percentage — PrepIQ measures your prepared-versus-sold gap and attributes where it went, so you can see the effect on your own numbers instead of taking ours on trust." },
    { q: "What happens during service if demand is higher than expected?", a: "PrepIQ's Live Mode tracks sales during service and alerts you if an item is trending toward a stockout. It can suggest adjustments like preparing an additional batch or slowing production to minimize waste." },
    { q: "Will it work for my type of kitchen?", a: "PrepIQ works for any food operation that prepares food daily — restaurants, cloud kitchens, catering operations, and multi-location brands. If your team preps food before service, PrepIQ can help optimize it." },
    { q: "How does multi-branch management work?", a: "Each branch gets its own localized forecasts based on its unique sales patterns. Managers can monitor all locations from a centralized dashboard and compare forecast accuracy, waste, and performance across the network." },
    { q: "What about data security?", a: "All data is encrypted in transit and at rest. Your kitchen data is never shared with other customers, and you retain full ownership of your information at all times." },
    { q: "Is there a free trial?", a: "Yes — a 30-day pilot on a branch, with no credit card. You get the full forecasting workflow on your own sales data, and if it isn't earning its keep by the end you simply stop." },
  ],
  fr: [
    { q: "Comment PrepIQ aide-t-il à réduire le gaspillage et les ruptures ?", a: "PrepIQ prévoit la demande quotidienne pour que votre cuisine prépare la juste quantité. En éliminant les devinettes, vous réduisez le gaspillage lié à la sur-préparation tout en évitant les ruptures qui coûtent cher en CA et en confiance client." },
    { q: "Comment PrepIQ génère-t-il les prévisions quotidiennes ?", a: "PrepIQ analyse vos ventes historiques, les modèles par jour de la semaine, la météo, les jours fériés et le comportement récent de votre cuisine. Chaque service améliore le système : plus vous l'utilisez, plus il devient précis." },
    { q: "Quel est le niveau de précision des prévisions ?", a: "Nous ne publions volontairement aucun pourcentage de précision : nous débutons, et un chiffre tiré de si peu de cuisines ne dirait rien de la vôtre. À la place, PrepIQ compare chaque prévision aux ventes réelles et affiche ce score dans votre tableau de bord dès la première semaine — vous jugez sur vos données, pas sur les nôtres." },
    { q: "Combien de cuisines utilisent PrepIQ aujourd'hui ?", a: "Peu — nous démarrons. PrepIQ tourne chaque jour dans un groupe de restauration exploitant deux établissements, et nous intégrons les suivants en ce moment. Nous préférons le dire clairement plutôt que gonfler le chiffre. Arriver tôt, c'est un accès direct à l'équipe et une vraie influence sur la suite." },
    { q: "Ai-je besoin d'un système POS pour utiliser PrepIQ ?", a: "Non. Bien que l'intégration POS offre les meilleures données en temps réel, vous pouvez aussi importer vos ventes via CSV ou les saisir manuellement. PrepIQ est conçu pour s'adapter à vos outils actuels." },
    { q: "Combien de temps prend la configuration ?", a: "Connecter vos ventes et confirmer votre carte prend en général un après-midi. PrepIQ vous donne un plan dès le premier jour, puis l'affine à mesure que votre historique s'accumule." },
    { q: "Les chefs peuvent-ils modifier les suggestions de l'IA ?", a: "Oui. PrepIQ est un outil d'aide à la décision, pas un remplaçant. Votre équipe peut ajuster n'importe quelle quantité, et le système apprend de ces corrections pour s'améliorer." },
    { q: "PrepIQ aide-t-il vraiment à réduire le gaspillage alimentaire ?", a: "C'est sa raison d'être : mieux prévoir la demande, c'est préparer au plus près de ce qui se vendra, sans rupture en plein service. Nous ne promettons pas de pourcentage — PrepIQ mesure l'écart entre préparé et vendu et en attribue la cause, pour que vous constatiez l'effet sur vos propres chiffres." },
    { q: "Que se passe-t-il si la demande est plus forte que prévu pendant le service ?", a: "Le Mode Live de PrepIQ suit les ventes en direct et vous alerte si un produit risque la rupture. Il suggère alors des ajustements, comme lancer une nouvelle fournée ou ralentir la cadence." },
    { q: "Cela fonctionne-t-il pour mon type de cuisine ?", a: "PrepIQ fonctionne pour tout établissement préparant des produits frais quotidiennement : restaurants traditionnels, dark kitchens, traiteurs et chaînes multi-sites." },
    { q: "Comment fonctionne la gestion multi-sites ?", a: "Chaque établissement dispose de ses propres prévisions localisées. Les managers peuvent piloter tout le réseau depuis un tableau de bord centralisé et comparer les performances entre sites." },
    { q: "Qu'en est-il de la sécurité des données ?", a: "Toutes les données sont chiffrées en transit et au repos. Vos données de cuisine ne sont jamais partagées avec d'autres clients, et vous en restez le seul propriétaire." },
    { q: "Existe-t-il un essai gratuit ?", a: "Oui — un pilote de 30 jours sur un établissement, sans carte bancaire. Vous obtenez le flux de prévision complet sur vos propres ventes, et si cela ne vous apporte rien, vous arrêtez, simplement." },
  ],
};

const EXPLORE = {
  en: {
    badge: "Explore PrepIQ",
    title: "See what's <gold>under the hood</gold>",
    subtitle: "The system, the plans it comes in, and the team behind it — three stops, five minutes.",
    items: [
      { icon: "brain", title: "How It Works", desc: "Follow a day in a PrepIQ kitchen — from the morning plan to live service coordination to the nightly learning loop.", cta: "See the system", href: "/how-it-works" },
      { icon: "pricing", title: "Pricing", desc: "Three plans that scale from a single branch to a global network — each built to recover more margin than it costs.", cta: "Compare plans", href: "/pricing" },
      { icon: "contact", title: "Contact", desc: "Questions about setup, integrations, or enterprise rollout? Talk directly to the team behind PrepIQ.", cta: "Get in touch", href: "/contact" },
    ],
  },
  fr: {
    badge: "Explorer PrepIQ",
    title: "Regardez <gold>sous le capot</gold>",
    subtitle: "Le système, les forfaits disponibles et l'équipe derrière — trois étapes, cinq minutes.",
    items: [
      { icon: "brain", title: "Comment ça marche", desc: "Suivez une journée dans une cuisine PrepIQ — du plan du matin à la coordination en direct jusqu'à la boucle d'apprentissage.", cta: "Voir le système", href: "/how-it-works" },
      { icon: "pricing", title: "Tarification", desc: "Trois forfaits qui évoluent d'un site unique à un réseau mondial — chacun conçu pour récupérer plus de marge qu'il n'en coûte.", cta: "Comparer les forfaits", href: "/pricing" },
      { icon: "contact", title: "Contact", desc: "Des questions sur la configuration, les intégrations ou un déploiement entreprise ? Parlez directement à l'équipe PrepIQ.", cta: "Nous écrire", href: "/contact" },
    ],
  },
};

const PAGE_HEADERS = {
  "how-it-works": {
    en: {
      badge: "How It Works",
      icon: "brain",
      titleLine1: "From sales signals",
      titleLine2: "to a precise prep plan.",
      subtitle: "PrepIQ turns your sales history, weather, events, and chef feedback into a daily prep plan your kitchen can trust — and it learns from every single service.",
      // "8+ demand signals" is a countable product fact. The other two used to
      // be "92% forecast accuracy" and "48h to go live" — neither is measured
      // across enough kitchens to publish, so they are stated as what we do.
      stats: [
        { value: "8+", label: "Demand signals per forecast" },
        { value: "Day 1", label: "First plan, before your history exists" },
        { value: "Nightly", label: "The model relearns after every close" },
      ],
    },
    fr: {
      badge: "Comment ça marche",
      icon: "brain",
      titleLine1: "Des signaux de vente",
      titleLine2: "à un plan de prod précis.",
      subtitle: "PrepIQ transforme votre historique de ventes, la météo, les événements et les retours des chefs en un plan de production quotidien fiable — qui apprend à chaque service.",
      stats: [
        { value: "8+", label: "Signaux de demande par prévision" },
        { value: "Jour 1", label: "Premier plan, sans historique" },
        { value: "Chaque nuit", label: "Le modèle réapprend après chaque clôture" },
      ],
    },
  },
  pricing: {
    en: {
      badge: "Pricing",
      icon: "pricing",
      titleLine1: "Simple plans.",
      titleLine2: "Priced to pay for themselves.",
      subtitle: "Start on a single branch and scale when you're ready. Every plan is built around one goal: recovering more margin than it costs.",
      stats: [],
    },
    fr: {
      badge: "Tarification",
      icon: "pricing",
      titleLine1: "Des forfaits simples.",
      titleLine2: "Conçus pour s'autofinancer.",
      subtitle: "Commencez sur un seul site et évoluez à votre rythme. Chaque forfait vise un seul objectif : récupérer plus de marge qu'il n'en coûte.",
      stats: [],
    },
  },
  contact: {
    en: {
      badge: "Contact",
      icon: "contact",
      titleLine1: "Talk to the team",
      titleLine2: "behind the forecasts.",
      subtitle: "Questions about setup, integrations, or an enterprise rollout — send a note and we'll get back to you within one business day.",
      stats: [],
    },
    fr: {
      badge: "Contact",
      icon: "contact",
      titleLine1: "Parlez à l'équipe",
      titleLine2: "derrière les prévisions.",
      subtitle: "Des questions sur la configuration, les intégrations ou un déploiement entreprise — écrivez-nous et nous vous répondrons sous un jour ouvré.",
      stats: [],
    },
  },
};

const META_DESCRIPTIONS: Record<string, { en: string; fr: string }> = {
  home: {
    en: "PrepIQ is kitchen intelligence, end to end — it plans the day's prep, ingredients and staffing, coordinates the line through service, and learns from every shift.",
    fr: "PrepIQ, c'est l'intelligence cuisine de bout en bout — elle planifie la mise en place, les ingrédients et le personnel, coordonne le service et apprend de chaque shift.",
  },
  "how-it-works": {
    en: "See how PrepIQ turns sales history, weather, events, and chef feedback into a precise daily prep plan for your kitchen.",
    fr: "Découvrez comment PrepIQ transforme l'historique de ventes, la météo, les événements et les retours des chefs en un plan de production quotidien précis.",
  },
  pricing: {
    en: "Compare PrepIQ plans — Core, Intelligence, and Command — with transparent pricing that scales with your kitchen.",
    fr: "Comparez les forfaits PrepIQ — Core, Intelligence et Command — avec une tarification transparente qui évolue avec votre cuisine.",
  },
  contact: {
    en: "Get in touch with the PrepIQ team about setup, integrations, or an enterprise rollout.",
    fr: "Contactez l'équipe PrepIQ pour la configuration, les intégrations ou un déploiement entreprise.",
  },
};

function buildContent(loc: any, isFr: boolean) {
  return {
    hero: {
      badge: loc.hero.badge,
      titleLine1: loc.hero.titleLine1,
      titleLine2: loc.hero.titleLine2,
      subtitle: loc.hero.subtitle,
      proof: loc.hero.proof,
      ctaStart: loc.hero.ctaStart,
      ctaDemo: loc.hero.ctaDemo,
      stats: loc.hero.stats,
    },
    operations: {
      badge: loc.operations.badge,
      title: loc.operations.title,
      subtitle: loc.operations.subtitle,
      footer: loc.operations.footer,
      pillars: ["plan", "coordinate", "improve"].map((k) => ({
        icon: k,
        phase: loc.operations.pillars[k].phase,
        title: loc.operations.pillars[k].title,
        body: loc.operations.pillars[k].body,
        features: loc.operations.pillars[k].features,
      })),
    },
    integrations: {
      badge: loc.integrations.badge,
      titleLine1: isFr ? "Fonctionne avec votre" : "Works with your",
      titleLine2: isFr ? "système actuel" : "existing stack",
      body: isFr
        ? "PrepIQ se connecte directement à votre POS pour récupérer les données de vente automatiquement — sans export manuel, sans tableur. D'autres intégrations arrivent bientôt."
        : "PrepIQ connects directly to your POS to pull sales data automatically — no manual exports, no spreadsheets. More integrations are on the way.",
      csvNote: isFr
        ? "Vous n'utilisez pas encore un POS pris en charge ? Vous pouvez importer vos ventes via CSV ou notre API REST — PrepIQ fonctionne dans les deux cas."
        : "Not using a supported POS yet? You can import sales via CSV or connect through our REST API — PrepIQ works either way.",
      posSystems: [
        { name: "Loyverse", status: "live" },
        { name: "Square", status: "soon" },
        { name: "Toast", status: "soon" },
        { name: "Clover", status: "soon" },
      ],
      tickerLabel: loc.logoTicker.title,
    },
    costOfGuessing: {
      badge: loc.problem.badge,
      title: loc.problem.title,
      subtitle: loc.problem.subtitle,
      problems: [
        { title: loc.problem.items.overprep.title, result: loc.problem.items.overprep.result, desc: loc.problem.items.overprep.desc, impact: loc.problem.items.overprep.impact, impactLabel: loc.problem.items.overprep.impactLabel },
        { title: loc.problem.items.underprep.title, result: loc.problem.items.underprep.result, desc: loc.problem.items.underprep.desc, impact: loc.problem.items.underprep.impact, impactLabel: loc.problem.items.underprep.impactLabel },
        { title: loc.problem.items.spreadsheets.title, result: loc.problem.items.spreadsheets.result, desc: loc.problem.items.spreadsheets.desc, impact: loc.problem.items.spreadsheets.impact, impactLabel: loc.problem.items.spreadsheets.impactLabel },
      ],
      // The metrics used to be invented industry figures (+18%, ±30%, 2.4×,
      // +42%) with no source behind them. They now name the direction of each
      // pressure, which is the point the section is actually making.
      pressures: (["foodCosts", "weather", "events", "delivery"] as const).map((k) => ({
        title: loc.whyNow.items[k].title,
        desc: loc.whyNow.items[k].desc,
        metric: loc.whyNow.metrics[k],
        metricLabel: loc.whyNow.items[k].label,
      })),
      cta: stripTags(loc.whyNow.cta),
    },
    howItWorks: {
      badge: loc.howItWorks.badge,
      title: stripTags(loc.howItWorks.title),
      subtitle: loc.howItWorks.subtitle,
      signalsTitle: loc.howItWorks.signalsTitle,
      signals: ["sales", "patterns", "hours", "events", "weather", "chef", "stockouts", "trends"].map((k) => ({ label: loc.howItWorks.signals[k] })),
      phases: {
        plan: loc.howItWorks.phases.plan,
        live: loc.howItWorks.phases.live,
        review: loc.howItWorks.phases.review,
      },
      chefOverride: {
        title: loc.howItWorks.chefOverride.title,
        body: loc.howItWorks.chefOverride.body,
        simulate: loc.howItWorks.previews.simulateOverride,
        reset: loc.howItWorks.previews.resetSimulation,
      },
      liveFeatures: loc.howItWorks.liveFeatures,
      reviewFeatures: loc.howItWorks.reviewFeatures,
      comparison: {
        badge: isFr ? "Sans PrepIQ vs Avec PrepIQ" : "Without PrepIQ vs With PrepIQ",
        withoutLabel: loc.kitchenTest.toggleWithout,
        withLabel: loc.kitchenTest.toggleWith,
        dailyMarginLost: loc.kitchenTest.dailyMarginLost,
        dailyMarginRecovered: loc.kitchenTest.dailyMarginRecovered,
      },
    },
    intelligence: {
      badge: loc.intelligence.badge,
      title: loc.intelligence.title,
      subtitle: loc.intelligence.subtitle,
      signals: ["sales", "patterns", "weather", "events", "stockouts", "chef"].map((k) => ({ label: loc.intelligence.signals[k].label, desc: loc.intelligence.signals[k].desc })),
      footer: loc.intelligence.footer,
      pipelineTitle: loc.marginGuard.title,
      pipelineSteps: loc.marginGuard.steps,
      alerts: ["waste", "stockout", "leak"].map((k) => ({ type: loc.marginGuard.alerts[k].type, detail: loc.marginGuard.alerts[k].detail, action: loc.marginGuard.alerts[k].action })),
      atRiskLabel: isFr ? "à risque" : "at risk",
      suggestedLabel: isFr ? "Suggéré" : "Suggested",
      leakTypes: ["overprep", "stockout", "batch", "drift"].map((k) => loc.marginGuard.leakTypes[k]),
      totalProtectionLabel: loc.marginGuard.totalProtection,
      roiNote: loc.marginGuard.roiNote,
      whyBadge: loc.whyPrepIQ.badge,
      whyPoints: loc.whyPrepIQ.points,
      whyFooter: loc.whyPrepIQ.footer,
    },
    kitchenCalculatorTeaser: loc.kitchenCalculatorTeaser,
    builtForScale: {
      badge: loc.whoItsFor.badge,
      title: loc.whoItsFor.title,
      subtitle: loc.whoItsFor.subtitle,
      personas: ["multiBranch", "brands", "chefs", "ops"].map((k) => ({ title: loc.whoItsFor.personas[k].title, desc: loc.whoItsFor.personas[k].desc, stat: loc.whoItsFor.personas[k].stat })),
      networkTitle: loc.multiBranch.title,
      networkSubtitle: loc.multiBranch.subtitle,
      sidebarTitle: loc.multiBranch.sidebarTitle,
      // Multi-branch capabilities, not network averages — see BuiltForScaleContent.
      stats: loc.multiBranch.capabilities,
      // No seeded branch roster. The previous five (Manhattan, London Bridge,
      // Dubai Marina, Lagos, Sydney) were invented locations presented as a live
      // customer network; PrepIQ runs in one group of two kitchens.
      branches: [],
      globalTitle: loc.globalReady.title,
      globalSubtitle: loc.globalReady.subtitle,
      globalFeatures: ["currency", "timezone", "localized", "support"].map((k) => ({ label: loc.globalReady.features[k].label, desc: loc.globalReady.features[k].desc })),
      regions: ["na", "eu", "me", "af", "ap", "la"].map((k) => loc.globalReady.regions[k]),
    },
    testimonials: {
      badge: loc.testimonials.badge,
      title: loc.testimonials.title,
      subtitle: loc.testimonials.subtitle,
      facts: loc.testimonials.facts,
    },
    pricing: {
      badge: loc.pricing.badge,
      title: stripTags(loc.pricing.title),
      subtitle: loc.pricing.subtitle,
      monthly: loc.pricing.monthly,
      annual: loc.pricing.annual,
      save: loc.pricing.save,
      perMonth: loc.pricing.perMonth,
      perYear: loc.pricing.perYear,
      billedAnnually: loc.pricing.billedAnnually,
      billedMonthly: loc.pricing.billedMonthly,
      staff: loc.pricing.staff,
      mostPopular: loc.pricing.mostPopular,
      footer: stripTags(loc.pricing.footer),
      plans: {
        core: { name: loc.pricing.plans.core.name, tagline: loc.pricing.plans.core.tagline, cta: loc.pricing.plans.core.cta, features: isFr ? PRICING_FEATURES.fr.core : PRICING_FEATURES.en.core },
        intelligence: { name: loc.pricing.plans.intelligence.name, tagline: loc.pricing.plans.intelligence.tagline, cta: loc.pricing.plans.intelligence.cta, features: isFr ? PRICING_FEATURES.fr.intelligence : PRICING_FEATURES.en.intelligence },
        command: { name: loc.pricing.plans.command.name, tagline: loc.pricing.plans.command.tagline, cta: loc.pricing.plans.command.cta, features: isFr ? PRICING_FEATURES.fr.command : PRICING_FEATURES.en.command },
      },
      addOns: {
        title: loc.pricing.addOns.title,
        subtitle: loc.pricing.addOns.subtitle,
        items: isFr ? ADDONS.fr : ADDONS.en,
      },
    },
    faq: {
      badge: loc.faq.badge,
      title: loc.faq.title,
      subtitle: loc.faq.subtitle,
      footer: stripTags(loc.faq.footer),
      items: isFr ? FAQ_ITEMS.fr : FAQ_ITEMS.en,
    },
    contact: {
      getInTouch: loc.contact.getInTouch,
      title: stripTags(loc.contact.title),
      subtitle: loc.contact.subtitle,
      contactInfo: { email: loc.contact.email, phone: loc.contact.phone, office: loc.contact.office },
      trustPoint: loc.contact.trustPoint,
      formHeader: loc.contact.formHeader,
      optionalEmail: loc.contact.optionalEmail,
      name: loc.contact.name,
      placeholderName: loc.contact.placeholderName,
      placeholderEmail: loc.contact.placeholderEmail,
      company: loc.contact.company,
      placeholderCompany: loc.contact.placeholderCompany,
      locations: loc.contact.locations,
      message: loc.contact.message,
      placeholderMessage: loc.contact.placeholderMessage,
      sent: loc.contact.sent,
      sentSubtitle: loc.contact.sentSubtitle,
      sending: loc.contact.sending,
      send: loc.contact.send,
      noSpam: loc.contact.noSpam,
    },
    finalCTA: {
      badge: loc.finalCTA.badge,
      title: stripTags(loc.finalCTA.title),
      subtitle: loc.finalCTA.subtitle,
      ctaStart: loc.finalCTA.ctaStart,
      ctaDemo: loc.finalCTA.ctaDemo,
      // Commitments we control, so they stay true regardless of how many
      // kitchens we have. Nothing here asserts a measured customer outcome.
      proofs: isFr
        ? ["Essai gratuit de 30 jours — sans CB", "Connectez votre POS, ou partez d'un CSV", "Vos données restent les vôtres — export à tout moment"]
        : ["30-day free pilot — no credit card", "Connect your POS, or start from a CSV", "Your data stays yours — export it any time"],
    },
  };
}

async function main() {
  const enPath = path.resolve(process.cwd(), "src/i18n/locales/en.json");
  const frPath = path.resolve(process.cwd(), "src/i18n/locales/fr.json");

  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"));

  const enContent = buildContent(en, false);
  const frContent = buildContent(fr, true);

  // Helper to upsert a page and return it
  async function upsertPage(slug: string, titleEn: string, titleFr: string, sortOrder: number) {
    const meta = META_DESCRIPTIONS[slug];
    const metaData = meta ? { metaDescriptionEn: meta.en, metaDescriptionFr: meta.fr } : {};
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      if (
        existing.titleEn !== titleEn ||
        existing.titleFr !== titleFr ||
        existing.sortOrder !== sortOrder ||
        (meta && (existing.metaDescriptionEn !== meta.en || existing.metaDescriptionFr !== meta.fr))
      ) {
        return await prisma.page.update({
          where: { slug },
          data: { titleEn, titleFr, sortOrder, ...metaData },
        });
      }
      return existing;
    } else {
      return await prisma.page.create({
        data: { slug, titleEn, titleFr, sortOrder, isActive: true, ...metaData },
      });
    }
  }

  // Section definitions, reused across pages
  const SECTIONS = {
    hero: { componentType: "HeroSection", titleEn: "Hero", titleFr: "Héros", contentJson: { en: enContent.hero, fr: frContent.hero } },
    operations: { componentType: "OperationsSection", titleEn: "What PrepIQ Does", titleFr: "Ce que fait PrepIQ", contentJson: { en: enContent.operations, fr: frContent.operations } },
    integrations: { componentType: "IntegrationsSection", titleEn: "Integrations", titleFr: "Intégrations", contentJson: { en: enContent.integrations, fr: frContent.integrations } },
    costOfGuessing: { componentType: "CostOfGuessingSection", titleEn: "The Cost of Guessing", titleFr: "Le Coût de l'Incertitude", contentJson: { en: enContent.costOfGuessing, fr: frContent.costOfGuessing } },
    kitchenCalculatorTeaser: { componentType: "KitchenCalculatorTeaserSection", titleEn: "Kitchen Calculator Teaser", titleFr: "Aperçu Calculateur Cuisine", contentJson: { en: enContent.kitchenCalculatorTeaser, fr: frContent.kitchenCalculatorTeaser } },
    howItWorks: { componentType: "HowItWorksSection", titleEn: "How It Works", titleFr: "Comment ça marche", contentJson: { en: enContent.howItWorks, fr: frContent.howItWorks } },
    intelligence: { componentType: "IntelligenceSection", titleEn: "Intelligence & Margin Protection", titleFr: "Intelligence et Protection des Marges", contentJson: { en: enContent.intelligence, fr: frContent.intelligence } },
    builtForScale: { componentType: "BuiltForScaleSection", titleEn: "Built for Scale", titleFr: "Conçu pour l'Échelle", contentJson: { en: enContent.builtForScale, fr: frContent.builtForScale } },
    testimonials: { componentType: "TestimonialsSection", titleEn: "Testimonials", titleFr: "Témoignages", contentJson: { en: enContent.testimonials, fr: frContent.testimonials } },
    pricing: { componentType: "PricingSection", titleEn: "Pricing", titleFr: "Tarifs", contentJson: { en: enContent.pricing, fr: frContent.pricing } },
    faq: { componentType: "FAQSection", titleEn: "FAQ", titleFr: "FAQ", contentJson: { en: enContent.faq, fr: frContent.faq } },
    contact: { componentType: "ContactSection", titleEn: "Contact", titleFr: "Contact", contentJson: { en: enContent.contact, fr: frContent.contact } },
    blogTeaser: { componentType: "BlogTeaserSection", titleEn: "Featured Articles", titleFr: "Articles en vedette", contentJson: { en: BLOG_TEASER.en, fr: BLOG_TEASER.fr } },
    explore: { componentType: "ExploreSection", titleEn: "Explore", titleFr: "Explorer", contentJson: { en: EXPLORE.en, fr: EXPLORE.fr } },
    finalCTA: { componentType: "FinalCTASection", titleEn: "Final CTA", titleFr: "Appel à l'action final", contentJson: { en: enContent.finalCTA, fr: frContent.finalCTA } },
  };

  const pageHeader = (key: keyof typeof PAGE_HEADERS, titleEn: string, titleFr: string) => ({
    componentType: "PageHeaderSection",
    titleEn,
    titleFr,
    contentJson: { en: PAGE_HEADERS[key].en, fr: PAGE_HEADERS[key].fr },
  });

  // 1. Marketing pages and their sections (split from the previous single home page)
  const marketingPages = [
    {
      slug: "home", titleEn: "Home", titleFr: "Accueil", sortOrder: 0,
      sections: [SECTIONS.hero, SECTIONS.operations, SECTIONS.costOfGuessing, SECTIONS.kitchenCalculatorTeaser, SECTIONS.testimonials, SECTIONS.blogTeaser, SECTIONS.explore, SECTIONS.finalCTA],
    },
    {
      slug: "how-it-works", titleEn: "How It Works", titleFr: "Comment ça marche", sortOrder: 1,
      sections: [
        pageHeader("how-it-works", "Page Header", "En-tête de page"),
        SECTIONS.howItWorks, SECTIONS.intelligence, SECTIONS.integrations, SECTIONS.builtForScale, SECTIONS.finalCTA,
      ],
    },
    {
      slug: "pricing", titleEn: "Pricing", titleFr: "Tarification", sortOrder: 2,
      sections: [
        pageHeader("pricing", "Page Header", "En-tête de page"),
        SECTIONS.pricing, SECTIONS.faq, SECTIONS.finalCTA,
      ],
    },
    {
      slug: "contact", titleEn: "Contact", titleFr: "Contact", sortOrder: 3,
      sections: [
        pageHeader("contact", "Page Header", "En-tête de page"),
        SECTIONS.contact,
      ],
    },
  ];

  // 2. Legal pages (content managed elsewhere; sections untouched)
  await upsertPage("privacy-policy", "Privacy Policy", "Politique de Confidentialité", 4);
  await upsertPage("terms-of-service", "Terms of Service", "Conditions d'Utilisation", 5);
  await upsertPage("security", "Security", "Sécurité", 6);

  // 3. Seed each marketing page's sections idempotently
  for (const pageDef of marketingPages) {
    const page = await upsertPage(pageDef.slug, pageDef.titleEn, pageDef.titleFr, pageDef.sortOrder);

    const currentSections = await prisma.section.findMany({
      where: { pageId: page.id },
      orderBy: { sortOrder: "asc" },
    });

    for (let i = 0; i < pageDef.sections.length; i++) {
      const sectionData = {
        ...pageDef.sections[i],
        pageId: page.id,
        sortOrder: i,
        isActive: true,
      };

      const existing = currentSections.find(s => s.componentType === sectionData.componentType);

      if (existing) {
        // For JSON comparison, we can use stringify or deep equal. Since it's a seed, stringify is usually enough for data from files.
        const existingContentStr = JSON.stringify(existing.contentJson);
        const newContentStr = JSON.stringify(sectionData.contentJson);

        if (
          existing.titleEn !== sectionData.titleEn ||
          existing.titleFr !== sectionData.titleFr ||
          existingContentStr !== newContentStr ||
          existing.sortOrder !== sectionData.sortOrder
        ) {
          await prisma.section.update({
            where: { id: existing.id },
            data: sectionData as any,
          });
        }
      } else {
        await prisma.section.create({
          data: sectionData as any,
        });
      }
    }

    // Remove sections that are no longer on this page
    const seedComponentTypes = pageDef.sections.map(s => s.componentType);
    const sectionsToRemove = currentSections.filter(s => !seedComponentTypes.includes(s.componentType));
    if (sectionsToRemove.length > 0) {
      await prisma.section.deleteMany({
        where: { id: { in: sectionsToRemove.map(s => s.id) } },
      });
    }
  }

  // 4. Navigation Links
  const navLinks = [
    { labelEn: en.navbar.howItWorks, labelFr: fr.navbar.howItWorks, url: "/how-it-works", sortOrder: 0 },
    { labelEn: en.navbar.pricing, labelFr: fr.navbar.pricing, url: "/pricing", sortOrder: 1 },
    { labelEn: en.footer.links.contact, labelFr: fr.footer.links.contact, url: "/contact", sortOrder: 2 },
  ];

  const currentNavLinks = await prisma.link.findMany({ where: { type: "nav" } });
  for (const link of navLinks) {
    const existing = currentNavLinks.find(l => l.url === link.url);
    const data = { ...link, type: "nav", isActive: true };
    if (existing) {
      if (existing.labelEn !== link.labelEn || existing.labelFr !== link.labelFr || existing.sortOrder !== link.sortOrder) {
        await prisma.link.update({ where: { id: existing.id }, data });
      }
    } else {
      await prisma.link.create({ data });
    }
  }
  // Cleanup old nav links
  const seedNavUrls = navLinks.map(l => l.url);
  await prisma.link.deleteMany({
    where: { type: "nav", url: { notIn: seedNavUrls } }
  });

  // 5. Footer Links
  const footerLinks = [
    { labelEn: en.navbar.howItWorks, labelFr: fr.navbar.howItWorks, url: "/how-it-works", category: "product", sortOrder: 0 },
    { labelEn: en.navbar.integrations, labelFr: fr.navbar.integrations, url: "/how-it-works#integrations", category: "product", sortOrder: 1 },
    { labelEn: en.navbar.pricing, labelFr: fr.navbar.pricing, url: "/pricing", category: "product", sortOrder: 2 },
    { labelEn: "Kitchen Calculator", labelFr: "Calculateur Cuisine", url: "/kitchen-intelligence-calculator", category: "product", sortOrder: 3 },
    // Every URL below must resolve to a real page — a footer full of "#" is the
    // fastest way to look like a site with nothing behind it. Careers points at
    // the anchored section of /about, since there is no /careers index route.
    { labelEn: en.footer.links.about, labelFr: fr.footer.links.about, url: "/about", category: "company", sortOrder: 0 },
    { labelEn: en.footer.links.careers, labelFr: fr.footer.links.careers, url: "/about#careers", category: "company", sortOrder: 1 },
    { labelEn: en.footer.links.blog, labelFr: fr.footer.links.blog, url: "/blog", category: "company", sortOrder: 2 },
    { labelEn: en.footer.links.contact, labelFr: fr.footer.links.contact, url: "/contact", category: "company", sortOrder: 3 },
    { labelEn: en.footer.links.privacy, labelFr: fr.footer.links.privacy, url: "/privacy-policy", category: "legal", sortOrder: 0 },
    { labelEn: en.footer.links.terms, labelFr: fr.footer.links.terms, url: "/terms-of-service", category: "legal", sortOrder: 1 },
    { labelEn: en.footer.links.security, labelFr: fr.footer.links.security, url: "/security", category: "legal", sortOrder: 2 },
    // Social accounts render as icons in the footer bar, not as a text column.
    // LinkedIn is the only account that exists; do not seed placeholders.
    { labelEn: "LinkedIn", labelFr: "LinkedIn", url: "https://www.linkedin.com/company/prepiq-ai", category: "social", sortOrder: 0 },
  ];

  const currentFooterLinks = await prisma.link.findMany({ where: { type: "footer" } });
  for (const link of footerLinks) {
    const existing = currentFooterLinks.find(l => l.labelEn === link.labelEn && l.category === link.category);
    const data = { ...link, type: "footer", isActive: true };
    if (existing) {
      if (existing.labelEn !== link.labelEn || existing.labelFr !== link.labelFr || existing.sortOrder !== link.sortOrder || existing.url !== link.url) {
        await prisma.link.update({ where: { id: existing.id }, data });
      }
    } else {
      await prisma.link.create({ data });
    }
  }
  // Cleanup footer links that are no longer in the seed (matched by label+category)
  const seedFooterKeys = footerLinks.map(l => `${l.labelEn}|${l.category}`);
  const footerToRemove = currentFooterLinks.filter(l => !seedFooterKeys.includes(`${l.labelEn}|${l.category}`));
  if (footerToRemove.length > 0) {
    await prisma.link.deleteMany({ where: { id: { in: footerToRemove.map(l => l.id) } } });
  }

  console.log("Database seeded with pages, sections and links (idempotent).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
