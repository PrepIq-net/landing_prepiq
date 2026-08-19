import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { PricingContent, SectionContent } from "@/types/cms";
import type { PlanCatalogByLang } from "@/lib/plans";
import {
  LIMIT_MAX_STAFF_PER_BRANCH,
  type PublicPlan,
  type PublicPlanCatalog,
} from "@/types/plans";
import { GoldText } from "./GoldText";
import { APP_URL } from "@/lib/constants";

/**
 * Plan data comes from the backend catalog (`/api/v1/subscriptions/plans/`,
 * fetched server-side and passed in as `catalog`), so a price or feature edited
 * in /admin → Subscription Plans appears here without a deploy.
 *
 * There is no bundled copy to fall back on: if the catalog is unreachable or
 * empty, the section is omitted rather than showing stale hardcoded prices.
 */
interface PlanCard {
  key: string;
  name: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  trial: string | null;
  popular: boolean;
  customPricing: boolean;
  staffLabel: string;
}

/** Prices are decimal strings on the wire ("49.00"). */
const toNumber = (value: string | number) =>
  typeof value === "number" ? value : Number.parseFloat(value) || 0;

const PricingSection = ({
  dbContent,
  catalog,
}: {
  dbContent?: SectionContent<PricingContent>;
  catalog?: PlanCatalogByLang | null;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";
  const [annual, setAnnual] = useState(true);

  // Copy is CMS-authored; plans, prices and add-ons come from the backend
  // catalog. With either missing there is nothing real to quote — the section
  // hides instead of printing stale hardcoded prices.
  const content = dbContent?.[currentLang];
  const live: PublicPlanCatalog | null = catalog?.[currentLang] ?? null;
  if (!content || !live?.plans?.length) return null;

  /**
   * Prices are quoted in the backend's billing currency (USD — billing is not
   * FX-converted), so the currency shown must follow the API, not the UI
   * language. Quoting € on a USD charge would misstate what we bill.
   */
  const formatPrice = useMemo(() => {
    const currency = live?.currency || "USD";
    const formatter = new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (value: number) => formatter.format(value);
  }, [live?.currency, currentLang]);

  /** CMS/i18n copy for a plan, matched on plan_type ("CORE" → content.plans.core). */
  const cmsCopyFor = (planType: string) =>
    (content.plans as
      | Record<string, { name?: string; tagline?: string; cta?: string; features?: string[] }>
      | undefined)?.[planType.toLowerCase()];

  const staffLabelFor = (limit: number | null | undefined) =>
    limit == null ? t("pricing.unlimited") : String(limit);

  const ctaFor = (customPricing: boolean, planType: string) => {
    const copy = cmsCopyFor(planType);
    if (copy?.cta) return copy.cta;
    return customPricing ? t("pricing.talkToSales") : t("pricing.getStarted");
  };

  const plans: PlanCard[] = useMemo(() => {
    return live.plans.map((plan: PublicPlan) => {
      const copy = cmsCopyFor(plan.plan_type);
      const customPricing =
        plan.custom_pricing || plan.pricing?.mode === "CUSTOM_ONLY";
      return {
        key: plan.id,
        // The API is the source of truth for name, tagline, and features;
        // CMS copy only fills a gap the backend left blank.
        name: plan.name,
        tagline: plan.tagline || copy?.tagline || "",
        cta: ctaFor(customPricing, plan.plan_type),
        ctaHref: customPricing ? "/contact" : APP_URL,
        features: plan.features?.length ? plan.features : (copy?.features ?? []),
        monthlyPrice: toNumber(plan.monthly_price),
        yearlyPrice: toNumber(plan.yearly_price),
        trial:
          plan.trial_days > 0
            ? t("pricing.trialDays", { days: plan.trial_days })
            : null,
        popular: plan.is_popular,
        customPricing,
        staffLabel: staffLabelFor(plan.limits?.[LIMIT_MAX_STAFF_PER_BRANCH]),
      };
    });
  }, [live, content, currentLang, t]);

  const addOns = useMemo(() => {
    if (live?.add_ons?.length) {
      return live.add_ons.map((addOn) => ({
        name: addOn.name,
        desc: addOn.description,
        price: toNumber(addOn.monthly_price),
      }));
    }
    return [];
  }, [live]);

  /**
   * The annual-savings badge is derived from the live prices, never authored.
   * It is set in the admin by editing a plan's yearly price — a separately
   * typed percentage could contradict what the cards actually charge.
   *
   * Plans discount by slightly different amounts, so we claim the best one and
   * say "up to"; when every plan lands on the same figure we state it flat.
   */
  const saveLabel = useMemo(() => {
    const discounts = (live?.plans ?? [])
      .map((plan) => plan.yearly_discount_percentage)
      .filter((value): value is number => typeof value === "number" && value > 0)
      .map(Math.round);

    if (!discounts.length) return content.save;

    const lowest = Math.min(...discounts);
    const highest = Math.max(...discounts);
    return lowest === highest
      ? t("pricing.saveExact", { percent: highest })
      : t("pricing.saveUpTo", { percent: highest });
  }, [live, content.save, t]);

  const [footerBefore, footerLink, footerAfter] = useMemo(() => {
    const match = content.footer?.match(
      /^(.*)<primary>\s*(.*?)\s*<\/primary>(.*)$/s,
    );
    if (!match) return [content.footer, null, ""];
    return [match[1], match[2], match[3]];
  }, [content.footer]);

  return (
    <section
      id="pricing"
      className="relative py-24 md:py-32 border-t border-border/50 scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3.5 mb-6">
            <div className="w-10 h-px bg-primary" />
            <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
              {content.badge}
            </span>
            <div className="w-10 h-px bg-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-[56px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-4">
            <GoldText text={content.title} />
          </h2>
          <p className="text-sm md:text-lg text-base text-muted-foreground max-w-[512px] mx-auto leading-relaxed">
            {content.subtitle}
          </p>

          {/* Branch scoping is the one thing a reader must not misunderstand:
              a plan buys one kitchen, not the whole company. */}
          <div className="mt-7 inline-flex flex-col items-center gap-2.5 max-w-[560px] mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("pricing.branchScope")}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("pricing.branchScopeNote")}
            </p>
          </div>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10 md:mb-16 flex-wrap">
          <span
            className={`text-sm font-medium transition-colors duration-200 ${!annual ? "text-foreground" : "text-muted-foreground/40"}`}
          >
            {content.monthly}
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            role="switch"
            aria-checked={annual}
            aria-label={`${content.monthly} / ${content.annual}`}
            className={`relative h-8 w-14 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              annual
                ? "bg-primary/20 border-primary/30"
                : "bg-accent border-border"
            }`}
          >
            <motion.div
              animate={{ x: annual ? 28 : 3 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className={`absolute top-1 h-6 w-6 rounded-full transition-colors duration-200 ${
                annual ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors duration-200 ${annual ? "text-foreground" : "text-muted-foreground/40"}`}
          >
            {content.annual}
          </span>
          {annual && saveLabel && (
            <span className="text-xs font-medium text-[hsl(var(--success))] bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)] rounded-full px-3 py-1">
              {saveLabel}
            </span>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-14 md:mb-20">
          {plans.map((plan, i) => {
            const price = annual
              ? Math.round(plan.yearlyPrice / 12)
              : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2, delay: 0 } }}
                transition={{ delay: i * 0.06 }}
                className={`relative rounded-2xl border flex flex-col hover:shadow-l2 transition-[border-color,box-shadow] duration-200 ${
                  plan.popular
                    ? "border-primary/40 bg-card shadow-l3"
                    : "border-border bg-card/80 hover:border-primary/25"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[.6rem] md:text-xs uppercase tracking-[0.15em] font-semibold text-primary-foreground bg-primary px-4 py-1.5 rounded-full">
                      {content.mostPopular}
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-7 md:p-8 flex flex-col flex-1">
                  <div className="mb-7">
                    <p className="text-base font-semibold text-foreground mb-2">
                      {plan.name}
                    </p>
                    <p className="text-sm text-muted-foreground/60">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-7">
                    <div className="flex items-baseline gap-1.5 overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={price}
                          initial={{ y: "0.6em", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "-0.6em", opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="inline-block text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground"
                        >
                          {formatPrice(price)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-muted-foreground/40">
                        {content.perMonth}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-2">
                      {t("pricing.perBranch")} ·{" "}
                      {annual ? content.billedAnnually : content.billedMonthly}
                      {annual && (
                        <span className="text-muted-foreground/50">
                          {" "}
                          · {formatPrice(plan.yearlyPrice)}
                          {content.perYear}
                        </span>
                      )}
                    </p>
                    {plan.customPricing && (
                      <p className="text-xs text-muted-foreground/50 mt-1.5">
                        {t("pricing.customPricing")}
                      </p>
                    )}
                    {plan.trial && (
                      <p className="text-xs text-[hsl(var(--success))] font-medium mt-2.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                        {plan.trial}
                      </p>
                    )}
                  </div>

                  {/* Branch count is not a per-plan variable — every plan buys
                      exactly one branch, which the section header already
                      states. Only the staff cap differs between plans. */}
                  <div className="mb-7">
                    <div className="rounded-xl bg-accent/40 border border-border/20 px-4 py-3 text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {plan.staffLabel}
                      </p>
                      <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mt-0.5">
                        {content.staff}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-snug">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant={plan.popular ? "hero" : "hero-outline"}
                    size="lg"
                    className="w-full group"
                  >
                    {plan.customPricing ? (
                      <a
                        href={plan.ctaHref}
                        className="flex items-center justify-center gap-2"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <a
                        href={plan.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        {addOns.length > 0 && content.addOns && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium mb-3">
                {content.addOns.title}
              </p>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {content.addOns.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {addOns.map((addon) => (
                <div
                  key={addon.name}
                  title={addon.desc}
                  className="flex items-center gap-3 rounded-full border border-border bg-card/80 px-5 py-2.5 hover:border-primary/30 transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-foreground">
                    {addon.name}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice(addon.price)}
                    <span className="text-xs font-normal text-muted-foreground/50">
                      {content.perMonth}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground/40 mt-10 md:mt-14 max-w-lg mx-auto leading-relaxed px-2">
          {footerBefore}
          {footerLink && (
            <a
              href="/contact"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              {footerLink}
            </a>
          )}
          {footerAfter}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
