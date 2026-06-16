"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { ActionType, EntityType, MeetingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createMeeting(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    company: formData.get("company") as string | null,
    phone: formData.get("phone") as string | null,
    date: new Date(formData.get("date") as string),
    notes: formData.get("notes") as string | null,
  };

  await prisma.meeting.create({
    data,
  });

  revalidatePath("/admin/meetings");
}

export async function updateMeetingStatus(id: string, status: MeetingStatus) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!currentUser) throw new Error("Unauthorized");

  await prisma.meeting.update({
    where: { id },
    data: { status },
  });

  await logActivity(
    currentUser.id,
    ActionType.UPDATE,
    EntityType.MEETING,
    id,
    `Status changed to ${status}`,
  );

  revalidatePath("/admin/meetings");
}

export async function updateMeetingLink(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const id = formData.get('meetingId') as string;
  const link = formData.get('meetingLink') as string;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!currentUser) throw new Error("Unauthorized");

  await prisma.meeting.update({
    where: { id },
    data: { meetingLink: link },
  });

  await logActivity(
    currentUser.id,
    ActionType.UPDATE,
    EntityType.MEETING,
    id,
    "Meeting link updated",
  );

  revalidatePath("/admin/meetings");
}

export async function deleteMeeting(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const id = formData.get('meetingId') as string;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Only admins can delete meetings");
  }

  await prisma.meeting.delete({
    where: { id },
  });

  await logActivity(
    currentUser.id,
    ActionType.DELETE,
    EntityType.MEETING,
    id,
    "Meeting deleted",
  );

  revalidatePath("/admin/meetings");
}
