"use client";

import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const createPinIcon = (isActive: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: ${isActive ? 22 : 16}px;
      height: ${isActive ? 22 : 16}px;
      background: hsl(40 70% 39%);
      border: 2.5px solid hsl(40 70% 55%);
      border-radius: 50%;
      box-shadow: 0 0 ${isActive ? 20 : 10}px hsl(40 70% 39% / ${isActive ? 0.7 : 0.4}), 0 0 ${isActive ? 40 : 20}px hsl(40 70% 39% / ${isActive ? 0.3 : 0.15});
      transition: all 0.3s ease;
    "></div>
    <div style="
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: ${isActive ? 44 : 32}px;
      height: ${isActive ? 44 : 32}px;
      border-radius: 50%;
      border: 1px solid hsl(40 70% 39% / ${isActive ? 0.3 : 0.15});
      animation: pulse-ring 2.5s ease-out infinite;
    "></div>`,
    iconSize: [isActive ? 44 : 32, isActive ? 44 : 32],
    iconAnchor: [isActive ? 22 : 16, isActive ? 22 : 16],
    popupAnchor: [0, isActive ? -22 : -16],
  });

const MultiBranchSection = () => {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const branches = useMemo(() => [
    { name: "Manhattan", country: i18n.resolvedLanguage === 'fr' ? "États-Unis" : "USA", flag: "🇺🇸", lat: 40.76, lng: -73.97, accuracy: 96, saved: i18n.resolvedLanguage === 'fr' ? "5 100 €" : "$5,100", margin: "+3.4%", items: 165 },
    { name: "London Bridge", country: i18n.resolvedLanguage === 'fr' ? "Royaume-Uni" : "UK", flag: "🇬🇧", lat: 51.51, lng: -0.09, accuracy: 93, saved: i18n.resolvedLanguage === 'fr' ? "3 800 €" : "$3,800", margin: "+2.7%", items: 118 },
    { name: "Dubai Marina", country: i18n.resolvedLanguage === 'fr' ? "Émirats Arabes Unis" : "UAE", flag: "🇦🇪", lat: 25.08, lng: 55.14, accuracy: 94, saved: i18n.resolvedLanguage === 'fr' ? "4 200 €" : "$4,200", margin: "+3.1%", items: 142 },
    { name: "Lagos", country: "Nigeria", flag: "🇳🇬", lat: 6.45, lng: 3.40, accuracy: 90, saved: i18n.resolvedLanguage === 'fr' ? "2 600 €" : "$2,600", margin: "+2.3%", items: 89 },
    { name: "Sydney", country: i18n.resolvedLanguage === 'fr' ? "Australie" : "Australia", flag: "🇦🇺", lat: -33.87, lng: 151.21, accuracy: 92, saved: i18n.resolvedLanguage === 'fr' ? "3 100 €" : "$3,100", margin: "+2.5%", items: 108 },
  ], [i18n.resolvedLanguage]);

  const networkStats = useMemo(() => [
    { label: t("multiBranch.stats.margin"), value: "+2.8%", sub: t("multiBranch.stats.allBranches") },
    { label: t("multiBranch.stats.waste"), value: i18n.resolvedLanguage === 'fr' ? "22 500 €" : "$22,500", sub: t("multiBranch.stats.networkWide") },
    { label: t("multiBranch.stats.accuracy"), value: "92.5%", sub: t("multiBranch.stats.weightedAvg") },
  ], [t, i18n.resolvedLanguage]);

  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  return (
    <section className="py-20 md:py-28 border-t border-border/50 overflow-hidden">
      <div className="section-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4 block">
            {t("multiBranch.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-3 sm:mb-4 leading-tight lg:leading-[1.15]">
            {t("multiBranch.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("multiBranch.subtitle")}
          </p>
        </motion.div>

        {/* Map + sidebar layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative rounded-xl sm:rounded-2xl border border-border overflow-hidden mb-6 sm:mb-10"
        >
          <div className="grid lg:grid-cols-[1fr_300px]">
            {/* Map */}
            <div className="h-[300px] sm:h-[400px] lg:h-[480px] w-full relative">
              {mounted && (
                <MapContainer
                  center={[20, 20]}
                  zoom={2}
                  minZoom={2}
                  maxZoom={6}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  attributionControl={false}
                  className="h-full w-full"
                  style={{ background: "hsl(240 7% 8%)" }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                  />
                  {branches.map((branch) => (
                    <Marker
                      key={branch.name}
                      position={[branch.lat, branch.lng]}
                      icon={createPinIcon(activeBranch === branch.name)}
                      eventHandlers={{
                        click: () => setActiveBranch(branch.name),
                      }}
                    >
                      <Popup className="prepiq-popup">
                        <div className="min-w-[200px]">
                          <div className="flex items-center gap-2.5 mb-3">
                            <span className="text-lg">{branch.flag}</span>
                            <div>
                              <p className="text-[13px] font-semibold leading-tight" style={{ color: "hsl(240 5% 96%)" }}>{branch.name}</p>
                              <p className="text-[10px]" style={{ color: "hsl(240 4% 56%)" }}>{branch.country}</p>
                            </div>
                          </div>

                          {/* Accuracy bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span style={{ color: "hsl(240 4% 56%)" }}>{t("multiBranch.popup.accuracy")}</span>
                              <span className="font-semibold" style={{ color: "hsl(40 70% 50%)" }}>{branch.accuracy}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(240 4% 17%)" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${branch.accuracy}%`,
                                  background: `linear-gradient(90deg, hsl(40 70% 35%), hsl(40 70% 50%))`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 border-t pt-2.5" style={{ borderColor: "hsl(240 4% 17%)" }}>
                            <div className="flex justify-between text-[11px]">
                              <span style={{ color: "hsl(240 4% 56%)" }}>{t("multiBranch.popup.monthlySaved")}</span>
                              <span className="font-semibold" style={{ color: "hsl(153 39% 50%)" }}>{branch.saved}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span style={{ color: "hsl(240 4% 56%)" }}>{t("multiBranch.popup.marginImpact")}</span>
                              <span className="font-semibold" style={{ color: "hsl(40 70% 50%)" }}>{branch.margin}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span style={{ color: "hsl(240 4% 56%)" }}>{t("multiBranch.popup.itemsTracked")}</span>
                              <span className="font-medium" style={{ color: "hsl(240 5% 96%)" }}>{branch.items}</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}

              {/* Map overlay gradient edges */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card/80 to-transparent" />
              </div>

              {/* Live badge */}
              <div className="absolute top-3 left-3 z-[500] flex items-center gap-2 rounded-lg border border-border/60 bg-card/80 backdrop-blur-md px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{t("multiBranch.liveBadge", { count: branches.length })}</span>
              </div>
            </div>

            {/* Branch list sidebar */}
            <div className="border-t lg:border-t-0 lg:border-l border-border bg-card/60 backdrop-blur-sm">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{t("multiBranch.sidebarTitle")}</p>
              </div>
              <div className="divide-y divide-border/30">
                {branches.map((branch) => (
                  <button
                    key={branch.name}
                    onClick={() => setActiveBranch(activeBranch === branch.name ? null : branch.name)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 hover:bg-accent/50 ${
                      activeBranch === branch.name ? "bg-primary/[0.06] border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{branch.flag}</span>
                        <span className="text-xs font-medium text-foreground">{branch.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-primary">{branch.accuracy}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[hsl(var(--success))]">{t("multiBranch.savedMo", { amount: branch.saved })}</span>
                      <span className="text-[10px] text-muted-foreground">{t("multiBranch.margin", { amount: branch.margin })}</span>
                    </div>
                    {/* Mini accuracy bar */}
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-500"
                        style={{ width: `${branch.accuracy}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Network stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 rounded-xl overflow-hidden border border-border">
          {networkStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-card px-4 sm:px-6 py-4 sm:py-6 text-center"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5">{stat.label}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .leaflet-container {
          font-family: inherit;
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .prepiq-popup .leaflet-popup-content-wrapper {
          background: hsl(240 5% 10%);
          border: 1px solid hsl(240 4% 18%);
          border-radius: 14px;
          box-shadow: 0 12px 40px hsl(0 0% 0% / 0.5), 0 0 20px hsl(40 70% 39% / 0.08);
          color: hsl(240 5% 96%);
          padding: 0;
        }
        .prepiq-popup .leaflet-popup-content {
          margin: 14px 18px;
          font-size: 12px;
          line-height: 1.5;
        }
        .prepiq-popup .leaflet-popup-tip {
          background: hsl(240 5% 10%);
          border: 1px solid hsl(240 4% 18%);
          border-top: none;
          border-left: none;
        }
        .prepiq-popup .leaflet-popup-close-button {
          color: hsl(240 4% 56%) !important;
          font-size: 18px;
          top: 8px !important;
          right: 10px !important;
        }
        .prepiq-popup .leaflet-popup-close-button:hover {
          color: hsl(240 5% 96%) !important;
        }
        .leaflet-control-zoom {
          border: 1px solid hsl(240 4% 17%) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: hsl(240 5% 11%) !important;
          color: hsl(240 5% 96%) !important;
          border-color: hsl(240 4% 17%) !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(240 4% 17%) !important;
        }
      `}</style>
    </section>
  );
};

export default MultiBranchSection;
