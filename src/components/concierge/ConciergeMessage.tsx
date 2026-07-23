"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { ConciergeChatMessage } from "./useConcierge";

// Assistant replies are plain text that may carry markdown links or bare
// site-relative paths ("/blog/..."). Linkify those two shapes only — no
// markdown engine for untrusted LLM output.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|(\/blog\/[a-z0-9-]+)/g;

function isSafeHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
}

function renderContent(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(LINK_PATTERN);
  while ((match = pattern.exec(content)) !== null) {
    if (match.index > last) nodes.push(content.slice(last, match.index));
    const [full, label, href, barePath] = match;
    const url = barePath ?? href;
    if (url && isSafeHref(url)) {
      nodes.push(
        <a
          key={`${match.index}`}
          href={url}
          target={url.startsWith("/") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          {barePath ?? label}
        </a>
      );
    } else {
      nodes.push(full);
    }
    last = match.index + full.length;
  }
  if (last < content.length) nodes.push(content.slice(last));
  return nodes;
}

export function ConciergeMessage({ message }: { message: ConciergeChatMessage }) {
  const { t } = useTranslation();
  const isUser = message.role === "user";
  const content = message.fallback ? t("concierge.fallbackReply") : message.content;
  const rendered = useMemo(
    () => (isUser ? [content] : renderContent(content)),
    [content, isUser]
  );

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-[22px]",
          isUser
            ? "bg-secondary text-foreground"
            : "border border-border bg-card text-foreground"
        )}
      >
        {rendered}
      </div>
    </div>
  );
}
