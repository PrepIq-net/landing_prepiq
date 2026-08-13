"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
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
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(getMenuHeight());

  useEffect(() => subscribeMenuOpen(setOpen), []);
  useEffect(() => subscribeMenuHeight(setHeight), []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        animate={{ y: open ? height : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh will-change-transform"
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}