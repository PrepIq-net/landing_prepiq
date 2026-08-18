import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma, OpsAlertStatus, OpsAlertType, OpsAlertSeverity } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const TYPE_FILTERS: { value: OpsAlertType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All types" },
  { value: "POS_SYNC_FAILED", label: "POS sync failed" },
  { value: "CONNECTOR_OFFLINE", label: "Connector offline" },
  { value: "CSV_STALE", label: "CSV stale" },
];

const STATUS_FILTERS: { value: OpsAlertStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "RESOLVED", label: "Resolved" },
];

const TYPE_LABELS: Record<OpsAlertType, string> = {
  POS_SYNC_FAILED: "POS sync failed",
  CONNECTOR_OFFLINE: "Connector offline",
  CSV_STALE: "CSV stale",
};

const SEVERITY_STYLES: Record<OpsAlertSeverity, string> = {
  INFO: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  WARNING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
};

const STATUS_STYLES: Record<OpsAlertStatus, string> = {
  NEW: "bg-primary/10 text-primary border-primary/30",
  ACKNOWLEDGED: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

function isType(v: string | undefined): v is OpsAlertType {
  return ["POS_SYNC_FAILED", "CONNECTOR_OFFLINE", "CSV_STALE"].includes(v ?? "");
}
function isStatus(v: string | undefined): v is OpsAlertStatus {
  return ["NEW", "ACKNOWLEDGED", "RESOLVED"].includes(v ?? "");
}

function filterHref(type: string, status: string) {
  const params = new URLSearchParams();
  if (type !== "ALL") params.set("type", type);
  if (status !== "ALL") params.set("status", status);
  const qs = params.toString();
  return qs ? `/admin/ops-alerts?${qs}` : "/admin/ops-alerts";
}

export default async function OpsAlertsInbox({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;
  const activeType = isType(type) ? type : "ALL";
  const activeStatus = isStatus(status) ? status : "ALL";

  const where: Prisma.OpsAlertWhereInput = {
    ...(activeType !== "ALL" ? { alertType: activeType } : {}),
    ...(activeStatus !== "ALL" ? { status: activeStatus } : {}),
  };

  const [alerts, newCount] = await Promise.all([
    prisma.opsAlert.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      take: 200,
      select: {
        id: true,
        refNo: true,
        alertType: true,
        severity: true,
        status: true,
        organizationName: true,
        branchName: true,
        branchWasOpen: true,
        occurredAt: true,
      },
    }),
    prisma.opsAlert.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Ops Alerts
        </h1>
        <p className="text-muted-foreground text-sm">
          Infra and integration failures the backend caught on a restaurant&rsquo;s
          behalf — POS sync down, a connector gone dark, a stale CSV upload. These
          never reach the owner as a push notification; they land here instead.
          {newCount > 0 && (
            <span className="text-primary font-medium"> {newCount} new.</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={filterHref(f.value, activeStatus)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              activeType === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-[#1C1C1F] text-muted-foreground border-[#2A2A2E] hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
        <span className="mx-2 h-4 w-px bg-[#2A2A2E]" />
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={filterHref(activeType, f.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              activeStatus === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-[#1C1C1F] text-muted-foreground border-[#2A2A2E] hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              {["Ref", "Occurred", "Type", "Branch", "Open at the time?", "Severity", "Status"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4"
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow
                key={alert.id}
                className={`border-b border-[#2A2A2E] transition-colors duration-150 ${
                  alert.status === "NEW"
                    ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                    : "hover:bg-[#2A2A2E]/50"
                }`}
              >
                <TableCell className="px-6 py-4">
                  <Link
                    href={`/admin/ops-alerts/${alert.id}`}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    OPS-{alert.refNo}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {alert.occurredAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {alert.occurredAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Link
                    href={`/admin/ops-alerts/${alert.id}`}
                    className="text-sm text-foreground hover:text-primary"
                  >
                    {TYPE_LABELS[alert.alertType]}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-foreground">{alert.branchName ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.organizationName ?? ""}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs">
                  {alert.branchWasOpen === null ? (
                    <span className="text-muted-foreground">Unknown</span>
                  ) : alert.branchWasOpen ? (
                    <span className="text-amber-400">Yes — mid-service</span>
                  ) : (
                    <span className="text-muted-foreground">No — closed</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${SEVERITY_STYLES[alert.severity]}`}
                  >
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${STATUS_STYLES[alert.status]}`}
                  >
                    {alert.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {alerts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-16 text-center text-sm text-muted-foreground"
                >
                  No ops alerts match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
