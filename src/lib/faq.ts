import type { FAQItem, SectionContent } from "@/types/cms";

/**
 * Single source of truth for the homepage FAQ.
 *
 * FAQSection (client) renders from these, and the homepage emits FAQPage
 * JSON-LD from the same items — with the same CMS-override rule — so the
 * structured data can never drift from what visitors actually see.
 *
 * There is deliberately no hardcoded fallback copy: the section and its
 * JSON-LD render only the items authored in the CMS, and are omitted entirely
 * when there are none for the requested language.
 */

type FAQContentLike = {
  items?: FAQItem[];
};

/**
 * The FAQ items actually shown for a language: CMS content only. Empty when
 * the section has no items for that language — callers hide the section and
 * skip the JSON-LD rather than inventing questions.
 */
export function getEffectiveFaqItems(
  dbContent: SectionContent<FAQContentLike> | undefined,
  lang: "en" | "fr",
): FAQItem[] {
  const cmsItems = dbContent?.[lang]?.items;
  if (Array.isArray(cmsItems) && cmsItems.length > 0) {
    return cmsItems;
  }
  return [];
}