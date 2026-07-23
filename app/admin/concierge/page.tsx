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

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "ALL", label: "All conversations" },
  { value: "LEADS", label: "With lead" },
  { value: "NO_LEAD", label: "No lead" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

function isFilter(v: string | undefined): v is Filter {
  return ["ALL", "LEADS", "NO_LEAD"].includes(v ?? "");
}

function filterHref(filter: Filter) {
  return filter === "ALL" ? "/admin/concierge" : `/admin/concierge?filter=${filter}`;
}

export default async function ConciergeManager({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = isFilter(filter) ? filter : "ALL";

  const where: Prisma.ConciergeConversationWhereInput = {
    ...(activeFilter === "LEADS" ? { lead: { isNot: null } } : {}),
    ...(activeFilter === "NO_LEAD" ? { lead: { is: null } } : {}),
  };

  const [conversations, leadCount] = await Promise.all([
    prisma.conciergeConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 200,
      select: {
        id: true,
        refNo: true,
        locale: true,
        messageCount: true,
        createdAt: true,
        updatedAt: true,
        lead: { select: { email: true } },
        messages: {
          where: { role: "USER" },
          orderBy: { createdAt: "asc" },
          take: 1,
          select: { content: true },
        },
      },
    }),
    prisma.conciergeLead.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Concierge
        </h1>
        <p className="text-muted-foreground text-sm">
          Conversations from the landing-page PrepIQ Assistant.
          {leadCount > 0 && (
            <span className="text-primary font-medium"> {leadCount} leads captured.</span>
          )}
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
              {["Ref", "Last activity", "First question", "Messages", "Locale", "Lead"].map(
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
            {conversations.map((conv) => (
              <TableRow
                key={conv.id}
                className={`border-b border-secondary transition-colors duration-150 ${
                  conv.lead
                    ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                    : "hover:bg-secondary/50"
                }`}
              >
                <TableCell className="px-6 py-4">
                  <Link
                    href={`/admin/concierge/${conv.id}`}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    CHAT-{conv.refNo}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {conv.updatedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {conv.updatedAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="px-6 py-4 max-w-md">
                  <Link
                    href={`/admin/concierge/${conv.id}`}
                    className="text-sm text-foreground hover:text-primary line-clamp-1"
                  >
                    {conv.messages[0]?.content ?? "—"}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                  {conv.messageCount}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-zinc-500/10 text-zinc-400 border-zinc-500/30 uppercase"
                  >
                    {conv.locale}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {conv.lead ? (
                    <span className="flex items-center gap-2 text-xs text-foreground">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                      {conv.lead.email}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {conversations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-16 text-center text-sm text-muted-foreground"
                >
                  No conversations match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
