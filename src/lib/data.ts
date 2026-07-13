import { prisma } from "@/lib/prisma";

import { unstable_cache } from "next/cache";

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
