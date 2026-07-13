import { NextRequest, NextResponse } from "next/server";
import { getPublishedLegalDocument } from "@/lib/data";
import { CORS_HEADERS, PUBLIC_CACHE_HEADERS } from "../headers";

type Locale = "en" | "fr";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const localeParam = req.nextUrl.searchParams.get("locale") ?? "en";
  if (localeParam !== "en" && localeParam !== "fr") {
    return NextResponse.json(
      { error: "Unsupported locale. Use 'en' or 'fr'." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  const locale: Locale = localeParam;

  const doc = await getPublishedLegalDocument(slug);
  if (!doc) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const etag = `"${doc.slug}-v${doc.version}-${locale}"`;
  const headers = { ...CORS_HEADERS, ...PUBLIC_CACHE_HEADERS, ETag: etag };

  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers });
  }

  return NextResponse.json(
    {
      slug: doc.slug,
      locale,
      title: locale === "fr" ? doc.titleFr : doc.titleEn,
      version: doc.version,
      effectiveDate: doc.effectiveDate,
      updatedAt: doc.updatedAt,
      format: "markdown",
      body: locale === "fr" ? doc.bodyFr : doc.bodyEn,
    },
    { headers }
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
