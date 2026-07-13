import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedLegalDocument } from "@/lib/data";
import LegalPageContent from "./LegalPageContent";

export async function legalPageMetadata(slug: string): Promise<Metadata> {
  const doc = await getPublishedLegalDocument(slug);
  if (!doc) return {};
  return { title: `${doc.titleEn} — PrepIQ` };
}

export default async function LegalPage({ slug }: { slug: string }) {
  const doc = await getPublishedLegalDocument(slug);
  if (!doc) notFound();

  return (
    <LegalPageContent
      doc={{
        slug: doc.slug,
        titleEn: doc.titleEn,
        titleFr: doc.titleFr,
        bodyEn: doc.bodyEn,
        bodyFr: doc.bodyFr,
        version: doc.version,
        effectiveDate: doc.effectiveDate,
      }}
    />
  );
}
