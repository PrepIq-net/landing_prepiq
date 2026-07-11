  "use client";

  import { useState, useEffect } from "react";
  import Image from "next/image";
  import { usePathname } from "next/navigation";
  import { Button } from "@/components/ui/button";
  import { Menu, Xmark } from "iconoir-react";
  import {
    motion,
    AnimatePresence,
    useMotionValueEvent,
    useScroll,
  } from "framer-motion";
  import { useTranslation } from "react-i18next";
  import { LanguageSwitcher } from "@/components/LanguageSwitcher";
  import { APP_URL } from "@/lib/constants";

  interface NavLink {
    id: string;
    labelEn: string;
    labelFr: string;
    url: string;
  }

  // 1. We create a constant for the noise SVG so it's clean and reusable
const NOISE_SVG_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

const Navbar = ({ links }: { links: NavLink[] }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.resolvedLanguage as "en" | "fr";

    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY, scrollYProgress } = useScroll();
    const pathname = usePathname();

    // Scroll locking
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
    const isActive = (url: string) => url.split("#")[0] === pathname;

    useMotionValueEvent(scrollY, "change", (latest) => {
      setScrolled(latest > 20);
    });

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "h-14 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "h-16 border-b border-transparent"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(10, 10, 12, 0.75)" : "rgba(10, 10, 12, 0.4)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
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

        <div className="section-container px-4 sm:px-6 flex h-full items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className={`transition-all duration-300 ${
                scrolled ? "h-7 w-7" : "h-10 w-10"
              }`}
              whileHover={{ rotate: -6, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Image
                src="/logo/golden-main-transparent.png"
                alt="PrepIQ Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </motion.div>
            <span className="font-display text-base sm:text-lg font-semibold text-foreground">
              PrepIQ
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className={`relative text-sm transition-colors duration-200 hover:text-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                pathname === "/"
                  ? "text-foreground after:w-full"
                  : "text-muted-foreground after:w-0"
              }`}
            >
              {currentLang === "fr" ? "Accueil" : "Home"}
            </a>
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className={`relative text-sm transition-colors duration-200 hover:text-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                  isActive(link.url)
                    ? "text-foreground after:w-full"
                    : "text-muted-foreground after:w-0"
                }`}
              >
                {currentLang === "fr" ? link.labelFr : link.labelEn}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <Button asChild variant="ghost" size="sm">
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                {t("navbar.logIn")}
              </a>
            </Button>
            <Button asChild variant="hero" size="sm">
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                {t("navbar.startFree")}
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              className="text-foreground p-1.5 -mr-1.5 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <Xmark className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-[100] md:hidden flex flex-col p-6 rounded-2xl overflow-y-auto max-h-[80vh]"
              style={{
                backgroundColor: "rgba(10, 10, 12, 0.85)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* --- PREMIUM NOISE LAYER FOR MOBILE MENU --- */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.04] z-0 rounded-2xl"
                style={{ backgroundImage: NOISE_SVG_URL }}
              />

              <div className="relative z-10 flex flex-col h-full justify-between w-full">
                <div className="flex flex-col gap-3 mt-4">
                  <motion.a
                    href="/"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`flex items-center text-xl font-semibold text-foreground transition-all rounded-xl px-5 py-4 border ${
                      pathname === "/"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-transparent bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {currentLang === "fr" ? "Accueil" : "Home"}
                  </motion.a>
                  {links.map((link, i) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i + 2) * 0.05 }}
                      className={`flex items-center text-xl font-semibold text-foreground transition-all rounded-xl px-5 py-4 border ${
                        isActive(link.url)
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-transparent bg-white/5 hover:bg-white/10"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {currentLang === "fr" ? link.labelFr : link.labelEn}
                    </motion.a>
                  ))}
                </div>
                <div className="flex flex-col gap-4 pt-8 mt-auto border-t border-white/10 pb-4">
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="lg" 
                    className="w-full justify-center text-base font-medium bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                      {t("navbar.logIn")}
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    variant="hero" 
                    size="lg" 
                    className="w-full justify-center text-base font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all duration-300"
                  >
                    <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                      {t("navbar.startFree")}
                    </a>
                  </Button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </nav>
    );
  };

  export default Navbar;
