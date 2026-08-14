"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLink } from "@/lib/actions/link-actions";
import { Link } from "@prisma/client";
import { toast } from "sonner";
import { Code } from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

interface LinkContent {
  type: "nav" | "footer";
  labelEn: string;
  labelFr: string;
  url: string;
  category: string;
  sortOrder: number;
  descriptionEn: string;
  descriptionFr: string;
}

function toContent(link: Link): LinkContent {
  return {
    type: link.type as "nav" | "footer",
    labelEn: link.labelEn,
    labelFr: link.labelFr,
    url: link.url,
    category: link.category ?? "",
    sortOrder: link.sortOrder,
    descriptionEn: link.descriptionEn ?? "",
    descriptionFr: link.descriptionFr ?? "",
  };
}

export default function EditLinkForm({ link }: { link: Link }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [content, setContent] = useState<LinkContent>(() => toContent(link));
  const [jsonString, setJsonString] = useState(() => JSON.stringify(toContent(link), null, 2));
  const [advancedMode, setAdvancedMode] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const updateField = <K extends keyof LinkContent>(key: K, value: LinkContent[K]) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  // Same Visual <-> JSON sync contract as the page section editor: switching
  // to Advanced serializes the current form state; switching back parses the
  // JSON and refuses the switch (with a toast) if it doesn't parse.
  const handleModeToggle = (isAdvanced: boolean) => {
    if (isAdvanced) {
      setJsonString(JSON.stringify(content, null, 2));
    } else {
      try {
        const parsed = JSON.parse(jsonString);
        setContent(parsed);
      } catch {
        toast.error("Invalid JSON format. Fix errors before switching back to Visual Mode.");
        return;
      }
    }
    setAdvancedMode(isAdvanced);
  };

  const handleSubmit = async () => {
    setIsPending(true);
    setErrors({});
    setMessage(null);
    try {
      let finalContent = content;
      if (advancedMode) {
        finalContent = JSON.parse(jsonString);
        setContent(finalContent);
      }

      const formData = new FormData();
      formData.set("type", finalContent.type);
      formData.set("labelEn", finalContent.labelEn);
      formData.set("labelFr", finalContent.labelFr);
      formData.set("url", finalContent.url);
      formData.set("sortOrder", String(finalContent.sortOrder));
      // Category only means anything for footer links — mirrors the visual
      // form only rendering it in that case, so editing a nav link never
      // stomps a category it can't see.
      if (finalContent.type === "footer") {
        formData.set("category", finalContent.category);
      }
      formData.set("descriptionEn", finalContent.descriptionEn);
      formData.set("descriptionFr", finalContent.descriptionFr);

      const result = await updateLink(link.id, formData);
      if (result.success) {
        toast.success("Link updated");
        router.push("/admin/links");
      } else {
        if (result.errors) setErrors(result.errors);
        if (result.message) setMessage(result.message);
      }
    } catch {
      toast.error("Invalid JSON format. Please check your syntax.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-l2 p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-foreground">Edit Link</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="advanced-mode" className="text-sm cursor-pointer text-muted-foreground">
            Advanced Mode
          </Label>
          <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={handleModeToggle} />
        </div>
      </div>

      {message && <div className="mb-4 text-destructive text-sm">{message}</div>}

      {advancedMode ? (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5" />
            Raw JSON — directly edits every field on this link, including sortOrder and
            category. Use with caution.
          </p>
          <div className="font-mono text-sm border border-border rounded-md overflow-hidden bg-[#2d2d2d]">
            <Editor
              value={jsonString}
              onValueChange={setJsonString}
              highlight={(code) => highlight(code, languages.json, "json")}
              padding={20}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: "320px",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={content.type} onValueChange={(v) => updateField("type", v as "nav" | "footer")}>
              <SelectTrigger id="type">
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
            <Input id="labelEn" value={content.labelEn} onChange={(e) => updateField("labelEn", e.target.value)} />
            {errors.labelEn && <p className="text-destructive text-sm mt-1">{errors.labelEn[0]}</p>}
          </div>
          <div>
            <Label htmlFor="labelFr">Label (French)</Label>
            <Input id="labelFr" value={content.labelFr} onChange={(e) => updateField("labelFr", e.target.value)} />
            {errors.labelFr && <p className="text-destructive text-sm mt-1">{errors.labelFr[0]}</p>}
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={content.url} onChange={(e) => updateField("url", e.target.value)} />
            {errors.url && <p className="text-destructive text-sm mt-1">{errors.url[0]}</p>}
          </div>

          {content.type === "nav" && (
            <>
              <div>
                <Label htmlFor="descriptionEn">Menu note (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={content.descriptionEn}
                  onChange={(e) => updateField("descriptionEn", e.target.value)}
                  className="min-h-[70px]"
                  placeholder="Shown under this item in the nav sheet. Leave empty to use the built-in default, if this route has one."
                />
              </div>
              <div>
                <Label htmlFor="descriptionFr">Menu note (French)</Label>
                <Textarea
                  id="descriptionFr"
                  value={content.descriptionFr}
                  onChange={(e) => updateField("descriptionFr", e.target.value)}
                  className="min-h-[70px]"
                />
              </div>
            </>
          )}

          {content.type === "footer" && (
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={content.category || "product"} onValueChange={(v) => updateField("category", v)}>
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
            <Input
              id="sortOrder"
              type="number"
              value={content.sortOrder}
              onChange={(e) => updateField("sortOrder", Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" type="button" onClick={() => router.push("/admin/links")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
