import { motion } from "framer-motion";

const logos = [
  {
    name: "Square",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4.01 0A4.01 4.01 0 000 4.01v15.98A4.01 4.01 0 004.01 24h15.98A4.01 4.01 0 0024 19.99V4.01A4.01 4.01 0 0019.99 0H4.01zm2.04 5.98h11.9c.56 0 1.02.46 1.02 1.02v9.99c0 .57-.46 1.03-1.02 1.03H6.05c-.56 0-1.02-.46-1.02-1.03V7c0-.56.46-1.02 1.02-1.02zm2.6 2.59a.51.51 0 00-.51.51v5.83c0 .28.23.51.51.51h6.7a.51.51 0 00.51-.51V9.08a.51.51 0 00-.51-.51h-6.7z" />
      </svg>
    ),
  },
  {
    name: "Toast",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  {
    name: "Lightspeed",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M13 2L3 14h7l-2 8 12-14h-7l4-6z" />
      </svg>
    ),
  },
  {
    name: "Clover",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2a5 5 0 00-3.5 8.57A5 5 0 002 14a5 5 0 006.5 4.43A5 5 0 0012 22a5 5 0 003.5-3.57A5 5 0 0022 14a5 5 0 00-6.5-4.43A5 5 0 0012 2z" />
      </svg>
    ),
  },
  {
    name: "Aloha POS",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
      </svg>
    ),
  },
  {
    name: "Revel",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    ),
  },
  {
    name: "TouchBistro",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: "Shopify",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M15.34 3.27c-.07 0-.13.04-.16.1-.02.06-.82 1.73-.82 1.73s-.88-.18-.98-.2c-.1-.02-.15-.01-.2.09C13.13 5.1 12.85 5.86 12.7 6.3c-.56-.17-1.13-.34-1.13-.34S12 4.25 12.03 4.17c.04-.11-.01-.2-.16-.2-.12 0-1.02.02-1.02.02s-.7-1.95-.77-2.13c-.07-.18-.23-.14-.23-.14L8.73 2s-.18.04-.15.21l1.64 8.8L15.3 9.5s.09-.04.1-.13c.02-.1-1.33-5.93-1.33-5.93-.02-.1-.08-.17-.17-.17zM12.5 6.7l-.6 1.84-1.22-.37s.37-1.43.49-1.84c.13-.44.33-.61.53-.61.2 0 .8.14.8.98z" />
        <path d="M15.5 9.4l-5.3 1.62-.02.01 2.28 12.24c.05.26.31.35.46.14 0 0 3.28-4.56 3.3-4.6.03-.06.02-.11-.02-.17L15.5 9.4z" />
      </svg>
    ),
  },
];

const LogoTickerSection = () => {
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
          Works with your existing stack
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
              className="flex-shrink-0 flex items-center gap-2.5 rounded-full border border-border/40 bg-card/30 backdrop-blur-sm px-5 py-2.5 hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-400 group cursor-default"
            >
              <span className="text-muted-foreground/40 group-hover:text-primary/70 transition-colors duration-400">
                {logo.svg}
              </span>
              <span className="text-[13px] sm:text-sm font-medium text-muted-foreground/50 group-hover:text-foreground/70 transition-colors duration-400 whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTickerSection;
