"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLink } from "@/lib/actions/link-actions";
import { Link } from "@prisma/client";

export default function EditLinkForm({ link }: { link: Link }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"nav" | "footer">(link.type as "nav" | "footer");

  async function handleSubmit(formData: FormData) {
    const result = await updateLink(link.id, formData);
    if (result.success) {
      router.push("/admin/links");
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.message) setMessage(result.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Link</h1>
      {message && <div className="mb-4 text-red-600">{message}</div>}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select name="type" value={type} onValueChange={(v) => setType(v as "nav" | "footer")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nav">Navigation</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="labelEn">Label (English)</Label>
          <Input id="labelEn" name="labelEn" defaultValue={link.labelEn} />
          {errors.labelEn && <p className="text-red-600 text-sm mt-1">{errors.labelEn[0]}</p>}
        </div>
        <div>
          <Label htmlFor="labelFr">Label (French)</Label>
          <Input id="labelFr" name="labelFr" defaultValue={link.labelFr} />
          {errors.labelFr && <p className="text-red-600 text-sm mt-1">{errors.labelFr[0]}</p>}
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" defaultValue={link.url} />
          {errors.url && <p className="text-red-600 text-sm mt-1">{errors.url[0]}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={link.category || ""} />
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={link.sortOrder} />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/links")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
