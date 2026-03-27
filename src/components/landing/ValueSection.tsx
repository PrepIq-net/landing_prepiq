import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, GraphUp, Timer, DollarCircle, Percentage } from "iconoir-react";
import { useTranslation } from "react-i18next";

const presets = [2000, 4000, 8000, 15000];

const ValueSection = () => {
  const { t, i18n } = useTranslation();
  const [spend, setSpend] = useState(4000);

  const metrics = [
    {
      value: "5–12%",
      label: t("value.metrics.waste.label"),
      desc: t("value.metrics.waste.desc"),
      icon: ArrowDown,
      color: "text-[hsl(var(--success))]",
      iconBg: "bg-[hsl(var(--success)/.1)]",
      border: "border-[hsl(var(--success)/.15)]",
    },
    {
      value: "3–8%",
      label: t("value.metrics.revenue.label"),
      desc: t("value.metrics.revenue.desc"),
      icon: GraphUp,
      color: "text-primary",
      iconBg: "bg-primary/10",
      border: "border-primary/15",
    },
    {
      value: "2+ hrs",
      label: t("value.metrics.saved.label"),
      desc: t("value.metrics.saved.desc"),
      icon: Timer,
      color: "text-foreground",
      iconBg: "bg-muted",
      border: "border-border",
    },
  ];

  // Monthly breakdown categories for the chart
  const breakdownCategories = [
    { key: "waste", label: t("value.calculator.categories.waste"), pctLow: 0.05, pctHigh: 0.12, color: "bg-[hsl(var(--success))]", textColor: "text-[hsl(var(--success))]" },
    { key: "stockout", label: t("value.calculator.categories.stockout"), pctLow: 0.03, pctHigh: 0.08, color: "bg-primary", textColor: "text-primary" },
    { key: "labor", label: t("value.calculator.categories.labor"), pctLow: 0.01, pctHigh: 0.03, color: "bg-[hsl(var(--info))]", textColor: "text-[hsl(var(--info))]" },
  ];

  const { low, high } = useMemo(
    () => ({
      low: Math.round(spend * 0.05),
      high: Math.round(spend * 0.12),
    }),
    [spend]
  );

  const midSavings = Math.round((low + high) / 2);
  const annualLow = low * 12;
  const annualHigh = high * 12;

  // Chart data: 6-month projection
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((label, i) => {
      const month = i + 1;
      const ramp = Math.min(1, 0.3 + month * 0.14);
      const waste = Math.round(spend * 0.08 * ramp);
      const stockout = Math.round(spend * 0.05 * ramp);
      const labor = Math.round(spend * 0.02 * ramp);
      const total = waste + stockout + labor;
      return { month, label, waste, stockout, labor, total };
    });
  }, [spend]);

  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);

  // Breakdown for current month
  const breakdown = useMemo(
    () =>
      breakdownCategories.map((cat) => ({
        ...cat,
        low: Math.round(spend * cat.pctLow),
        high: Math.round(spend * cat.pctHigh),
        mid: Math.round(spend * ((cat.pctLow + cat.pctHigh) / 2)),
      })),
    [spend]
  );

  return (
    <section id="value" className="py-20 md:py-24 border-t border-border/50">
      <div className="section-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-3 sm:mb-4 leading-tight lg:leading-[1.15]">
            {t("value.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {t("value.subtitle")}
          </p>
        </motion.div>

        {/* Metric cards */}
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 mb-12 md:mb-20">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border ${m.border} bg-card p-5 sm:p-8 space-y-3 sm:space-y-4 group hover:border-primary/30 transition-colors duration-300`}
            >
              <div className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${m.iconBg}`}>
                <m.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${m.color}`} />
              </div>
              <div>
                <p className={`text-3xl sm:text-4xl md:text-5xl font-display font-semibold ${m.color} tracking-tight`}>
                  {m.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-foreground mt-1.5 sm:mt-2">{m.label}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              <div className={`absolute top-0 right-0 h-16 w-16 rounded-tr-xl rounded-bl-[40px] ${m.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-xl sm:rounded-2xl border border-primary/20 bg-card overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-border flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("value.calculator.title")}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">{t("value.calculator.subtitle")}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Input side */}
            <div className="p-5 sm:p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("value.calculator.inputLabel")}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-muted-foreground font-medium">{i18n.resolvedLanguage === 'fr' ? '€' : '$'}</span>
                  <input
                    type="number"
                    value={spend}
                    onChange={(e) => setSpend(Math.max(0, Math.min(50000, Number(e.target.value) || 0)))}
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-3 sm:py-3.5 text-base sm:text-lg font-display font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={100}
                  value={spend}
                  onChange={(e) => setSpend(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsla(40,70%,39%,0.4)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-foreground [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_14px_hsla(40,70%,39%,0.6)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-foreground"
                  style={{
                    background: `linear-gradient(to right, hsl(40 70% 39%) 0%, hsl(40 70% 39%) ${((spend - 500) / (25000 - 500)) * 100}%, hsl(var(--secondary)) ${((spend - 500) / (25000 - 500)) * 100}%, hsl(var(--secondary)) 100%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50">
                  <span>$500</span>
                  <span>$25,000</span>
                </div>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSpend(p)}
                    className={`rounded-lg px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-200 ${
                      spend === p ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {i18n.resolvedLanguage === 'fr' ? `${p.toLocaleString()} €` : `$${p.toLocaleString()}`}
                  </button>
                ))}
              </div>

              {/* Savings summary */}
              <div className="space-y-3 pt-2">
                <div className="text-center space-y-1 p-4 rounded-xl bg-primary/[0.04] border border-primary/10">
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">{t("value.calculator.monthlyRecovery")}</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${low}-${high}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-2xl sm:text-3xl font-display font-semibold text-primary tracking-tight"
                    >
                      {i18n.resolvedLanguage === 'fr' ? `${low.toLocaleString()} € – ${high.toLocaleString()} €` : `$${low.toLocaleString()} – $${high.toLocaleString()}`}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <span className="text-xs text-muted-foreground">{t("value.calculator.annualImpact")}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${annualLow}-${annualHigh}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold text-foreground font-display"
                    >
                      {i18n.resolvedLanguage === 'fr' ? `${annualLow.toLocaleString()} € – ${annualHigh.toLocaleString()} €` : `$${annualLow.toLocaleString()} – $${annualHigh.toLocaleString()}`}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Chart side */}
            <div className="p-5 sm:p-8 space-y-6 bg-primary/[0.02]">
              {/* 6-month bar chart */}
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  {t("value.calculator.projection")}
                </p>
                <div className="flex items-end gap-3 sm:gap-4" style={{ height: "200px" }}>
                  {chartData.map((d, i) => {
                    const totalHeight = 200;
                    const barPx = Math.max((d.total / maxTotal) * (totalHeight - 40), 8);
                    const wastePx = d.total ? (d.waste / d.total) * barPx : 0;
                    const stockoutPx = d.total ? (d.stockout / d.total) * barPx : 0;
                    const laborPx = d.total ? (d.labor / d.total) * barPx : 0;

                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                        <motion.span
                          key={`val-${d.total}-${i}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground font-display"
                        >
                          {i18n.resolvedLanguage === 'fr'
                            ? `${d.total > 999 ? `${(d.total / 1000).toFixed(1)}k` : d.total} €`
                            : `$${d.total > 999 ? `${(d.total / 1000).toFixed(1)}k` : d.total}`}
                        </motion.span>

                        <motion.div
                          className="w-full max-w-[40px] rounded-md overflow-hidden flex flex-col origin-bottom"
                          style={{ height: barPx }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                        >
                          <div className="bg-[hsl(var(--success))]" style={{ height: wastePx }} />
                          <div className="bg-primary" style={{ height: stockoutPx }} />
                          <div className="bg-[hsl(var(--info))]" style={{ height: laborPx }} />
                        </motion.div>

                        <span className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-medium">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend / breakdown */}
              <div className="space-y-2.5">
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("value.calculator.breakdown")}
                </p>
                {breakdown.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2.5 w-2.5 rounded-sm ${cat.color}`} />
                      <span className="text-xs text-muted-foreground">{cat.label}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${cat.low}-${cat.high}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-xs font-semibold ${cat.textColor}`}
                      >
                        {i18n.resolvedLanguage === 'fr'
                          ? `${cat.low.toLocaleString()} € – ${cat.high.toLocaleString()} €`
                          : `$${cat.low.toLocaleString()} – $${cat.high.toLocaleString()}`}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* ROI note */}
              <div className="rounded-lg bg-[hsl(var(--success)/.08)] px-3 sm:px-4 py-2.5 sm:py-3 flex items-start gap-2.5">
                <Percentage className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                <p className="text-[11px] sm:text-xs text-[hsl(var(--success))] leading-relaxed">
                  {t("value.calculator.roiNote")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueSection;
