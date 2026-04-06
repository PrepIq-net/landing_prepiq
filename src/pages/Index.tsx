import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogoTickerSection from "@/components/landing/LogoTickerSection";

// Lazy load below-the-fold sections
const KitchenTestSection = lazy(() => import("@/components/landing/KitchenTestSection"));
const AIThinkingSection = lazy(() => import("@/components/landing/AIThinkingSection"));
const WhyPrepIQSection = lazy(() => import("@/components/landing/WhyPrepIQSection"));
const ProblemSection = lazy(() => import("@/components/landing/ProblemSection"));
const WhyNowSection = lazy(() => import("@/components/landing/WhyNowSection"));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection"));
const IntelligenceSection = lazy(() => import("@/components/landing/IntelligenceSection"));
const MarginGuardSection = lazy(() => import("@/components/landing/MarginGuardSection"));
const ValueSection = lazy(() => import("@/components/landing/ValueSection"));
const WhoItsForSection = lazy(() => import("@/components/landing/WhoItsForSection"));
const IntegrationsSection = lazy(() => import("@/components/landing/IntegrationsSection"));
const InteractiveDemoSection = lazy(() => import("@/components/landing/InteractiveDemoSection"));
const MultiBranchSection = lazy(() => import("@/components/landing/MultiBranchSection"));
const KitchenNetworkSection = lazy(() => import("@/components/landing/KitchenNetworkSection"));
const GlobalReadySection = lazy(() => import("@/components/landing/GlobalReadySection"));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection"));
const PricingSection = lazy(() => import("@/components/landing/PricingSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const ContactSection = lazy(() => import("@/components/landing/ContactSection"));
const FinalCTASection = lazy(() => import("@/components/landing/FinalCTASection"));
const Footer = lazy(() => import("@/components/landing/Footer"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      {/* <LogoTickerSection /> */}
      <Suspense fallback={<SectionFallback />}>
        <IntegrationsSection />
        <KitchenTestSection />
        <AIThinkingSection />
        <WhyPrepIQSection />
        <ProblemSection />
        <WhyNowSection />
        <HowItWorksSection />
        <IntelligenceSection />
        <MarginGuardSection />
        <ValueSection />
        <WhoItsForSection />
        <InteractiveDemoSection />
        <MultiBranchSection />
        <KitchenNetworkSection />
        <GlobalReadySection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
        <FinalCTASection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
