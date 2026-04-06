"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, FireFlame, Xmark, Trash, Cpu, Bell, Check, Percentage } from "iconoir-react";
import { useTranslation, Trans } from "react-i18next";

const KitchenTestSection = () => {
  const { t } = useTranslation();
  const [intelligenceOn, setIntelligenceOn] = useState(false);

  const WITHOUT_TIMELINE = [
    { time: "6:00 AM", label: t("kitchenTest.timeline.without.0.label"), icon: HelpCircle, detail: t("kitchenTest.timeline.without.0.detail") },
    { time: "11:45 AM", label: t("kitchenTest.timeline.without.1.label"), icon: FireFlame, detail: t("kitchenTest.timeline.without.1.detail") },
    { time: "7:10 PM", label: t("kitchenTest.timeline.without.2.label", { amount: "$64" }), icon: Xmark, detail: t("kitchenTest.timeline.without.2.detail", { amount: "$64" }) },
    { time: "10:00 PM", label: t("kitchenTest.timeline.without.3.label", { amount: "$42" }), icon: Trash, detail: t("kitchenTest.timeline.without.3.detail", { amount: "$42" }) },
  ];

  const WITH_TIMELINE = [
    { time: "6:00 AM", label: t("kitchenTest.timeline.with.0.label"), icon: Cpu, detail: t("kitchenTest.timeline.with.0.detail") },
    { time: "11:45 AM", label: t("kitchenTest.timeline.with.1.label"), icon: Bell, detail: t("kitchenTest.timeline.with.1.detail") },
    { time: "7:10 PM", label: t("kitchenTest.timeline.with.2.label"), icon: Check, detail: t("kitchenTest.timeline.with.2.detail") },
    { time: "10:00 PM", label: t("kitchenTest.timeline.with.3.label"), icon: Percentage, detail: t("kitchenTest.timeline.with.3.detail") },
  ];

  const WITHOUT_STATS = [
    { label: t("kitchenTest.stats.waste"), value: "$42", negative: true },
    { label: t("kitchenTest.stats.stockouts"), value: "2 items", negative: true },
    { label: t("kitchenTest.stats.lostRevenue"), value: "$64", negative: true },
    { label: t("kitchenTest.netImpact"), value: "−$106", negative: true },
  ];

  const WITH_STATS = [
    { label: t("kitchenTest.stats.waste"), value: "$9", negative: false },
    { label: t("kitchenTest.stats.stockouts"), value: "0", negative: false },
    { label: t("kitchenTest.stats.recovered"), value: "+$64", negative: false },
    { label: t("kitchenTest.netImpact"), value: "+$55", negative: false },
  ];

  const SLIDER_DATA = {
    off: { prep: "30 kg", sold: "24 kg", waste: "6 kg", wasteCost: "$42", accuracy: "—" },
    on: { prep: "25 kg", sold: "24 kg", waste: "1 kg", wasteCost: "$7", accuracy: "96%" },
  };

  const timeline = intelligenceOn ? WITH_TIMELINE : WITHOUT_TIMELINE;
  const stats = intelligenceOn ? WITH_STATS : WITHOUT_STATS;
  const sliderData = intelligenceOn ? SLIDER_DATA.on : SLIDER_DATA.off;

  return (
    <section className="relative py-20 sm:py-28 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20 px-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4"
          >
            {t("kitchenTest.badge")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]"
          >
            <Trans
              i18nKey="kitchenTest.title"
              components={{ gold: <span className="text-gradient-gold" /> }}
            />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            {t("kitchenTest.subtitle")}
          </motion.p>
        </div>

        {/* Intelligence Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-14"
        >
          <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ${!intelligenceOn ? "text-destructive" : "text-muted-foreground/30"}`}>
            {t("kitchenTest.toggleWithout")}
          </span>
          <button
            onClick={() => setIntelligenceOn(!intelligenceOn)}
            className={`relative w-[56px] sm:w-[68px] h-8 sm:h-9 rounded-full transition-all duration-500 shadow-inner ${
              intelligenceOn
                ? "bg-[hsl(var(--success))] shadow-[inset_0_1px_3px_hsl(var(--success)/.3)]"
                : "bg-destructive/50 shadow-[inset_0_1px_3px_hsl(var(--destructive)/.3)]"
            }`}
          >
            <motion.div
              animate={{ x: intelligenceOn ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 27 : 34) : 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-1 sm:top-1.5 h-6 w-6 rounded-full bg-foreground shadow-lg"
            />
          </button>
          <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ${intelligenceOn ? "text-[hsl(var(--success))]" : "text-muted-foreground/30"}`}>
            {t("kitchenTest.toggleWith")}
          </span>
        </motion.div>

        {/* Main grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* Timeline Column */}
          <div className="md:col-span-2 rounded-xl sm:rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.2)]">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-4 border-b border-border/50 bg-accent/40">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-colors duration-500 ${
                  intelligenceOn ? "bg-[hsl(var(--success))] animate-pulse" : "bg-destructive"
                }`} />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {intelligenceOn ? t("kitchenTest.intelligentDay") : t("kitchenTest.traditionalDay")}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground/50">{t("kitchenTest.timeRange")}</span>
            </div>

            <div className="p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-6">
              {/* Timeline events */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={intelligenceOn ? "on" : "off"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5 sm:space-y-3"
                >
                  {timeline.map((item, i) => (
                    <motion.div
                      key={item.time + item.label}
                      initial={{ opacity: 0, x: intelligenceOn ? 16 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.1, duration: 0.4 }}
                      className="flex items-start gap-2.5 sm:gap-4 rounded-xl px-3 sm:px-5 py-3 sm:py-4 bg-accent/40 border border-border/20 group"
                    >
                      {/* Time */}
                      <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 w-[52px] sm:w-[68px] shrink-0 pt-0.5">{item.time}</span>

                      {/* Connector */}
                      <div className="relative flex flex-col items-center pt-0.5 hidden sm:flex">
                        <div className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 transition-colors duration-500 ${
                          intelligenceOn ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/.15)]" : "border-destructive bg-destructive/15"
                        }`} />
                        {i < timeline.length - 1 && (
                          <div className={`absolute top-4 w-px h-12 transition-colors duration-500 ${
                            intelligenceOn ? "bg-[hsl(var(--success)/.12)]" : "bg-destructive/12"
                          }`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                        <div className={`flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center ${intelligenceOn ? "bg-[hsl(var(--success)/.1)]" : "bg-destructive/10"}`}>
                          <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${intelligenceOn ? "text-[hsl(var(--success))]" : "text-destructive"}`} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">{item.label}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground/50 mt-0.5 sm:mt-1">{item.detail}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Rice prep example */}
              <div className="pt-4 sm:pt-5 border-t border-border/50">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/40 mb-3 sm:mb-4 font-medium">
                  {t("kitchenTest.riceExample")}
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={intelligenceOn ? "on" : "off"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-3 gap-2.5 sm:gap-5"
                  >
                    {[
                      { label: t("kitchenTest.prepped"), value: sliderData.prep },
                      { label: t("kitchenTest.sold"), value: sliderData.sold },
                      { label: t("kitchenTest.waste"), value: sliderData.waste },
                    ].map((d) => (
                      <div key={d.label} className="text-center rounded-xl bg-accent/30 border border-border/20 py-3 sm:py-4 px-2 sm:px-3">
                        <p className={`text-lg sm:text-2xl font-semibold ${
                          d.label === t("kitchenTest.waste")
                            ? (intelligenceOn ? "text-[hsl(var(--success))]" : "text-destructive")
                            : "text-foreground"
                        }`}>
                          {d.value}
                        </p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground/50 mt-1 sm:mt-1.5 uppercase tracking-wider">{d.label}</p>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.2)] flex flex-col">
            {/* Card header */}
            <div className="px-4 sm:px-7 py-3 sm:py-4 border-b border-border/50 bg-accent/40">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/40 font-medium">{t("kitchenTest.endOfDay")}</span>
            </div>

            <div className="p-4 sm:p-6 md:p-7 flex-1 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={intelligenceOn ? "on" : "off"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 + 0.15 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
                        <span className={`text-lg sm:text-xl font-semibold ${stat.negative ? "text-destructive" : "text-[hsl(var(--success))]"}`}>
                          {stat.value}
                        </span>
                      </div>
                      {stat.label !== t("kitchenTest.netImpact") && (
                        <div className="h-px bg-border/30 mt-2.5 sm:mt-3" />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Bottom summary */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={intelligenceOn ? "on" : "off"}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.35 }}
                  className={`mt-6 sm:mt-8 rounded-xl p-4 sm:p-5 text-center transition-colors duration-500 ${
                    intelligenceOn
                      ? "bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)]"
                      : "bg-destructive/5 border border-destructive/15"
                  }`}
                >
                  <p className={`text-2xl sm:text-3xl font-bold ${intelligenceOn ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                    {intelligenceOn ? "+$55" : "−$106"}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground/60 mt-1.5 sm:mt-2">
                    {intelligenceOn ? t("kitchenTest.dailyMarginRecovered") : t("kitchenTest.dailyMarginLost")}
                  </p>
                  <p className="text-[10px] text-muted-foreground/40 mt-1">
                    {intelligenceOn
                      ? t("kitchenTest.monthlySaved", { amount: "$1,650" })
                      : t("kitchenTest.monthlyLosses", { amount: "$3,180" })}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitchenTestSection;
