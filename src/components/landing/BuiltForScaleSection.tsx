import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import { Building, Shop, Bonfire, StatsReport, Globe, Clock, Language, Brain, CheckCircle } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { BuiltForScaleContent, SectionContent } from "@/types/cms";

const createPinIcon = (isActive: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: ${isActive ? 18 : 14}px;
      height: ${isActive ? 18 : 14}px;
      background: hsl(40 70% 39%);
      border: 2px solid hsl(40 70% 55%);
      border-radius: 50%;
    "></div>`,
    iconSize: [isActive ? 18 : 14, isActive ? 18 : 14],
    iconAnchor: [isActive ? 9 : 7, isActive ? 9 : 7],
    popupAnchor: [0, isActive ? -9 : -7],
  });

const PERSONA_ICONS = [Building, Shop, Bonfire, StatsReport];
const GLOBAL_ICONS = [Globe, Clock, Language, Building];
const REGION_FLAGS = ["🇺🇸", "🇬🇧", "🇦🇪", "🇳🇬", "🇸🇬", "🇧🇷"];

const BRANCH_META = [
  { flag: "🇺🇸", lat: 40.76, lng: -73.97, accuracy: 96, saved: "$5,100", margin: "+3.4%", items: 165 },
  { flag: "🇬🇧", lat: 51.51, lng: -0.09, accuracy: 93, saved: "$3,800", margin: "+2.7%", items: 118 },
  { flag: "🇦🇪", lat: 25.08, lng: 55.14, accuracy: 94, saved: "$4,200", margin: "+3.1%", items: 142 },
  { flag: "🇳🇬", lat: 6.45, lng: 3.4, accuracy: 90, saved: "$2,600", margin: "+2.3%", items: 89 },
  { flag: "🇦🇺", lat: -33.87, lng: 151.21, accuracy: 92, saved: "$3,100", margin: "+2.5%", items: 108 },
];

const BuiltForScaleSection = ({ dbContent }: { dbContent?: SectionContent<BuiltForScaleContent> }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const isFr = currentLang === "fr";
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  const content: BuiltForScaleContent = dbContent?.[currentLang] || {
    badge: t("whoItsFor.badge"),
    title: t("whoItsFor.title"),
    subtitle: t("whoItsFor.subtitle"),
    personas: [
      { title: t("whoItsFor.personas.multiBranch.title"), desc: t("whoItsFor.personas.multiBranch.desc"), stat: t("whoItsFor.personas.multiBranch.stat") },
      { title: t("whoItsFor.personas.brands.title"), desc: t("whoItsFor.personas.brands.desc"), stat: t("whoItsFor.personas.brands.stat") },
      { title: t("whoItsFor.personas.chefs.title"), desc: t("whoItsFor.personas.chefs.desc"), stat: t("whoItsFor.personas.chefs.stat") },
      { title: t("whoItsFor.personas.ops.title"), desc: t("whoItsFor.personas.ops.desc"), stat: t("whoItsFor.personas.ops.stat") },
    ],
    networkTitle: t("multiBranch.title"),
    networkSubtitle: t("multiBranch.subtitle"),
    sidebarTitle: t("multiBranch.sidebarTitle"),
    stats: {
      margin: { label: t("multiBranch.stats.margin") },
      waste: { label: t("multiBranch.stats.waste") },
      accuracy: { label: t("multiBranch.stats.accuracy") },
    },
    branches: [
      { name: "Manhattan", country: isFr ? "États-Unis" : "USA", scenario: { tag: t("kitchenNetwork.scenarios.waste.tag"), problem: t("kitchenNetwork.scenarios.waste.problem"), aiLearning: t("kitchenNetwork.scenarios.waste.aiLearning"), prevention: t("kitchenNetwork.scenarios.waste.prevention"), saved: t("kitchenNetwork.scenarios.waste.saved") } },
      { name: "London Bridge", country: isFr ? "Royaume-Uni" : "UK", scenario: { tag: t("kitchenNetwork.scenarios.stockout.tag"), problem: t("kitchenNetwork.scenarios.stockout.problem"), aiLearning: t("kitchenNetwork.scenarios.stockout.aiLearning"), prevention: t("kitchenNetwork.scenarios.stockout.prevention"), saved: t("kitchenNetwork.scenarios.stockout.saved") } },
      { name: "Dubai Marina", country: isFr ? "Émirats Arabes Unis" : "UAE", scenario: { tag: t("kitchenNetwork.scenarios.seasonal.tag"), problem: t("kitchenNetwork.scenarios.seasonal.problem"), aiLearning: t("kitchenNetwork.scenarios.seasonal.aiLearning"), prevention: t("kitchenNetwork.scenarios.seasonal.prevention"), saved: t("kitchenNetwork.scenarios.seasonal.saved") } },
      { name: "Lagos", country: "Nigeria", scenario: { tag: isFr ? "Protégé par le réseau" : "Network Protected", problem: "", aiLearning: "", prevention: isFr ? "Aucun incident ce mois-ci" : "No incidents this month", saved: "" } },
      { name: "Sydney", country: isFr ? "Australie" : "Australia", scenario: { tag: isFr ? "Protégé par le réseau" : "Network Protected", problem: "", aiLearning: "", prevention: isFr ? "Aucun incident ce mois-ci" : "No incidents this month", saved: "" } },
    ],
    globalTitle: t("globalReady.title"),
    globalSubtitle: t("globalReady.subtitle"),
    globalFeatures: [
      { label: t("globalReady.features.currency.label"), desc: t("globalReady.features.currency.desc") },
      { label: t("globalReady.features.timezone.label"), desc: t("globalReady.features.timezone.desc") },
      { label: t("globalReady.features.localized.label"), desc: t("globalReady.features.localized.desc") },
      { label: t("globalReady.features.support.label"), desc: t("globalReady.features.support.desc") },
    ],
    regions: [t("globalReady.regions.na"), t("globalReady.regions.eu"), t("globalReady.regions.me"), t("globalReady.regions.af"), t("globalReady.regions.ap"), t("globalReady.regions.la")],
  };

  const branches = useMemo(() => content.branches.map((b, i) => ({ ...b, ...BRANCH_META[i] })), [content]);
  const networkStats = [
    { label: content.stats.margin.label, value: "+2.8%" },
    { label: content.stats.waste.label, value: isFr ? "22 500 €" : "$22,500" },
    { label: content.stats.accuracy.label, value: "92.5%" },
  ];

  const selectedBranch = branches.find((b) => b.name === activeBranch) || branches[0];

  return (
    <section className="py-20 md:py-28 border-t border-border/50">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16 px-2">
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-4 block">{content.badge}</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-3 sm:mb-4 leading-tight lg:leading-[1.15]">{content.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">{content.subtitle}</p>
        </motion.div>

        {/* Personas — condensed strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border mb-16 sm:mb-24">
          {content.personas.map((p, i) => {
            const Icon = PERSONA_ICONS[i];
            return (
              <div key={p.title} className="bg-card p-4 sm:p-6 space-y-2 sm:space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">{p.desc}</p>
                <p className="text-[11px] text-primary font-medium">{p.stat}</p>
              </div>
            );
          })}
        </div>

        {/* Network map + branch intelligence */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1.5">{content.networkTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{content.networkSubtitle}</p>
        </div>

        <div className="relative rounded-xl sm:rounded-2xl border border-border overflow-hidden mb-6 sm:mb-10">
          <div className="grid lg:grid-cols-[1fr_300px]">
            <div className="h-[280px] sm:h-[360px] lg:h-[420px] w-full relative">
              <MapContainer center={[20, 20]} zoom={2} minZoom={2} maxZoom={6} scrollWheelZoom={false} zoomControl={false} attributionControl={false} className="h-full w-full" style={{ background: "hsl(240 7% 8%)" }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
                {branches.map((branch) => (
                  <Marker key={branch.name} position={[branch.lat, branch.lng]} icon={createPinIcon(activeBranch === branch.name)} eventHandlers={{ click: () => setActiveBranch(branch.name) }}>
                    <Popup className="prepiq-popup">
                      <div className="min-w-[180px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{branch.flag}</span>
                          <p className="text-[13px] font-semibold" style={{ color: "hsl(240 5% 96%)" }}>{branch.name}</p>
                        </div>
                        <div className="flex justify-between text-[11px]" style={{ color: "hsl(240 4% 56%)" }}>
                          <span>{t("multiBranch.popup.accuracy")}</span>
                          <span style={{ color: "hsl(40 70% 50%)" }}>{branch.accuracy}%</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="absolute top-3 left-3 z-[500] flex items-center gap-2 rounded-lg border border-border/60 bg-card/80 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{t("multiBranch.liveBadge", { count: branches.length })}</span>
              </div>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-border bg-card/60">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{content.sidebarTitle}</p>
              </div>
              <div className="divide-y divide-border/30">
                {branches.map((branch) => (
                  <button
                    key={branch.name}
                    onClick={() => setActiveBranch(activeBranch === branch.name ? null : branch.name)}
                    className={`w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-accent/50 ${
                      selectedBranch.name === branch.name ? "bg-primary/[0.06] border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{branch.flag}</span>
                        <span className="text-xs font-medium text-foreground">{branch.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-primary">{branch.accuracy}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden bg-secondary">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${branch.accuracy}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected branch scenario detail */}
        <motion.div key={selectedBranch.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="rounded-xl border border-border bg-card p-5 sm:p-6 mb-10 sm:mb-14">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span>{selectedBranch.flag}</span> {selectedBranch.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{selectedBranch.scenario.tag}</span>
          </div>
          {selectedBranch.scenario.problem ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">{selectedBranch.scenario.aiLearning}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">{selectedBranch.scenario.prevention} — <span className="text-[hsl(var(--success))] font-medium">{selectedBranch.scenario.saved}</span></p>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">{selectedBranch.scenario.prevention}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 rounded-xl overflow-hidden border border-border mb-16 sm:mb-24">
          {networkStats.map((stat) => (
            <div key={stat.label} className="bg-card px-4 sm:px-6 py-4 sm:py-6 text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Global ready */}
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1.5">{content.globalTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{content.globalSubtitle}</p>
        </div>

        <div className="grid gap-px bg-border/40 rounded-2xl overflow-hidden border border-border grid-cols-1 sm:grid-cols-2 mb-8 sm:mb-10">
          {content.globalFeatures.map((f, i) => {
            const Icon = GLOBAL_ICONS[i];
            return (
              <div key={f.label} className="bg-card p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0 mt-0.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-1">{f.label}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {content.regions.map((name, i) => (
            <div key={name} className="flex items-center justify-center gap-2 sm:gap-2.5 rounded-full border border-border bg-card/80 px-3 sm:px-4 py-2 sm:py-2.5">
              <span className="text-sm">{REGION_FLAGS[i]}</span>
              <span className="text-xs font-medium text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .prepiq-popup .leaflet-popup-content-wrapper {
          background: hsl(240 5% 10%);
          border: 1px solid hsl(240 4% 18%);
          border-radius: 14px;
          color: hsl(240 5% 96%);
          padding: 0;
        }
        .prepiq-popup .leaflet-popup-content { margin: 12px 16px; font-size: 12px; line-height: 1.5; }
        .prepiq-popup .leaflet-popup-tip { background: hsl(240 5% 10%); border: 1px solid hsl(240 4% 18%); border-top: none; border-left: none; }
        .prepiq-popup .leaflet-popup-close-button { color: hsl(240 4% 56%) !important; }
        .leaflet-control-zoom { border: 1px solid hsl(240 4% 17%) !important; border-radius: 8px !important; overflow: hidden; }
        .leaflet-control-zoom a { background: hsl(240 5% 11%) !important; color: hsl(240 5% 96%) !important; border-color: hsl(240 4% 17%) !important; }
      `}</style>
    </section>
  );
};

export default BuiltForScaleSection;
