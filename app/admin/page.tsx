import { prisma } from "@/lib/prisma";
import { Page, Link as LinkIcon, Mail } from "iconoir-react";

export default async function AdminDashboard() {
  const [pagesCount, linksCount, messagesCount] = await Promise.all([
    prisma.page.count(),
    prisma.link.count(),
    prisma.contactMessage.count({ where: { status: "unread" } }),
  ]);

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-semibold tracking-tight text-foreground">
          System Overview
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Infrastructure control panel. Operational metrics and content
          management nodes are active.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Pages Node */}
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-8 shadow-l2 hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Page className="h-6 w-6 text-primary" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Content Node
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-5xl font-display font-semibold tracking-tighter text-foreground">
              {pagesCount}
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Active Pages
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-[#2A2A2E]">
            <p className="text-xs text-muted-foreground">
              Operational status:{" "}
              <span className="text-success font-semibold">OPTIMAL</span>
            </p>
          </div>
        </div>

        {/* Links Node */}
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-8 shadow-l2 hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Routing Node
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-5xl font-display font-semibold tracking-tighter text-foreground">
              {linksCount}
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Nav Terminals
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-[#2A2A2E]">
            <p className="text-xs text-muted-foreground">
              Map integrity:{" "}
              <span className="text-success font-semibold">100%</span>
            </p>
          </div>
        </div>

        {/* Messages Node */}
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-8 shadow-l2 hover:border-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Comm Node
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-5xl font-display font-semibold tracking-tighter text-foreground">
              {messagesCount}
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pending Syncs
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-[#2A2A2E]">
            <p className="text-xs text-muted-foreground">
              Queue status:{" "}
              <span
                className={
                  messagesCount > 0
                    ? "text-warning font-semibold"
                    : "text-success font-semibold"
                }
              >
                {messagesCount > 0 ? "ATTENTION REQ" : "SYNCHRONIZED"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
