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
