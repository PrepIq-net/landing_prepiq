/**
 * Abuse guards for the public Kitchen Intelligence Calculator submit route:
 * honeypot field (enforced in the route), per-visitor+IP rate limiting, and a
 * salted IP hash for abuse tracing without storing raw IPs. Same shape as the
 * concierge routes' guards — see ../../../src/lib/http/rate-limit.ts.
 */
import { NextRequest } from "next/server";
import { clientIpHash as sharedClientIpHash, createRateLimiter, rateLimitedResponse } from "@/lib/http/rate-limit";

// Submission is a heavier, one-shot action (not per-keystroke like chat), so
// the budget is lower than the concierge chat's.
const limiter = createRateLimiter({ windowMs: 60_000, maxHits: 6 });

export function clientIpHash(request: NextRequest): string {
  return sharedClientIpHash(request, process.env.KITCHEN_CALCULATOR_IP_SALT ?? "");
}

export const isRateLimited = limiter.isRateLimited;
export { rateLimitedResponse };
