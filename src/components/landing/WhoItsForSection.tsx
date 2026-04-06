"use client";

import { motion } from "framer-motion";
import { Building, Shop, Bonfire, StatsReport } from "iconoir-react";
import { useTranslation } from "react-i18next";

const WhoItsForSection = () => {
  const { t } = useTranslation();

  const personas = [
    {
      icon: Building,
      title: t("whoItsFor.personas.multiBranch.title"),
      desc: t("whoItsFor.personas.multiBranch.desc"),
      stat: t("whoItsFor.personas.multiBranch.stat"),
    },
    {
      icon: Shop,
      title: t("whoItsFor.personas.brands.title"),
      desc: t("whoItsFor.personas.brands.desc"),
      stat: t("whoItsFor.personas.brands.stat"),
    },
    {
      icon: Bonfire,
      title: t("whoItsFor.personas.chefs.title"),
      desc: t("whoItsFor.personas.chefs.desc"),
      stat: t("whoItsFor.personas.chefs.stat"),
    },
    {
      icon: StatsReport,
      title: t("whoItsFor.personas.ops.title"),
      desc: t("whoItsFor.personas.ops.desc"),
      stat: t("whoItsFor.personas.ops.stat"),
    },
  ];

  return (
    <section className="py-28 border-t border-border/50 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)] pointer-events-none" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4 block">
            {t("whoItsFor.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 leading-tight lg:leading-[1.15]">
            {t("whoItsFor.title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t("whoItsFor.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-px bg-border/40 rounded-2xl overflow-hidden border border-border sm:grid-cols-2">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card p-8 md:p-10 space-y-5 group relative hover:bg-accent/30 transition-colors duration-300"
            >
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-xs text-primary font-medium">{p.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
