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
  User,
  Clock,
} from "iconoir-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavSection {
  title: string;
  variant: "content" | "operations" | "system";
  items: NavItem[];
}

const CONTENT_SECTIONS: NavSection[] = [
  {
    title: "Content Management",
    variant: "content",
    items: [
      { href: "/admin", label: "Dashboard", icon: ViewGrid, exact: true },
      { href: "/admin/pages", label: "Pages", icon: Page },
      { href: "/admin/links", label: "Links", icon: LinkIcon },
      { href: "/admin/messages", label: "Communications", icon: Mail },
      { href: "/admin/meetings", label: "Meetings", icon: Calendar },
    ],
  },
];

const ADMIN_SECTIONS: NavSection[] = [
  {
    title: "Backend Operations",
    variant: "operations",
    items: [
      { href: "/admin/connectors", label: "Connectors", icon: Database },
    ],
  },
  {
    title: "System Administration",
    variant: "system",
    items: [
      { href: "/admin/users", label: "Staff", icon: User },
      { href: "/admin/activity", label: "Activity Log", icon: Clock },
    ],
  },
];

const SECTION_LABEL_COLOUR: Record<NavSection["variant"], string> = {
  content: "text-muted-foreground",
  operations: "text-amber-500/70",
  system: "text-muted-foreground",
};

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

function SectionBlock({ section }: { section: NavSection }) {
  return (
    <>
      <div
        className={cn(
          "text-[10px] font-bold uppercase tracking-widest mb-2 mt-5 px-3",
          SECTION_LABEL_COLOUR[section.variant],
        )}
      >
        {section.title}
      </div>
      {section.items.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </>
  );
}

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className="flex-1 p-4 space-y-0.5">
      {CONTENT_SECTIONS.map((s) => (
        <SectionBlock key={s.title} section={s} />
      ))}

      {isAdmin && (
        <>
          {ADMIN_SECTIONS.map((s) => (
            <SectionBlock key={s.title} section={s} />
          ))}
        </>
      )}
    </nav>
  );
}
