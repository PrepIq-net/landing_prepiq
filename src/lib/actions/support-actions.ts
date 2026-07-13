"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { destroySupportAttachment } from "@/lib/cloudinary";
import type {
  SupportPriority,
  SupportRequestStatus,
} from "@prisma/client";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
}

async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

function revalidateSupport(id?: string) {
  revalidatePath("/admin/support");
  if (id) revalidatePath(`/admin/support/${id}`);
}

export async function updateSupportRequestStatus(
  id: string,
  status: SupportRequestStatus
) {
  const user = await requireSessionUser();

  const request = await prisma.supportRequest.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "RESOLVED" || status === "CLOSED" ? new Date() : null,
    },
    select: { refNo: true },
  });

  await logActivity(
    user.id,
    "UPDATE",
    "SUPPORT_REQUEST",
    id,
    `Set PIQ-${request.refNo} status to ${status}`
  );
  revalidateSupport(id);
  return { success: true };
}

export async function updateSupportRequestPriority(
  id: string,
  priority: SupportPriority
) {
  const user = await requireSessionUser();

  const request = await prisma.supportRequest.update({
    where: { id },
    data: { priority },
    select: { refNo: true },
  });

  await logActivity(
    user.id,
    "UPDATE",
    "SUPPORT_REQUEST",
    id,
    `Set PIQ-${request.refNo} priority to ${priority}`
  );
  revalidateSupport(id);
  return { success: true };
}

export async function updateSupportRequestNotes(id: string, notes: string) {
  const user = await requireSessionUser();

  await prisma.supportRequest.update({
    where: { id },
    data: { adminNotes: notes.trim() === "" ? null : notes },
  });

  await logActivity(user.id, "UPDATE", "SUPPORT_REQUEST", id, "Updated internal notes");
  revalidateSupport(id);
  return { success: true };
}

/** Publish/unpublish a feature request on the in-app voting board. */
export async function setSupportRequestPublic(id: string, isPublic: boolean) {
  const user = await requireSessionUser();

  const request = await prisma.supportRequest.update({
    where: { id },
    data: { isPublic },
    select: { refNo: true, type: true },
  });

  await logActivity(
    user.id,
    "UPDATE",
    "SUPPORT_REQUEST",
    id,
    `${isPublic ? "Published" : "Unpublished"} PIQ-${request.refNo} on the feature board`
  );
  revalidateSupport(id);
  return { success: true };
}

/**
 * Deletes the attachment record AND its Cloudinary asset — cloud first, so a
 * failure never leaves an orphaned file we no longer have a pointer to.
 */
export async function deleteSupportAttachmentAction(attachmentId: string) {
  const user = await requireSessionUser();

  const attachment = await prisma.supportAttachment.findUnique({
    where: { id: attachmentId },
    select: { id: true, publicId: true, resourceType: true, filename: true, requestId: true },
  });
  if (!attachment) return { success: false, error: "Attachment not found" };

  try {
    await destroySupportAttachment(attachment.publicId, attachment.resourceType);
  } catch (error) {
    console.error("[support] cloudinary destroy failed", error);
    return { success: false, error: "Could not delete the file from Cloudinary" };
  }

  await prisma.supportAttachment.delete({ where: { id: attachmentId } });

  await logActivity(
    user.id,
    "DELETE",
    "SUPPORT_REQUEST",
    attachment.requestId,
    `Deleted attachment "${attachment.filename}" (cloud asset removed)`
  );
  revalidateSupport(attachment.requestId);
  return { success: true };
}

/** Deletes the whole request, removing every Cloudinary asset first. */
export async function deleteSupportRequestAction(id: string) {
  const user = await requireSessionUser();

  const request = await prisma.supportRequest.findUnique({
    where: { id },
    select: {
      refNo: true,
      subject: true,
      attachments: { select: { publicId: true, resourceType: true } },
    },
  });
  if (!request) return { success: false, error: "Request not found" };

  const results = await Promise.allSettled(
    request.attachments.map((a) =>
      destroySupportAttachment(a.publicId, a.resourceType)
    )
  );
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error("[support] cloudinary destroy failed for request", id, failed);
    return {
      success: false,
      error: "Some attachments could not be deleted from Cloudinary — request kept",
    };
  }

  await prisma.supportRequest.delete({ where: { id } });

  await logActivity(
    user.id,
    "DELETE",
    "SUPPORT_REQUEST",
    id,
    `Deleted PIQ-${request.refNo} "${request.subject}"`
  );
  revalidateSupport();
  return { success: true };
}
