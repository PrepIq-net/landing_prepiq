import { Suspense, lazy } from "react";
import Navbar from "@/components/landing/Navbar";
import { getPageWithSections, getActiveNavLinks, getActiveFooterLinks } from "@/lib/data";
import DynamicSectionRenderer from "@/components/landing/DynamicSectionRenderer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";

const Footer = lazy(() => import("@/components/landing/Footer"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
  </div>
);

export default async function Page() {
  const [page, navLinks, footerLinks] = await Promise.all([
    getPageWithSections("home"),
    getActiveNavLinks(),
    getActiveFooterLinks(),
  ]);

  if (!page) return <div>Page not found</div>;

  const config = JSON.parse(page.configJson || "{}");
  const maxWidth = config.maxWidth || "1440px";

  return (
    <div className="min-h-screen bg-background" style={{ "--max-width": maxWidth } as React.CSSProperties}>
      <Navbar links={navLinks} />
      <ScrollToTop />
      <CookieConsent />

      <DynamicSectionRenderer sections={page.sections} />

      <Suspense fallback={<SectionFallback />}>
        <Footer links={footerLinks} />
      </Suspense>
    </div>
  );
}
