"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Clock } from "iconoir-react";
import { localized, type BlogPostSummary, type Lang } from "@/types/blog";

export function formatPostDate(iso: string | null, lang: Lang): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Neutral placeholder so a post without a cover still reads as intentional.
 * Deliberately wordless apart from the mark — the category badge already sits
 * on top of it.
 */
function CoverFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-card pattern-grid">
      <span className="font-display text-2xl font-black uppercase tracking-tight text-foreground/[0.07]">
        PrepIQ
      </span>
    </div>
  );
}

export default function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPostSummary;
  featured?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as Lang;

  const title = localized(lang, post.titleEn, post.titleFr);
  const excerpt = localized(lang, post.excerptEn, post.excerptFr);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:bg-card"
    >
      <div
        className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[3/2]"}`}
      >
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.coverAlt ?? title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ filter: "saturate(0.92) brightness(0.96)" }}
          />
        ) : (
          <CoverFallback />
        )}
        {post.coverUrl && (
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, hsl(240 7% 8% / 0.5) 100%)",
            }}
          />
        )}
        <span className="absolute left-4 top-4 rounded-md border border-primary/20 bg-primary/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <span>{formatPostDate(post.publishedAt, lang)}</span>
          <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {t("blog.readTime", { minutes: post.readMinutes })}
          </span>
        </div>

        <h3
          className={`break-words font-display font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary ${
            featured ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary/80 transition-colors duration-200 group-hover:text-primary">
          {t("blog.readArticle")}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
