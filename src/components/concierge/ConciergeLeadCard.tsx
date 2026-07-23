"use client";

import { useState } from "react";
import { Check, Xmark } from "iconoir-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LeadFields } from "./useConcierge";

interface Props {
  onSubmit: (fields: LeadFields) => Promise<boolean>;
  onDismiss: () => void;
}

export function ConciergeLeadCard({ onSubmit, onDismiss }: Props) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<LeadFields>({ email: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const set = (key: keyof LeadFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(false);
    const ok = await onSubmit(fields);
    setBusy(false);
    if (!ok) setError(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-4"
      aria-label={t("concierge.lead.title")}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          {t("concierge.lead.title")}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t("concierge.lead.dismiss")}
          className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Xmark className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {t("concierge.lead.subtitle")}
      </p>
      <div className="space-y-2">
        <Input
          type="email"
          required
          value={fields.email}
          onChange={set("email")}
          placeholder={t("concierge.lead.email")}
          autoComplete="email"
        />
        <Input
          value={fields.restaurantName ?? ""}
          onChange={set("restaurantName")}
          placeholder={t("concierge.lead.restaurant")}
          autoComplete="organization"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={fields.role ?? ""}
            onChange={set("role")}
            placeholder={t("concierge.lead.role")}
          />
          <Input
            value={fields.location ?? ""}
            onChange={set("location")}
            placeholder={t("concierge.lead.location")}
          />
        </div>
        <Input
          type="tel"
          value={fields.phone ?? ""}
          onChange={set("phone")}
          placeholder={t("concierge.lead.phone")}
          autoComplete="tel"
        />
        {/* Honeypot — hidden from real users, bots fill it. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-muted-foreground" role="alert">
          {t("concierge.lead.error")}
        </p>
      )}
      <Button type="submit" size="sm" className="mt-3 w-full" disabled={busy}>
        <Check className="mr-1 h-4 w-4" aria-hidden />
        {t("concierge.lead.submit")}
      </Button>
    </form>
  );
}
