"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Mail } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitJobApplication } from "@/lib/actions/career-actions";

export default function ApplyForm({ roleId }: { roleId: string }) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    setErrors({});
    setMessage(null);
    const result = await submitJobApplication(new FormData(formRef.current));
    setPending(false);
    if (result.success) {
      setDone(true);
    } else if (result.errors) {
      setErrors(result.errors as Record<string, string[]>);
    } else {
      setMessage(result.message ?? t("careers.apply.errorGeneric"));
    }
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <p className="mt-1 text-sm text-destructive">{errors[name][0]}</p>
    ) : null;

  if (done) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
          {t("careers.apply.successTitle")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("careers.apply.successBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold text-foreground">
        {t("careers.apply.heading")}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("careers.apply.sub")}
      </p>

      {message && (
        <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {message}
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-5">
        <input type="hidden" name="roleId" value={roleId} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">{t("careers.apply.name")}</Label>
            <Input id="name" name="name" required className="mt-1.5" />
            {fieldError("name")}
          </div>
          <div>
            <Label htmlFor="email">{t("careers.apply.email")}</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
            {fieldError("email")}
          </div>
        </div>

        <div>
          <Label htmlFor="resumeUrl">{t("careers.apply.resume")}</Label>
          <Input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            placeholder="https://"
            required
            className="mt-1.5"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {t("careers.apply.resumeHint")}
          </p>
          {fieldError("resumeUrl")}
        </div>

        <div>
          <Label htmlFor="linkedinUrl">{t("careers.apply.linkedin")}</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/in/…"
            className="mt-1.5"
          />
          {fieldError("linkedinUrl")}
        </div>

        <div>
          <Label htmlFor="coverNote">{t("careers.apply.coverNote")}</Label>
          <Textarea
            id="coverNote"
            name="coverNote"
            rows={4}
            placeholder={t("careers.apply.coverNotePlaceholder")}
            className="mt-1.5"
          />
          {fieldError("coverNote")}
        </div>

        <Button type="submit" variant="hero" size="lg" disabled={pending} className="w-full sm:w-auto">
          <Mail className="mr-1 h-4 w-4" />
          {pending ? t("careers.apply.submitting") : t("careers.apply.submit")}
        </Button>
      </form>
    </div>
  );
}
