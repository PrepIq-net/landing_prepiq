import { Suspense, lazy } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import RoleDetailContent from "@/components/careers/RoleDetailContent";
import {
  getPublishedJobRole,
  getActiveFooterLinks,
} from "@/lib/data";

const Footer = lazy(() => import("@/components/landing/Footer"));

const EMPLOYMENT_SCHEMA: Record<string, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = await getPublishedJobRole(slug);
  if (!role) return { title: "Role not found" };
  return {
    title: `${role.titleEn} — Careers`,
    description: role.summaryEn,
    alternates: { canonical: `${SITE_URL}/careers/${role.slug}` },
    openGraph: {
      title: `${role.titleEn} — Careers`,
      description: role.summaryEn,
      type: "website",
      url: `${SITE_URL}/careers/${role.slug}`,
      siteName: "PrepIQ",
    },
  };
}

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [role, footerLinks] = await Promise.all([
    getPublishedJobRole(slug),
    getActiveFooterLinks(),
  ]);

  if (!role) notFound();

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.titleEn,
    description: role.summaryEn,
    employmentType: EMPLOYMENT_SCHEMA[role.employmentType] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "PrepIQ",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/logo/golden-main-transparent.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: role.location },
    },
    industry: "Food Service / Restaurant Technology",
    directApply: true,
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleDetailContent role={role} />
      <Suspense fallback={null}>
        <Footer links={footerLinks} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
    </div>
  );
}
