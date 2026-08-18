import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OpsAlertDetail from "./OpsAlertDetail";

export const dynamic = "force-dynamic";

export default async function OpsAlertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const alert = await prisma.opsAlert.findUnique({ where: { id } });
  if (!alert) notFound();

  return (
    <OpsAlertDetail
      alert={{
        ...alert,
        payload: alert.payload as Record<string, unknown>,
        occurredAt: alert.occurredAt.toISOString(),
        branchLocalTime: alert.branchLocalTime?.toISOString() ?? null,
        createdAt: alert.createdAt.toISOString(),
        updatedAt: alert.updatedAt.toISOString(),
        resolvedAt: alert.resolvedAt?.toISOString() ?? null,
      }}
    />
  );
}
