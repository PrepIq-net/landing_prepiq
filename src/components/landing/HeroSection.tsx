"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroIntelligencePreview from "./HeroIntelligencePreview";
import { useState, useRef } from "react";
import CalendlyModal from "./CalendlyModal";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(16px)", y: 20, scale: 0.97 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, bounce: 0.25, duration: 1.6 },
    },
  },
};

// Sparkle positions scattered around the hero
const SPARKLES = [
  { top: "12%", left: "8%", delay: "0s", size: 14 },
  { top: "22%", left: "92%", delay: "0.8s", size: 10 },
  { top: "38%", left: "4%", delay: "1.4s", size: 8 },
  { top: "8%", left: "72%", delay: "0.3s", size: 12 },
  { top: "55%", left: "96%", delay: "1.9s", size: 9 },
  { top: "18%", left: "18%", delay: "2.2s", size: 7 },
  { top: "30%", left: "85%", delay: "0.6s", size: 11 },
];

const HeroSection = () => {
  const { t } = useTranslation();
  const [demoOpen, setDemoOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle tilt on card hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const stats = [
    { value: "92%", label: t("hero.stats.accuracy") },
    { value: "−34%", label: t("hero.stats.waste") },
    { value: "0", label: t("hero.stats.stockouts") },
  ];

  return (
    <>
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-20 md:pb-32">
        {/* ── Animated aurora orbs ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* Large gold orb — top left */}
          <div
            className="animate-orb-drift-1 absolute rounded-full opacity-[0.18]"
            style={{
              width: 700,
              height: 700,
              top: "-200px",
              left: "-180px",
              background:
                "radial-gradient(circle, hsl(40 70% 50%) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          {/* Smaller amber orb — top right */}
          <div
            className="animate-orb-drift-2 absolute rounded-full opacity-[0.12]"
            style={{
              width: 500,
              height: 500,
              top: "-100px",
              right: "-120px",
              background:
                "radial-gradient(circle, hsl(35 80% 55%) 0%, transparent 70%)",
              filter: "blur(70px)",
              animationDelay: "4s",
            }}
          />
          {/* Accent orb — mid left */}
          <div
            className="animate-orb-drift-3 absolute rounded-full opacity-[0.07]"
            style={{
              width: 400,
              height: 400,
              top: "40%",
              left: "-100px",
              background:
                "radial-gradient(circle, hsl(45 90% 60%) 0%, transparent 70%)",
              filter: "blur(60px)",
              animationDelay: "8s",
            }}
          />
        </div>

        {/* ── Grid pattern ── */}
        <div className="absolute inset-0 pattern-grid opacity-[0.25] pointer-events-none" />

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 0%, transparent 30%, hsl(240 7% 8% / 0.9) 100%)",
          }}
        />

        {/* ── Sparkle dots ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none hidden lg:block"
        >
          {SPARKLES.map((s, i) => (
            <div
              key={i}
              className="animate-sparkle-pop absolute"
              style={{
                top: s.top,
                left: s.left,
                animationDelay: s.delay,
                animationDuration: `${2.5 + i * 0.4}s`,
              }}
            >
              <svg
                width={s.size}
                height={s.size}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                  fill="hsl(40 70% 55% / 0.7)"
                />
              </svg>
            </div>
          ))}
        </div>

        <div className="section-container relative z-10 mt-16">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* ── Left Content ── */}
            <div className="space-y-8">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                {/* Headline */}
                <h1 className="font-display text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[3.1rem] md:text-[3.9rem]">
                  <span
                    style={{
                      background:
                        "linear-gradient(160deg, #FFFFFF 0%, #F5F5F7 50%, rgba(245,245,247,0.5) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {t("hero.titleLine1")}
                    <br />
                  </span>
                  {/* Shimmer gold text */}
                  <span
                    className="animate-shimmer-gold"
                    style={{
                      background:
                        "linear-gradient(90deg, #A8821F 0%, #D4A843 25%, #F0C060 50%, #D4A843 75%, #A8821F 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {t("hero.titleLine2")}
                  </span>
                </h1>

                {/* Sub-headline */}
                <p className="max-w-[500px] text-sm leading-relaxed text-muted-foreground/80 sm:text-base md:text-[1.05rem] my-4">
                  {t("hero.subtitle")}
                </p>

                {/* Proof chips */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-sm my-2">
                  {[
                    t("hero.proof.lessWaste"),
                    t("hero.proof.noStockouts"),
                    t("hero.proof.betterMargins"),
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <span className="text-primary drop-shadow-[0_0_6px_hsl(40_70%_50%/0.8)]">
                        ✓
                      </span>
                      {item}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <div className="relative">
                    {/* Glow ring behind primary CTA */}
                    <div className="absolute inset-0 rounded-[14px] bg-primary/20 blur-xl animate-border-glow" />
                    <div className="relative bg-primary/10 rounded-[14px] border border-primary/25 p-0.5">
                      <Button
                        variant="hero"
                        size="lg"
                        className="group rounded-xl px-8 py-6 shadow-[0_0_30px_hsl(40_70%_39%/0.25)]"
                      >
                        <span className="flex items-center gap-2 text-base">
                          {t("hero.ctaStart")}
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="hero-outline"
                    size="lg"
                    onClick={() => setDemoOpen(true)}
                    className="w-full sm:w-auto rounded-xl px-8 py-6 text-base"
                  >
                    {t("hero.ctaDemo")}
                  </Button>
                </div>

                {/* Stat strip */}
                <div className="flex items-start gap-10 sm:gap-16 pt-4">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="space-y-1">
                      <p
                        className="font-display text-3xl font-semibold sm:text-4xl"
                        style={{
                          background:
                            i === 0
                              ? "linear-gradient(135deg, #A8821F, #F0C060, #A8821F)"
                              : "linear-gradient(to bottom, #F5F5F7, rgba(245,245,247,0.55))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          filter:
                            i === 0
                              ? "drop-shadow(0 0 12px hsl(40 70% 50% / 0.4))"
                              : undefined,
                        }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/45 sm:text-xs">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedGroup>
            </div>

            {/* ── Right Content (Preview) ── */}
            <div className="relative">
              {/* ── Product preview ── */}
              <motion.div
                initial={{ opacity: 0, y: 72, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1.1,
                  delay: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
                style={{ perspective: 1200 }}
              >
                {/* Floating wrapper */}
                <motion.div
                  ref={cardRef}
                  className="animate-float-card"
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Wide glow bloom */}
                  <div
                    className="absolute pointer-events-none animate-border-glow"
                    style={{
                      inset: "-60px -80px",
                      background:
                        "radial-gradient(ellipse 65% 45% at 50% 0%, hsl(40 70% 39% / 0.22) 0%, transparent 70%)",
                      borderRadius: "50%",
                      filter: "blur(24px)",
                    }}
                  />
                  {/* Top shimmer line */}
                  <div
                    className="absolute -top-px left-[10%] right-[10%] h-px pointer-events-none animate-border-glow"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, hsl(40 70% 55% / 0.7) 50%, transparent)",
                    }}
                  />
                  {/* Side glow lines */}
                  <div
                    className="absolute top-[10%] bottom-[10%] -left-px w-px pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, hsl(40 70% 39% / 0.3) 50%, transparent)",
                    }}
                  />
                  <div
                    className="absolute top-[10%] bottom-[10%] -right-px w-px pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, hsl(40 70% 39% / 0.3) 50%, transparent)",
                    }}
                  />

                  {/* Card frame */}
                  <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_0_1px_hsl(40_70%_39%/0.08),inset_0_1px_0_hsl(40_70%_55%/0.06)]">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-3 border-b border-border/50 bg-accent/30 px-4 py-3 backdrop-blur-sm">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15" />
                        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15" />
                        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-3 py-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[11px] text-muted-foreground/60 font-mono">
                            app.prepiq.io/today
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] text-muted-foreground/50">
                          Live
                        </span>
                      </div>
                    </div>
                    <HeroIntelligencePreview />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <CalendlyModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default HeroSection;
