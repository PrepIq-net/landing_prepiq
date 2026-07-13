import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAuthorizedSupportCall,
  supportReference,
  unauthorizedResponse,
} from "../auth";

export const dynamic = "force-dynamic";

/**
 * Feature-request board consumed inside the PrepIQ apps: only requests an
 * admin explicitly published (isPublic) appear. `?voter=<email>` marks which
 * entries that user has already voted for — the email is the verified account
 * email attached by the calling app's server, never client input.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedSupportCall(request)) return unauthorizedResponse();

  const voter = request.nextUrl.searchParams.get("voter")?.trim().toLowerCase() ?? null;

  const requests = await prisma.supportRequest.findMany({
    where: {
      type: "FEATURE_REQUEST",
      isPublic: true,
      status: { in: ["NEW", "IN_PROGRESS"] },
    },
    orderBy: [{ votes: { _count: "desc" } }, { createdAt: "desc" }],
    select: {
      id: true,
      refNo: true,
      subject: true,
      message: true,
      status: true,
      createdAt: true,
      _count: { select: { votes: true } },
      votes: voter
        ? { where: { voterEmail: voter }, select: { id: true } }
        : false,
    },
  });

  return Response.json({
    requests: requests.map((r) => ({
      id: r.id,
      reference: supportReference(r.refNo),
      title: r.subject,
      description: r.message,
      status: r.status,
      votes: r._count.votes,
      hasVoted: Array.isArray(r.votes) ? r.votes.length > 0 : false,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}
