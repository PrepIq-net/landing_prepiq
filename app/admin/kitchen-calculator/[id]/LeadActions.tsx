"use client";

import { useState, useTransition } from "react";
import { Check, MailOut, RefreshDouble, Trash } from "iconoir-react";

import { Button } from "@/components/ui/button";
import {
  deleteKitchenCalculatorLead,
  markKitchenCalculatorLeadHandled,
  resendKitchenCalculatorLeadEmail,
} from "@/lib/actions/kitchen-calculator-actions";

interface Props {
  leadId: string;
  isAdmin: boolean;
  handled: boolean;
}

export function LeadActions({ leadId, isAdmin, handled }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "sent" | "failed">("idle");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            markKitchenCalculatorLeadHandled(leadId, !handled).then(
              () => undefined,
              () => undefined
            )
          )
        }
      >
        {handled ? (
          <>
            <RefreshDouble className="mr-1 h-4 w-4" aria-hidden /> Reopen
          </>
        ) : (
          <>
            <Check className="mr-1 h-4 w-4" aria-hidden /> Mark handled
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            resendKitchenCalculatorLeadEmail(leadId).then(
              (r) => setResendState(r.sent ? "sent" : "failed"),
              () => setResendState("failed")
            )
          )
        }
      >
        <MailOut className="mr-1 h-4 w-4" aria-hidden />
        {resendState === "sent" ? "Email sent" : resendState === "failed" ? "Retry send" : "Resend email"}
      </Button>
      {isAdmin &&
        (confirmingDelete ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  deleteKitchenCalculatorLead(leadId).then(
                    () => undefined,
                    () => undefined
                  )
                )
              }
            >
              Confirm delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" disabled={pending} onClick={() => setConfirmingDelete(true)}>
            <Trash className="mr-1 h-4 w-4" aria-hidden /> Delete
          </Button>
        ))}
    </div>
  );
}
