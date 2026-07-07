import { Suspense, lazy } from "react";
import Navbar from "@/components/landing/Navbar";
import { getPageWithSections, getActiveNavLinks, getActiveFooterLinks } from "@/lib/data";
import DynamicSectionRenderer from "@/components/landing/DynamicSectionRenderer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const Footer = lazy(() => import("@/components/landing/Footer"));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageWithSections(slug);
  if (!page) return {};
  return {
    title: `${page.titleEn} — PrepIQ`,
    description: page.metaDescriptionEn || undefined,
  };
}

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, navLinks, footerLinks] = await Promise.all([
    getPageWithSections(slug),
    getActiveNavLinks(),
    getActiveFooterLinks(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <ScrollToTop />
      <CookieConsent />

      <DynamicSectionRenderer sections={page.sections} />

      <Suspense fallback={<SectionFallback />}>
        <Footer links={footerLinks} />
      </Suspense>
    </div>
  );
}
