"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import {
  subscribeMenuOpen,
  subscribeMenuHeight,
  getMenuHeight,
} from "@/lib/menu-push";

/**
 * The push wrapper. When the navbar's menu opens, the whole page — navbar
 * included — is transformed down by the menu's own height, so the sheet
 * (portaled to `document.body`, outside this transform) covers the top of
 * the viewport while everything below it is pushed out of the way.
 *
 * The sheet auto-fits its content, so its height is measured at open time
 * and published to this wrapper via the menu-push store; the push tracks it.
 *
 * This wraps every page's content, so its own transform matters everywhere,
 * not just here: a `transform` (or `will-change: transform`) left on an
 * ancestor becomes the containing block for any `position: fixed` descendant
 * inside `children` — e.g. the blog post audio player's bottom-docked bar —
 * which then pins to this wrapper's box instead of the real viewport and
 * breaks. Framer Motion's `animate={{ y }}` keeps a `transform` on the node
 * at all times, even at rest (y: 0), so it was silently on for the entire
 * site. Set it to the literal string `"none"` while closed instead — same
 * fix the navbar already applies to its own transform — so there is no
 * containing block the other 99% of the time the menu isn't open.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(getMenuHeight());

  useEffect(() => subscribeMenuOpen(setOpen), []);
  useEffect(() => subscribeMenuHeight(setHeight), []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-dvh"
        style={{
          transform: open ? `translateY(${height})` : "none",
          transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {children}
      </div>
    </MotionConfig>
  );
}