import { Suspense, lazy } from "react";
import {
  getPageWithSections,
  getActiveFooterLinks,
  getFeaturedBlogPosts,
  getPublishedTestimonials,
} from "@/lib/data";
import { getPublicPlanCatalogs } from "@/lib/plans";
import { getEffectiveFaqItems } from "@/lib/faq";
import { SITE_URL } from "@/lib/constants";
import DynamicSectionRenderer from "@/components/landing/DynamicSectionRenderer";

const Footer = lazy(() => import("@/components/landing/Footer"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

export default async function Page() {
  const [page, footerLinks, featuredPosts, testimonials] =
    await Promise.all([
      getPageWithSections("home"),
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

  // FAQPage schema must mirror the questions the FAQSection actually renders.
  // Same CMS-override rule, same fallback, English — the language a crawler
  // without the i18n cookie receives.
  const faqSection = page.sections.find(
    (section) => section.componentType === "FAQSection",
  );
  const faqDbContent =
    typeof faqSection?.contentJson === "string"
      ? JSON.parse(faqSection.contentJson)
      : faqSection?.contentJson;
  const faqItems = getEffectiveFaqItems(faqDbContent, "en");
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqItems.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background" style={{ "--max-width": maxWidth } as React.CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
