import { NextResponse } from "next/server";
import { getPublishedLegalDocuments } from "@/lib/data";
import { CORS_HEADERS, PUBLIC_CACHE_HEADERS } from "./headers";

// Public index of published legal documents. Consumed by the web dashboard
// and mobile app to check staleness cheaply before fetching full bodies.
export async function GET() {
  const docs = await getPublishedLegalDocuments();

  return NextResponse.json(
    {
      documents: docs.map((d) => ({
        slug: d.slug,
        title: { en: d.titleEn, fr: d.titleFr },
        version: d.version,
        effectiveDate: d.effectiveDate,
        updatedAt: d.updatedAt,
      })),
    },
    { headers: { ...CORS_HEADERS, ...PUBLIC_CACHE_HEADERS } }
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
