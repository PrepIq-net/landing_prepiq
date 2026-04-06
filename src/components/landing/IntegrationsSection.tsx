import { motion } from "framer-motion";
import { CheckCircle, Clock, CloudUpload, Code } from "lucide-react";
import { useTranslation } from "react-i18next";

// Loyverse SVG logo
const LoyverseLogo = () => (
  <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
    <rect width="40" height="40" rx="8" fill="hsl(40 70% 39% / 0.15)" />
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(40 70% 55%)" fontFamily="system-ui">L</text>
  </svg>
);

// Coming-soon POS logos (generic pill placeholders)
const COMING_SOON = [
  { name: "Square" },
  { name: "Toast" },
  { name: "Clover" },
  { name: "Lightspeed" },
  { name: "Shopify" },
  { name: "Aloha" },
];

const IntegrationsSection = () => {
  const { t } = useTranslation();
  const steps = (t("integrations.steps", { returnObjects: true }) as any[]) || [];

  return (
    <section id="integrations" className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
            {t("integrations.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-5 leading-tight lg:leading-[1.15]">
            {t("integrations.titleLine1")}{" "}
            <span className="text-primary">{t("integrations.titleLine2")}</span>
          </h2>
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t("integrations.subtitle")}
          </p>
        </motion.div>

        {/* Two-column layout: Live + Coming soon */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14 max-w-4xl mx-auto">

          {/* Live connector — Loyverse */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 overflow-hidden"
          >
            {/* Live badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-medium text-success uppercase tracking-wider">Live</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <LoyverseLogo />
              <div>
                <p className="text-base font-semibold text-foreground">Loyverse POS</p>
                <p className="text-xs text-muted-foreground">Real-time sync · Sales data · Menu items</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                "Automatic sales ingestion",
                "Menu item mapping",
                "Multi-branch support",
                "Real-time forecast updates",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            {/* Subtle glow */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          </motion.div>

          {/* Coming soon POS systems */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card/60 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-4 w-4 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">More POS systems — coming soon</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {COMING_SOON.map((pos) => (
                <div
                  key={pos.name}
                  className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/40 px-3.5 py-2.5 opacity-60"
                >
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                  <span className="text-sm text-muted-foreground/70 font-medium">{pos.name}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground/50 leading-relaxed">
              Using a different POS? You can always import sales via CSV or connect through our REST API.
            </p>
          </motion.div>
        </div>

        {/* Other data input methods */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-14"
        >
          {[
            {
              icon: CloudUpload,
              label: t("integrations.connectors.csv"),
              desc: "Upload your sales history as a CSV. Works with any format.",
            },
            {
              icon: Code,
              label: t("integrations.connectors.api"),
              desc: "Push data programmatically via our REST API. Full docs included.",
            },
          ].map((c, i) => (
            <div
              key={c.label}
              className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/60 px-5 py-4"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                <c.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{c.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Setup steps */}
        <div className="max-w-2xl mx-auto space-y-4 px-1">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex gap-4 sm:gap-5 items-start rounded-2xl border border-border/50 bg-card/60 p-4 sm:p-5"
            >
              <span className="text-xl font-semibold text-primary/30 shrink-0 w-10 pt-0.5">{s.num}</span>
              <div>
                <h4 className="text-[15px] font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
