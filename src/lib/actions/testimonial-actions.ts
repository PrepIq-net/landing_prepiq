"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "@/lib/revalidate";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { z } from "zod";

const TestimonialSchema = z.object({
  quoteEn: z.string().min(1, "The quote is required"),
  quoteFr: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  metricEn: z.string().optional(),
  metricFr: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  // Checkbox inputs are absent from the FormData when unchecked.
  isPublished: z
    .union([z.literal("on"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
});

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
}

/** Blank optional text fields are stored as NULL, not "". */
function normalize(data: z.infer<typeof TestimonialSchema>) {
  const blankToNull = (v?: string) => (v && v.trim() ? v.trim() : null);
  return {
    ...data,
    quoteFr: blankToNull(data.quoteFr),
    metricEn: blankToNull(data.metricEn),
    metricFr: blankToNull(data.metricFr),
  };
}

function revalidateTestimonials() {
  revalidateTag("testimonials");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const validated = TestimonialSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    const created = await prisma.testimonial.create({
      data: normalize(validated.data),
    });

    const user = await getSessionUser();
    if (user) {
      await logActivity(
        user.id,
        "CREATE",
        "TESTIMONIAL",
        created.id,
        `Added testimonial from ${created.name} (${created.company})`
      );
    }

    revalidateTestimonials();
    return { success: true, id: created.id };
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const validated = TestimonialSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: normalize(validated.data),
    });

    const user = await getSessionUser();
    if (user) {
      await logActivity(
        user.id,
        "UPDATE",
        "TESTIMONIAL",
        id,
        `Updated testimonial from ${updated.name} (${updated.company})`
      );
    }

    revalidateTestimonials();
    return { success: true };
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function toggleTestimonialPublished(id: string) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return;

  await prisma.testimonial.update({
    where: { id },
    data: { isPublished: !testimonial.isPublished },
  });

  const user = await getSessionUser();
  if (user) {
    await logActivity(
      user.id,
      testimonial.isPublished ? "DEACTIVATE" : "ACTIVATE",
      "TESTIMONIAL",
      id,
      `${testimonial.isPublished ? "Unpublished" : "Published"} testimonial from ${testimonial.name}`
    );
  }

  revalidateTestimonials();
}

export async function deleteTestimonial(id: string) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return;

  await prisma.testimonial.delete({ where: { id } });

  const user = await getSessionUser();
  if (user) {
    await logActivity(
      user.id,
      "DELETE",
      "TESTIMONIAL",
      id,
      `Deleted testimonial from ${testimonial.name} (${testimonial.company})`
    );
  }

  revalidateTestimonials();
}
