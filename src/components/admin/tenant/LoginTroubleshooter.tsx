"use client";

/**
 * "Why can't this person sign in?" as a checklist with buttons attached.
 *
 * The support conversation this replaces is a guessing game — is it the
 * password, the verification email, a suspension, a Google-only account? The
 * backend answers all of them in one call and names the remedy for each; this
 * renders them and wires the remedy straight to the action that clears it.
 */

import { useState } from "react";
import { Check, RefreshDouble, WarningTriangle, Xmark } from "iconoir-react";

import { Button } from "@/components/ui/button";
import {
  resendSetPasswordInvite,
  resendVerification,
  restoreUserAccount,
  sendUserPasswordReset,
  setUserSuspended,
  verifyUserAccount,
} from "@/lib/actions/tenant-actions";
import type { LoginDiagnostics } from "@/types/admin-tenants";
import { useAction } from "./ActionDialog";
import { EmptyState, SectionCard, StatusPill, formatDateTime } from "./shared";

export function LoginTroubleshooter({
  userId,
  diagnostics,
}: {
  userId: string;
  diagnostics: LoginDiagnostics | null;
}) {
  const { pending, run } = useAction();
  const [refreshing, setRefreshing] = useState(false);

  if (!diagnostics) {
    return (
      <SectionCard title="Can they sign in?">
        <EmptyState
          title="Diagnostics unavailable"
          hint="The backend did not answer. Everything else on this page still works."
        />
      </SectionCard>
    );
  }

  // Each remedy the backend can name, mapped to the action that performs it.
  // A remedy with no entry here renders as text without a button rather than a
  // dead control.
  const REMEDIES: Record<
    string,
    { run: () => Promise<{ ok: boolean; error?: string }>; success: string }
  > = {
    verify_email: {
      run: () => verifyUserAccount(userId),
      success: "Email verified.",
    },
    unsuspend: {
      run: () => setUserSuspended(userId, false, ""),
      success: "Suspension lifted.",
    },
    restore_account: {
      run: () => restoreUserAccount(userId),
      success: "Account restored.",
    },
    send_password_reset: {
      run: () => sendUserPasswordReset(userId),
      success: "Set-password code sent.",
    },
  };

  const { context } = diagnostics;

  return (
    <SectionCard
      title="Can they sign in?"
      description="Everything that stands between this person and a working login."
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRefreshing(true);
            window.location.reload();
          }}
          disabled={refreshing}
        >
          <RefreshDouble className="mr-2 h-4 w-4" />
          Re-check
        </Button>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {diagnostics.can_sign_in ? (
          <StatusPill tone="success">Nothing is blocking sign-in</StatusPill>
        ) : (
          <StatusPill tone="critical">
            {diagnostics.blockers.length} blocker
            {diagnostics.blockers.length === 1 ? "" : "s"}
          </StatusPill>
        )}
        <span className="text-xs text-muted-foreground">
          Last login {formatDateTime(context.last_login)} ·{" "}
          {context.active_sessions} active session
          {context.active_sessions === 1 ? "" : "s"}
          {context.pending_reset_code && " · a reset code is currently valid"}
        </span>
      </div>

      <ul className="space-y-1">
        {diagnostics.checks.map((check) => {
          const remedy = check.remedy ? REMEDIES[check.remedy.action] : null;
          return (
            <li
              key={check.key}
              className="flex flex-wrap items-start gap-3 border-b border-border/60 py-3 last:border-0"
            >
              <span className="mt-0.5 shrink-0">
                {check.ok ? (
                  <Check className="h-4 w-4 text-primary" aria-hidden />
                ) : check.blocking ? (
                  <Xmark
                    className="h-4 w-4 text-[hsl(var(--destructive))]"
                    aria-hidden
                  />
                ) : (
                  <WarningTriangle
                    className="h-4 w-4 text-[hsl(var(--warning))]"
                    aria-hidden
                  />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  {check.label}
                  <span className="sr-only">
                    : {check.ok ? "pass" : check.blocking ? "blocking" : "warning"}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>

              {!check.ok && check.remedy && remedy && (
                <Button
                  size="sm"
                  variant={check.blocking ? "default" : "outline"}
                  onClick={() => run(remedy.run, remedy.success)}
                  disabled={pending}
                >
                  {check.remedy.label}
                </Button>
              )}
              {!check.ok && check.remedy && !remedy && (
                <span className="text-xs text-muted-foreground">
                  {check.remedy.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            run(
              () => resendSetPasswordInvite(userId),
              "Set-password invite sent.",
            )
          }
          disabled={pending}
        >
          Resend set-password link
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            run(() => resendVerification(userId), "Verification code sent.")
          }
          disabled={pending}
        >
          Resend verification code
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Both send a code to the customer&apos;s own inbox — you never see or
        choose their password.
      </p>
    </SectionCard>
  );
}
