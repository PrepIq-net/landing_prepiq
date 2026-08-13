"use client";

import { useTranslation } from "react-i18next";
import { ArrowRight, Shop } from "iconoir-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, type Currency } from "@/lib/kitchen-calculator/engine";
import { StepHeader } from "../StepHeader";

const fieldLabel = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3";
const numberInput =
  "w-full h-14 rounded-xl border border-border bg-card px-4 text-base font-display font-semibold text-foreground placeholder:text-muted-foreground/30 placeholder:font-normal focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors duration-200";

export function OperationStep({
  weeklyRevenuePerLocation,
  currency,
  locations,
  onChange,
  onNext,
}: {
  weeklyRevenuePerLocation: string;
  currency: Currency;
  locations: string;
  onChange: (patch: Partial<{ weeklyRevenuePerLocation: string; currency: Currency; locations: string }>) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();

  const revenueValid = Number(weeklyRevenuePerLocation) > 0;
  const locationsValid = Number.isFinite(Number(locations)) && Number(locations) >= 1;
  const canContinue = revenueValid && locationsValid;

  return (
    <div className="space-y-8 sm:space-y-10">
      <StepHeader
        icon={Shop}
        title={t("kitchenCalculator.steps.operation.title")}
        subtitle={t("kitchenCalculator.steps.operation.subtitle")}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[2fr_1fr] sm:gap-6 lg:gap-8">
        <div>
          <label className={fieldLabel}>{t("kitchenCalculator.steps.operation.revenueLabel")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            placeholder={t("kitchenCalculator.steps.operation.revenuePlaceholder") ?? ""}
            value={weeklyRevenuePerLocation}
            onChange={(e) => onChange({ weeklyRevenuePerLocation: e.target.value })}
            className={numberInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>{t("kitchenCalculator.steps.operation.currencyLabel")}</label>
          <Select value={currency} onValueChange={(v) => onChange({ currency: v as Currency })}>
            <SelectTrigger className="h-14 rounded-xl border-border bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {t(`kitchenCalculator.options.currency.${c}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className={fieldLabel}>{t("kitchenCalculator.steps.operation.locationsLabel")}</label>
        <input
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={locations}
          onChange={(e) => onChange({ locations: e.target.value })}
          className={`${numberInput} w-full sm:w-48 lg:w-56`}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="hero" size="lg" disabled={!canContinue} onClick={onNext}>
          {t("kitchenCalculator.steps.operation.next")}
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
