"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { OpsAlertStatus, OpsAlertSeverity, OpsAlertType } from "@prisma/client";
import {
  updateOpsAlertNotes,
  updateOpsAlertStatus,
} from "@/lib/actions/ops-alert-actions";

type AlertData = {
  id: string;
  refNo: number;
  alertType: OpsAlertType;
  severity: OpsAlertSeverity;
  status: OpsAlertStatus;
  organizationId: string | null;
  organizationName: string | null;
  branchId: string | null;
  branchName: string | null;
  branchWasOpen: boolean | null;
  branchLocalTime: string | null;
  payload: Record<string, unknown>;
  adminNotes: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

const TYPE_LABELS: Record<OpsAlertType, string> = {
  POS_SYNC_FAILED: "POS sync failed",
  CONNECTOR_OFFLINE: "Connector offline",
  CSV_STALE: "CSV upload stale",
};

const STATUSES: OpsAlertStatus[] = ["NEW", "ACKNOWLEDGED", "RESOLVED"];

const SEVERITY_STYLES: Record<OpsAlertSeverity, string> = {
  INFO: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  WARNING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
};

function ContextRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right break-all">{value}</span>
    </div>
  );
}

export default function OpsAlertDetail({ alert }: { alert: AlertData }) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(alert.adminNotes ?? "");

  const reference = `OPS-${alert.refNo}`;

  function run(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      if (result.success) toast.success(ok);
      else toast.error(result.error ?? "Something went wrong");
    });
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-1">
        <Link
          href="/admin/ops-alerts"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Ops Alerts
        </Link>
        <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">
          <span className="font-mono text-primary mr-3">{reference}</span>
          {TYPE_LABELS[alert.alertType]}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] ${SEVERITY_STYLES[alert.severity]}`}>
            {alert.severity}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Occurred{" "}
            {new Date(alert.occurredAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: diagnostics + notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Diagnostics</CardTitle>
              <CardDescription>
                Raw payload the backend sent — shape varies by alert type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg bg-[#0F0F11] border border-[#2A2A2E] p-4 text-xs text-foreground/90 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(alert.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Internal notes</CardTitle>
              <CardDescription>Only visible to admins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was wrong, what fixed it, whether it's likely to recur…"
                className="min-h-[120px] bg-[#232327] border-[#2A2A2E]"
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending || notes === (alert.adminNotes ?? "")}
                onClick={() => run(() => updateOpsAlertNotes(alert.id, notes), "Notes saved")}
              >
                Save notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: triage + branch context */}
        <div className="space-y-6">
          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Triage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <select
                  value={alert.status}
                  disabled={isPending}
                  onChange={(e) =>
                    run(
                      () => updateOpsAlertStatus(alert.id, e.target.value as OpsAlertStatus),
                      "Status updated",
                    )
                  }
                  className="w-full h-9 rounded-lg bg-[#232327] border border-[#2A2A2E] px-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              {alert.resolvedAt && (
                <p className="text-[11px] text-muted-foreground">
                  Resolved{" "}
                  {new Date(alert.resolvedAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Branch at the time</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[#2A2A2E]">
              <ContextRow label="Organization" value={alert.organizationName} />
              <ContextRow label="Org ID" value={alert.organizationId} />
              <ContextRow label="Branch" value={alert.branchName} />
              <ContextRow label="Branch ID" value={alert.branchId} />
              <ContextRow
                label="Open at occurrence?"
                value={
                  alert.branchWasOpen === null
                    ? "Unknown (no operating hours set)"
                    : alert.branchWasOpen
                      ? "Yes — mid-service"
                      : "No — closed"
                }
              />
              <ContextRow
                label="Branch-local time"
                value={
                  alert.branchLocalTime
                    ? new Date(alert.branchLocalTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : null
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
