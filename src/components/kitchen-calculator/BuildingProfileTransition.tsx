"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check } from "iconoir-react";

/**
 * The "we're building your kitchen profile…" beat between the answers and
 * the email gate (task.md). Purely a pacing device — the numbers underneath
 * are already computed synchronously — but it's what makes the reveal feel
 * like an assessment rather than a slider snapping to a new value.
 */
export function BuildingProfileTransition({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const lines = t("kitchenCalculator.steps.building.lines", { returnObjects: true }) as string[];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= lines.length) {
      const done = setTimeout(onComplete, 500);
      return () => clearTimeout(done);
    }
    const step = setTimeout(() => setVisible((v) => v + 1), 420);
    return () => clearTimeout(step);
  }, [visible, lines.length, onComplete]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-8 py-10 sm:py-14 text-center"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-border" />
        <span className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>

      <div className="space-y-1.5">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
          {t("kitchenCalculator.steps.building.title")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("kitchenCalculator.steps.building.subtitle")}
        </p>
      </div>

      <ul className="space-y-2.5 text-sm">
        {lines.map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={i < visible ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2.5 text-muted-foreground"
          >
            {i < visible ? (
              <Check className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
            ) : (
              <span className="h-3.5 w-3.5 rounded-full border border-border shrink-0" aria-hidden />
            )}
            <span className={i < visible ? "text-foreground" : ""}>{line}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}