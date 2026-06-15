import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrepIQ — Daily Prep Intelligence for Kitchens",
  description: "PrepIQ predicts what your kitchen will sell today and tells you exactly how much to prepare. Reduce waste, avoid stockouts, protect margins.",
  authors: [{ name: "PrepIQ" }],
  alternates: {
    canonical: "https://prepiq.com",
  },
  openGraph: {
    title: "PrepIQ — Daily Prep Intelligence for Kitchens",
    description: "AI-powered demand forecasting that tells your kitchen exactly what to prep. Reduce waste by up to 40% and never 86 a dish again.",
    type: "website",
    url: "https://prepiq.com",
    images: ["/og-image.png"],
    siteName: "PrepIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepIQ — Daily Prep Intelligence for Kitchens",
    description: "AI-powered demand forecasting that tells your kitchen exactly what to prep. Reduce waste by up to 40%.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PrepIQ",
  "applicationCategory": "BusinessApplication",
  "description": "AI-powered daily prep intelligence for commercial kitchens. Predicts demand, reduces waste, and protects margins.",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "USD",
    "description": "Starting from $49/month per location"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
