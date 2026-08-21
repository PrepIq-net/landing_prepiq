"use client";

import { useState } from "react";
import { Plus, Trash } from "iconoir-react";

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
  addSuppressedEmail,
  removeSuppressedEmail,
} from "@/lib/actions/tenant-actions";
import type { SuppressedEmail } from "@/types/admin-tenants";
import { ActionDialog } from "./ActionDialog";
import { EmptyState, PageHeader, SectionCard, StatusPill, formatDateTime } from "./shared";

const REASON_LABEL: Record<SuppressedEmail["reason"], string> = {
  BOUNCED: "Bounced",
  COMPLAINED: "Marked as spam",
  MANUAL: "Added manually",
};

const REASON_TONE: Record<SuppressedEmail["reason"], "critical" | "warning" | "neutral"> = {
  BOUNCED: "critical",
  COMPLAINED: "critical",
  MANUAL: "warning",
};

export function SuppressedEmailsManager({
  emails,
}: {
  emails: SuppressedEmail[];
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<SuppressedEmail | null>(null);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Deliverability"
        description="Addresses PrepIQ will not send to. Resend reports a bounce or a spam complaint here automatically — once that happens, we stop trying that address until someone removes it below."
        actions={
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add address
          </Button>
        }
      />

      <SectionCard
        title="Suppressed addresses"
        description="Automatic entries (Resend bounce or complaint) are read-only — the reason and message came from the delivery event itself."
      >
        {emails.length === 0 ? (
          <EmptyState
            title="Nothing suppressed"
            hint="Every address PrepIQ has tried to email is still deliverable, as far as we know."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Last event</TableHead>
                <TableHead>Added by</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.email}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <StatusPill tone={REASON_TONE[row.reason]}>
                        {REASON_LABEL[row.reason]}
                      </StatusPill>
                      {row.description && (
                        <p className="max-w-xs text-xs text-muted-foreground">
                          {row.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(row.last_event_at) || formatDateTime(row.first_seen_at)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.added_by_email || "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRemoveTarget(row)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove {row.email}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <ActionDialog
        open={showAddForm}
        onOpenChange={(open) => {
          setShowAddForm(open);
          if (!open) {
            setEmail("");
            setDescription("");
          }
        }}
        title="Suppress an address"
        description="PrepIQ will stop sending to this address immediately. Use this for an address you already know is bad — Resend adds bounces and complaints here on its own."
        confirmLabel="Suppress"
        successMessage="Address suppressed."
        onConfirm={() => addSuppressedEmail(email.trim(), description.trim())}
      >
        <div className="space-y-3">
          <div>
            <Label htmlFor="suppress-email">Email address</Label>
            <Input
              id="suppress-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
            />
          </div>
          <div>
            <Label htmlFor="suppress-note">Note (optional)</Label>
            <Textarea
              id="suppress-note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this address is being suppressed"
              rows={3}
            />
          </div>
        </div>
      </ActionDialog>

      <ActionDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove from suppression list?"
        description={
          removeTarget
            ? `PrepIQ will start trying to send to ${removeTarget.email} again.`
            : ""
        }
        confirmLabel="Remove"
        destructive
        successMessage="Removed from the suppression list."
        onConfirm={() => removeSuppressedEmail(removeTarget!.id)}
      />
    </div>
  );
}
