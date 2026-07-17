"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import JourneyTimeline from "./JourneyTimeline";

interface Stage {
  title: string;
  desc: string;
}

const OurStory = () => {
  const { t } = useTranslation();
  const journey = t("about.story.journey", { returnObjects: true }) as Stage[];

  return (
    <section className="relative border-t border-border/50 py-20 sm:py-28">
      <div className="section-container">
        <SectionHeading
          eyebrow={t("about.story.eyebrow")}
          title={t("about.story.heading")}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
          {/* Narrative + image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("about.story.p1")}</p>
              <p>{t("about.story.p2")}</p>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-border/60">
              <Image
                src="/images/restaurant-interior.jpg"
                alt=""
                width={900}
                height={520}
                className="h-56 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 font-display text-lg font-medium text-foreground sm:text-xl">
                {t("about.story.p3")}
              </p>
            </div>
          </motion.div>

          {/* Journey */}
          <div className="lg:pl-4">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("about.story.journeyHeading")}
            </p>
            <JourneyTimeline stages={journey} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
