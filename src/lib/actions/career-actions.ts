"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "@/lib/revalidate";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Public: job application submission                                         */
/* -------------------------------------------------------------------------- */

const ApplicationSchema = z.object({
  roleId: z.string().min(1),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  resumeUrl: z
    .string()
    .url("Please enter a valid link (starting with http).")
    .max(2000),
  linkedinUrl: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .transform((v) => (v ? v : null)),
  coverNote: z
    .string()
    .max(5000)
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
});

export async function submitJobApplication(formData: FormData) {
  const validated = ApplicationSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const { roleId, ...rest } = validated.data;

  try {
    // Only accept applications against a currently-published role.
    const role = await prisma.jobRole.findFirst({
      where: { id: roleId, isPublished: true },
      select: { id: true },
    });
    if (!role) {
      return { success: false, message: "This role is no longer accepting applications." };
    }

    await prisma.jobApplication.create({
      data: { roleId, ...rest },
    });
    revalidatePath("/admin/careers/applications");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit job application:", error);
    return { success: false, message: "Internal server error" };
  }
}

/* -------------------------------------------------------------------------- */
/*  Admin: role management                                                     */
/* -------------------------------------------------------------------------- */

const RoleSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  titleEn: z.string().min(1, "English title is required"),
  titleFr: z.string().min(1, "French title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
  ]),
  summaryEn: z.string().min(1, "English summary is required"),
  summaryFr: z.string().min(1, "French summary is required"),
  bodyEn: z.string().min(1, "English body is required"),
  bodyFr: z.string().min(1, "French body is required"),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.union([z.literal("on"), z.literal("")]).optional(),
});

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
}

function revalidateCareers(slug?: string) {
  revalidateTag("careers");
  revalidatePath("/admin/careers");
  revalidatePath("/about");
  if (slug) revalidatePath(`/careers/${slug}`);
}

export async function createJobRole(formData: FormData) {
  const validated = RoleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }
  const { isPublished, ...data } = validated.data;

  try {
    const role = await prisma.jobRole.create({
      data: { ...data, isPublished: isPublished === "on" },
    });
    const user = await getSessionUser();
    if (user) {
      await logActivity(user.id, "CREATE", "JOB_ROLE", role.id, `Created role ${role.slug}`);
    }
    revalidateCareers(role.slug);
    return { success: true, id: role.id };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, errors: { slug: ["That slug is already in use"] } };
    }
    console.error("Failed to create job role:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function updateJobRole(id: string, formData: FormData) {
  const validated = RoleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }
  const { isPublished, ...data } = validated.data;

  try {
    const role = await prisma.jobRole.update({
      where: { id },
      data: { ...data, isPublished: isPublished === "on" },
    });
    const user = await getSessionUser();
    if (user) {
      await logActivity(user.id, "UPDATE", "JOB_ROLE", role.id, `Updated role ${role.slug}`);
    }
    revalidateCareers(role.slug);
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, errors: { slug: ["That slug is already in use"] } };
    }
    console.error("Failed to update job role:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function deleteJobRole(id: string) {
  try {
    const role = await prisma.jobRole.delete({ where: { id } });
    const user = await getSessionUser();
    if (user) {
      await logActivity(user.id, "DELETE", "JOB_ROLE", id, `Deleted role ${role.slug}`);
    }
    revalidateCareers(role.slug);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete job role:", error);
    return { success: false, message: "Internal error" };
  }
}

/* -------------------------------------------------------------------------- */
/*  Admin: applications                                                        */
/* -------------------------------------------------------------------------- */

const APPLICATION_STATUSES = [
  "NEW",
  "REVIEWING",
  "INTERVIEWING",
  "OFFER",
  "HIRED",
  "REJECTED",
] as const;

export async function updateApplicationStatus(id: string, status: string) {
  const parsed = z.enum(APPLICATION_STATUSES).safeParse(status);
  if (!parsed.success) return { success: false, message: "Invalid status" };

  try {
    await prisma.jobApplication.update({
      where: { id },
      data: { status: parsed.data },
    });
    revalidatePath("/admin/careers/applications");
    return { success: true };
  } catch (error) {
    console.error("Failed to update application status:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function deleteApplication(id: string) {
  try {
    await prisma.jobApplication.delete({ where: { id } });
    revalidatePath("/admin/careers/applications");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete application:", error);
    return { success: false, message: "Internal error" };
  }
}
