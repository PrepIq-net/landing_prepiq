import { motion } from "framer-motion";
import { Globe, Clock, Language, Building } from "iconoir-react";
import { useTranslation } from "react-i18next";

const GlobalReadySection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Globe, label: t("globalReady.features.currency.label"), desc: t("globalReady.features.currency.desc") },
    { icon: Clock, label: t("globalReady.features.timezone.label"), desc: t("globalReady.features.timezone.desc") },
    { icon: Language, label: t("globalReady.features.localized.label"), desc: t("globalReady.features.localized.desc") },
    { icon: Building, label: t("globalReady.features.support.label"), desc: t("globalReady.features.support.desc") },
  ];

  const regions = [
    { flag: "🇺🇸", name: t("globalReady.regions.na") },
    { flag: "🇬🇧", name: t("globalReady.regions.eu") },
    { flag: "🇦🇪", name: t("globalReady.regions.me") },
    { flag: "🇳🇬", name: t("globalReady.regions.af") },
    { flag: "🇸🇬", name: t("globalReady.regions.ap") },
    { flag: "🇧🇷", name: t("globalReady.regions.la") },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
      {/* Globe-like ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.04),transparent_70%)] pointer-events-none" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4 block">
            {t("globalReady.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 leading-tight lg:leading-[1.15]">
            {t("globalReady.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t("globalReady.subtitle")}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid gap-px bg-border/40 rounded-2xl overflow-hidden border border-border grid-cols-1 sm:grid-cols-2 mb-10 md:mb-12">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card p-5 sm:p-7 md:p-8 group hover:bg-accent/30 transition-colors duration-300 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/40 to-transparent transition-all duration-500" />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0 mt-0.5">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{f.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active regions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-2 sm:gap-3"
        >
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-center justify-center gap-2 sm:gap-2.5 rounded-full border border-border bg-card/80 px-3 sm:px-4 py-2 sm:py-2.5 hover:border-primary/20 transition-colors"
            >
              <span className="text-sm">{r.flag}</span>
              <span className="text-xs font-medium text-muted-foreground">{r.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalReadySection;
