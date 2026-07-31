"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createTestimonial,
  updateTestimonial,
} from "@/lib/actions/testimonial-actions";

export interface TestimonialFormValues {
  id?: string;
  quoteEn: string;
  quoteFr: string | null;
  name: string;
  role: string;
  company: string;
  metricEn: string | null;
  metricFr: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export default function TestimonialForm({
  testimonial,
}: {
  testimonial?: TestimonialFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(testimonial?.id);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setErrors({});
    const result = isEdit
      ? await updateTestimonial(testimonial!.id!, formData)
      : await createTestimonial(formData);
    setPending(false);

    if (result?.success) {
      router.push("/admin/testimonials");
      router.refresh();
      return;
    }
    if (result?.errors) setErrors(result.errors);
    setMessage(result?.message ?? "Please fix the errors below.");
  }

  const fieldError = (name: keyof TestimonialFormValues) =>
    errors[name]?.[0] ? (
      <p className="text-destructive text-sm mt-1">{errors[name][0]}</p>
    ) : null;

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      {message && (
        <div className="p-3 rounded-md text-sm bg-destructive/15 text-destructive border border-destructive/20">
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>The quote</CardTitle>
          <CardDescription>
            Use the operator&apos;s own words. Only publish once they have
            confirmed in writing that we may quote them by name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quoteEn">Quote (English)</Label>
            <Textarea
              id="quoteEn"
              name="quoteEn"
              defaultValue={testimonial?.quoteEn ?? ""}
              className="min-h-[110px]"
              placeholder="What did they actually say?"
            />
            {fieldError("quoteEn")}
          </div>
          <div>
            <Label htmlFor="quoteFr">Quote (French) — optional</Label>
            <Textarea
              id="quoteFr"
              name="quoteFr"
              defaultValue={testimonial?.quoteFr ?? ""}
              className="min-h-[110px]"
              placeholder="Leave blank to show the English quote to French visitors."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Who said it</CardTitle>
          <CardDescription>
            Real name, real role, real kitchen — anonymous quotes are not proof.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={testimonial?.name ?? ""}
              placeholder="Amina Okello"
            />
            {fieldError("name")}
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              defaultValue={testimonial?.role ?? ""}
              placeholder="Head Chef"
            />
            {fieldError("role")}
          </div>
          <div>
            <Label htmlFor="company">Kitchen / company</Label>
            <Input
              id="company"
              name="company"
              defaultValue={testimonial?.company ?? ""}
              placeholder="Kampala Grill"
            />
            {fieldError("company")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Headline figure — optional</CardTitle>
          <CardDescription>
            Shown large above the quote. Leave both blank unless the customer
            stated the number themselves; the card renders fine without it.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="metricEn">Figure (English)</Label>
            <Input
              id="metricEn"
              name="metricEn"
              defaultValue={testimonial?.metricEn ?? ""}
              placeholder="e.g. 12% less waste"
            />
          </div>
          <div>
            <Label htmlFor="metricFr">Figure (French)</Label>
            <Input
              id="metricFr"
              name="metricFr"
              defaultValue={testimonial?.metricFr ?? ""}
              placeholder="ex. 12 % de gaspillage en moins"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={testimonial?.isPublished ?? false}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <span>
              <span className="text-sm font-medium text-foreground">
                Published
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Unpublished quotes are never rendered on the public site.
              </span>
            </span>
          </label>
          <div className="max-w-[160px]">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={testimonial?.sortOrder ?? 0}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Add testimonial"}
        </Button>
        <Button variant="outline" type="button" asChild>
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
