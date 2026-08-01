/**
 * Recent superadmin actions against one record.
 *
 * This is the counterweight to the panel's power: every edit, suspension, and
 * impersonation shows up here attributed to a named admin, on the record it
 * touched. If an action is not visible here, it did not leave a trail — which
 * is a bug in the endpoint, not a gap in this component.
 */

import { EmptyState, formatDateTime } from "./shared";
import type { AdminAuditEntry } from "@/types/admin-tenants";

export function AuditTrail({ entries }: { entries: AdminAuditEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No admin actions recorded"
        hint="Changes made from this panel appear here, attributed to whoever made them."
      />
    );
  }

  return (
    <ol className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-3">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm text-foreground">
              {entry.summary || entry.action_label}
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.actor_email} · {formatDateTime(entry.created_at)}
              {entry.ip_address ? ` · ${entry.ip_address}` : ""}
            </p>
            {Object.keys(entry.changes ?? {}).length > 0 && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground transition-colors">
                  Details
                </summary>
                <pre className="mt-1 overflow-x-auto rounded-md border border-border bg-secondary/40 p-2 font-mono text-[11px] leading-relaxed">
                  {JSON.stringify(entry.changes, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
