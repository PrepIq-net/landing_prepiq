"use client";

import { useState, useTransition } from "react";
import { Check, RefreshDouble, Trash } from "iconoir-react";

import { Button } from "@/components/ui/button";
import {
  deleteConciergeConversation,
  markConciergeLeadHandled,
} from "@/lib/actions/concierge-actions";

interface Props {
  conversationId: string;
  isAdmin: boolean;
  hasLead: boolean;
  leadHandled: boolean;
}

export function ConversationActions({
  conversationId,
  isAdmin,
  hasLead,
  leadHandled,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasLead && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              markConciergeLeadHandled(conversationId, !leadHandled).then(
                () => undefined,
                () => undefined
              )
            )
          }
        >
          {leadHandled ? (
            <>
              <RefreshDouble className="mr-1 h-4 w-4" aria-hidden /> Reopen lead
            </>
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" aria-hidden /> Mark lead handled
            </>
          )}
        </Button>
      )}
      {isAdmin &&
        (confirmingDelete ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  deleteConciergeConversation(conversationId).then(
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
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => setConfirmingDelete(true)}
          >
            <Trash className="mr-1 h-4 w-4" aria-hidden /> Delete conversation
          </Button>
        ))}
    </div>
  );
}
