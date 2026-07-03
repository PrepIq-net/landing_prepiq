import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { IntegrationsContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";

const POS_META = [
  { initial: "L", color: "hsl(40 70% 39%)" },
  { initial: "S", color: "hsl(220 14% 50%)" },
  { initial: "T", color: "hsl(220 14% 50%)" },
  { initial: "C", color: "hsl(220 14% 50%)" },
];

const TICKER_LOGOS = ["Loyverse", "Square", "Toast", "Lightspeed", "Clover", "Shopify", "Aloha"];

const IntegrationsSection = ({ dbContent }: { dbContent?: SectionContent<IntegrationsContent> }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const isFr = currentLang === "fr";

  const content: IntegrationsContent = dbContent?.[currentLang] || {
    badge: t("integrations.badge"),
    titleLine1: isFr ? "Fonctionne avec votre" : "Works with your",
    titleLine2: isFr ? "système actuel" : "existing stack",
    body: isFr
      ? "PrepIQ se connecte directement à votre POS pour récupérer les données de vente automatiquement — sans export manuel, sans tableur. D'autres intégrations arrivent bientôt."
      : "PrepIQ connects directly to your POS to pull sales data automatically — no manual exports, no spreadsheets. More integrations are on the way.",
    csvNote: isFr
      ? "Vous n'utilisez pas encore un POS pris en charge ? Vous pouvez importer vos ventes via CSV ou notre API REST — PrepIQ fonctionne dans les deux cas."
      : "Not using a supported POS yet? You can import sales via CSV or connect through our REST API — PrepIQ works either way.",
    posSystems: [
      { name: "Loyverse", status: "live" },
      { name: "Square", status: "soon" },
      { name: "Toast", status: "soon" },
      { name: "Clover", status: "soon" },
    ],
    tickerLabel: t("logoTicker.title"),
  };

  const tripledLogos = [...TICKER_LOGOS, ...TICKER_LOGOS, ...TICKER_LOGOS];

  return (
    <section id="integrations" className="relative py-20 md:py-28 border-t border-border/50 scroll-mt-20">
      <SeamAccent />
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">{content.badge}</span>
            <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-semibold text-foreground leading-tight mb-5">
              {content.titleLine1}
              <br />
              <span className="text-primary">{content.titleLine2}</span>
            </h2>
            <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-sm">{content.body}</p>
            <p className="text-xs text-muted-foreground/50 leading-relaxed max-w-sm">{content.csvNote}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {content.posSystems.map((pos, i) => {
              const isLive = pos.status === "live";
              const meta = POS_META[i];
              return (
                <motion.div
                  key={pos.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl border p-5 flex flex-col gap-3 transition-colors duration-200 ${isLive ? "border-primary/25 bg-primary/[0.04] hover:border-primary/40" : "border-border/40 bg-card/40 opacity-60 hover:opacity-80"}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: isLive ? "hsl(40 70% 39% / 0.15)" : "hsl(220 14% 20% / 0.4)", color: isLive ? meta.color : "hsl(220 14% 55%)" }}
                  >
                    {meta.initial}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isLive ? "text-foreground" : "text-muted-foreground/60"}`}>{pos.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-success" : "bg-muted-foreground/25"}`} />
                      <span className={`text-[11px] ${isLive ? "text-success" : "text-muted-foreground/40"}`}>
                        {isLive ? (isFr ? "Synchronisation en direct" : "Real-time sales sync") : isFr ? "Bientôt disponible" : "Coming soon"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ticker */}
        <div className="relative mt-16 sm:mt-20 -mx-6 md:-mx-8 lg:-mx-16 pt-10 sm:pt-14 border-t border-border/30 overflow-hidden">
          <p className="text-center text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary/60 font-medium mb-8 px-6">{content.tickerLabel}</p>
          <div className="absolute left-0 top-10 bottom-0 w-28 sm:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-10 bottom-0 w-28 sm:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex w-max items-center animate-[ticker_40s_linear_infinite]" style={{ gap: "3rem" }}>
            {tripledLogos.map((name, i) => {
              const isLive = name === "Loyverse";
              return (
                <div
                  key={`${name}-${i}`}
                  className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-5 py-2.5 ${isLive ? "border-primary/25 bg-primary/[0.06]" : "border-border/30 bg-card/20 opacity-50"}`}
                >
                  <span className={`text-[13px] sm:text-sm font-medium whitespace-nowrap ${isLive ? "text-foreground/80" : "text-muted-foreground/40"}`}>{name}</span>
                  {isLive && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
