"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus, Trash, WarningTriangle, Xmark } from "iconoir-react";

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
  approveManualPayment,
  deletePaymentInstruction,
  rejectManualPayment,
  savePaymentInstruction,
} from "@/lib/actions/tenant-actions";
import type {
  ManualPaymentQueue,
  ManualPaymentRequest,
  PaymentInstruction,
} from "@/types/admin-tenants";
import { ActionDialog, useAction } from "./ActionDialog";
import {
  DataRow,
  DrillLink,
  EmptyState,
  PageHeader,
  SectionCard,
  StatusPill,
  formatDateTime,
  type Tone,
} from "./shared";
import { TenantFilters, TenantPagination } from "./TenantFilters";

const STATUS_TONE: Record<string, Tone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "critical",
};

export function ManualPaymentsManager({
  queue,
  instructions,
}: {
  queue: ManualPaymentQueue;
  instructions: PaymentInstruction[];
}) {
  const { pending, run } = useAction();
  const [reviewing, setReviewing] = useState<{
    row: ManualPaymentRequest;
    mode: "approve" | "reject";
  } | null>(null);
  const [editingInstruction, setEditingInstruction] =
    useState<PaymentInstruction | null>(null);
  const [showInstructionForm, setShowInstructionForm] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Offline Payments"
        description="Bank transfers, mobile money, and cash. Approving one activates the branch's subscription and sends the same invoice and receipt an online card payment would."
        actions={
          queue.pending_count > 0 ? (
            <StatusPill tone="warning">
              {queue.pending_count} awaiting review
            </StatusPill>
          ) : undefined
        }
      />

      <TenantFilters
        placeholder="Search by reference, payer, organization, or branch…"
        filters={[
          {
            name: "status",
            label: "Status",
            options: queue.statuses.map((s) => ({
              value: s.value,
              label: s.label,
            })),
          },
        ]}
      />

      {queue.results.length === 0 ? (
        <EmptyState
          title="Nothing to review"
          hint="Payments customers submit from the dashboard land here, as do any you record yourself."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.results.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-mono text-xs text-foreground">
                      {row.reference_code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(row.created_at)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DrillLink href={`/admin/organizations/${row.organization}`}>
                      {row.organization_name}
                    </DrillLink>
                    <p className="text-xs text-muted-foreground">
                      {row.branch_name}
                      {row.submitted_by_email
                        ? ` · ${row.submitted_by_email}`
                        : " · recorded by admin"}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.plan_name}
                    <p className="text-xs text-muted-foreground">
                      {row.billing_cycle.toLowerCase()} · {row.method_label}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm tabular-nums text-foreground">
                      {row.declared_amount} {row.declared_currency}
                    </p>
                    <AmountNote row={row} />
                  </TableCell>
                  <TableCell>
                    {row.proof_url ? (
                      <a
                        href={row.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        View receipt
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None attached
                      </span>
                    )}
                    {row.payer_reference && (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {row.payer_reference}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={STATUS_TONE[row.status] ?? "neutral"}>
                      {row.status_label}
                    </StatusPill>
                    {row.invoice_number && (
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {row.invoice_number}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => setReviewing({ row, mode: "approve" })}
                          disabled={pending}
                        >
                          <Check className="mr-1.5 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReviewing({ row, mode: "reject" })}
                          disabled={pending}
                        >
                          <Xmark className="h-4 w-4" />
                          <span className="sr-only">
                            Reject {row.reference_code}
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {row.reviewed_by_email || "—"}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TenantPagination count={queue.count} pageSize={25} />

      <SectionCard
        title="Where customers pay"
        description="These account details appear in the dashboard when a customer chooses to pay offline. Nothing is shown to them until at least one is active."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingInstruction(null);
              setShowInstructionForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add account
          </Button>
        }
      >
        {instructions.length === 0 ? (
          <EmptyState
            title="No payment accounts configured"
            hint="Until you add one, the dashboard cannot offer bank transfer or mobile money."
          />
        ) : (
          <ul>
            {instructions.map((instruction) => (
              <li
                key={instruction.id}
                className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 py-4 last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {instruction.label}
                    </p>
                    <StatusPill
                      tone={instruction.is_active ? "success" : "neutral"}
                    >
                      {instruction.is_active ? "Live" : "Hidden"}
                    </StatusPill>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {instruction.method_label}
                    {instruction.currency ? ` · ${instruction.currency}` : ""}
                  </p>
                  <dl className="mt-2 space-y-0.5">
                    {Object.entries(instruction.account_details).map(
                      ([key, value]) => (
                        <div key={key} className="flex gap-2 text-xs">
                          <dt className="text-muted-foreground">{key}:</dt>
                          <dd className="font-mono text-foreground">{value}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingInstruction(instruction);
                      setShowInstructionForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      run(
                        () => deletePaymentInstruction(instruction.id),
                        "Account removed.",
                      )
                    }
                    disabled={pending}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove {instruction.label}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* -- review dialogs ----------------------------------------------- */}

      <ActionDialog
        open={reviewing?.mode === "approve"}
        onOpenChange={(open) => !open && setReviewing(null)}
        title={`Approve ${reviewing?.row.reference_code ?? ""}?`}
        description={
          reviewing
            ? `${reviewing.row.branch_name} goes onto ${reviewing.row.plan_name} immediately, and ${reviewing.row.submitted_by_email || "the organization"} receives the invoice and receipt. Confirm the money actually arrived before approving — this is not reversible from here.`
            : ""
        }
        confirmLabel="Approve and activate"
        successMessage="Payment approved — subscription is live."
        onConfirm={(note) =>
          reviewing
            ? approveManualPayment(reviewing.row.id, note)
            : Promise.resolve({ ok: false, error: "Nothing selected." })
        }
        reasonLabel="Note"
        reasonPlaceholder="Seen on the statement, matched to deposit…"
      >
        {reviewing && (
          <dl className="rounded-md border border-border bg-secondary/40 p-3">
            <DataRow label="Customer paid">
              {reviewing.row.declared_amount} {reviewing.row.declared_currency}
            </DataRow>
            <DataRow label="Plan price">
              {reviewing.row.expected_amount} USD
            </DataRow>
            <DataRow label="Their reference">
              {reviewing.row.payer_reference || "—"}
            </DataRow>
          </dl>
        )}
        {reviewing?.row.amount_matches === false && (
          <p className="flex items-start gap-2 text-xs text-foreground">
            <WarningTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--warning))]" />
            The amount does not match the plan price. Approving still bills the
            full plan price on the invoice.
          </p>
        )}
      </ActionDialog>

      <ActionDialog
        open={reviewing?.mode === "reject"}
        onOpenChange={(open) => !open && setReviewing(null)}
        title={`Reject ${reviewing?.row.reference_code ?? ""}?`}
        description="Nothing about their subscription changes. The reason you give is shown to the customer, so say what they should do next."
        confirmLabel="Reject payment"
        destructive
        reasonLabel="Reason"
        reasonPlaceholder="No matching deposit found — please send the transaction ID."
        requireReason
        successMessage="Payment rejected."
        onConfirm={(note) =>
          reviewing
            ? rejectManualPayment(reviewing.row.id, note)
            : Promise.resolve({ ok: false, error: "Nothing selected." })
        }
      />

      <InstructionDialog
        open={showInstructionForm}
        instruction={editingInstruction}
        onOpenChange={setShowInstructionForm}
      />
    </div>
  );
}

function AmountNote({ row }: { row: ManualPaymentRequest }) {
  if (row.amount_matches === true) {
    return (
      <p className="text-xs text-muted-foreground">
        Matches {row.expected_amount} USD
      </p>
    );
  }
  if (row.amount_matches === false) {
    return (
      <p className="text-xs text-[hsl(var(--warning))]">
        Expected {row.expected_amount} USD
      </p>
    );
  }
  // Cross-currency: no arithmetic we can do here is trustworthy, so say so
  // rather than showing a comparison the admin might believe.
  return (
    <p className="text-xs text-muted-foreground">
      Plan is {row.expected_amount} USD — check the rate
    </p>
  );
}

function InstructionDialog({
  open,
  instruction,
  onOpenChange,
}: {
  open: boolean;
  instruction: PaymentInstruction | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [draft, setDraft] = useState({
    method: instruction?.method ?? "BANK_TRANSFER",
    label: instruction?.label ?? "",
    currency: instruction?.currency ?? "",
    instructions: instruction?.instructions ?? "",
    // Edited as "Label: value" lines — a JSON textarea would be a trap for the
    // person most likely to be updating an account number in a hurry.
    details: Object.entries(instruction?.account_details ?? {})
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  });

  // Re-seed when a different row is opened for editing.
  const [seededFor, setSeededFor] = useState(instruction?.id ?? null);
  if (open && seededFor !== (instruction?.id ?? null)) {
    setSeededFor(instruction?.id ?? null);
    setDraft({
      method: instruction?.method ?? "BANK_TRANSFER",
      label: instruction?.label ?? "",
      currency: instruction?.currency ?? "",
      instructions: instruction?.instructions ?? "",
      details: Object.entries(instruction?.account_details ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    });
  }

  function parseDetails(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const line of draft.details.split("\n")) {
      const index = line.indexOf(":");
      if (index === -1) continue;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (key && value) out[key] = value;
    }
    return out;
  }

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={instruction ? "Edit payment account" : "Add payment account"}
      description="Shown to customers who choose to pay offline. Double-check the numbers — a wrong one sends money nowhere."
      confirmLabel="Save account"
      successMessage="Payment account saved."
      onConfirm={() =>
        savePaymentInstruction(instruction?.id ?? null, {
          method: draft.method,
          label: draft.label,
          currency: draft.currency.toUpperCase(),
          instructions: draft.instructions,
          account_details: parseDetails(),
          is_active: true,
        })
      }
    >
      <div className="space-y-2">
        <Label htmlFor="instruction-method">Method</Label>
        <select
          id="instruction-method"
          value={draft.method}
          onChange={(event) => setDraft({ ...draft, method: event.target.value })}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="BANK_TRANSFER">Bank transfer</option>
          <option value="MOBILE_MONEY">Mobile money</option>
          <option value="CASH">Cash</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="instruction-label">Name</Label>
        <Input
          id="instruction-label"
          value={draft.label}
          onChange={(event) => setDraft({ ...draft, label: event.target.value })}
          placeholder="Stanbic Bank (UGX)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instruction-currency">Currency</Label>
        <Input
          id="instruction-currency"
          value={draft.currency}
          onChange={(event) =>
            setDraft({ ...draft, currency: event.target.value })
          }
          placeholder="UGX — leave blank for any"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instruction-details">Account details</Label>
        <Textarea
          id="instruction-details"
          rows={4}
          value={draft.details}
          onChange={(event) =>
            setDraft({ ...draft, details: event.target.value })
          }
          placeholder={"Account name: PrepIQ Ltd\nAccount number: 0123456789"}
        />
        <p className="text-xs text-muted-foreground">
          One per line, as <code className="font-mono">Label: value</code>.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="instruction-notes">Extra instructions</Label>
        <Textarea
          id="instruction-notes"
          rows={2}
          value={draft.instructions}
          onChange={(event) =>
            setDraft({ ...draft, instructions: event.target.value })
          }
          placeholder="Quote your PrepIQ reference in the transfer narration."
        />
      </div>
    </ActionDialog>
  );
}
