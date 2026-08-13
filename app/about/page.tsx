import { Suspense, lazy } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import Principles from "@/components/about/Principles";
import CareersSection from "@/components/about/CareersSection";
import FutureVision from "@/components/about/FutureVision";
import {
  getActiveFooterLinks,
  getPublishedJobRoles,
} from "@/lib/data";

const Footer = lazy(() => import("@/components/landing/Footer"));

export const metadata: Metadata = {
  title: "About — Operational Intelligence for Professional Kitchens",
  description:
    "PrepIQ is the operational intelligence layer for restaurants and hotels — forecasting, production planning, inventory intelligence and real-time insights that help kitchens waste less and prepare smarter.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About PrepIQ",
    description:
      "Building the operational intelligence layer for professional kitchens.",
    type: "website",
    url: "/about",
    siteName: "PrepIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "About PrepIQ",
    description:
      "Building the operational intelligence layer for professional kitchens.",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PrepIQ",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/golden-main-transparent.png`,
  description:
    "Operational intelligence for professional kitchens — forecasting, production planning, inventory intelligence and real-time operational insights.",
  foundingLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressCountry: "UG" },
  },
  email: "careers@prepiq.net",
};

export default async function AboutPage() {
  const [footerLinks, roles] = await Promise.all([
    getActiveFooterLinks(),
    getPublishedJobRoles(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <ConciergeWidget />

      <main>
        <AboutHero />
        <OurStory />
        <Principles />
        <CareersSection roles={roles} />
        <FutureVision />
      </main>

      <Suspense fallback={null}>
        <Footer links={footerLinks} />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </div>
  );
}
