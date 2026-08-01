"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckCircle,
  Eye,
  Google,
  Key,
  SendMail,
  Trash,
  Undo,
  WarningTriangle,
} from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteUserAccount,
  restoreUserAccount,
  revokeUserSession,
  revokeUserSessions,
  sendUserPasswordReset,
  setUserSuspended,
  startImpersonation,
  updateUserAccount,
  verifyUserAccount,
} from "@/lib/actions/tenant-actions";
import type { AdminUserBundle, LoginDiagnostics } from "@/types/admin-tenants";
import { ActionDialog, useAction } from "./ActionDialog";
import { AuditTrail } from "./AuditTrail";
import { LoginTroubleshooter } from "./LoginTroubleshooter";
import {
  DataRow,
  DrillLink,
  EmptyState,
  PageHeader,
  SectionCard,
  StatusPill,
  formatDate,
  formatDateTime,
} from "./shared";

type DialogKind =
  | "suspend"
  | "delete"
  | "impersonate"
  | "revokeAll"
  | null;

export function UserDetailManager({
  bundle,
  diagnostics,
}: {
  bundle: AdminUserBundle;
  diagnostics: LoginDiagnostics | null;
}) {
  const { user, sessions, recent_activity } = bundle;
  const { pending, run } = useAction();

  const [dialog, setDialog] = useState<DialogKind>(null);
  const [profile, setProfile] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone ?? "",
    job_title: user.job_title ?? "",
  });

  function saveProfile() {
    run(() => updateUserAccount(user.id, profile), "Account updated.");
  }

  /**
   * Impersonation opens in a new tab rather than navigating away: the admin
   * usually wants the customer's view *beside* the record they were reading,
   * and the session is short-lived enough that losing this page would matter.
   */
  async function beginImpersonation(reason: string) {
    const result = await startImpersonation(user.id, reason);
    if (result.ok && result.data) {
      window.open(result.data.url, "_blank", "noopener,noreferrer");
      toast.success("Read-only session opened in a new tab.");
    }
    return result;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={user.full_name || user.email}
        description={`${user.email} · joined ${formatDate(user.created_at)}`}
        actions={
          <>
            {!user.is_verified && !user.is_deleted && (
              <Button
                variant="outline"
                onClick={() =>
                  run(() => verifyUserAccount(user.id), "Email verified.")
                }
                disabled={pending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Force-verify
              </Button>
            )}
            {!user.is_deleted && (
              <Button
                variant="outline"
                onClick={() => setDialog("impersonate")}
                disabled={pending || user.is_suspended}
              >
                <Eye className="mr-2 h-4 w-4" />
                View as user
              </Button>
            )}
            {user.is_deleted ? (
              <Button
                onClick={() =>
                  run(() => restoreUserAccount(user.id), "Account restored.")
                }
                disabled={pending}
              >
                <Undo className="mr-2 h-4 w-4" />
                Restore
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setDialog("delete")}
                disabled={pending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </>
        }
      />

      {user.is_deleted && (
        <Banner
          tone="critical"
          title="This account is deleted"
          body={`${user.deletion_reason || "No reason recorded."} Scheduled for purge on ${formatDate(user.purge_after)} — restoring after that date is no longer possible.`}
        />
      )}
      {user.is_suspended && !user.is_deleted && (
        <Banner
          tone="critical"
          title="This account is suspended"
          body={
            user.security.suspension_reason ||
            "No reason recorded. Lift the suspension to let them sign in again."
          }
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Profile"
          description="Identity as it appears across the product."
          className="lg:col-span-2"
          actions={
            <Button size="sm" onClick={saveProfile} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="user-first"
              label="First name"
              value={profile.first_name}
              onChange={(v) => setProfile({ ...profile, first_name: v })}
            />
            <Field
              id="user-last"
              label="Last name"
              value={profile.last_name}
              onChange={(v) => setProfile({ ...profile, last_name: v })}
            />
            <Field
              id="user-email"
              label="Email"
              type="email"
              hint="Changing this changes what they sign in with."
              value={profile.email}
              onChange={(v) => setProfile({ ...profile, email: v })}
            />
            <Field
              id="user-phone"
              label="Phone"
              value={profile.phone}
              onChange={(v) => setProfile({ ...profile, phone: v })}
            />
            <Field
              id="user-title"
              label="Job title"
              value={profile.job_title}
              onChange={(v) => setProfile({ ...profile, job_title: v })}
            />
          </div>
        </SectionCard>

        <SectionCard title="Security">
          <dl>
            <DataRow label="Status">
              {user.is_deleted ? (
                <StatusPill tone="critical">Deleted</StatusPill>
              ) : user.is_suspended ? (
                <StatusPill tone="critical">Suspended</StatusPill>
              ) : (
                <StatusPill tone="success">Active</StatusPill>
              )}
            </DataRow>
            <DataRow label="Email verified">
              {user.is_verified ? (
                <StatusPill tone="success">Verified</StatusPill>
              ) : (
                <StatusPill tone="warning">Unverified</StatusPill>
              )}
            </DataRow>
            <DataRow label="Phone verified">
              {user.phone_verified ? "Yes" : "No"}
            </DataRow>
            <DataRow label="Sign-in method">
              {user.google_linked ? (
                <span className="inline-flex items-center gap-1.5">
                  <Google className="h-3.5 w-3.5" />
                  Google
                  {user.security.has_usable_password && " + password"}
                </span>
              ) : (
                "Password"
              )}
            </DataRow>
            <DataRow label="Last login">{formatDate(user.last_login)}</DataRow>
          </dl>

          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                run(
                  () => sendUserPasswordReset(user.id),
                  "Password reset code sent.",
                )
              }
              disabled={pending || user.is_deleted}
            >
              <SendMail className="mr-2 h-4 w-4" />
              Send password reset
            </Button>
            <Button
              variant={user.is_suspended ? "default" : "destructive"}
              className="w-full"
              onClick={() =>
                user.is_suspended
                  ? run(
                      () => setUserSuspended(user.id, false, ""),
                      "Suspension lifted.",
                    )
                  : setDialog("suspend")
              }
              disabled={pending || user.is_deleted}
            >
              <Key className="mr-2 h-4 w-4" />
              {user.is_suspended ? "Lift suspension" : "Suspend account"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Passwords are never visible here — the reset code goes to the
              user&apos;s own inbox.
            </p>
          </div>
        </SectionCard>
      </div>

      <LoginTroubleshooter userId={user.id} diagnostics={diagnostics} />

      <SectionCard
        title="Organizations"
        description="Where this person works and what they can do there."
      >
        {user.organizations.length === 0 ? (
          <EmptyState
            title="Not a member of any organization"
            hint="A sign-up that never joined a tenant — usually a stalled onboarding."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Membership</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <DrillLink href={`/admin/organizations/${org.id}`}>
                        {org.name}
                      </DrillLink>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {org.role ?? "No role"}
                    </TableCell>
                    <TableCell>
                      {org.is_active ? (
                        <StatusPill tone="success">Active</StatusPill>
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

      {user.branch_assignments.length > 0 && (
        <SectionCard
          title="Branch assignments"
          description="The specific sites this person is rostered to."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.branch_assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <DrillLink href={`/admin/branches/${assignment.branch_id}`}>
                        {assignment.branch_name}
                      </DrillLink>
                      {assignment.is_primary_branch && (
                        <StatusPill tone="info">Primary</StatusPill>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Link
                        href={`/admin/organizations/${assignment.organization_id}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {assignment.organization_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {assignment.role_name ?? "Inherits org role"}
                    </TableCell>
                    <TableCell>
                      {assignment.is_active ? (
                        <StatusPill tone="success">Active</StatusPill>
                      ) : (
                        <StatusPill tone="neutral">Removed</StatusPill>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Active devices"
          description="Live sessions from the registry. Revoking one signs that device out immediately."
          actions={
            sessions.length > 0 ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDialog("revokeAll")}
                disabled={pending}
              >
                Revoke all
              </Button>
            ) : undefined
          }
        >
          {sessions.length === 0 ? (
            <EmptyState
              title="No active sessions"
              hint="They are signed out everywhere, or session enforcement is off on this environment."
            />
          ) : (
            <ul>
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {session.device || "Unknown device"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.ip || "no IP"} · last seen{" "}
                      {formatDateTime(session.last_seen)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      run(
                        () => revokeUserSession(user.id, session.id),
                        "Device signed out.",
                      )
                    }
                    disabled={pending}
                  >
                    Revoke
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Admin activity">
          <AuditTrail entries={recent_activity} />
        </SectionCard>
      </div>

      {/* -- dialogs ------------------------------------------------------ */}

      <ActionDialog
        open={dialog === "suspend"}
        onOpenChange={(open) => setDialog(open ? "suspend" : null)}
        title={`Suspend ${user.email}?`}
        description="They are signed out of every device immediately and cannot sign back in until the suspension is lifted."
        confirmLabel="Suspend account"
        destructive
        reasonLabel="Reason"
        reasonPlaceholder="Abuse report, security incident, customer request…"
        requireReason
        successMessage="Account suspended."
        onConfirm={(reason) => setUserSuspended(user.id, true, reason)}
      />

      <ActionDialog
        open={dialog === "delete"}
        onOpenChange={(open) => setDialog(open ? "delete" : null)}
        title={`Delete ${user.email}?`}
        description="A soft delete: the account is hidden and signed out, then purged after 30 days. If they solely own an organization, transfer that ownership first — the backend will refuse otherwise."
        confirmLabel="Delete account"
        destructive
        reasonLabel="Reason"
        reasonPlaceholder="Duplicate account, GDPR request, spam sign-up…"
        requireReason
        successMessage="Account deleted."
        onConfirm={(reason) => deleteUserAccount(user.id, reason)}
      />

      <ActionDialog
        open={dialog === "revokeAll"}
        onOpenChange={(open) => setDialog(open ? "revokeAll" : null)}
        title="Revoke every session?"
        description="Signs this person out of every device. They can sign back in normally — use suspension if you need to keep them out."
        confirmLabel="Revoke all sessions"
        destructive
        successMessage="All sessions revoked."
        onConfirm={() => revokeUserSessions(user.id)}
      />

      <ActionDialog
        open={dialog === "impersonate"}
        onOpenChange={(open) => setDialog(open ? "impersonate" : null)}
        title={`View the product as ${user.email}?`}
        description="Opens a read-only session in a new tab: you see exactly what they see, but every write is refused. The session expires in 30 minutes, appears in this person's own device list, and is recorded below against your name."
        confirmLabel="Open read-only session"
        reasonLabel="Why"
        reasonPlaceholder="Ticket PIQ-102: their Today page is blank"
        requireReason
        successMessage="Read-only session opened."
        onConfirm={beginImpersonation}
      >
        <div className="flex items-start gap-3 rounded-md border border-[hsl(var(--warning)/.3)] bg-[hsl(var(--warning)/.08)] p-3">
          <WarningTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--warning))]" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is an authentication bypass. Use it to reproduce a problem, not
            to act on someone&apos;s behalf — if a change is needed, make it from
            this panel where it will be attributed to you.
          </p>
        </div>
      </ActionDialog>
    </div>
  );
}

function Banner({
  tone,
  title,
  body,
}: {
  tone: "critical" | "warning";
  title: string;
  body: string;
}) {
  return (
    <div
      role="alert"
      className={
        tone === "critical"
          ? "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
          : "flex items-start gap-3 rounded-xl border border-border bg-card p-4"
      }
    >
      <WarningTriangle
        className={
          tone === "critical"
            ? "mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--destructive))]"
            : "mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--warning))]"
        }
      />
      <div className="text-sm">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-muted-foreground">{body}</p>
      </div>
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
