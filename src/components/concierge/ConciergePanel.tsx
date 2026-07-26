"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SendDiagonal, Sparks, Xmark } from "iconoir-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ConciergeLeadCard } from "./ConciergeLeadCard";
import { ConciergeMessage } from "./ConciergeMessage";
import { useConcierge } from "./useConcierge";

const STARTER_KEYS = ["pos", "price", "chef", "demo"] as const;

/** Composer ceiling, ~5 lines at 16px. Past this the textarea scrolls instead. */
const MAX_COMPOSER_HEIGHT = 132;

/**
 * How much of the layout viewport an on-screen keyboard is covering.
 *
 * Mobile keyboards shrink the *visual* viewport but leave the layout viewport
 * alone, so `dvh` and `position: fixed` both keep measuring the full screen
 * and the composer ends up underneath the keyboard. visualViewport is the only
 * thing that reports the real visible area on iOS.
 */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const covered = window.innerHeight - vv.height - vv.offsetTop;
      // Sub-pixel noise and the URL bar collapsing both show up here; ignore
      // anything too small to be a keyboard.
      setInset(covered > 80 ? Math.round(covered) : 0);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}

export function ConciergePanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const {
    messages,
    sending,
    hydrated,
    send,
    leadOffered,
    leadSubmitted,
    submitLead,
    dismissLead,
  } = useConcierge();
  const [draft, setDraft] = useState("");
  const [leadThanked, setLeadThanked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const keyboardInset = useKeyboardInset();

  // Lock body scroll while the panel is open so the page behind doesn't move.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    // preventScroll: true — the panel is fixed to the viewport, but focusing
    // an element still makes some browsers scroll the whole document to
    // "reveal" it, which snaps a scrolled-down page back to the top.
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Keep the newest message in view — including when the keyboard opens and
  // takes half the panel with it.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, sending, leadOffered, keyboardInset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Auto-grow the composer with content, capped so it reads as a chat input
  // rather than an open-ended textarea.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    // scrollHeight covers content + padding but not the border, which the
    // border-box height does include — without it every line sits 2px clipped.
    const border = el.offsetHeight - el.clientHeight;
    const content = el.scrollHeight + border;

    el.style.height = `${Math.min(content, MAX_COMPOSER_HEIGHT)}px`;
    // Only allow scrolling once the box has actually hit its ceiling, so the
    // scrollbar doesn't flicker in and out on every newline while it grows.
    el.style.overflowY = content > MAX_COMPOSER_HEIGHT ? "auto" : "hidden";
  }, [draft]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    void send(text);
  };

  const handleLeadSubmit = async (fields: Parameters<typeof submitLead>[0]) => {
    const ok = await submitLead(fields);
    if (ok) setLeadThanked(true);
    return ok;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("concierge.title")}
      // The inset rides in as a variable so the mobile `bottom` can consume it
      // while `sm:bottom-24` still wins outright on desktop.
      style={{ "--kb": `${keyboardInset}px` } as CSSProperties}
      className="fixed inset-x-0 bottom-[var(--kb,0px)] z-50 flex h-[75dvh] max-h-[calc(100dvh-var(--kb,0px)-1.5rem)] flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-l3 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-[calc(100dvh-8rem)] sm:w-[380px] sm:rounded-2xl"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <Sparks className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-foreground">
              {t("concierge.title")}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t("concierge.subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={t("concierge.close")}
          className="-mr-1 shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Xmark className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        // min-h-0 lets this actually shrink inside the flex column; without it
        // the messages push the composer off the bottom of the panel.
        className="scrollbar-subtle min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        aria-live="polite"
      >
        <ConciergeMessage
          message={{ role: "assistant", content: t("concierge.greeting") }}
        />
        {hydrated && messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {STARTER_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => void send(t(`concierge.starters.${key}`))}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t(`concierge.starters.${key}`)}
              </button>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <ConciergeMessage key={index} message={message} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </span>
            {t("concierge.thinking")}
          </div>
        )}
        {leadOffered && !leadThanked && (
          <ConciergeLeadCard onSubmit={handleLeadSubmit} onDismiss={dismissLead} />
        )}
        {leadSubmitted && leadThanked && (
          <ConciergeMessage
            message={{ role: "assistant", content: t("concierge.lead.thanks") }}
          />
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex shrink-0 items-end gap-2 border-t border-border bg-card px-3 py-3"
        style={{
          // The home indicator is behind the keyboard while it's up, so its
          // safe-area padding would just be dead space on top of the inset.
          paddingBottom: keyboardInset
            ? "0.75rem"
            : "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends on pointer-and-keyboard setups; on a touch keyboard
            // it has to insert a newline, since there's no shift to hold.
            if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(hover: hover)").matches) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          maxLength={1000}
          placeholder={t("concierge.placeholder")}
          aria-label={t("concierge.placeholder")}
          // text-base below sm is load-bearing: iOS Safari zooms the whole page
          // in when a focused field is under 16px, which is what pushes the
          // send button off-screen.
          className="scrollbar-subtle min-h-[40px] w-full flex-1 resize-none overflow-y-hidden rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !draft.trim()}
          aria-label={t("concierge.send")}
          className="h-10 w-10 shrink-0"
        >
          <SendDiagonal className="h-4 w-4" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
