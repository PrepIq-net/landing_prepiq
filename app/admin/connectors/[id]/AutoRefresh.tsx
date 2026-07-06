"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-renders the server component tree on an interval so status, heartbeat
 * age and queue depths stay live-ish without a push transport. Pauses while
 * the tab is hidden.
 */
export function AutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const tick = () => {
      if (!document.hidden) router.refresh();
    };
    const interval = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
