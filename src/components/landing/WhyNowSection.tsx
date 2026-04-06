"use client";

import { motion } from "framer-motion";
import { WarningTriangle, CloudSunny, Calendar, GraphUp } from "iconoir-react";
import { useTranslation, Trans } from "react-i18next";

const WhyNowSection = () => {
  const { t } = useTranslation();

  const pressures = [
    { icon: GraphUp, title: t("whyNow.items.foodCosts.title"), desc: t("whyNow.items.foodCosts.desc"), metric: "+18%", metricLabel: t("whyNow.items.foodCosts.label") },
    { icon: CloudSunny, title: t("whyNow.items.weather.title"), desc: t("whyNow.items.weather.desc"), metric: "±30%", metricLabel: t("whyNow.items.weather.label") },
    { icon: Calendar, title: t("whyNow.items.events.title"), desc: t("whyNow.items.events.desc"), metric: "2.4×", metricLabel: t("whyNow.items.events.label") },
    { icon: WarningTriangle, title: t("whyNow.items.delivery.title"), desc: t("whyNow.items.delivery.desc"), metric: "+42%", metricLabel: t("whyNow.items.delivery.label") },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="section-container px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto px-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-destructive font-medium mb-4 block">
            {t("whyNow.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 leading-tight lg:leading-[1.15]">
            {t("whyNow.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("whyNow.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pressures.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 group hover:border-destructive/30 transition-colors duration-300 relative overflow-hidden"
            >
              {/* Subtle top gradient on hover */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-destructive/0 group-hover:from-destructive/[0.03] to-transparent transition-all duration-500" />

              <div className="relative space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <p.icon className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <span className="text-xl font-semibold text-foreground">{p.metric}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.metricLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 md:mt-14"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs sm:text-sm text-foreground">
              <Trans
                i18nKey="whyNow.cta"
                components={{ gold: <span className="text-primary font-medium" /> }}
              />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyNowSection;
