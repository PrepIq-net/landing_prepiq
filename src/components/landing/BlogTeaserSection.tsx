"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "iconoir-react";
import BlogCard from "@/components/blog/BlogCard";
import { GoldText } from "./GoldText";
import { SeamAccent } from "./motion-primitives";
import type { SectionContent } from "@/types/cms";
import type { BlogPostSummary } from "@/types/blog";

export interface BlogTeaserContent {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
}

/**
 * Featured-articles strip on the home page. Copy is CMS-managed like every
 * other section, but the posts themselves are injected by the page because the
 * section renderer runs on the client.
 */
const BlogTeaserSection = ({
  dbContent,
  posts = [],
}: {
  dbContent?: SectionContent<BlogTeaserContent>;
  posts?: BlogPostSummary[];
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content = dbContent?.[currentLang];
  // Nothing to show until at least one post is published — the section hides
  // itself rather than rendering an empty grid.
  if (!content || posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-20 md:py-28">
      <SeamAccent />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <span className="mb-5 block text-xs font-medium uppercase tracking-[0.25em] text-primary/80">
              {content.badge}
            </span>
            <h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl md:text-4xl">
              <GoldText text={content.title} />
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {content.subtitle}
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:text-primary"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogTeaserSection;
