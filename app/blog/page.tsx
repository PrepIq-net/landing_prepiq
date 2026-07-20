import { Suspense, lazy } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/landing/Navbar";
import BlogIndexContent from "@/components/blog/BlogIndexContent";
import { SITE_URL } from "@/lib/constants";
import {
  getPublishedBlogPosts,
  getActiveNavLinks,
  getActiveFooterLinks,
} from "@/lib/data";

const Footer = lazy(() => import("@/components/landing/Footer"));

const TITLE = "Blog — Kitchen operations, forecasting and food waste | PrepIQ";
const DESCRIPTION =
  "Practical guidance for restaurant owners and kitchen managers on reducing food waste, planning daily prep, and getting more out of the systems you already run.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "restaurant food waste",
    "kitchen prep planning",
    "demand forecasting restaurants",
    "restaurant operations",
    "POS data",
  ],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: "PrepIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function BlogIndexPage() {
  const [posts, navLinks, footerLinks] = await Promise.all([
    getPublishedBlogPosts(),
    getActiveNavLinks(),
    getActiveFooterLinks(),
  ]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "PrepIQ Blog",
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "PrepIQ",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/golden-main-transparent.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.titleEn,
      description: post.excerptEn,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: { "@type": "Organization", name: post.authorName },
      ...(post.coverUrl ? { image: post.coverUrl } : {}),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <BlogIndexContent posts={posts} />
      <Suspense fallback={null}>
        <Footer links={footerLinks} />
      </Suspense>
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
    </div>
  );
}
