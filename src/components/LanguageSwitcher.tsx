import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * Language picker — an EN/FR segmented toggle with a gold thumb that slides
 * between the two choices (shared-layout animation, so no measurement is
 * needed and the thumb always lands exactly on the active language).
 */
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage as 'en' | 'fr';

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full border border-border bg-accent/40 p-1"
    >
      {(['en', 'fr'] as const).map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={active}
            className={`relative rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
              active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-thumb"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-primary shadow-[0_0_24px_rgba(160,120,25,0.4)]"
              />
            )}
            <span className="relative z-10">{lng}</span>
          </button>
        );
      })}
    </div>
  );
};