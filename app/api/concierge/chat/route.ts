import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { conciergeChatFetch } from "@/lib/concierge/django";
import { getConciergeKnowledge } from "@/lib/concierge/knowledge";
import {
  MAX_CONVERSATION_MESSAGES,
  clientIpHash,
  isRateLimited,
  rateLimitedResponse,
} from "../guards";

export const dynamic = "force-dynamic";
// conciergeChatFetch below allows the upstream LLM call up to 90s (NVIDIA
// retries can stack). Without this, Vercel's default function duration cuts
// the request off well before that timeout ever fires, which reads to the
// visitor as "AI thinking" forever rather than a clean fallback reply.
export const maxDuration = 100;

// How much history the LLM sees per turn (persisted history can be longer).
const HISTORY_WINDOW = 20;

const ChatSchema = z.object({
  conversationId: z.string().cuid().nullish(),
  visitorId: z.string().min(8).max(64),
  message: z.string().trim().min(1).max(1000),
  locale: z.enum(["en", "fr"]).default("en"),
  path: z.string().max(300).nullish(),
  // Honeypot: real users never fill this hidden field.
  website: z.string().nullish(),
});

const GetSchema = z.object({
  conversationId: z.string().cuid(),
  visitorId: z.string().min(8).max(64),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = ChatSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (parsed.website) {
    // Bot filled the honeypot — pretend everything worked, store nothing.
    return NextResponse.json({ conversationId: null, reply: null, fallback: true });
  }

  const ipHash = clientIpHash(request);
  if (isRateLimited(`${ipHash}:${parsed.visitorId}`)) return rateLimitedResponse();

  let conversation =
    parsed.conversationId != null
      ? await prisma.conciergeConversation.findFirst({
          where: { id: parsed.conversationId, visitorId: parsed.visitorId },
        })
      : null;

  if (conversation && conversation.messageCount >= MAX_CONVERSATION_MESSAGES) {
    return NextResponse.json({ error: "conversation_full" }, { status: 429 });
  }

  if (!conversation) {
    conversation = await prisma.conciergeConversation.create({
      data: {
        visitorId: parsed.visitorId,
        locale: parsed.locale,
        ipHash,
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
        startedPath: parsed.path ?? null,
      },
    });
  }

  await prisma.conciergeMessage.create({
    data: { conversationId: conversation.id, role: "USER", content: parsed.message },
  });

  const history = await prisma.conciergeMessage.findMany({
    where: { conversationId: conversation.id, role: { in: ["USER", "ASSISTANT"] } },
    orderBy: { createdAt: "desc" },
    take: HISTORY_WINDOW,
    select: { role: true, content: true },
  });
  const messages = history
    .reverse()
    .map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

  let reply: string | null = null;
  let meta: Prisma.InputJsonValue | undefined;
  const started = Date.now();
  try {
    const context = await getConciergeKnowledge(parsed.locale);
    const result = await conciergeChatFetch({
      messages,
      context,
      locale: parsed.locale,
    });
    reply = result.reply || null;
    meta = { ...result.meta, latencyMs: Date.now() - started };
  } catch (error) {
    console.error("Concierge chat turn failed:", error);
  }

  if (reply) {
    await prisma.conciergeMessage.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: reply,
        meta,
      },
    });
  }
  await prisma.conciergeConversation.update({
    where: { id: conversation.id },
    data: { messageCount: { increment: reply ? 2 : 1 } },
  });

  return NextResponse.json({
    conversationId: conversation.id,
    reply,
    fallback: reply == null,
  });
}

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = GetSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const conversation = await prisma.conciergeConversation.findFirst({
    where: { id: parsed.data.conversationId, visitorId: parsed.data.visitorId },
    select: {
      id: true,
      messageCount: true,
      lead: { select: { id: true } },
      messages: {
        where: { role: { in: ["USER", "ASSISTANT"] } },
        orderBy: { createdAt: "asc" },
        select: { role: true, content: true, createdAt: true },
      },
    },
  });
  if (!conversation) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    conversationId: conversation.id,
    messageCount: conversation.messageCount,
    hasLead: conversation.lead != null,
    messages: conversation.messages.map((m) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
      createdAt: m.createdAt,
    })),
  });
}
