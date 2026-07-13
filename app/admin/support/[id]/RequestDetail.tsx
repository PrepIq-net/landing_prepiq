"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Paperclip,
  Trash2,
} from "lucide-react";
import type {
  SupportPriority,
  SupportRequestStatus,
  SupportRequestType,
} from "@prisma/client";
import {
  deleteSupportAttachmentAction,
  deleteSupportRequestAction,
  setSupportRequestPublic,
  updateSupportRequestNotes,
  updateSupportRequestPriority,
  updateSupportRequestStatus,
} from "@/lib/actions/support-actions";

type Attachment = {
  id: string;
  publicId: string;
  resourceType: string;
  url: string;
  filename: string;
  format: string | null;
  bytes: number;
  createdAt: string;
};

type RequestData = {
  id: string;
  refNo: number;
  type: SupportRequestType;
  status: SupportRequestStatus;
  priority: SupportPriority;
  subject: string;
  message: string;
  contactEmail: string | null;
  reporterEmail: string;
  reporterName: string | null;
  reporterUserId: string | null;
  reporterRole: string | null;
  organizationId: string | null;
  organizationName: string | null;
  branchId: string | null;
  branchName: string | null;
  sourceApp: string;
  appVersion: string | null;
  currentUrl: string | null;
  userAgent: string | null;
  locale: string | null;
  adminNotes: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  attachments: Attachment[];
  voteCount: number;
};

const TYPE_LABELS: Record<SupportRequestType, string> = {
  BUG: "Bug report",
  FEATURE_REQUEST: "Feature request",
  INQUIRY: "Inquiry",
  FEEDBACK: "Feedback",
};

const STATUSES: SupportRequestStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITIES: SupportPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function ContextRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right break-all">{value}</span>
    </div>
  );
}

export default function RequestDetail({ request }: { request: RequestData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(request.adminNotes ?? "");

  const reference = `PIQ-${request.refNo}`;

  function run(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      if (result.success) toast.success(ok);
      else toast.error(result.error ?? "Something went wrong");
    });
  }

  function handleDeleteAttachment(attachment: Attachment) {
    if (
      !window.confirm(
        `Delete "${attachment.filename}"? The file is also removed from Cloudinary. This cannot be undone.`
      )
    )
      return;
    run(() => deleteSupportAttachmentAction(attachment.id), "Attachment deleted");
  }

  function handleDeleteRequest() {
    if (
      !window.confirm(
        `Delete ${reference} and its ${request.attachments.length} attachment(s)? Cloud files are removed too. This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteSupportRequestAction(request.id);
      if (result.success) {
        toast.success(`${reference} deleted`);
        router.push("/admin/support");
      } else {
        toast.error(result.error ?? "Could not delete the request");
      }
    });
  }

  const mailtoHref = request.contactEmail
    ? `mailto:${request.contactEmail}?subject=${encodeURIComponent(
        `Re: [${reference}] ${request.subject}`
      )}`
    : null;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/support"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Support
          </Link>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">
            <span className="font-mono text-primary mr-3">{reference}</span>
            {request.subject}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{TYPE_LABELS[request.type]}</Badge>
            <span className="text-xs text-muted-foreground">
              Received{" "}
              {new Date(request.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              via {request.sourceApp}
            </span>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteRequest}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4 mr-1.5" /> Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: message + attachments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {request.message}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({request.attachments.length})
              </CardTitle>
              <CardDescription>
                Hosted on Cloudinary. Deleting here also removes the cloud asset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.attachments.length === 0 ? (
                <p className="text-xs text-muted-foreground">No attachments.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {request.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="group relative rounded-lg border border-[#2A2A2E] bg-[#232327] overflow-hidden"
                    >
                      {attachment.resourceType === "image" &&
                      attachment.format !== "pdf" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="h-28 w-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-2.5 space-y-0.5">
                        <p className="text-xs text-foreground truncate" title={attachment.filename}>
                          {attachment.filename}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatBytes(attachment.bytes)}
                        </p>
                      </div>
                      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="h-7 w-7 rounded-md bg-black/70 flex items-center justify-center text-foreground hover:text-primary"
                          title="Open"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteAttachment(attachment)}
                          disabled={isPending}
                          className="h-7 w-7 rounded-md bg-black/70 flex items-center justify-center text-foreground hover:text-red-400"
                          title="Delete (also from Cloudinary)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                placeholder="Triage notes, links to fixes, follow-up reminders…"
                className="min-h-[120px] bg-[#232327] border-[#2A2A2E]"
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending || notes === (request.adminNotes ?? "")}
                onClick={() =>
                  run(() => updateSupportRequestNotes(request.id, notes), "Notes saved")
                }
              >
                Save notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: triage controls + reporter context */}
        <div className="space-y-6">
          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Triage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <select
                  value={request.status}
                  disabled={isPending}
                  onChange={(e) =>
                    run(
                      () =>
                        updateSupportRequestStatus(
                          request.id,
                          e.target.value as SupportRequestStatus
                        ),
                      "Status updated"
                    )
                  }
                  className="w-full h-9 rounded-lg bg-[#232327] border border-[#2A2A2E] px-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <select
                  value={request.priority}
                  disabled={isPending}
                  onChange={(e) =>
                    run(
                      () =>
                        updateSupportRequestPriority(
                          request.id,
                          e.target.value as SupportPriority
                        ),
                      "Priority updated"
                    )
                  }
                  className="w-full h-9 rounded-lg bg-[#232327] border border-[#2A2A2E] px-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {request.type === "FEATURE_REQUEST" && (
                <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2E]">
                  <div>
                    <Label className="text-xs text-foreground">On feature board</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Visible &amp; votable in the app · {request.voteCount} votes
                    </p>
                  </div>
                  <Switch
                    checked={request.isPublic}
                    disabled={isPending}
                    onCheckedChange={(checked) =>
                      run(
                        () => setSupportRequestPublic(request.id, checked),
                        checked ? "Published to the board" : "Removed from the board"
                      )
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Reply channel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {request.contactEmail ? (
                <>
                  <p className="text-sm text-foreground break-all">{request.contactEmail}</p>
                  <Button asChild size="sm" variant="secondary" className="w-full">
                    <a href={mailtoHref!}>
                      <Mail className="h-4 w-4 mr-1.5" /> Reply by email
                    </a>
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Send from customer@prepiq.net and keep the {reference} tag in the
                    subject so replies stay traceable.
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  The reporter didn&apos;t request a reply. Their account email is
                  below if you still need to reach out.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle className="text-sm">Reporter &amp; context</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[#2A2A2E]">
              <ContextRow label="Name" value={request.reporterName} />
              <ContextRow label="Account email" value={request.reporterEmail} />
              <ContextRow label="Role" value={request.reporterRole} />
              <ContextRow label="Organization" value={request.organizationName} />
              <ContextRow label="Org ID" value={request.organizationId} />
              <ContextRow label="Branch" value={request.branchName ?? (request.branchId ? request.branchId : null)} />
              <ContextRow label="User ID" value={request.reporterUserId} />
              <ContextRow label="App version" value={request.appVersion} />
              <ContextRow label="Page" value={request.currentUrl} />
              <ContextRow label="Locale" value={request.locale} />
              <ContextRow label="Browser" value={request.userAgent} />
              {request.resolvedAt && (
                <ContextRow
                  label="Resolved"
                  value={new Date(request.resolvedAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
