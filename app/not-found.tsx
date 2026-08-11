"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  Cutlery,
  GraphUp,
  Home as HomeIcon,
  Journal,
  NavArrowRight,
} from "iconoir-react";
import { Button } from "@/components/ui/button";

/**
 * Deterministic 4-digit "order number" derived from the missed route, so the
 * ticket reads as if it were actually cut for this request rather than a
 * random prop. Pure function of `path` — identical on server and client, so
 * it never causes a hydration mismatch.
 */
const ticketNumberFromPath = (path: string): string => {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = (hash * 31 + path.charCodeAt(i)) >>> 0;
  }
  return String((hash % 9000) + 1000);
};

const SUGGESTIONS = [
  { key: "home", href: "/", Icon: HomeIcon },
  { key: "forecast", href: "/#intelligence", Icon: GraphUp },
  { key: "howItWorks", href: "/how-it-works", Icon: ClipboardCheck },
  { key: "pricing", href: "/pricing", Icon: Cutlery },
  { key: "blog", href: "/blog", Icon: Journal },
] as const;

const NotFound = () => {
  const { t } = useTranslation();
  const pathname = usePathname() || "/";
  const reducedMotion = useReducedMotion();
  const ticketNumber = useMemo(() => ticketNumberFromPath(pathname), [pathname]);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="pattern-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16 sm:py-24">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* ── Ticket head: barcode, order meta, headline, stamp ── */}
        <div className="relative overflow-hidden rounded-t-xl border border-b-0 border-border bg-card px-6 pt-6 shadow-l2 sm:px-8 sm:pt-8">
          <div
            aria-hidden
            className="mb-5 h-5 w-full"
            style={{
              background:
                "repeating-linear-gradient(90deg, hsl(var(--foreground)) 0 2px, transparent 2px 5px)",
              opacity: 0.16,
            }}
          />

          <div className="mb-6 flex items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="shrink-0">
              {t("notFound.ticketLabel")} · #{ticketNumber}
            </span>
            <span className="truncate text-right" title={pathname}>
              {t("notFound.route")}: {pathname}
            </span>
          </div>

          <motion.div
            aria-hidden
            initial={reducedMotion ? false : { opacity: 0, scale: 1.3, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.25 }}
            style={{ transform: "rotate(-8deg)" }}
            className="pointer-events-none absolute right-4 top-16 select-none rounded-md border-[3px] border-destructive px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-widest text-destructive sm:right-7 sm:top-[4.75rem] sm:text-sm"
          >
            {t("notFound.stamp")}
          </motion.div>

          <div className="mb-4 max-w-[70%] sm:max-w-[65%]">
            <h1 className="text-5xl font-extrabold leading-none sm:text-6xl">
              {t("notFound.headline")}
            </h1>
            <p className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
              {t("notFound.headlineSuffix")}
            </p>
          </div>

          <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("notFound.subtitle")}
          </p>
        </div>

        {/* ── Tear line between headline and line items ── */}
        <div className="border-x border-border bg-card px-6 sm:px-8">
          <div className="border-t border-dashed border-border" />
        </div>

        {/* ── "Today's Special" — quick links styled as order lines ── */}
        <div className="border-x border-border bg-card px-6 py-6 sm:px-8">
          <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
            {t("notFound.suggestionsTitle")}
          </p>
          <p className="mb-3 text-xs text-muted-foreground">{t("notFound.suggestionsSubtitle")}</p>

          <ul>
            {SUGGESTIONS.map(({ key, href, Icon }, i) => (
              <motion.li
                key={key}
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.15 + i * 0.05 }}
              >
                <a
                  href={href}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-foreground/90 transition-colors duration-200 hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                  <span className="font-mono">{t(`notFound.suggestions.${key}`)}</span>
                  <span
                    aria-hidden
                    className="mx-1 h-px flex-1 translate-y-[-2px] border-b border-dotted border-border"
                  />
                  <NavArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ── Perforated tear-off edge ── */}
        <div
          aria-hidden
          className="h-4 border-x border-border bg-card"
          style={{
            WebkitMaskImage: "radial-gradient(circle at 10px 0, transparent 9px, black 9.5px)",
            maskImage: "radial-gradient(circle at 10px 0, transparent 9px, black 9.5px)",
            WebkitMaskSize: "20px 20px",
            maskSize: "20px 20px",
            WebkitMaskRepeat: "repeat-x",
            maskRepeat: "repeat-x",
          }}
        />

        {/* ── CTA ── */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Button asChild variant="hero" size="lg">
            <a href="/">
              {t("notFound.cta")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-xs text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
          >
            {t("notFound.goBack")}
          </button>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            {t("notFound.footerNote")}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
