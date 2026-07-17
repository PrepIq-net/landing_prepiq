"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import {
  WarningTriangle,
  Search,
  Flask,
  Cpu,
  Rocket,
  Sparks,
} from "iconoir-react";

const ICONS: ElementType[] = [
  WarningTriangle,
  Search,
  Flask,
  Cpu,
  Rocket,
  Sparks,
];

interface Stage {
  title: string;
  desc: string;
}

/**
 * A connected vertical journey — a gradient "spine" threads through numbered,
 * iconed nodes, each carrying a short description. The final node (PrepIQ) is
 * emphasised in gold as the destination of the story.
 */
const JourneyTimeline = ({ stages }: { stages: Stage[] }) => {
  return (
    <ol className="relative">
      {/* Spine */}
      <span
        aria-hidden
        className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary sm:left-[23px]"
      />

      {stages.map((stage, i) => {
        const Icon = ICONS[i % ICONS.length];
        const isLast = i === stages.length - 1;

        return (
          <motion.li
            key={stage.title}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5"
          >
            {/* Node */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors sm:h-12 sm:w-12 ${
                  isLast
                    ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_0_28px_hsl(40_70%_39%/0.35)]"
                    : "border-primary/25 bg-primary/10 text-primary"
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 pt-1 sm:pt-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-medium text-primary/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4
                  className={`font-display text-base font-semibold sm:text-lg ${
                    isLast ? "text-primary" : "text-foreground"
                  }`}
                >
                  {stage.title}
                </h4>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {stage.desc}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
};

export default JourneyTimeline;
