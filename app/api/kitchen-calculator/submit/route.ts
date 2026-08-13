import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { clientIpHash, isRateLimited, rateLimitedResponse } from "../guards";
import {
  computeKitchenCalculatorMetrics,
  CURRENCIES,
  PLANNING_METHODS,
  WASTE_ESTIMATES,
  STOCKOUT_FREQUENCIES,
} from "@/lib/kitchen-calculator/engine";
import {
  kitchenCalculatorExplainFetch,
  kitchenCalculatorNotifyFetch,
  type KitchenCalculatorExplainResult,
} from "@/lib/kitchen-calculator/django";
import { formatMoney, formatMoneyRange } from "@/lib/kitchen-calculator/format";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

const nullableEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .enum(values as unknown as [T[number], ...T[number][]])
    .nullish()
    .transform((v) => v ?? null);

const SubmitSchema = z.object({
  locale: z.enum(["en", "fr"]).default("en"),
  visitorId: z.string().max(64).nullish(),

  // Step 1
  weeklyRevenuePerLocation: z.number().finite().positive().max(1_000_000_000_000),
  currency: z.enum(CURRENCIES),
  locations: z.number().int().min(1).max(10_000),

  // Step 2
  operatingDays: z.number().int().min(1).max(7),
  planningMethod: z.enum(PLANNING_METHODS),

  // Step 3 — optional
  wasteEstimate: nullableEnum(WASTE_ESTIMATES),
  stockoutFrequency: nullableEnum(STOCKOUT_FREQUENCIES),

  // Step 4
  email: z.string().trim().email().max(320),
  restaurantName: z
    .string()
    .max(200)
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullish(),

  // Honeypot: real users never fill this hidden field.
  website: z.string().nullish(),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = SubmitSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (parsed.website) {
    return NextResponse.json({ ok: true });
  }

  const ipHash = clientIpHash(request);
  if (isRateLimited(`kitchen-calculator:${ipHash}:${parsed.visitorId ?? "anon"}`)) {
    return rateLimitedResponse();
  }

  // Numbers are always recomputed here from the validated inputs — the client
  // may show an instant preview with the same engine, but nothing it submits
  // as a "computed" number is ever trusted or persisted directly.
  const metrics = computeKitchenCalculatorMetrics({
    weeklyRevenuePerLocation: parsed.weeklyRevenuePerLocation,
    currency: parsed.currency,
    locations: parsed.locations,
    operatingDays: parsed.operatingDays,
    planningMethod: parsed.planningMethod,
    wasteEstimate: parsed.wasteEstimate,
    stockoutFrequency: parsed.stockoutFrequency,
  });

  // The narrative is best-effort: a provider outage must never cost the lead.
  let explanation: string | null = null;
  let explanationMeta: KitchenCalculatorExplainResult["meta"] | null = null;
  try {
    const result = await kitchenCalculatorExplainFetch({
      locale: parsed.locale,
      currency: parsed.currency,
      locations: parsed.locations,
      operatingDays: parsed.operatingDays,
      planningMethod: parsed.planningMethod,
      wasteEstimate: parsed.wasteEstimate,
      stockoutFrequency: parsed.stockoutFrequency,
      ...metrics,
    });
    explanation = result.explanation || null;
    explanationMeta = result.meta;
  } catch (err) {
    console.error("Kitchen calculator explain call failed", err);
  }

  // primaryOpportunityKey is persisted alongside the human-readable
  // primaryOpportunity string so an admin resend can reproduce the exact
  // email the visitor received, even if the engine's key-selection logic
  // changes later.
  const { primaryOpportunityKey, primaryOpportunity, ...metricsForStorage } = metrics;

  const lead = await prisma.kitchenCalculatorLead.create({
    data: {
      locale: parsed.locale,
      visitorId: parsed.visitorId ?? null,

      weeklyRevenuePerLocation: parsed.weeklyRevenuePerLocation,
      currency: parsed.currency,
      locations: parsed.locations,

      operatingDays: parsed.operatingDays,
      planningMethod: parsed.planningMethod,

      wasteEstimate: parsed.wasteEstimate,
      stockoutFrequency: parsed.stockoutFrequency,

      email: parsed.email,
      restaurantName: parsed.restaurantName ?? null,

      primaryOpportunityKey,
      primaryOpportunity,

      ...metricsForStorage,

      explanation,
      explanationMeta: explanationMeta ?? undefined,

      ipHash,
      userAgent: request.headers.get("user-agent") ?? null,
    },
  });

  // The snapshot email is best-effort, same principle as the explanation
  // call above: a failed send must never fail the submission response, and
  // never re-derives numbers — it reuses the exact metrics already computed.
  try {
    const { sent } = await kitchenCalculatorNotifyFetch({
      locale: parsed.locale,
      email: parsed.email,
      restaurantName: parsed.restaurantName ?? null,
      refNo: lead.refNo,
      currency: parsed.currency,
      locations: parsed.locations,
      operatingDays: parsed.operatingDays,
      planningMethod: parsed.planningMethod,
      wasteEstimate: parsed.wasteEstimate,
      stockoutFrequency: parsed.stockoutFrequency,
      intelligenceScore: metrics.intelligenceScore,
      planningMaturityScore: metrics.planningMaturityScore,
      forecastingMaturityScore: metrics.forecastingMaturityScore,
      wasteVisibilityScore: metrics.wasteVisibilityScore,
      operationalVisibilityScore: metrics.operationalVisibilityScore,
      primaryOpportunityKey: metrics.primaryOpportunityKey,
      primaryOpportunity: metrics.primaryOpportunity,
      explanation,
      weeklyNetworkRevenueFormatted: formatMoney(metrics.weeklyNetworkRevenue, parsed.currency),
      annualRevenueFormatted: formatMoney(metrics.annualRevenue, parsed.currency),
      wasteExposureRangeFormatted: formatMoneyRange(
        metrics.wasteExposureLow,
        metrics.wasteExposureHigh,
        parsed.currency,
      ),
      stockoutExposureRangeFormatted: formatMoneyRange(
        metrics.stockoutExposureLow,
        metrics.stockoutExposureHigh,
        parsed.currency,
      ),
      annualImpactRangeFormatted: formatMoneyRange(
        metrics.annualImpactLow,
        metrics.annualImpactHigh,
        parsed.currency,
      ),
      forecastUncertaintyRangeFormatted: `${Math.round(metrics.forecastUncertaintyLow)}–${Math.round(metrics.forecastUncertaintyHigh)}%`,
      calendlyUrl: CALENDLY_URL,
      appUrl: APP_URL,
    });
    await prisma.kitchenCalculatorLead.update({
      where: { id: lead.id },
      data: sent ? { emailSentAt: new Date(), emailError: null } : { emailError: "provider_declined" },
    });
  } catch (err) {
    console.error("Kitchen calculator notify call failed", err);
    await prisma.kitchenCalculatorLead
      .update({
        where: { id: lead.id },
        data: { emailError: err instanceof Error ? err.message.slice(0, 500) : "unknown_error" },
      })
      .catch(() => {});
  }

  return NextResponse.json({
    refNo: lead.refNo,
    ...metrics,
    explanation,
  });
}
