"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
          className="text-primary underline underline-offset-2 hover:opacity-80 inline-block py-0.5"
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

/** ~14ms per character ≈ 70 chars/sec, the same cadence as the app assistant. */
const TYPE_INTERVAL_MS = 14;

export function ConciergeMessage({
  message,
  animateIn = false,
  onAnimationDone,
}: {
  message: ConciergeChatMessage;
  animateIn?: boolean;
  onAnimationDone?: () => void;
}) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const isUser = message.role === "user";
  const content = message.fallback ? t("concierge.fallbackReply") : message.content;

  const typing = animateIn && !isUser && !reducedMotion;
  const [typed, setTyped] = useState(typing ? "" : content);

  // The panel passes a fresh closure every render; a ref keeps that from
  // restarting the interval and stuttering the text.
  const doneRef = useRef(onAnimationDone);
  doneRef.current = onAnimationDone;

  useEffect(() => {
    if (!typing) {
      setTyped(content);
      return;
    }
    setTyped("");
    if (!content.length) {
      doneRef.current?.();
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(content.slice(0, i));
      if (i >= content.length) {
        clearInterval(id);
        doneRef.current?.();
      }
    }, TYPE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [content, typing]);

  // Linkify only once the full text has landed — mid-type, a partial
  // "[label](/blog/" would render as raw markdown before it resolves.
  const settled = typed.length >= content.length;
  const rendered = useMemo(
    () => (isUser || !settled ? [typed] : renderContent(content)),
    [typed, content, isUser, settled]
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
