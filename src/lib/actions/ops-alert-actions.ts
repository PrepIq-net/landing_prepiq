"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import type { OpsAlertStatus } from "@prisma/client";

async function requireSessionUser() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
  if (!user) throw new Error("Not authenticated");
  return user;
}

function revalidateOpsAlerts(id?: string) {
  revalidatePath("/admin/ops-alerts");
  if (id) revalidatePath(`/admin/ops-alerts/${id}`);
}

export async function updateOpsAlertStatus(id: string, status: OpsAlertStatus) {
  const user = await requireSessionUser();

  const alert = await prisma.opsAlert.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
    select: { refNo: true },
  });

  await logActivity(
    user.id,
    "UPDATE",
    "OPS_ALERT",
    id,
    `Set OPS-${alert.refNo} status to ${status}`,
  );
  revalidateOpsAlerts(id);
  return { success: true };
}

export async function updateOpsAlertNotes(id: string, notes: string) {
  const user = await requireSessionUser();

  await prisma.opsAlert.update({
    where: { id },
    data: { adminNotes: notes.trim() === "" ? null : notes },
  });

  await logActivity(user.id, "UPDATE", "OPS_ALERT", id, "Updated internal notes");
  revalidateOpsAlerts(id);
  return { success: true };
}
