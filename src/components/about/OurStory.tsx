"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StepFlow from "./StepFlow";

const OurStory = () => {
  const { t } = useTranslation();
  const timeline = t("about.story.timeline", { returnObjects: true }) as string[];

  return (
    <section className="border-t border-border/50 py-20 sm:py-28">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("about.story.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("about.story.heading")}
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("about.story.p1")}</p>
              <p>{t("about.story.p2")}</p>
              <p className="font-medium text-foreground">{t("about.story.p3")}</p>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border/60">
              <Image
                src="/images/restaurant-interior.jpg"
                alt=""
                width={900}
                height={520}
                className="h-56 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </motion.div>

          <div className="lg:sticky lg:top-24">
            <StepFlow steps={timeline} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
