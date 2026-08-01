import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { ManualPaymentsManager } from "@/components/admin/tenant/ManualPaymentsManager";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type {
  ManualPaymentQueue,
  PaymentInstruction,
} from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Offline Payments — PrepIQ Admin",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["search", "status", "organization_id", "page"]) {
    if (sp[key]) params.set(key, sp[key]!);
  }
  // Default the queue to what needs a decision. An admin opening this page is
  // almost always here to review, not to browse history.
  if (!sp.status) params.set("status", "PENDING");
  const qs = params.toString() ? `?${params}` : "";

  let queue: ManualPaymentQueue | null = null;
  let instructions: PaymentInstruction[] = [];
  let error: string | null = null;

  try {
    const [queueResponse, instructionResponse] = await Promise.all([
      djangoAdminFetch<ManualPaymentQueue>(
        `/api/mgmt/manual-payments/${qs}`,
        session!.user!.email!,
      ),
      djangoAdminFetch<{ results: PaymentInstruction[] }>(
        "/api/mgmt/payment-instructions/",
        session!.user!.email!,
      ),
    ]);
    queue = queueResponse;
    instructions = instructionResponse.results ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load payments";
  }

  if (error || !queue) {
    return <BackendUnreachable title="Offline Payments" error={error ?? ""} />;
  }

  return <ManualPaymentsManager queue={queue} instructions={instructions} />;
}
