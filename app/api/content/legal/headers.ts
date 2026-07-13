// This content is public by definition (it is served on the public website),
// so the endpoints are unauthenticated: GET-only, published documents only.
// CORS is open because mobile requests carry no Origin header anyway.
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
} as const;

// Efficiency comes from the CDN: Vercel's edge caches for an hour and serves
// stale for a day while revalidating, so the database sees almost no traffic.
export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const;
