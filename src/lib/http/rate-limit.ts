/**
 * Generic abuse guards for public, unauthenticated API routes: a salted
 * client-IP hash and an in-memory sliding-window rate limiter. Extracted from
 * the concierge routes so other public lead-capture endpoints (e.g. the
 * Kitchen Intelligence Calculator) don't reimplement the same ~40 lines.
 *
 * The limiter is per-instance and resets on deploy — acceptable at current
 * scale; move to Redis if the landing site ever runs multiple instances.
 */
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export function clientIpHash(request: NextRequest, salt: string): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

export interface RateLimiterOptions {
  windowMs?: number;
  maxHits?: number;
}

export function createRateLimiter({ windowMs = 60_000, maxHits = 10 }: RateLimiterOptions = {}) {
  const hits = new Map<string, number[]>();

  return {
    isRateLimited(key: string): boolean {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= maxHits) {
        hits.set(key, recent);
        return true;
      }
      recent.push(now);
      hits.set(key, recent);
      // Opportunistic cleanup so the map can't grow unbounded.
      if (hits.size > 5000) {
        for (const [k, v] of hits) {
          if (v.every((t) => now - t >= windowMs)) hits.delete(k);
        }
      }
      return false;
    },
  };
}

export function rateLimitedResponse(): NextResponse {
  return NextResponse.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
