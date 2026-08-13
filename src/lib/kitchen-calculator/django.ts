/**
 * Server-only helper for calling the Django Kitchen Intelligence Calculator
 * explain endpoint. Import only from Route Handlers — reads
 * KITCHEN_CALCULATOR_SERVICE_KEY from env. Mirrors src/lib/concierge/django.ts.
 */
import type {
  PlanningMethod,
  WasteEstimate,
  StockoutFrequency,
} from "./engine";

export interface KitchenCalculatorExplainPayload {
  locale: "en" | "fr";
  currency: string;
  locations: number;
  operatingDays: number;
  planningMethod: PlanningMethod;
  wasteEstimate?: WasteEstimate | null;
  stockoutFrequency?: StockoutFrequency | null;
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
  wasteVisibilityScore: number | null;
  operationalVisibilityScore: number | null;
  primaryOpportunity: string;
}

export interface KitchenCalculatorExplainResult {
  explanation: string;
  meta: {
    provider: string;
    model: string;
    usage: { tokens_in: number | null; tokens_out: number | null } | null;
  };
}

export async function kitchenCalculatorExplainFetch(
  payload: KitchenCalculatorExplainPayload
): Promise<KitchenCalculatorExplainResult> {
  const base = process.env.DJANGO_API_URL;
  if (!base) throw new Error("DJANGO_API_URL is not configured");

  const serviceKey = process.env.KITCHEN_CALCULATOR_SERVICE_KEY;
  if (!serviceKey) throw new Error("KITCHEN_CALCULATOR_SERVICE_KEY is not configured");

  const res = await fetch(`${base}/api/kitchen-calculator/explain/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kitchen-Calculator-Key": serviceKey,
    },
    body: JSON.stringify(payload),
    // A single narrative completion — generous but bounded well below the
    // platform's route timeout.
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Kitchen Calculator API ${res.status}: ${body}`);
  }

  return res.json() as Promise<KitchenCalculatorExplainResult>;
}

export interface KitchenCalculatorNotifyPayload {
  locale: "en" | "fr";
  email: string;
  restaurantName?: string | null;
  refNo: number;
  currency: string;
  locations: number;
  operatingDays: number;
  planningMethod: PlanningMethod;
  wasteEstimate?: WasteEstimate | null;
  stockoutFrequency?: StockoutFrequency | null;
  intelligenceScore: number;
  planningMaturityScore: number;
  forecastingMaturityScore: number;
  wasteVisibilityScore: number | null;
  operationalVisibilityScore: number | null;
  primaryOpportunityKey: string;
  primaryOpportunity: string;
  explanation?: string | null;
  weeklyNetworkRevenueFormatted: string;
  annualRevenueFormatted: string;
  wasteExposureRangeFormatted: string;
  stockoutExposureRangeFormatted: string;
  annualImpactRangeFormatted: string;
  forecastUncertaintyRangeFormatted: string;
  calendlyUrl: string;
  appUrl: string;
}

/**
 * Fires the post-submission "Kitchen Intelligence Snapshot" email. Best-
 * effort by design (mirrors the explain call) — a shorter timeout than
 * explain since template rendering + SMTP handoff is fast, no LLM call.
 */
export async function kitchenCalculatorNotifyFetch(
  payload: KitchenCalculatorNotifyPayload
): Promise<{ sent: boolean }> {
  const base = process.env.DJANGO_API_URL;
  if (!base) throw new Error("DJANGO_API_URL is not configured");

  const serviceKey = process.env.KITCHEN_CALCULATOR_SERVICE_KEY;
  if (!serviceKey) throw new Error("KITCHEN_CALCULATOR_SERVICE_KEY is not configured");

  const res = await fetch(`${base}/api/kitchen-calculator/notify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kitchen-Calculator-Key": serviceKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Kitchen Calculator API ${res.status}: ${body}`);
  }

  return res.json() as Promise<{ sent: boolean }>;
}
