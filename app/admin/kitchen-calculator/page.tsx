import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MailOut } from "iconoir-react";
import { formatCompactMoney } from "@/lib/kitchen-calculator/format";
import type { Currency } from "@/lib/kitchen-calculator/engine";

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "ALL", label: "All submissions" },
  { value: "NEW", label: "New" },
  { value: "HANDLED", label: "Handled" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

function isFilter(v: string | undefined): v is Filter {
  return ["ALL", "NEW", "HANDLED"].includes(v ?? "");
}

function filterHref(filter: Filter) {
  return filter === "ALL" ? "/admin/kitchen-calculator" : `/admin/kitchen-calculator?filter=${filter}`;
}

export default async function KitchenCalculatorManager({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = isFilter(filter) ? filter : "ALL";

  const where: Prisma.KitchenCalculatorLeadWhereInput = {
    ...(activeFilter === "NEW" ? { handled: false } : {}),
    ...(activeFilter === "HANDLED" ? { handled: true } : {}),
  };

  const [leads, totalCount] = await Promise.all([
    prisma.kitchenCalculatorLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.kitchenCalculatorLead.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Kitchen Intelligence Calculator
        </h1>
        <p className="text-muted-foreground text-sm">
          Submissions from the landing-page assessment tool.
          {totalCount > 0 && <span className="text-primary font-medium"> {totalCount} captured.</span>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={filterHref(f.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              activeFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-secondary hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-card border border-secondary rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow className="hover:bg-transparent border-b border-secondary">
              {["Ref", "Captured", "Email", "Operation", "Score", "Status"].map((h) => (
                <TableHead
                  key={h}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className={`border-b border-secondary transition-colors duration-150 ${
                  lead.handled ? "hover:bg-secondary/50" : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                }`}
              >
                <TableCell className="px-6 py-4">
                  <Link
                    href={`/admin/kitchen-calculator/${lead.id}`}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    KIC-{lead.refNo}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {lead.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                  {lead.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
                <TableCell className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/kitchen-calculator/${lead.id}`}
                      className="text-sm text-foreground hover:text-primary line-clamp-1"
                    >
                      {lead.email}
                    </Link>
                    {lead.emailSentAt && (
                      <span title="Snapshot email sent">
                        <MailOut className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                        <span className="sr-only">Snapshot email sent</span>
                      </span>
                    )}
                  </div>
                  {lead.restaurantName && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{lead.restaurantName}</p>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {lead.locations} loc · {formatCompactMoney(lead.weeklyNetworkRevenue, lead.currency as Currency)}/wk
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-display text-sm font-semibold text-foreground">
                    {lead.intelligenceScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {lead.handled ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    >
                      Handled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                      New
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                  No submissions match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
