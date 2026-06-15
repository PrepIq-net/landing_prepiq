"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SectionSchema = z.object({
  componentType: z.string().min(1, "Component type is required"),
  titleEn: z.string().optional(),
  titleFr: z.string().optional(),
  contentJson: z.string().default("{}"),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createSection(pageId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = SectionSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.section.create({ data: { ...validated.data, pageId } });
    revalidatePath("/admin/pages/[id]/sections", "page");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create section:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function updateSection(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = SectionSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.section.update({ where: { id }, data: validated.data });
    revalidatePath("/admin/pages/[id]/sections", "page");
    revalidatePath("/admin/pages/[id]/sections/[sectionId]", "page");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update section:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function deleteSection(id: string) {
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) return;
  await prisma.section.delete({ where: { id } });
  revalidatePath("/admin/pages/[id]/sections", "page");
  revalidatePath("/");
}

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
