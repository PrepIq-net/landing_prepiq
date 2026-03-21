import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Calendar,
  TrendingUp,
  Trophy,
  AlertTriangle,
  ChefHat,
  ArrowRight,
  Brain,
  ChevronRight,
  Network,
} from "lucide-react";

interface Signal {
  id: string;
  icon: React.ReactNode;
  label: string;
  detail: string;
  enabled: boolean;
  // How this signal affects each item
  effects: Record<string, { delta: number; reason: string }>;
}

interface PrepItem {
  id: string;
  name: string;
  unit: string;
  base: number;
  emoji: string;
}

const PREP_ITEMS: PrepItem[] = [
  { id: "chicken", name: "Chicken", unit: "pieces", base: 40, emoji: "🍗" },
  { id: "soup", name: "Soup", unit: "litres", base: 12, emoji: "🍲" },
  { id: "vegetables", name: "Vegetables", unit: "kg", base: 8, emoji: "🥬" },
  { id: "rice", name: "Rice", unit: "kg", base: 15, emoji: "🍚" },
];

const INITIAL_SIGNALS: Signal[] = [
  {
    id: "day",
    icon: <Calendar className="h-4 w-4" />,
    label: "Tuesday Pattern",
    detail: "Historically 6% lower foot traffic",
    enabled: true,
    effects: {
      chicken: { delta: -2, reason: "Lower weekday traffic" },
      rice: { delta: -1, reason: "Reduced midday orders" },
    },
  },
  {
    id: "weather",
    icon: <Cloud className="h-4 w-4" />,
    label: "Rain at 2 PM",
    detail: "+18% soup demand on rainy days",
    enabled: true,
    effects: {
      soup: { delta: 2, reason: "Rainy day comfort food spike" },
      chicken: { delta: -1, reason: "Fewer walk-ins during rain" },
    },
  },
  {
    id: "trend",
    icon: <TrendingUp className="h-4 w-4" />,
    label: "Chicken Trending",
    detail: "+7% demand over last 7 days",
    enabled: true,
    effects: {
      chicken: { delta: 4, reason: "Sustained weekly demand growth" },
    },
  },
  {
    id: "event",
    icon: <Trophy className="h-4 w-4" />,
    label: "Local Match Tonight",
    detail: "Evening rush expected +22%",
    enabled: true,
    effects: {
      chicken: { delta: 3, reason: "Game-day order surge" },
      rice: { delta: 2, reason: "Combo meals spike on match days" },
    },
  },
  {
    id: "stockout",
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Vegetable Stockout Yesterday",
    detail: "Under-prep flagged, 14 orders missed",
    enabled: true,
    effects: {
      vegetables: { delta: 3, reason: "Compensate for yesterday's shortfall" },
    },
  },
  {
    id: "chef",
    icon: <ChefHat className="h-4 w-4" />,
    label: "Chef Override History",
    detail: "Chef increased vegetables 80% of Tuesdays",
    enabled: true,
    effects: {
      vegetables: { delta: 1, reason: "Chef's recurring Tuesday adjustment" },
    },
  },
  {
    id: "network",
    icon: <Network className="h-4 w-4" />,
    label: "Branch Network Intelligence",
    detail: "London branch wasted 6kg chicken on rainy Tuesdays",
    enabled: true,
    effects: {
      chicken: { delta: -3, reason: "London's rainy-Tuesday waste pattern applied" },
      soup: { delta: 2, reason: "Dubai saw +30% soup demand in similar weather" },
      rice: { delta: -1, reason: "Sydney's Tuesday rice over-prep insight" },
    },
  },
];

const AIThinkingSection = () => {
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSignal = useCallback((id: string) => {
    // Immediately toggle the signal visually
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    
    // Show processing state with simulated latency
    setIsProcessing(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsProcessing(false);
    }, 800 + Math.random() * 700); // 800-1500ms random delay
  }, []);

  const enabledSignals = signals.filter((s) => s.enabled);

  // Compute prep recommendations based on active signals
  const recommendations = useMemo(() => {
    return PREP_ITEMS.map((item) => {
      let total = item.base;
      const activeReasons: string[] = [];

      enabledSignals.forEach((signal) => {
        const effect = signal.effects[item.id];
        if (effect) {
          total += effect.delta;
          activeReasons.push(effect.reason);
        }
      });

      const delta = total - item.base;
      return { ...item, recommended: total, delta, reasons: activeReasons };
    });
  }, [enabledSignals]);

  // Confidence based on how many signals are active
  const confidence = useMemo(() => {
    const ratio = enabledSignals.length / signals.length;
    return Math.round(72 + ratio * 21); // 72-93%
  }, [enabledSignals.length, signals.length]);

  // Active analysis insights derived from enabled signals
  const analysisInsights = useMemo(() => {
    const insights: string[] = [];
    const enabled = new Set(enabledSignals.map((s) => s.id));

    if (enabled.has("weather"))
      insights.push("Demand volatility expected — comfort food bias detected.");
    if (enabled.has("trend"))
      insights.push("Chicken demand in sustained upward trend.");
    if (enabled.has("stockout"))
      insights.push(
        "Yesterday's vegetable stockout signals chronic under-prep risk."
      );
    if (enabled.has("event"))
      insights.push(
        "Local event detected — evening rush pattern from similar events."
      );
    if (enabled.has("day"))
      insights.push("Tuesday baseline historically lower than weekend.");
    if (enabled.has("chef"))
      insights.push(
        "Chef override patterns suggest recurring Tuesday adjustment."
      );
    if (enabled.has("network"))
      insights.push(
        "Cross-branch intelligence: 3 locations flagged similar patterns — adjustments auto-applied."
      );

    if (insights.length === 0)
      insights.push("Insufficient signals for high-confidence forecast.");

    return insights;
  }, [enabledSignals]);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Subtle square pattern */}
      <div className="absolute inset-0 pattern-squares opacity-50 pointer-events-none" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.03] blur-[160px] pointer-events-none" />

      <div className="section-container px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 mb-5 sm:mb-6"
          >
            <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
            <span className="text-[11px] sm:text-xs text-muted-foreground">
              Transparent AI Reasoning
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold leading-tight lg:leading-[1.15] tracking-[-0.02em] text-foreground font-display mb-3 sm:mb-4"
          >
            What PrepIQ Sees{" "}
            <span className="text-gradient-gold">Before Your Kitchen Opens</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            Every morning, PrepIQ analyzes signals your team could never track
            manually.
          </motion.p>
        </div>

        {/* Three-column flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 sm:gap-6 lg:gap-0 items-start"
        >
          {/* Column 1: Signals Detected */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Signals Detected
              </span>
            </div>

            <div className="space-y-2.5">
              {signals.map((signal) => (
                <button
                  key={signal.id}
                  onClick={() => toggleSignal(signal.id)}
                  className={`w-full text-left rounded-xl border p-3 sm:p-4 transition-all duration-300 group ${
                    signal.enabled
                      ? "border-primary/30 bg-primary/[0.06]"
                      : "border-border/40 bg-card/30 opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Toggle indicator */}
                    <div
                      className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        signal.enabled
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {signal.enabled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <span className="text-primary/70">{signal.icon}</span>
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                          {signal.label}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        {signal.detail}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden lg:flex items-center justify-center px-4 pt-20">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              <ChevronRight className="h-5 w-5 text-primary/50" />
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            </div>
          </div>

          {/* Mobile arrow */}
          <div className="flex lg:hidden justify-center">
            <ArrowRight className="h-5 w-5 text-primary/40 rotate-90" />
          </div>

          {/* Column 2: AI Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Brain className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                PrepIQ Analysis
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4 sm:p-5">
              {/* Processing indicator */}
              <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-border/50">
                <div className="relative h-8 w-8 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: isProcessing ? 0.8 : 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <Brain className="absolute inset-0 m-auto h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {isProcessing ? (
                      <motion.span
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Re-analyzing signals…
                      </motion.span>
                    ) : (
                      <>
                        Analyzing {enabledSignals.length} signal
                        {enabledSignals.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {isProcessing ? "Updating forecast model…" : "Cross-referencing patterns…"}
                  </p>
                </div>
              </div>

              {/* Processing dots overlay */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Recalculating…</span>
                  </div>
                </motion.div>
              )}

              {/* Insights */}
              <motion.div
                animate={{ opacity: isProcessing ? 0.2 : 1, filter: isProcessing ? "blur(3px)" : "blur(0px)" }}
                transition={{ duration: 0.25 }}
              >
              <AnimatePresence mode="popLayout">
                {analysisInsights.map((insight, i) => (
                  <motion.div
                    key={insight}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="flex items-start gap-2.5 mb-3 last:mb-0"
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              </motion.div>

              {/* Confidence meter */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Forecast Confidence
                  </span>
                  <motion.span
                    key={confidence}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-primary font-display"
                  >
                    {confidence}%
                  </motion.span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                  {enabledSignals.length === signals.length
                    ? "All signals active — maximum confidence"
                    : `${signals.length - enabledSignals.length} signal${signals.length - enabledSignals.length !== 1 ? "s" : ""} disabled — toggle on for higher confidence`}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden lg:flex items-center justify-center px-4 pt-20">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              <ChevronRight className="h-5 w-5 text-primary/50" />
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            </div>
          </div>

          {/* Mobile arrow */}
          <div className="flex lg:hidden justify-center">
            <ArrowRight className="h-5 w-5 text-primary/40 rotate-90" />
          </div>

          {/* Column 3: Recommended Prep */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Suggested Prep
              </span>
            </div>

            <motion.div
              className="space-y-3"
              animate={{ opacity: isProcessing ? 0.4 : 1, filter: isProcessing ? "blur(1px)" : "blur(0px)" }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="popLayout">
                {recommendations.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg">{item.emoji}</span>
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <motion.span
                          key={item.recommended}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-base sm:text-lg font-semibold text-foreground font-display"
                        >
                          {item.recommended}
                        </motion.span>
                        <span className="text-xs text-muted-foreground">
                          {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Delta badge */}
                    {item.delta !== 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 mb-2"
                      >
                        <span
                          className={`text-xs font-medium ${
                            item.delta > 0
                              ? "text-[hsl(var(--success))]"
                              : "text-destructive"
                          }`}
                        >
                          {item.delta > 0 ? "+" : ""}
                          {item.delta} {item.unit} vs baseline
                        </span>
                      </motion.div>
                    )}

                    {/* Reasons */}
                    <AnimatePresence mode="popLayout">
                      {item.reasons.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 border-t border-border/30 space-y-1"
                        >
                          {item.reasons.map((reason, i) => (
                            <motion.p
                              key={reason}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5"
                            >
                              <span className="h-1 w-1 rounded-full bg-primary/40 flex-shrink-0" />
                              {reason}
                            </motion.p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Overall confidence footer */}
            <motion.div
              layout
              animate={{ opacity: isProcessing ? 0.3 : 1, filter: isProcessing ? "blur(2px)" : "blur(0px)" }}
              transition={{ duration: 0.25 }}
              className="mt-3 sm:mt-4 rounded-xl border border-primary/20 bg-primary/[0.04] p-3 sm:p-4 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">
                Overall Forecast Confidence
              </p>
              <motion.p
                key={confidence}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl sm:text-2xl font-bold text-primary font-display"
              >
                {isProcessing ? "—" : `${confidence}%`}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] sm:text-xs text-muted-foreground/50 mt-8 sm:mt-10 px-2"
        >
          ↑ Try toggling signals off —
          to see how the forecast changes in real-time
        </motion.p>
      </div>
    </section>
  );
};

export default AIThinkingSection;
