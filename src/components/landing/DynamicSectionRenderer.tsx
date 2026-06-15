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
  IntegrationsSection: dynamic(() => import("./IntegrationsSection")),
  KitchenTestSection: dynamic(() => import("./KitchenTestSection")),
  AIThinkingSection: dynamic(() => import("./AIThinkingSection")),
  WhyPrepIQSection: dynamic(() => import("./WhyPrepIQSection")),
  ProblemSection: dynamic(() => import("./ProblemSection")),
  WhyNowSection: dynamic(() => import("./WhyNowSection")),
  HowItWorksSection: dynamic(() => import("./HowItWorksSection")),
  IntelligenceSection: dynamic(() => import("./IntelligenceSection")),
  MarginGuardSection: dynamic(() => import("./MarginGuardSection")),
  ValueSection: dynamic(() => import("./ValueSection")),
  WhoItsForSection: dynamic(() => import("./WhoItsForSection")),
  InteractiveDemoSection: dynamic(() => import("./InteractiveDemoSection")),
  MultiBranchSection: dynamic(() => import("./MultiBranchSection"), { ssr: false }),
  KitchenNetworkSection: dynamic(() => import("./KitchenNetworkSection")),
  GlobalReadySection: dynamic(() => import("./GlobalReadySection")),
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
    contentJson: string;
  }[];
}

export default function DynamicSectionRenderer({ sections }: DynamicSectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const Component = COMPONENTS[section.componentType];
        if (!Component) return null;

        let content = {};
        try {
          content = JSON.parse(section.contentJson);
        } catch (e) {
          console.error(`Failed to parse JSON for section ${section.id}`, e);
        }

        return (
          <Suspense key={section.id} fallback={<SectionFallback />}>
            <Component dbContent={content} />
          </Suspense>
        );
      })}
    </>
  );
}
