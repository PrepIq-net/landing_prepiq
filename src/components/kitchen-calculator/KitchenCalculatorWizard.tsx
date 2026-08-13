"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Cutlery, PercentageCircle, SendMail, Shop } from "iconoir-react";
import { OperationStep } from "./steps/OperationStep";
import { KitchenStep } from "./steps/KitchenStep";
import { RefineStep } from "./steps/RefineStep";
import { EmailGateStep } from "./steps/EmailGateStep";
import { BuildingProfileTransition } from "./BuildingProfileTransition";
import { SnapshotResult } from "./SnapshotResult";
import type {
  Currency,
  PlanningMethod,
  WasteEstimate,
  StockoutFrequency,
  KitchenCalculatorMetrics,
} from "@/lib/kitchen-calculator/engine";

type Phase = "operation" | "kitchen" | "refine" | "building" | "email" | "result";

// The four steps a visitor sees a progress indicator for. "building" is a
// pacing beat folded into step 4, not a step of its own (task.md).
const FORM_PHASES: Phase[] = ["operation", "kitchen", "refine", "email"];
const STEP_ICONS = [Shop, Cutlery, PercentageCircle, SendMail];

interface FormState {
  weeklyRevenuePerLocation: string;
  currency: Currency;
  locations: string;
  operatingDays: string;
  planningMethod: PlanningMethod | null;
  wasteEstimate: WasteEstimate | null;
  stockoutFrequency: StockoutFrequency | null;
  email: string;
  restaurantName: string;
  /** Honeypot — real visitors never see or fill this field. */
  website: string;
}

const INITIAL_STATE: FormState = {
  weeklyRevenuePerLocation: "",
  currency: "USD",
  locations: "1",
  operatingDays: "7",
  planningMethod: null,
  wasteEstimate: null,
  stockoutFrequency: null,
  email: "",
  restaurantName: "",
  website: "",
};

const VISITOR_ID_KEY = "piq.kitchenCalculator.visitorId";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function KitchenCalculatorWizard() {
  const { t, i18n } = useTranslation();
  const [phase, setPhase] = useState<Phase>("operation");
  const [data, setData] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{
    metrics: KitchenCalculatorMetrics;
    explanation: string | null;
  } | null>(null);

  const patch = (p: Partial<FormState>) => setData((d) => ({ ...d, ...p }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/kitchen-calculator/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: (i18n.resolvedLanguage as "en" | "fr") || "en",
          visitorId: getVisitorId(),
          weeklyRevenuePerLocation: Number(data.weeklyRevenuePerLocation),
          currency: data.currency,
          locations: Number(data.locations),
          operatingDays: Number(data.operatingDays),
          planningMethod: data.planningMethod,
          wasteEstimate: data.wasteEstimate,
          stockoutFrequency: data.stockoutFrequency,
          email: data.email,
          restaurantName: data.restaurantName || null,
          website: data.website,
        }),
      });
      if (!res.ok) throw new Error(`submit failed: ${res.status}`);
      const json = await res.json();
      const { explanation, ...metrics } = json as KitchenCalculatorMetrics & {
        refNo: number;
        explanation: string | null;
      };
      setResult({ metrics: metrics as unknown as KitchenCalculatorMetrics, explanation });
      setPhase("result");
    } catch (err) {
      console.error("Kitchen calculator submit failed", err);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setData(INITIAL_STATE);
    setResult(null);
    setError(false);
    setPhase("operation");
  };

  const currentStepIndex = FORM_PHASES.indexOf(phase === "building" ? "email" : phase);
  const stepLabels = t("kitchenCalculator.progress.steps", { returnObjects: true }) as string[];
  const isResult = phase === "result";

  return (
    <div className="mx-auto max-w-[880px]">
      {isResult && result ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SnapshotResult
            currency={data.currency}
            locations={Number(data.locations) || 1}
            metrics={result.metrics}
            explanation={result.explanation}
            onRestart={restart}
          />
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-l2 px-5 sm:px-10 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10 border-b border-border pb-8 sm:pb-10"
          >
            <div className="flex items-center">
              {FORM_PHASES.map((p, i) => {
                const Icon = STEP_ICONS[i];
                const done = i < currentStepIndex;
                const current = i === currentStepIndex;
                return (
                  <Fragment key={p}>
                    <div className="flex shrink-0 flex-col items-center gap-1.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                          done
                            ? "border-primary bg-primary text-primary-foreground"
                            : current
                            ? "border-primary bg-transparent text-primary"
                            : "border-border text-muted-foreground/40"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" aria-hidden /> : <Icon className="h-4 w-4" aria-hidden />}
                      </div>
                      <span
                        className={`hidden text-center text-[10px] font-medium uppercase tracking-wider sm:block ${
                          current ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {stepLabels[i]}
                      </span>
                    </div>
                    {i < FORM_PHASES.length - 1 && (
                      <div
                        className={`h-px flex-1 transition-colors duration-300 ${
                          i < currentStepIndex ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
            <p className="mt-2 text-center text-xs font-medium text-muted-foreground sm:hidden">
              {t("kitchenCalculator.progress.step", {
                current: currentStepIndex + 1,
                total: FORM_PHASES.length,
              })}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {phase === "operation" && (
                <OperationStep
                  weeklyRevenuePerLocation={data.weeklyRevenuePerLocation}
                  currency={data.currency}
                  locations={data.locations}
                  onChange={patch}
                  onNext={() => setPhase("kitchen")}
                />
              )}
              {phase === "kitchen" && (
                <KitchenStep
                  operatingDays={data.operatingDays}
                  planningMethod={data.planningMethod}
                  onChange={patch}
                  onBack={() => setPhase("operation")}
                  onNext={() => setPhase("refine")}
                />
              )}
              {phase === "refine" && (
                <RefineStep
                  wasteEstimate={data.wasteEstimate}
                  stockoutFrequency={data.stockoutFrequency}
                  onChange={patch}
                  onBack={() => setPhase("kitchen")}
                  onNext={() => setPhase("building")}
                  onSkip={() => setPhase("building")}
                />
              )}
              {phase === "building" && (
                <BuildingProfileTransition onComplete={() => setPhase("email")} />
              )}
              {phase === "email" && (
                <EmailGateStep
                  email={data.email}
                  restaurantName={data.restaurantName}
                  website={data.website}
                  submitting={submitting}
                  error={error}
                  onChange={patch}
                  onBack={() => setPhase("refine")}
                  onSubmit={handleSubmit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}