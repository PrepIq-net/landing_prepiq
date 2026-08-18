import { timingSafeEqual } from "crypto";

/**
 * The ops-alerts API is server-to-server only: the Django backend posts here
 * when it detects an infra/integration failure it caught on a restaurant's
 * behalf (POS sync down, connector offline, ...), attaching this shared key.
 * Nothing under /api/ops-alerts is callable from a browser directly.
 *
 * Mirrors app/api/support/auth.ts, which the dashboard uses in the other
 * direction — same shared-secret-header pattern, opposite caller.
 */
export function isAuthorizedOpsAlertCall(request: Request): boolean {
  const expected = process.env.OPS_ALERT_API_KEY;
  const provided = request.headers.get("x-ops-alert-key");
  if (!expected || !provided) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function opsAlertReference(refNo: number): string {
  return `OPS-${refNo}`;
}
