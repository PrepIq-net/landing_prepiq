import { motion } from "framer-motion";
import { WarningTriangle, MinusCircle, PageEdit, CloudSunny, Calendar, GraphUp } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { CostOfGuessingContent, SectionContent } from "@/types/cms";

const PROBLEM_META = [
  { icon: WarningTriangle, impact: "$2,400" },
  { icon: MinusCircle, impact: "14%" },
  { icon: PageEdit, impact: "0%" },
];

const PRESSURE_META = [
  { icon: GraphUp, metric: "+18%" },
  { icon: CloudSunny, metric: "±30%" },
  { icon: Calendar, metric: "2.4×" },
  { icon: WarningTriangle, metric: "+42%" },
];

const CostOfGuessingSection = ({ dbContent }: { dbContent?: SectionContent<CostOfGuessingContent> }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: CostOfGuessingContent = dbContent?.[currentLang] || {
    badge: t("problem.badge"),
    title: t("problem.title"),
    subtitle: t("problem.subtitle"),
    problems: [
      { title: t("problem.items.overprep.title"), result: t("problem.items.overprep.result"), desc: t("problem.items.overprep.desc"), impact: t("problem.items.overprep.impact"), impactLabel: t("problem.items.overprep.impactLabel") },
      { title: t("problem.items.underprep.title"), result: t("problem.items.underprep.result"), desc: t("problem.items.underprep.desc"), impact: t("problem.items.underprep.impact"), impactLabel: t("problem.items.underprep.impactLabel") },
      { title: t("problem.items.spreadsheets.title"), result: t("problem.items.spreadsheets.result"), desc: t("problem.items.spreadsheets.desc"), impact: t("problem.items.spreadsheets.impact"), impactLabel: t("problem.items.spreadsheets.impactLabel") },
    ],
    pressures: [
      { title: t("whyNow.items.foodCosts.title"), desc: t("whyNow.items.foodCosts.desc"), metric: "+18%", metricLabel: t("whyNow.items.foodCosts.label") },
      { title: t("whyNow.items.weather.title"), desc: t("whyNow.items.weather.desc"), metric: "±30%", metricLabel: t("whyNow.items.weather.label") },
      { title: t("whyNow.items.events.title"), desc: t("whyNow.items.events.desc"), metric: "2.4×", metricLabel: t("whyNow.items.events.label") },
      { title: t("whyNow.items.delivery.title"), desc: t("whyNow.items.delivery.desc"), metric: "+42%", metricLabel: t("whyNow.items.delivery.label") },
    ],
    cta: t("whyNow.cta").replace(/<\/?gold>/g, ""),
  };

  return (
    <section className="py-20 md:py-28 border-t border-border/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-4 block">
            {content.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-3 sm:mb-4 leading-tight lg:leading-[1.15]">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.problems.map((p, i) => {
            const meta = PROBLEM_META[i];
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-5 sm:p-7 space-y-4 hover:border-primary/20 transition-colors duration-200"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <meta.icon className="h-4.5 w-4.5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-xs sm:text-sm font-medium text-primary">→ {p.result}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="pt-3 border-t border-border">
                  <span className="text-xl sm:text-2xl font-semibold text-foreground">{meta.impact}</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground ml-2">{p.impactLabel}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 sm:mt-5">
          {content.pressures.map((p, i) => {
            const meta = PRESSURE_META[i];
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/20 transition-colors duration-200"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                  <meta.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <div className="pt-2.5 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">{meta.metric}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">{p.metricLabel}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-base sm:text-lg text-foreground font-medium mt-10 sm:mt-14 px-2"
        >
          <span className="text-gradient-gold">{content.cta}</span>
        </motion.p>
      </div>
    </section>
  );
};

export default CostOfGuessingSection;
