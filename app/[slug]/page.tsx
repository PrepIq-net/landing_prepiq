import { Suspense, lazy } from "react";
import { getPageWithSections, getActiveFooterLinks } from "@/lib/data";
import { getPublicPlanCatalogs } from "@/lib/plans";
import DynamicSectionRenderer from "@/components/landing/DynamicSectionRenderer";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";
import CookieConsent from "@/components/CookieConsent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const Footer = lazy(() => import("@/components/landing/Footer"));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageWithSections(slug);
  if (!page) return {};

  const title = `${page.titleEn} — PrepIQ`;
  const description = page.metaDescriptionEn || undefined;
  const url = `/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "PrepIQ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, footerLinks] = await Promise.all([
    getPageWithSections(slug),
    getActiveFooterLinks(),
  ]);

  if (!page) {
    notFound();
  }

  // Only pay for the pricing fetch on pages that actually render prices
  // (/pricing today, but keyed off the section so any page works).
  const hasPricingSection = page.sections.some(
    (section) => section.componentType === "PricingSection",
  );
  const planCatalog = hasPricingSection ? await getPublicPlanCatalogs() : null;

  return (
    <div className="min-h-screen bg-background">
      <ConciergeWidget />
      <CookieConsent />

      <DynamicSectionRenderer sections={page.sections} planCatalog={planCatalog} />

      <Suspense fallback={<SectionFallback />}>
        <Footer links={footerLinks} />
      </Suspense>
    </div>
  );
}
