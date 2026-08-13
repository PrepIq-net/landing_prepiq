"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDown, GraphUp, Percentage, Restart, Sparks, TriangleFlagTwoStripes } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL } from "@/lib/constants";
import { formatCompactMoney } from "@/lib/kitchen-calculator/format";
import type { Currency, KitchenCalculatorMetrics } from "@/lib/kitchen-calculator/engine";

interface Props {
  currency: Currency;
  locations: number;
  metrics: KitchenCalculatorMetrics;
  explanation: string | null;
  onRestart: () => void;
}

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display font-semibold text-foreground">
          {score === null ? t("kitchenCalculator.result.notAssessed") : score}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score ?? 0}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${score === null ? "bg-border" : "bg-primary"}`}
        />
      </div>
    </div>
  );
}

export function SnapshotResult({ currency, locations, metrics, explanation, onRestart }: Props) {
  const { t } = useTranslation();

  const exposureCards = [
    {
      key: "waste",
      icon: ArrowDown,
      label: t("kitchenCalculator.result.wasteExposureLabel"),
      note: t("kitchenCalculator.result.wasteExposureNote"),
      low: metrics.wasteExposureLow,
      high: metrics.wasteExposureHigh,
      color: "text-[hsl(var(--success))]",
    },
    {
      key: "stockout",
      icon: GraphUp,
      label: t("kitchenCalculator.result.stockoutExposureLabel"),
      note: t("kitchenCalculator.result.stockoutExposureNote"),
      low: metrics.stockoutExposureLow,
      high: metrics.stockoutExposureHigh,
      color: "text-primary",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 sm:space-y-10"
    >
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
          <Sparks className="h-3.5 w-3.5 inline-block mr-1.5" aria-hidden />
          {t("kitchenCalculator.result.badge")}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
          {t("kitchenCalculator.result.operationTitle")}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground">
            {t("kitchenCalculator.result.locationsLabel", { count: locations })}
          </span>
          <span aria-hidden>·</span>
          <span>
            {formatCompactMoney(metrics.weeklyNetworkRevenue, currency)} {t("kitchenCalculator.result.weeklyRevenueLabel")}
          </span>
          <span aria-hidden>·</span>
          <span>
            {t("kitchenCalculator.result.annualRevenueLabel", {
              value: formatCompactMoney(metrics.annualRevenue, currency),
            })}
          </span>
        </div>
      </div>

      {/* Exposure */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-l2">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{t("kitchenCalculator.result.exposureTitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {exposureCards.map((card) => (
            <div key={card.key} className="p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                <card.icon className={`h-3.5 w-3.5 ${card.color}`} aria-hidden />
                {card.label}
              </div>
              <p className={`font-display text-xl sm:text-2xl font-semibold ${card.color}`}>
                {formatCompactMoney(card.low, currency)} – {formatCompactMoney(card.high, currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {card.note} · {t("kitchenCalculator.result.perWeek")}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border bg-primary/[0.02]">
          <div className="p-5 sm:p-6 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {t("kitchenCalculator.result.uncertaintyLabel")}
            </p>
            <p className="font-display text-lg font-semibold text-foreground">
              {Math.round(metrics.forecastUncertaintyLow)}–{Math.round(metrics.forecastUncertaintyHigh)}%
            </p>
          </div>
          <div className="p-5 sm:p-6 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {t("kitchenCalculator.result.annualImpactLabel")}
            </p>
            <p className="font-display text-lg font-semibold text-foreground">
              {formatCompactMoney(metrics.annualImpactLow, currency)} – {formatCompactMoney(metrics.annualImpactHigh, currency)}
            </p>
          </div>
        </div>
        <div className="px-5 sm:px-8 py-3.5 sm:py-4 flex items-start gap-2.5 border-t border-border bg-muted/30">
          <Percentage className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" aria-hidden />
          <p className="text-xs text-muted-foreground leading-relaxed">{t("kitchenCalculator.result.exposureNote")}</p>
        </div>
      </div>

      {/* Score */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-l1 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-foreground">{t("kitchenCalculator.result.scoreTitle")}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">{t("kitchenCalculator.result.scoreSubtitle")}</p>
          </div>
          <p className="font-display text-4xl sm:text-5xl font-semibold text-primary tracking-tight">
            {metrics.intelligenceScore}
            <span className="text-lg text-muted-foreground font-normal">/100</span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ScoreBar label={t("kitchenCalculator.result.planningMaturity")} score={metrics.planningMaturityScore} />
          <ScoreBar label={t("kitchenCalculator.result.forecastingMaturity")} score={metrics.forecastingMaturityScore} />
          <ScoreBar label={t("kitchenCalculator.result.wasteVisibility")} score={metrics.wasteVisibilityScore} />
          <ScoreBar label={t("kitchenCalculator.result.operationalVisibility")} score={metrics.operationalVisibilityScore} />
        </div>

        <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <TriangleFlagTwoStripes className="h-3.5 w-3.5" aria-hidden />
            {t("kitchenCalculator.result.opportunityPrefix")} {metrics.primaryOpportunity}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {explanation || t("kitchenCalculator.result.explanationFallback")}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] to-transparent p-6 sm:p-10 text-center space-y-4">
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
          {t("kitchenCalculator.result.ctaTitle")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("kitchenCalculator.result.ctaBody")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="xl">
              {t("kitchenCalculator.result.ctaButton")}
            </Button>
          </a>
          <Button variant="ghost" onClick={onRestart}>
            <Restart className="h-4 w-4 mr-1.5" aria-hidden />
            {t("kitchenCalculator.result.restart")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
