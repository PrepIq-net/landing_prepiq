import { notFound } from "next/navigation";
import Link from "next/link";
import { Google, Plus, User as UserIcon } from "iconoir-react";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TenantFilters,
  TenantPagination,
} from "@/components/admin/tenant/TenantFilters";
import {
  BackendUnreachable,
  DrillLink,
  EmptyState,
  PageHeader,
  StatusPill,
  formatDate,
} from "@/components/admin/tenant/shared";
import type { AdminUser, Paginated } from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "User Accounts — PrepIQ Admin",
};

const PAGE_SIZE = 25;

export default async function AccountsPage({
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
  for (const key of [
    "search",
    "organization_id",
    "is_verified",
    "is_deleted",
    "is_suspended",
    "google_linked",
    "orphaned",
    "page",
  ]) {
    if (sp[key]) params.set(key, sp[key]!);
  }
  const qs = params.toString() ? `?${params}` : "";

  let data: Paginated<AdminUser> | null = null;
  let error: string | null = null;
  try {
    data = await djangoAdminFetch<Paginated<AdminUser>>(
      `/api/mgmt/users/${qs}`,
      session!.user!.email!,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load accounts";
  }

  if (error || !data) {
    return <BackendUnreachable title="User Accounts" error={error ?? ""} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Accounts"
        description="Everyone who has ever signed up, including suspended and deleted accounts — those are the ones support gets asked about. Open a record for login troubleshooting, security actions, and read-only impersonation."
        actions={
          <Link
            href="/admin/accounts/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" />
            New account
          </Link>
        }
      />

      <TenantFilters
        placeholder="Search by email, name, or phone…"
        filters={[
          {
            name: "is_verified",
            label: "Verification",
            options: [
              { value: "false", label: "Unverified" },
              { value: "true", label: "Verified" },
            ],
          },
          {
            name: "is_suspended",
            label: "Suspension",
            options: [
              { value: "true", label: "Suspended" },
              { value: "false", label: "Not suspended" },
            ],
          },
          {
            name: "is_deleted",
            label: "Deletion",
            options: [
              { value: "true", label: "Deleted" },
              { value: "false", label: "Live" },
            ],
          },
          {
            name: "orphaned",
            label: "Onboarding",
            options: [{ value: "true", label: "No organization" }],
          },
        ]}
      />

      {data.results.length === 0 ? (
        <EmptyState
          title="No accounts match those filters"
          hint="Clear the filters to see everyone."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Organizations</TableHead>
                <TableHead>Sign-in</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <DrillLink href={`/admin/accounts/${user.id}`}>
                          {user.full_name || user.email}
                        </DrillLink>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.organizations.length === 0 ? (
                      <StatusPill tone="warning">No organization</StatusPill>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {user.organizations.slice(0, 2).map((org) => (
                          <StatusPill key={org.id} tone="neutral">
                            {org.name}
                            {org.role ? ` · ${org.role}` : ""}
                          </StatusPill>
                        ))}
                        {user.organizations.length > 2 && (
                          <StatusPill tone="neutral">
                            +{user.organizations.length - 2}
                          </StatusPill>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.google_linked ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Google className="h-3.5 w-3.5" />
                        Google
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Password
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {user.is_deleted ? (
                        <StatusPill tone="critical">Deleted</StatusPill>
                      ) : user.is_suspended ? (
                        <StatusPill tone="critical">Suspended</StatusPill>
                      ) : (
                        <StatusPill tone="success">Active</StatusPill>
                      )}
                      {!user.is_verified && !user.is_deleted && (
                        <StatusPill tone="warning">Unverified</StatusPill>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(user.last_login)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(user.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TenantPagination count={data.count} pageSize={PAGE_SIZE} />
    </div>
  );
}
