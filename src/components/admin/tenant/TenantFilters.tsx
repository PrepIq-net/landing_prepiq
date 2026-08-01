"use client";

/**
 * Search + dropdown filters for the tenant list pages.
 *
 * State lives in the URL rather than in React, so a filtered view is
 * linkable, survives a refresh, and lets the server component do the querying.
 * The search box debounces because every keystroke would otherwise be a
 * round-trip to Django.
 */

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Xmark } from "iconoir-react";

import { cn } from "@/lib/utils";

export interface FilterDef {
  /** Query-string key. */
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export function TenantFilters({
  placeholder,
  filters,
}: {
  placeholder: string;
  filters: FilterDef[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Skips the debounce on mount, which would otherwise fire a redundant
  // navigation to the URL we are already on.
  const mounted = useRef(false);

  function push(params: URLSearchParams) {
    params.delete("page");
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      push(params);
    }, 300);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
    // `searchParams` is intentionally out of the dep list: including it would
    // re-arm the timer on every navigation this effect itself causes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function setFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    push(params);
  }

  const activeCount =
    filters.filter((filter) => searchParams.get(filter.name)).length +
    (searchParams.get("search") ? 1 : 0);

  function clearAll() {
    setSearch("");
    startTransition(() => router.replace(pathname));
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 transition-opacity duration-200",
        isPending && "opacity-60",
      )}
    >
      <div className="relative flex-1 min-w-[240px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-9 w-full rounded-md border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {filters.map((filter) => (
        <label key={filter.name} className="flex items-center gap-2">
          <span className="sr-only">{filter.label}</span>
          <select
            value={searchParams.get(filter.name) ?? ""}
            onChange={(event) => setFilter(filter.name, event.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Xmark className="h-4 w-4" />
          Clear {activeCount}
        </button>
      )}
    </div>
  );
}

/** Prev/next control for the paginated Django list endpoints. */
export function TenantPagination({
  count,
  pageSize,
}: {
  count: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (totalPages <= 1) return null;

  function goTo(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const buttonClass =
    "h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <nav
      className="flex items-center justify-between gap-4"
      aria-label="Pagination"
    >
      <p className="text-xs text-muted-foreground tabular-nums">
        Page {page} of {totalPages} · {count} total
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
