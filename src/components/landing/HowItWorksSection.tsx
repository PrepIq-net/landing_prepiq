import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useTranslation, Trans } from "react-i18next";

type Phase = "plan" | "live" | "review";

const transition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const };

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const [activePhase, setActivePhase] = useState<Phase>("plan");

  const dataSignals = [
    { icon: DatabaseScript, label: t("howItWorks.signals.sales") },
    { icon: Calendar, label: t("howItWorks.signals.patterns") },
    { icon: Clock, label: t("howItWorks.signals.hours") },
    { icon: SunLight, label: t("howItWorks.signals.events") },
    { icon: Cloud, label: t("howItWorks.signals.weather") },
    { icon: UserStar, label: t("howItWorks.signals.chef") },
    { icon: FlashOff, label: t("howItWorks.signals.stockouts") },
    { icon: GraphUp, label: t("howItWorks.signals.trends") },
  ];

  const phases: { id: Phase; step: number; label: string; time: string; desc: string; icon: typeof SunLight; color: string; dot: string; bg: string }[] = [
    { id: "plan", step: 1, label: t("howItWorks.phases.plan.label"), time: t("howItWorks.phases.plan.time"), desc: t("howItWorks.phases.plan.desc"), icon: SunLight, color: "text-[hsl(var(--success))]", dot: "bg-[hsl(var(--success))]", bg: "bg-[hsl(var(--success)/.08)]" },
    { id: "live", step: 2, label: t("howItWorks.phases.live.label"), time: t("howItWorks.phases.live.time"), desc: t("howItWorks.phases.live.desc"), icon: Activity, color: "text-[hsl(var(--warning))]", dot: "bg-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning)/.08)]" },
    { id: "review", step: 3, label: t("howItWorks.phases.review.label"), time: t("howItWorks.phases.review.time"), desc: t("howItWorks.phases.review.desc"), icon: StatsReport, color: "text-primary", dot: "bg-primary", bg: "bg-primary/[0.08]" },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-border/50">
      <div className="section-container px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20 px-2"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">
            {t("howItWorks.badge")}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
            <Trans
              i18nKey="howItWorks.title"
              components={{ gold: <span className="text-gradient-gold" /> }}
            />
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* TODO: Video walkthrough — uncomment and replace with your video URL when ready
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-12 md:mb-20"
        >
          <div className="relative rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden group">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="YOUR_VIDEO_EMBED_URL"
                title="How PrepIQ Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs sm:text-sm text-muted-foreground">60-second walkthrough</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground/50">Plan → Monitor → Learn</span>
            </div>
          </div>
        </motion.div>
        */}

        {/* Phase selector — redesigned as cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 md:mb-16 max-w-3xl mx-auto">
          {phases.map((p) => {
            const active = activePhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`group relative rounded-xl sm:rounded-2xl px-3 py-3 sm:px-6 sm:py-5 text-left transition-all duration-300 border ${
                  active
                    ? `border-border bg-card shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.08)]`
                    : "border-transparent hover:bg-card/50 hover:border-border/50"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    active ? p.bg : "bg-accent"
                  }`}>
                    <span className={`text-[10px] sm:text-xs font-bold transition-colors ${active ? p.color : "text-muted-foreground"}`}>
                      {p.step}
                    </span>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {p.label}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground/60">{p.time}</p>
                  </div>
                </div>
                <p className={`text-[10px] sm:text-xs transition-colors hidden sm:block ${active ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                  {p.desc}
                </p>
                {/* Active indicator line */}
                {active && (
                  <motion.div
                    layoutId="phase-indicator"
                    className={`absolute bottom-0 left-6 right-6 h-[2px] rounded-full ${p.dot}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Phase content */}
        <AnimatePresence mode="wait">
          {activePhase === "plan" && <PlanPhase key="plan" dataSignals={dataSignals} />}
          {activePhase === "live" && <LivePhase key="live" />}
          {activePhase === "review" && <ReviewPhase key="review" />}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─────────────────────── Shared card shell ─────────────────────── */
const PreviewCard = ({ topBar, children }: { topBar: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.25)]">
    <div className="flex items-center justify-between bg-accent/60 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border/50">
      {topBar}
    </div>
    <div className="p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5">{children}</div>
  </div>
);

/* ─────────────────────── PLAN PHASE ─────────────────────── */
const PlanPhase = ({ dataSignals }: { dataSignals: { icon: any, label: string }[] }) => {
  const { t, i18n } = useTranslation();
  const [overrideActive, setOverrideActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={transition}
      className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start"
    >
      {/* Left: Narrative */}
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-[hsl(var(--success)/.1)] flex items-center justify-center">
              <SunLight className="h-4 w-4 text-[hsl(var(--success))]" />
            </div>
            <span className="text-xs font-medium text-[hsl(var(--success))] uppercase tracking-widest">{t("howItWorks.phases.plan.time")}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
            {t("howItWorks.phases.plan.title")}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {t("howItWorks.phases.plan.body")}
          </p>
        </div>

        {/* Data signals grid */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-medium">
            {t("howItWorks.signalsTitle")}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {dataSignals.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-2 sm:gap-3 rounded-xl bg-accent/40 px-3 sm:px-4 py-2.5 sm:py-3 border border-border/30"
              >
                <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm text-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chef override narrative */}
        <div className="rounded-xl sm:rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <UserStar className="h-4.5 w-4.5 text-primary" />
            <p className="text-sm font-semibold text-foreground">{t("howItWorks.chefOverride.title")}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("howItWorks.chefOverride.body")}
          </p>
        </div>
      </div>

      {/* Right: Interactive preview */}
      <PreviewCard
        topBar={
          <>
            <div className="flex items-center gap-2.5">
              <SunLight className="h-4 w-4 text-[hsl(var(--success))]" />
              <span className="text-sm font-medium text-foreground">{t("howItWorks.previews.morningForecast")}</span>
            </div>
            <span className="text-xs text-muted-foreground">{i18n.resolvedLanguage === 'fr' ? 'Mardi 5 mars' : 'Tuesday, Mar 5'}</span>
          </>
        }
      >
        {/* Forecast rows */}
        {[
          { item: t("common.items.salmon"), qty: "25 kg", conf: 88, sold: t("howItWorks.previews.impact.note", { day: t("howItWorks.previews.stats.marchDate") }).split(".")[1].trim() },
          { item: t("common.items.salad"), qty: "40 portions", conf: 82, sold: t("howItWorks.previews.impact.note", { day: t("howItWorks.previews.stats.marchDate") }).split(".")[1].trim() },
          { item: t("common.items.soup"), qty: "15 L", conf: 91, sold: t("howItWorks.previews.impact.note", { day: t("howItWorks.previews.stats.marchDate") }).split(".")[1].trim() },
        ].map((row, i) => (
          <motion.div
            key={row.item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="rounded-xl bg-accent/40 p-4 sm:p-5 space-y-3 border border-border/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {row.item[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{row.item}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{row.sold}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-foreground">{row.qty}</p>
                <span className="text-xs font-medium text-[hsl(var(--success))]">{row.conf}% conf.</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[hsl(var(--success))]"
                initial={{ width: 0 }}
                animate={{ width: `${row.conf}%` }}
                transition={{ delay: 0.5 + i * 0.12, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}

        {/* Override simulation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          {!overrideActive ? (
            <button
              onClick={() => setOverrideActive(true)}
              className="w-full rounded-xl border border-dashed border-primary/30 py-4 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              {t("howItWorks.previews.simulateOverride")}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="rounded-xl border border-[hsl(var(--warning)/.25)] bg-[hsl(var(--warning)/.05)] p-4 sm:p-5 space-y-3 sm:space-y-4">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                   <div className="flex items-center gap-2.5">
                     <WarningTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
                     <span className="text-xs sm:text-sm font-medium text-foreground">{i18n.resolvedLanguage === 'fr' ? 'Saumon grillé' : 'Grilled Salmon'} → 30 kg</span>
                   </div>
                   <span className="text-[10px] sm:text-xs text-[hsl(var(--warning))] font-medium bg-[hsl(var(--warning)/.1)] px-2.5 py-1 rounded-md w-fit">{i18n.resolvedLanguage === 'fr' ? '+5 kg correction' : '+5 kg override'}</span>
                 </div>

                <div className="h-px bg-border" />

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: t("howItWorks.previews.impact.wasteRisk"), value: t("common.currency", { val: "6.20" }), color: "text-destructive" },
                    { label: t("howItWorks.previews.impact.stockoutRisk"), value: i18n.resolvedLanguage === 'fr' ? "Faible" : "Low", color: "text-[hsl(var(--success))]" },
                    { label: t("howItWorks.previews.impact.profit"), value: t("common.currency", { val: "18.50" }), color: "text-primary" },
                    { label: t("howItWorks.previews.impact.accuracy"), value: "67%", color: "text-foreground" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">{s.label}</p>
                      <p className={`text-sm sm:text-base font-semibold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-accent/60 px-3 sm:px-4 py-2.5 sm:py-3">
                  <InfoCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <Trans
                      i18nKey="howItWorks.previews.impact.note"
                      values={{ day: i18n.resolvedLanguage === 'fr' ? 'mardi' : 'Tuesday', pct: '8', prevDay: i18n.resolvedLanguage === 'fr' ? 'lundi' : 'Monday', acc: '67' }}
                      components={{ primary: <span className="text-primary font-medium" /> }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOverrideActive(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("howItWorks.previews.resetSimulation")}
              </button>
            </motion.div>
          )}
        </motion.div>
      </PreviewCard>
    </motion.div>
  );
};

/* ─────────────────────── LIVE PHASE ─────────────────────── */
const LivePhase = () => {
  const { t, i18n } = useTranslation();
  const features = t("howItWorks.liveFeatures", { returnObjects: true }) as { title: string, desc: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={transition}
      className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start"
    >
      {/* Left */}
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-[hsl(var(--warning)/.1)] flex items-center justify-center">
              <Activity className="h-4 w-4 text-[hsl(var(--warning))]" />
            </div>
            <span className="text-xs font-medium text-[hsl(var(--warning))] uppercase tracking-widest">{t("howItWorks.phases.live.time")}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
            {t("howItWorks.phases.live.title")}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {t("howItWorks.phases.live.body")}
          </p>
        </div>

        <div className="space-y-3">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-start gap-3 sm:gap-4 rounded-xl bg-accent/40 border border-border/20 px-4 sm:px-5 py-3 sm:py-4"
            >
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right */}
      <PreviewCard
        topBar={
          <>
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              <span className="text-sm font-medium text-[hsl(var(--success))]">{t("howItWorks.previews.liveService")}</span>
            </div>
            <span className="text-xs text-muted-foreground">14:34 · {i18n.resolvedLanguage === 'fr' ? '68 % du service' : '68% through service'}</span>
          </>
        }
      >
        {[
          { item: t("common.items.salmon"), sold: "18 kg", left: "12 kg", pct: 60, status: "on-track" as const, eta: t("howItWorks.previews.enoughUntilClose") },
          { item: t("common.items.salad"), sold: "32 portions", left: "8 portions", pct: 80, status: "warning" as const, eta: t("howItWorks.previews.mayRunOut", { time: "16:00" }) },
          { item: t("common.items.soup"), sold: "13 L", left: "2 L", pct: 87, status: "critical" as const, eta: t("howItWorks.previews.stockLeft", { minutes: "25" }) },
        ].map((row, i) => (
          <motion.div
            key={row.item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="rounded-xl bg-accent/40 border border-border/20 p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  row.status === "on-track" ? "bg-[hsl(var(--success)/.1)] text-[hsl(var(--success))]" :
                  row.status === "warning" ? "bg-[hsl(var(--warning)/.1)] text-[hsl(var(--warning))]" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {row.item[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{row.item}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{i18n.resolvedLanguage === 'fr' ? 'Vendu' : 'Sold'}: {row.sold}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-foreground">{row.left}</p>
                <span className={`text-xs font-medium ${
                  row.status === "on-track" ? "text-[hsl(var(--success))]" :
                  row.status === "warning" ? "text-[hsl(var(--warning))]" :
                  "text-destructive"
                }`}>
                  {row.status === "on-track" ? t("howItWorks.previews.onTrack") : row.status === "warning" ? t("howItWorks.previews.lowStock") : t("howItWorks.previews.alert")}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    row.status === "on-track" ? "bg-[hsl(var(--success))]" :
                    row.status === "warning" ? "bg-[hsl(var(--warning))]" :
                    "bg-destructive"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{row.eta}</p>
            </div>
          </motion.div>
        ))}

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <WarningTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">{t("howItWorks.previews.stockoutRisk", { item: i18n.resolvedLanguage === 'fr' ? 'Soupe Tomate' : 'Tomato Soup' })}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("howItWorks.previews.stockoutRiskBody", { minutes: "25" })}
              </p>
            </div>
          </div>
        </motion.div>
      </PreviewCard>
    </motion.div>
  );
};

/* ─────────────────────── REVIEW PHASE ─────────────────────── */
const ReviewPhase = () => {
  const { t, i18n } = useTranslation();
  const features = t("howItWorks.reviewFeatures", { returnObjects: true }) as { title: string, desc: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={transition}
      className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start"
    >
      {/* Left */}
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/[0.1] flex items-center justify-center">
              <StatsReport className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-widest">{t("howItWorks.phases.review.time")}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
            {t("howItWorks.phases.review.title")}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {t("howItWorks.phases.review.body")}
          </p>
        </div>

        <div className="space-y-3">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-start gap-3 sm:gap-4 rounded-xl bg-accent/40 border border-border/20 px-4 sm:px-5 py-3 sm:py-4"
            >
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right */}
      <PreviewCard
        topBar={
          <>
            <div className="flex items-center gap-2.5">
              <StatsReport className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t("howItWorks.previews.endOfDayReport")}</span>
            </div>
            <span className="text-xs text-muted-foreground">{i18n.resolvedLanguage === 'fr' ? 'Mardi 5 mars' : 'Tuesday, Mar 5'}</span>
          </>
        }
      >
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: t("howItWorks.previews.stats.wasteSaved"), value: "$38", sub: t("howItWorks.previews.stats.vsLastWeek"), color: "text-[hsl(var(--success))]" },
            { label: t("howItWorks.previews.stats.forecastAccuracy"), value: "91%", sub: t("howItWorks.previews.stats.fromYesterday", { pct: "3" }), color: "text-primary" },
            { label: t("howItWorks.previews.stats.stockoutEvents"), value: "0", sub: t("howItWorks.previews.stats.target", { count: "2" }), color: "text-[hsl(var(--success))]" },
            { label: t("howItWorks.previews.stats.revenueProtected"), value: "$124", sub: t("howItWorks.previews.stats.noMissedSales"), color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="rounded-xl bg-accent/40 border border-border/20 p-3 sm:p-5 text-center"
            >
              <p className={`text-lg sm:text-2xl font-display font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-foreground mt-1 sm:mt-1.5 font-medium">{stat.label}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Item breakdown */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">{t("howItWorks.previews.itemPerformance")}</p>
          {[
            { item: t("common.items.salmon"), forecast: "25 kg", actual: "23 kg", waste: i18n.resolvedLanguage === 'fr' ? "2 kg (3,40 €)" : "2 kg ($3.40)", accuracy: "92%" },
            { item: t("common.items.salad"), forecast: "40 portions", actual: "38 portions", waste: i18n.resolvedLanguage === 'fr' ? "2 portions (4,00 €)" : "2 portions ($4.00)", accuracy: "95%" },
            { item: t("common.items.soup"), forecast: "15 L", actual: "15 L", waste: "0 L", accuracy: "100%" },
          ].map((row, i) => (
            <motion.div
              key={row.item}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-xl bg-accent/40 border border-border/20 px-4 sm:px-5 py-3 sm:py-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">{row.item}</p>
                <span className="text-xs font-medium text-[hsl(var(--success))] bg-[hsl(var(--success)/.1)] px-2 py-0.5 rounded-md">{row.accuracy}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                <span>{i18n.resolvedLanguage === 'fr' ? 'Prévu' : 'Forecast'}: <span className="text-foreground font-medium">{row.forecast}</span></span>
                <span>{i18n.resolvedLanguage === 'fr' ? 'Réel' : 'Actual'}: <span className="text-foreground font-medium">{row.actual}</span></span>
                <span className={row.waste.startsWith("0") ? "text-[hsl(var(--success))]" : "text-[hsl(var(--warning))]"}>
                  {i18n.resolvedLanguage === 'fr' ? 'Perte' : 'Waste'}: {row.waste}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI learning note */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-3 sm:gap-4 rounded-xl bg-primary/5 border border-primary/15 px-4 sm:px-5 py-3 sm:py-4"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GraphUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t("howItWorks.previews.modelUpdated")}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t("howItWorks.previews.modelUpdatedBody")}
            </p>
          </div>
        </motion.div>
      </PreviewCard>
    </motion.div>
  );
};

export default HowItWorksSection;
