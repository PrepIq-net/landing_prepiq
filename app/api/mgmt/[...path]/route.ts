import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function proxyToDjango(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  // Validate session
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate admin role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, isActive: true },
  });
  if (!user || user.role !== "ADMIN" || !user.isActive) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const djangoBase = process.env.DJANGO_API_URL;
  const serviceKey = process.env.ADMIN_SERVICE_KEY;
  if (!djangoBase || !serviceKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { path } = await context.params;
  const search = req.nextUrl.search;
  const djangoUrl = `${djangoBase}/api/mgmt/${path.join("/")}/${search}`;

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  let djangoRes: Response;
  try {
    djangoRes = await fetch(djangoUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Service-Key": serviceKey,
        "X-Admin-Email": session.user.email,
      },
      body,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach backend" },
      { status: 502 },
    );
  }

  const responseBody = await djangoRes.text();
  return new NextResponse(responseBody, {
    status: djangoRes.status,
    headers: {
      "Content-Type":
        djangoRes.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export const GET = proxyToDjango;
export const POST = proxyToDjango;
export const PATCH = proxyToDjango;
export const PUT = proxyToDjango;
export const DELETE = proxyToDjango;
