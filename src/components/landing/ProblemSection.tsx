import { motion } from "framer-motion";
import { WarningTriangle, MinusCircle, PageEdit } from "iconoir-react";

const problems = [
  {
    icon: WarningTriangle,
    title: "Overprep",
    result: "Waste",
    desc: "Throwing away food and money every single day. Margins bleed silently.",
    impact: "$2,400",
    impactLabel: "avg. monthly waste",
    color: "text-destructive",
    bg: "bg-destructive/10",
    borderHover: "hover:border-destructive/30",
    glowFrom: "from-destructive/[0.04]",
  },
  {
    icon: MinusCircle,
    title: "Underprep",
    result: "Stockouts",
    desc: "Losing revenue when your best items run out at peak. Customers don't come back.",
    impact: "14%",
    impactLabel: "revenue lost to stockouts",
    color: "text-[hsl(var(--warning))]",
    bg: "bg-[hsl(var(--warning)/.1)]",
    borderHover: "hover:border-[hsl(var(--warning)/.3)]",
    glowFrom: "from-[hsl(var(--warning)/.04)]",
  },
  {
    icon: PageEdit,
    title: "Manual Spreadsheets",
    result: "No Learning",
    desc: "The same guessing game, repeated every morning. Yesterday teaches nothing.",
    impact: "0%",
    impactLabel: "improvement over time",
    color: "text-muted-foreground",
    bg: "bg-muted",
    borderHover: "hover:border-muted-foreground/20",
    glowFrom: "from-muted-foreground/[0.03]",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-28 border-t border-border/50">
      <div className="section-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-4 block">
            The Problem
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-3 sm:mb-4 leading-tight lg:leading-[1.15]">
            Most kitchens still prep on instinct.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The result? Predictable losses that compound every day.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-xl sm:rounded-2xl border border-border bg-card p-5 sm:p-8 group relative overflow-hidden transition-colors duration-300 ${p.borderHover}`}
            >
              {/* Hover glow */}
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${p.glowFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative space-y-4 sm:space-y-5">
                <div className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${p.bg}`}>
                  <p.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${p.color}`} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className={`text-xs sm:text-sm font-medium ${p.color}`}>→ {p.result}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>

                <div className="pt-3 sm:pt-4 border-t border-border">
                  <span className={`text-xl sm:text-2xl font-semibold ${p.color}`}>{p.impact}</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground ml-2">{p.impactLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 sm:mt-14 px-2"
        >
          <p className="text-base sm:text-lg text-foreground font-medium">
            PrepIQ replaces guessing with <span className="text-gradient-gold">daily intelligence</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
