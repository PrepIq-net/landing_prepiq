import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { UserDetailManager } from "@/components/admin/tenant/UserDetailManager";
import { BackendUnreachable } from "@/components/admin/tenant/shared";
import type { AdminUserBundle, LoginDiagnostics } from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) return { title: "Account — PrepIQ Admin" };
  try {
    const bundle = await djangoAdminFetch<AdminUserBundle>(
      `/api/mgmt/users/${id}/`,
      session.user.email,
    );
    return { title: `${bundle.user.email} — PrepIQ Admin` };
  } catch {
    return { title: "Account — PrepIQ Admin" };
  }
}

export default async function AccountDetailPage({
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

  let bundle: AdminUserBundle | null = null;
  let diagnostics: LoginDiagnostics | null = null;
  let error: string | null = null;

  try {
    // Settled independently: the account page is still worth rendering if only
    // the diagnostics call fails.
    const [detail, diag] = await Promise.allSettled([
      djangoAdminFetch<AdminUserBundle>(
        `/api/mgmt/users/${id}/`,
        session!.user!.email!,
      ),
      djangoAdminFetch<LoginDiagnostics>(
        `/api/mgmt/users/${id}/login-diagnostics/`,
        session!.user!.email!,
      ),
    ]);
    if (detail.status === "rejected") throw detail.reason;
    bundle = detail.value;
    diagnostics = diag.status === "fulfilled" ? diag.value : null;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load";
    if (message.includes("404")) return notFound();
    error = message;
  }

  if (error || !bundle) {
    return <BackendUnreachable title="Account" error={error ?? ""} />;
  }

  return <UserDetailManager bundle={bundle} diagnostics={diagnostics} />;
}
