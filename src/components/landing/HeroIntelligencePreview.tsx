import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "forecast" | "adjust" | "live" | "result";

const phases: { key: Phase; label: string; duration: number }[] = [
  { key: "forecast", label: "Morning Forecast", duration: 6000 },
  { key: "adjust", label: "Chef Adjusts", duration: 5500 },
  { key: "live", label: "Live Service", duration: 5500 },
  { key: "result", label: "End of Day", duration: 6000 },
];

const forecastItems = [
  { name: "Grilled Salmon", qty: "25 kg", confidence: 91, trend: "↑ 12% vs last Tue" },
  { name: "Caesar Salad", qty: "40 portions", confidence: 84, trend: "Steady" },
  { name: "Tomato Soup", qty: "15 L", confidence: 88, trend: "↓ 5% — rain forecast" },
];

const liveItems = [
  { name: "Grilled Salmon", sold: "22 kg", remaining: "8 kg", pct: 73, status: "on-track" as const },
  { name: "Caesar Salad", sold: "35 portions", remaining: "5 portions", pct: 87, status: "warning" as const },
  { name: "Tomato Soup", sold: "14 L", remaining: "1 L", pct: 93, status: "critical" as const },
];

const resultStats = [
  { label: "Waste Saved", value: "$42", accent: true },
  { label: "Accuracy", value: "93%", accent: false },
  { label: "Stockouts", value: "0", accent: true },
  { label: "Margin Impact", value: "+2.4%", accent: false },
];

const ConfidenceBar = ({ value, delay = 0 }: { value: number; delay?: number }) => (
  <div className="h-1.5 w-20 rounded-full bg-accent overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1.2, delay: delay + 0.4, ease: "easeOut" }}
      className={`h-full rounded-full ${
        value >= 90 ? "bg-[hsl(var(--success))]" : value >= 80 ? "bg-primary" : "bg-[hsl(var(--warning))]"
      }`}
    />
  </div>
);

const ProgressRing = ({ pct, status }: { pct: number; status: "on-track" | "warning" | "critical" }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const color = status === "on-track" ? "hsl(var(--success))" : status === "warning" ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--accent))" strokeWidth="3" />
      <motion.circle
        cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="10" fontWeight="600">
        {pct}%
      </text>
    </svg>
  );
};

const transition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };

const HeroIntelligencePreview = () => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx].key;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIdx((prev) => (prev + 1) % phases.length);
    }, phases[phaseIdx].duration);
    return () => clearTimeout(timer);
  }, [phaseIdx]);

  return (
    <div className="w-full rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden shadow-l2">
      {/* Top chrome bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-border bg-accent/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-foreground tracking-tight">PrepIQ</span>
          </div>
        </div>

        {/* Phase tabs */}
        <div className="hidden sm:flex items-center gap-1">
          {phases.map((p, i) => (
            <button
              key={p.key}
              onClick={() => setPhaseIdx(i)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                i === phaseIdx
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Mobile phase indicator */}
        <div className="flex sm:hidden items-center gap-1.5">
          {phases.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === phaseIdx ? "w-5 bg-primary" : "w-1 bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main content — taller */}
      <div className="h-[340px] sm:h-[380px] md:h-[420px] overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ─── FORECAST ─── */}
          {phase === "forecast" && (
            <motion.div key="forecast" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={transition} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">Today's Forecast</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tuesday, March 8 — 3 items predicted</p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                  <span className="text-xs text-muted-foreground">Model updated 2h ago</span>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {forecastItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.2, duration: 0.5 }}
                    className="flex items-center justify-between rounded-xl bg-accent/40 px-3 sm:px-5 py-3 sm:py-4 group hover:bg-accent/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-semibold text-primary">
                        {item.name[0]}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-0.5">{item.trend}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5">
                      <div className="hidden sm:block">
                        <ConfidenceBar value={item.confidence} delay={i * 0.15} />
                      </div>
                      <div className="text-right min-w-[50px] sm:min-w-[70px]">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">{item.qty}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/50">{item.confidence}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── CHEF ADJUSTS ─── */}
          {phase === "adjust" && (
            <motion.div key="adjust" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={transition} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground/60">Chef Override</p>

              <div className="rounded-xl border border-border bg-accent/30 p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-semibold text-primary">G</div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-foreground">Grilled Salmon</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-0.5">AI suggested 25 kg</p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">25 kg</span>
                    <span className="text-lg sm:text-xl font-semibold text-primary">30 kg</span>
                  </motion.div>
                </div>

                <div className="h-px bg-border" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="rounded-lg border border-[hsl(var(--warning)/.2)] bg-[hsl(var(--warning)/.04)] p-3 sm:p-5 space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))]" />
                    <span className="text-[10px] sm:text-xs font-medium text-[hsl(var(--warning))]">Risk Assessment</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground/50 uppercase tracking-wider mb-1">Waste risk</p>
                      <p className="text-sm sm:text-base font-semibold text-[hsl(var(--warning))]">$6.20</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground/50 uppercase tracking-wider mb-1">Confidence</p>
                      <p className="text-sm sm:text-base font-semibold text-foreground">82%</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground/50 uppercase tracking-wider mb-1">Override</p>
                      <p className="text-sm sm:text-base font-semibold text-foreground">67%</p>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 italic">Tuesday demand typically drops 8% vs Monday.</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─── LIVE SERVICE ─── */}
          {phase === "live" && (
            <motion.div key="live" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={transition} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[hsl(var(--success))] font-medium">Live Tracking</p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground/50">Updated 30s ago</span>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {liveItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.2, duration: 0.5 }}
                    className="flex items-center justify-between rounded-xl bg-accent/40 px-3 sm:px-5 py-3 sm:py-4"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-4">
                      <div className="hidden sm:block">
                        <ProgressRing pct={item.pct} status={item.status} />
                      </div>
                      <div className="sm:hidden flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold" style={{
                        backgroundColor: item.status === "on-track" ? "hsl(var(--success) / 0.1)" : item.status === "warning" ? "hsl(var(--warning) / 0.1)" : "hsl(var(--destructive) / 0.1)",
                        color: item.status === "on-track" ? "hsl(var(--success))" : item.status === "warning" ? "hsl(var(--warning))" : "hsl(var(--destructive))"
                      }}>
                        {item.pct}%
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-0.5">Sold {item.sold}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-semibold text-foreground">{item.remaining}</p>
                      <span className={`text-[10px] sm:text-xs font-medium ${
                        item.status === "on-track" ? "text-[hsl(var(--success))]" :
                        item.status === "warning" ? "text-[hsl(var(--warning))]" :
                        "text-destructive"
                      }`}>
                        {item.status === "on-track" ? "On Track" : item.status === "warning" ? "Low" : "⚠ Risk"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse shrink-0" />
                <p className="text-[10px] sm:text-xs text-destructive">Tomato Soup trending to stockout by 7:30 PM — consider +3 L batch</p>
              </motion.div>
            </motion.div>
          )}

          {/* ─── END OF DAY ─── */}
          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={transition} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-primary/80 font-medium">End of Day Summary</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
                {resultStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.12 + 0.25, type: "spring", stiffness: 300, damping: 25 }}
                    className="rounded-xl bg-accent/40 p-3 sm:p-5 text-center"
                  >
                    <p className={`text-xl sm:text-2xl md:text-3xl font-semibold ${stat.accent ? "text-[hsl(var(--success))]" : "text-primary"}`}>
                      {stat.value}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground/50 mt-1 sm:mt-2 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="rounded-xl bg-[hsl(var(--success)/.06)] border border-[hsl(var(--success)/.15)] p-3 sm:p-5 flex items-center gap-3 sm:gap-4"
              >
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-[hsl(var(--success)/.1)] flex items-center justify-center shrink-0">
                  <span className="text-[hsl(var(--success))] text-sm sm:text-base">✓</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">Today's prep was 93% accurate</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-0.5">You saved $42 in waste and prevented 0 stockouts.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom progress bar */}
      <div className="px-3 sm:px-6 pb-3 sm:pb-5 pt-1">
        <div className="h-0.5 w-full rounded-full bg-accent overflow-hidden">
          <motion.div
            key={phaseIdx}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: phases[phaseIdx].duration / 1000, ease: "linear" }}
            className="h-full rounded-full bg-primary/40"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroIntelligencePreview;
