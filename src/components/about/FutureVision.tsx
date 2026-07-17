"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import FuturePipeline from "./FuturePipeline";

interface Stage {
  title: string;
  desc: string;
}

const FutureVision = () => {
  const { t } = useTranslation();
  const pipeline = t("about.future.pipeline", { returnObjects: true }) as Stage[];

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 0%, hsl(40 70% 39% / 0.10) 0%, transparent 70%)",
        }}
      />
      <div className="section-container relative">
        <SectionHeading
          eyebrow={t("about.future.eyebrow")}
          title={t("about.future.heading")}
        />

        <div className="mx-auto mt-8 max-w-3xl space-y-5 text-center text-base leading-relaxed text-muted-foreground">
          <p>{t("about.future.p1")}</p>
          <p>{t("about.future.p2")}</p>
        </div>

        {/* Pipeline illustration */}
        <div className="mt-16">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("about.future.pipelineHeading")}
          </p>
          <FuturePipeline stages={pipeline} />
        </div>

        {/* Ambition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.06] p-8 text-center sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("about.future.ambitionLabel")}
          </p>
          <p className="mt-3 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl md:text-3xl">
            {t("about.future.ambition")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureVision;
