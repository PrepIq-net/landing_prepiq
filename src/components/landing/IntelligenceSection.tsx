"use client";
import { motion } from "framer-motion";
import {
  Calendar,
  Cloud,
  DatabaseScript,
  GraphUp,
  User,
  WarningTriangle,
} from "iconoir-react";
import { useTranslation } from "react-i18next";
import { IntelligenceContent, SectionContent } from "@/types/cms";

const SIGNAL_ICONS = [
  DatabaseScript,
  Calendar,
  Cloud,
  GraphUp,
  WarningTriangle,
  User,
];

const normalizeSignals = (
  signals: unknown,
): { label: string; desc: string }[] => {
  if (Array.isArray(signals)) {
    return signals
      .map((signal) => {
        if (signal && typeof signal === "object") {
          const label = (signal as { label?: unknown }).label;
          const desc = (signal as { desc?: unknown }).desc;
          return typeof label === "string" && typeof desc === "string"
            ? { label, desc }
            : null;
        }
        if (typeof signal === "string") {
          return { label: signal, desc: "" };
        }
        return null;
      })
      .filter((signal): signal is { label: string; desc: string } =>
        Boolean(signal),
      );
  }

  return [];
};

const IntelligenceSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<IntelligenceContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const fallbackContent: IntelligenceContent = {
    badge: t("intelligence.badge", "Intelligence Layer"),
    title: t(
      "intelligence.title",
      "Six signals. One number your chef can trust.",
    ),
    subtitle: t(
      "intelligence.subtitle",
      "PrepIQ tracks what no team could follow manually — and folds it into one reliable forecast, every morning.",
    ),
    signals: [
      {
        label: t("intelligence.signals.sales.label", "Last 30 days of sales"),
        desc: t(
          "intelligence.signals.sales.desc",
          "Every transaction teaches the forecast engine what your kitchen actually sells.",
        ),
      },
      {
        label: t(
          "intelligence.signals.patterns.label",
          "Day-of-week demand patterns",
        ),
        desc: t(
          "intelligence.signals.patterns.desc",
          "Tuesday lunch ≠ Saturday dinner. PrepIQ knows the difference.",
        ),
      },
      {
        label: t("intelligence.signals.weather.label", "Weather shifts"),
        desc: t(
          "intelligence.signals.weather.desc",
          "Rain at 2 PM? Soup demand historically rises 18% on wet days.",
        ),
      },
      {
        label: t(
          "intelligence.signals.events.label",
          "Local events & holidays",
        ),
        desc: t(
          "intelligence.signals.events.desc",
          "A nearby football match tonight means chicken demand spikes.",
        ),
      },
      {
        label: t("intelligence.signals.stockouts.label", "Recent stockouts"),
        desc: t(
          "intelligence.signals.stockouts.desc",
          "Yesterday's salmon stockout? PrepIQ auto-adjusts so it doesn't repeat.",
        ),
      },
      {
        label: t("intelligence.signals.chef.label", "Chef adjustments"),
        desc: t(
          "intelligence.signals.chef.desc",
          "Every override a chef makes trains the model to be smarter next time.",
        ),
      },
    ],
    footer: t(
      "intelligence.footer",
      "Signal weights are dynamic — they shift as PrepIQ learns your kitchen's unique patterns.",
    ),
    pipelineTitle: "",
    pipelineSteps: [],
    alerts: [],
    atRiskLabel: "",
    suggestedLabel: "",
    leakTypes: [],
    totalProtectionLabel: "",
    roiNote: "",
    whyBadge: "",
    whyPoints: [],
    whyFooter: "",
  };

  const localizedContent = dbContent?.[currentLang] as
    | Partial<IntelligenceContent>
    | undefined;
  const content: IntelligenceContent = {
    ...fallbackContent,
    ...localizedContent,
    signals: normalizeSignals(
      localizedContent?.signals ?? fallbackContent.signals,
    ),
  };

  return (
    <section
      id="intelligence"
      className="relative py-24 md:py-36 border-t border-border/50 scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24 items-start">
          {/* Left: Sticky sidebar */}
          <div className="lg:sticky lg:top-[120px]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-px bg-primary" />
              <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {content.badge}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-[52px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-5 text-balance">
              {content.title}
            </h2>
            <p className="text-base text-sm md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-[400px]">
              {content.subtitle}
            </p>

            {/* Photo card */}
            <div
              className="rounded-2xl overflow-hidden relative shadow-l2"
              style={{ aspectRatio: "16/10" }}
            >
              <img
                src="/images/analytics-dashboard.jpg"
                alt="Analytics dashboard"
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.92) brightness(0.96)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(240 7% 8% / 0.2), hsl(240 7% 8% / 0.7))",
                }}
              />
              <div className="absolute bottom-5 left-5">
                <p className="font-display text-[32px] font-semibold text-primary">
                  $4,140
                </p>
                <p className="text-xs uppercase tracking-[0.15em] text-foreground/60 mt-0.5">
                  margin protected monthly
                </p>
              </div>
            </div>
          </div>

          {/* Right: Signal rows */}
          <div className="flex flex-col">
            {(content.signals ?? []).map((s, i) => {
              const Icon = SIGNAL_ICONS[i];
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[56px_1fr_auto] gap-6 items-center py-7 px-2 border-t border-border hover:bg-accent/25 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/[0.08] border border-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-[17px] font-semibold text-foreground mb-1">
                      {s.label}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[480px]">
                      {s.desc}
                    </p>
                  </div>
                  <span className="font-display text-[13px] font-semibold text-muted-foreground/40">
                    0{i + 1}
                  </span>
                </motion.div>
              );
            })}
            <div className="border-t border-border" />
            <p className="text-[13px] text-muted-foreground/50 mt-6 px-2">
              {content.footer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
