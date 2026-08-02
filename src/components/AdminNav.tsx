"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavArrowDown, Search } from "iconoir-react";

import { cn } from "@/lib/utils";
import {
  DASHBOARD,
  firstDestination,
  isItemActive,
  visibleWorkspaces,
  workspaceForPath,
  type NavItem,
  type Workspace,
} from "@/lib/admin-nav";
import { useAdminPalette } from "@/components/admin/AdminCommandPalette";

const GROUP_STORAGE_KEY = "prepiq.admin.collapsedNavGroups";
const WORKSPACE_STORAGE_KEY = "prepiq.admin.workspace";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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

/**
 * Switches which half of the admin the sidebar is showing. Rendered as a plain
 * disclosure rather than a dropdown menu: there are only ever two or three
 * options, and seeing both descriptions at once is more useful than saving a
 * few pixels.
 */
function WorkspaceSwitcher({
  workspaces,
  current,
  onSelect,
}: {
  workspaces: Workspace[];
  current: Workspace;
  onSelect: (workspace: Workspace) => void;
}) {
  const [open, setOpen] = useState(false);
  const CurrentIcon = current.icon;

  // Only one workspace is visible to editors — a switcher with nothing to
  // switch to is pure noise, so it collapses to a static label.
  if (workspaces.length < 2) {
    return (
      <div className="px-3 pt-4 pb-1">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-secondary/40 border border-border">
          <CurrentIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {current.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pt-4 pb-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2.5 px-3 py-2 rounded-md border transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open
            ? "bg-accent border-primary/30"
            : "bg-secondary/40 border-border hover:bg-accent",
        )}
      >
        <CurrentIcon className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="flex-1 text-left text-sm font-semibold text-foreground truncate">
          {current.label}
        </span>
        <NavArrowDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5 rounded-md border border-border bg-card p-1 shadow-l2">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            const selected = workspace.id === current.id;
            return (
              <li key={workspace.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(workspace);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "bg-primary/10" : "hover:bg-accent",
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 flex-shrink-0",
                      selected ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        selected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {workspace.label}
                    </span>
                    <span className="block text-xs text-muted-foreground leading-snug">
                      {workspace.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const openPalette = useAdminPalette();
  const workspaces = useMemo(() => visibleWorkspaces(isAdmin), [isAdmin]);

  // The URL is the source of truth: navigating to a Platform page from the
  // palette must switch the sidebar with it. `manual` only decides which
  // workspace to show on pages that belong to none (the dashboard).
  const routeWorkspace = workspaceForPath(pathname, workspaces);
  const [manualId, setManualId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (stored) setManualId(stored);
    } catch {
      // Preference is a nicety; failing to read it just means the default.
    }
  }, []);

  const current =
    routeWorkspace ??
    workspaces.find((workspace) => workspace.id === manualId) ??
    workspaces[0];

  function selectWorkspace(workspace: Workspace) {
    setManualId(workspace.id);
    try {
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
    } catch {
      // Non-fatal — the switch still applies for this page view.
    }

    // Navigating is what makes the switch stick. `current` is derived from the
    // URL first, so picking Platform while sitting on /admin/pages used to set
    // a preference the very next render threw away — the sidebar simply
    // snapped back to Marketing and the switcher looked broken. Sending the
    // browser to the workspace's front door keeps the URL and the sidebar
    // saying the same thing.
    if (workspace.id === routeWorkspace?.id) return;
    const destination = firstDestination(workspace);
    if (destination) router.push(destination.href);
  }

  // Starts empty so the server and first client render agree; the stored
  // preference is applied after mount.
  const [collapsed, setCollapsed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(GROUP_STORAGE_KEY);
      if (stored) setCollapsed(JSON.parse(stored));
    } catch {
      // A malformed or unavailable localStorage means "nothing collapsed".
    }
  }, []);

  function toggleGroup(id: string) {
    setCollapsed((prev) => {
      const next = prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id];
      try {
        window.localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Preference is a nicety; failing to persist it must not break nav.
      }
      return next;
    });
  }

  if (!current) return null;

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="px-3 pt-4 shrink-0">
        <button
          type="button"
          onClick={openPalette}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md border border-border bg-secondary/40 px-3 py-2",
            "text-sm text-muted-foreground transition-colors duration-200",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <Search className="h-4 w-4 opacity-70" />
          <span className="flex-1 text-left">Jump to…</span>
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <WorkspaceSwitcher
        workspaces={workspaces}
        current={current}
        onSelect={selectWorkspace}
      />

      <nav className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 space-y-1">
        <NavLink item={DASHBOARD} active={isItemActive(pathname, DASHBOARD)} />

        {current.groups.map((group) => {
          const hasActive = group.items.some((item) =>
            isItemActive(pathname, item),
          );
          // The group holding the current page is always open, whatever was stored.
          const open = hasActive || !collapsed.includes(group.id);

          return (
            <div key={group.id} className="pt-3">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={open}
                className={cn(
                  "flex w-full items-center gap-1.5 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest",
                  "text-muted-foreground hover:text-foreground transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
                )}
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
    </div>
  );
}
