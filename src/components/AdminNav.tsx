"use client";

import { useEffect, useMemo, useState } from "react";
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
  Quote,
  NavArrowDown,
} from "iconoir-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
  /** ADMIN-only groups are hidden from editors. */
  adminOnly?: boolean;
}

/**
 * Grouped rather than listed: at ~18 destinations a flat sidebar is a wall of
 * links you have to read top to bottom. Groups collapse (persisted per browser)
 * so the sidebar stays roughly one screen tall no matter how much we add.
 */
const DASHBOARD: NavItem = {
  href: "/admin",
  label: "Dashboard",
  icon: ViewGrid,
  exact: true,
};

const GROUPS: NavGroup[] = [
  {
    id: "site",
    title: "Website",
    items: [
      { href: "/admin/pages", label: "Page Content", icon: Page },
      { href: "/admin/links", label: "Navigation & Footer", icon: LinkIcon },
      { href: "/admin/legal", label: "Legal Pages", icon: Shield },
    ],
  },
  {
    id: "content",
    title: "Content",
    items: [
      { href: "/admin/blog", label: "Blog Posts", icon: Journal },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/careers", label: "Careers", icon: Suitcase },
    ],
  },
  {
    id: "inbox",
    title: "Inbox",
    items: [
      { href: "/admin/messages", label: "Communications", icon: Mail },
      { href: "/admin/support", label: "Support", icon: HeadsetHelp },
      { href: "/admin/concierge", label: "Concierge", icon: ChatBubbleEmpty },
      { href: "/admin/meetings", label: "Meetings", icon: Calendar },
    ],
  },
  {
    id: "commercial",
    title: "Commercial",
    adminOnly: true,
    items: [
      { href: "/admin/subscriptions", label: "Subscription Plans", icon: CreditCard },
      { href: "/admin/payment-gateways", label: "Payment Gateways", icon: Wallet },
    ],
  },
  {
    id: "connector",
    title: "PIQ Connector",
    adminOnly: true,
    items: [
      { href: "/admin/connectors", label: "Machines", icon: Database },
      { href: "/admin/releases", label: "Releases", icon: CloudDownload },
      { href: "/admin/installation-tokens", label: "Install Tokens", icon: Key },
    ],
  },
  {
    id: "system",
    title: "System",
    adminOnly: true,
    items: [
      { href: "/admin/users", label: "Staff", icon: User },
      { href: "/admin/activity", label: "Activity Log", icon: Clock },
    ],
  },
];

const STORAGE_KEY = "prepiq.admin.collapsedNavGroups";

function isItemActive(pathname: string, item: NavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "hover:bg-accent hover:text-accent-foreground text-foreground/70",
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0",
          active ? "opacity-100" : "opacity-60",
        )}
      />
      {item.label}
    </Link>
  );
}

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const groups = useMemo(
    () => GROUPS.filter((g) => !g.adminOnly || isAdmin),
    [isAdmin],
  );

  // Starts empty so the server and first client render agree; the stored
  // preference is applied after mount.
  const [collapsed, setCollapsed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setCollapsed(JSON.parse(stored));
    } catch {
      // A malformed or unavailable localStorage just means "nothing collapsed".
    }
  }, []);

  function toggle(id: string) {
    setCollapsed((prev) => {
      const next = prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Preference is a nicety; failing to persist it must not break nav.
      }
      return next;
    });
  }

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
      <NavLink item={DASHBOARD} active={isItemActive(pathname, DASHBOARD)} />

      {groups.map((group) => {
        const hasActive = group.items.some((i) => isItemActive(pathname, i));
        // The group holding the current page is always open, whatever was stored.
        const open = hasActive || !collapsed.includes(group.id);

        return (
          <div key={group.id} className="pt-3">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-1.5 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              <NavArrowDown
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  open ? "rotate-0" : "-rotate-90",
                )}
              />
              {group.title}
              {!open && (
                <span className="ml-auto text-[10px] font-semibold text-muted-foreground/60">
                  {group.items.length}
                </span>
              )}
            </button>

            {open && (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isItemActive(pathname, item)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
