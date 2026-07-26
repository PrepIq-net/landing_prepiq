import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin console and internal APIs carry no public content. The "/*"
      // suffix is required: a bare "/admin" prefix-matches the path but leaves
      // some crawlers treating deeper segments inconsistently.
      disallow: ["/admin", "/admin/*", "/api", "/api/*"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
