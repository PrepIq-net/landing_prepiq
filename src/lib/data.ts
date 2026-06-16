import { prisma } from "@/lib/prisma";

export async function getActiveNavLinks() {
  return prisma.link.findMany({
    where: { type: "nav", isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveFooterLinks() {
  return prisma.link.findMany({
    where: { type: "footer", isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPageWithSections(slug: string) {
  return prisma.page.findUnique({
    where: { slug, isActive: true },
    include: {
      sections: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}
