"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Clock, Calendar, NavArrowDown } from "iconoir-react";
import BlogMarkdown, { extractHeadings } from "./BlogMarkdown";
import BlogCard, { formatPostDate } from "./BlogCard";
import ShareBar from "./ShareBar";
import PostAudioPlayer from "./PostAudioPlayer";
import { APP_URL } from "@/lib/constants";
import {
  localized,
  narrationUrl,
  type BlogPostDetail,
  type BlogPostSummary,
  type Lang,
} from "@/types/blog";

/** Thin gold bar showing how far through the article the reader is. */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function useActiveHeading(headings: { id: string }[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const update = () => {
      const threshold = 140;
      let active = headings[0]?.id ?? "";

      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          active = h.id;
        }
      }

      setActiveId(active);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return activeId;
}

/** An outline shorter than this isn't worth a gutter, so the article goes full width. */
const MIN_TOC_HEADINGS = 3;

function DesktopTableOfContents({
  headings,
  activeId,
  label,
}: {
  headings: { id: string; text: string; level: 2 | 3 }[];
  activeId: string;
  label: string;
}) {
  return (
    <nav className="sticky top-28 self-start hidden lg:block">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <ul className="space-y-2.5 border-l border-border/60">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 pl-4 py-1 text-sm leading-snug transition-all duration-200 ${
                activeId === h.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileTableOfContents({
  headings,
  activeId,
  label,
}: {
  headings: { id: string; text: string; level: 2 | 3 }[];
  activeId: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-14 z-30 -mx-6 md:-mx-8 lg:hidden">
      <div className="border-y border-border/50 bg-background px-6 md:px-8">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground"
          aria-expanded={open}
        >
          {label}
          <NavArrowDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <div className="pb-3 space-y-1">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className={`block py-1.5 text-sm leading-snug transition-all duration-200 ${
                  h.level === 3 ? "pl-4" : ""
                } ${
                  activeId === h.id
                    ? "font-medium text-primary border-l-2 border-primary -ml-px pl-3"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostDetailContent({
  post,
  related,
  url,
}: {
  post: BlogPostDetail;
  related: BlogPostSummary[];
  url: string;
}) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as Lang;

  const title = localized(lang, post.titleEn, post.titleFr);
  const excerpt = localized(lang, post.excerptEn, post.excerptFr);
  const body = localized(lang, post.bodyEn, post.bodyFr);
  const audioSrc = narrationUrl(lang, post);

  const headings = useMemo(() => extractHeadings(body), [body]);
  const activeHeading = useActiveHeading(headings);

  // The outline is derived from the body, so switching language can change how
  // many headings there are. The gutter track has to be dropped in the same
  // breath as the outline itself — otherwise the article is left alone in a
  // 220px column and a desktop page suddenly renders at mobile width.
  const hasToc = headings.length >= MIN_TOC_HEADINGS;

  return (
    <>
      <ReadingProgress />

      <article className="section-container max-w-6xl pb-24 pt-28 sm:pt-32">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("blog.backToBlog")}
        </Link>

        {/* Everything from the title down shares one column so the header, the
            cover and the prose all hang off the same left edge; the outline
            rides in the gutter beside them. */}
        <div
          className={`mt-8 ${
            hasToc
              ? "lg:grid lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-14 lg:items-start"
              : ""
          }`}
        >
          {hasToc && (
            <DesktopTableOfContents
              headings={headings}
              activeId={activeHeading}
              label={t("blog.onThisPage")}
            />
          )}

          <div
            className={`mx-auto w-full max-w-[68ch] ${hasToc ? "lg:mx-0" : ""}`}
          >
            <header>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-md border border-primary/20 bg-primary/[0.08] px-2.5 py-1 font-medium uppercase tracking-wider text-primary">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatPostDate(post.publishedAt, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {t("blog.readTime", { minutes: post.readMinutes })}
                </span>
              </div>

              <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-[2.6rem]">
                {title}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border/50 py-5">
                <div className="flex items-center gap-3">
                  {post.authorAvatar ? (
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.08] text-sm font-semibold text-primary">
                      {post.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {post.authorName}
                    </p>
                    {post.authorRole && (
                      <p className="text-xs text-muted-foreground">
                        {post.authorRole}
                      </p>
                    )}
                  </div>
                </div>

                <ShareBar url={url} title={title} />
              </div>
            </header>

            {audioSrc && <PostAudioPlayer key={audioSrc} src={audioSrc} />}

            {post.coverUrl && (
              <div className="mt-10 overflow-hidden rounded-2xl border border-border/60">
                <img
                  src={post.coverUrl}
                  alt={post.coverAlt ?? title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {hasToc && (
              <MobileTableOfContents
                headings={headings}
                activeId={activeHeading}
                label={t("blog.onThisPage")}
              />
            )}

            <div className="mt-12">
              <BlogMarkdown body={body} />
            </div>

            {post.tags.length > 0 && (
              <div className="mt-14 flex flex-wrap gap-2 border-t border-border/50 pt-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Closing CTA — the reason the article exists. */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-6 wash-gold-top sm:p-10">
              <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                {t("blog.cta.title")}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {t("blog.cta.subtitle")}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={APP_URL}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-[#B8962E] sm:py-2.5 sm:px-5"
                >
                  {t("blog.cta.primary")}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/30 hover:text-primary sm:py-2.5 sm:px-5"
                >
                  {t("blog.cta.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border/50 py-20">
          <div className="section-container max-w-6xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {t("blog.keepReading")}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
