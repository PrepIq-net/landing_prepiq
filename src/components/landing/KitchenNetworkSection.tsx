"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Brain, ArrowRight, Flash, Globe, WarningTriangle, CheckCircle, ShareAndroid, Building, MapPin } from "iconoir-react";
import { useTranslation, Trans } from "react-i18next";

/* ───────── Animated connection line ───────── */
const PulsingLine = ({ delay = 0 }: { delay?: number }) => (
  <div className="relative flex items-center justify-center w-full h-8 my-1">
    <div className="absolute inset-x-0 top-1/2 h-px bg-border/40" />
    <motion.div
      className="absolute left-0 top-1/2 h-px bg-primary/60"
      initial={{ width: "0%" }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
    />
    <motion.div
      className="relative z-10 w-7 h-7 rounded-full bg-card border border-primary/30 flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.6, type: "spring", stiffness: 300 }}
    >
      <Brain className="h-3.5 w-3.5 text-primary" />
    </motion.div>
  </div>
);

/* ───────── Main Section ───────── */
const KitchenNetworkSection = () => {
  const { t, i18n } = useTranslation();

  const scenarios = useMemo(() => [
    {
      id: "waste",
      branchA: { name: "Manhattan", flag: "🇺🇸" },
      problem: t("kitchenNetwork.scenarios.waste.problem"),
      aiLearning: t("kitchenNetwork.scenarios.waste.aiLearning"),
      branchesProtected: [
        { name: "London", flag: "🇬🇧" },
        { name: "Dubai", flag: "🇦🇪" },
        { name: "Sydney", flag: "🇦🇺" },
      ],
      prevention: t("kitchenNetwork.scenarios.waste.prevention"),
      saved: t("kitchenNetwork.scenarios.waste.saved"),
      tag: t("kitchenNetwork.scenarios.waste.tag"),
      tagColor: "bg-destructive/15 text-destructive border-destructive/20",
    },
    {
      id: "stockout",
      branchA: { name: "London", flag: "🇬🇧" },
      problem: t("kitchenNetwork.scenarios.stockout.problem"),
      aiLearning: t("kitchenNetwork.scenarios.stockout.aiLearning"),
      branchesProtected: [
        { name: "Manhattan", flag: "🇺🇸" },
        { name: "Lagos", flag: "🇳🇬" },
        { name: "Dubai", flag: "🇦🇪" },
      ],
      prevention: t("kitchenNetwork.scenarios.stockout.prevention"),
      saved: t("kitchenNetwork.scenarios.stockout.saved"),
      tag: t("kitchenNetwork.scenarios.stockout.tag"),
      tagColor: "bg-primary/15 text-primary border-primary/20",
    },
    {
      id: "seasonal",
      branchA: { name: "Dubai", flag: "🇦🇪" },
      problem: t("kitchenNetwork.scenarios.seasonal.problem"),
      aiLearning: t("kitchenNetwork.scenarios.seasonal.aiLearning"),
      branchesProtected: [
        { name: "Sydney", flag: "🇦🇺" },
        { name: "Lagos", flag: "🇳🇬" },
        { name: "Manhattan", flag: "🇺🇸" },
      ],
      prevention: t("kitchenNetwork.scenarios.seasonal.prevention"),
      saved: t("kitchenNetwork.scenarios.seasonal.saved"),
      tag: t("kitchenNetwork.scenarios.seasonal.tag"),
      tagColor: "bg-[hsl(var(--info)/.15)] text-[hsl(var(--info))] border-[hsl(var(--info)/.2)]",
    },
  ], [t]);

  const [activeScenario, setActiveScenario] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, scenarios.length]);

  const scenario = scenarios[activeScenario];

  return (
    <section className="py-20 md:py-32 border-t border-border/50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/[0.02] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-destructive/[0.01] blur-[120px]" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            {t("kitchenNetwork.badge")}
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="block"
            >
              <Trans
                i18nKey="kitchenNetwork.titleLine1"
                components={{ gold: <span className="relative inline-block" /> }}
              />
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-primary/40 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="block mt-1"
            >
              <Trans
                i18nKey="kitchenNetwork.titleLine2"
                components={{ gold: <span className="relative inline-block text-primary" /> }}
              />
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              />
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            {t("kitchenNetwork.subtitle")}
          </motion.p>
        </motion.div>

        {/* ───── Scenario Tabs ───── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-8 md:mb-10"
        >
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScenario(i);
                setIsAutoPlaying(false);
              }}
              className={`relative px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-300 border ${
                activeScenario === i
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/60 border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {s.tag}
              {activeScenario === i && (
                <motion.div
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                  layoutId="scenarioIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ───── Visual Story: The Learning Transfer ───── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 lg:gap-0 items-stretch">
              {/* ── Step 1: Problem Detected ── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-destructive/20 bg-card/80 backdrop-blur-sm p-5 sm:p-6 relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                    <WarningTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-destructive/70">{t("kitchenNetwork.steps.one.title")}</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <span>{scenario.branchA.flag}</span> {scenario.branchA.name}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-destructive/[0.06] border border-destructive/10 p-3.5 sm:p-4 mb-4">
                  <p className="text-xs sm:text-[13px] text-foreground/90 leading-relaxed font-medium">
                    {scenario.problem}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/[0.04] border border-primary/10 p-3.5 sm:p-4">
                  <div className="flex items-start gap-2.5">
                    <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-primary/60 font-semibold mb-1">{t("kitchenNetwork.aiLearning")}</p>
                      <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed">
                        {scenario.aiLearning}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Center: Transfer Animation ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex lg:flex-col items-center justify-center py-4 lg:py-0 lg:px-4 xl:px-6"
              >
                {/* Mobile: horizontal arrow */}
                <div className="lg:hidden flex items-center gap-2">
                  <div className="h-px w-8 bg-border/40" />
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center"
                    animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0)", "0 0 0 8px hsl(var(--primary) / 0.08)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <ShareAndroid className="h-4 w-4 text-primary" />
                  </motion.div>
                  <div className="h-px w-8 bg-border/40" />
                </div>

                {/* Desktop: vertical animated transfer */}
                <div className="hidden lg:flex flex-col items-center gap-1 h-full justify-center">
                  <div className="w-px h-8 bg-gradient-to-b from-transparent to-border/40" />
                  <motion.div
                    className="w-12 h-12 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center relative"
                    animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0)", "0 0 0 10px hsl(var(--primary) / 0.06)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <ShareAndroid className="h-5 w-5 text-primary" />
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border border-primary/20"
                      animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider my-1.5 text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Trans i18nKey="kitchenNetwork.transfer" components={{ br: <br /> }} />
                  </motion.div>
                  <div className="w-px h-8 bg-gradient-to-b from-border/40 to-transparent" />
                </div>
              </motion.div>

              {/* ── Step 2: Prevention Applied ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-[hsl(var(--success)/.25)] bg-card/80 backdrop-blur-sm p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--success)/.1)] border border-[hsl(var(--success)/.2)] flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--success)/.7)]">{t("kitchenNetwork.steps.two.title")}</p>
                    <p className="text-sm font-semibold text-foreground">{t("kitchenNetwork.steps.three.desc")}</p>
                  </div>
                </div>

                {/* Protected branches */}
                <div className="space-y-2.5 mb-4">
                  {scenario.branchesProtected.map((branch, i) => (
                    <motion.div
                      key={branch.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.12 }}
                      className="flex items-center gap-3 rounded-xl bg-[hsl(var(--success)/.04)] border border-[hsl(var(--success)/.1)] px-3.5 py-2.5"
                    >
                      <span className="text-base">{branch.flag}</span>
                      <span className="text-xs sm:text-[13px] font-medium text-foreground flex-1">{branch.name}</span>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3 text-[hsl(var(--success))]" />
                        <span className="text-[11px] text-[hsl(var(--success))] font-medium">{scenario.prevention}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Impact badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="rounded-xl bg-primary/[0.06] border border-primary/15 p-3.5 text-center"
                >
                  <p className="text-[10px] uppercase tracking-wider text-primary/60 font-semibold mb-1">{t("kitchenNetwork.networkImpact")}</p>
                  <p className="text-lg sm:text-xl font-bold text-primary">{scenario.saved}</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ───── Progress dots ───── */}
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          {scenarios.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveScenario(i);
                setIsAutoPlaying(false);
              }}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: activeScenario === i ? 32 : 12 }}
            >
              <div className="absolute inset-0 bg-border/40 rounded-full" />
              {activeScenario === i && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: isAutoPlaying ? 6 : 0.3, ease: "linear" }}
                />
              )}
              {activeScenario !== i && (
                <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ───── Bottom: How the flywheel works ───── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-16 md:mt-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/40 font-medium mb-8 text-center">
            {t("kitchenNetwork.flywheelTitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-border/30" />

            {[
              {
                step: "01",
                icon: WarningTriangle,
                title: t("kitchenNetwork.steps.one.desc"),
                desc: t("kitchenNetwork.steps.one.body"),
                color: "destructive",
              },
              {
                step: "02",
                icon: Brain,
                title: t("kitchenNetwork.steps.two.desc"),
                desc: t("kitchenNetwork.steps.two.body"),
                color: "primary",
              },
              {
                step: "03",
                icon: Globe,
                title: t("kitchenNetwork.steps.three.desc"),
                desc: t("kitchenNetwork.steps.three.body"),
                color: "success",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="text-center px-4 sm:px-6 relative"
              >
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center relative z-10 ${
                  item.color === "destructive"
                    ? "bg-destructive/10 border border-destructive/20"
                    : item.color === "primary"
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-[hsl(var(--success)/.1)] border border-[hsl(var(--success)/.2)]"
                }`}>
                  <item.icon className={`h-6 w-6 ${
                    item.color === "destructive"
                      ? "text-destructive"
                      : item.color === "primary"
                      ? "text-primary"
                      : "text-[hsl(var(--success))]"
                  }`} />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold mb-1.5">{i18n.resolvedLanguage === 'fr' ? 'Étape' : 'Step'} {item.step}</p>
                <p className="text-sm font-semibold text-foreground mb-1.5">{item.title}</p>
                <p className="text-[12px] text-muted-foreground/70 leading-relaxed">{item.desc}</p>

                {i < 2 && (
                  <ArrowRight className="hidden sm:block absolute -right-2 top-8 h-4 w-4 text-muted-foreground/30 z-10" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center text-[12px] sm:text-[13px] text-muted-foreground/50 mt-8 sm:mt-10 px-2 max-w-lg mx-auto"
          >
            {t("kitchenNetwork.flywheelFooter")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default KitchenNetworkSection;
