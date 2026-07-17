"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin, Building, Mail } from "iconoir-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "./SectionHeading";
import type { PublicJobRole } from "@/types/careers";

const CAREERS_EMAIL = "careers@prepiq.net";

const CareersSection = ({ roles }: { roles: PublicJobRole[] }) => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.resolvedLanguage === "fr";
  const alwaysRoles = t("about.careers.alwaysRoles", {
    returnObjects: true,
  }) as string[];

  return (
    <section
      id="careers"
      className="scroll-mt-24 border-t border-border/50 py-20 sm:py-28"
    >
      <div className="section-container">
        <SectionHeading
          eyebrow={t("about.careers.eyebrow")}
          title={t("about.careers.heading")}
          subtitle={t("about.careers.intro")}
          align="left"
        />

        {/* Current openings */}
        <div className="mt-12">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("about.careers.openingsHeading")}
          </h3>

          {roles.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {roles.map((role, i) => (
                <motion.div
                  key={role.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    href={`/careers/${role.slug}`}
                    className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-lg font-semibold text-foreground">
                        {isFr ? role.titleFr : role.titleEn}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {isFr ? role.summaryFr : role.summaryEn}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5" />
                          {role.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {role.location}
                        </span>
                        <span className="rounded-full border border-border/60 px-2 py-0.5">
                          {t(`careers.employmentType.${role.employmentType}`)}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-primary">
                      {t("about.careers.viewRole")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-border/60 bg-card/40 p-8 text-center">
              <p className="font-display text-lg font-semibold text-foreground">
                {t("about.careers.emptyTitle")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("about.careers.emptyBody")}
              </p>
              <Button asChild variant="hero" size="lg" className="mt-6">
                <a href={`mailto:${CAREERS_EMAIL}`}>
                  <Mail className="mr-1 h-4 w-4" />
                  {t("about.careers.sendCv")}
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Always interested */}
        <div className="mt-12 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t("about.careers.alwaysHeading")}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {alwaysRoles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-border/60 bg-background/40 px-3.5 py-1.5 text-sm text-muted-foreground"
              >
                {role}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <a href={`mailto:${CAREERS_EMAIL}`}>
                <Mail className="mr-1 h-4 w-4" />
                {CAREERS_EMAIL}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
