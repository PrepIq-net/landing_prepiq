"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageHeaderContent, SectionContent } from "@/types/cms";
import { CountUp } from "./motion-primitives";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const wordUp = {
  hidden: { opacity: 0, y: "0.45em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const WordReveal = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i) => (
      <motion.span
        key={`${word}-${i}`}
        variants={wordUp}
        className="inline-block whitespace-pre"
      >
        {word}{" "}
      </motion.span>
    ))}
  </>
);

const PageHeaderSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<PageHeaderContent>;
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content = dbContent?.[currentLang];
  if (!content) return null;

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-[0.1] pointer-events-none" />
      <div className="absolute inset-0 wash-gold-top pointer-events-none" />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-px w-[min(640px,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      <div className="section-container relative">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.06 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 block text-xs uppercase tracking-[0.25em] text-primary/80 font-medium"
          >
            {content.badge}
          </motion.span>

          <motion.h1
            transition={{ staggerChildren: 0.05 }}
            className="font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[2.6rem] md:text-[3.1rem]"
          >
            <WordReveal text={content.titleLine1} />
            {content.titleLine2 && (
              <>
                <br />
                <motion.span
                  variants={wordUp}
                  className="text-gradient-gold inline-block"
                >
                  {content.titleLine2}
                </motion.span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {content.subtitle}
          </motion.p>

          {content.stats && content.stats.length > 0 && (
            <motion.div
              variants={fadeUp}
              className="mt-9 flex justify-center gap-10 sm:gap-16"
            >
              {content.stats.map((stat, i) => (
                <div key={stat.label} className="space-y-1 text-center">
                  <p
                    className={`font-display text-2xl font-semibold sm:text-3xl ${
                      i === 0 ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <CountUp value={stat.value} />
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHeaderSection;
