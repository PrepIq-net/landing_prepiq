import { prisma } from "@/lib/prisma";

import { unstable_cache } from "next/cache";
import { estimateReadMinutes } from "@/types/blog";
import type { BlogPostDetail, BlogPostSummary } from "@/types/blog";

export const getActiveNavLinks = unstable_cache(
  async () => {
    return prisma.link.findMany({
      where: { type: "nav", isActive: true },
      select: {
        id: true,
        labelEn: true,
        labelFr: true,
        url: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  },
  ["nav-links"],
  { tags: ["links"] }
);

export const getActiveFooterLinks = unstable_cache(
  async () => {
    return prisma.link.findMany({
      where: { type: "footer", isActive: true },
      select: {
        id: true,
        labelEn: true,
        labelFr: true,
        url: true,
        category: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  },
  ["footer-links"],
  { tags: ["links"] }
);

/**
 * Published customer testimonials, newest-authored last.
 *
 * Returns an empty array when we have none — TestimonialsSection is written to
 * render an honest "no reviews yet" state rather than authored placeholders,
 * so there is deliberately no fallback here.
 */
export const getPublishedTestimonials = unstable_cache(
  async () => {
    return prisma.testimonial.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        quoteEn: true,
        quoteFr: true,
        name: true,
        role: true,
        company: true,
        metricEn: true,
        metricFr: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["published-testimonials"],
  { tags: ["testimonials"] }
);

export type PublishedTestimonial = Awaited<
  ReturnType<typeof getPublishedTestimonials>
>[number];

// Dates are returned as ISO strings (not Date objects) because unstable_cache
// JSON-serializes cached values — Dates would silently become strings on
// cache hits anyway.
export const getPublishedLegalDocument = unstable_cache(
  async (slug: string) => {
    const doc = await prisma.legalDocument.findFirst({
      where: { slug, isPublished: true },
      select: {
        slug: true,
        titleEn: true,
        titleFr: true,
        bodyEn: true,
        bodyFr: true,
        version: true,
        effectiveDate: true,
        updatedAt: true,
      },
    });
    if (!doc) return null;
    return {
      ...doc,
      effectiveDate: doc.effectiveDate.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  },
  ["legal-doc"],
  { tags: ["legal"] }
);

export const getPublishedLegalDocuments = unstable_cache(
  async () => {
    const docs = await prisma.legalDocument.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        titleEn: true,
        titleFr: true,
        version: true,
        effectiveDate: true,
        updatedAt: true,
      },
      orderBy: { slug: "asc" },
    });
    return docs.map((d) => ({
      ...d,
      effectiveDate: d.effectiveDate.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));
  },
  ["legal-docs-index"],
  { tags: ["legal"] }
);

export const getPageWithSections = unstable_cache(
  async (slug: string) => {
    return prisma.page.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleFr: true,
        metaDescriptionEn: true,
        metaDescriptionFr: true,
        configJson: true,
        sections: {
          where: { isActive: true },
          select: {
            id: true,
            componentType: true,
            contentJson: true,
            styleJson: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  },
  ["page-content"],
  { tags: ["pages", "sections"] }
);

// Published job roles for the public /about careers section, ordered for display.
export const getPublishedJobRoles = unstable_cache(
  async () => {
    return prisma.jobRole.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        titleEn: true,
        titleFr: true,
        department: true,
        location: true,
        employmentType: true,
        summaryEn: true,
        summaryFr: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  },
  ["job-roles"],
  { tags: ["careers"] }
);

export const getPublishedJobRole = unstable_cache(
  async (slug: string) => {
    return prisma.jobRole.findFirst({
      where: { slug, isPublished: true },
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleFr: true,
        department: true,
        location: true,
        employmentType: true,
        summaryEn: true,
        summaryFr: true,
        bodyEn: true,
        bodyFr: true,
      },
    });
  },
  ["job-role"],
  { tags: ["careers"] }
);

/* -------------------------------------------------------------------------- */
/*  Blog                                                                       */
/* -------------------------------------------------------------------------- */

const SUMMARY_SELECT = {
  slug: true,
  titleEn: true,
  titleFr: true,
  excerptEn: true,
  excerptFr: true,
  coverUrl: true,
  coverAlt: true,
  category: true,
  tags: true,
  authorName: true,
  readMinutes: true,
  publishedAt: true,
  // Selected only to estimate reading time when the author hasn't set one.
  bodyEn: true,
} as const;

type SummaryRow = {
  readMinutes: number | null;
  publishedAt: Date | null;
  bodyEn: string;
} & Omit<BlogPostSummary, "readMinutes" | "publishedAt">;

function toSummary({ bodyEn, ...row }: SummaryRow): BlogPostSummary {
  return {
    ...row,
    readMinutes: row.readMinutes ?? estimateReadMinutes(bodyEn),
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
  };
}

export const getPublishedBlogPosts = unstable_cache(
  async (): Promise<BlogPostSummary[]> => {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: SUMMARY_SELECT,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return posts.map(toSummary);
  },
  ["blog-posts"],
  { tags: ["blog"] }
);

export const getFeaturedBlogPosts = unstable_cache(
  async (limit = 3): Promise<BlogPostSummary[]> => {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true, isFeatured: true },
      select: SUMMARY_SELECT,
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      take: limit,
    });

    // A home page with an empty strip looks broken, so fall back to the most
    // recent posts when nothing has been explicitly featured.
    if (posts.length < limit) {
      const filler = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          slug: { notIn: posts.map((p) => p.slug) },
        },
        select: SUMMARY_SELECT,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: limit - posts.length,
      });
      return [...posts, ...filler].map(toSummary);
    }

    return posts.map(toSummary);
  },
  ["blog-featured"],
  { tags: ["blog"] }
);

export const getPublishedBlogPost = unstable_cache(
  async (slug: string): Promise<BlogPostDetail | null> => {
    const post = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
      select: {
        ...SUMMARY_SELECT,
        bodyFr: true,
        authorRole: true,
        authorAvatar: true,
        seoTitle: true,
        seoDescription: true,
        updatedAt: true,
        audioUrlEn: true,
        audioUrlFr: true,
      },
    });
    if (!post) return null;

    const { bodyEn, updatedAt, seoTitle, seoDescription, ...rest } = post;
    return {
      ...toSummary({ ...rest, bodyEn } as SummaryRow),
      bodyEn,
      bodyFr: post.bodyFr,
      authorRole: post.authorRole,
      authorAvatar: post.authorAvatar,
      seoTitle,
      seoDescription,
      updatedAt: updatedAt.toISOString(),
      audioUrlEn: post.audioUrlEn,
      audioUrlFr: post.audioUrlFr,
    } as BlogPostDetail;
  },
  ["blog-post"],
  { tags: ["blog"] }
);

/** Same-category posts first, topped up with recent ones so the strip is full. */
export const getRelatedBlogPosts = unstable_cache(
  async (slug: string, category: string, limit = 3): Promise<BlogPostSummary[]> => {
    const sameCategory = await prisma.blogPost.findMany({
      where: { isPublished: true, category, slug: { not: slug } },
      select: SUMMARY_SELECT,
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
    });

    if (sameCategory.length >= limit) return sameCategory.map(toSummary);

    const filler = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        slug: { notIn: [slug, ...sameCategory.map((p) => p.slug)] },
      },
      select: SUMMARY_SELECT,
      orderBy: [{ publishedAt: "desc" }],
      take: limit - sameCategory.length,
    });

    return [...sameCategory, ...filler].map(toSummary);
  },
  ["blog-related"],
  { tags: ["blog"] }
);
