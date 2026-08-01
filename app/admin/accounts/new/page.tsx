import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { NewUserForm } from "@/components/admin/tenant/NewUserForm";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type { AdminOrganization, Paginated } from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New User Account — PrepIQ Admin",
};

export default async function NewAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ organization_id?: string }>;
}) {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  const sp = await searchParams;

  let organizations: AdminOrganization[] = [];
  let error: string | null = null;
  try {
    const list = await djangoAdminFetch<Paginated<AdminOrganization>>(
      "/api/mgmt/organizations/?is_active=true&page_size=200",
      session!.user!.email!,
    );
    organizations = list.results ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  if (error) {
    return <BackendUnreachable title="New User Account" error={error} />;
  }

  return (
    <NewUserForm
      organizations={organizations}
      initialOrganizationId={sp.organization_id ?? ""}
    />
  );
}
