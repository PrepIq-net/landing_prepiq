"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const LinkSchema = z.object({
  labelEn: z.string().min(1, "English label is required"),
  labelFr: z.string().min(1, "French label is required"),
  url: z.string().min(1, "URL is required"),
  type: z.enum(["nav", "footer"]),
  category: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createLink(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = LinkSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.link.create({ data: validated.data });
    revalidatePath("/admin/links");
    return { success: true };
  } catch (error) {
    console.error("Failed to create link:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function updateLink(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = LinkSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.link.update({ where: { id }, data: validated.data });
    revalidatePath("/admin/links");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function deleteLink(id: string) {
  await prisma.link.delete({ where: { id } });
  revalidatePath("/admin/links");
  revalidatePath("/");
}

export async function toggleLinkActive(id: string) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) return;
  await prisma.link.update({ where: { id }, data: { isActive: !link.isActive } });
  revalidatePath("/admin/links");
  revalidatePath("/");
}
