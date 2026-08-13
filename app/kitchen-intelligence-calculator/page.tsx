import { Suspense, lazy } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import Navbar from "@/components/landing/Navbar";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";
import { KitchenCalculatorHero } from "@/components/kitchen-calculator/KitchenCalculatorHero";
import { KitchenCalculatorWizard } from "@/components/kitchen-calculator/KitchenCalculatorWizard";
import { KitchenCalculatorPromoSection } from "@/components/kitchen-calculator/KitchenCalculatorPromoSection";
import { getActiveNavLinks, getActiveFooterLinks } from "@/lib/data";

const Footer = lazy(() => import("@/components/landing/Footer"));

const PATH = "/kitchen-intelligence-calculator";
const TITLE = "Kitchen Intelligence Calculator — Estimate Your Operational Exposure | PrepIQ";
const DESCRIPTION =
  "Answer a few questions about your restaurant operation and get an estimated Kitchen Intelligence Snapshot — operational exposure, forecast uncertainty and a maturity score, based on industry operating assumptions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: "Kitchen Intelligence Calculator",
    description: DESCRIPTION,
    type: "website",
    url: PATH,
    siteName: "PrepIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Intelligence Calculator",
    description: DESCRIPTION,
  },
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PrepIQ Kitchen Intelligence Calculator",
  url: `${SITE_URL}${PATH}`,
  description: DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", name: "PrepIQ", url: SITE_URL },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Kitchen Intelligence Calculator", item: `${SITE_URL}${PATH}` },
  ],
};

export default async function KitchenIntelligenceCalculatorPage() {
  const [navLinks, footerLinks] = await Promise.all([
    getActiveNavLinks(),
    getActiveFooterLinks(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <ConciergeWidget />

      <main>
        <KitchenCalculatorHero />
        <section className="section-container pt-2 pb-24 md:pt-4 md:pb-32">
          <KitchenCalculatorWizard />
        </section>
        <KitchenCalculatorPromoSection />
      </main>

      <Suspense fallback={null}>
        <Footer links={footerLinks} />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
