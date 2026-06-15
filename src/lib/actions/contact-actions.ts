"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  locations: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, message } = validated.data;

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        status: "unread",
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return { success: false, message: "Internal server error" };
  }
}
