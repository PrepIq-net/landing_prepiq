import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SunLight,
  Activity,
  StatsReport,
  Calendar,
  Clock,
  Cloud,
  GraphUp,
  WarningTriangle,
  CheckCircle,
  InfoCircle,
  DatabaseScript,
  UserStar,
  FlashOff,
} from "iconoir-react";
import { useTranslation } from "react-i18next";
import { HowItWorksContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";
import { GoldText } from "./GoldText";

type Phase = "plan" | "live" | "review";

const AUTO_ADVANCE_MS = 6000;
const NEXT_PHASE: Record<Phase, Phase> = {
  plan: "live",
  live: "review",
  review: "plan",
};

const transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const };
const SIGNAL_ICONS = [
  DatabaseScript,
  Calendar,
  Clock,
  SunLight,
  Cloud,
  UserStar,
  FlashOff,
  GraphUp,
];

const normalizeSignals = (signals: unknown): { label: string }[] => {
  if (Array.isArray(signals)) {
    return signals
      .map((signal) => {
        if (typeof signal === "string") return { label: signal };
        if (signal && typeof signal === "object" && "label" in signal) {
          const label = (signal as { label?: unknown }).label;
          return typeof label === "string" ? { label } : null;
        }
        return null;
      })
      .filter((signal): signal is { label: string } => Boolean(signal));
  }

  if (signals && typeof signals === "object") {
    return Object.values(signals as Record<string, unknown>)
      .map((value) => (typeof value === "string" ? { label: value } : null))
      .filter((signal): signal is { label: string } => Boolean(signal));
  }

  return [];
};

const HowItWorksSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<HowItWorksContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const [activePhase, setActivePhase] = useState<Phase>("plan");
  const [autoRotate, setAutoRotate] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });

  // Cycle through the three phases until the visitor takes over
  useEffect(() => {
    if (!autoRotate || !inView) return;
    const id = setInterval(
      () => setActivePhase((p) => NEXT_PHASE[p]),
      AUTO_ADVANCE_MS,
    );
    return () => clearInterval(id);
  }, [autoRotate, inView]);

  const fallbackContent: HowItWorksContent = {
    badge: t("howItWorks.badge"),
    title: t("howItWorks.title"),
    subtitle: t("howItWorks.subtitle"),
    signalsTitle: t("howItWorks.signalsTitle"),
    signals: [
      "sales",
      "patterns",
      "hours",
      "events",
      "weather",
      "chef",
      "stockouts",
      "trends",
    ].map((k) => ({ label: t(`howItWorks.signals.${k}`) })),
    phases: {
      plan: {
        label: t("howItWorks.phases.plan.label"),
        time: t("howItWorks.phases.plan.time"),
        desc: t("howItWorks.phases.plan.desc"),
        title: t("howItWorks.phases.plan.title"),
        body: t("howItWorks.phases.plan.body"),
      },
      live: {
        label: t("howItWorks.phases.live.label"),
        time: t("howItWorks.phases.live.time"),
        desc: t("howItWorks.phases.live.desc"),
        title: t("howItWorks.phases.live.title"),
        body: t("howItWorks.phases.live.body"),
      },
      review: {
        label: t("howItWorks.phases.review.label"),
        time: t("howItWorks.phases.review.time"),
        desc: t("howItWorks.phases.review.desc"),
        title: t("howItWorks.phases.review.title"),
        body: t("howItWorks.phases.review.body"),
      },
    },
    chefOverride: {
      title: t("howItWorks.chefOverride.title"),
      body: t("howItWorks.chefOverride.body"),
      simulate: t("howItWorks.previews.simulateOverride"),
      reset: t("howItWorks.previews.resetSimulation"),
    },
    liveFeatures: t("howItWorks.liveFeatures", { returnObjects: true }) as {
      title: string;
      desc: string;
    }[],
    reviewFeatures: t("howItWorks.reviewFeatures", { returnObjects: true }) as {
      title: string;
      desc: string;
    }[],
    comparison: {
      badge:
        currentLang === "fr"
          ? "Sans PrepIQ vs Avec PrepIQ"
          : "Without PrepIQ vs With PrepIQ",
      withoutLabel: t("kitchenTest.toggleWithout"),
      withLabel: t("kitchenTest.toggleWith"),
      dailyMarginLost: t("kitchenTest.dailyMarginLost"),
      dailyMarginRecovered: t("kitchenTest.dailyMarginRecovered"),
    },
  };

  const localizedContent = dbContent?.[currentLang] as
    | Partial<HowItWorksContent>
    | undefined;
  const content: HowItWorksContent = {
    ...fallbackContent,
    ...localizedContent,
    signals: normalizeSignals(
      localizedContent?.signals ?? fallbackContent.signals,
    ),
    phases: {
      ...fallbackContent.phases,
      ...(localizedContent?.phases ?? {}),
    },
    chefOverride: {
      ...fallbackContent.chefOverride,
      ...(localizedContent?.chefOverride ?? {}),
    },
    liveFeatures: Array.isArray(localizedContent?.liveFeatures)
      ? localizedContent.liveFeatures
      : fallbackContent.liveFeatures,
    reviewFeatures: Array.isArray(localizedContent?.reviewFeatures)
      ? localizedContent.reviewFeatures
      : fallbackContent.reviewFeatures,
    comparison: {
      ...fallbackContent.comparison,
      ...(localizedContent?.comparison ?? {}),
    },
  };

  const dataSignals = (content.signals ?? []).map((s, i) => ({
    ...s,
    icon: SIGNAL_ICONS[i],
  }));

  const phases: {
    id: Phase;
    step: number;
    icon: typeof SunLight;
    color: string;
    dot: string;
    bg: string;
  }[] = [
    {
      id: "plan",
      step: 1,
      icon: SunLight,
      color: "text-[hsl(var(--success))]",
      dot: "bg-[hsl(var(--success))]",
      bg: "bg-[hsl(var(--success)/.08)]",
    },
    {
      id: "live",
      step: 2,
      icon: Activity,
      color: "text-[hsl(var(--warning))]",
      dot: "bg-[hsl(var(--warning))]",
      bg: "bg-[hsl(var(--warning)/.08)]",
    },
    {
      id: "review",
      step: 3,
      icon: StatsReport,
      color: "text-primary",
      dot: "bg-primary",
      bg: "bg-primary/[0.08]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 md:py-32 border-t border-border/50 section-band scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 mb-12 md:mb-16"
        >
          <div className="max-w-[640px]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-px bg-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {content.badge}
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] text-balance">
              <GoldText text={content.title} />
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-[380px] leading-relaxed lg:mb-2">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-3 gap-4 mb-12 md:mb-14">
          {phases.map((p) => {
            const active = activePhase === p.id;
            const phaseContent = content.phases[p.id];
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePhase(p.id);
                  setAutoRotate(false);
                }}
                className={`group relative rounded-2xl overflow-hidden text-left border transition-colors duration-200 bg-card ${
                  active
                    ? "border-primary/45"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="h-[110px] overflow-hidden relative">
                  <img
                    src={`/images/phase-${p.id}.jpg`}
                    alt={phaseContent.label}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      active ? "opacity-100" : "opacity-45 grayscale-[0.6]"
                    }`}
                    style={{ filter: "saturate(0.92) brightness(0.96)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, hsl(var(--card)))" }} />
                  <span
                    className={`absolute top-3 left-4 text-[13px] font-semibold tracking-[0.1em] uppercase rounded-full px-3 py-1 backdrop-blur-sm ${
                      active ? p.color : "text-muted-foreground"
                    }`}
                    style={{ background: "hsl(240 7% 8% / 0.7)" }}
                  >
                    {phaseContent.time}
                  </span>
                </div>
                <div className="px-5 py-4">
                  <p
                    className={`font-display text-[17px] font-semibold mb-1 transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    0{p.step} — {phaseContent.label}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {phaseContent.desc}
                  </p>
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden ${
                    active ? "" : "bg-transparent"
                  }`}
                >
                  {active && autoRotate && inView ? (
                    <motion.div
                      key={activePhase}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: AUTO_ADVANCE_MS / 1000,
                        ease: "linear",
                      }}
                      className={`h-full w-full origin-left ${p.dot}`}
                    />
                  ) : active ? (
                    <div className={`h-full w-full ${p.dot}`} />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activePhase === "plan" && (
            <PlanPhase key="plan" content={content} dataSignals={dataSignals} />
          )}
          {activePhase === "live" && <LivePhase key="live" content={content} />}
          {activePhase === "review" && (
            <ReviewPhase key="review" content={content} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const PreviewCard = ({
  topBar,
  children,
}: {
  topBar: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden shadow-l2">
    <div className="flex items-center justify-between bg-accent/60 px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border/50">
      {topBar}
    </div>
    <div className="p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5">{children}</div>
  </div>
);

/* ─────────────────────── PLAN PHASE ─────────────────────── */
const PlanPhase = ({
  content,
  dataSignals,
}: {
  content: HowItWorksContent;
  dataSignals: { icon: any; label: string }[];
}) => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.resolvedLanguage === "fr";
  const [enabled, setEnabled] = useState<boolean[]>(
    dataSignals.map(() => true),
  );
  const [overrideQty, setOverrideQty] = useState(0);

  const confidence = useMemo(() => {
    const ratio = enabled.filter(Boolean).length / enabled.length;
    return Math.round(70 + ratio * 22);
  }, [enabled]);

  const toggleSignal = (i: number) =>
    setEnabled((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const wasteRiskCost = Math.max(0, overrideQty) * 1.24;
  const profit = Math.max(0, overrideQty) * 3.7;
  const stockoutRiskLabel =
    overrideQty < 0 ? (isFr ? "Élevé" : "High") : isFr ? "Faible" : "Low";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start"
    >
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-[hsl(var(--success)/.1)] flex items-center justify-center">
              <SunLight className="h-4 w-4 text-[hsl(var(--success))]" />
            </div>
            <span className="text-xs font-medium text-[hsl(var(--success))] uppercase tracking-widest">
              {content.phases.plan.time}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
            {content.phases.plan.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {content.phases.plan.body}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">
              {content.signalsTitle}
            </p>
            <span className="text-xs font-semibold text-primary">
              {confidence}% {isFr ? "confiance" : "confidence"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {dataSignals.map((s, i) => (
              <button
                key={s.label}
                onClick={() => toggleSignal(i)}
                className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border transition-colors duration-200 text-left ${
                  enabled[i]
                    ? "bg-accent/40 border-border/30"
                    : "bg-accent/10 border-border/10 opacity-50"
                }`}
              >
                <s.icon
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${enabled[i] ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="text-xs sm:text-sm text-foreground">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-border bg-card/80 p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <UserStar className="h-4.5 w-4.5 text-primary" />
            <p className="text-sm font-semibold text-foreground">
              {content.chefOverride.title}
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.chefOverride.body}
          </p>
        </div>
      </div>

      <PreviewCard
        topBar={
          <>
            <div className="flex items-center gap-2.5">
              <SunLight className="h-4 w-4 text-[hsl(var(--success))]" />
              <span className="text-sm font-medium text-foreground">
                {t("howItWorks.previews.morningForecast")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {isFr ? "Mardi 5 mars" : "Tuesday, Mar 5"}
            </span>
          </>
        }
      >
        {[
          { item: t("common.items.salmon"), qty: "25 kg", conf: 88 },
          { item: t("common.items.salad"), qty: "40 portions", conf: 82 },
          { item: t("common.items.soup"), qty: "15 L", conf: 91 },
        ].map((row, i) => (
          <div
            key={row.item}
            className="rounded-xl bg-accent/40 p-4 sm:p-5 space-y-3 border border-border/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {row.item[0]}
                </div>
                <p className="text-sm font-medium text-foreground">
                  {row.item}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-foreground">
                  {row.qty}
                </p>
                <span className="text-xs font-medium text-[hsl(var(--success))]">
                  {row.conf}% conf.
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[hsl(var(--success))]"
                initial={{ width: 0 }}
                animate={{ width: `${row.conf}%` }}
                transition={{ delay: 0.1 * i, duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-primary/25 bg-primary/[0.03] p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {isFr ? "Saumon grillé" : "Grilled Salmon"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOverrideQty((q) => Math.max(-3, q - 1))}
                className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-sm text-foreground hover:border-primary/40 transition-colors"
              >
                −
              </button>
              <span className="text-xs sm:text-sm font-medium text-foreground w-14 text-center">
                {overrideQty > 0 ? "+" : ""}
                {overrideQty} kg
              </span>
              <button
                onClick={() => setOverrideQty((q) => Math.min(8, q + 1))}
                className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-sm text-foreground hover:border-primary/40 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {overrideQty !== 0 && (
            <>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                    {t("howItWorks.previews.impact.wasteRisk")}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-destructive">
                    {isFr
                      ? `${wasteRiskCost.toFixed(2)} €`
                      : `$${wasteRiskCost.toFixed(2)}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                    {t("howItWorks.previews.impact.stockoutRisk")}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-[hsl(var(--success))]">
                    {stockoutRiskLabel}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                    {t("howItWorks.previews.impact.profit")}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-primary">
                    {isFr ? `${profit.toFixed(2)} €` : `$${profit.toFixed(2)}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                    {t("howItWorks.previews.impact.accuracy")}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    67%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOverrideQty(0)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {content.chefOverride.reset}
              </button>
            </>
          )}
        </div>
      </PreviewCard>
    </motion.div>
  );
};

/* ─────────────────────── LIVE PHASE ─────────────────────── */
const LivePhase = ({ content }: { content: HowItWorksContent }) => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.resolvedLanguage === "fr";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start"
    >
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-[hsl(var(--warning)/.1)] flex items-center justify-center">
              <Activity className="h-4 w-4 text-[hsl(var(--warning))]" />
            </div>
            <span className="text-xs font-medium text-[hsl(var(--warning))] uppercase tracking-widest">
              {content.phases.live.time}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
            {content.phases.live.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {content.phases.live.body}
          </p>
        </div>

        <div className="space-y-3">
          {content.liveFeatures.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 sm:gap-4 rounded-xl bg-accent/40 border border-border/20 px-4 sm:px-5 py-3 sm:py-4"
            >
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PreviewCard
        topBar={
          <>
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              <span className="text-sm font-medium text-[hsl(var(--success))]">
                {t("howItWorks.previews.liveService")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              14:34 · {isFr ? "68 % du service" : "68% through service"}
            </span>
          </>
        }
      >
        {[
          {
            item: t("common.items.salmon"),
            sold: "18 kg",
            left: "12 kg",
            pct: 60,
            status: "on-track" as const,
            eta: t("howItWorks.previews.enoughUntilClose"),
          },
          {
            item: t("common.items.salad"),
            sold: "32 portions",
            left: "8 portions",
            pct: 80,
            status: "warning" as const,
            eta: t("howItWorks.previews.mayRunOut", { time: "16:00" }),
          },
          {
            item: t("common.items.soup"),
            sold: "13 L",
            left: "2 L",
            pct: 87,
            status: "critical" as const,
            eta: t("howItWorks.previews.stockLeft", { minutes: "25" }),
          },
        ].map((row) => (
          <div
            key={row.item}
            className="rounded-xl bg-accent/40 border border-border/20 p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                    row.status === "on-track"
                      ? "bg-[hsl(var(--success)/.1)] text-[hsl(var(--success))]"
                      : row.status === "warning"
                        ? "bg-[hsl(var(--warning)/.1)] text-[hsl(var(--warning))]"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {row.item[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {row.item}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {isFr ? "Vendu" : "Sold"}: {row.sold}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-foreground">
                  {row.left}
                </p>
                <span
                  className={`text-xs font-medium ${row.status === "on-track" ? "text-[hsl(var(--success))]" : row.status === "warning" ? "text-[hsl(var(--warning))]" : "text-destructive"}`}
                >
                  {row.status === "on-track"
                    ? t("howItWorks.previews.onTrack")
                    : row.status === "warning"
                      ? t("howItWorks.previews.lowStock")
                      : t("howItWorks.previews.alert")}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${row.status === "on-track" ? "bg-[hsl(var(--success))]" : row.status === "warning" ? "bg-[hsl(var(--warning))]" : "bg-destructive"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{row.eta}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <WarningTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t("howItWorks.previews.stockoutRisk", {
                  item: isFr ? "Soupe Tomate" : "Tomato Soup",
                })}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("howItWorks.previews.stockoutRiskBody", { minutes: "25" })}
              </p>
            </div>
          </div>
        </div>
      </PreviewCard>
    </motion.div>
  );
};

/* ─────────────────────── REVIEW PHASE ─────────────────────── */
const ReviewPhase = ({ content }: { content: HowItWorksContent }) => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.resolvedLanguage === "fr";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start"
    >
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/[0.1] flex items-center justify-center">
              <StatsReport className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-widest">
              {content.phases.review.time}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
            {content.phases.review.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {content.phases.review.body}
          </p>
        </div>

        {/* Without vs With comparison strip */}
        <div className="rounded-xl border border-border bg-card/80 p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-3">
            {content.comparison.badge}
          </p>
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="pr-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">
                {content.comparison.withoutLabel}
              </p>
              <p className="text-xl font-semibold text-destructive">−$106</p>
              <p className="text-[11px] text-muted-foreground/60">
                {content.comparison.dailyMarginLost}
              </p>
            </div>
            <div className="pl-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">
                {content.comparison.withLabel}
              </p>
              <p className="text-xl font-semibold text-[hsl(var(--success))]">
                +$55
              </p>
              <p className="text-[11px] text-muted-foreground/60">
                {content.comparison.dailyMarginRecovered}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {content.reviewFeatures.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 sm:gap-4 rounded-xl bg-accent/40 border border-border/20 px-4 sm:px-5 py-3 sm:py-4"
            >
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PreviewCard
        topBar={
          <>
            <div className="flex items-center gap-2.5">
              <StatsReport className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {t("howItWorks.previews.endOfDayReport")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {isFr ? "Mardi 5 mars" : "Tuesday, Mar 5"}
            </span>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              label: t("howItWorks.previews.stats.wasteSaved"),
              value: "$38",
              sub: t("howItWorks.previews.stats.vsLastWeek"),
              color: "text-[hsl(var(--success))]",
            },
            {
              label: t("howItWorks.previews.stats.forecastAccuracy"),
              value: "91%",
              sub: t("howItWorks.previews.stats.fromYesterday", { pct: "3" }),
              color: "text-primary",
            },
            {
              label: t("howItWorks.previews.stats.stockoutEvents"),
              value: "0",
              sub: t("howItWorks.previews.stats.target", { count: "2" }),
              color: "text-[hsl(var(--success))]",
            },
            {
              label: t("howItWorks.previews.stats.revenueProtected"),
              value: "$124",
              sub: t("howItWorks.previews.stats.noMissedSales"),
              color: "text-primary",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-accent/40 border border-border/20 p-3 sm:p-5 text-center"
            >
              <p
                className={`text-lg sm:text-2xl font-display font-semibold ${stat.color}`}
              >
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-foreground mt-1 sm:mt-1.5 font-medium">
                {stat.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 mt-0.5">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">
            {t("howItWorks.previews.itemPerformance")}
          </p>
          {[
            {
              item: t("common.items.salmon"),
              forecast: "25 kg",
              actual: "23 kg",
              waste: isFr ? "2 kg (3,40 €)" : "2 kg ($3.40)",
              accuracy: "92%",
            },
            {
              item: t("common.items.salad"),
              forecast: "40 portions",
              actual: "38 portions",
              waste: isFr ? "2 portions (4,00 €)" : "2 portions ($4.00)",
              accuracy: "95%",
            },
            {
              item: t("common.items.soup"),
              forecast: "15 L",
              actual: "15 L",
              waste: "0 L",
              accuracy: "100%",
            },
          ].map((row) => (
            <div
              key={row.item}
              className="rounded-xl bg-accent/40 border border-border/20 px-4 sm:px-5 py-3 sm:py-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">
                  {row.item}
                </p>
                <span className="text-xs font-medium text-[hsl(var(--success))] bg-[hsl(var(--success)/.1)] px-2 py-0.5 rounded-md">
                  {row.accuracy}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                <span>
                  {isFr ? "Prévu" : "Forecast"}:{" "}
                  <span className="text-foreground font-medium">
                    {row.forecast}
                  </span>
                </span>
                <span>
                  {isFr ? "Réel" : "Actual"}:{" "}
                  <span className="text-foreground font-medium">
                    {row.actual}
                  </span>
                </span>
                <span
                  className={
                    row.waste.startsWith("0")
                      ? "text-[hsl(var(--success))]"
                      : "text-[hsl(var(--warning))]"
                  }
                >
                  {isFr ? "Perte" : "Waste"}: {row.waste}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-primary/5 border border-primary/15 px-4 sm:px-5 py-3 sm:py-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GraphUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {t("howItWorks.previews.modelUpdated")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t("howItWorks.previews.modelUpdatedBody")}
            </p>
          </div>
        </div>
      </PreviewCard>
    </motion.div>
  );
};

export default HowItWorksSection;
