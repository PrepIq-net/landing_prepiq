"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Cloud,
  DatabaseScript,
  GraphUp,
  User,
  WarningTriangle,
} from "iconoir-react";
import { useTranslation } from "react-i18next";

const IntelligenceSection = () => {
  const { t } = useTranslation();

  const signals = [
    { icon: DatabaseScript, label: t("intelligence.signals.sales.label"), desc: t("intelligence.signals.sales.desc") },
    { icon: Calendar, label: t("intelligence.signals.patterns.label"), desc: t("intelligence.signals.patterns.desc") },
    { icon: Cloud, label: t("intelligence.signals.weather.label"), desc: t("intelligence.signals.weather.desc") },
    { icon: GraphUp, label: t("intelligence.signals.events.label"), desc: t("intelligence.signals.events.desc") },
    { icon: WarningTriangle, label: t("intelligence.signals.stockouts.label"), desc: t("intelligence.signals.stockouts.desc") },
    { icon: User, label: t("intelligence.signals.chef.label"), desc: t("intelligence.signals.chef.desc") },
  ];

  return (
    <section id="intelligence" className="py-20 md:py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 pattern-squares opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.03] blur-[140px]" />
      </div>

      <div className="section-container px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-4 sm:mb-5 block">
            {t("intelligence.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            {t("intelligence.title")}
          </h2>
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t("intelligence.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mt-10 sm:mt-16 space-y-3 sm:space-y-4">
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group flex items-start gap-3 sm:gap-5 rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors duration-300">
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 sm:mb-1">{s.label}</p>
                <p className="text-[12px] sm:text-[13px] text-muted-foreground/70 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] sm:text-xs text-muted-foreground/40 mt-8 sm:mt-12 px-2"
        >
          {t("intelligence.footer")}
        </motion.p>
      </div>
    </section>
  );
};

export default IntelligenceSection;
