import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  destroySupportAttachment,
  uploadSupportAttachment,
  type UploadedAttachment,
} from "@/lib/cloudinary";
import {
  isAuthorizedSupportCall,
  supportReference,
  unauthorizedResponse,
} from "../auth";

export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_PREFIXES = ["image/"];
const ALLOWED_MIME_EXACT = [
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
];

const optional = (max: number) =>
  z
    .string()
    .max(max)
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullish();

const RequestSchema = z.object({
  type: z.enum(["BUG", "FEATURE_REQUEST", "INQUIRY", "FEEDBACK"]),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(10000),
  contactEmail: z
    .string()
    .trim()
    .email()
    .max(320)
    .nullish()
    .or(z.literal("").transform(() => null)),
  reporterEmail: z.string().trim().email().max(320),
  reporterName: optional(200),
  reporterUserId: optional(100),
  reporterRole: optional(100),
  organizationId: optional(100),
  organizationName: optional(300),
  branchId: optional(100),
  branchName: optional(300),
  sourceApp: z.string().trim().min(1).max(50).default("web_dashboard"),
  appVersion: optional(50),
  currentUrl: optional(1000),
  userAgent: optional(1000),
  locale: optional(10),
});

function isAllowedFile(file: File): boolean {
  return (
    ALLOWED_MIME_PREFIXES.some((p) => file.type.startsWith(p)) ||
    ALLOWED_MIME_EXACT.includes(file.type)
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedSupportCall(request)) return unauthorizedResponse();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") fields[key] = value;
  }

  const parsed = RequestSchema.safeParse(fields);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const files = formData
    .getAll("attachments")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length > MAX_FILES) {
    return Response.json(
      { error: `At most ${MAX_FILES} attachments are allowed` },
      { status: 400 }
    );
  }
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return Response.json(
        { error: `"${file.name}" exceeds the 5 MB attachment limit` },
        { status: 400 }
      );
    }
    if (!isAllowedFile(file)) {
      return Response.json(
        { error: `"${file.name}" has an unsupported file type (${file.type || "unknown"})` },
        { status: 400 }
      );
    }
  }

  let uploaded: UploadedAttachment[] = [];
  try {
    uploaded = await Promise.all(files.map(uploadSupportAttachment));
  } catch (error) {
    console.error("[support] attachment upload failed", error);
    // Best-effort cleanup of any assets that did make it up.
    await Promise.allSettled(
      uploaded.map((a) => destroySupportAttachment(a.publicId, a.resourceType))
    );
    return Response.json({ error: "Attachment upload failed" }, { status: 502 });
  }

  try {
    const created = await prisma.supportRequest.create({
      data: {
        ...parsed.data,
        attachments: {
          create: uploaded.map((a) => ({
            publicId: a.publicId,
            resourceType: a.resourceType,
            url: a.url,
            filename: a.filename,
            format: a.format,
            bytes: a.bytes,
          })),
        },
      },
      select: { id: true, refNo: true },
    });

    return Response.json(
      { id: created.id, reference: supportReference(created.refNo) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[support] request create failed", error);
    // Don't strand cloud assets if the DB write failed.
    await Promise.allSettled(
      uploaded.map((a) => destroySupportAttachment(a.publicId, a.resourceType))
    );
    return Response.json({ error: "Could not record the request" }, { status: 500 });
  }
}
