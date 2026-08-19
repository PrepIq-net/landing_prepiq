"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TestimonialsContent, SectionContent } from "@/types/cms";
import type { PublishedTestimonial } from "@/lib/data";

/**
 * Grid shape by quote count. One quote centred and given room reads as a
 * deliberate feature; the same quote stretched across a three-column grid reads
 * as two missing ones. Everything is single-column below `sm` regardless.
 */
function gridClassFor(count: number) {
  if (count === 1) return "max-w-[760px] mx-auto";
  if (count === 2) return "sm:grid-cols-2 max-w-[1000px] mx-auto";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

/**
 * There is deliberately no fallback quote list here.
 *
 * Every testimonial comes from the Testimonial table (managed at
 * /admin/testimonials) and only when published. With none published the whole
 * section is omitted — we neither invent quotes nor leave an apologetic empty
 * card on the page. Copy and facts come from the CMS contentJson only.
 */
const TestimonialsSection = ({
  dbContent,
  testimonials = [],
}: {
  dbContent?: SectionContent<TestimonialsContent>;
  testimonials?: PublishedTestimonial[];
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const localized = dbContent?.[currentLang] as
    | Partial<TestimonialsContent>
    | undefined;

  // No CMS copy for this language or no published quotes: no section.
  if (!localized || testimonials.length === 0) return null;

  const content: TestimonialsContent = {
    badge: localized.badge ?? "",
    title: localized.title ?? "",
    subtitle: localized.subtitle ?? "",
    facts: Array.isArray(localized.facts) ? localized.facts : [],
  };

  const isSingle = testimonials.length === 1;

  return (
    <section className="relative py-24 md:py-32 border-t border-border/50 section-band">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3.5 mb-6">
            <div className="w-10 h-px bg-primary" />
            <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
              {content.badge}
            </span>
            <div className="w-10 h-px bg-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] text-balance">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        <div className={`grid gap-5 mb-14 ${gridClassFor(testimonials.length)}`}>
          {testimonials.map((item, i) => {
            const quote =
              (currentLang === "fr" ? item.quoteFr : item.quoteEn) ||
              item.quoteEn;
            const metric =
              (currentLang === "fr" ? item.metricFr : item.metricEn) ?? null;

            return (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
                // Cap the stagger so a long list doesn't leave the last card
                // waiting a second and a half to appear.
                transition={{ delay: Math.min(i, 5) * 0.08 }}
                className={`rounded-2xl border border-border bg-card flex flex-col hover:border-primary/30 hover:shadow-l2 transition-all duration-300 ${
                  isSingle ? "p-8 sm:p-11 text-center items-center" : "p-7 sm:p-8"
                }`}
              >
                {metric && (
                  <p
                    className={`font-display font-semibold text-primary tracking-[-0.02em] leading-none mb-4 ${
                      isSingle
                        ? "text-[32px] sm:text-[44px]"
                        : "text-[26px] sm:text-[32px]"
                    }`}
                  >
                    {metric}
                  </p>
                )}

                <blockquote
                  className={`text-foreground/90 flex-1 ${
                    isSingle
                      ? "font-display text-lg sm:text-2xl leading-[1.45] tracking-[-0.01em] max-w-[46ch]"
                      : "text-[15px] leading-relaxed"
                  }`}
                >
                  &ldquo;{quote}&rdquo;
                </blockquote>

                <figcaption
                  className={`flex items-center gap-3 border-t border-border w-full ${
                    isSingle
                      ? "mt-8 pt-6 justify-center"
                      : "mt-7 pt-5"
                  }`}
                >
                  <div className="h-[38px] w-[38px] shrink-0 rounded-full bg-primary/[0.12] border border-primary/25 flex items-center justify-center font-display font-semibold text-sm text-primary">
                    {item.name[0]}
                  </div>
                  <div className={isSingle ? "text-left" : ""}>
                    <p className="text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.role}, {item.company}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>

        {/* Facts we can actually stand behind */}
        {content.facts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {content.facts.map((fact) => (
              <div key={fact.label} className="text-center">
                {/*
                  Rendered as-is, not counted up: these are phrases ("Day 1",
                  "Yours"), and animating from zero turns them into statements
                  that are briefly false — "Day 0", "0 days".
                */}
                <p className="font-display text-[26px] font-semibold text-foreground">
                  {fact.value}
                </p>
                <p className="text-xs leading-snug text-muted-foreground mt-1.5 max-w-[22ch] mx-auto">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
