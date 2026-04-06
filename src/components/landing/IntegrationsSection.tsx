import { useTranslation } from "react-i18next";

const POS_SYSTEMS = [
  {
    name: "Loyverse",
    status: "live" as const,
    desc: "Real-time sales sync",
    initial: "L",
    color: "hsl(40 70% 39%)",
  },
  {
    name: "Square",
    status: "soon" as const,
    desc: "Coming soon",
    initial: "S",
    color: "hsl(220 14% 50%)",
  },
  {
    name: "Toast",
    status: "soon" as const,
    desc: "Coming soon",
    initial: "T",
    color: "hsl(220 14% 50%)",
  },
  {
    name: "Clover",
    status: "soon" as const,
    desc: "Coming soon",
    initial: "C",
    color: "hsl(220 14% 50%)",
  },
];

const IntegrationsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="integrations" className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-5xl mx-auto">

          {/* Left — text */}
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
              {t("integrations.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-semibold text-foreground leading-tight mb-5">
              Works with your<br />
              <span className="text-primary">existing stack</span>
            </h2>
            <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-sm">
              PrepIQ connects directly to your POS to pull sales data automatically — no manual exports, no spreadsheets. More integrations are on the way.
            </p>
            <p className="text-xs text-muted-foreground/50 leading-relaxed max-w-sm">
              Not using a supported POS yet? You can import sales via CSV or connect through our REST API — PrepIQ works either way.
            </p>
          </div>

          {/* Right — POS cards */}
          <div className="grid grid-cols-2 gap-3">
            {POS_SYSTEMS.map((pos) => {
              const isLive = pos.status === "live";
              return (
                <div
                  key={pos.name}
                  className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-colors ${
                    isLive
                      ? "border-primary/25 bg-primary/[0.04]"
                      : "border-border/40 bg-card/40 opacity-60"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: isLive ? "hsl(40 70% 39% / 0.15)" : "hsl(220 14% 20% / 0.4)",
                      color: isLive ? pos.color : "hsl(220 14% 55%)",
                    }}
                  >
                    {pos.initial}
                  </div>

                  {/* Name + status */}
                  <div>
                    <p className={`text-sm font-semibold ${isLive ? "text-foreground" : "text-muted-foreground/60"}`}>
                      {pos.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-success animate-pulse" : "bg-muted-foreground/25"}`}
                      />
                      <span className={`text-[11px] ${isLive ? "text-success" : "text-muted-foreground/40"}`}>
                        {pos.desc}
                      </span>
                    </div>
                  </div>

                  {/* Live glow */}
                  {isLive && (
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
