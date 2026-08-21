import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { SuppressedEmailsManager } from "@/components/admin/tenant/SuppressedEmailsManager";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type { SuppressedEmailList } from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Email Deliverability — PrepIQ Admin",
};

export default async function SuppressedEmailsPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  let list: SuppressedEmailList | null = null;
  let error: string | null = null;
  try {
    // page_size high enough that the common case (a handful of bad
    // addresses) never needs a second page — this list is meant to stay
    // short; a branch's real audience shouldn't be bouncing routinely.
    list = await djangoAdminFetch<SuppressedEmailList>(
      "/api/mgmt/suppressed-emails/?page_size=200",
      session!.user!.email!,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load the suppression list";
  }

  if (error || !list) {
    return <BackendUnreachable title="Email Deliverability" error={error ?? ""} />;
  }

  return <SuppressedEmailsManager emails={list.results} />;
}
