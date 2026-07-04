import { motion } from "framer-motion";
import {
  WarningTriangle,
  MinusCircle,
  PageEdit,
  CloudSunny,
  Calendar,
  GraphUp,
} from "iconoir-react";
import { useTranslation } from "react-i18next";
import { CostOfGuessingContent, SectionContent } from "@/types/cms";
import { CountUp, SeamAccent } from "./motion-primitives";

const PROBLEM_META = [
  {
    icon: WarningTriangle,
    impact: "$2,400",
    color: "hsl(var(--warning))",
    bg: "hsl(var(--warning) / 0.08)",
    border: "hsl(var(--warning) / 0.18)",
  },
  {
    icon: MinusCircle,
    impact: "14%",
    color: "hsl(var(--destructive))",
    bg: "hsl(var(--destructive) / 0.08)",
    border: "hsl(var(--destructive) / 0.18)",
  },
  {
    icon: PageEdit,
    impact: "0%",
    color: "hsl(var(--info))",
    bg: "hsl(var(--info) / 0.08)",
    border: "hsl(var(--info) / 0.18)",
  },
];

const PRESSURE_META = [
  { icon: GraphUp, metric: "+18%" },
  { icon: CloudSunny, metric: "±30%" },
  { icon: Calendar, metric: "2.4×" },
  { icon: WarningTriangle, metric: "+42%" },
];

const PRESSURE_COLOR = {
  color: "hsl(var(--warning))",
  bg: "hsl(var(--warning) / 0.08)",
  border: "hsl(var(--warning) / 0.18)",
};

const CostOfGuessingSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<CostOfGuessingContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: CostOfGuessingContent = dbContent?.[currentLang] || {
    badge: t("problem.badge"),
    title: t("problem.title"),
    subtitle: t("problem.subtitle"),
    problems: [
      {
        title: t("problem.items.overprep.title"),
        result: t("problem.items.overprep.result"),
        desc: t("problem.items.overprep.desc"),
        impact: t("problem.items.overprep.impact"),
        impactLabel: t("problem.items.overprep.impactLabel"),
      },
      {
        title: t("problem.items.underprep.title"),
        result: t("problem.items.underprep.result"),
        desc: t("problem.items.underprep.desc"),
        impact: t("problem.items.underprep.impact"),
        impactLabel: t("problem.items.underprep.impactLabel"),
      },
      {
        title: t("problem.items.spreadsheets.title"),
        result: t("problem.items.spreadsheets.result"),
        desc: t("problem.items.spreadsheets.desc"),
        impact: t("problem.items.spreadsheets.impact"),
        impactLabel: t("problem.items.spreadsheets.impactLabel"),
      },
    ],
    pressures: [
      {
        title: t("whyNow.items.foodCosts.title"),
        desc: t("whyNow.items.foodCosts.desc"),
        metric: "+18%",
        metricLabel: t("whyNow.items.foodCosts.label"),
      },
      {
        title: t("whyNow.items.weather.title"),
        desc: t("whyNow.items.weather.desc"),
        metric: "±30%",
        metricLabel: t("whyNow.items.weather.label"),
      },
      {
        title: t("whyNow.items.events.title"),
        desc: t("whyNow.items.events.desc"),
        metric: "2.4×",
        metricLabel: t("whyNow.items.events.label"),
      },
      {
        title: t("whyNow.items.delivery.title"),
        desc: t("whyNow.items.delivery.desc"),
        metric: "+42%",
        metricLabel: t("whyNow.items.delivery.label"),
      },
    ],
    cta: t("whyNow.cta").replace(/<\/?gold>/g, ""),
  };

  const problems = Array.isArray(content.problems) ? content.problems : [];
  const pressures = Array.isArray(content.pressures) ? content.pressures : [];

  return (
    <section className="relative py-20 md:py-28 border-t border-border/50 section-band">
      <SeamAccent />
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
          {problems.map((p, i) => {
            const meta = PROBLEM_META[i];
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-5 sm:p-7 space-y-4 hover:border-primary/25 hover:shadow-l3 transition-[border-color,box-shadow] duration-200"
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: meta.bg,
                    border: `1px solid ${meta.border}`,
                  }}
                >
                  <meta.icon
                    className="h-4.5 w-4.5"
                    style={{ color: meta.color }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {p.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: meta.color }}
                  >
                    → {p.result}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
                <div className="pt-3 border-t border-border">
                  <CountUp
                    value={meta.impact}
                    className="text-xl sm:text-2xl font-semibold text-foreground"
                  />
                  <span className="text-[11px] sm:text-xs text-muted-foreground ml-2">
                    {p.impactLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 sm:mt-5">
          {pressures.map((p, i) => {
            const meta = PRESSURE_META[i];
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-l3 transition-[border-color,box-shadow] duration-200"
                style={{ borderColor: PRESSURE_COLOR.border }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: PRESSURE_COLOR.bg,
                    border: `1px solid ${PRESSURE_COLOR.border}`,
                  }}
                >
                  <meta.icon
                    className="h-4 w-4"
                    style={{ color: PRESSURE_COLOR.color }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border/70">
                  <span style={{ color: PRESSURE_COLOR.color }}>
                    <CountUp
                      value={meta.metric}
                      className="text-lg font-semibold"
                    />
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-2">
                    {p.metricLabel}
                  </span>
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
