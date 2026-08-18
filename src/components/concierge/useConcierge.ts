"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// A hung connection otherwise leaves send() waiting forever — no resolve,
// no reject — so "AI thinking" never clears. Bounded so it always settles;
// comfortably above the server's own 90s upstream timeout so a merely-slow
// (not stuck) reply still has room to land normally.
const REQUEST_TIMEOUT_MS = 100_000;

const VISITOR_KEY = "piq.concierge.visitorId";
export const CONVERSATION_KEY = "piq.concierge.conversationId";
/** Set once the visitor has opened the chat this session — the FAB nudge
 *  (dot + pill) only targets brand-new visitors, not returning ones. */
export const NUDGE_KEY = "piq.concierge.nudged";

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
  /** Holding in the queue: shown to the visitor with a cancel button, but
   *  not yet POSTed — it goes out once the current turn's reply is done. */
  queued?: boolean;
}

/** The full concierge state + actions. Held by ConciergeWidget (which never
 *  unmounts) and passed into the panel, so closing the chat does not destroy
 *  queued messages or an in-flight turn — they keep running in the
 *  background and are waiting when the panel reopens. */
export type ConciergeController = ReturnType<typeof useConcierge>;

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
  const { i18n, t } = useTranslation();
  const [messages, setMessages] = useState<ConciergeChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadDismissedAt, setLeadDismissedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Set only for replies that arrive live in this session — rehydrated history
  // is already "said" and shouldn't retype itself on every page load.
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  // Kept in sync so recovery (below) can compare against current length
  // without a stale closure over `messages`.
  const messagesRef = useRef<ConciergeChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  // Synchronous mirror of "a turn is in flight or its reply is still typing".
  // send() gates on this instead of state so two rapid submissions in the
  // same frame can't both slip past the queue.
  const busyRef = useRef(false);

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

  // A send can fail client-side (timeout, dropped connection) while the
  // backend actually finishes the turn a moment later — the reply isn't
  // lost, just not on this response. Re-check the server before showing the
  // apology bubble, so the thread heals itself instead of quietly sitting
  // on a reply the visitor never sees. Returns true if it found (and
  // rendered) a newer server state.
  const recoverFromFailedSend = useCallback(async (): Promise<boolean> => {
    const stored = conversationIdRef.current;
    if (!stored) return false;
    try {
      const res = await fetch(
        `/api/concierge/chat?conversationId=${encodeURIComponent(stored)}&visitorId=${encodeURIComponent(getVisitorId())}`
      );
      if (!res.ok) return false;
      const data = await res.json();
      const serverMessages = data.messages as
        | { role: "user" | "assistant"; content: string }[]
        | undefined;
      const sentCount = messagesRef.current.filter((m) => !m.queued).length;
      if (!serverMessages || serverMessages.length <= sentCount) {
        return false;
      }
      conversationIdRef.current = data.conversationId;
      // Keep queued (unsent) bubbles in place — only the server state is
      // being replaced.
      const queuedMessages = messagesRef.current.filter((m) => m.queued);
      setMessages([
        ...serverMessages.map((m) => ({ id: nextMessageId(), role: m.role, content: m.content })),
        ...queuedMessages,
      ]);
      setLeadSubmitted(Boolean(data.hasLead));
      return true;
    } catch {
      return false;
    }
  }, []);

  // The actual network turn: marks the message as sent (or appends a fresh
  // user bubble when it wasn't queued first), POSTs, then renders the reply.
  const dispatch = useCallback(
    async (text: string, queuedId?: string) => {
      busyRef.current = true;
      setSending(true);
      const userId = queuedId ?? nextMessageId();
      setMessages((prev) =>
        queuedId
          ? prev.map((m) => (m.id === queuedId ? { ...m, queued: false } : m))
          : [...prev, { id: userId, role: "user", content: text }]
      );
      // The reply lands directly under its own user bubble — never after
      // queued messages that were stacked while this turn was in flight.
      const placeReply = (replyId: string, content: string, fallback?: boolean) => {
        const reply: ConciergeChatMessage = {
          id: replyId,
          role: "assistant",
          content,
          fallback,
        };
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === userId);
          if (idx === -1) return [...prev, reply];
          const next = [...prev];
          next.splice(idx + 1, 0, reply);
          return next;
        });
        setAnimatingId(replyId);
      };
      try {
        const res = await fetch("/api/concierge/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationIdRef.current,
            visitorId: getVisitorId(),
            message: text,
            locale: i18n.language?.startsWith("fr") ? "fr" : "en",
            path: window.location.pathname,
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        const data = res.ok ? await res.json() : null;
        if (data?.conversationId) {
          conversationIdRef.current = data.conversationId;
          localStorage.setItem(CONVERSATION_KEY, data.conversationId);
        }
        const replyId = nextMessageId();
        if (data?.reply) {
          placeReply(replyId, data.reply);
        } else if (await recoverFromFailedSend()) {
          // Server actually had a reply for a different reason (e.g. this
          // POST hit a rate limit / honeypot path); recovery already
          // rendered it — nothing more to do here.
        } else {
          placeReply(replyId, "", true);
        }
      } catch {
        if (!(await recoverFromFailedSend())) {
          placeReply(nextMessageId(), "", true);
        }
      } finally {
        setSending(false);
      }
    },
    [i18n.language, recoverFromFailedSend]
  );

  // Queue draining: as soon as no fetch is in flight and no reply is still
  // typing, promote the oldest queued message to a real send — one message
  // per completed turn, so replies come out in order.
  useEffect(() => {
    if (sending || animatingId !== null) return;
    busyRef.current = false;
    const queued = messagesRef.current.find((m) => m.queued);
    if (queued) void dispatch(queued.content, queued.id);
  }, [sending, animatingId, dispatch]);

  // If a turn is already running (fetch in flight or reply typing), the
  // message stacks in the queue as a cancelable bubble instead of being
  // POSTed right away; otherwise it goes straight out.
  const send = useCallback(
    (text: string) => {
      const message = text.trim().slice(0, 1000);
      if (!message) return;
      if (busyRef.current) {
        setMessages((prev) => [
          ...prev,
          { id: nextMessageId(), role: "user", content: message, queued: true },
        ]);
        return;
      }
      void dispatch(message);
    },
    [dispatch]
  );

  const cancelQueued = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

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
        // The thanks becomes a regular assistant bubble in the thread — it
        // can't pin to the bottom and later messages flow after it.
        setMessages((prev) => [
          ...prev,
          { id: nextMessageId(), role: "assistant", content: t("concierge.lead.thanks") },
        ]);
        return true;
      }
    } catch {
      // fall through
    }
    return false;
  }, [t]);

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

  // Starts a fresh conversation client-side — the old one is untouched
  // server-side (it's still visible in /admin/concierge and stays attached
  // to any lead already captured from it), this just stops showing it and
  // stops sending it as context on the next message.
  const clearChat = useCallback(() => {
    localStorage.removeItem(CONVERSATION_KEY);
    conversationIdRef.current = null;
    busyRef.current = false;
    setMessages([]);
    setLeadSubmitted(false);
    setLeadDismissedAt(null);
    setAnimatingId(null);
  }, []);

  return {
    messages,
    sending,
    hydrated,
    send,
    cancelQueued,
    animatingId,
    endAnimation,
    leadOffered,
    leadSubmitted,
    submitLead,
    dismissLead,
    clearChat,
  };
}
