import { Suspense, lazy } from "react";
import Navbar from "@/components/landing/Navbar";
import {
  getPageWithSections,
  getActiveNavLinks,
  getActiveFooterLinks,
  getFeaturedBlogPosts,
  getPublishedTestimonials,
} from "@/lib/data";
import { getPublicPlanCatalogs } from "@/lib/plans";
import DynamicSectionRenderer from "@/components/landing/DynamicSectionRenderer";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";
import CookieConsent from "@/components/CookieConsent";

const Footer = lazy(() => import("@/components/landing/Footer"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

export default async function Page() {
  const [page, navLinks, footerLinks, featuredPosts, testimonials] =
    await Promise.all([
      getPageWithSections("home"),
      getActiveNavLinks(),
      getActiveFooterLinks(),
      getFeaturedBlogPosts(3),
      getPublishedTestimonials(),
    ]);

  if (!page) return <div>Page not found</div>;

  const config = typeof page.configJson === 'string' ? JSON.parse(page.configJson || "{}") : (page.configJson || {});
  const maxWidth = config.maxWidth || "1440px";

  const hasPricingSection = page.sections.some(
    (section) => section.componentType === "PricingSection",
  );
  const planCatalog = hasPricingSection ? await getPublicPlanCatalogs() : null;

  return (
    <div className="min-h-screen bg-background" style={{ "--max-width": maxWidth } as React.CSSProperties}>
      <Navbar links={navLinks} />
      <ConciergeWidget />
      <CookieConsent />

      <DynamicSectionRenderer
        sections={page.sections}
        featuredPosts={featuredPosts}
        planCatalog={planCatalog}
        testimonials={testimonials}
      />

      <Suspense fallback={<SectionFallback />}>
        <Footer links={footerLinks} />
      </Suspense>
    </div>
  );
}
