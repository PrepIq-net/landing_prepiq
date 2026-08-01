"use client";

/**
 * Confirmation dialog for the lifecycle actions on tenant records.
 *
 * These are the buttons that suspend a customer, delete an account, or take
 * over an organization — they need a deliberate second step, and several of
 * them require a written reason because the backend refuses without one (the
 * reason is what makes the audit row worth reading six months later).
 */

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ActionResultLike {
  ok: boolean;
  error?: string;
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive = false,
  reasonLabel,
  reasonPlaceholder,
  requireReason = false,
  successMessage,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  requireReason?: boolean;
  successMessage: string;
  onConfirm: (reason: string) => Promise<ActionResultLike>;
  /** Extra fields rendered above the reason box. */
  children?: React.ReactNode;
}) {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  function confirm() {
    if (requireReason && !reason.trim()) {
      toast.error("A reason is required.");
      return;
    }
    startTransition(async () => {
      const result = await onConfirm(reason.trim());
      if (result.ok) {
        toast.success(successMessage);
        onOpenChange(false);
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {children}

          {reasonLabel && (
            <div className="space-y-2">
              <Label htmlFor="action-reason">
                {reasonLabel}
                {requireReason && (
                  <span className="ml-1 text-muted-foreground">(required)</span>
                )}
              </Label>
              <Textarea
                id="action-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={reasonPlaceholder}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={confirm}
            disabled={pending}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Wraps a server action so every call gets uniform toast feedback. */
export function useAction() {
  const [pending, startTransition] = useTransition();

  function run(
    action: () => Promise<ActionResultLike>,
    successMessage: string,
    onSuccess?: () => void,
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(successMessage);
        onSuccess?.();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return { pending, run };
}
