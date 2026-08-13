/**
 * Abuse guards for the public concierge routes. The widget is unauthenticated
 * by design, so protection is layered: honeypot field, message-length caps
 * (enforced by Zod in the routes), per-conversation message cap, and an
 * in-memory sliding-window rate limit per visitor+IP (see ../../../src/lib/http/rate-limit.ts).
 */
import { NextRequest } from "next/server";
import { clientIpHash as sharedClientIpHash, createRateLimiter, rateLimitedResponse } from "@/lib/http/rate-limit";

export const MAX_CONVERSATION_MESSAGES = 40;

const limiter = createRateLimiter({ windowMs: 60_000, maxHits: 10 });

export function clientIpHash(request: NextRequest): string {
  return sharedClientIpHash(request, process.env.CONCIERGE_IP_SALT ?? "");
}

export const isRateLimited = limiter.isRateLimited;
export { rateLimitedResponse };
