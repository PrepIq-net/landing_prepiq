import { motion } from "framer-motion";
import { ShieldCheck, TrendingDown, AlertTriangle, Clock, Package, DollarSign } from "lucide-react";

const alerts = [
  {
    type: "Waste Risk",
    icon: TrendingDown,
    color: "hsl(var(--warning))",
    bg: "hsl(var(--warning) / 0.08)",
    border: "hsl(var(--warning) / 0.15)",
    item: "Rice",
    detail: "Demand trending 12% lower than forecast. Next batch likely to produce 4kg excess.",
    action: "Delay next batch 45 minutes.",
    impact: "$14",
  },
  {
    type: "Stockout Risk",
    icon: AlertTriangle,
    color: "hsl(var(--destructive))",
    bg: "hsl(var(--destructive) / 0.08)",
    border: "hsl(var(--destructive) / 0.15)",
    item: "Chicken",
    detail: "Trending 18% above forecast. Sellout expected at 7:20 PM.",
    action: "Prepare +12 pieces now.",
    impact: "$38",
  },
  {
    type: "Margin Leak",
    icon: DollarSign,
    color: "hsl(var(--info))",
    bg: "hsl(var(--info) / 0.08)",
    border: "hsl(var(--info) / 0.15)",
    item: "Vegetables",
    detail: "Waste has occurred 4 days in a row. Pattern detected.",
    action: "Reduce base prep by 1.5kg.",
    impact: "$22",
  },
];

const leakTypes = [
  { icon: Package, label: "Overprep Waste", saved: "$1,840" },
  { icon: AlertTriangle, label: "Stockout Recovery", saved: "$1,200" },
  { icon: Clock, label: "Bad Batch Timing", saved: "$620" },
  { icon: TrendingDown, label: "Demand Drift", saved: "$480" },
];

const MarginGuardSection = () => {
  return (
    <section className="py-20 md:py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.03] blur-[160px]" />
      </div>

      <div className="section-container px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-4 sm:mb-5 block">
            Margin Guard
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            AI That Protects Your Profit
          </h2>
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            PrepIQ doesn't just forecast — it watches every prep decision and catches margin leaks before they cost you money.
          </p>
        </motion.div>

        {/* Pipeline: Predict → Detect → Correct */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 sm:gap-3 md:gap-5 mb-10 sm:mb-16 mt-8 sm:mt-10"
        >
          {["Predict", "Detect", "Correct"].map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3 md:gap-5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-semibold text-primary">{i + 1}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground">{step}</span>
              </div>
              {i < 2 && (
                <div className="w-5 sm:w-8 md:w-12 h-px bg-border" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Live Alert Cards */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.type}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-4 sm:p-5 md:p-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: alert.bg, border: `1px solid ${alert.border}` }}
                >
                  <alert.icon className="h-4 w-4" style={{ color: alert.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: alert.bg, color: alert.color, border: `1px solid ${alert.border}` }}
                      >
                        {alert.type}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-foreground">{alert.item}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{alert.impact} at risk</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed mb-2.5 sm:mb-3">{alert.detail}</p>
                  <div className="flex items-center gap-2 rounded-lg bg-accent/60 px-2.5 sm:px-3 py-1.5 sm:py-2">
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
                    <span className="text-[11px] sm:text-[12px] text-foreground font-medium">Suggested: {alert.action}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Protection Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/40 font-medium mb-4 sm:mb-5 text-center">
            Monthly Margin Protection
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {leakTypes.map((leak) => (
              <div
                key={leak.label}
                className="rounded-xl border border-border bg-card/50 p-3 sm:p-4 text-center"
              >
                <leak.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mx-auto mb-1.5 sm:mb-2" />
                <p className="text-base sm:text-lg font-semibold text-foreground">{leak.saved}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase tracking-wider mt-0.5 sm:mt-1">{leak.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 sm:mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
            <p className="text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-wider mb-1">Total Monthly Protection</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground">$4,140</p>
            <p className="text-[11px] sm:text-[12px] text-muted-foreground/60 mt-1">
              PrepIQ pays for itself in the first 48 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarginGuardSection;
