"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InfoCircle } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createOrganization } from "@/lib/actions/tenant-actions";
import type { ChoiceOption } from "@/types/admin-tenants";
import { PageHeader, SectionCard } from "./shared";

/**
 * One form creates the organization, its owner, and its first branch.
 *
 * Splitting these into three screens would let a support engineer stop halfway
 * and leave a tenant nobody can log into or work in. The backend does all three
 * in a single transaction for the same reason.
 */
export function NewOrganizationForm({
  industryTypes,
}: {
  industryTypes: ChoiceOption[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    industry_type: industryTypes[0]?.value ?? "",
    email: "",
    phone: "",
    country: "",
    currency: "USD",
    timezone: "UTC",
    owner_email: "",
    owner_first_name: "",
    owner_last_name: "",
    send_invite: true,
    branch_name: "",
    branch_address: "",
    branch_currency: "",
    branch_timezone: "",
  });

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const result = await createOrganization({
      ...form,
      branch_currency: form.branch_currency || form.currency,
      branch_timezone: form.branch_timezone || form.timezone,
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error ?? "Could not create the organization.");
      return;
    }
    const owner = result.data?.owner;
    toast.success(
      owner?.account_created
        ? owner.invite_sent
          ? `Created. ${owner.email} has been emailed a link to set their password.`
          : `Created, but the invite email to ${owner?.email} did not send — resend it from their account page.`
        : "Organization created.",
    );
    router.push(`/admin/organizations/${result.data?.organization.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <PageHeader
        title="New Organization"
        description="Creates the tenant, its owner, and its first branch together — all three exist or none do."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/organizations")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create organization"}
            </Button>
          </>
        }
      />

      <SectionCard title="Organization" description="Who the customer is.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="org-name"
            label="Name"
            required
            value={form.name}
            onChange={(v) => set("name", v)}
          />
          <div className="space-y-2">
            <Label htmlFor="org-industry">Industry</Label>
            <select
              id="org-industry"
              value={form.industry_type}
              onChange={(event) => set("industry_type", event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {industryTypes.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>
          <Field
            id="org-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => set("email", v)}
            hint="Either email or phone is required."
          />
          <Field
            id="org-phone"
            label="Phone"
            value={form.phone}
            onChange={(v) => set("phone", v)}
          />
          <Field
            id="org-country"
            label="Country"
            value={form.country}
            onChange={(v) => set("country", v)}
          />
          <Field
            id="org-currency"
            label="Default currency"
            value={form.currency}
            onChange={(v) => set("currency", v)}
            hint="Branches can each override this."
          />
          <Field
            id="org-timezone"
            label="Timezone"
            value={form.timezone}
            onChange={(v) => set("timezone", v)}
            hint="IANA, e.g. Africa/Kampala"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Owner"
        description="The person who will administer this tenant."
      >
        <div className="mb-4 flex items-start gap-3 rounded-md border border-border bg-secondary/40 p-3">
          <InfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            If an account already exists for this email it is made the owner and
            left otherwise untouched. Otherwise a new account is created{" "}
            <strong className="text-foreground">without a password</strong> — we
            email them a code to set their own. Nobody here ever sees it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="owner-email"
            label="Email"
            type="email"
            required
            value={form.owner_email}
            onChange={(v) => set("owner_email", v)}
          />
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4 sm:border-0 sm:pt-0">
            <div>
              <Label htmlFor="owner-invite">Email them a set-up link</Label>
              <p className="text-xs text-muted-foreground">
                Only applies to a newly created account.
              </p>
            </div>
            <Switch
              id="owner-invite"
              checked={form.send_invite}
              onCheckedChange={(checked) => set("send_invite", checked)}
            />
          </div>
          <Field
            id="owner-first"
            label="First name"
            value={form.owner_first_name}
            onChange={(v) => set("owner_first_name", v)}
          />
          <Field
            id="owner-last"
            label="Last name"
            value={form.owner_last_name}
            onChange={(v) => set("owner_last_name", v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="First branch"
        description="A tenant with no branch cannot forecast, plan, or record anything — so one is created up front."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="branch-name"
            label="Branch name"
            required
            value={form.branch_name}
            onChange={(v) => set("branch_name", v)}
          />
          <Field
            id="branch-address"
            label="Address"
            required
            value={form.branch_address}
            onChange={(v) => set("branch_address", v)}
          />
          <Field
            id="branch-currency"
            label="Currency"
            value={form.branch_currency}
            onChange={(v) => set("branch_currency", v)}
            hint={`Defaults to ${form.currency || "the organization's"}.`}
          />
          <Field
            id="branch-timezone"
            label="Timezone"
            value={form.branch_timezone}
            onChange={(v) => set("branch_timezone", v)}
            hint={`Defaults to ${form.timezone || "the organization's"}.`}
          />
        </div>
      </SectionCard>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  hint,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-muted-foreground">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
