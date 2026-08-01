/**
 * Presentational building blocks shared by the Organizations, Branches, and
 * User Accounts screens. Server-safe (no "use client") so list pages can render
 * them without shipping JS.
 *
 * Colour rule from docs/DESIGN.md §8: destructive / success / info fail AA as
 * 12–14px text on card, so every status here goes through a `.badge-*` class
 * (tinted background, readable label) rather than colouring small type.
 */

import Link from "next/link";
import { ArrowRight, Check, Xmark } from "iconoir-react";

import { cn } from "@/lib/utils";

export type Tone = "neutral" | "success" | "warning" | "critical" | "info";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-secondary text-muted-foreground border border-border",
  success: "badge-success",
  warning: "badge-warning",
  critical: "badge-critical",
  info: "badge-info",
};

export function StatusPill({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASS[tone],
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2 min-w-0">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-card", className)}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

/** Label/value pair for the read-only halves of a detail page. */
export function DataRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 py-2 border-b border-border/60 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground text-right min-w-0 break-words">
        {children}
      </dd>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * The one thing that renders when Django is unreachable. It matters that this
 * says *which* half of the admin is affected: the CMS runs off the landing
 * database and keeps working, so a Django outage must not read as "the admin
 * is down".
 */
export function BackendUnreachable({
  title,
  error,
}: {
  title: string;
  error: string;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/10 p-6"
      >
        <p className="font-medium text-foreground">
          Could not reach the PrepIQ backend
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tenant records live in Django, not in the landing database. Check that{" "}
          <code className="font-mono text-xs">DJANGO_API_URL</code> and{" "}
          <code className="font-mono text-xs">ADMIN_SERVICE_KEY</code> are set
          and that the backend is running. Content administration is unaffected.
        </p>
        <p className="mt-3 break-all font-mono text-xs text-muted-foreground/70">
          {error}
        </p>
      </div>
    </div>
  );
}

/**
 * Compact readiness strip: six dots, one per prerequisite a branch needs before
 * it can forecast. Colour alone never carries the meaning — each dot has a
 * title and the summary text states the count.
 */
export function ReadinessDots({
  readiness,
}: {
  readiness: Record<string, boolean>;
}) {
  const LABELS: Record<string, string> = {
    has_subscription: "Subscription",
    has_operating_hours: "Operating hours",
    has_connector: "POS connector",
    has_staff: "Staff assigned",
    has_expected_covers: "Expected covers",
    has_coordinates: "Coordinates",
  };
  const entries = Object.entries(LABELS);
  const met = entries.filter(([key]) => readiness[key]).length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {entries.map(([key, label]) => (
          <span
            key={key}
            title={`${label}: ${readiness[key] ? "ready" : "missing"}`}
            className={cn(
              "h-1.5 w-4 rounded-full",
              readiness[key] ? "bg-primary" : "bg-secondary",
            )}
          />
        ))}
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">
        {met}/{entries.length}
      </span>
    </div>
  );
}

export function BooleanMark({ value, label }: { value: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
      {value ? (
        <Check className="h-4 w-4 text-primary" aria-hidden />
      ) : (
        <Xmark className="h-4 w-4 text-muted-foreground" aria-hidden />
      )}
      <span className="sr-only">{value ? "Yes" : "No"}:</span>
      {label}
    </span>
  );
}

export function DrillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | number | null | undefined): string {
  if (!value) return "—";
  // The session registry reports UNIX seconds; everything else is ISO.
  const date =
    typeof value === "number" ? new Date(value * 1000) : new Date(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function subscriptionTone(status: string | undefined): Tone {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "EXPIRED":
    case "SUSPENDED":
      return "critical";
    default:
      return "neutral";
  }
}
