"use client";

import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, PercentageCircle } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { ChoiceGroup } from "../ChoiceGroup";
import { StepHeader } from "../StepHeader";
import {
  WASTE_ESTIMATES,
  STOCKOUT_FREQUENCIES,
  type WasteEstimate,
  type StockoutFrequency,
} from "@/lib/kitchen-calculator/engine";

const fieldLabel = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3";

export function RefineStep({
  wasteEstimate,
  stockoutFrequency,
  onChange,
  onBack,
  onNext,
  onSkip,
}: {
  wasteEstimate: WasteEstimate | null;
  stockoutFrequency: StockoutFrequency | null;
  onChange: (patch: Partial<{ wasteEstimate: WasteEstimate; stockoutFrequency: StockoutFrequency }>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const { t } = useTranslation();

  const wasteOptions = WASTE_ESTIMATES.map((v) => ({
    value: v,
    label: t(`kitchenCalculator.options.wasteEstimate.${v}`),
  }));
  const stockoutOptions = STOCKOUT_FREQUENCIES.map((v) => ({
    value: v,
    label: t(`kitchenCalculator.options.stockoutFrequency.${v}`),
  }));

  return (
    <div className="space-y-8 sm:space-y-10">
      <StepHeader
        icon={PercentageCircle}
        title={t("kitchenCalculator.steps.refine.title")}
        subtitle={t("kitchenCalculator.steps.refine.subtitle")}
      />

      <div>
        <label className={fieldLabel}>{t("kitchenCalculator.steps.refine.wasteLabel")}</label>
        <ChoiceGroup
          name="wasteEstimate"
          options={wasteOptions}
          value={wasteEstimate}
          onChange={(v) => onChange({ wasteEstimate: v as WasteEstimate })}
        />
      </div>

      <div>
        <label className={fieldLabel}>{t("kitchenCalculator.steps.refine.stockoutLabel")}</label>
        <ChoiceGroup
          name="stockoutFrequency"
          options={stockoutOptions}
          value={stockoutFrequency}
          onChange={(v) => onChange({ stockoutFrequency: v as StockoutFrequency })}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {t("kitchenCalculator.steps.refine.back")}
        </Button>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" onClick={onSkip}>
            {t("kitchenCalculator.steps.refine.skip")}
          </Button>
          <Button variant="hero" size="lg" onClick={onNext}>
            {t("kitchenCalculator.steps.refine.next")}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
