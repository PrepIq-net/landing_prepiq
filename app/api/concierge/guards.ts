/**
 * Abuse guards for the public concierge routes. The widget is unauthenticated
 * by design, so protection is layered: honeypot field, message-length caps
 * (enforced by Zod in the routes), per-conversation message cap, and an
 * in-memory sliding-window rate limit per visitor+IP. The in-memory limiter is
 * per-instance and resets on deploy — acceptable at current scale; move to
 * Redis if the landing ever runs multiple instances.
 */
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const MAX_CONVERSATION_MESSAGES = 40;

const WINDOW_MS = 60_000;
const MAX_HITS_PER_WINDOW = 10;

const hits = new Map<string, number[]>();

export function clientIpHash(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const salt = process.env.CONCIERGE_IP_SALT ?? "";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export function rateLimitedResponse(): NextResponse {
  return NextResponse.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
