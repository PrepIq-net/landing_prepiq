"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

/**
 * Animates a stat string ("92%", "−34%", "$2,400", "8,000+", "2.4×") by
 * counting its numeric part up from 0 when it scrolls into view.
 * Prefix/suffix, decimals and thousands separators are preserved.
 * Strings without a number render unchanged.
 */
export const CountUp = ({ value, duration = 1.4, className }: { value: string; duration?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // number may be grouped with "," (en) or spaces (fr): 2,400 / 22 500 / 92.5
  const parsed = value.match(/^([^0-9]*)(\d{1,3}(?:[,\s  ]\d{3})*(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(() => (parsed ? `${parsed[1]}0${parsed[3]}` : value));

  useEffect(() => {
    if (!inView || !parsed) return;
    const [, prefix, numStr, suffix] = parsed;
    const separator = (numStr.match(/[,\s  ]/) || [null])[0];
    const target = parseFloat(numStr.replace(/[,\s  ]/g, ""));
    const decimals = (numStr.split(".")[1] || "").length;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const formatted = separator
          ? Math.round(v).toLocaleString("en-US").replace(/,/g, separator)
          : v.toFixed(decimals);
        setDisplay(prefix + formatted + suffix);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

/**
 * Gold hairline glint that draws itself across a section's top border
 * as it scrolls into view. The parent <section> must be `relative`.
 */
export const SeamAccent = () => (
  <motion.span
    aria-hidden
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    className="absolute top-[-1px] left-1/2 -ml-24 h-px w-48 bg-gradient-to-r from-transparent via-primary/70 to-transparent"
  />
);
