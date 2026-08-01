import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Page,
  Link as LinkIcon,
  Mail,
  Building,
  MapPin,
  User,
  CreditCard,
  Wallet,
  Quote,
  ArrowRight,
} from "iconoir-react";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import type { AdminPlanListResponse } from "@/types/admin-plans";
import type { TenantOverview } from "@/types/admin-tenants";

export const dynamic = "force-dynamic";

/**
 * Two-workspace overview, mirroring the sidebar: Content & Growth counts come
 * from the landing database, Platform Operations counts from the PrepIQ
 * backend. The backend half degrades to a "not reachable" note rather than
 * failing the page — an unreachable Django must not black out content admin.
 */
export default async function AdminDashboard() {
  const session = await auth();
  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;
  if (!currentUser) return notFound();

  const isAdmin = currentUser.role === "ADMIN";

  const [pagesCount, linksCount, messagesCount, testimonialsCount] =
    await Promise.all([
      prisma.page.count(),
      prisma.link.count(),
      prisma.contactMessage.count({ where: { status: "unread" } }),
      prisma.testimonial.count({ where: { isPublished: true } }),
    ]);

  let planCatalog: AdminPlanListResponse | null = null;
  let tenants: TenantOverview | null = null;
  if (isAdmin) {
    // Settled independently: a failure in one Django call should not blank the
    // other section, and neither should blank the CMS half above.
    const [planResult, tenantResult] = await Promise.allSettled([
      djangoAdminFetch<AdminPlanListResponse>(
        "/api/mgmt/subscription-plans/",
        currentUser.email,
      ),
      djangoAdminFetch<TenantOverview>(
        "/api/mgmt/tenant-overview/",
        currentUser.email,
      ),
    ]);
    planCatalog = planResult.status === "fulfilled" ? planResult.value : null;
    tenants = tenantResult.status === "fulfilled" ? tenantResult.value : null;
  }

  const plans = planCatalog?.results ?? [];
  const activePlans = plans.filter((plan) => plan.is_active);
  const subscribedBranches = plans.reduce(
    (sum, plan) => sum + plan.active_subscription_count,
    0,
  );

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-semibold tracking-tight text-foreground">
          System Overview
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          What we publish, and what we run. Everything counted here is editable
          from the sidebar — nothing on the public site is hardcoded.
        </p>
      </div>

      <section className="space-y-5">
        <SectionHeading title="Content & Growth" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Page}
            kicker="Site content"
            value={pagesCount}
            label="Active pages"
            href="/admin/pages"
          />
          <MetricCard
            icon={LinkIcon}
            kicker="Navigation"
            value={linksCount}
            label="Nav & footer links"
            href="/admin/links"
          />
          <MetricCard
            icon={Mail}
            kicker="Inbox"
            value={messagesCount}
            label="Unread messages"
            href="/admin/messages"
            status={
              messagesCount > 0
                ? { text: "Needs a reply", tone: "warning" }
                : { text: "All handled", tone: "success" }
            }
          />
          <MetricCard
            icon={Quote}
            kicker="Social proof"
            value={testimonialsCount}
            label="Published testimonials"
            href="/admin/testimonials"
            status={
              testimonialsCount > 0
                ? { text: "Live on the home page", tone: "success" }
                : { text: "Section hidden until one exists", tone: "warning" }
            }
          />
        </div>
      </section>

      {isAdmin && tenants && (
        <section className="space-y-5">
          <SectionHeading title="Tenants" accent />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              icon={Building}
              kicker="Customers"
              value={tenants.organizations.active}
              label="Active organizations"
              href="/admin/organizations"
              status={
                tenants.organizations.suspended > 0
                  ? {
                      text: `${tenants.organizations.suspended} suspended`,
                      tone: "warning",
                    }
                  : {
                      text: `+${tenants.organizations.new_this_week} this week`,
                      tone: "neutral",
                    }
              }
            />
            <MetricCard
              icon={MapPin}
              kicker="Locations"
              value={tenants.branches.active}
              label="Active branches"
              href="/admin/branches"
              status={
                // Missing hours is the single most common reason a branch
                // silently produces no live advice, so it earns the slot.
                tenants.branches.missing_hours > 0
                  ? {
                      text: `${tenants.branches.missing_hours} without operating hours`,
                      tone: "warning",
                    }
                  : { text: "All have operating hours", tone: "success" }
              }
            />
            <MetricCard
              icon={User}
              kicker="People"
              value={tenants.users.active}
              label="Live accounts"
              href="/admin/accounts"
              status={
                tenants.users.suspended > 0
                  ? { text: `${tenants.users.suspended} suspended`, tone: "warning" }
                  : {
                      text: `${tenants.users.unverified} unverified`,
                      tone: "neutral",
                    }
              }
            />
          </div>

          {tenants.trials_ending_soon.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Trials ending within 7 days
              </h3>
              <ul className="mt-4 space-y-2">
                {tenants.trials_ending_soon.map((trial) => (
                  <li
                    key={trial.branch_id}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/admin/branches/${trial.branch_id}`}
                      className="text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {trial.organization_name} · {trial.branch_name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {trial.plan_name} ·{" "}
                      {new Date(trial.trial_ends_at).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short" },
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {isAdmin && (
        <section className="space-y-5">
          <SectionHeading title="Platform Operations" accent />
          {planCatalog === null ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-foreground font-medium">
                PrepIQ backend not reachable
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Subscription and gateway data live in Django. Content
                administration above is unaffected.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <MetricCard
                icon={CreditCard}
                kicker="Pricing"
                value={activePlans.length}
                label="Plans on /pricing"
                href="/admin/subscriptions"
                status={{
                  text: `${plans.length} total`,
                  tone: "neutral",
                }}
              />
              <MetricCard
                icon={CreditCard}
                kicker="Adoption"
                value={subscribedBranches}
                label="Branches subscribed"
                href="/admin/subscriptions"
                status={{ text: "One plan per branch", tone: "neutral" }}
              />
              <MetricCard
                icon={Wallet}
                kicker="Billing"
                value={null}
                label="Payment gateways"
                href="/admin/payment-gateways"
                status={{ text: "Review configuration", tone: "neutral" }}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  accent = false,
}: {
  title: string;
  accent?: boolean;
}) {
  return (
    <h2 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
      <span
        className={`h-3 w-0.5 rounded-full ${accent ? "bg-primary" : "bg-border"}`}
      />
      {title}
    </h2>
  );
}

function MetricCard({
  icon: Icon,
  kicker,
  value,
  label,
  href,
  status,
}: {
  icon: React.ElementType;
  kicker: string;
  value: number | null;
  label: string;
  href: string;
  status?: { text: string; tone: "success" | "warning" | "neutral" };
}) {
  // success (4.3:1) and info fail AA as small text on card — DESIGN.md §8 says
  // reach them through the tinted .badge-* classes instead of colouring 12px
  // type. warning (5.7:1) is safe either way but stays consistent here.
  const toneClass =
    status?.tone === "warning"
      ? "badge-warning"
      : status?.tone === "success"
        ? "badge-success"
        : "text-muted-foreground";

  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-7 shadow-l2 hover:border-primary/30 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {kicker}
        </span>
      </div>

      <div className="space-y-1">
        {value !== null && (
          <div className="text-5xl font-display font-semibold tracking-tighter text-foreground tabular-nums">
            {value}
          </div>
        )}
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
        <p className={`text-xs font-medium ${toneClass}`}>{status?.text}</p>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </Link>
  );
}
