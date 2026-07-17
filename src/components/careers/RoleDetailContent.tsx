"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Building, Clock } from "iconoir-react";
import CareerMarkdown from "./CareerMarkdown";
import ApplyForm from "./ApplyForm";
import type { EmploymentType } from "@/types/careers";

export interface RoleDetailPayload {
  id: string;
  slug: string;
  titleEn: string;
  titleFr: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  summaryEn: string;
  summaryFr: string;
  bodyEn: string;
  bodyFr: string;
}

export default function RoleDetailContent({ role }: { role: RoleDetailPayload }) {
  const { t, i18n } = useTranslation();
  const isFr = i18n.resolvedLanguage === "fr";

  const title = isFr ? role.titleFr : role.titleEn;
  const summary = isFr ? role.summaryFr : role.summaryEn;
  const body = isFr ? role.bodyFr : role.bodyEn;

  return (
    <main className="section-container max-w-3xl py-28 sm:py-32">
      <Link
        href="/about#careers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("careers.backToCareers")}
      </Link>

      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {t("careers.openRole")}
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {summary}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            {role.department}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {role.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-0.5">
            <Clock className="h-3.5 w-3.5" />
            {t(`careers.employmentType.${role.employmentType}`)}
          </span>
        </div>
      </div>

      <div className="my-10 border-t border-border/50" />

      <h2 className="mb-5 font-display text-xl font-semibold text-foreground">
        {t("careers.aboutRole")}
      </h2>
      <CareerMarkdown body={body} />

      <div className="mt-14" id="apply">
        <ApplyForm roleId={role.id} />
      </div>
    </main>
  );
}
