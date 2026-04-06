"use client";

import { motion } from "framer-motion";
import { CloudUpload, Code, CreditCard } from "iconoir-react";
import { useTranslation } from "react-i18next";

const IntegrationsSection = () => {
  const { t } = useTranslation();

  const steps = (t("integrations.steps", { returnObjects: true }) as any[]) || [];

  const connectors = [
    { icon: CreditCard, label: t("integrations.connectors.pos") },
    { icon: CloudUpload, label: t("integrations.connectors.csv") },
    { icon: Code, label: t("integrations.connectors.api") },
  ];
  return (
    <section id="integrations" className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.02] blur-[140px]" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            {t("integrations.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-5 leading-tight lg:leading-[1.15]">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="block sm:inline"
            >
              {t("integrations.titleLine1")}{" "}
              <span className="relative inline-block">
                <span className="text-primary">{t("integrations.titleLine2")}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] bg-primary/40 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                />
              </span>
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            {t("integrations.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-12 md:mb-16 max-w-xl sm:max-w-none mx-auto">
          {connectors.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="group flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm px-5 sm:px-7 py-4 sm:py-5 hover:border-primary/20 transition-all duration-300 hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.08)] justify-center sm:justify-start"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <c.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{c.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 px-1">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group flex gap-4 sm:gap-5 items-start rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-5 hover:border-primary/15 transition-all duration-300"
            >
              <span className="text-xl font-semibold text-primary/30 shrink-0 w-10 pt-0.5">
                {s.num}
              </span>
              <div>
                <h4 className="text-[15px] font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
