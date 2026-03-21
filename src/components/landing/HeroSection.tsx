import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroIntelligencePreview from "./HeroIntelligencePreview";
import { useState } from "react";
import CalendlyModal from "./CalendlyModal";

const stats = [
  { value: "92%", label: "Forecast accuracy" },
  { value: "−34%", label: "Food waste" },
  { value: "0", label: "Stockouts avg/week" },
];

const HeroSection = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-screen flex-col items-center overflow-hidden pt-24 sm:pt-28 pb-0">

        {/* ── Background layers ── */}
        {/* Fine grid */}
        <div className="absolute inset-0 pattern-grid opacity-[0.35] pointer-events-none" />
        {/* Radial vignette — darkens edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, hsl(240 7% 8% / 0.85) 100%)",
          }}
        />
        {/* Gold bloom — top center */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, hsl(40 70% 39% / 0.13) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Content ── */}
        <div className="section-container relative z-10 flex w-full flex-col items-center px-4 text-center sm:px-6">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-primary sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Precision prep planning, powered by AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="font-display max-w-[800px] text-[2.25rem] font-semibold leading-[1.07] tracking-[-0.03em] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.25rem]"
          >
            <span
              style={{
                background:
                  "linear-gradient(160deg, #F5F5F7 0%, #F5F5F7 55%, rgba(245,245,247,0.45) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Prep with confidence.
              <br />
            </span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #A8821F 0%, #D4A843 45%, #A8821F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Know exactly what — and how much — to cook.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[480px] text-sm leading-relaxed text-muted-foreground sm:text-base md:text-[1.05rem]"
          >
            Every morning, PrepIQ gives your team a precise prep plan — built from your sales history, demand signals, and real kitchen patterns. No guesswork. No waste.
          </motion.p>

          {/* Proof chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground sm:text-sm"
          >
            {["Less waste", "No stockouts", "Better margins"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:w-auto sm:justify-center"
          >
            <Button variant="hero" size="xl" className="group w-full sm:w-auto rounded-xl">
              <span className="flex items-center gap-2">
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => setDemoOpen(true)}
              className="w-full sm:w-auto rounded-xl"
            >
              Book a 10-min Demo
            </Button>
          </motion.div>

          {/* Social proof — stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            className="mt-10 flex items-center gap-8 sm:gap-12"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <p
                  className="font-display text-2xl font-semibold sm:text-3xl"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(135deg, #A8821F, #D4A843)"
                        : "linear-gradient(to bottom, #F5F5F7, rgba(245,245,247,0.6))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground/50 sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ── Product preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-14 sm:mt-16 w-full max-w-[960px]"
          >
            {/* Glow bloom behind card */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-40px -60px",
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(40 70% 39% / 0.14) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(20px)",
              }}
            />
            {/* Top edge shimmer line */}
            <div
              className="absolute -top-px left-[15%] right-[15%] h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(40 70% 39% / 0.5) 50%, transparent)",
              }}
            />
            {/* Card frame — browser chrome feel */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_hsl(40_70%_39%/0.06)]">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-3 border-b border-border/60 bg-accent/40 px-4 py-3 backdrop-blur-sm">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15" />
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15" />
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[11px] text-muted-foreground/60 font-mono">app.prepiq.io/today</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-muted-foreground/50">Live</span>
                </div>
              </div>
              {/* The actual preview */}
              <HeroIntelligencePreview />
            </div>

            {/* Bottom fade — blends into next section */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, hsl(240 7% 8%))",
              }}
            />
          </motion.div>
        </div>
      </section>

      <CalendlyModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default HeroSection;
