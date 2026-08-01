import { notFound } from "next/navigation";
import Link from "next/link";
import { Building, CheckCircle, Plus, WarningTriangle } from "iconoir-react";

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
import type {
  AdminOrganization,
  ChoiceOption,
  Paginated,
} from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Organizations — PrepIQ Admin",
};

const PAGE_SIZE = 25;

type OrgListResponse = Paginated<AdminOrganization> & {
  industry_types: ChoiceOption[];
};

export default async function OrganizationsPage({
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
    "is_active",
    "is_verified",
    "industry_type",
    "subscription_state",
    "page",
  ]) {
    if (sp[key]) params.set(key, sp[key]!);
  }
  const qs = params.toString() ? `?${params}` : "";

  let data: OrgListResponse | null = null;
  let error: string | null = null;
  try {
    data = await djangoAdminFetch<OrgListResponse>(
      `/api/mgmt/organizations/${qs}`,
      session!.user!.email!,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load organizations";
  }

  if (error || !data) {
    return <BackendUnreachable title="Organizations" error={error ?? ""} />;
  }

  const rows = data.results;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Organizations"
        description="Every tenant on the platform, including suspended ones. Open a record to edit its profile, manage members, or run a lifecycle action."
        actions={
          <Link
            href="/admin/organizations/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" />
            New organization
          </Link>
        }
      />

      <TenantFilters
        placeholder="Search by name, slug, email, or phone…"
        filters={[
          {
            name: "is_active",
            label: "Status",
            options: [
              { value: "true", label: "Active" },
              { value: "false", label: "Suspended" },
            ],
          },
          {
            name: "is_verified",
            label: "Verification",
            options: [
              { value: "true", label: "Verified" },
              { value: "false", label: "Unverified" },
            ],
          },
          {
            name: "subscription_state",
            label: "Billing",
            options: [
              { value: "subscribed", label: "Has a paid branch" },
              { value: "unsubscribed", label: "No live subscription" },
            ],
          },
          {
            name: "industry_type",
            label: "Industry",
            options: data.industry_types.map((choice) => ({
              value: choice.value,
              label: choice.label,
            })),
          },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No organizations match those filters"
          hint="Clear the filters to see the full list."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Branches</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <DrillLink href={`/admin/organizations/${org.id}`}>
                          {org.name}
                        </DrillLink>
                        <p className="text-xs text-muted-foreground">
                          {org.country ?? "No country"} ·{" "}
                          {org.industry_type ?? "Unclassified"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {org.owner_email ?? (
                      <span className="inline-flex items-center gap-1.5">
                        <WarningTriangle className="h-3.5 w-3.5" />
                        No owner
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {org.active_branch_count}
                    {org.branch_count !== org.active_branch_count && (
                      <span className="text-muted-foreground">
                        {" "}
                        / {org.branch_count}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {org.member_count}
                  </TableCell>
                  <TableCell>
                    {org.active_subscription_count > 0 ? (
                      <StatusPill tone="success">
                        {org.active_subscription_count} paid
                      </StatusPill>
                    ) : (
                      <StatusPill tone="neutral">None</StatusPill>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {org.is_active ? (
                        <StatusPill tone="success">Active</StatusPill>
                      ) : (
                        <StatusPill tone="critical">Suspended</StatusPill>
                      )}
                      {org.is_verified && (
                        <StatusPill tone="info">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </StatusPill>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(org.created_at)}
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
