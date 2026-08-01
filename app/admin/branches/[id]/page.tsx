import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { BranchDetailManager } from "@/components/admin/tenant/BranchDetailManager";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type { AdminBranchBundle, ChoiceOption } from "@/types/admin-tenants";
import type { AdminPlanListResponse } from "@/types/admin-plans";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) return { title: "Branch — PrepIQ Admin" };
  try {
    const bundle = await djangoAdminFetch<AdminBranchBundle>(
      `/api/mgmt/organizations/branches/${id}/`,
      session.user.email,
    );
    return { title: `${bundle.branch.name} — PrepIQ Admin` };
  } catch {
    return { title: "Branch — PrepIQ Admin" };
  }
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  const email = session!.user!.email!;

  let bundle: AdminBranchBundle | null = null;
  let days: ChoiceOption[] = [];
  let plans: AdminPlanListResponse["results"] = [];
  let error: string | null = null;

  try {
    const [detail, hours, catalog] = await Promise.all([
      djangoAdminFetch<AdminBranchBundle>(
        `/api/mgmt/organizations/branches/${id}/`,
        email,
      ),
      // The day list comes from the backend's own choices so the hours editor
      // can never drift out of order with what OperatingHours accepts.
      djangoAdminFetch<{ days: ChoiceOption[] }>(
        `/api/mgmt/organizations/branches/${id}/operating-hours/`,
        email,
      ),
      djangoAdminFetch<AdminPlanListResponse>(
        "/api/mgmt/subscription-plans/",
        email,
      ),
    ]);
    bundle = detail;
    days = hours.days ?? [];
    plans = catalog.results ?? [];
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load";
    if (message.includes("404")) return notFound();
    error = message;
  }

  if (error || !bundle) {
    return <BackendUnreachable title="Branch" error={error ?? ""} />;
  }

  return <BranchDetailManager bundle={bundle} days={days} plans={plans} />;
}
