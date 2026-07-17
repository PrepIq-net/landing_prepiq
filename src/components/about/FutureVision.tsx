"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StepFlow from "./StepFlow";

const FutureVision = () => {
  const { t } = useTranslation();
  const steps = t("about.future.steps", { returnObjects: true }) as string[];

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 80% 50%, hsl(40 70% 39% / 0.10) 0%, transparent 70%)",
        }}
      />
      <div className="section-container relative">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("about.future.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("about.future.heading")}
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("about.future.p1")}</p>
              <p>{t("about.future.p2")}</p>
            </div>

            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {t("about.future.ambitionLabel")}
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
                {t("about.future.ambition")}
              </p>
            </div>
          </motion.div>

          <div>
            <StepFlow steps={steps} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureVision;
