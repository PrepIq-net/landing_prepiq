"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Xmark } from "iconoir-react";

import { cn } from "@/lib/utils";
import type { ConciergeChatMessage } from "./useConcierge";
import { ConciergeMarkdown } from "./ConciergeMarkdown";

/** ~14ms per character ≈ 70 chars/sec, the same cadence as the app assistant. */
const TYPE_INTERVAL_MS = 14;

export function ConciergeMessage({
  message,
  animateIn = false,
  onAnimationDone,
  onCancelQueued,
  onNavigate,
  highlight = false,
}: {
  message: ConciergeChatMessage;
  animateIn?: boolean;
  onAnimationDone?: () => void;
  /** Only wired for queued user messages — unsends the bubble. */
  onCancelQueued?: () => void;
  /** Passed to markdown links; internal links close the chat before
   *  navigating. */
  onNavigate?: () => void;
  /** Prominent treatment for the opening greeting. */
  highlight?: boolean;
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

  // Render markdown only once the full text has landed — mid-type, a
  // partial "**bo" or "[label](/blog/" would render as raw syntax before
  // it resolves.
  const settled = typed.length >= content.length;

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-[22px]",
          isUser
            ? "bg-secondary text-foreground whitespace-pre-wrap"
            : highlight
              ? "border border-border bg-foreground/[0.04] text-foreground"
              : "border border-border bg-card text-foreground"
        )}
      >
        {isUser || !settled ? (
          <span className="whitespace-pre-wrap">{typed}</span>
        ) : (
          <ConciergeMarkdown content={content} onNavigate={onNavigate} />
        )}
      </div>
      {message.queued && (
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{t("concierge.queued")}</span>
          <button
            onClick={onCancelQueued}
            aria-label={t("concierge.cancelQueued")}
            className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Xmark className="h-3 w-3" aria-hidden />
            {t("concierge.cancelQueued")}
          </button>
        </div>
      )}
    </div>
  );
}
