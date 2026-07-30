"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ViewGrid,
  Page,
  Link as LinkIcon,
  Mail,
  Calendar,
  Database,
  CloudDownload,
  Key,
  User,
  Clock,
  Shield,
  HeadsetHelp,
  Suitcase,
  Journal,
  ChatBubbleEmpty,
  CreditCard,
  Wallet,
} from "iconoir-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  /** Sub-heading inside a workspace; omitted for the group's primary items. */
  title?: string;
  items: NavItem[];
}

interface NavWorkspace {
  /** The two operational halves of the admin: what we publish vs what we run. */
  title: string;
  variant: "content" | "operations";
  /** ADMIN-only workspaces are hidden from editors. */
  adminOnly?: boolean;
  groups: NavGroup[];
}

/**
 * Two workspaces, deliberately: everything that shapes what visitors and
 * customers *see* lives under Content & Growth, and everything that governs how
 * the platform *runs* — what we charge, how we take money, who has access —
 * lives under Platform Operations.
 */
const WORKSPACES: NavWorkspace[] = [
  {
    title: "Content & Growth",
    variant: "content",
    groups: [
      {
        items: [
          { href: "/admin", label: "Dashboard", icon: ViewGrid, exact: true },
          { href: "/admin/pages", label: "Page Content", icon: Page },
          { href: "/admin/blog", label: "Blog Posts", icon: Journal },
          { href: "/admin/legal", label: "Legal Pages", icon: Shield },
          { href: "/admin/links", label: "Navigation Links", icon: LinkIcon },
          { href: "/admin/careers", label: "Careers", icon: Suitcase },
        ],
      },
      {
        title: "Audience",
        items: [
          { href: "/admin/messages", label: "Communications", icon: Mail },
          { href: "/admin/support", label: "Support", icon: HeadsetHelp },
          { href: "/admin/concierge", label: "Concierge", icon: ChatBubbleEmpty },
          { href: "/admin/meetings", label: "Meetings", icon: Calendar },
        ],
      },
    ],
  },
  {
    title: "Platform Operations",
    variant: "operations",
    adminOnly: true,
    groups: [
      {
        title: "Commercial",
        items: [
          { href: "/admin/subscriptions", label: "Subscription Plans", icon: CreditCard },
          { href: "/admin/payment-gateways", label: "Payment Gateways", icon: Wallet },
        ],
      },
      {
        title: "PIQ Connector",
        items: [
          { href: "/admin/connectors", label: "Machines", icon: Database },
          { href: "/admin/releases", label: "Releases", icon: CloudDownload },
          { href: "/admin/installation-tokens", label: "Install Tokens", icon: Key },
        ],
      },
      {
        title: "System",
        items: [
          { href: "/admin/users", label: "Staff", icon: User },
          { href: "/admin/activity", label: "Activity Log", icon: Clock },
        ],
      },
    ],
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "hover:bg-accent hover:text-accent-foreground text-foreground/70",
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0",
          isActive ? "opacity-100" : "opacity-60",
        )}
      />
      {item.label}
    </Link>
  );
}

function WorkspaceBlock({ workspace }: { workspace: NavWorkspace }) {
  return (
    <section className="mt-6 first:mt-0" aria-label={workspace.title}>
      <h2
        className={cn(
          "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 mb-2",
          workspace.variant === "operations"
            ? "text-primary"
            : "text-foreground/80",
        )}
      >
        <span
          className={cn(
            "h-3 w-0.5 rounded-full",
            workspace.variant === "operations" ? "bg-primary" : "bg-border",
          )}
        />
        {workspace.title}
      </h2>

      {workspace.groups.map((group, i) => (
        <div key={group.title ?? `group-${i}`} className="space-y-0.5">
          {group.title && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mt-3 mb-1.5">
              {group.title}
            </div>
          )}
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      ))}
    </section>
  );
}

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const workspaces = WORKSPACES.filter((w) => !w.adminOnly || isAdmin);

  return (
    <nav className="flex-1 p-4 overflow-y-auto">
      {workspaces.map((workspace) => (
        <WorkspaceBlock key={workspace.title} workspace={workspace} />
      ))}
    </nav>
  );
}
