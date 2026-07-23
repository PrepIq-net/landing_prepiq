import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ConversationActions } from "./ConversationActions";

export const dynamic = "force-dynamic";

type MessageMeta = { provider?: string; model?: string; latencyMs?: number } | null;

export default async function ConciergeConversationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [conversation, session] = await Promise.all([
    prisma.conciergeConversation.findUnique({
      where: { id },
      include: {
        lead: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    }),
    auth(),
  ]);
  if (!conversation) notFound();

  const sessionUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      })
    : null;
  const isAdmin = sessionUser?.role === "ADMIN";
  const leadMeta =
    (conversation.lead?.meta as { handled?: boolean; handledBy?: string } | null) ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/concierge"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← All conversations
          </Link>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            CHAT-{conversation.refNo}
          </h1>
          <p className="text-muted-foreground text-sm">
            Started {conversation.createdAt.toLocaleString("en-US")} ·{" "}
            {conversation.messageCount} messages ·{" "}
            <span className="uppercase">{conversation.locale}</span>
            {conversation.startedPath && <> · from {conversation.startedPath}</>}
          </p>
        </div>
        <ConversationActions
          conversationId={conversation.id}
          isAdmin={isAdmin}
          hasLead={conversation.lead != null}
          leadHandled={Boolean(leadMeta?.handled)}
        />
      </div>

      {conversation.lead && (
        <div className="bg-card border border-secondary rounded-xl p-6 shadow-l2">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-display text-sm font-semibold text-foreground">Lead</h2>
            {leadMeta?.handled ? (
              <Badge
                variant="outline"
                className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              >
                Handled{leadMeta.handledBy ? ` · ${leadMeta.handledBy}` : ""}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] bg-primary/10 text-primary border-primary/30"
              >
                New
              </Badge>
            )}
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="text-foreground">{conversation.lead.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Restaurant</dt>
              <dd className="text-foreground">
                {conversation.lead.restaurantName ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Role</dt>
              <dd className="text-foreground">{conversation.lead.role ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Location</dt>
              <dd className="text-foreground">{conversation.lead.location ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd className="text-foreground">{conversation.lead.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Captured</dt>
              <dd className="text-foreground">
                {conversation.lead.createdAt.toLocaleString("en-US")}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="space-y-3">
        {conversation.messages.map((message) => {
          const meta = message.meta as MessageMeta;
          const isUser = message.role === "USER";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  isUser
                    ? "bg-secondary text-foreground"
                    : "bg-card border border-secondary text-foreground"
                }`}
              >
                {message.content}
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  {message.createdAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {!isUser && meta?.provider && (
                    <>
                      {" "}
                      · {meta.provider}
                      {meta.model ? ` / ${meta.model}` : ""}
                      {meta.latencyMs ? ` · ${(meta.latencyMs / 1000).toFixed(1)}s` : ""}
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
        {conversation.messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages in this conversation.
          </p>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Visitor {conversation.visitorId}
        {conversation.userAgent && <> · {conversation.userAgent}</>}
      </div>
    </div>
  );
}
