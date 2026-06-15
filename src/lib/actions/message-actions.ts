"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsRead(id: string) {
  await prisma.contactMessage.update({
    where: { id },
    data: { status: "read" },
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({
    where: { id },
  });
  revalidatePath("/admin/messages");
}
