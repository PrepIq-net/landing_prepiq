"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash, WarningTriangle } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  assignBranchPlan,
  extendBranchTrial,
  removeBranchStaff,
  saveBranchOperatingHours,
  setBranchActive,
  setBranchPrimary,
  updateBranch,
} from "@/lib/actions/tenant-actions";
import type {
  AdminBranchBundle,
  AdminOperatingHours,
  ChoiceOption,
} from "@/types/admin-tenants";
import type { AdminPlan } from "@/types/admin-plans";
import { ActionDialog, useAction } from "./ActionDialog";
import { AuditTrail } from "./AuditTrail";
import {
  DataRow,
  DrillLink,
  EmptyState,
  PageHeader,
  SectionCard,
  StatusPill,
  formatDate,
  formatDateTime,
  subscriptionTone,
} from "./shared";

type DialogKind = "assignPlan" | "extendTrial" | "deactivate" | "removeStaff" | null;

/** What each readiness flag means, and what to do about it. */
const READINESS_COPY: { key: string; label: string; fix: string }[] = [
  {
    key: "has_subscription",
    label: "Subscription",
    fix: "Assign a plan below — an unsubscribed branch is feature-gated.",
  },
  {
    key: "has_operating_hours",
    label: "Operating hours",
    fix: "Without hours the live risk engine withholds advice entirely.",
  },
  {
    key: "has_connector",
    label: "POS connector",
    fix: "No sales feed means forecasts stay on cold-start estimates.",
  },
  { key: "has_staff", label: "Staff assigned", fix: "Nobody can run this branch's day." },
  {
    key: "has_expected_covers",
    label: "Expected covers",
    fix: "Cold-start forecasts cannot be scaled to this branch's size.",
  },
  {
    key: "has_coordinates",
    label: "Coordinates",
    fix: "Weather and local event signals need a location.",
  },
];

export function BranchDetailManager({
  bundle,
  days,
  plans,
}: {
  bundle: AdminBranchBundle;
  days: ChoiceOption[];
  plans: AdminPlan[];
}) {
  const { branch, subscription_history, connectors, recent_activity } = bundle;
  const { pending, run } = useAction();

  const [dialog, setDialog] = useState<DialogKind>(null);
  const [staffTarget, setStaffTarget] = useState<{
    userId: string;
    email: string;
  } | null>(null);

  const [config, setConfig] = useState({
    name: branch.name,
    code: branch.code,
    address: branch.address,
    phone: branch.phone,
    email: branch.email,
    timezone: branch.timezone,
    currency: branch.currency,
    latitude: branch.latitude?.toString() ?? "",
    longitude: branch.longitude?.toString() ?? "",
    expected_daily_covers: branch.expected_daily_covers?.toString() ?? "",
    average_prep_time_minutes: String(branch.average_prep_time_minutes),
    shows_live_sports: branch.shows_live_sports,
  });

  // Every day is present in the editor, whether or not the branch has a row for
  // it — a missing day and a closed day are different states, and the form has
  // to let you express both.
  const [hours, setHours] = useState<AdminOperatingHours[]>(() =>
    days.map((day) => {
      const existing = branch.operating_hours.find(
        (row) => row.day_of_week === day.value,
      );
      return (
        existing ?? {
          day_of_week: day.value,
          opens_at: null,
          closes_at: null,
          is_closed: true,
        }
      );
    }),
  );

  const [planId, setPlanId] = useState("");
  const [asTrial, setAsTrial] = useState(false);
  const [trialDays, setTrialDays] = useState("14");
  const [extendDays, setExtendDays] = useState("7");

  function saveConfig() {
    run(
      () =>
        updateBranch(branch.id, {
          ...config,
          // Empty strings would be rejected as invalid numbers; null clears.
          latitude: config.latitude === "" ? null : Number(config.latitude),
          longitude: config.longitude === "" ? null : Number(config.longitude),
          expected_daily_covers:
            config.expected_daily_covers === ""
              ? null
              : Number(config.expected_daily_covers),
          average_prep_time_minutes: Number(config.average_prep_time_minutes),
        }),
      "Branch updated.",
    );
  }

  function saveHours() {
    run(
      () =>
        saveBranchOperatingHours(
          branch.id,
          hours.map((row) => ({
            day_of_week: row.day_of_week,
            opens_at: row.is_closed ? null : row.opens_at,
            closes_at: row.is_closed ? null : row.closes_at,
            is_closed: row.is_closed,
          })),
        ),
      "Operating hours saved.",
    );
  }

  const unmet = READINESS_COPY.filter((item) => !branch.readiness[item.key]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={branch.name}
        description={
          <>
            {branch.code} ·{" "}
            <Link
              href={`/admin/organizations/${branch.organization_id}`}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {branch.organization_name}
            </Link>
          </>
        }
        actions={
          <>
            {!branch.is_primary && branch.is_active && (
              <Button
                variant="outline"
                onClick={() =>
                  run(() => setBranchPrimary(branch.id), "Set as primary branch.")
                }
                disabled={pending}
              >
                Make primary
              </Button>
            )}
            {branch.is_active ? (
              <Button
                variant="destructive"
                onClick={() => setDialog("deactivate")}
                disabled={pending || branch.is_primary}
              >
                Deactivate
              </Button>
            ) : (
              <Button
                onClick={() =>
                  run(() => setBranchActive(branch.id, true), "Branch activated.")
                }
                disabled={pending}
              >
                Activate
              </Button>
            )}
          </>
        }
      />

      {unmet.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <WarningTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--warning))]" />
            <div className="min-w-0 space-y-2">
              <h2 className="text-sm font-semibold text-foreground">
                {unmet.length} thing{unmet.length === 1 ? "" : "s"} missing
                before this branch can forecast properly
              </h2>
              <ul className="space-y-1">
                {unmet.map((item) => (
                  <li key={item.key} className="text-sm text-muted-foreground">
                    <span className="text-foreground">{item.label}</span> —{" "}
                    {item.fix}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Configuration"
          description="Location, contact, and the demand context that scales forecasts."
          className="lg:col-span-2"
          actions={
            <Button size="sm" onClick={saveConfig} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="branch-name"
              label="Name"
              value={config.name}
              onChange={(v) => setConfig({ ...config, name: v })}
            />
            <Field
              id="branch-code"
              label="Code"
              value={config.code}
              onChange={(v) => setConfig({ ...config, code: v })}
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="branch-address">Address</Label>
              <Input
                id="branch-address"
                value={config.address}
                onChange={(event) =>
                  setConfig({ ...config, address: event.target.value })
                }
              />
            </div>
            <Field
              id="branch-phone"
              label="Phone"
              value={config.phone}
              onChange={(v) => setConfig({ ...config, phone: v })}
            />
            <Field
              id="branch-email"
              label="Email"
              type="email"
              value={config.email}
              onChange={(v) => setConfig({ ...config, email: v })}
            />
            <Field
              id="branch-timezone"
              label="Timezone"
              hint="IANA, e.g. Africa/Kampala"
              value={config.timezone}
              onChange={(v) => setConfig({ ...config, timezone: v })}
            />
            <Field
              id="branch-currency"
              label="Currency"
              hint="Operational money is denominated here"
              value={config.currency}
              onChange={(v) => setConfig({ ...config, currency: v })}
            />
            <Field
              id="branch-lat"
              label="Latitude"
              value={config.latitude}
              onChange={(v) => setConfig({ ...config, latitude: v })}
            />
            <Field
              id="branch-lng"
              label="Longitude"
              value={config.longitude}
              onChange={(v) => setConfig({ ...config, longitude: v })}
            />
            <Field
              id="branch-covers"
              label="Expected daily covers"
              hint="Owner's estimate; scales cold-start forecasts only"
              value={config.expected_daily_covers}
              onChange={(v) =>
                setConfig({ ...config, expected_daily_covers: v })
              }
            />
            <Field
              id="branch-prep"
              label="Avg prep time (minutes)"
              value={config.average_prep_time_minutes}
              onChange={(v) =>
                setConfig({ ...config, average_prep_time_minutes: v })
              }
            />
            <div className="flex items-center justify-between gap-3 sm:col-span-2 border-t border-border pt-4">
              <div>
                <Label htmlFor="branch-sports">Shows live sports</Label>
                <p className="text-xs text-muted-foreground">
                  Gates the sports demand signal entirely.
                </p>
              </div>
              <Switch
                id="branch-sports"
                checked={config.shows_live_sports}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, shows_live_sports: checked })
                }
              />
            </div>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Subscription">
            {branch.subscription ? (
              <dl>
                <DataRow label="Plan">{branch.subscription.plan_name}</DataRow>
                <DataRow label="Status">
                  <StatusPill tone={subscriptionTone(branch.subscription.status)}>
                    {branch.subscription.status}
                  </StatusPill>
                </DataRow>
                <DataRow label="Billing">
                  {branch.subscription.billing_cycle}
                </DataRow>
                <DataRow label="Trial">
                  {branch.subscription.is_trial
                    ? `Ends ${formatDate(branch.subscription.trial_ends_at)}`
                    : "Not on trial"}
                </DataRow>
                <DataRow label="Next billing">
                  {formatDate(branch.subscription.next_billing_date)}
                </DataRow>
                <DataRow label="Payment">
                  {branch.subscription.is_offline_billing
                    ? "Manual invoice (offline)"
                    : "Automated gateway"}
                </DataRow>
                {branch.subscription.cancel_at_period_end && (
                  <DataRow label="Canceling">
                    <StatusPill tone="warning">
                      Active until {formatDate(branch.subscription.end_date)}, then
                      lapses
                    </StatusPill>
                  </DataRow>
                )}
              </dl>
            ) : (
              <EmptyState
                title="No subscription"
                hint="This branch is feature-gated until a plan is assigned."
              />
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDialog("assignPlan")}
                disabled={pending}
              >
                Assign plan
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDialog("extendTrial")}
                disabled={pending || !branch.subscription}
              >
                Extend trial
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="At a glance">
            <dl>
              <DataRow label="Status">
                {branch.is_active ? (
                  <StatusPill tone="success">Active</StatusPill>
                ) : (
                  <StatusPill tone="neutral">Inactive</StatusPill>
                )}
              </DataRow>
              <DataRow label="Primary">
                {branch.is_primary ? "Yes" : "No"}
              </DataRow>
              <DataRow label="Manager">
                {branch.branch_manager?.full_name ?? "Unassigned"}
              </DataRow>
              <DataRow label="Staff">{branch.staff_count}</DataRow>
              <DataRow label="Created">{formatDate(branch.created_at)}</DataRow>
            </dl>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Operating hours"
        description="The live risk engine withholds advice for a branch with no hours, so this is rarely cosmetic."
        actions={
          <Button size="sm" onClick={saveHours} disabled={pending}>
            {pending ? "Saving…" : "Save hours"}
          </Button>
        }
      >
        <div>
          {hours.map((row, index) => (
            <div
              key={row.day_of_week}
              className="flex flex-wrap items-center gap-3 border-b border-border/60 py-2.5 last:border-0"
            >
              <span className="w-28 text-sm font-medium text-foreground">
                {days.find((d) => d.value === row.day_of_week)?.label ??
                  row.day_of_week}
              </span>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch
                  checked={!row.is_closed}
                  onCheckedChange={(checked) => {
                    const next = [...hours];
                    next[index] = { ...row, is_closed: !checked };
                    setHours(next);
                  }}
                  aria-label={`Open on ${row.day_of_week}`}
                />
                {row.is_closed ? "Closed" : "Open"}
              </label>

              {!row.is_closed && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={row.opens_at?.slice(0, 5) ?? ""}
                    onChange={(event) => {
                      const next = [...hours];
                      next[index] = { ...row, opens_at: event.target.value };
                      setHours(next);
                    }}
                    aria-label={`Opens at on ${row.day_of_week}`}
                    className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={row.closes_at?.slice(0, 5) ?? ""}
                    onChange={(event) => {
                      const next = [...hours];
                      next[index] = { ...row, closes_at: event.target.value };
                      setHours(next);
                    }}
                    aria-label={`Closes at on ${row.day_of_week}`}
                    className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Staff"
          description="People assigned to work this branch."
        >
          {branch.staff.length === 0 ? (
            <EmptyState title="Nobody assigned to this branch" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branch.staff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <DrillLink href={`/admin/accounts/${staff.user.id}`}>
                        {staff.user.full_name || staff.user.email}
                      </DrillLink>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {staff.role?.name ?? "No role"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStaffTarget({
                            userId: staff.user.id,
                            email: staff.user.email,
                          });
                          setDialog("removeStaff");
                        }}
                        disabled={pending}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove {staff.user.email}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard
          title="POS connectors"
          description="The sales feed this branch forecasts from."
        >
          {connectors.length === 0 ? (
            <EmptyState
              title="No connector installed"
              hint="Forecasts fall back to cold-start estimates until sales data flows."
            />
          ) : (
            <ul>
              {connectors.map((connector) => (
                <li
                  key={connector.id}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/connectors/${connector.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {connector.display_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Last heartbeat{" "}
                      {formatDateTime(connector.last_heartbeat_at)}
                    </p>
                  </div>
                  <StatusPill
                    tone={connector.status === "ONLINE" ? "success" : "warning"}
                  >
                    {connector.status}
                  </StatusPill>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Subscription history">
          {subscription_history.length === 0 ? (
            <EmptyState title="No subscriptions recorded" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscription_history
                  .filter((row): row is NonNullable<typeof row> => row !== null)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-sm">{row.plan_name}</TableCell>
                      <TableCell>
                        <StatusPill tone={subscriptionTone(row.status)}>
                          {row.status}
                        </StatusPill>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {row.price_at_subscription}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard title="Admin activity">
          <AuditTrail entries={recent_activity} />
        </SectionCard>
      </div>

      {/* -- dialogs ------------------------------------------------------ */}

      <ActionDialog
        open={dialog === "assignPlan"}
        onOpenChange={(open) => setDialog(open ? "assignPlan" : null)}
        title="Assign a plan"
        description="Replaces whatever plan this branch is on. Nothing is charged — auto-renew stays off, so this is for comped accounts, pilots, and repairing failed checkouts."
        confirmLabel="Assign plan"
        successMessage="Plan assigned."
        onConfirm={(note) =>
          assignBranchPlan(branch.id, {
            plan_id: planId,
            is_trial: asTrial,
            trial_days: Number(trialDays) || 0,
            note,
          })
        }
        reasonLabel="Note"
        reasonPlaceholder="Ticket reference, deal name, why this was comped…"
      >
        <div className="space-y-2">
          <Label htmlFor="assign-plan">Plan</Label>
          <select
            id="assign-plan"
            value={planId}
            onChange={(event) => setPlanId(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a plan…</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — ${plan.monthly_price}/mo
                {plan.is_active ? "" : " (retired)"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Label htmlFor="assign-trial">Start as a trial</Label>
          <Switch
            id="assign-trial"
            checked={asTrial}
            onCheckedChange={setAsTrial}
          />
        </div>
        {asTrial && (
          <div className="space-y-2">
            <Label htmlFor="assign-trial-days">Trial length (days)</Label>
            <Input
              id="assign-trial-days"
              value={trialDays}
              onChange={(event) => setTrialDays(event.target.value)}
            />
          </div>
        )}
      </ActionDialog>

      <ActionDialog
        open={dialog === "extendTrial"}
        onOpenChange={(open) => setDialog(open ? "extendTrial" : null)}
        title="Extend the trial"
        description="Adds days to this branch's trial. An already-expired trial restarts from today rather than from the old end date."
        confirmLabel="Extend trial"
        successMessage="Trial extended."
        onConfirm={() => extendBranchTrial(branch.id, Number(extendDays) || 0)}
      >
        <div className="space-y-2">
          <Label htmlFor="extend-days">Days to add</Label>
          <Input
            id="extend-days"
            value={extendDays}
            onChange={(event) => setExtendDays(event.target.value)}
          />
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog === "deactivate"}
        onOpenChange={(open) => setDialog(open ? "deactivate" : null)}
        title={`Deactivate ${branch.name}?`}
        description="The branch disappears from the product. Its data is kept and it can be reactivated at any time."
        confirmLabel="Deactivate branch"
        destructive
        successMessage="Branch deactivated."
        onConfirm={() => setBranchActive(branch.id, false)}
      />

      <ActionDialog
        open={dialog === "removeStaff"}
        onOpenChange={(open) => setDialog(open ? "removeStaff" : null)}
        title={`Remove ${staffTarget?.email ?? "staff"} from this branch?`}
        description="They keep their organization membership and any other branch assignments."
        confirmLabel="Remove from branch"
        destructive
        successMessage="Removed from branch."
        onConfirm={() =>
          staffTarget
            ? removeBranchStaff(branch.id, staffTarget.userId)
            : Promise.resolve({ ok: false, error: "Nobody selected." })
        }
      />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
