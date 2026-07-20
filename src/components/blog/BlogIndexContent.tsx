"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock } from "iconoir-react";
import BlogCard, { formatPostDate } from "./BlogCard";
import { GoldText } from "@/components/landing/GoldText";
import { localized, type BlogPostSummary, type Lang } from "@/types/blog";

const ALL = "__all__";

export default function BlogIndexContent({
  posts,
}: {
  posts: BlogPostSummary[];
}) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as Lang;
  const [category, setCategory] = useState<string>(ALL);

  const categories = useMemo(
    () => [...new Set(posts.map((p) => p.category))].sort(),
    [posts]
  );

  // The newest post anchors the page; the filter applies to the grid below it
  // so the lead article doesn't disappear when a category is selected.
  const [lead, ...rest] = posts;

  const filtered = useMemo(
    () => (category === ALL ? rest : rest.filter((p) => p.category === category)),
    [rest, category]
  );

  return (
    <main className="section-container max-w-6xl py-28 sm:py-32">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-2xl"
      >
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary/80">
          {t("blog.eyebrow")}
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          <GoldText text={t("blog.title")} />
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("blog.subtitle")}
        </p>
      </motion.header>

      {posts.length === 0 ? (
        <p className="mt-20 text-sm text-muted-foreground">{t("blog.empty")}</p>
      ) : (
        <>
          {/* Lead article — horizontal on desktop so it reads as the headline. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="mt-14"
          >
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-200 hover:border-primary/30 hover:bg-card md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]">
                {lead.coverUrl ? (
                  <img
                    src={lead.coverUrl}
                    alt={lead.coverAlt ?? localized(lang, lead.titleEn, lead.titleFr)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-card pattern-grid" />
                )}
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-md border border-primary/20 bg-primary/[0.08] px-2.5 py-1 font-medium uppercase tracking-wider text-primary">
                    {t("blog.latest")}
                  </span>
                  <span>{formatPostDate(lead.publishedAt, lang)}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t("blog.readTime", { minutes: lead.readMinutes })}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-3xl">
                  {localized(lang, lead.titleEn, lead.titleFr)}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {localized(lang, lead.excerptEn, lead.excerptFr)}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {t("blog.readArticle")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>

          {rest.length > 0 && (
            <>
              {categories.length > 1 && (
                <div className="mt-16 flex flex-wrap items-center gap-2 border-b border-border/50 pb-5">
                  {[ALL, ...categories].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                        category === c
                          ? "border border-primary/20 bg-primary/[0.08] text-primary"
                          : "border border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {c === ALL ? t("blog.allTopics") : c}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.min(i, 5) * 0.05,
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="mt-10 text-sm text-muted-foreground">
                  {t("blog.emptyCategory")}
                </p>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
