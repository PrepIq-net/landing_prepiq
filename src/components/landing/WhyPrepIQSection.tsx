import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyPrepIQSection = () => {
  const { t } = useTranslation();

  const points = [
    {
      icon: AlertTriangle,
      highlight: t("whyPrepIQ.points.0.highlight"),
      body: t("whyPrepIQ.points.0.body"),
    },
    {
      icon: TrendingUp,
      highlight: t("whyPrepIQ.points.1.highlight"),
      body: t("whyPrepIQ.points.1.body"),
    },
    {
      icon: Brain,
      highlight: t("whyPrepIQ.points.2.highlight"),
      body: t("whyPrepIQ.points.2.body"),
    },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="section-container px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm font-medium uppercase tracking-widest text-primary mb-4"
        >
          {t("whyPrepIQ.badge")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-5 sm:mb-6 px-2 leading-tight lg:leading-[1.15]"
        >
          {t("whyPrepIQ.title")}
        </motion.h2>

        <div className="mt-8 sm:mt-14 space-y-6 sm:space-y-10 text-left">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="flex items-start gap-3 sm:gap-5"
            >
              <div className="flex-shrink-0 mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{p.highlight}</span>{" "}
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 sm:mt-14 text-xs sm:text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 sm:pl-4 text-left"
        >
          {t("whyPrepIQ.footer")}
        </motion.p>
      </div>
    </section>
  );
};

export default WhyPrepIQSection;
