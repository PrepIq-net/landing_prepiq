"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PageSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  titleEn: z.string().min(1, "English title is required"),
  titleFr: z.string().min(1, "French title is required"),
  metaDescriptionEn: z.string().optional(),
  metaDescriptionFr: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createPage(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = PageSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.page.create({ data: validated.data });
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (error) {
    console.error("Failed to create page:", error);
    return { success: false, message: "Slug already exists or internal error" };
  }
}

export async function updatePage(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = PageSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.page.update({ where: { id }, data: validated.data });
    revalidatePath("/admin/pages");
    revalidatePath(`/${validated.data.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update page:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function deletePage(id: string) {
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
}

export async function togglePageActive(id: string) {
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return;
  await prisma.page.update({ where: { id }, data: { isActive: !page.isActive } });
  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
}
