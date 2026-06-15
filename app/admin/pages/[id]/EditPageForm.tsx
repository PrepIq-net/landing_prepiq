"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePage } from "@/lib/actions/page-actions";
import { Page } from "@prisma/client";

export default function EditPageForm({ page }: { page: Page }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await updatePage(page.id, formData);
    if (result.success) {
      router.push("/admin/pages");
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.message) setMessage(result.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Page: {page.titleEn}</h1>
      {message && <div className="mb-4 text-red-600">{message}</div>}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={page.slug} />
          {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug[0]}</p>}
        </div>
        <div>
          <Label htmlFor="titleEn">Title (English)</Label>
          <Input id="titleEn" name="titleEn" defaultValue={page.titleEn} />
          {errors.titleEn && <p className="text-red-600 text-sm mt-1">{errors.titleEn[0]}</p>}
        </div>
        <div>
          <Label htmlFor="titleFr">Title (French)</Label>
          <Input id="titleFr" name="titleFr" defaultValue={page.titleFr} />
          {errors.titleFr && <p className="text-red-600 text-sm mt-1">{errors.titleFr[0]}</p>}
        </div>
        <div>
          <Label htmlFor="metaDescriptionEn">Meta Description (English)</Label>
          <Textarea id="metaDescriptionEn" name="metaDescriptionEn" defaultValue={page.metaDescriptionEn || ""} />
        </div>
        <div>
          <Label htmlFor="metaDescriptionFr">Meta Description (French)</Label>
          <Textarea id="metaDescriptionFr" name="metaDescriptionFr" defaultValue={page.metaDescriptionFr || ""} />
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={page.sortOrder} />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/pages")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
