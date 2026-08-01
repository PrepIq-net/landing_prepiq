"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InfoCircle } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createUserAccount } from "@/lib/actions/tenant-actions";
import type {
  AdminOrganization,
  AdminOrganizationBundle,
} from "@/types/admin-tenants";
import { PageHeader, SectionCard } from "./shared";

export function NewUserForm({
  organizations,
  initialOrganizationId,
}: {
  organizations: AdminOrganization[];
  initialOrganizationId: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    organization_id: initialOrganizationId,
    role_id: "",
    branch_id: "",
    send_invite: true,
  });

  // Roles and branches are org-scoped, so both lists reload whenever the
  // organization changes rather than offering choices that would be rejected.
  const [scope, setScope] = useState<{
    roles: AdminOrganizationBundle["roles"];
    branches: AdminOrganizationBundle["branches"];
  }>({ roles: [], branches: [] });
  const [loadingScope, setLoadingScope] = useState(false);

  useEffect(() => {
    if (!form.organization_id) {
      setScope({ roles: [], branches: [] });
      return;
    }
    let cancelled = false;
    setLoadingScope(true);
    fetch(`/api/mgmt/organizations/${form.organization_id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((bundle: AdminOrganizationBundle | null) => {
        if (cancelled || !bundle) return;
        setScope({ roles: bundle.roles ?? [], branches: bundle.branches ?? [] });
      })
      .catch(() => {
        if (!cancelled) setScope({ roles: [], branches: [] });
      })
      .finally(() => {
        if (!cancelled) setLoadingScope(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.organization_id]);

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Clearing the org invalidates anything scoped to it.
      if (key === "organization_id") {
        next.role_id = "";
        next.branch_id = "";
      }
      return next;
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const result = await createUserAccount({
      ...form,
      organization_id: form.organization_id || null,
      role_id: form.role_id || null,
      branch_id: form.branch_id || null,
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error ?? "Could not create the account.");
      return;
    }
    toast.success(
      result.data?.invite_sent
        ? `Created. ${result.data.user.email} has been emailed a link to set their password.`
        : "Account created, but the invite email did not send — resend it from their page.",
    );
    router.push(`/admin/accounts/${result.data?.user.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <PageHeader
        title="New User Account"
        description="Creates an account and emails the person a link to set their own password."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/accounts")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create account"}
            </Button>
          </>
        }
      />

      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <InfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          The account is created{" "}
          <strong className="text-foreground">without a password</strong>. The
          person receives a code and chooses their own, so no credential ever
          passes through you or this panel. Until they do, the account exists but
          cannot sign in.
        </p>
      </div>

      <SectionCard title="Person">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="user-first"
            label="First name"
            required
            value={form.first_name}
            onChange={(v) => set("first_name", v)}
          />
          <Field
            id="user-last"
            label="Last name"
            required
            value={form.last_name}
            onChange={(v) => set("last_name", v)}
          />
          <Field
            id="user-email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(v) => set("email", v)}
            hint="This is what they will sign in with."
          />
          <Field
            id="user-phone"
            label="Phone"
            value={form.phone}
            onChange={(v) => set("phone", v)}
          />
          <Field
            id="user-title"
            label="Job title"
            value={form.job_title}
            onChange={(v) => set("job_title", v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Placement"
        description="Optional. An account with no organization can sign in but has nowhere to work."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="user-org">Organization</Label>
            <select
              id="user-org"
              value={form.organization_id}
              onChange={(event) => set("organization_id", event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">None</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">Role</Label>
            <select
              id="user-role"
              value={form.role_id}
              disabled={!form.organization_id || loadingScope}
              onChange={(event) => set("role_id", event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                {loadingScope ? "Loading…" : "No role"}
              </option>
              {scope.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-branch">Branch</Label>
            <select
              id="user-branch"
              value={form.branch_id}
              disabled={!form.organization_id || loadingScope}
              onChange={(event) => set("branch_id", event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Not assigned</option>
              {scope.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4 sm:border-0 sm:pt-0">
            <div>
              <Label htmlFor="user-invite">Email a set-up link</Label>
              <p className="text-xs text-muted-foreground">
                Without this they cannot sign in until you send one.
              </p>
            </div>
            <Switch
              id="user-invite"
              checked={form.send_invite}
              onCheckedChange={(checked) => set("send_invite", checked)}
            />
          </div>
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
