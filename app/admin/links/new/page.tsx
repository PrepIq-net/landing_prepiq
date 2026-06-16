"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLink } from "@/lib/actions/link-actions";

export default function NewLink() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"nav" | "footer">("nav");

  async function handleSubmit(formData: FormData) {
    const result = await createLink(formData);
    if (result.success) {
      router.push("/admin/links");
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.message) setMessage(result.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Link</h1>
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
          <Input id="labelEn" name="labelEn" placeholder="English label" />
          {errors.labelEn && <p className="text-red-600 text-sm mt-1">{errors.labelEn[0]}</p>}
        </div>
        <div>
          <Label htmlFor="labelFr">Label (French)</Label>
          <Input id="labelFr" name="labelFr" placeholder="Label français" />
          {errors.labelFr && <p className="text-red-600 text-sm mt-1">{errors.labelFr[0]}</p>}
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" placeholder="/about" />
          {errors.url && <p className="text-red-600 text-sm mt-1">{errors.url[0]}</p>}
        </div>
        {type === "footer" && (
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Company" />
          </div>
        )}
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
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
