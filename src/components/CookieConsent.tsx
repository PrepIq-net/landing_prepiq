"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "iconoir-react";
import { useTranslation, Trans } from "react-i18next";
import Link from "next/link";
import { GoldText } from "@/components/landing/GoldText";

const COOKIE_KEY = "prepiq_cookie_consent_v2";
const COOKIE_EXPIRY_DAYS = 365;

type ConsentLevel = "required" | "analytics" | "marketing" | "all";

interface CookieConsentData {
  level: ConsentLevel;
  timestamp: number;
}

const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState<{
    required: boolean;
    analytics: boolean;
    marketing: boolean;
  }>({
    required: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    try {
      const data: CookieConsentData = JSON.parse(stored);
      // Legacy format was a bare string "accepted" | "declined" — treat as expired
      if (typeof data === "string" || !data.level || !data.timestamp) {
        localStorage.removeItem(COOKIE_KEY);
        setVisible(true);
        return;
      }
      // Expire after 1 year
      if (Date.now() - data.timestamp > COOKIE_EXPIRY_DAYS * 86400000) {
        localStorage.removeItem(COOKIE_KEY);
        setVisible(true);
        return;
      }
      if (data.level === "analytics") setConsent({ required: true, analytics: true, marketing: false });
      else if (data.level === "marketing" || data.level === "all") setConsent({ required: true, analytics: true, marketing: true });
    } catch {
      localStorage.removeItem(COOKIE_KEY);
      setVisible(true);
    }
  }, []);

  const saveConsent = (level: ConsentLevel) => {
    const data: CookieConsentData = { level, timestamp: Date.now() };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
    setVisible(false);
    setExpanded(false);
  };

  const acceptAll = () => saveConsent("all");
  const acceptAnalytics = () => saveConsent("analytics");
  const declineAll = () => saveConsent("required");

  const categories = [
    {
      key: "required" as const,
      label: i18n.resolvedLanguage === "fr" ? "Nécessaires" : "Required",
      desc: i18n.resolvedLanguage === "fr"
        ? "Indispensables au fonctionnement du site (session, sécurité, préférences de base). Impossible à désactiver."
        : "Essential for the site to work (session, security, basic preferences). Cannot be disabled.",
      required: true,
    },
    {
      key: "analytics" as const,
      label: i18n.resolvedLanguage === "fr" ? "Analytiques" : "Analytics",
      desc: i18n.resolvedLanguage === "fr"
        ? "Nous aident à comprendre comment les visiteurs interagissent avec le site (pages vues, parcours, performances)."
        : "Help us understand how visitors interact with the site (page views, journeys, performance).",
      required: false,
    },
    {
      key: "marketing" as const,
      label: i18n.resolvedLanguage === "fr" ? "Marketing" : "Marketing",
      desc: i18n.resolvedLanguage === "fr"
        ? "Utilisés pour personnaliser les publicités et mesurer l'efficacité des campagnes."
        : "Used to personalize ads and measure campaign effectiveness.",
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-auto"
        >
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: expanded ? "auto" : undefined }}
              className="relative rounded-2xl border border-border bg-card/95 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-px bg-primary" />
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-primary font-medium">
                      {i18n.resolvedLanguage === "fr" ? "Vie privée" : "Privacy"}
                    </span>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    className="shrink-0 p-1 rounded-lg hover:bg-accent transition-colors"
                    aria-label={i18n.resolvedLanguage === "fr" ? "Fermer" : "Close"}
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  <GoldText text={i18n.resolvedLanguage === "fr"
                    ? "Nous respectons votre <gold>vie privée</gold>"
                    : "We respect your <gold>privacy</gold>"} />
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  <Trans
                    i18nKey="common.cookieNotice"
                    defaults={
                      i18n.resolvedLanguage === "fr"
                        ? "Nous utilisons des cookies pour améliorer votre expérience. Consultez notre <link>Politique de confidentialité</link> pour les détails."
                        : "We use cookies to improve your experience. Read our <link>Privacy Policy</link> for details."
                    }
                    components={{
                      link: (
                        <Link
                          href="/privacy-policy"
                          className="text-primary hover:underline font-medium"
                        />
                      ),
                    }}
                  />
                </p>

                {!expanded ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="flex-1 rounded-lg px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                      {i18n.resolvedLanguage === "fr" ? "Tout accepter" : "Accept all"}
                    </button>
                    <button
                      onClick={acceptAnalytics}
                      className="flex-1 rounded-lg px-5 py-3 text-sm font-semibold border border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 transition-all active:scale-[0.98]"
                    >
                      {i18n.resolvedLanguage === "fr" ? "Analytiques seulement" : "Analytics only"}
                    </button>
                    <button
                      onClick={declineAll}
                      className="flex-1 rounded-lg px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent transition-all active:scale-[0.98]"
                    >
                      {i18n.resolvedLanguage === "fr" ? "Refuser" : "Decline"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 border-t border-border pt-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.key}
                        className="flex items-start gap-4 p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-xl bg-primary/10 border border-primary/20">
                          {cat.required ? (
                            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">REQ</span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={consent[cat.key]}
                              onChange={() => setConsent((c) => ({ ...c, [cat.key]: !c[cat.key] }))}
                              className="w-5 h-5 accent-primary rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary/20"
                              aria-label={cat.label}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{cat.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
                      <button
                        onClick={() => {
                          setConsent({ required: true, analytics: true, marketing: true });
                          saveConsent("all");
                        }}
                        className="flex-1 rounded-lg px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
                      >
                        {i18n.resolvedLanguage === "fr" ? "Tout accepter" : "Accept all"}
                      </button>
                      <button
                        onClick={() => {
                          setConsent({ required: true, analytics: false, marketing: false });
                          saveConsent("required");
                        }}
                        className="flex-1 rounded-lg px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent transition-all active:scale-[0.98]"
                      >
                        {i18n.resolvedLanguage === "fr" ? "Refuser les optionnels" : "Decline optional"}
                      </button>
                      <button
                        onClick={() => setExpanded(false)}
                        className="flex-1 rounded-lg px-5 py-3 text-sm font-medium border border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 transition-all active:scale-[0.98]"
                      >
                        {i18n.resolvedLanguage === "fr" ? "Fermer" : "Close"}
                      </button>
                    </div>
                  </div>
                )}

                {!expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="mt-4 w-full text-center text-xs text-primary hover:text-primary/70 font-medium transition-colors"
                  >
                    {i18n.resolvedLanguage === "fr" ? "Personnaliser les préférences →" : "Customize preferences →"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;