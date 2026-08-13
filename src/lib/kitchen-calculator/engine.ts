/**
 * Kitchen Intelligence Calculator — deterministic scoring engine.
 *
 * Isomorphic (no server-only imports): the wizard runs this in the browser
 * for the instant "building your kitchen profile…" preview, and the submit
 * API route runs it again server-side as the authoritative recompute — the
 * client-submitted numbers are never trusted or persisted directly.
 *
 * Per task.md's explicit design: an LLM never does this math. Every number
 * here comes from a fixed, documented rule; the LLM (backend/kitchen_calculator)
 * only narrates the output. Nothing here is a measured PrepIQ result — the
 * exposure percentages are the same illustrative industry ranges the old
 * ValueSection ROI calculator used (5–12% waste, 3–8% stockout), not new
 * unlabeled stats, and every UI surface must label them "estimated" /
 * "illustrative" rather than present them as fact.
 */

// Single source of truth for valid option values — the submit route's Zod
// schema and the wizard's <select> controls both derive from these instead
// of repeating the string literals.
export const CURRENCIES = ["USD", "EUR", "UGX", "KES", "RWF", "OTHER"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const PLANNING_METHODS = [
  "intuition",
  "spreadsheet",
  "pos_reports",
  "forecasting",
] as const;
export type PlanningMethod = (typeof PLANNING_METHODS)[number];

export const WASTE_ESTIMATES = ["lt2", "2to5", "5to10", "gt10", "unknown"] as const;
export type WasteEstimate = (typeof WASTE_ESTIMATES)[number];

export const STOCKOUT_FREQUENCIES = [
  "rarely",
  "sometimes",
  "frequently",
  "unknown",
] as const;
export type StockoutFrequency = (typeof STOCKOUT_FREQUENCIES)[number];

export interface KitchenCalculatorInputs {
  weeklyRevenuePerLocation: number;
  currency: Currency;
  locations: number;
  operatingDays: number;
  planningMethod: PlanningMethod;
  /** Step 3 is optional — the visitor may skip straight to the email gate. */
  wasteEstimate?: WasteEstimate | null;
  stockoutFrequency?: StockoutFrequency | null;
}

export type OpportunityKey =
  | "planning"
  | "forecasting"
  | "wasteVisibility"
  | "operationalVisibility";

export interface KitchenCalculatorMetrics {
  weeklyNetworkRevenue: number;
  annualRevenue: number;

  wasteExposureLow: number;
  wasteExposureHigh: number;
  stockoutExposureLow: number;
  stockoutExposureHigh: number;
  annualImpactLow: number;
  annualImpactHigh: number;

  forecastUncertaintyLow: number;
  forecastUncertaintyHigh: number;

  intelligenceScore: number;
  planningMaturityScore: number;
  forecastingMaturityScore: number;
  /** Null when step 3 was skipped — there is no waste-visibility signal to score. */
  wasteVisibilityScore: number | null;
  /** Null when step 3 was skipped. */
  operationalVisibilityScore: number | null;

  primaryOpportunityKey: OpportunityKey;
  primaryOpportunity: string;
}

const WEEKS_PER_YEAR = 52;

// Base exposure ranges, unchanged from the old pricing-page ROI calculator's
// modelled percentages — reused rather than invented so the site doesn't
// carry two different unlabeled "industry range" claims.
const WASTE_BASE = { low: 0.05, high: 0.12 };
const STOCKOUT_BASE = { low: 0.03, high: 0.08 };

// If the visitor answers the optional refinement step, shift/narrow the base
// range toward their reported bucket instead of a flat percentage-off guess.
const WASTE_RANGE_BY_ESTIMATE: Record<WasteEstimate, { low: number; high: number }> = {
  lt2: { low: 0.02, high: 0.06 },
  "2to5": { low: 0.03, high: 0.07 },
  "5to10": { low: 0.05, high: 0.1 },
  gt10: { low: 0.08, high: 0.14 },
  unknown: WASTE_BASE,
};

const STOCKOUT_RANGE_BY_FREQUENCY: Record<StockoutFrequency, { low: number; high: number }> = {
  rarely: { low: 0.01, high: 0.04 },
  sometimes: STOCKOUT_BASE,
  frequently: { low: 0.06, high: 0.12 },
  unknown: STOCKOUT_BASE,
};

// Forecast uncertainty is read off planning maturity: the less structured the
// process, the wider the band of demand a kitchen is effectively guessing at.
const FORECAST_UNCERTAINTY_BY_METHOD: Record<PlanningMethod, { low: number; high: number }> = {
  intuition: { low: 18, high: 25 },
  spreadsheet: { low: 12, high: 18 },
  pos_reports: { low: 8, high: 14 },
  forecasting: { low: 4, high: 8 },
};

// Planning maturity: how structured is the day-to-day process.
const PLANNING_MATURITY_SCORE: Record<PlanningMethod, number> = {
  intuition: 25,
  spreadsheet: 50,
  pos_reports: 70,
  forecasting: 90,
};

// Forecasting maturity: a stricter curve over the *same* input — only real
// forecasting software scores well. This is an intentionally different
// reading of one answer, not a second independently-measured data point, so
// it must never be presented as if it came from a separate question.
const FORECASTING_MATURITY_SCORE: Record<PlanningMethod, number> = {
  intuition: 15,
  spreadsheet: 35,
  pos_reports: 55,
  forecasting: 90,
};

// Waste visibility: not tracking waste at all scores lowest regardless of the
// number, because the gap being measured is awareness, not the waste itself.
const WASTE_VISIBILITY_SCORE: Record<WasteEstimate, number> = {
  lt2: 85,
  "2to5": 75,
  "5to10": 60,
  gt10: 45,
  unknown: 25,
};

const OPERATIONAL_VISIBILITY_SCORE: Record<StockoutFrequency, number> = {
  rarely: 80,
  sometimes: 55,
  frequently: 35,
  unknown: 20,
};

const OPPORTUNITY_LABEL: Record<OpportunityKey, string> = {
  planning: "Demand planning process",
  forecasting: "Demand forecasting",
  wasteVisibility: "Waste visibility & tracking",
  operationalVisibility: "Stockout & operational visibility",
};

function clampPositive(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function computeKitchenCalculatorMetrics(
  inputs: KitchenCalculatorInputs,
): KitchenCalculatorMetrics {
  const weeklyRevenuePerLocation = clampPositive(inputs.weeklyRevenuePerLocation);
  const locations = Math.max(1, Math.round(inputs.locations || 1));
  const weeklyNetworkRevenue = weeklyRevenuePerLocation * locations;
  const annualRevenue = weeklyNetworkRevenue * WEEKS_PER_YEAR;

  const wasteRange = inputs.wasteEstimate
    ? WASTE_RANGE_BY_ESTIMATE[inputs.wasteEstimate]
    : WASTE_BASE;
  const stockoutRange = inputs.stockoutFrequency
    ? STOCKOUT_RANGE_BY_FREQUENCY[inputs.stockoutFrequency]
    : STOCKOUT_BASE;

  const wasteExposureLow = weeklyNetworkRevenue * wasteRange.low;
  const wasteExposureHigh = weeklyNetworkRevenue * wasteRange.high;
  const stockoutExposureLow = weeklyNetworkRevenue * stockoutRange.low;
  const stockoutExposureHigh = weeklyNetworkRevenue * stockoutRange.high;

  const annualImpactLow = (wasteExposureLow + stockoutExposureLow) * WEEKS_PER_YEAR;
  const annualImpactHigh = (wasteExposureHigh + stockoutExposureHigh) * WEEKS_PER_YEAR;

  const forecastUncertainty =
    FORECAST_UNCERTAINTY_BY_METHOD[inputs.planningMethod] ??
    FORECAST_UNCERTAINTY_BY_METHOD.intuition;

  const planningMaturityScore = PLANNING_MATURITY_SCORE[inputs.planningMethod];
  const forecastingMaturityScore = FORECASTING_MATURITY_SCORE[inputs.planningMethod];
  const wasteVisibilityScore = inputs.wasteEstimate
    ? WASTE_VISIBILITY_SCORE[inputs.wasteEstimate]
    : null;
  const operationalVisibilityScore = inputs.stockoutFrequency
    ? OPERATIONAL_VISIBILITY_SCORE[inputs.stockoutFrequency]
    : null;

  const scored: { key: OpportunityKey; score: number }[] = [
    { key: "planning", score: planningMaturityScore },
    { key: "forecasting", score: forecastingMaturityScore },
  ];
  if (wasteVisibilityScore !== null) scored.push({ key: "wasteVisibility", score: wasteVisibilityScore });
  if (operationalVisibilityScore !== null)
    scored.push({ key: "operationalVisibility", score: operationalVisibilityScore });

  const intelligenceScore = Math.round(
    scored.reduce((sum, s) => sum + s.score, 0) / scored.length,
  );

  const lowest = scored.reduce((min, s) => (s.score < min.score ? s : min), scored[0]);

  return {
    weeklyNetworkRevenue,
    annualRevenue,
    wasteExposureLow,
    wasteExposureHigh,
    stockoutExposureLow,
    stockoutExposureHigh,
    annualImpactLow,
    annualImpactHigh,
    forecastUncertaintyLow: forecastUncertainty.low,
    forecastUncertaintyHigh: forecastUncertainty.high,
    intelligenceScore,
    planningMaturityScore,
    forecastingMaturityScore,
    wasteVisibilityScore,
    operationalVisibilityScore,
    primaryOpportunityKey: lowest.key,
    primaryOpportunity: OPPORTUNITY_LABEL[lowest.key],
  };
}
