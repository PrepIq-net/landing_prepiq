"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { ActionType, EntityType, DemoStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createDemoBooking(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    company: formData.get("company") as string | null,
    phone: formData.get("phone") as string | null,
    date: new Date(formData.get("date") as string),
    notes: formData.get("notes") as string | null,
  };

  const booking = await prisma.demoBooking.create({
    data,
  });

  revalidatePath("/admin/demos");
  return { success: true };
}

export async function updateDemoBookingStatus(id: string, status: DemoStatus) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!currentUser) throw new Error("Unauthorized");

  const booking = await prisma.demoBooking.update({
    where: { id },
    data: { status },
  });

  await logActivity(
    currentUser.id,
    ActionType.UPDATE,
    EntityType.DEMO,
    id,
    `Status changed to ${status}`,
  );

  revalidatePath("/admin/demos");
  return { success: true };
}

export async function deleteDemoBooking(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Only admins can delete bookings");
  }

  await prisma.demoBooking.delete({
    where: { id },
  });

  await logActivity(
    currentUser.id,
    ActionType.DELETE,
    EntityType.DEMO,
    id,
    "Demo booking deleted",
  );

  revalidatePath("/admin/demos");
  return { success: true };
}
