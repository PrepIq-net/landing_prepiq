"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Check,
  EditPencil,
  InfoCircle,
  Plus,
  Trash,
  Xmark,
} from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  toggleSubscriptionPlanActive,
  updateSubscriptionPlan,
} from "@/lib/actions/subscription-actions";
import type {
  AdminCapability,
  AdminPlan,
  AdminPlanWritePayload,
  ChoiceOption,
} from "@/types/admin-plans";
import { cn } from "@/lib/utils";

const LIMIT_LABELS: Record<string, string> = {
  MAX_STAFF_PER_BRANCH: "Staff per branch",
  MAX_TOTAL_STAFF: "Total staff (org-wide)",
  MAX_BRANCHES: "Branches",
  MAX_DONATIONS_PER_MONTH: "Donations per month",
};

/** Empty string in a limit input means "no row" — i.e. unlimited. */
type LimitDraft = Record<string, string>;

interface PlanDraft {
  name: string;
  plan_type: string;
  plan_category: string;
  tagline: string;
  description: string;
  monthly_price: string;
  yearly_price: string;
  features: string[];
  limits: LimitDraft;
  capability_codes: string[];
  trial_days: string;
  display_order: string;
  is_active: boolean;
  is_popular: boolean;
  custom_pricing: boolean;
  per_location_pricing: boolean;
}

function draftFromPlan(plan: AdminPlan | null, limitCodes: string[]): PlanDraft {
  const limits: LimitDraft = {};
  for (const code of limitCodes) {
    const value = plan?.limits?.[code];
    limits[code] = value == null ? "" : String(value);
  }
  return {
    name: plan?.name ?? "",
    plan_type: plan?.plan_type ?? "",
    plan_category: plan?.plan_category ?? "CORE",
    tagline: plan?.tagline ?? "",
    description: plan?.description ?? "",
    monthly_price: plan?.monthly_price ?? "0.00",
    yearly_price: plan?.yearly_price ?? "0.00",
    features: plan?.features ? [...plan.features] : [],
    limits,
    capability_codes: plan?.capability_codes ? [...plan.capability_codes] : [],
    trial_days: String(plan?.trial_days ?? 0),
    display_order: String(plan?.display_order ?? 0),
    is_active: plan?.is_active ?? true,
    is_popular: plan?.is_popular ?? false,
    custom_pricing: plan?.custom_pricing ?? false,
    per_location_pricing: plan?.per_location_pricing ?? true,
  };
}

function payloadFromDraft(draft: PlanDraft): AdminPlanWritePayload {
  return {
    name: draft.name.trim(),
    plan_type: draft.plan_type.trim().toUpperCase(),
    plan_category: draft.plan_category,
    tagline: draft.tagline.trim(),
    description: draft.description.trim(),
    monthly_price: draft.monthly_price,
    yearly_price: draft.yearly_price,
    features: draft.features.map((f) => f.trim()).filter(Boolean),
    // Blank input → null → the backend deletes the row, meaning unlimited.
    limits: Object.fromEntries(
      Object.entries(draft.limits).map(([code, value]) => [
        code,
        value.trim() === "" ? null : Number(value),
      ]),
    ),
    capability_codes: draft.capability_codes,
    trial_days: Number(draft.trial_days) || 0,
    display_order: Number(draft.display_order) || 0,
    is_active: draft.is_active,
    is_popular: draft.is_popular,
    custom_pricing: draft.custom_pricing,
    per_location_pricing: draft.per_location_pricing,
  };
}

const money = (value: string) => `$${Number.parseFloat(value || "0").toFixed(2)}`;

export function SubscriptionPlansManager({
  plans,
  capabilities,
  planCategories,
  limitCodes,
}: {
  plans: AdminPlan[];
  capabilities: AdminCapability[];
  planCategories: ChoiceOption[];
  limitCodes: string[];
}) {
  const [editing, setEditing] = useState<AdminPlan | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminPlan | null>(null);
  const [pending, startTransition] = useTransition();

  const activeCount = plans.filter((p) => p.is_active).length;
  const branchesOnPlans = plans.reduce(
    (sum, p) => sum + p.active_subscription_count,
    0,
  );

  const handleToggle = (plan: AdminPlan) => {
    startTransition(async () => {
      const result = await toggleSubscriptionPlanActive(plan.id, !plan.is_active);
      if (result.ok) {
        toast.success(
          `${plan.name} is now ${plan.is_active ? "hidden from" : "visible on"} the pricing page`,
        );
      } else {
        toast.error(result.error ?? "Could not update plan visibility");
      }
    });
  };

  const handleDelete = (plan: AdminPlan) => {
    startTransition(async () => {
      const result = await deleteSubscriptionPlan(plan.id);
      if (result.ok) {
        toast.success(`Deleted ${plan.name}`);
        setConfirmDelete(null);
      } else {
        toast.error(result.error ?? "Could not delete plan");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Subscription Plans
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Pricing, limits, and entitlements for every plan. A plan is bought{" "}
            <strong className="text-foreground font-medium">per kitchen branch</strong> —
            one organization can run each of its branches on a different plan.
            Saving here updates the public /pricing page immediately.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Plans" value={String(plans.length)} />
        <StatCard label="Visible on /pricing" value={String(activeCount)} />
        <StatCard label="Branches subscribed" value={String(branchesOnPlans)} />
      </div>

      {plans.length === 0 ? (
        <EmptyState onCreate={() => setCreating(true)} />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Monthly</TableHead>
                  <TableHead className="text-right">Yearly</TableHead>
                  <TableHead className="text-right">Staff / branch</TableHead>
                  <TableHead className="text-right">Trial</TableHead>
                  <TableHead className="text-right">Branches</TableHead>
                  <TableHead className="text-center">Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => {
                  const staffCap = plan.limits?.MAX_STAFF_PER_BRANCH;
                  return (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {plan.name}
                          </span>
                          {plan.is_popular && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary border border-primary/30 bg-primary/10 rounded-full px-2 py-0.5">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {plan.plan_type}
                          {plan.tagline ? ` · ${plan.tagline}` : ""}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money(plan.monthly_price)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money(plan.yearly_price)}
                        {plan.yearly_discount_percentage > 0 && (
                          <span className="block text-[10px] text-muted-foreground">
                            −{plan.yearly_discount_percentage}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {staffCap == null ? (
                          <span className="text-muted-foreground">Unlimited</span>
                        ) : (
                          <span className="tabular-nums">{staffCap}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {plan.trial_days > 0 ? `${plan.trial_days}d` : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {plan.active_subscription_count}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={plan.is_active}
                          disabled={pending}
                          onCheckedChange={() => handleToggle(plan)}
                          aria-label={`${plan.is_active ? "Hide" : "Show"} ${plan.name} on the pricing page`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditing(plan)}
                            aria-label={`Edit ${plan.name}`}
                          >
                            <EditPencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(plan)}
                            aria-label={`Delete ${plan.name}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <PlanEditorDialog
        key={editing?.id ?? (creating ? "new" : "closed")}
        plan={editing}
        open={Boolean(editing) || creating}
        mode={creating ? "create" : "edit"}
        capabilities={capabilities}
        planCategories={planCategories}
        limitCodes={limitCodes}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
      />

      <Dialog
        open={Boolean(confirmDelete)}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {confirmDelete?.name}?</DialogTitle>
            <DialogDescription>
              This cannot be undone. If any branch is still subscribed the delete
              is refused — hide the plan instead so existing branches keep
              working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
            >
              {pending ? "Deleting…" : "Delete plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-3xl font-display font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <p className="text-foreground font-medium">No plans yet</p>
      <p className="text-sm text-muted-foreground mt-1 mb-5">
        The pricing section stays hidden on the site until at least one plan
        exists here.
      </p>
      <Button onClick={onCreate} className="gap-2">
        <Plus className="h-4 w-4" />
        Create the first plan
      </Button>
    </div>
  );
}

function PlanEditorDialog({
  plan,
  open,
  mode,
  capabilities,
  planCategories,
  limitCodes,
  onClose,
}: {
  plan: AdminPlan | null;
  open: boolean;
  mode: "create" | "edit";
  capabilities: AdminCapability[];
  planCategories: ChoiceOption[];
  limitCodes: string[];
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<PlanDraft>(() =>
    draftFromPlan(plan, limitCodes),
  );
  const [newFeature, setNewFeature] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PlanDraft>(key: K, value: PlanDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const monthlyTimesTwelve = useMemo(
    () => (Number.parseFloat(draft.monthly_price) || 0) * 12,
    [draft.monthly_price],
  );
  const yearlyOverCap =
    (Number.parseFloat(draft.yearly_price) || 0) > monthlyTimesTwelve;

  /**
   * Same formula the backend and the pricing page use. The "Save X%" badge on
   * /pricing is derived from these two prices, so showing it live here is how
   * an admin controls that badge — there is no separate percentage to type.
   */
  const yearlyDiscount = useMemo(() => {
    const yearly = Number.parseFloat(draft.yearly_price) || 0;
    if (monthlyTimesTwelve <= 0 || yearly <= 0 || yearly > monthlyTimesTwelve) {
      return null;
    }
    return ((monthlyTimesTwelve - yearly) / monthlyTimesTwelve) * 100;
  }, [draft.yearly_price, monthlyTimesTwelve]);

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value) return;
    set("features", [...draft.features, value]);
    setNewFeature("");
  };

  const submit = () => {
    setError(null);
    const payload = payloadFromDraft(draft);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createSubscriptionPlan(payload)
          : await updateSubscriptionPlan(plan!.id, payload);
      if (result.ok) {
        toast.success(
          mode === "create"
            ? `Created ${payload.name}`
            : `Saved ${payload.name} — /pricing updated`,
        );
        onClose();
      } else {
        setError(result.error ?? "Could not save the plan");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New plan" : `Edit ${plan?.name}`}
          </DialogTitle>
          <DialogDescription>
            Prices are in USD and buy one kitchen branch for one billing period.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-7 py-2">
          <FieldGroup title="Identity">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="plan-name">
                <Input
                  id="plan-name"
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field
                label="Plan type"
                htmlFor="plan-type"
                hint={
                  mode === "edit"
                    ? "Referenced by code gates — changing it can break entitlements."
                    : "Uppercase code, unique across plans (e.g. SCALE)."
                }
              >
                <Input
                  id="plan-type"
                  value={draft.plan_type}
                  onChange={(e) => set("plan_type", e.target.value)}
                />
              </Field>
              <Field label="Category" htmlFor="plan-category">
                <select
                  id="plan-category"
                  value={draft.plan_category}
                  onChange={(e) => set("plan_category", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {planCategories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Display order" htmlFor="plan-order">
                <Input
                  id="plan-order"
                  type="number"
                  value={draft.display_order}
                  onChange={(e) => set("display_order", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Tagline" htmlFor="plan-tagline">
              <Input
                id="plan-tagline"
                value={draft.tagline}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </Field>
            <Field label="Description" htmlFor="plan-description">
              <Textarea
                id="plan-description"
                rows={3}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
          </FieldGroup>

          <FieldGroup title="Pricing">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Monthly (USD)" htmlFor="plan-monthly">
                <Input
                  id="plan-monthly"
                  inputMode="decimal"
                  value={draft.monthly_price}
                  onChange={(e) => set("monthly_price", e.target.value)}
                />
              </Field>
              <Field
                label="Yearly (USD)"
                htmlFor="plan-yearly"
                hint={
                  yearlyOverCap
                    ? `Must be at or below $${monthlyTimesTwelve.toFixed(2)} (12 × monthly).`
                    : undefined
                }
                invalid={yearlyOverCap}
              >
                <Input
                  id="plan-yearly"
                  inputMode="decimal"
                  value={draft.yearly_price}
                  onChange={(e) => set("yearly_price", e.target.value)}
                  aria-invalid={yearlyOverCap}
                />
              </Field>
              <Field label="Trial days" htmlFor="plan-trial">
                <Input
                  id="plan-trial"
                  type="number"
                  min={0}
                  value={draft.trial_days}
                  onChange={(e) => set("trial_days", e.target.value)}
                />
              </Field>
            </div>

            <p className="text-xs text-muted-foreground rounded-md border border-border bg-accent/40 px-3 py-2.5">
              {yearlyDiscount == null ? (
                <>
                  Annual billing shows no saving at these prices, so the
                  &ldquo;Save&rdquo; badge is hidden on /pricing.
                </>
              ) : (
                <>
                  Annual buyers save{" "}
                  <strong className="text-foreground font-semibold">
                    {yearlyDiscount.toFixed(1)}%
                  </strong>{" "}
                  — ${(monthlyTimesTwelve / 12).toFixed(2)}/mo billed monthly vs $
                  {((Number.parseFloat(draft.yearly_price) || 0) / 12).toFixed(2)}
                  /mo billed annually. The &ldquo;Save&rdquo; badge on /pricing is
                  computed from this, so change it by changing the yearly price.
                </>
              )}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Visible on /pricing"
                description="Hidden plans stay valid for existing branches."
                checked={draft.is_active}
                onChange={(v) => set("is_active", v)}
              />
              <ToggleRow
                label="Most popular"
                description="Highlights this card on the pricing page."
                checked={draft.is_popular}
                onChange={(v) => set("is_popular", v)}
              />
              <ToggleRow
                label="Custom pricing"
                description="CTA points to sales instead of self-serve signup."
                checked={draft.custom_pricing}
                onChange={(v) => set("custom_pricing", v)}
              />
              <ToggleRow
                label="Per-branch pricing"
                description="Price scales with the number of branches billed."
                checked={draft.per_location_pricing}
                onChange={(v) => set("per_location_pricing", v)}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            title="Limits"
            hint="Leave blank for unlimited — a blank field removes the cap entirely."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {limitCodes.map((code) => (
                <Field
                  key={code}
                  label={LIMIT_LABELS[code] ?? code}
                  htmlFor={`limit-${code}`}
                >
                  <Input
                    id={`limit-${code}`}
                    type="number"
                    min={0}
                    placeholder="Unlimited"
                    value={draft.limits[code] ?? ""}
                    onChange={(e) =>
                      set("limits", { ...draft.limits, [code]: e.target.value })
                    }
                  />
                </Field>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup
            title="Feature list"
            hint="Rendered verbatim on the pricing card, in this order."
          >
            <div className="space-y-2">
              {draft.features.map((feature, index) => (
                <div key={`${feature}-${index}`} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <Input
                    value={feature}
                    aria-label={`Feature ${index + 1}`}
                    onChange={(e) => {
                      const next = [...draft.features];
                      next[index] = e.target.value;
                      set("features", next);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove feature ${index + 1}`}
                    onClick={() =>
                      set(
                        "features",
                        draft.features.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Xmark className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {draft.features.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No features yet. The card will show only the price and limits.
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Input
                  value={newFeature}
                  placeholder="Add a feature…"
                  aria-label="New feature"
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button variant="outline" onClick={addFeature} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </FieldGroup>

          <FieldGroup
            title="Entitlements"
            hint="What this plan actually unlocks in the product. The feature list above is marketing copy; these are the enforced gates."
          >
            <div className="grid gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto pr-1">
              {capabilities.map((capability) => {
                const checked = draft.capability_codes.includes(capability.code);
                return (
                  <label
                    key={capability.code}
                    className={cn(
                      "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                      checked
                        ? "border-primary/30 bg-primary/5"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        set(
                          "capability_codes",
                          e.target.checked
                            ? [...draft.capability_codes, capability.code]
                            : draft.capability_codes.filter(
                                (c) => c !== capability.code,
                              ),
                        )
                      }
                      className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-foreground truncate">
                        {capability.name}
                      </span>
                      <span className="block text-[11px] text-muted-foreground font-mono truncate">
                        {capability.code}
                      </span>
                    </span>
                  </label>
                );
              })}
              {capabilities.length === 0 && (
                <p className="text-sm text-muted-foreground sm:col-span-2">
                  No capabilities defined yet. Run{" "}
                  <code className="font-mono text-xs">seed_subscription_plans</code>{" "}
                  on the backend to populate the catalog.
                </p>
              )}
            </div>
          </FieldGroup>

          {error && (
            <p
              role="alert"
              className="text-sm rounded-md border border-destructive/30 bg-destructive/10 text-foreground px-3 py-2"
            >
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : mode === "create" ? "Create plan" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
        {hint && (
          <p className="text-xs text-muted-foreground/80 mt-1 flex items-start gap-1.5">
            <InfoCircle className="h-3.5 w-3.5 shrink-0 mt-px" />
            {hint}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  invalid,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && (
        <p
          className={cn(
            "text-xs",
            invalid ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-md border border-border p-3 cursor-pointer">
      <span className="min-w-0">
        <span className="block text-sm text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          {description}
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </label>
  );
}
