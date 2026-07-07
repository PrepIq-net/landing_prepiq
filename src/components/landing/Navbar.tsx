"use client";

import { useState } from "react";
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

  const isActive = (url: string) => url.split("#")[0] === pathname;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out backdrop-blur-md ${
        scrolled
          ? "h-14 border-b border-primary/15 bg-background/85 backdrop-blur-2xl shadow-[0_1px_20px_hsl(40_70%_39%/0.06)]"
          : "h-16 border-b border-transparent bg-background/10"
      }`}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-14 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed top-14 right-0 bottom-0 w-[280px] bg-background border-l border-border/50 z-50 md:hidden shadow-[-8px_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col h-full p-6">
              <div className="space-y-2">
                <motion.a
                  href="/"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                  className={`block text-sm font-medium text-foreground transition-colors rounded-xl px-4 py-3.5 border active:bg-accent/70 hover:border-primary/25 ${
                    pathname === "/"
                      ? "border-primary/40 bg-primary/10"
                      : "border-border/60 bg-accent/40"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {currentLang === "fr" ? "Accueil" : "Home"}
                </motion.a>
                {links.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 1) * 0.06 }}
                    className={`block text-sm font-medium text-foreground transition-colors rounded-xl px-4 py-3.5 border active:bg-accent/70 hover:border-primary/25 ${
                      isActive(link.url)
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/60 bg-accent/40"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {currentLang === "fr" ? link.labelFr : link.labelEn}
                  </motion.a>
                ))}
              </div>
              <div className="flex flex-col gap-2.5 pt-6 mt-6 border-t border-border/50">
                <Button asChild variant="ghost" size="sm" className="w-full justify-center">
                  <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                    {t("navbar.logIn")}
                  </a>
                </Button>
                <Button asChild variant="hero" size="sm" className="w-full justify-center">
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
