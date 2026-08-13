"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import { prisma } from "@/lib/prisma";
import { APP_URL, CALENDLY_URL } from "@/lib/constants";
import {
  type Currency,
  type PlanningMethod,
  type WasteEstimate,
  type StockoutFrequency,
} from "@/lib/kitchen-calculator/engine";
import { formatMoney, formatMoneyRange } from "@/lib/kitchen-calculator/format";
import { kitchenCalculatorNotifyFetch } from "@/lib/kitchen-calculator/django";

async function requireSessionUser() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true },
  });
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function markKitchenCalculatorLeadHandled(id: string, handled: boolean) {
  const user = await requireSessionUser();

  await prisma.kitchenCalculatorLead.update({
    where: { id },
    data: {
      handled,
      handledBy: handled ? user.email : null,
      handledAt: handled ? new Date() : null,
    },
  });

  await logActivity(
    user.id,
    "UPDATE",
    "KITCHEN_CALCULATOR_LEAD",
    id,
    handled ? "Marked kitchen calculator lead handled" : "Reopened kitchen calculator lead"
  );
  revalidatePath(`/admin/kitchen-calculator/${id}`);
  revalidatePath("/admin/kitchen-calculator");
  return { success: true };
}

export async function resendKitchenCalculatorLeadEmail(id: string) {
  const user = await requireSessionUser();

  const lead = await prisma.kitchenCalculatorLead.findUniqueOrThrow({ where: { id } });

  // The snapshot email is built entirely from the lead's persisted engine
  // output (scores, opportunity key, formatted figures) — never re-derived —
  // so a resend reproduces the exact email the visitor originally received,
  // even if the engine's logic changes later.
  const currency = lead.currency as Currency;

  let sent = false;
  try {
    const result = await kitchenCalculatorNotifyFetch({
      locale: lead.locale as "en" | "fr",
      email: lead.email,
      restaurantName: lead.restaurantName,
      refNo: lead.refNo,
      currency: lead.currency,
      locations: lead.locations,
      operatingDays: lead.operatingDays,
      planningMethod: lead.planningMethod as PlanningMethod,
      wasteEstimate: lead.wasteEstimate as WasteEstimate | null,
      stockoutFrequency: lead.stockoutFrequency as StockoutFrequency | null,
      intelligenceScore: lead.intelligenceScore,
      planningMaturityScore: lead.planningMaturityScore,
      forecastingMaturityScore: lead.forecastingMaturityScore,
      wasteVisibilityScore: lead.wasteVisibilityScore,
      operationalVisibilityScore: lead.operationalVisibilityScore,
      primaryOpportunityKey: lead.primaryOpportunityKey,
      primaryOpportunity: lead.primaryOpportunity,
      explanation: lead.explanation,
      weeklyNetworkRevenueFormatted: formatMoney(lead.weeklyNetworkRevenue, currency),
      annualRevenueFormatted: formatMoney(lead.annualRevenue, currency),
      wasteExposureRangeFormatted: formatMoneyRange(
        lead.wasteExposureLow,
        lead.wasteExposureHigh,
        currency,
      ),
      stockoutExposureRangeFormatted: formatMoneyRange(
        lead.stockoutExposureLow,
        lead.stockoutExposureHigh,
        currency,
      ),
      annualImpactRangeFormatted: formatMoneyRange(
        lead.annualImpactLow,
        lead.annualImpactHigh,
        currency,
      ),
      forecastUncertaintyRangeFormatted: `${Math.round(lead.forecastUncertaintyLow)}–${Math.round(lead.forecastUncertaintyHigh)}%`,
      calendlyUrl: CALENDLY_URL,
      appUrl: APP_URL,
    });
    sent = result.sent;
    await prisma.kitchenCalculatorLead.update({
      where: { id },
      data: sent ? { emailSentAt: new Date(), emailError: null } : { emailError: "provider_declined" },
    });
  } catch (err) {
    await prisma.kitchenCalculatorLead.update({
      where: { id },
      data: { emailError: err instanceof Error ? err.message.slice(0, 500) : "unknown_error" },
    });
    throw new Error("Failed to send email — see emailError on the lead for details");
  }

  await logActivity(
    user.id,
    "UPDATE",
    "KITCHEN_CALCULATOR_LEAD",
    id,
    sent ? "Resent kitchen calculator snapshot email" : "Attempted resend — provider declined"
  );
  revalidatePath(`/admin/kitchen-calculator/${id}`);
  return { success: true, sent };
}

export async function deleteKitchenCalculatorLead(id: string) {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") throw new Error("Not authorized");

  const lead = await prisma.kitchenCalculatorLead.delete({
    where: { id },
    select: { refNo: true },
  });

  await logActivity(
    user.id,
    "DELETE",
    "KITCHEN_CALCULATOR_LEAD",
    id,
    `Deleted kitchen calculator submission KIC-${lead.refNo}`
  );
  revalidatePath("/admin/kitchen-calculator");
  redirect("/admin/kitchen-calculator");
}
