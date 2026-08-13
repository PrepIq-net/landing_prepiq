"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "iconoir-react";
import BlogCard from "@/components/blog/BlogCard";
import { GoldText } from "./GoldText";
import { SeamAccent } from "./motion-primitives";
import { Button } from "@/components/ui/button";
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
    <section className="relative overflow-hidden border-t border-border/50 py-24 md:py-32 section-band">
      <SeamAccent />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-px bg-primary" />
              <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {content.badge}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-[52px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-5 text-balance">
              <GoldText text={content.title} />
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
              {content.subtitle}
            </p>
          </div>

          <Button variant="hero-outline" size="lg" asChild className="group shrink-0">
            <Link href="/blog">
              {content.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </Link>
          </Button>
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
