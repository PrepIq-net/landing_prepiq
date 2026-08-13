import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { I18nProviderWrapper } from "./I18nProviderWrapper";
import { PageShell } from "@/components/PageShell";
import Navbar from "@/components/landing/Navbar";
import { getActiveNavLinks } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";
import { getPublicPlanCatalog } from "@/lib/plans";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the layout viewport (and therefore `dvh`) shrink when the on-screen
  // keyboard opens, so fixed-bottom UI stays above it instead of behind it.
  interactiveWidget: "resizes-content",
};

const TITLE = "PrepIQ — Daily Prep Intelligence for Kitchens";
const DESCRIPTION =
  "PrepIQ predicts what your kitchen will sell today and tells you exactly how much to prepare. Reduce waste, avoid stockouts, protect margins.";
const SOCIAL_DESCRIPTION =
  "AI-powered demand forecasting that tells your kitchen exactly what to prep. Reduce waste by up to 40% and never 86 a dish again.";

export const metadata: Metadata = {
  // Resolves every relative URL below (and in child routes) to an absolute one.
  // Social and AI crawlers reject relative og:image values.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Child routes supply only their own name; "— PrepIQ" is appended here.
    template: "%s — PrepIQ",
  },
  description: DESCRIPTION,
  applicationName: "PrepIQ",
  authors: [{ name: "PrepIQ" }],
  creator: "PrepIQ",
  publisher: "PrepIQ",
  category: "technology",
  keywords: [
    "kitchen demand forecasting",
    "restaurant prep planning software",
    "food waste reduction software",
    "restaurant production planning",
    "commercial kitchen management",
    "AI restaurant forecasting",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets Google use full-length text snippets, large image previews and
      // full video previews instead of its conservative defaults.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "PrepIQ",
    locale: "en_US",
    // og:image comes from the app/opengraph-image.png file convention.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/**
 * Published prices, straight from the backend catalog so structured data can
 * never drift from what /pricing shows. Falls back to the seeded list if the
 * backend is unreachable — omitting offers entirely would lose the rich result.
 */
const FALLBACK_OFFERS = [
  { name: "Core", price: "49" },
  { name: "Intelligence", price: "149" },
  { name: "Command", price: "349" },
];

async function buildOffers() {
  const catalog = await getPublicPlanCatalog("en");
  const source =
    catalog?.plans?.map((plan) => ({
      name: plan.name,
      // Schema.org wants a bare decimal, not "49.00 USD".
      price: String(Number.parseFloat(plan.monthly_price)),
    })) ?? FALLBACK_OFFERS;

  return source.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    price: offer.price,
    priceCurrency: catalog?.currency ?? "USD",
    url: `${SITE_URL}/pricing`,
    // Each offer buys one kitchen branch, not an org-wide licence.
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      value: 1,
      unitText: "kitchen branch",
    },
  }));
}

// One @graph so Organization, WebSite and the product entity are linked by @id
// rather than parsed as three unrelated blobs.
const buildJsonLd = (offers: unknown[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PrepIQ",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/dark-main-transparent.png`,
      },
      description:
        "Operational intelligence for professional kitchens — demand forecasting, production planning and waste reduction.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PrepIQ",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "PrepIQ",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Restaurant Management Software",
      description:
        "AI-powered daily prep intelligence for commercial kitchens. Predicts demand, reduces waste, and protects margins.",
      operatingSystem: "Web",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers,
    },
  ],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = buildJsonLd(await buildOffers());
  const navLinks = await getActiveNavLinks();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Plain <script>, not next/script: JSON-LD must be in the initial HTML
            response. next/script defers injection to the client, so crawlers
            that do not execute JS see no structured data at all. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <I18nProviderWrapper>
          <Providers>
            {/* The navbar lives outside PageShell's transform: a transformed
                ancestor becomes the containing block for `fixed` descendants,
                which would let the bar scroll away with the page. Here it is
                pinned to the viewport, and the menu sheet (portaled to body,
                z-[70]) covers it while the menu is open. */}
            <Navbar links={navLinks} />
            <PageShell>{children}</PageShell>
          </Providers>
        </I18nProviderWrapper>
      </body>
    </html>
  );
}
