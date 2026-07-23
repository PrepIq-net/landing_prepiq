/**
 * Server-only helper for calling the Django concierge API.
 * Import only from Route Handlers — reads CONCIERGE_SERVICE_KEY from env.
 */

export interface ConciergeChatPayload {
  messages: { role: "user" | "assistant"; content: string }[];
  context: string;
  locale: "en" | "fr";
}

export interface ConciergeChatResult {
  reply: string;
  meta: {
    provider: string;
    model: string;
    usage: { tokens_in: number | null; tokens_out: number | null } | null;
  };
}

export async function conciergeChatFetch(
  payload: ConciergeChatPayload
): Promise<ConciergeChatResult> {
  const base = process.env.DJANGO_API_URL;
  if (!base) throw new Error("DJANGO_API_URL is not configured");

  const serviceKey = process.env.CONCIERGE_SERVICE_KEY;
  if (!serviceKey) throw new Error("CONCIERGE_SERVICE_KEY is not configured");

  const res = await fetch(`${base}/api/concierge/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Concierge-Key": serviceKey,
    },
    body: JSON.stringify(payload),
    // The LLM turn is slow by nature; NVIDIA retries can stack. Cap well below
    // the platform's route timeout but far above a normal completion.
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Concierge API ${res.status}: ${body}`);
  }

  return res.json() as Promise<ConciergeChatResult>;
}
