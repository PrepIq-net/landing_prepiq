"use client";

import { motion } from "framer-motion";
import { NavArrowDown } from "iconoir-react";

/**
 * A simple, brand-styled vertical flow used for the story timeline
 * (Problem → … → PrepIQ) and the future vision (Forecasting → … → Smarter
 * Tomorrow). The final node is emphasised in the primary colour.
 */
const StepFlow = ({ steps }: { steps: string[] }) => {
  return (
    <ol className="flex flex-col items-stretch gap-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={step} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
              className={`w-full rounded-lg border px-5 py-3.5 text-center text-sm font-medium transition-colors sm:text-base ${
                isLast
                  ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_30px_hsl(40_70%_39%/0.12)]"
                  : "border-border/60 bg-card/40 text-foreground"
              }`}
            >
              {step}
            </motion.div>
            {!isLast && (
              <NavArrowDown
                aria-hidden
                className="my-1.5 h-4 w-4 flex-shrink-0 text-muted-foreground/50"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default StepFlow;
