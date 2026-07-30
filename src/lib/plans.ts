/**
 * Server-side reader for the backend's public pricing catalog.
 *
 * The marketing pricing section renders from this instead of a hardcoded
 * table, so a price edited in /admin → Subscription Plans shows up on
 * /pricing without a deploy.
 *
 * Cached under the `subscription-plans` tag; the admin revalidates that tag
 * after saving a plan (see src/lib/actions/plans.ts), and the 5-minute window
 * bounds how stale it can get if a revalidate is ever missed.
 */

import type { PublicPlanCatalog } from "@/types/plans";

export const PLANS_CACHE_TAG = "subscription-plans";

export type PlanLang = "en" | "fr";

/** Both locales, keyed by language. */
export type PlanCatalogByLang = Record<PlanLang, PublicPlanCatalog | null>;

/**
 * Fetches the catalog. Returns null on any failure — the pricing section falls
 * back to its bundled copy rather than rendering an error, because a backend
 * blip must never take down the marketing page.
 */
export async function getPublicPlanCatalog(
  lang: PlanLang = "en",
): Promise<PublicPlanCatalog | null> {
  const base = process.env.DJANGO_API_URL;
  if (!base) {
    console.warn("DJANGO_API_URL is not configured — pricing will use fallback copy");
    return null;
  }

  try {
    const res = await fetch(`${base}/api/v1/subscriptions/plans/?lang=${lang}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: [PLANS_CACHE_TAG] },
    });
    if (!res.ok) {
      console.error(`Pricing catalog fetch failed: ${res.status}`);
      return null;
    }
    return (await res.json()) as PublicPlanCatalog;
  } catch (error) {
    console.error("Pricing catalog fetch failed", error);
    return null;
  }
}

/**
 * Both locales in one shot.
 *
 * Language is resolved in the browser by react-i18next, so the server cannot
 * know which one to render — it ships both and the pricing section picks.
 * Two cached requests, not two per visitor.
 */
export async function getPublicPlanCatalogs(): Promise<PlanCatalogByLang> {
  const [en, fr] = await Promise.all([
    getPublicPlanCatalog("en"),
    getPublicPlanCatalog("fr"),
  ]);
  return { en, fr };
}
