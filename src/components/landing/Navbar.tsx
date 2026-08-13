"use client";

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "iconoir-react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MenuBurgerIcon } from "@/components/landing/MenuBurgerIcon";
import { MENU_HEIGHT, setMenuOpenState, setMenuHeight } from "@/lib/menu-push";
import { APP_URL } from "@/lib/constants";

/**
 * One row class for both the navbar (logo left, burger right) and the menu
 * sheet's header (eyebrow left, close right). Sharing the exact string
 * guarantees the close glyph lands pixel-perfect on the burger's spot and
 * the eyebrow lines up with the logo — the click-to-open / click-to-close
 * contract depends on it.
 */
const ROW_CLASS =
  "mx-auto w-full max-w-[var(--max-width,1440px)] px-4 sm:px-6 md:px-8 lg:px-16";

/**
 * Two-phase choreography. Phase 1: the sheet descends from the top and the
 * page gives way (SLIDE_DURATION, gentle ease-out — fast enough to feel
 * instant on click, slow enough to never slam). Phase 2: only once the slide
 * has settled do the header, dishes and check reveal themselves with the
 * same calm ease — never both at once, which reads heavy.
 */
const SLIDE_DURATION = 0.4;
const SLIDE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const REVEAL_DURATION = 0.4;
const REVEAL_GAP = 0.07;

interface NavLink {
  id: string;
  labelEn: string;
  labelFr: string;
  url: string;
}

const Navbar = ({ links }: { links: NavLink[] }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage as "en" | "fr";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [burgerPhase, setBurgerPhase] = useState<"lines" | "burger" | "x">("lines");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(MENU_HEIGHT);
  const dishesRef = useRef<HTMLElement | null>(null);
  const checkRef = useRef<HTMLDivElement | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // The sheet is portaled to <body>, outside the page root that defines
  // --max-width. Copy the value onto body — refreshed on navigation too, so
  // a client-side route change to a page with a different max width cannot
  // desync the sheet's container from the navbar's.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[style*='--max-width']");
    const maxWidth = root?.style.getPropertyValue("--max-width");
    if (maxWidth) {
      document.body.style.setProperty("--max-width", maxWidth);
    }
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    setBurgerPhase("lines");
    setMenuOpenState(false);
  }, []);

  // The burger winks into its restaurant form on tap and stays that way —
  // it never folds into a close glyph. Closing is the sheet header's X,
  // Escape, or clicking the backdrop.
  const openMenu = useCallback(() => {
    setMobileOpen(true);
    setBurgerPhase("burger");
    setMenuOpenState(true);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // The menu is DB-driven, so its item count is unknown at build time. Fit
  // the sheet to its content at open: header + dishes + check, capped so the
  // pushed navbar below the sheet's edge stays fully on screen. Measuring in
  // a layout effect means the sheet enters already at its fitted height —
  // nothing animates twice. Re-measure on resize or content change.
  useLayoutEffect(() => {
    if (!mobileOpen) return;

    const fit = () => {
      const dishes = dishesRef.current;
      const check = checkRef.current;
      if (!dishes || !check) return;
      const header = scrolled ? 64 : 80;
      const natural = header + dishes.scrollHeight + check.offsetHeight;
      const fitted = Math.min(natural, window.innerHeight * 0.6);
      const next = `${fitted}px`;
      setSheetHeight(next);
      setMenuHeight(next);
    };

    fit();
    const ro = new ResizeObserver(fit);
    if (dishesRef.current) ro.observe(dishesRef.current);
    if (checkRef.current) ro.observe(checkRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [mobileOpen, scrolled]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  const isActive = (url: string) => url.split("#")[0] === pathname;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const menuDesc = (url: string) => {
    switch (url) {
      case "/how-it-works":
        return t("navbar.menuDescHowItWorks");
      case "/pricing":
        return t("navbar.menuDescPricing");
      case "/contact":
        return t("navbar.menuDescContact");
      default:
        return "";
    }
  };

  const menuItems = [
    { id: "home", url: "/", label: currentLang === "fr" ? "Accueil" : "Home" },
    ...links.map((link) => ({
      id: link.id,
      url: link.url,
      label: currentLang === "fr" ? link.labelFr : link.labelEn,
    })),
  ];

  const revealStart = SLIDE_DURATION + 0.06;
  const checkDelay = revealStart + REVEAL_GAP * menuItems.length;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-out ${
          scrolled
            ? "h-16 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
            : "h-20 border-b border-transparent"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(10, 10, 12, 0.85)" : "rgba(10, 10, 12, 0.25)",
          backdropFilter: scrolled ? "blur(48px) saturate(1.4)" : "blur(40px)",
          WebkitBackdropFilter: scrolled ? "blur(48px) saturate(1.4)" : "blur(40px)",
          // Open menu: the bar rides down to the seam below the sheet, keeping
          // the page-push illusion with the content. Closed: `none` — no
          // containing block, so the bar stays pinned to the viewport while
          // scrolling (a persistent transform would let it scroll away).
          transform: mobileOpen ? `translateY(${sheetHeight})` : "none",
          transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <motion.div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-primary/80"
          style={{ scaleX: scrollYProgress }}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(40 70% 39% / 0.3) 50%, transparent 100%)",
          }}
        />

        <div className={`${ROW_CLASS} flex h-full items-center justify-between`}>
          <a href="/" className="flex items-center gap-3 group">
            {/* On scroll the wordmark dissolves upward and the mark takes
                over, growing into the space it leaves. */}
            <motion.div
              className={`relative transition-all duration-500 ease-out ${
                scrolled ? "h-11 w-11" : "h-8 w-8"
              }`}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <span
                aria-hidden
                className="absolute -inset-2 rounded-full bg-primary/15 blur-xl animate-[logo-breathe_4s_ease-in-out_infinite]"
              />
              <Image
                src="/logo/golden-main-transparent.png"
                alt="PrepIQ Logo"
                width={40}
                height={40}
                className="relative h-full w-full object-contain"
              />
            </motion.div>
            <span
              className={`font-display text-lg font-semibold text-foreground transition-all duration-500 ease-out ${
                scrolled ? "opacity-0 translate-y-1.5" : "opacity-100 translate-y-0"
              }`}
            >
              PrepIQ
            </span>
          </a>

          <button
            className={`group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
              mobileOpen
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card/60 text-foreground hover:bg-accent hover:border-primary/30"
            }`}
            onClick={() => (mobileOpen ? closeMenu() : openMenu())}
            aria-expanded={mobileOpen}
            aria-controls="site-menu"
            aria-label={
              mobileOpen
                ? currentLang === "fr"
                  ? "Fermer le menu"
                  : "Close menu"
                : currentLang === "fr"
                  ? "Ouvrir le menu"
                  : "Open menu"
            }
          >
            <MenuBurgerIcon phase={burgerPhase} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              // The sheet — pushed from the top of the screen. It is
              // portaled to <body> so it stays pinned to the viewport while
              // PageShell transforms the page content down by exactly this
              // sheet's height. A click-away backdrop dims and closes it.
              <motion.div
                key="menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: SLIDE_DURATION, ease: SLIDE_EASE }}
                style={{ top: sheetHeight }}
                onClick={closeMenu}
                aria-hidden
                className="fixed inset-x-0 bottom-0 z-[55] bg-black/25"
              />
            )}
            {mobileOpen && (
              <motion.aside
                key="menu"
                id="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label={t("navbar.menuEyebrow")}
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: SLIDE_DURATION, ease: SLIDE_EASE }}
                style={{
                  height: sheetHeight,
                  transition: `height ${SLIDE_DURATION * 1000}ms cubic-bezier(${SLIDE_EASE.join(",")})`,
                }}
                className="fixed inset-x-0 top-0 z-[70] flex w-full flex-col overflow-hidden border-b border-border bg-card shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 pattern-grid opacity-[0.12]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-48 wash-gold-top"
                />

                {/* À la carte — the menu card's header. Same row class as the navbar,
                  so the close glyph lands pixel-perfect on the burger's
                  spot: click to open, click to close. */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: revealStart, duration: REVEAL_DURATION, ease: REVEAL_EASE }}
                  className={`relative flex items-center justify-between border-b border-border/60 ${ROW_CLASS} ${
                    scrolled ? "h-16" : "h-20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-px bg-primary" />
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-primary font-medium">
                      {t("navbar.menuEyebrow")}
                    </span>
                    <span className="text-xs text-muted-foreground/70 hidden sm:inline">
                      {currentLang === "fr"
                        ? `${menuItems.length} plats`
                        : `${menuItems.length} courses`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                      className="group flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-[0_0_24px_rgba(196,151,54,0.25)] active:scale-95"
                      onClick={closeMenu}
                      aria-label={
                        currentLang === "fr" ? "Fermer le menu" : "Close menu"
                      }
                    >
                      {/* The close folds in from a quarter turn once the
                          sheet has settled — it answers the burger's wink. */}
                      <motion.span
                        initial={{ rotate: -90, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                          delay: revealStart + 0.08,
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                        className="flex"
                      >
                        <MenuBurgerIcon phase="x" className="h-6 w-6" />
                      </motion.span>
                    </button>
                  </div>
                </motion.div>

                {/* The dishes — numbered courses on a dashed menu card */}
                <nav ref={dishesRef} className="relative flex-1 overflow-y-auto scrollbar-thin px-6 py-2 md:px-8 lg:px-16 mx-auto w-full max-w-[var(--max-width,1440px)]">
                  {menuItems.map((item, i) => {
                    const active =
                      item.id === "home" ? pathname === "/" : isActive(item.url);
                    const desc = menuDesc(item.url);
                    return (
                      <motion.a
                        key={item.id}
                        href={item.url}
                        onClick={closeMenu}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: revealStart + REVEAL_GAP + i * REVEAL_GAP,
                          duration: REVEAL_DURATION,
                          ease: REVEAL_EASE,
                        }}
                        className="group relative flex items-center gap-5 md:gap-10 border-b border-dashed border-border/60 py-5 md:py-7 last:border-b-0 transition-colors active:bg-accent/40"
                      >
                        {/* The dish's fire-line — the dashed separator
                            catches gold light as the dish comes alive. */}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-[3px] h-px origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
                        />
                        <span className="font-display text-xl md:text-3xl font-semibold tabular-nums text-primary/40 transition-colors group-hover:text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-3">
                            <span className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold leading-none tracking-[-0.03em] text-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary">
                              {item.label}
                            </span>
                            {active && (
                              <span className="rounded-full border border-primary/20 bg-primary/[0.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                                {t("navbar.menuSpecial")}
                              </span>
                            )}
                          </span>
                          {desc && (
                            <span className="mt-2 block text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
                              {desc}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8 shrink-0 text-muted-foreground/30 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </motion.a>
                    );
                  })}
                </nav>

                {/* The check — two distinct actions */}
                <motion.div
                  ref={checkRef}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: checkDelay, duration: REVEAL_DURATION, ease: REVEAL_EASE }}
                  className="relative border-t border-border px-6 py-5 md:px-8 lg:px-16 mx-auto w-full max-w-[var(--max-width,1440px)]"
                >
                  <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                    <Button asChild variant="ghost" size="lg" className="h-12 w-full justify-center sm:flex-1">
                      <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                        {t("navbar.logIn")}
                      </a>
                    </Button>
                    <Button asChild variant="hero" size="lg" className="h-12 w-full justify-center sm:flex-1">
                      <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                        {t("navbar.startFree")}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </motion.aside>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default Navbar;