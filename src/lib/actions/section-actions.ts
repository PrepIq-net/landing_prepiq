"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSection(id: string) {
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) return;

  await prisma.section.update({
    where: { id },
    data: { isActive: !section.isActive },
  });

  revalidatePath("/admin/pages/[id]/sections", "page");
  revalidatePath("/");
}

export async function moveSection(id: string, direction: "up" | "down") {
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) return;

  const otherSection = await prisma.section.findFirst({
    where: {
      pageId: section.pageId,
      sortOrder: direction === "up" ? { lt: section.sortOrder } : { gt: section.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });

  if (!otherSection) return;

  const currentOrder = section.sortOrder;
  await prisma.$transaction([
    prisma.section.update({ where: { id: section.id }, data: { sortOrder: otherSection.sortOrder } }),
    prisma.section.update({ where: { id: otherSection.id }, data: { sortOrder: currentOrder } }),
  ]);

  revalidatePath("/admin/pages/[id]/sections", "page");
  revalidatePath("/");
}

export async function updateSectionContent(id: string, contentJson: string) {
  await prisma.section.update({
    where: { id },
    data: { contentJson },
  });
  revalidatePath("/");
}
