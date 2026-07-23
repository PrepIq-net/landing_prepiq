/**
 * Server-only knowledge assembly for the PrepIQ Concierge.
 * Import only from Route Handlers / Server Components.
 */
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { PRODUCT_FACTS } from "./product-facts";

// The backend serializer caps context at 20k chars; leave headroom.
const MAX_KNOWLEDGE_CHARS = 18000;

type Locale = "en" | "fr";

type SectionRow = { componentType: string; contentJson: unknown };

/** Pick the locale branch of a CMS contentJson blob ({en: {...}, fr: {...}}). */
function localeContent(contentJson: unknown, locale: Locale): unknown {
  if (!contentJson || typeof contentJson !== "object") return null;
  const record = contentJson as Record<string, unknown>;
  return record[locale] ?? record.en ?? null;
}

/**
 * Generic flatten: collect leaf strings from a contentJson subtree. Skips
 * short UI chrome (button labels etc.) by dropping strings under 30 chars.
 */
function flattenText(value: unknown, out: string[], depth = 0): void {
  if (depth > 6 || out.length > 120) return;
  if (typeof value === "string") {
    const text = value.replace(/<[^>]+>/g, "").trim();
    if (text.length >= 30) out.push(text);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenText(item, out, depth + 1);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) flattenText(item, out, depth + 1);
  }
}

function renderFaq(sections: SectionRow[], locale: Locale): string {
  const faq = sections.find((s) => s.componentType === "FAQSection");
  const content = localeContent(faq?.contentJson, locale) as
    | { items?: { q?: string; a?: string }[] }
    | null;
  const items = content?.items ?? [];
  if (!items.length) return "";
  const lines = items
    .filter((item) => item.q && item.a)
    .map((item) => `Q: ${item.q}\nA: ${item.a}`);
  return `## Frequently asked questions\n${lines.join("\n\n")}`;
}

function renderPlanFeatures(sections: SectionRow[], locale: Locale): string {
  const pricing = sections.find((s) => s.componentType === "PricingSection");
  const content = localeContent(pricing?.contentJson, locale) as {
    plans?: Record<string, { name?: string; tagline?: string; features?: string[] }>;
  } | null;
  const plans = content?.plans;
  if (!plans) return "";
  const lines = Object.values(plans)
    .filter((plan) => plan?.name)
    .map(
      (plan) =>
        `${plan.name} (${plan.tagline ?? ""}): ${(plan.features ?? []).join("; ")}`
    );
  return `## Plan features (see pricing above for exact prices)\n${lines.join("\n")}`;
}

function renderGeneralCopy(sections: SectionRow[], locale: Locale): string {
  const skip = new Set(["FAQSection", "PricingSection", "TestimonialsSection"]);
  const texts: string[] = [];
  for (const section of sections) {
    if (skip.has(section.componentType)) continue;
    flattenText(localeContent(section.contentJson, locale), texts);
  }
  if (!texts.length) return "";
  return `## From the PrepIQ website\n${[...new Set(texts)].join("\n")}`;
}

async function buildKnowledge(locale: Locale): Promise<string> {
  const [pages, posts] = await Promise.all([
    prisma.page.findMany({
      where: { slug: { in: ["home", "pricing", "how-it-works"] }, isActive: true },
      select: {
        sections: {
          where: { isActive: true },
          select: { componentType: true, contentJson: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 15,
      select: { titleEn: true, titleFr: true, excerptEn: true, excerptFr: true, slug: true },
    }),
  ]);
  const sections = pages.flatMap((page) => page.sections);

  const blog = posts.length
    ? `## Articles on the PrepIQ blog (recommend with their link when relevant)\n${posts
        .map((post) => {
          const title = (locale === "fr" && post.titleFr) || post.titleEn;
          const excerpt =
            ((locale === "fr" && post.excerptFr) || post.excerptEn || "").trim();
          return `- "${title}" — ${excerpt} (link: /blog/${post.slug})`;
        })
        .join("\n")}`
    : "";

  // Ordered by importance: exact facts/pricing first so truncation, if it
  // ever happens, only costs the loosest marketing copy.
  const parts = [
    PRODUCT_FACTS,
    renderFaq(sections, locale),
    renderPlanFeatures(sections, locale),
    blog,
    renderGeneralCopy(sections, locale),
  ].filter(Boolean);

  return parts.join("\n\n").slice(0, MAX_KNOWLEDGE_CHARS);
}

export const getConciergeKnowledge = unstable_cache(
  async (locale: Locale) => buildKnowledge(locale),
  ["concierge-knowledge"],
  { revalidate: 300, tags: ["concierge-knowledge", "pages", "sections", "blog"] }
);
