"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ElementType } from "react";
import {
  Cutlery,
  Sparks,
  RefreshDouble,
  Cpu,
  ShieldCheck,
} from "iconoir-react";
import SectionHeading from "./SectionHeading";

const ICONS: ElementType[] = [Cutlery, Sparks, RefreshDouble, Cpu, ShieldCheck];

interface Principle {
  title: string;
  body: string;
}

const Principles = () => {
  const { t } = useTranslation();
  const cards = t("about.principles.cards", { returnObjects: true }) as Principle[];

  return (
    <section className="border-t border-border/50 py-20 sm:py-28">
      <div className="section-container">
        <SectionHeading
          eyebrow={t("about.principles.eyebrow")}
          title={t("about.principles.heading")}
        />

        <div className="mt-14 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = ICONS[i % ICONS.length];
            const featured = i === 0;

            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-200 sm:p-7 ${
                  featured
                    ? "border-primary/25 bg-primary/[0.06] sm:col-span-2"
                    : "border-border/60 bg-card/40 hover:border-primary/30"
                }`}
              >
                {/* Top accent line grows on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px w-0 bg-gradient-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full"
                />

                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-sm font-medium text-primary/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className={`mt-5 font-display font-semibold text-foreground ${
                    featured ? "text-xl sm:text-2xl" : "text-lg"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`mt-2 leading-relaxed text-muted-foreground ${
                    featured ? "text-base sm:max-w-md" : "text-sm"
                  }`}
                >
                  {card.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Principles;
