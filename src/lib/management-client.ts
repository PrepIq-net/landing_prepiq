/**
 * Browser-safe management API client.
 * Calls /api/mgmt/* (Next.js proxy) which validates the session and
 * injects the service key before forwarding to Django.
 */

export class MgmtApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "MgmtApiError";
  }
}

export async function mgmtFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `/api/mgmt${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new MgmtApiError(res.status, `Management API ${res.status}: ${body}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
