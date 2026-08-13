"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import type { BlogPostSummary } from "@/types/blog";
import type { PlanCatalogByLang } from "@/lib/plans";
import type { PublishedTestimonial } from "@/lib/data";

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

// Map of components that need ssr: false
const COMPONENTS: Record<string, any> = {
  HeroSection: dynamic(() => import("./HeroSection")),
  OperationsSection: dynamic(() => import("./OperationsSection")),
  PageHeaderSection: dynamic(() => import("./PageHeaderSection")),
  ExploreSection: dynamic(() => import("./ExploreSection")),
  IntegrationsSection: dynamic(() => import("./IntegrationsSection")),
  CostOfGuessingSection: dynamic(() => import("./CostOfGuessingSection")),
  KitchenCalculatorTeaserSection: dynamic(() => import("./KitchenCalculatorTeaserSection")),
  HowItWorksSection: dynamic(() => import("./HowItWorksSection")),
  IntelligenceSection: dynamic(() => import("./IntelligenceSection")),
  BuiltForScaleSection: dynamic(() => import("./BuiltForScaleSection"), { ssr: false }),
  TestimonialsSection: dynamic(() => import("./TestimonialsSection")),
  PricingSection: dynamic(() => import("./PricingSection")),
  FAQSection: dynamic(() => import("./FAQSection")),
  ContactSection: dynamic(() => import("./ContactSection")),
  FinalCTASection: dynamic(() => import("./FinalCTASection")),
  BlogTeaserSection: dynamic(() => import("./BlogTeaserSection")),
};

// Sections whose copy is CMS-managed but whose data comes from elsewhere in the
// database. The page fetches the rows server-side and they are handed through
// here, since this renderer is a client component.
const DATA_PROP: Record<string, string> = {
  BlogTeaserSection: "posts",
  PricingSection: "catalog",
  TestimonialsSection: "testimonials",
};

interface DynamicSectionRendererProps {
  sections: {
    id: string;
    componentType: string;
    contentJson: any;
  }[];
  featuredPosts?: BlogPostSummary[];
  /** Live plan catalog from the backend; PricingSection falls back if absent. */
  planCatalog?: PlanCatalogByLang | null;
  /** Published testimonials; empty until real customers give us quotes. */
  testimonials?: PublishedTestimonial[];
}

export default function DynamicSectionRenderer({
  sections,
  featuredPosts,
  planCatalog,
  testimonials,
}: DynamicSectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const Component = COMPONENTS[section.componentType];
        if (!Component) return null;

        const content = typeof section.contentJson === 'string'
          ? JSON.parse(section.contentJson)
          : section.contentJson;

        const dataProp = DATA_PROP[section.componentType];
        const DATA_VALUES: Record<string, unknown> = {
          posts: featuredPosts,
          catalog: planCatalog,
          testimonials,
        };
        const extraProps = dataProp ? { [dataProp]: DATA_VALUES[dataProp] } : {};

        return (
          <Suspense key={section.id} fallback={<SectionFallback />}>
            <Component dbContent={content} {...extraProps} />
          </Suspense>
        );
      })}
    </>
  );
}
