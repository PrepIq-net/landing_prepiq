"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="bg-card border border-border rounded-xl shadow-l2 p-6 max-w-2xl">
      <h1 className="text-2xl font-display font-semibold text-foreground mb-6">Add Link</h1>
      {message && <div className="mb-4 text-destructive text-sm">{message}</div>}
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
          {errors.labelEn && <p className="text-destructive text-sm mt-1">{errors.labelEn[0]}</p>}
        </div>
        <div>
          <Label htmlFor="labelFr">Label (French)</Label>
          <Input id="labelFr" name="labelFr" placeholder="Label français" />
          {errors.labelFr && <p className="text-destructive text-sm mt-1">{errors.labelFr[0]}</p>}
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" placeholder="/about" />
          {errors.url && <p className="text-destructive text-sm mt-1">{errors.url[0]}</p>}
        </div>
        {type === "nav" && (
          <>
            <div>
              <Label htmlFor="descriptionEn">Menu note (English)</Label>
              <Textarea
                id="descriptionEn"
                name="descriptionEn"
                className="min-h-[70px]"
                placeholder="Shown under this item in the nav sheet. Optional."
              />
            </div>
            <div>
              <Label htmlFor="descriptionFr">Menu note (French)</Label>
              <Textarea id="descriptionFr" name="descriptionFr" className="min-h-[70px]" />
            </div>
          </>
        )}
        {type === "footer" && (
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue="product">
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product column</SelectItem>
                <SelectItem value="company">Company column</SelectItem>
                <SelectItem value="legal">Legal column</SelectItem>
                <SelectItem value="social">Social icon (opens in a new tab)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">
              Social links render as icons in the footer bar. The icon is picked
              from the URL — LinkedIn, X, GitHub, Instagram, Facebook and
              YouTube are recognised.
            </p>
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
