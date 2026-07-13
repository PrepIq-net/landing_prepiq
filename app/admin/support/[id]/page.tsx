import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RequestDetail from "./RequestDetail";

export const dynamic = "force-dynamic";

export default async function SupportRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.supportRequest.findUnique({
    where: { id },
    include: {
      attachments: { orderBy: { createdAt: "asc" } },
      _count: { select: { votes: true } },
    },
  });

  if (!request) notFound();

  return (
    <RequestDetail
      request={{
        ...request,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
        resolvedAt: request.resolvedAt?.toISOString() ?? null,
        attachments: request.attachments.map((a) => ({
          ...a,
          createdAt: a.createdAt.toISOString(),
        })),
        voteCount: request._count.votes,
      }}
    />
  );
}
