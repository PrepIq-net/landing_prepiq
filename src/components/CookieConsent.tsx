"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Xmark } from "iconoir-react";
import { useTranslation, Trans } from "react-i18next";
import Link from "next/link";

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
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 pointer-events-auto"
        >
          <div className="max-w-sm mx-auto">
            {/* Plain div, not motion: animating height from 0 to `undefined`
                (the "collapsed" state) never resolves in Framer Motion — the
                value has no target to animate to, so it stays pinned at 0
                forever and the whole card renders as a sliver. The outer
                wrapper above already handles the slide/fade entrance. */}
            <div className="relative rounded-xl border border-border bg-card/95 backdrop-blur-lg shadow-[0_-4px_16px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px bg-border" />
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground font-medium">
                      {i18n.resolvedLanguage === "fr" ? "Vie privée" : "Privacy"}
                    </span>
                  </div>
                  {/* Same as Decline: closing without a choice still has to
                      mean something, and "required cookies only" is the
                      only reading that doesn't quietly opt the visitor into
                      analytics/marketing they never agreed to. */}
                  <button
                    onClick={declineAll}
                    className="shrink-0 p-1 -m-1 rounded-lg hover:bg-accent transition-colors"
                    aria-label={i18n.resolvedLanguage === "fr" ? "Fermer" : "Close"}
                  >
                    <Xmark className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <h3 className="font-display text-sm font-semibold text-foreground mb-1">
                  {i18n.resolvedLanguage === "fr"
                    ? "Nous respectons votre vie privée"
                    : "We respect your privacy"}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
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
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={acceptAll}
                      className="w-full rounded-lg px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                      {i18n.resolvedLanguage === "fr" ? "Tout accepter" : "Accept all"}
                    </button>
                    <div className="flex gap-1.5">
                      <button
                        onClick={acceptAnalytics}
                        className="flex-1 rounded-lg px-3 py-2 text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 transition-all active:scale-[0.98]"
                      >
                        {i18n.resolvedLanguage === "fr" ? "Analytiques" : "Analytics only"}
                      </button>
                      <button
                        onClick={declineAll}
                        className="flex-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-transparent transition-all active:scale-[0.98]"
                      >
                        {i18n.resolvedLanguage === "fr" ? "Refuser" : "Decline"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 border-t border-border pt-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.key}
                        className="flex items-start gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center justify-center w-7 h-7 flex-shrink-0 rounded-lg bg-primary/10 border border-primary/20">
                          {cat.required ? (
                            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-primary">REQ</span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={consent[cat.key]}
                              onChange={() => setConsent((c) => ({ ...c, [cat.key]: !c[cat.key] }))}
                              className="w-4 h-4 accent-primary rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary/20"
                              aria-label={cat.label}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-xs">{cat.label}</p>
                          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-1.5 pt-1 border-t border-border">
                      <button
                        onClick={() => {
                          setConsent({ required: true, analytics: true, marketing: true });
                          saveConsent("all");
                        }}
                        className="w-full rounded-lg px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
                      >
                        {i18n.resolvedLanguage === "fr" ? "Tout accepter" : "Accept all"}
                      </button>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setConsent({ required: true, analytics: false, marketing: false });
                            saveConsent("required");
                          }}
                          className="flex-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-transparent transition-all active:scale-[0.98]"
                        >
                          {i18n.resolvedLanguage === "fr" ? "Refuser optionnels" : "Decline optional"}
                        </button>
                        <button
                          onClick={() => setExpanded(false)}
                          className="flex-1 rounded-lg px-3 py-2 text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 transition-all active:scale-[0.98]"
                        >
                          {i18n.resolvedLanguage === "fr" ? "Retour" : "Back"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="mt-2 w-full text-center text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    {i18n.resolvedLanguage === "fr" ? "Personnaliser les préférences →" : "Customize preferences →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;