"use client";

import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Cutlery } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { ChoiceGroup } from "../ChoiceGroup";
import { StepHeader } from "../StepHeader";
import { PLANNING_METHODS, type PlanningMethod } from "@/lib/kitchen-calculator/engine";

const fieldLabel = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3";

export function KitchenStep({
  operatingDays,
  planningMethod,
  onChange,
  onBack,
  onNext,
}: {
  operatingDays: string;
  planningMethod: PlanningMethod | null;
  onChange: (patch: Partial<{ operatingDays: string; planningMethod: PlanningMethod }>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();

  const daysValid =
    Number.isFinite(Number(operatingDays)) && Number(operatingDays) >= 1 && Number(operatingDays) <= 7;
  const canContinue = daysValid && planningMethod !== null;

  const options = PLANNING_METHODS.map((m) => ({
    value: m,
    label: t(`kitchenCalculator.options.planningMethod.${m}`),
  }));

  return (
    <div className="space-y-8 sm:space-y-10">
      <StepHeader
        icon={Cutlery}
        title={t("kitchenCalculator.steps.kitchen.title")}
        subtitle={t("kitchenCalculator.steps.kitchen.subtitle")}
      />

      <div>
        <label className={fieldLabel}>{t("kitchenCalculator.steps.kitchen.daysLabel")}</label>
        <input
          type="number"
          min={1}
          max={7}
          step={1}
          inputMode="numeric"
          value={operatingDays}
          onChange={(e) => onChange({ operatingDays: e.target.value })}
          className="w-full sm:w-48 lg:w-56 h-14 rounded-xl border border-border bg-card px-4 text-base font-display font-semibold text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors duration-200"
        />
      </div>

      <div className="space-y-2.5">
        <label className={fieldLabel}>{t("kitchenCalculator.steps.kitchen.planningLabel")}</label>
        <ChoiceGroup
          name="planningMethod"
          options={options}
          value={planningMethod}
          onChange={(v) => onChange({ planningMethod: v as PlanningMethod })}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {t("kitchenCalculator.steps.kitchen.back")}
        </Button>
        <Button variant="hero" size="lg" disabled={!canContinue} onClick={onNext}>
          {t("kitchenCalculator.steps.kitchen.next")}
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
