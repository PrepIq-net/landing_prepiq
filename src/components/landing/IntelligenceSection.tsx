import { motion } from "framer-motion";
import {
  Calendar,
  Cloud,
  DatabaseScript,
  GraphUp,
  User,
  WarningTriangle,
  ShieldCheck,
  ArrowDown,
  DollarCircle,
  Package,
  Clock,
  Brain,
} from "iconoir-react";
import { useTranslation } from "react-i18next";
import { IntelligenceContent, SectionContent } from "@/types/cms";
import { CountUp, SeamAccent } from "./motion-primitives";

const SIGNAL_ICONS = [
  DatabaseScript,
  Calendar,
  Cloud,
  GraphUp,
  WarningTriangle,
  User,
];

const ALERT_META = [
  {
    icon: ArrowDown,
    color: "hsl(var(--warning))",
    bg: "hsl(var(--warning) / 0.08)",
    border: "hsl(var(--warning) / 0.15)",
    impact: "$14",
  },
  {
    icon: WarningTriangle,
    color: "hsl(var(--destructive))",
    bg: "hsl(var(--destructive) / 0.08)",
    border: "hsl(var(--destructive) / 0.15)",
    impact: "$38",
  },
  {
    icon: DollarCircle,
    color: "hsl(var(--info))",
    bg: "hsl(var(--info) / 0.08)",
    border: "hsl(var(--info) / 0.15)",
    impact: "$22",
  },
];

const LEAK_META = [
  { icon: Package, saved: "$1,840" },
  { icon: WarningTriangle, saved: "$1,200" },
  { icon: Clock, saved: "$620" },
  { icon: ArrowDown, saved: "$480" },
];

const WHY_ICONS = [WarningTriangle, GraphUp, Brain];

const normalizeSignals = (
  signals: unknown,
): { label: string; desc: string }[] => {
  if (Array.isArray(signals)) {
    return signals
      .map((signal) => {
        if (signal && typeof signal === "object") {
          const label = (signal as { label?: unknown }).label;
          const desc = (signal as { desc?: unknown }).desc;
          return typeof label === "string" && typeof desc === "string"
            ? { label, desc }
            : null;
        }
        if (typeof signal === "string") {
          return { label: signal, desc: "" };
        }
        return null;
      })
      .filter((signal): signal is { label: string; desc: string } =>
        Boolean(signal),
      );
  }

  return [];
};

const IntelligenceSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<IntelligenceContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const fallbackContent: IntelligenceContent = {
    badge: t("intelligence.badge"),
    title: t("intelligence.title"),
    subtitle: t("intelligence.subtitle"),
    signals: [
      {
        label: t("intelligence.signals.sales.label"),
        desc: t("intelligence.signals.sales.desc"),
      },
      {
        label: t("intelligence.signals.patterns.label"),
        desc: t("intelligence.signals.patterns.desc"),
      },
      {
        label: t("intelligence.signals.weather.label"),
        desc: t("intelligence.signals.weather.desc"),
      },
      {
        label: t("intelligence.signals.events.label"),
        desc: t("intelligence.signals.events.desc"),
      },
      {
        label: t("intelligence.signals.stockouts.label"),
        desc: t("intelligence.signals.stockouts.desc"),
      },
      {
        label: t("intelligence.signals.chef.label"),
        desc: t("intelligence.signals.chef.desc"),
      },
    ],
    footer: t("intelligence.footer"),
    pipelineTitle: t("marginGuard.title"),
    pipelineSteps: t("marginGuard.steps", { returnObjects: true }) as string[],
    alerts: [
      {
        type: t("marginGuard.alerts.waste.type"),
        detail: t("marginGuard.alerts.waste.detail"),
        action: t("marginGuard.alerts.waste.action"),
      },
      {
        type: t("marginGuard.alerts.stockout.type"),
        detail: t("marginGuard.alerts.stockout.detail"),
        action: t("marginGuard.alerts.stockout.action"),
      },
      {
        type: t("marginGuard.alerts.leak.type"),
        detail: t("marginGuard.alerts.leak.detail"),
        action: t("marginGuard.alerts.leak.action"),
      },
    ],
    atRiskLabel: currentLang === "fr" ? "à risque" : "at risk",
    suggestedLabel: currentLang === "fr" ? "Suggéré" : "Suggested",
    leakTypes: [
      t("marginGuard.leakTypes.overprep"),
      t("marginGuard.leakTypes.stockout"),
      t("marginGuard.leakTypes.batch"),
      t("marginGuard.leakTypes.drift"),
    ],
    totalProtectionLabel: t("marginGuard.totalProtection"),
    roiNote: t("marginGuard.roiNote"),
    whyBadge: t("whyPrepIQ.badge"),
    whyPoints: [
      {
        highlight: t("whyPrepIQ.points.0.highlight"),
        body: t("whyPrepIQ.points.0.body"),
      },
      {
        highlight: t("whyPrepIQ.points.1.highlight"),
        body: t("whyPrepIQ.points.1.body"),
      },
      {
        highlight: t("whyPrepIQ.points.2.highlight"),
        body: t("whyPrepIQ.points.2.body"),
      },
    ],
    whyFooter: t("whyPrepIQ.footer"),
  };

  const localizedContent = dbContent?.[currentLang] as
    | Partial<IntelligenceContent>
    | undefined;
  const content: IntelligenceContent = {
    ...fallbackContent,
    ...localizedContent,
    signals: normalizeSignals(
      localizedContent?.signals ?? fallbackContent.signals,
    ),
    pipelineSteps: Array.isArray(localizedContent?.pipelineSteps)
      ? localizedContent.pipelineSteps
      : fallbackContent.pipelineSteps,
    alerts: Array.isArray(localizedContent?.alerts)
      ? localizedContent.alerts
      : fallbackContent.alerts,
    leakTypes: Array.isArray(localizedContent?.leakTypes)
      ? localizedContent.leakTypes
      : fallbackContent.leakTypes,
    whyPoints: Array.isArray(localizedContent?.whyPoints)
      ? localizedContent.whyPoints
      : fallbackContent.whyPoints,
  };

  return (
    <section
      id="intelligence"
      className="relative py-20 md:py-32 border-t border-border/50 scroll-mt-20"
    >
      <SeamAccent />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-4 sm:mb-5 block">
            {content.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            {content.title}
          </h2>
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Signals */}
        <div className="max-w-3xl mx-auto mt-10 sm:mt-16 space-y-3 sm:space-y-4">
          {(content.signals ?? []).map((s, i) => {
            const Icon = SIGNAL_ICONS[i];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-start gap-3 sm:gap-5 rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-primary/25 hover:shadow-l2 transition-[border-color,box-shadow] duration-200"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border border-primary/15 group-hover:bg-primary/15 group-hover:border-primary/25 transition-colors duration-200">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 sm:mb-1">
                    {s.label}
                  </p>
                  <p className="text-[12px] sm:text-[13px] text-muted-foreground/70 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-[11px] sm:text-xs text-muted-foreground/40 mt-8 sm:mt-12 px-2 max-w-lg mx-auto">
          {content.footer}
        </p>

        {/* Margin protection */}
        <div className="max-w-3xl mx-auto mt-16 sm:mt-24 pt-16 sm:pt-24 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-5 mb-10 sm:mb-14">
            {content.pipelineSteps.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2 sm:gap-3 md:gap-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {step}
                  </span>
                </motion.div>
                {i < content.pipelineSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.15 + 0.1,
                      duration: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-5 sm:w-8 md:w-12 h-px bg-primary/40 origin-left"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-14">
            {content.alerts.map((alert, i) => {
              const meta = ALERT_META[i];
              return (
                <motion.div
                  key={alert.type}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2, delay: 0 },
                  }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-4 sm:p-5 md:p-6 hover:border-primary/20 hover:shadow-l3 transition-[border-color,box-shadow] duration-200"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: meta.bg,
                        border: `1px solid ${meta.border}`,
                      }}
                    >
                      <meta.icon
                        className="h-4 w-4"
                        style={{ color: meta.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2">
                        <span
                          className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full w-fit"
                          style={{
                            backgroundColor: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`,
                          }}
                        >
                          {alert.type}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-foreground">
                          {meta.impact} {content.atRiskLabel}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed mb-2.5 sm:mb-3">
                        {alert.detail}
                      </p>
                      <div className="flex items-center gap-2 rounded-lg bg-accent/60 px-2.5 sm:px-3 py-1.5 sm:py-2">
                        <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
                        <span className="text-[11px] sm:text-[12px] text-foreground font-medium">
                          {content.suggestedLabel}: {alert.action}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {content.leakTypes.map((label, i) => {
                const meta = LEAK_META[i];
                return (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-card/50 p-3 sm:p-4 text-center hover:border-primary/25 hover:shadow-l2 transition-[border-color,box-shadow] duration-200"
                  >
                    <meta.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-base sm:text-lg font-semibold text-foreground">
                      <CountUp value={meta.saved} />
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase tracking-wider mt-0.5 sm:mt-1">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-4 sm:mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-wider mb-1">
                {content.totalProtectionLabel}
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground">
                <CountUp value="$4,140" />
              </p>
              <p className="text-[11px] sm:text-[12px] text-muted-foreground/60 mt-1">
                {content.roiNote}
              </p>
            </div>
          </div>
        </div>

        {/* Why PrepIQ */}
        <div className="max-w-3xl mx-auto mt-16 sm:mt-24 pt-16 sm:pt-24 border-t border-border/50 text-center">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-primary mb-6 sm:mb-8">
            {content.whyBadge}
          </p>
          <div className="space-y-6 sm:space-y-8 text-left">
            {content.whyPoints.map((p, i) => {
              const Icon = WHY_ICONS[i];
              return (
                <motion.div
                  key={p.highlight}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 sm:gap-5"
                >
                  <div className="flex-shrink-0 mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {p.highlight}
                    </span>{" "}
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-8 sm:mt-12 text-xs sm:text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 sm:pl-4 text-left">
            {content.whyFooter}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
