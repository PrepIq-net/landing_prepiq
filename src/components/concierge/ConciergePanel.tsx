"use client";

import { useEffect, useRef, useState } from "react";
import { SendDiagonal, Sparks, Xmark } from "iconoir-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ConciergeLeadCard } from "./ConciergeLeadCard";
import { ConciergeMessage } from "./ConciergeMessage";
import { useConcierge } from "./useConcierge";

const STARTER_KEYS = ["pos", "price", "chef", "demo"] as const;

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, sending, leadOffered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      aria-modal="false"
      aria-label={t("concierge.title")}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[75dvh] flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-l3 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
            <Sparks className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              {t("concierge.title")}
            </p>
            <p className="text-xs text-muted-foreground">{t("concierge.subtitle")}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={t("concierge.close")}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Xmark className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
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
        className="flex items-end gap-2 border-t border-border bg-card px-3 py-3"
      >
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          maxLength={1000}
          placeholder={t("concierge.placeholder")}
          aria-label={t("concierge.placeholder")}
          className="max-h-24 min-h-[38px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !draft.trim()}
          aria-label={t("concierge.send")}
        >
          <SendDiagonal className="h-4 w-4" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
