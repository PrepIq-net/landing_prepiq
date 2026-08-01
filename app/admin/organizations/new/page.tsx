import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { NewOrganizationForm } from "@/components/admin/tenant/NewOrganizationForm";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type {
  AdminOrganization,
  ChoiceOption,
  Paginated,
} from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Organization — PrepIQ Admin",
};

export default async function NewOrganizationPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  let industryTypes: ChoiceOption[] = [];
  let error: string | null = null;
  try {
    const list = await djangoAdminFetch<
      Paginated<AdminOrganization> & { industry_types: ChoiceOption[] }
    >("/api/mgmt/organizations/?page_size=1", session!.user!.email!);
    industryTypes = list.industry_types ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  if (error) {
    return <BackendUnreachable title="New Organization" error={error} />;
  }

  return <NewOrganizationForm industryTypes={industryTypes} />;
}
