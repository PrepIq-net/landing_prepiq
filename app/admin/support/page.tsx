import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma, SupportRequestStatus, SupportRequestType } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Paperclip } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPE_FILTERS: { value: SupportRequestType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All types" },
  { value: "BUG", label: "Bugs" },
  { value: "FEATURE_REQUEST", label: "Features" },
  { value: "INQUIRY", label: "Inquiries" },
  { value: "FEEDBACK", label: "Feedback" },
];

const STATUS_FILTERS: { value: SupportRequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const TYPE_LABELS: Record<SupportRequestType, string> = {
  BUG: "Bug",
  FEATURE_REQUEST: "Feature",
  INQUIRY: "Inquiry",
  FEEDBACK: "Feedback",
};

const TYPE_STYLES: Record<SupportRequestType, string> = {
  BUG: "bg-red-500/10 text-red-400 border-red-500/30",
  FEATURE_REQUEST: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  INQUIRY: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  FEEDBACK: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

const STATUS_STYLES: Record<SupportRequestStatus, string> = {
  NEW: "bg-primary/10 text-primary border-primary/30",
  IN_PROGRESS: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CLOSED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
};

function isType(v: string | undefined): v is SupportRequestType {
  return ["BUG", "FEATURE_REQUEST", "INQUIRY", "FEEDBACK"].includes(v ?? "");
}
function isStatus(v: string | undefined): v is SupportRequestStatus {
  return ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(v ?? "");
}

function filterHref(type: string, status: string) {
  const params = new URLSearchParams();
  if (type !== "ALL") params.set("type", type);
  if (status !== "ALL") params.set("status", status);
  const qs = params.toString();
  return qs ? `/admin/support?${qs}` : "/admin/support";
}

export default async function SupportManager({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;
  const activeType = isType(type) ? type : "ALL";
  const activeStatus = isStatus(status) ? status : "ALL";

  const where: Prisma.SupportRequestWhereInput = {
    ...(activeType !== "ALL" ? { type: activeType } : {}),
    ...(activeStatus !== "ALL" ? { status: activeStatus } : {}),
  };

  const [requests, newCount] = await Promise.all([
    prisma.supportRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        refNo: true,
        type: true,
        status: true,
        priority: true,
        subject: true,
        reporterName: true,
        reporterEmail: true,
        organizationName: true,
        contactEmail: true,
        createdAt: true,
        _count: { select: { attachments: true, votes: true } },
      },
    }),
    prisma.supportRequest.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Support
        </h1>
        <p className="text-muted-foreground text-sm">
          Bugs, feature requests, inquiries, and feedback from the PrepIQ apps.
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
              {["Ref", "Received", "Type", "From", "Subject", "Status", "Priority"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4"
                  >
                    {h}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow
                key={req.id}
                className={`border-b border-[#2A2A2E] transition-colors duration-150 ${
                  req.status === "NEW"
                    ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                    : "hover:bg-[#2A2A2E]/50"
                }`}
              >
                <TableCell className="px-6 py-4">
                  <Link
                    href={`/admin/support/${req.id}`}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    PIQ-{req.refNo}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {req.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {req.createdAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant="outline" className={`text-[10px] ${TYPE_STYLES[req.type]}`}>
                    {TYPE_LABELS[req.type]}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-foreground">
                    {req.reporterName ?? req.reporterEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {req.organizationName ?? req.reporterEmail}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 max-w-md">
                  <Link
                    href={`/admin/support/${req.id}`}
                    className="text-sm text-foreground hover:text-primary line-clamp-1"
                  >
                    {req.subject}
                  </Link>
                  <span className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                    {req._count.attachments > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" /> {req._count.attachments}
                      </span>
                    )}
                    {req.type === "FEATURE_REQUEST" && (
                      <span>{req._count.votes} votes</span>
                    )}
                    {!req.contactEmail && <span>no reply requested</span>}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${STATUS_STYLES[req.status]}`}
                  >
                    {req.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                  {req.priority}
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-16 text-center text-sm text-muted-foreground"
                >
                  No support requests match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
