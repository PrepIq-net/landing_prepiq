import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { OrganizationDetailManager } from "@/components/admin/tenant/OrganizationDetailManager";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type {
  AdminOrganizationBundle,
  ChoiceOption,
  Paginated,
  AdminOrganization,
} from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) return { title: "Organization — PrepIQ Admin" };
  try {
    const bundle = await djangoAdminFetch<AdminOrganizationBundle>(
      `/api/mgmt/organizations/${id}/`,
      session.user.email,
    );
    return { title: `${bundle.organization.name} — PrepIQ Admin` };
  } catch {
    return { title: "Organization — PrepIQ Admin" };
  }
}

export default async function OrganizationDetailPage({
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

  let bundle: AdminOrganizationBundle | null = null;
  let industryTypes: ChoiceOption[] = [];
  let error: string | null = null;

  try {
    // The list endpoint is the source of the industry choice list, so the edit
    // form never hardcodes options the backend owns.
    const [detail, list] = await Promise.all([
      djangoAdminFetch<AdminOrganizationBundle>(
        `/api/mgmt/organizations/${id}/`,
        email,
      ),
      djangoAdminFetch<Paginated<AdminOrganization> & { industry_types: ChoiceOption[] }>(
        "/api/mgmt/organizations/?page_size=1",
        email,
      ),
    ]);
    bundle = detail;
    industryTypes = list.industry_types ?? [];
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load";
    if (message.includes("404")) return notFound();
    error = message;
  }

  if (error || !bundle) {
    return <BackendUnreachable title="Organization" error={error ?? ""} />;
  }

  return (
    <OrganizationDetailManager bundle={bundle} industryTypes={industryTypes} />
  );
}
