import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroIntelligencePreview from "./HeroIntelligencePreview";
import { useState } from "react";
import CalendlyModal from "./CalendlyModal";

const HeroSection = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <>
    <section className="relative min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 flex flex-col items-center overflow-hidden">
      {/* Subtle square pattern */}
      <div className="absolute inset-0 pattern-squares opacity-50 pointer-events-none" />
      {/* Layered ambient glows */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/[0.04] blur-[180px] pointer-events-none" />
      <div className="absolute top-[100px] right-[-200px] w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-[120px] pointer-events-none" />

      <div className="section-container px-4 sm:px-6 w-full flex flex-col items-center text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            <span className="text-[11px] sm:text-xs text-muted-foreground">Trusted by kitchens reducing waste daily</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-4 sm:mb-6 px-2"
        >
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.25rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
            Stop Guessing
            <br className="hidden sm:block" />
            <span className="text-gradient-gold"> Tomorrow's Prep.</span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-3 sm:mb-4 px-2"
        >
          PrepIQ predicts what your kitchen will sell and tells you exactly how much to prepare.
        </motion.p>

        {/* Differentiator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-sm text-muted-foreground mb-8 sm:mb-10"
        >
          <span className="flex items-center gap-1.5"><span className="text-primary">✓</span> Reduce waste</span>
          <span className="flex items-center gap-1.5"><span className="text-primary">✓</span> Avoid stockouts</span>
          <span className="flex items-center gap-1.5"><span className="text-primary">✓</span> Protect margins</span>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="flex flex-wrap justify-center gap-5 sm:gap-8 mb-8 sm:mb-10"
        >
          {[
            { value: "92%", label: "Forecast Accuracy" },
            { value: "$22,500", label: "Waste Saved Monthly" },
            { value: "1,200+", label: "Prep Decisions Daily" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mb-12 sm:mb-16 w-full sm:w-auto px-2 sm:px-0"
        >
          <Button variant="hero" size="xl" className="group w-full sm:w-auto">
            <span className="flex items-center justify-center gap-2">
              Start Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Button>
          <Button variant="hero-outline" size="xl" onClick={() => setDemoOpen(true)} className="w-full sm:w-auto">
            Book a 10-min Demo
          </Button>
        </motion.div>

        {/* Intelligence Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl relative"
        >
          {/* Glow behind preview */}
          <div className="absolute -inset-4 bg-primary/[0.03] blur-[60px] rounded-3xl pointer-events-none" />
          <div className="relative">
            <HeroIntelligencePreview />
          </div>
        </motion.div>
      </div>
    </section>
    <CalendlyModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default HeroSection;
