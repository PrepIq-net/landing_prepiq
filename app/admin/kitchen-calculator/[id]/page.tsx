import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatMoney, formatCompactMoney } from "@/lib/kitchen-calculator/format";
import type { Currency } from "@/lib/kitchen-calculator/engine";
import { LeadActions } from "./LeadActions";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

export default async function KitchenCalculatorLeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, session] = await Promise.all([
    prisma.kitchenCalculatorLead.findUnique({ where: { id } }),
    auth(),
  ]);
  if (!lead) notFound();

  const sessionUser = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email }, select: { role: true } })
    : null;
  const isAdmin = sessionUser?.role === "ADMIN";
  const currency = lead.currency as Currency;
  const explanationMeta = lead.explanationMeta as
    | { provider?: string; model?: string }
    | null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link href="/admin/kitchen-calculator" className="text-xs text-muted-foreground hover:text-foreground">
            ← All submissions
          </Link>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            KIC-{lead.refNo}
          </h1>
          <p className="text-muted-foreground text-sm">
            Submitted {lead.createdAt.toLocaleString("en-US")} · <span className="uppercase">{lead.locale}</span>
          </p>
        </div>
        <LeadActions leadId={lead.id} isAdmin={isAdmin} handled={lead.handled} />
      </div>

      <div className="bg-card border border-secondary rounded-xl p-6 shadow-l2">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-sm font-semibold text-foreground">Lead</h2>
          {lead.handled ? (
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Handled{lead.handledBy ? ` · ${lead.handledBy}` : ""}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
              New
            </Badge>
          )}
        </div>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <Field label="Email" value={lead.email} />
          <Field label="Restaurant" value={lead.restaurantName} />
          <Field
            label="Snapshot email"
            value={
              lead.emailSentAt ? (
                <span className="text-emerald-400">Sent {lead.emailSentAt.toLocaleString("en-US")}</span>
              ) : lead.emailError ? (
                <span className="text-red-400">Failed — {lead.emailError}</span>
              ) : (
                "Not sent"
              )
            }
          />
        </dl>
      </div>

      <div className="bg-card border border-secondary rounded-xl p-6 shadow-l2">
        <h2 className="font-display text-sm font-semibold text-foreground mb-3">Their answers</h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <Field label="Weekly revenue / location" value={formatMoney(lead.weeklyRevenuePerLocation, currency)} />
          <Field label="Locations" value={lead.locations} />
          <Field label="Operating days / week" value={lead.operatingDays} />
          <Field label="Planning method" value={lead.planningMethod} />
          <Field label="Waste estimate" value={lead.wasteEstimate} />
          <Field label="Stockout frequency" value={lead.stockoutFrequency} />
        </dl>
      </div>

      <div className="bg-card border border-secondary rounded-xl p-6 shadow-l2">
        <h2 className="font-display text-sm font-semibold text-foreground mb-3">Computed snapshot</h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <Field label="Weekly network revenue" value={formatCompactMoney(lead.weeklyNetworkRevenue, currency)} />
          <Field label="Annual revenue" value={formatCompactMoney(lead.annualRevenue, currency)} />
          <Field
            label="Waste exposure / week"
            value={`${formatCompactMoney(lead.wasteExposureLow, currency)} – ${formatCompactMoney(lead.wasteExposureHigh, currency)}`}
          />
          <Field
            label="Stockout exposure / week"
            value={`${formatCompactMoney(lead.stockoutExposureLow, currency)} – ${formatCompactMoney(lead.stockoutExposureHigh, currency)}`}
          />
          <Field
            label="Potential annual impact"
            value={`${formatCompactMoney(lead.annualImpactLow, currency)} – ${formatCompactMoney(lead.annualImpactHigh, currency)}`}
          />
          <Field
            label="Forecast uncertainty"
            value={`${Math.round(lead.forecastUncertaintyLow)}–${Math.round(lead.forecastUncertaintyHigh)}%`}
          />
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-5">
          <Field
            label="Intelligence score"
            value={<span className="font-display font-semibold text-primary">{lead.intelligenceScore}/100</span>}
          />
          <Field label="Planning maturity" value={lead.planningMaturityScore} />
          <Field label="Forecasting maturity" value={lead.forecastingMaturityScore} />
          <Field label="Waste visibility" value={lead.wasteVisibilityScore ?? "Not assessed"} />
          <Field label="Operational visibility" value={lead.operationalVisibilityScore ?? "Not assessed"} />
        </div>
        <div className="mt-5">
          <Field label="Primary opportunity" value={lead.primaryOpportunity} />
        </div>
      </div>

      {lead.explanation && (
        <div className="bg-card border border-secondary rounded-xl p-6 shadow-l2">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-display text-sm font-semibold text-foreground">LLM explanation</h2>
            {explanationMeta?.provider && (
              <Badge variant="outline" className="text-[10px] bg-zinc-500/10 text-zinc-400 border-zinc-500/30">
                {explanationMeta.provider}
                {explanationMeta.model ? ` / ${explanationMeta.model}` : ""}
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{lead.explanation}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {lead.visitorId && <>Visitor {lead.visitorId} · </>}
        {lead.userAgent && <>{lead.userAgent}</>}
      </div>
    </div>
  );
}
