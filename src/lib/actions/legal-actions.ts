"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "@/lib/revalidate";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { z } from "zod";

const LegalDocumentSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleFr: z.string().min(1, "French title is required"),
  bodyEn: z.string().min(1, "English body is required"),
  bodyFr: z.string().min(1, "French body is required"),
});

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
}

function revalidateLegal(slug: string) {
  revalidateTag("legal");
  revalidatePath("/admin/legal");
  revalidatePath(`/${slug}`);
}

// Minor edit (typo fix, wording tweak): updates the live document in place
// without bumping the version or the effective date.
export async function saveLegalDocument(id: string, formData: FormData) {
  const validated = LegalDocumentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    const doc = await prisma.legalDocument.update({
      where: { id },
      data: validated.data,
    });

    const user = await getSessionUser();
    if (user) {
      await logActivity(
        user.id,
        "UPDATE",
        "LEGAL_DOC",
        doc.id,
        `Saved ${doc.slug} (v${doc.version}, no version bump)`
      );
    }

    revalidateLegal(doc.slug);
    return { success: true, message: `Saved — still version ${doc.version}` };
  } catch (error) {
    console.error("Failed to save legal document:", error);
    return { success: false, message: "Internal error" };
  }
}

// Material change: bumps the version, resets the effective date, and writes
// an immutable snapshot for the compliance trail.
export async function publishLegalDocument(id: string, formData: FormData) {
  const validated = LegalDocumentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    const user = await getSessionUser();
    const effectiveDate = new Date();

    const doc = await prisma.$transaction(async (tx) => {
      const current = await tx.legalDocument.findUniqueOrThrow({
        where: { id },
        select: { version: true },
      });
      const nextVersion = current.version + 1;
      return tx.legalDocument.update({
        where: { id },
        data: {
          ...validated.data,
          version: nextVersion,
          effectiveDate,
          isPublished: true,
          versions: {
            create: {
              version: nextVersion,
              ...validated.data,
              effectiveDate,
              publishedBy: user?.email ?? null,
            },
          },
        },
      });
    });

    if (user) {
      await logActivity(
        user.id,
        "UPDATE",
        "LEGAL_DOC",
        doc.id,
        `Published ${doc.slug} v${doc.version}`
      );
    }

    revalidateLegal(doc.slug);
    return { success: true, message: `Published version ${doc.version}` };
  } catch (error) {
    console.error("Failed to publish legal document:", error);
    return { success: false, message: "Internal error" };
  }
}
