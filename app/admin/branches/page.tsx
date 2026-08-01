import { notFound } from "next/navigation";
import { MapPin } from "iconoir-react";

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
  ReadinessDots,
  StatusPill,
  subscriptionTone,
} from "@/components/admin/tenant/shared";
import type { AdminBranch, Paginated } from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Branches — PrepIQ Admin",
};

const PAGE_SIZE = 25;

export default async function BranchesPage({
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
    "is_active",
    "currency",
    "missing_hours",
    "missing_connector",
    "page",
  ]) {
    if (sp[key]) params.set(key, sp[key]!);
  }
  const qs = params.toString() ? `?${params}` : "";

  let data: Paginated<AdminBranch> | null = null;
  let error: string | null = null;
  try {
    data = await djangoAdminFetch<Paginated<AdminBranch>>(
      `/api/mgmt/organizations/branches/${qs}`,
      session!.user!.email!,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load branches";
  }

  if (error || !data) {
    return <BackendUnreachable title="Branches" error={error ?? ""} />;
  }

  const scopedOrgName =
    sp.organization_id && data.results.length > 0
      ? data.results[0].organization_name
      : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title={scopedOrgName ? `Branches · ${scopedOrgName}` : "Branches"}
        description="Branches are where plans, currency, and forecasting actually live. The readiness strip shows what each one is still missing before it can forecast."
      />

      <TenantFilters
        placeholder="Search by branch, code, address, or organization…"
        filters={[
          {
            name: "is_active",
            label: "Status",
            options: [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ],
          },
          {
            name: "missing_hours",
            label: "Operating hours",
            options: [{ value: "true", label: "Missing hours" }],
          },
          {
            name: "missing_connector",
            label: "POS connector",
            options: [{ value: "true", label: "No connector" }],
          },
        ]}
      />

      {data.results.length === 0 ? (
        <EmptyState
          title="No branches match those filters"
          hint="Branches are created from an organization's record."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Staff</TableHead>
                <TableHead>Readiness</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <DrillLink href={`/admin/branches/${branch.id}`}>
                            {branch.name}
                          </DrillLink>
                          {branch.is_primary && (
                            <StatusPill tone="info">Primary</StatusPill>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {branch.code} · {branch.timezone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DrillLink
                      href={`/admin/organizations/${branch.organization_id}`}
                    >
                      <span className="text-sm">{branch.organization_name}</span>
                    </DrillLink>
                  </TableCell>
                  <TableCell>
                    {branch.subscription ? (
                      <StatusPill
                        tone={subscriptionTone(branch.subscription.status)}
                      >
                        {branch.subscription.plan_name}
                        {branch.subscription.is_trial && " · trial"}
                      </StatusPill>
                    ) : (
                      <StatusPill tone="neutral">No plan</StatusPill>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{branch.currency}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {branch.staff_count}
                  </TableCell>
                  <TableCell>
                    <ReadinessDots readiness={branch.readiness} />
                  </TableCell>
                  <TableCell>
                    {branch.is_active ? (
                      <StatusPill tone="success">Active</StatusPill>
                    ) : (
                      <StatusPill tone="neutral">Inactive</StatusPill>
                    )}
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
