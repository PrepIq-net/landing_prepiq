"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OpenNewWindow, Trash, Linkedin } from "iconoir-react";
import {
  updateApplicationStatus,
  deleteApplication,
} from "@/lib/actions/career-actions";

const STATUSES = ["NEW", "REVIEWING", "INTERVIEWING", "OFFER", "HIRED", "REJECTED"];

export default function ApplicationRow({
  app,
}: {
  app: {
    id: string;
    refNo: number;
    name: string;
    email: string;
    resumeUrl: string;
    linkedinUrl: string | null;
    coverNote: string | null;
    status: string;
    roleTitle: string;
    createdAt: string;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);

  function onStatus(status: string) {
    startTransition(async () => {
      await updateApplicationStatus(app.id, status);
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteApplication(app.id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-[#2A2A2E] bg-[#1C1C1F] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary">APP-{app.refNo}</span>
            <span className="font-medium text-foreground">{app.name}</span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {app.roleTitle} · <a href={`mailto:${app.email}`} className="hover:text-foreground">{app.email}</a>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(app.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={app.status}
            onChange={(e) => onStatus(e.target.value)}
            disabled={pending}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0" title="Open resume">
            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
              <OpenNewWindow className="h-4 w-4" />
            </a>
          </Button>
          {app.linkedinUrl && (
            <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0" title="LinkedIn">
              <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={pending}
            className={`h-9 text-destructive ${confirming ? "px-2" : "w-9 p-0"}`}
            title="Delete"
          >
            <Trash className="h-4 w-4" />
            {confirming && <span className="ml-1 text-xs">Confirm?</span>}
          </Button>
        </div>
      </div>

      {app.coverNote && (
        <div className="mt-3">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-medium text-primary hover:underline"
          >
            {open ? "Hide note" : "Show note"}
          </button>
          {open && (
            <p className="mt-2 whitespace-pre-wrap rounded-md border border-border/60 bg-background/40 p-3 text-sm text-muted-foreground">
              {app.coverNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
