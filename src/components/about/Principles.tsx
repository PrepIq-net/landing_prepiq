"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Cutlery,
  Sparks,
  RefreshDouble,
  Cpu,
  ShieldCheck,
} from "iconoir-react";

const ICONS = [Cutlery, Sparks, RefreshDouble, Cpu, ShieldCheck];

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
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t("about.principles.eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("about.principles.heading")}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                className="group rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Principles;
