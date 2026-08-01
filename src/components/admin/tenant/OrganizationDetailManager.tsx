"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  CheckCircle,
  Plus,
  Trash,
  Undo,
  WarningTriangle,
} from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addOrganizationMember,
  changeMemberRole,
  removeOrganizationMember,
  restoreOrganization,
  setOrganizationVerified,
  suspendOrganization,
  transferOrganizationOwnership,
  updateOrganization,
} from "@/lib/actions/tenant-actions";
import type {
  AdminOrganizationBundle,
  ChoiceOption,
} from "@/types/admin-tenants";
import { ActionDialog, useAction } from "./ActionDialog";
import { AuditTrail } from "./AuditTrail";
import {
  DataRow,
  DrillLink,
  EmptyState,
  PageHeader,
  ReadinessDots,
  SectionCard,
  StatusPill,
  formatDate,
} from "./shared";

type DialogKind =
  | "suspend"
  | "restore"
  | "transfer"
  | "addMember"
  | "removeMember"
  | null;

export function OrganizationDetailManager({
  bundle,
  industryTypes,
}: {
  bundle: AdminOrganizationBundle;
  industryTypes: ChoiceOption[];
}) {
  const { organization: org, branches, members, roles, recent_activity } = bundle;
  const { pending, run } = useAction();

  const [dialog, setDialog] = useState<DialogKind>(null);
  const [memberTarget, setMemberTarget] = useState<{
    userId: string;
    email: string;
  } | null>(null);

  // Only members can receive ownership or a role — a dropdown of every account
  // on the platform would be both useless and dangerous here.
  const activeMembers = members.filter((member) => member.is_active);
  const [transferTo, setTransferTo] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  const [profile, setProfile] = useState({
    name: org.name,
    industry_type: org.industry_type ?? "",
    country: org.country ?? "",
    email: org.email ?? "",
    phone: org.phone ?? "",
    website: org.website ?? "",
    timezone: org.timezone,
    currency: org.currency,
    description: org.description ?? "",
  });

  function saveProfile() {
    run(() => updateOrganization(org.id, profile), "Organization updated.");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={org.name}
        description={`${org.slug} · created ${formatDate(org.created_at)}`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                run(
                  () => setOrganizationVerified(org.id, !org.is_verified),
                  org.is_verified
                    ? "Verification removed."
                    : "Organization verified.",
                )
              }
              disabled={pending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {org.is_verified ? "Unverify" : "Verify"}
            </Button>
            {org.is_active ? (
              <Button
                variant="destructive"
                onClick={() => setDialog("suspend")}
                disabled={pending}
              >
                Suspend
              </Button>
            ) : (
              <Button onClick={() => setDialog("restore")} disabled={pending}>
                <Undo className="mr-2 h-4 w-4" />
                Restore
              </Button>
            )}
          </>
        }
      />

      {!org.is_active && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
        >
          <WarningTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--destructive))]" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              This organization is suspended
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {org.deletion_reason || "No reason recorded."} Data is scheduled
              for purge on {formatDate(org.purge_after)} — restoring after that
              date is no longer possible.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Profile"
          description="Identity and contact details."
          className="lg:col-span-2"
          actions={
            <Button size="sm" onClick={saveProfile} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="org-name"
              label="Name"
              value={profile.name}
              onChange={(value) => setProfile({ ...profile, name: value })}
            />
            <div className="space-y-2">
              <Label htmlFor="org-industry">Industry</Label>
              <select
                id="org-industry"
                value={profile.industry_type}
                onChange={(event) =>
                  setProfile({ ...profile, industry_type: event.target.value })
                }
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Unclassified</option>
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
              value={profile.email}
              onChange={(value) => setProfile({ ...profile, email: value })}
            />
            <Field
              id="org-phone"
              label="Phone"
              value={profile.phone}
              onChange={(value) => setProfile({ ...profile, phone: value })}
            />
            <Field
              id="org-country"
              label="Country"
              value={profile.country}
              onChange={(value) => setProfile({ ...profile, country: value })}
            />
            <Field
              id="org-website"
              label="Website"
              value={profile.website}
              onChange={(value) => setProfile({ ...profile, website: value })}
            />
            <Field
              id="org-timezone"
              label="Timezone"
              hint="IANA, e.g. Africa/Kampala"
              value={profile.timezone}
              onChange={(value) => setProfile({ ...profile, timezone: value })}
            />
            <Field
              id="org-currency"
              label="Default currency"
              hint="Branches can override this"
              value={profile.currency}
              onChange={(value) => setProfile({ ...profile, currency: value })}
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                rows={3}
                value={profile.description}
                onChange={(event) =>
                  setProfile({ ...profile, description: event.target.value })
                }
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="At a glance">
          <dl>
            <DataRow label="Status">
              {org.is_active ? (
                <StatusPill tone="success">Active</StatusPill>
              ) : (
                <StatusPill tone="critical">Suspended</StatusPill>
              )}
            </DataRow>
            <DataRow label="Verified">
              {org.is_verified ? (
                <StatusPill tone="info">Verified</StatusPill>
              ) : (
                <StatusPill tone="neutral">Not verified</StatusPill>
              )}
            </DataRow>
            <DataRow label="Owner">{org.owner_email ?? "None"}</DataRow>
            <DataRow label="Branches">
              {org.active_branch_count} active / {org.branch_count} total
            </DataRow>
            <DataRow label="Members">{org.member_count}</DataRow>
            <DataRow label="Paid branches">
              {org.active_subscription_count}
            </DataRow>
            <DataRow label="Forecast horizon">
              {org.forecast_horizon_days} days
            </DataRow>
            <DataRow label="Last updated">{formatDate(org.updated_at)}</DataRow>
          </dl>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setDialog("transfer")}
            disabled={pending || activeMembers.length < 2}
          >
            Transfer ownership
          </Button>
          {activeMembers.length < 2 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Ownership can only move to another active member.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Branches"
        description="Each branch carries its own plan, currency, and forecast readiness."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/branches?organization_id=${org.id}`}>
              Manage branches
            </Link>
          </Button>
        }
      >
        {branches.length === 0 ? (
          <EmptyState
            title="No branches yet"
            hint="A tenant without a branch cannot forecast anything — create one from the Branches page."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Staff</TableHead>
                  <TableHead>Readiness</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <DrillLink href={`/admin/branches/${branch.id}`}>
                        {branch.name}
                      </DrillLink>
                      {branch.is_primary && (
                        <StatusPill tone="info">Primary</StatusPill>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {branch.subscription ? (
                        <span className="text-foreground">
                          {branch.subscription.plan_name}
                          {branch.subscription.is_trial && " (trial)"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{branch.currency}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {branch.staff_count}
                    </TableCell>
                    <TableCell>
                      <ReadinessDots readiness={branch.readiness} />
                    </TableCell>
                    <TableCell>
                      {branch.is_active ? (
                        <StatusPill tone="success">Active</StatusPill>
                      ) : (
                        <StatusPill tone="neutral">Inactive</StatusPill>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Members"
        description="Roles decide what each person can do inside the product."
        actions={
          <Button size="sm" variant="outline" onClick={() => setDialog("addMember")}>
            <Plus className="mr-2 h-4 w-4" />
            Add member
          </Button>
        }
      >
        {members.length === 0 ? (
          <EmptyState title="No members" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branches</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <DrillLink href={`/admin/accounts/${member.user.id}`}>
                        {member.user.full_name || member.user.email}
                      </DrillLink>
                      <p className="text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <select
                        aria-label={`Role for ${member.user.email}`}
                        value={member.role?.id ?? ""}
                        onChange={(event) =>
                          run(
                            () =>
                              changeMemberRole(
                                org.id,
                                member.user.id,
                                event.target.value || null,
                              ),
                            "Role updated.",
                          )
                        }
                        disabled={pending || !member.is_active}
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">No role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {member.branch_assignments.length === 0
                        ? "All / unassigned"
                        : member.branch_assignments
                            .map((assignment) => assignment.branch_name)
                            .join(", ")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(member.joined_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.is_active ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMemberTarget({
                              userId: member.user.id,
                              email: member.user.email,
                            });
                            setDialog("removeMember");
                          }}
                          disabled={pending}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">
                            Remove {member.user.email}
                          </span>
                        </Button>
                      ) : (
                        <StatusPill tone="neutral">Removed</StatusPill>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Admin activity"
        description="What support has done to this record."
      >
        <AuditTrail entries={recent_activity} />
      </SectionCard>

      {/* -- dialogs ------------------------------------------------------ */}

      <ActionDialog
        open={dialog === "suspend"}
        onOpenChange={(open) => setDialog(open ? "suspend" : null)}
        title={`Suspend ${org.name}?`}
        description="Everyone in this organization is signed out immediately and loses access. The record is kept for 30 days, then purged."
        confirmLabel="Suspend organization"
        destructive
        reasonLabel="Reason"
        reasonPlaceholder="Chargeback, abuse report, customer request…"
        requireReason
        successMessage="Organization suspended."
        onConfirm={(reason) => suspendOrganization(org.id, reason)}
      />

      <ActionDialog
        open={dialog === "restore"}
        onOpenChange={(open) => setDialog(open ? "restore" : null)}
        title={`Restore ${org.name}?`}
        description="The organization becomes reachable again and its members can sign back in."
        confirmLabel="Restore organization"
        successMessage="Organization restored."
        onConfirm={() => restoreOrganization(org.id)}
      />

      <ActionDialog
        open={dialog === "transfer"}
        onOpenChange={(open) => setDialog(open ? "transfer" : null)}
        title="Transfer ownership"
        description="The chosen member becomes the owner; the current owner is demoted to admin rather than removed. Use this when the registered owner has left the company."
        confirmLabel="Transfer ownership"
        successMessage="Ownership transferred."
        onConfirm={() => transferOrganizationOwnership(org.id, transferTo)}
      >
        <div className="space-y-2">
          <Label htmlFor="transfer-target">New owner</Label>
          <select
            id="transfer-target"
            value={transferTo}
            onChange={(event) => setTransferTo(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a member…</option>
            {activeMembers
              .filter((member) => member.user.email !== org.owner_email)
              .map((member) => (
                <option key={member.user.id} value={member.user.id}>
                  {member.user.full_name || member.user.email} (
                  {member.user.email})
                </option>
              ))}
          </select>
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog === "addMember"}
        onOpenChange={(open) => setDialog(open ? "addMember" : null)}
        title="Add a member"
        description="Adds an account that already exists. Nobody is created here — if they have not signed up yet, send them an invite from the product instead."
        confirmLabel="Add member"
        successMessage="Member added."
        onConfirm={() =>
          addOrganizationMember(org.id, newMemberEmail, newMemberRole || null)
        }
      >
        <div className="space-y-2">
          <Label htmlFor="member-email">Email</Label>
          <Input
            id="member-email"
            type="email"
            value={newMemberEmail}
            onChange={(event) => setNewMemberEmail(event.target.value)}
            placeholder="person@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="member-role">Role</Label>
          <select
            id="member-role"
            value={newMemberRole}
            onChange={(event) => setNewMemberRole(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">No role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog === "removeMember"}
        onOpenChange={(open) => setDialog(open ? "removeMember" : null)}
        title={`Remove ${memberTarget?.email ?? "member"}?`}
        description="They lose access to this organization and every branch in it, and are signed out. Their account itself is untouched."
        confirmLabel="Remove member"
        destructive
        successMessage="Member removed."
        onConfirm={() =>
          memberTarget
            ? removeOrganizationMember(org.id, memberTarget.userId)
            : Promise.resolve({ ok: false, error: "No member selected." })
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
