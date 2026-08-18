import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  isAuthorizedOpsAlertCall,
  opsAlertReference,
  unauthorizedResponse,
} from "./auth";

export const dynamic = "force-dynamic";

const optional = (max: number) =>
  z
    .string()
    .max(max)
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullish();

const RequestSchema = z.object({
  alertType: z.enum(["POS_SYNC_FAILED", "CONNECTOR_OFFLINE", "CSV_STALE"]),
  severity: z.enum(["INFO", "WARNING", "CRITICAL"]).default("WARNING"),

  organizationId: optional(100),
  organizationName: optional(300),
  branchId: optional(100),
  branchName: optional(300),

  // Null when the branch has no operating hours configured yet — the
  // backend can't say whether it was "open" if it doesn't know.
  branchWasOpen: z.boolean().nullish(),
  // { offset: true } because Django's datetime.isoformat() emits a numeric
  // UTC offset (+00:00 / +03:00), not a trailing "Z" — zod's datetime()
  // rejects that by default.
  branchLocalTime: z.string().datetime({ offset: true }).nullish(),

  // Diagnostics vary by alertType (connector id/provider/error, unmapped
  // count, days-without-upload, ...) — stored as-is, rendered as-is.
  payload: z.record(z.string(), z.unknown()).default({}),

  occurredAt: z.string().datetime({ offset: true }),
});

export async function POST(request: NextRequest) {
  if (!isAuthorizedOpsAlertCall(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { branchLocalTime, occurredAt, payload, ...rest } = parsed.data;

  try {
    const created = await prisma.opsAlert.create({
      data: {
        ...rest,
        payload: payload as Prisma.InputJsonValue,
        branchLocalTime: branchLocalTime ? new Date(branchLocalTime) : null,
        occurredAt: new Date(occurredAt),
      },
      select: { id: true, refNo: true },
    });

    return Response.json(
      { id: created.id, reference: opsAlertReference(created.refNo) },
      { status: 201 },
    );
  } catch (error) {
    console.error("[ops-alerts] create failed", error);
    return Response.json({ error: "Could not record the alert" }, { status: 500 });
  }
}
