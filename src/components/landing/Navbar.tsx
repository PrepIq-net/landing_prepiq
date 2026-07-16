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
            <>
              {/* Scrim below the bar to focus the menu and close on tap */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="fixed inset-x-0 bottom-0 z-40 bg-background/70 md:hidden"
                style={{ top: scrolled ? "3.5rem" : "4rem" }}
                onClick={() => setMobileOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="fixed inset-x-0 z-50 md:hidden border-b border-border bg-card"
                style={{ top: scrolled ? "3.5rem" : "4rem" }}
              >
                <div className="section-container px-4 sm:px-6 py-4 flex flex-col">
                  <nav className="flex flex-col">
                    {[{ id: "home", url: "/", label: currentLang === "fr" ? "Accueil" : "Home" }, ...links.map((link) => ({ id: link.id, url: link.url, label: currentLang === "fr" ? link.labelFr : link.labelEn }))].map((item, i) => {
                      const active = item.id === "home" ? pathname === "/" : isActive(item.url);
                      return (
                        <motion.a
                          key={item.id}
                          href={item.url}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className={`flex items-center justify-between rounded-lg px-4 py-3.5 text-base font-medium transition-colors ${
                            active
                              ? "text-primary"
                              : "text-foreground/90 hover:bg-accent hover:text-foreground"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                          {active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </motion.a>
                      );
                    })}
                  </nav>

                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
                    <Button asChild variant="outline" size="lg" className="w-full justify-center">
                      <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                        {t("navbar.logIn")}
                      </a>
                    </Button>
                    <Button asChild variant="hero" size="lg" className="w-full justify-center">
                      <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                        {t("navbar.startFree")}
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    );
  };

  export default Navbar;
