"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { prisma } from "@/lib/prisma";

async function requireSessionUser() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true },
  });
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function deleteConciergeConversation(id: string) {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") throw new Error("Not authorized");

  const conversation = await prisma.conciergeConversation.delete({
    where: { id },
    select: { refNo: true },
  });

  await logActivity(
    user.id,
    "DELETE",
    "CONCIERGE_CONVERSATION",
    id,
    `Deleted concierge conversation CHAT-${conversation.refNo}`
  );
  revalidatePath("/admin/concierge");
  redirect("/admin/concierge");
}

export async function markConciergeLeadHandled(conversationId: string, handled: boolean) {
  const user = await requireSessionUser();

  const lead = await prisma.conciergeLead.findUnique({
    where: { conversationId },
    select: { id: true, meta: true },
  });
  if (!lead) throw new Error("Lead not found");

  const meta = {
    ...(typeof lead.meta === "object" && lead.meta !== null ? lead.meta : {}),
    handled,
    handledBy: handled ? user.email : null,
    handledAt: handled ? new Date().toISOString() : null,
  };
  await prisma.conciergeLead.update({ where: { id: lead.id }, data: { meta } });

  await logActivity(
    user.id,
    "UPDATE",
    "CONCIERGE_LEAD",
    lead.id,
    handled ? "Marked concierge lead handled" : "Reopened concierge lead"
  );
  revalidatePath(`/admin/concierge/${conversationId}`);
  revalidatePath("/admin/concierge");
  return { success: true };
}
