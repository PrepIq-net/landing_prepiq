/**
 * Copy for the home page's featured-articles strip.
 *
 * Shared because seedPages.ts owns home page composition (and deletes any
 * section missing from its list), while seedBlog.ts needs to create the same
 * section when it runs on its own.
 */
export const BLOG_TEASER = {
  en: {
    badge: "From the journal",
    title: "What we're learning from <gold>real kitchens</gold>",
    subtitle:
      "Practical writing on food waste, daily prep and forecasting — for the people who actually run service.",
    cta: "Read the blog",
  },
  fr: {
    badge: "Du journal",
    title: "Ce que nous apprenons des <gold>vraies cuisines</gold>",
    subtitle:
      "Des articles pratiques sur le gaspillage, la préparation quotidienne et la prévision — pour celles et ceux qui font le service.",
    cta: "Lire le blog",
  },
};
