import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { SubscriptionPlansManager } from "@/components/admin/SubscriptionPlansManager";
import type {
  AdminCapability,
  AdminPlanListResponse,
} from "@/types/admin-plans";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscription Plans — PrepIQ Admin",
};

export default async function SubscriptionPlansPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  const email = session!.user!.email!;

  let catalog: AdminPlanListResponse | null = null;
  let capabilities: AdminCapability[] = [];
  let error: string | null = null;

  try {
    const [planResponse, capabilityResponse] = await Promise.all([
      djangoAdminFetch<AdminPlanListResponse>(
        "/api/mgmt/subscription-plans/",
        email,
      ),
      djangoAdminFetch<{ results: AdminCapability[] }>(
        "/api/mgmt/capabilities/",
        email,
      ),
    ]);
    catalog = planResponse;
    capabilities = capabilityResponse.results;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load subscription plans";
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Subscription Plans
        </h1>
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-6"
        >
          <p className="text-foreground font-medium">
            Could not reach the PrepIQ backend
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Plans are stored in Django, not in the landing database. Check that{" "}
            <code className="font-mono text-xs">DJANGO_API_URL</code> and{" "}
            <code className="font-mono text-xs">ADMIN_SERVICE_KEY</code> are set
            and that the backend is running.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3 font-mono break-all">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionPlansManager
      plans={catalog?.results ?? []}
      capabilities={capabilities}
      planCategories={catalog?.plan_categories ?? []}
      limitCodes={catalog?.limit_codes ?? []}
    />
  );
}
