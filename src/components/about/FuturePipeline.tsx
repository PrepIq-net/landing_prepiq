"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import {
  GraphUp,
  Calendar,
  Box,
  Cutlery,
  RefreshDouble,
  Sparks,
} from "iconoir-react";

const ICONS: ElementType[] = [
  GraphUp,
  Calendar,
  Box,
  Cutlery,
  RefreshDouble,
  Sparks,
];

interface Stage {
  title: string;
  desc: string;
}

/**
 * The product roadmap as a connected pipeline: on large screens the stages
 * flow left→right along a gradient track; on smaller screens they wrap into a
 * clean grid. The final stage (Smarter Tomorrow) is the gold destination.
 */
const FuturePipeline = ({ stages }: { stages: Stage[] }) => {
  return (
    <div className="relative">
      {/* Horizontal connecting track (single-row layout only) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-8 right-8 top-7 hidden h-px bg-gradient-to-r from-primary/15 via-primary/40 to-primary lg:block"
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2">
        {stages.map((stage, i) => {
          const Icon = ICONS[i % ICONS.length];
          const isLast = i === stages.length - 1;

          return (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border bg-background transition-colors ${
                  isLast
                    ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_0_28px_hsl(40_70%_39%/0.35)]"
                    : "border-primary/25 bg-primary/10 text-primary"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <span className="mt-4 font-mono text-[11px] font-medium text-primary/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4
                className={`mt-1 font-display text-sm font-semibold sm:text-base ${
                  isLast ? "text-primary" : "text-foreground"
                }`}
              >
                {stage.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {stage.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FuturePipeline;
