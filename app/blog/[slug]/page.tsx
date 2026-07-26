import { Suspense, lazy } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import PostDetailContent from "@/components/blog/PostDetailContent";
import { SITE_URL } from "@/lib/constants";
import {
  getPublishedBlogPost,
  getPublishedBlogPosts,
  getRelatedBlogPosts,
  getActiveNavLinks,
  getActiveFooterLinks,
} from "@/lib/data";

const Footer = lazy(() => import("@/components/landing/Footer"));

// Published posts are pre-rendered at build time; anything published later is
// generated on first request and cached under the "blog" tag.
export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: { absolute: "Article not found — PrepIQ" } };

  const title = post.seoTitle ?? `${post.titleEn} — PrepIQ`;
  const description = post.seoDescription ?? post.excerptEn;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    // `absolute` bypasses the root title template so an admin-authored seoTitle
    // is used verbatim rather than gaining a second "— PrepIQ".
    title: { absolute: title },
    description,
    keywords: post.tags,
    authors: [{ name: post.authorName }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "PrepIQ",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      tags: post.tags,
      ...(post.coverUrl
        ? { images: [{ url: post.coverUrl, alt: post.coverAlt ?? post.titleEn }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  const [related, navLinks, footerLinks] = await Promise.all([
    getRelatedBlogPosts(post.slug, post.category),
    getActiveNavLinks(),
    getActiveFooterLinks(),
  ]);

  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titleEn,
    description: post.excerptEn,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    wordCount: post.bodyEn.split(/\s+/).filter(Boolean).length,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "en",
    author: {
      "@type": post.authorName === "PrepIQ Team" ? "Organization" : "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "PrepIQ",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/golden-main-transparent.png`,
      },
    },
    ...(post.coverUrl ? { image: [post.coverUrl] } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.titleEn, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <PostDetailContent post={post} related={related} url={url} />
      <Suspense fallback={null}>
        <Footer links={footerLinks} />
      </Suspense>
      {/* Plain <script>: next/script injects on the client, so this markup
          would be absent from the server-rendered HTML crawlers parse. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
