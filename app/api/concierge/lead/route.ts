import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { clientIpHash, isRateLimited, rateLimitedResponse } from "../guards";

export const dynamic = "force-dynamic";

const optional = (max: number) =>
  z
    .string()
    .max(max)
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullish();

const LeadSchema = z.object({
  conversationId: z.string().cuid(),
  visitorId: z.string().min(8).max(64),
  email: z.string().trim().email().max(320),
  restaurantName: optional(200),
  location: optional(200),
  role: optional(100),
  phone: optional(50),
  // Honeypot: real users never fill this hidden field.
  website: z.string().nullish(),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = LeadSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (parsed.website) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(`lead:${clientIpHash(request)}:${parsed.visitorId}`)) {
    return rateLimitedResponse();
  }

  const conversation = await prisma.conciergeConversation.findFirst({
    where: { id: parsed.conversationId, visitorId: parsed.visitorId },
    select: { id: true },
  });
  if (!conversation) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const data = {
    email: parsed.email,
    restaurantName: parsed.restaurantName ?? null,
    location: parsed.location ?? null,
    role: parsed.role ?? null,
    phone: parsed.phone ?? null,
  };
  await prisma.conciergeLead.upsert({
    where: { conversationId: conversation.id },
    create: { conversationId: conversation.id, ...data },
    update: data,
  });

  return NextResponse.json({ ok: true });
}
