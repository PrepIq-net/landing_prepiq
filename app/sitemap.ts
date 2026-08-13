import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPublishedBlogPosts, getPublishedJobRoles } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, roles] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedJobRoles(),
  ]);

  // Google ignores <priority> and <changefreq> entirely; <lastmod> is the only
  // hint it still acts on, so every entry carries one.
  const now = new Date();
  const newestPost = posts.reduce<Date | undefined>((latest, post) => {
    const published = post.publishedAt ? new Date(post.publishedAt) : undefined;
    return published && (!latest || published > latest) ? published : latest;
  }, undefined);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/kitchen-intelligence-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastModified: newestPost ?? now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/security`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...roles.map((role) => ({
      url: `${SITE_URL}/careers/${role.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
