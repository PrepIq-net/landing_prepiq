"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const VISITOR_KEY = "piq.concierge.visitorId";
const CONVERSATION_KEY = "piq.concierge.conversationId";

// After this many visitor messages without a lead, the inline lead card is
// offered; if dismissed, it re-offers after the same number again.
const LEAD_OFFER_AFTER = 5;

export interface ConciergeChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Assistant turn that failed upstream — rendered as a localized apology. */
  fallback?: boolean;
}

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
              (m) => ({ role: m.role, content: m.content })
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
      setMessages((prev) => [...prev, { role: "user", content: message }]);
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
        if (data?.reply) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "", fallback: true },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", fallback: true },
        ]);
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

  return {
    messages,
    sending,
    hydrated,
    send,
    leadOffered,
    leadSubmitted,
    submitLead,
    dismissLead,
  };
}
