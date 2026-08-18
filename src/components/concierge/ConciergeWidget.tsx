"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChatBubbleEmpty, Xmark } from "iconoir-react";
import { useTranslation } from "react-i18next";

import { ConciergePanel } from "./ConciergePanel";
import { CONVERSATION_KEY, NUDGE_KEY, useConcierge } from "./useConcierge";

/** How long the "a message awaits" pill lingers before collapsing to just
 *  the pulsing dot on the FAB. */
const PILL_LINGER_MS = 12_000;

const ConciergeWidget = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Lives here (not in the panel) so closing the chat keeps the thread,
  // the queue and any in-flight turn alive — queued messages still send
  // while the panel is closed and are there when it reopens.
  const concierge = useConcierge();

  // New-visitor attention nudge: only when there is no saved conversation
  // (brand-new, or the chat was cleared) and they haven't opened the chat
  // this session. The dot stays until they do; the pill fades after a while.
  const [nudge, setNudge] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CONVERSATION_KEY)) return;
    if (sessionStorage.getItem(NUDGE_KEY)) return;
    setNudge(true);
    setPillVisible(true);
    const timer = setTimeout(() => setPillVisible(false), PILL_LINGER_MS);
    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      sessionStorage.setItem(NUDGE_KEY, "1");
      setNudge(false);
      setPillVisible(false);
    }
  };

  // Desktop click-away. The mobile sheet already closes via its dim backdrop,
  // which is pointer-transparent on desktop so the page stays usable — so the
  // floating panel needs its own outside-click to dismiss.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 640px)");

    const onPointerDown = (event: PointerEvent) => {
      if (!desktop.matches) return;
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      // Leave the toggle to its own handler, or it closes here and reopens there.
      if (toggleRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 sm:bg-transparent sm:pointer-events-none"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            ref={panelRef}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <ConciergePanel concierge={concierge} onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={toggleRef}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={toggle}
        aria-label={open ? t("concierge.close") : t("concierge.open")}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_4px_20px_hsla(40,70%,39%,0.3)] transition-shadow duration-300 hover:shadow-[0_4px_28px_hsla(40,70%,39%,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:right-6"
      >
        {open ? (
          <Xmark className="h-5 w-5" aria-hidden />
        ) : (
          <ChatBubbleEmpty className="h-5 w-5" aria-hidden />
        )}
        {nudge && !open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-30" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-foreground ring-2 ring-background" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {nudge && !open && pillVisible && (
          <motion.button
            onClick={toggle}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: 0.8 }}
            className="fixed bottom-[72px] right-4 z-40 flex max-w-[240px] items-center gap-2 rounded-full border border-border bg-card/95 px-3.5 py-2 text-left text-xs font-medium text-foreground shadow-l2 backdrop-blur-lg transition-colors hover:border-foreground/25 sm:bottom-[84px] sm:right-6"
          >
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-foreground/50" aria-hidden />
            <span>{t("concierge.nudge")}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConciergeWidget;
