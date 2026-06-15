"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Link from "next/link";

const COOKIE_KEY = "prepiq_cookie_consent";

const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Show after a short delay so it doesn't compete with initial load
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card shadow-[0_-4px_30px_rgba(0,0,0,0.3)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium mb-1">
                {i18n.resolvedLanguage === "fr"
                  ? "Nous respectons votre vie privée"
                  : "We value your privacy"}
              </p>
              <div className="text-xs text-muted-foreground leading-relaxed">
                <Trans
                  i18nKey="common.cookieNotice"
                  defaults={
                    i18n.resolvedLanguage === "fr"
                      ? "Nous utilisons des cookies pour améliorer votre expérience. Consultez notre <link>Politique de confidentialité</link>."
                      : "We use cookies to improve your experience. Read our <link>Privacy Policy</link> for details."
                  }
                  components={{
                    link: (
                      <Link
                        href="/privacy-policy"
                        className="text-primary hover:underline"
                      />
                    ),
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={decline}
                className="flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-accent hover:bg-muted transition-colors"
              >
                {i18n.resolvedLanguage === "fr" ? "Refuser" : "Decline"}
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {i18n.resolvedLanguage === "fr" ? "Accepter" : "Accept"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
