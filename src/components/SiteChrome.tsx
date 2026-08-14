"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import CookieConsent from "@/components/CookieConsent";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";

interface NavLink {
  id: string;
  labelEn: string;
  labelFr: string;
  url: string;
  descriptionEn: string | null;
  descriptionFr: string | null;
}

/**
 * The marketing chrome — navbar, cookie banner, sales concierge — rendered
 * from the root layout so every public page gets it "for free". `/admin` is
 * a separate sidebar-based app with no header of its own; the navbar is
 * `fixed` at `z-[60]` and the sheet menu portals to `z-[70]`, so without
 * this gate they'd sit on top of the admin's own controls, and admin buttons
 * anywhere in that top strip would be unreachable. None of this chrome
 * belongs on an internal dashboard anyway (the cookie banner and sales
 * chatbot are for site visitors, not logged-in staff).
 */
export function SiteChrome({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Navbar links={links} />
      <CookieConsent />
      <ConciergeWidget />
    </>
  );
}
