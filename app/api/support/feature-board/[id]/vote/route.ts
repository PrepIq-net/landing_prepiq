import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthorizedSupportCall, unauthorizedResponse } from "../../../auth";

export const dynamic = "force-dynamic";

const VoteSchema = z.object({
  voterEmail: z.string().trim().email().max(320),
  voterName: z.string().trim().max(200).nullish(),
});

/** Toggle the caller's vote on a published feature request. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedSupportCall(request)) return unauthorizedResponse();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  const parsed = VoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid vote payload" }, { status: 400 });
  }

  const voterEmail = parsed.data.voterEmail.toLowerCase();

  const featureRequest = await prisma.supportRequest.findFirst({
    where: { id, type: "FEATURE_REQUEST", isPublic: true },
    select: { id: true },
  });
  if (!featureRequest) {
    return Response.json({ error: "Feature request not found" }, { status: 404 });
  }

  const existing = await prisma.supportVote.findUnique({
    where: { requestId_voterEmail: { requestId: id, voterEmail } },
  });

  let voted: boolean;
  if (existing) {
    await prisma.supportVote.delete({ where: { id: existing.id } });
    voted = false;
  } else {
    await prisma.supportVote.create({
      data: { requestId: id, voterEmail, voterName: parsed.data.voterName ?? null },
    });
    voted = true;
  }

  const votes = await prisma.supportVote.count({ where: { requestId: id } });
  return Response.json({ votes, voted });
}
