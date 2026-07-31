"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const VISITOR_KEY = "piq.concierge.visitorId";
const CONVERSATION_KEY = "piq.concierge.conversationId";

// After this many visitor messages without a lead, the inline lead card is
// offered; if dismissed, it re-offers after the same number again.
const LEAD_OFFER_AFTER = 5;

export interface ConciergeChatMessage {
  /** Stable per-turn key, so a reply can be singled out to type itself in. */
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Assistant turn that failed upstream — rendered as a localized apology. */
  fallback?: boolean;
}

let messageSeq = 0;
const nextMessageId = () => `m${++messageSeq}`;

export interface LeadFields {
  email: string;
  restaurantName?: string;
  location?: string;
  role?: string;
  phone?: string;
}

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function useConcierge() {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<ConciergeChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadDismissedAt, setLeadDismissedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Set only for replies that arrive live in this session — rehydrated history
  // is already "said" and shouldn't retype itself on every page load.
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Rehydrate a previous conversation once, on first mount.
  useEffect(() => {
    const stored = localStorage.getItem(CONVERSATION_KEY);
    if (!stored) {
      setHydrated(true);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/concierge/chat?conversationId=${encodeURIComponent(stored)}&visitorId=${encodeURIComponent(getVisitorId())}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          conversationIdRef.current = data.conversationId;
          setMessages(
            (data.messages as { role: "user" | "assistant"; content: string }[]).map(
              (m) => ({ id: nextMessageId(), role: m.role, content: m.content })
            )
          );
          setLeadSubmitted(Boolean(data.hasLead));
        } else if (res.status === 404) {
          localStorage.removeItem(CONVERSATION_KEY);
        }
      } catch {
        // Offline or aborted — start fresh silently.
      } finally {
        setHydrated(true);
      }
    })();
    return () => controller.abort();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim().slice(0, 1000);
      if (!message || sending) return;
      setSending(true);
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: "user", content: message },
      ]);
      try {
        const res = await fetch("/api/concierge/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationIdRef.current,
            visitorId: getVisitorId(),
            message,
            locale: i18n.language?.startsWith("fr") ? "fr" : "en",
            path: window.location.pathname,
          }),
        });
        const data = res.ok ? await res.json() : null;
        if (data?.conversationId) {
          conversationIdRef.current = data.conversationId;
          localStorage.setItem(CONVERSATION_KEY, data.conversationId);
        }
        const replyId = nextMessageId();
        if (data?.reply) {
          setMessages((prev) => [
            ...prev,
            { id: replyId, role: "assistant", content: data.reply },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { id: replyId, role: "assistant", content: "", fallback: true },
          ]);
        }
        setAnimatingId(replyId);
      } catch {
        const replyId = nextMessageId();
        setMessages((prev) => [
          ...prev,
          { id: replyId, role: "assistant", content: "", fallback: true },
        ]);
        setAnimatingId(replyId);
      } finally {
        setSending(false);
      }
    },
    [i18n.language, sending]
  );

  const submitLead = useCallback(async (fields: LeadFields): Promise<boolean> => {
    if (!conversationIdRef.current) return false;
    try {
      const res = await fetch("/api/concierge/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          visitorId: getVisitorId(),
          ...fields,
        }),
      });
      if (res.ok) {
        setLeadSubmitted(true);
        return true;
      }
    } catch {
      // fall through
    }
    return false;
  }, []);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const hadFallback = messages.some((m) => m.fallback);
  const leadOffered =
    !leadSubmitted &&
    !sending &&
    userMessageCount > 0 &&
    (hadFallback ||
      (leadDismissedAt == null
        ? userMessageCount >= LEAD_OFFER_AFTER
        : userMessageCount >= leadDismissedAt + LEAD_OFFER_AFTER));

  const dismissLead = useCallback(
    () => setLeadDismissedAt(userMessageCount),
    [userMessageCount]
  );

  const endAnimation = useCallback(
    (id: string) => setAnimatingId((current) => (current === id ? null : current)),
    []
  );

  return {
    messages,
    sending,
    hydrated,
    send,
    animatingId,
    endAnimation,
    leadOffered,
    leadSubmitted,
    submitLead,
    dismissLead,
  };
}
