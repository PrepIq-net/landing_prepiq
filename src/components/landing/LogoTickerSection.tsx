import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const logos = [
  {
    name: "Loyverse",
    live: true,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect width="24" height="24" rx="5" fill="hsl(40 70% 39% / 0.2)" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="700" fill="hsl(40 70% 55%)" fontFamily="system-ui">L</text>
      </svg>
    ),
  },
  {
    name: "Square",
    live: false,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4.01 0A4.01 4.01 0 000 4.01v15.98A4.01 4.01 0 004.01 24h15.98A4.01 4.01 0 0024 19.99V4.01A4.01 4.01 0 0019.99 0H4.01zm2.04 5.98h11.9c.56 0 1.02.46 1.02 1.02v9.99c0 .57-.46 1.03-1.02 1.03H6.05c-.56 0-1.02-.46-1.02-1.03V7c0-.56.46-1.02 1.02-1.02zm2.6 2.59a.51.51 0 00-.51.51v5.83c0 .28.23.51.51.51h6.7a.51.51 0 00.51-.51V9.08a.51.51 0 00-.51-.51h-6.7z" />
      </svg>
    ),
  },
  {
    name: "Toast",
    live: false,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  {
    name: "Lightspeed",
    live: false,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M13 2L3 14h7l-2 8 12-14h-7l4-6z" />
      </svg>
    ),
  },
  {
    name: "Clover",
    live: false,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2a5 5 0 00-3.5 8.57A5 5 0 002 14a5 5 0 006.5 4.43A5 5 0 0012 22a5 5 0 003.5-3.57A5 5 0 0022 14a5 5 0 00-6.5-4.43A5 5 0 0012 2z" />
      </svg>
    ),
  },
  {
    name: "Shopify",
    live: false,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M15.34 3.27c-.07 0-.13.04-.16.1-.02.06-.82 1.73-.82 1.73s-.88-.18-.98-.2c-.1-.02-.15-.01-.2.09C13.13 5.1 12.85 5.86 12.7 6.3c-.56-.17-1.13-.34-1.13-.34S12 4.25 12.03 4.17c.04-.11-.01-.2-.16-.2-.12 0-1.02.02-1.02.02s-.7-1.95-.77-2.13c-.07-.18-.23-.14-.23-.14L8.73 2s-.18.04-.15.21l1.64 8.8L15.3 9.5s.09-.04.1-.13c.02-.1-1.33-5.93-1.33-5.93-.02-.1-.08-.17-.17-.17z" />
      </svg>
    ),
  },
  {
    name: "Aloha",
    live: false,
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
      </svg>
    ),
  },
];

const LogoTickerSection = () => {
  const { t } = useTranslation();
  // Triple for seamless loop
  const tripled = [...logos, ...logos, ...logos];

  return (
    <section className="relative py-12 sm:py-16 border-t border-border/30 overflow-hidden">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-container px-4 sm:px-6 mb-10"
      >
        <p className="text-center text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary/60 font-medium">
          {t("logoTicker.title")}
        </p>
      </motion.div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

      {/* Ticker track */}
      <div className="relative">
        <div
          className="flex w-max items-center animate-[ticker_40s_linear_infinite]"
          style={{ gap: "3rem" }}
        >
          {tripled.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-5 py-2.5 transition-all duration-400 group cursor-default ${
                logo.live
                  ? "border-primary/25 bg-primary/[0.06] hover:border-primary/40"
                  : "border-border/30 bg-card/20 opacity-50"
              }`}
            >
              <span className={`transition-colors duration-400 ${logo.live ? "text-primary/80" : "text-muted-foreground/30"}`}>
                {logo.svg}
              </span>
              <span className={`text-[13px] sm:text-sm font-medium whitespace-nowrap ${logo.live ? "text-foreground/80" : "text-muted-foreground/40"}`}>
                {logo.name}
              </span>
              {logo.live && (
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTickerSection;
