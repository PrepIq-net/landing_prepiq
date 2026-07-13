"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LegalMarkdown from "./LegalMarkdown";

export interface LegalDocumentPayload {
  slug: string;
  titleEn: string;
  titleFr: string;
  bodyEn: string;
  bodyFr: string;
  version: number;
  effectiveDate: string; // ISO
}

export default function LegalPageContent({
  doc,
}: {
  doc: LegalDocumentPayload;
}) {
  const { t, i18n } = useTranslation();
  const isFr = i18n.resolvedLanguage === "fr";

  const formattedDate = new Intl.DateTimeFormat(isFr ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(doc.effectiveDate));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="section-container flex items-center justify-between py-5">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="transition-all duration-300 h-10 w-10">
                <Image
                  src="/logo/golden-main-transparent.png"
                  alt="PrepIQ Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-lg font-semibold text-foreground">
                PrepIQ
              </span>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </div>
      </header>

      <main className="section-container py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
          {isFr ? doc.titleFr : doc.titleEn}
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          {t("common.lastUpdated", { date: formattedDate })}
        </p>

        <LegalMarkdown body={isFr ? doc.bodyFr : doc.bodyEn} />
      </main>
    </div>
  );
}
