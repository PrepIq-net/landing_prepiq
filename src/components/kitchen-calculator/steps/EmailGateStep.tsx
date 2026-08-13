"use client";

import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail, SendMail, WarningTriangle } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { StepHeader } from "../StepHeader";

const inputClasses =
  "w-full h-14 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-card transition-colors duration-200";

export function EmailGateStep({
  email,
  restaurantName,
  website,
  submitting,
  error,
  onChange,
  onBack,
  onSubmit,
}: {
  email: string;
  restaurantName: string;
  /** Honeypot — real visitors never see or fill this field. */
  website: string;
  submitting: boolean;
  error: boolean;
  onChange: (patch: Partial<{ email: string; restaurantName: string; website: string }>) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (emailValid && !submitting) onSubmit();
      }}
      className="space-y-8 sm:space-y-10"
    >
      <StepHeader
        icon={SendMail}
        title={t("kitchenCalculator.steps.email.title")}
        subtitle={t("kitchenCalculator.steps.email.subtitle")}
      />

      <div>
        <label className="block text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5 mb-3">
          <Mail className="h-3 w-3" aria-hidden />
          {t("kitchenCalculator.steps.email.emailLabel")}
          <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          required
          maxLength={320}
          placeholder={t("kitchenCalculator.steps.email.emailPlaceholder") ?? ""}
          value={email}
          onChange={(e) => onChange({ email: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mb-3">
          {t("kitchenCalculator.steps.email.restaurantLabel")}
        </label>
        <input
          type="text"
          maxLength={200}
          placeholder={t("kitchenCalculator.steps.email.restaurantPlaceholder") ?? ""}
          value={restaurantName}
          onChange={(e) => onChange({ restaurantName: e.target.value })}
          className={inputClasses}
        />
      </div>

      {/* Honeypot: visually hidden (not display:none — some bots skip that
          specifically) via the same sr-only clip technique used elsewhere. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="kc-website">Website</label>
        <input
          id="kc-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => onChange({ website: e.target.value })}
        />
      </div>

      <p className="text-xs text-muted-foreground/70">{t("kitchenCalculator.steps.email.consent")}</p>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/[0.06] px-3.5 py-2.5 text-xs text-destructive">
          <WarningTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t("kitchenCalculator.steps.email.error")}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {t("kitchenCalculator.steps.email.back")}
        </Button>
        <Button type="submit" variant="hero" size="lg" disabled={!emailValid || submitting}>
          {submitting ? (
            t("kitchenCalculator.steps.email.submitting")
          ) : (
            <>
              {t("kitchenCalculator.steps.email.submit")}
              <SendMail className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
