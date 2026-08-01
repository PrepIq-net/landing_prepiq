"use client";

/**
 * ⌘K navigation for the admin panel.
 *
 * The sidebar shows one workspace at a time, which keeps it readable but means
 * a cross-workspace jump ("I'm editing the blog, take me to that org") costs
 * two clicks. The palette is the escape hatch: it searches *every* destination
 * regardless of which workspace is showing, and labels each result with where
 * it lives so the switch is never a surprise.
 *
 * The provider owns the open/close state so the sidebar's "Jump to…" button and
 * the keyboard shortcut drive the same dialog.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { flattenDestinations, visibleWorkspaces } from "@/lib/admin-nav";

const PaletteContext = createContext<() => void>(() => {});

/** Opens the palette. Safe to call from anywhere inside the admin layout. */
export function useAdminPalette() {
  return useContext(PaletteContext);
}

export function AdminCommandPaletteProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const destinations = useMemo(
    () => flattenDestinations(visibleWorkspaces(isAdmin)),
    [isAdmin],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const openPalette = useCallback(() => setOpen(true), []);

  // Group by workspace so results read as "Platform › Organizations" rather
  // than an undifferentiated list of eighteen links.
  const grouped = useMemo(() => {
    const map = new Map<string, typeof destinations>();
    for (const destination of destinations) {
      const bucket = map.get(destination.workspaceLabel) ?? [];
      bucket.push(destination);
      map.set(destination.workspaceLabel, bucket);
    }
    return [...map.entries()];
  }, [destinations]);

  return (
    <PaletteContext.Provider value={openPalette}>
      {children}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, tenants, settings…" />
        <CommandList>
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          {grouped.map(([workspaceLabel, items]) => (
            <CommandGroup key={workspaceLabel} heading={workspaceLabel}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    // cmdk matches on this string, so the keywords ride along
                    // invisibly — "outlets" finds Branches, "impersonate"
                    // finds User Accounts.
                    value={`${item.label} ${item.groupTitle} ${(item.keywords ?? []).join(" ")}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(item.href);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4 opacity-70" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.groupTitle}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </PaletteContext.Provider>
  );
}
