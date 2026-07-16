"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";

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
  HowItWorksSection: dynamic(() => import("./HowItWorksSection")),
  IntelligenceSection: dynamic(() => import("./IntelligenceSection")),
  ValueSection: dynamic(() => import("./ValueSection")),
  BuiltForScaleSection: dynamic(() => import("./BuiltForScaleSection"), { ssr: false }),
  TestimonialsSection: dynamic(() => import("./TestimonialsSection")),
  PricingSection: dynamic(() => import("./PricingSection")),
  FAQSection: dynamic(() => import("./FAQSection")),
  ContactSection: dynamic(() => import("./ContactSection")),
  FinalCTASection: dynamic(() => import("./FinalCTASection")),
};

interface DynamicSectionRendererProps {
  sections: {
    id: string;
    componentType: string;
    contentJson: any;
  }[];
}

export default function DynamicSectionRenderer({ sections }: DynamicSectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const Component = COMPONENTS[section.componentType];
        if (!Component) return null;

        const content = typeof section.contentJson === 'string'
          ? JSON.parse(section.contentJson)
          : section.contentJson;

        return (
          <Suspense key={section.id} fallback={<SectionFallback />}>
            <Component dbContent={content} />
          </Suspense>
        );
      })}
    </>
  );
}
