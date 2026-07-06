/**
 * Server-only helper for calling the Django management API.
 * Import only from Server Components, Server Actions, or Route Handlers —
 * never from client components, as it reads ADMIN_SERVICE_KEY from env.
 */

export async function djangoAdminFetch<T = unknown>(
  path: string,
  callerEmail: string,
  init?: RequestInit,
): Promise<T> {
  const base = process.env.DJANGO_API_URL;
  if (!base) throw new Error('DJANGO_API_URL is not configured');

  const serviceKey = process.env.ADMIN_SERVICE_KEY;
  if (!serviceKey) throw new Error('ADMIN_SERVICE_KEY is not configured');

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Service-Key': serviceKey,
      'X-Admin-Email': callerEmail,
      ...(init?.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Django API ${res.status} for ${path}: ${body}`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as unknown as T;
  }

  return res.json() as Promise<T>;
}
