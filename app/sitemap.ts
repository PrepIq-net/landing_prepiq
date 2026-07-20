import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPublishedBlogPosts, getPublishedJobRoles } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, roles] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedJobRoles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/security`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...roles.map((role) => ({
      url: `${SITE_URL}/careers/${role.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
