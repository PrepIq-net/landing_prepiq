import { timingSafeEqual } from "crypto";

/**
 * The support API is server-to-server only: the PrepIQ dashboard (and later
 * the Django backend for mobile) submits on behalf of users it has already
 * authenticated, attaching this shared key. Nothing under /api/support is
 * callable from a browser directly — unlike /api/content/legal, this surface
 * accepts writes, so it is never public.
 */
export function isAuthorizedSupportCall(request: Request): boolean {
  const expected = process.env.SUPPORT_API_KEY;
  const provided = request.headers.get("x-support-key");
  if (!expected || !provided) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function supportReference(refNo: number): string {
  return `PIQ-${refNo}`;
}
