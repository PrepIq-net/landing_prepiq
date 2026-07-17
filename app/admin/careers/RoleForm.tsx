"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { createJobRole, updateJobRole } from "@/lib/actions/career-actions";
import { Globe, ExternalLink } from "lucide-react";

export interface RoleFormValues {
  id?: string;
  slug: string;
  titleEn: string;
  titleFr: string;
  department: string;
  location: string;
  employmentType: string;
  summaryEn: string;
  summaryFr: string;
  bodyEn: string;
  bodyFr: string;
  sortOrder: number;
  isPublished: boolean;
}

const EMPTY: RoleFormValues = {
  slug: "",
  titleEn: "",
  titleFr: "",
  department: "",
  location: "Remote",
  employmentType: "FULL_TIME",
  summaryEn: "",
  summaryFr: "",
  bodyEn: "",
  bodyFr: "",
  sortOrder: 0,
  isPublished: false,
};

const TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

export default function RoleForm({ role }: { role?: RoleFormValues }) {
  const values = role ?? EMPTY;
  const isEdit = Boolean(role?.id);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    setErrors({});
    setMessage(null);
    const fd = new FormData(formRef.current);
    const result = isEdit
      ? await updateJobRole(role!.id!, fd)
      : await createJobRole(fd);
    setPending(false);

    if (result.success) {
      router.push("/admin/careers");
      router.refresh();
    } else if (result.errors) {
      setErrors(result.errors as Record<string, string[]>);
      setMessage("Please fix the highlighted fields.");
    } else {
      setMessage(result.message ?? "Something went wrong.");
    }
  }

  const err = (name: string) =>
    errors[name] ? (
      <p className="mt-1 text-sm text-destructive">{errors[name][0]}</p>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/careers">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? `Edit role: ${values.titleEn}` : "New role"}
          </h1>
        </div>
        {isEdit && values.isPublished && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/careers/${values.slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
        )}
      </div>

      {message && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {message}
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Role details</CardTitle>
            <CardDescription>
              Shared across both languages. The slug is the public URL:
              /careers/&lt;slug&gt;.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={values.slug} placeholder="senior-backend-engineer" className="mt-1.5" />
              {err("slug")}
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" defaultValue={values.department} placeholder="Engineering" className="mt-1.5" />
              {err("department")}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={values.location} placeholder="Remote / Kampala, Uganda" className="mt-1.5" />
              {err("location")}
            </div>
            <div>
              <Label htmlFor="employmentType">Employment type</Label>
              <select
                id="employmentType"
                name="employmentType"
                defaultValue={values.employmentType}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={values.sortOrder} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">Lower shows first.</p>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={values.isPublished}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Published (visible on /about &amp; accepting applications)
              </label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="en" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="en" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> English
            </TabsTrigger>
            <TabsTrigger value="fr" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> French
            </TabsTrigger>
          </TabsList>

          {(["en", "fr"] as const).map((lng) => {
            const suffix = lng === "en" ? "En" : "Fr";
            return (
              <TabsContent
                key={lng}
                value={lng}
                forceMount
                className="space-y-4 data-[state=inactive]:hidden"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{lng === "en" ? "English" : "French"} content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`title${suffix}`}>Title</Label>
                      <Input
                        id={`title${suffix}`}
                        name={`title${suffix}`}
                        defaultValue={lng === "en" ? values.titleEn : values.titleFr}
                        className="mt-1.5"
                      />
                      {err(`title${suffix}`)}
                    </div>
                    <div>
                      <Label htmlFor={`summary${suffix}`}>Summary (one line)</Label>
                      <Textarea
                        id={`summary${suffix}`}
                        name={`summary${suffix}`}
                        defaultValue={lng === "en" ? values.summaryEn : values.summaryFr}
                        rows={2}
                        className="mt-1.5"
                      />
                      {err(`summary${suffix}`)}
                    </div>
                    <div>
                      <Label>Description (Markdown)</Label>
                      <div className="mt-1.5">
                        <MarkdownEditor
                          name={`body${suffix}`}
                          defaultValue={lng === "en" ? values.bodyEn : values.bodyFr}
                        />
                      </div>
                      {err(`body${suffix}`)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/careers">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="bg-primary font-semibold text-primary-foreground hover:bg-[#B8962E]"
          >
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
