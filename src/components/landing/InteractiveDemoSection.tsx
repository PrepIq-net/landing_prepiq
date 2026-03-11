import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ─── */
interface MenuItem {
  name: string;
  aiQty: number;
  unit: string;
  confidence: number;
  chefQty: number | null;
  sold: number;
}

interface TimelineStep {
  key: string;
  time: string;
  label: string;
  desc: string;
}

/* ─── Data ─── */
const timeline: TimelineStep[] = [
  { key: "forecast", time: "6:00 AM", label: "Forecast Ready", desc: "PrepIQ analyzes 8 signal layers and generates your prep list." },
  { key: "adjust", time: "7:15 AM", label: "Chef Reviews", desc: "Your team reviews, adjusts, and commits the prep plan." },
  { key: "live", time: "12:30 PM", label: "Live Service", desc: "Real-time tracking alerts you before stockouts happen." },
  { key: "result", time: "10:00 PM", label: "Day Closes", desc: "See exactly what you saved — the model learns for tomorrow." },
];

const initialMenu: MenuItem[] = [
  { name: "Grilled Salmon", aiQty: 25, unit: "kg", confidence: 91, chefQty: null, sold: 23 },
  { name: "Caesar Salad", aiQty: 40, unit: "portions", confidence: 84, chefQty: null, sold: 38 },
  { name: "Tomato Soup", aiQty: 15, unit: "L", confidence: 88, chefQty: null, sold: 16 },
  { name: "Pasta Carbonara", aiQty: 12, unit: "kg", confidence: 79, chefQty: null, sold: 10 },
];

/* ─── Helpers ─── */
const getConfColor = (v: number) =>
  v >= 90 ? "text-[hsl(var(--success))]" : v >= 80 ? "text-primary" : "text-[hsl(var(--warning))]";

const getConfBg = (v: number) =>
  v >= 90 ? "bg-[hsl(var(--success))]" : v >= 80 ? "bg-primary" : "bg-[hsl(var(--warning))]";

const getStatusInfo = (finalQty: number, sold: number) => {
  const remaining = finalQty - sold;
  const pct = Math.round((sold / finalQty) * 100);
  if (remaining <= 0) return { label: "Sold Out", color: "text-destructive", pct: 100 };
  if (pct >= 85) return { label: "Running Low", color: "text-[hsl(var(--warning))]", pct };
  return { label: "On Track", color: "text-[hsl(var(--success))]", pct };
};

/* ─── Component ─── */
const InteractiveDemoSection = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const step = timeline[stepIdx].key;

  const adjustQty = useCallback((idx: number, delta: number) => {
    setMenu(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const current = item.chefQty ?? item.aiQty;
      const next = Math.max(0, current + delta);
      return { ...item, chefQty: next === item.aiQty ? null : next };
    }));
  }, []);

  const goNext = () => {
    if (stepIdx < timeline.length - 1) setStepIdx(stepIdx + 1);
  };
  const goPrev = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };
  const reset = () => {
    setStepIdx(0);
    setMenu(initialMenu);
  };

  const hasOverrides = menu.some(m => m.chefQty !== null);
  const totalWaste = menu.reduce((sum, item) => {
    const finalQty = item.chefQty ?? item.aiQty;
    return sum + Math.max(0, finalQty - item.sold) * 1.8;
  }, 0);
  const aiOnlyWaste = menu.reduce((sum, item) => sum + Math.max(0, item.aiQty - item.sold) * 1.8, 0);
  const accuracy = Math.round(menu.reduce((sum, item) => {
    const finalQty = item.chefQty ?? item.aiQty;
    return sum + (1 - Math.abs(finalQty - item.sold) / finalQty) * 100;
  }, 0) / menu.length);

  const transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };

  return (
    <section className="py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.02),transparent_70%)] pointer-events-none" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            Live Simulation
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-5 leading-tight lg:leading-[1.15]">
            Walk Through a Day With PrepIQ
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-[15px]">
            From morning forecast to end-of-day results — interact with each step and see the impact.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="flex items-center justify-between mb-10 px-2">
            {timeline.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setStepIdx(i)}
                className="flex flex-col items-center gap-2 group relative"
              >
                {/* Connector line */}
                {i < timeline.length - 1 && (
                  <div className="absolute top-3 left-[calc(50%+12px)] h-px w-[calc(100%+40px)] sm:w-[calc(100%+60px)] md:w-[calc(100%+80px)]">
                    <div className={`h-full transition-colors duration-300 ${i < stepIdx ? "bg-primary/40" : "bg-border"}`} />
                  </div>
                )}
                <div className={`relative z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  i === stepIdx ? "border-primary bg-primary/10 scale-110" :
                  i < stepIdx ? "border-primary/40 bg-primary/5" :
                  "border-border bg-card"
                }`}>
                  <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                    i === stepIdx ? "bg-primary" : i < stepIdx ? "bg-primary/40" : "bg-muted-foreground/20"
                  }`} />
                </div>
                <div className="text-center">
                  <p className={`text-[10px] font-semibold transition-colors ${i === stepIdx ? "text-primary" : "text-muted-foreground/40"}`}>
                    {t.time}
                  </p>
                  <p className={`text-[11px] font-medium transition-colors hidden sm:block ${i === stepIdx ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {t.label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Main panel */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-l2">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border bg-accent/30">
              <div>
                <p className="text-sm font-medium text-foreground">{timeline[stepIdx].label}</p>
                <p className="text-[11px] text-muted-foreground/60">{timeline[stepIdx].desc}</p>
              </div>
              <span className="text-xs text-muted-foreground/40 font-medium">{timeline[stepIdx].time}</span>
            </div>

            {/* Content */}
            <div className="min-h-[380px]">
              <AnimatePresence mode="wait">
                {/* ─── FORECAST ─── */}
                {step === "forecast" && (
                  <motion.div key="forecast" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={transition} className="p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">Prep List — 4 items</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground/40">
                        <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                        Model confidence: high
                      </div>
                    </div>

                    <div className="space-y-2">
                      {menu.map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 + 0.1 }}
                          className="flex items-center justify-between rounded-xl bg-accent/40 px-4 py-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {item.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground/50">AI prediction</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-1 w-12 rounded-full bg-accent overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.confidence}%` }}
                                transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                                className={`h-full rounded-full ${getConfBg(item.confidence)}`}
                              />
                            </div>
                            <div className="text-right min-w-[56px]">
                              <p className="text-sm font-semibold text-foreground">{item.aiQty} {item.unit}</p>
                              <p className={`text-[10px] font-medium ${getConfColor(item.confidence)}`}>{item.confidence}%</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─── CHEF ADJUSTS ─── */}
                {step === "adjust" && (
                  <motion.div key="adjust" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={transition} className="p-5 md:p-6 space-y-4">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">
                      Adjust quantities — see the impact in real time
                    </p>

                    <div className="space-y-2">
                      {menu.map((item, i) => {
                        const finalQty = item.chefQty ?? item.aiQty;
                        const diff = finalQty - item.aiQty;
                        return (
                          <div key={item.name} className="flex items-center justify-between rounded-xl bg-accent/40 px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                {item.name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-[11px] text-muted-foreground/50">
                                  AI: {item.aiQty} {item.unit}
                                  {diff !== 0 && (
                                    <span className={diff > 0 ? "text-[hsl(var(--warning))] ml-1" : "text-[hsl(var(--success))] ml-1"}>
                                      ({diff > 0 ? "+" : ""}{diff})
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => adjustQty(i, -1)}
                                className="h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors text-xs font-bold"
                              >
                                −
                              </button>
                              <span className={`text-sm font-semibold min-w-[48px] text-center ${
                                item.chefQty !== null ? "text-primary" : "text-foreground"
                              }`}>
                                {finalQty} {item.unit}
                              </span>
                              <button
                                onClick={() => adjustQty(i, 1)}
                                className="h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Risk summary */}
                    {hasOverrides && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-[hsl(var(--warning)/.2)] bg-[hsl(var(--warning)/.04)] p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))]" />
                          <span className="text-[11px] font-medium text-[hsl(var(--warning))]">Impact of your adjustments</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Waste risk change</p>
                            <p className="text-sm font-semibold text-[hsl(var(--warning))]">
                              +${(totalWaste - aiOnlyWaste).toFixed(0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Projected accuracy</p>
                            <p className="text-sm font-semibold text-foreground">{accuracy}%</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ─── LIVE SERVICE ─── */}
                {step === "live" && (
                  <motion.div key="live" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={transition} className="p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                        <p className="text-[11px] uppercase tracking-[0.15em] text-[hsl(var(--success))] font-medium">Service Active</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground/40">4.5 hrs into service</span>
                    </div>

                    <div className="space-y-2">
                      {menu.map((item, i) => {
                        const finalQty = item.chefQty ?? item.aiQty;
                        const status = getStatusInfo(finalQty, item.sold);
                        const remaining = finalQty - item.sold;

                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 + 0.1 }}
                            className="rounded-xl bg-accent/40 px-4 py-3.5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                  {item.name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                                  <p className="text-[11px] text-muted-foreground/50">
                                    Sold: {item.sold} {item.unit} · Left: {Math.max(0, remaining)} {item.unit}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-[11px] font-medium ${status.color}`}>{status.label}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(status.pct, 100)}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                                className={`h-full rounded-full ${
                                  status.pct >= 90 ? "bg-destructive" : status.pct >= 75 ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--success))]"
                                }`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Stockout alert for soup if over-sold */}
                    {(() => {
                      const soup = menu[2];
                      const pQty = soup.chefQty ?? soup.aiQty;
                      if (soup.sold >= pQty) return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                          <p className="text-[11px] text-destructive">Tomato Soup sold out — consider a +3 L batch to cover remaining service</p>
                        </motion.div>
                      );
                      if (soup.sold / pQty > 0.85) return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                          className="rounded-lg border border-[hsl(var(--warning)/.2)] bg-[hsl(var(--warning)/.05)] px-4 py-2.5 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))] animate-pulse" />
                          <p className="text-[11px] text-[hsl(var(--warning))]">Tomato Soup trending to sell out by 8:00 PM</p>
                        </motion.div>
                      );
                      return null;
                    })()}
                  </motion.div>
                )}

                {/* ─── RESULTS ─── */}
                {step === "result" && (
                  <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={transition} className="p-5 md:p-6 space-y-5">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-primary/80 font-medium">Today's Performance</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Waste Saved", value: `$${Math.max(0, Math.round(80 - totalWaste))}`, color: "text-[hsl(var(--success))]" },
                        { label: "Accuracy", value: `${accuracy}%`, color: "text-primary" },
                        { label: "Stockouts", value: menu.some(m => m.sold >= (m.chefQty ?? m.aiQty)) ? "1" : "0", color: menu.some(m => m.sold >= (m.chefQty ?? m.aiQty)) ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]" },
                        { label: "Margin Impact", value: `+${Math.max(0, (2.4 - (totalWaste - aiOnlyWaste) * 0.03)).toFixed(1)}%`, color: "text-primary" },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.08 + 0.15, type: "spring", stiffness: 300, damping: 25 }}
                          className="rounded-xl bg-accent/40 p-4 text-center"
                        >
                          <p className={`text-xl md:text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Per-item breakdown */}
                    <div className="space-y-2">
                      {menu.map((item) => {
                        const finalQty = item.chefQty ?? item.aiQty;
                        const waste = Math.max(0, finalQty - item.sold);
                        return (
                          <div key={item.name} className="flex items-center justify-between rounded-xl bg-accent/30 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-semibold text-primary">{item.name[0]}</div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                            </div>
                            <div className="flex items-center gap-4 text-[11px]">
                              <span className="text-muted-foreground/50">Prepped: {finalQty}</span>
                              <span className="text-muted-foreground/50">Sold: {item.sold}</span>
                              <span className={waste > 0 ? "text-[hsl(var(--warning))] font-medium" : "text-[hsl(var(--success))] font-medium"}>
                                {waste > 0 ? `${waste} ${item.unit} waste` : "Perfect"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="rounded-xl bg-[hsl(var(--success)/.06)] border border-[hsl(var(--success)/.15)] p-4 flex items-center gap-3"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[hsl(var(--success)/.1)] flex items-center justify-center shrink-0">
                        <span className="text-[hsl(var(--success))] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {hasOverrides ? "Your overrides changed the outcome" : "AI-only prep was near-perfect today"}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60">
                          Tomorrow's model will factor in today's results. Accuracy improves daily.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-t border-border bg-accent/20">
              <button
                onClick={goPrev}
                disabled={stepIdx === 0}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {timeline.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
                    i === stepIdx ? "w-5 bg-primary" : "w-1 bg-muted-foreground/20"
                  }`} />
                ))}
              </div>

              {stepIdx < timeline.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Next <ArrowRight className="h-3 w-3" />
                </button>
              ) : (
                <button
                  onClick={reset}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Restart ↻
                </button>
              )}
            </div>
          </div>

          {/* CTA below demo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <p className="text-sm text-muted-foreground mb-4">
              That's one day. Imagine this running across every branch, every day.
            </p>
            <Button variant="hero" size="xl" className="group">
              <span className="flex items-center gap-2">
                Start Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
