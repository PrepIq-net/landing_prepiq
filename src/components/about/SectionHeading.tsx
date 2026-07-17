"use client";

import { motion } from "framer-motion";
import { GoldText } from "@/components/landing/GoldText";
import { cn } from "@/lib/utils";

/**
 * Brand section header — mirrors the treatment used on the pricing section:
 * a line-flanked uppercase eyebrow above a large display title (with optional
 * <gold>…</gold> accents) and a muted subtitle.
 */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) => {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(centered ? "text-center" : "text-left", className)}
    >
      <div
        className={cn(
          "inline-flex items-center gap-3.5 mb-5 sm:mb-6",
          centered ? "justify-center" : "justify-start",
        )}
      >
        {centered && <span className="h-px w-8 sm:w-10 bg-primary" />}
        <span className="text-[0.6rem] md:text-xs font-medium uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary">
          {eyebrow}
        </span>
        <span className="h-px w-8 sm:w-10 bg-primary" />
      </div>

      <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
        <GoldText text={title} />
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg",
            centered ? "mx-auto max-w-xl" : "max-w-xl",
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
