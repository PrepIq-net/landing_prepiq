export type Lang = "en" | "fr";

/** Shape shared by the index cards, home teaser and related-post strip. */
export interface BlogPostSummary {
  slug: string;
  titleEn: string;
  titleFr: string | null;
  excerptEn: string;
  excerptFr: string | null;
  coverUrl: string | null;
  coverAlt: string | null;
  category: string;
  tags: string[];
  authorName: string;
  readMinutes: number;
  publishedAt: string | null;
}

export interface BlogPostDetail extends BlogPostSummary {
  bodyEn: string;
  bodyFr: string | null;
  authorRole: string | null;
  authorAvatar: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
}

/**
 * French is optional on every post, so each public surface resolves its copy
 * through here and silently falls back to English.
 */
export function localized(
  lang: Lang,
  en: string,
  fr: string | null | undefined
): string {
  if (lang === "fr" && fr && fr.trim()) return fr;
  return en;
}

const WORDS_PER_MINUTE = 220;

/** Word-count estimate used whenever an author hasn't set readMinutes manually. */
export function estimateReadMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code isn't read at prose speed
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ") // links/images contribute their label only
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
