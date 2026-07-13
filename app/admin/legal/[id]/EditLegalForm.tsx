"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  saveLegalDocument,
  publishLegalDocument,
} from "@/lib/actions/legal-actions";
import type { LegalDocument, LegalDocumentVersion } from "@prisma/client";
import { ExternalLink, Globe, History, ShieldCheck } from "lucide-react";
import Link from "next/link";

type VersionSummary = Pick<
  LegalDocumentVersion,
  "id" | "version" | "effectiveDate" | "publishedAt" | "publishedBy"
>;

interface EditLegalFormProps {
  doc: LegalDocument & { versions: VersionSummary[] };
}

export default function EditLegalForm({ doc }: EditLegalFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function submit(action: "save" | "publish") {
    if (!formRef.current) return;
    if (
      action === "publish" &&
      !window.confirm(
        `Publish a new version (v${doc.version + 1})? This resets the effective date to today and snapshots the previous version. Use "Save" for typo fixes.`
      )
    ) {
      return;
    }

    const formData = new FormData(formRef.current);
    setIsPending(true);
    setErrors({});
    const result =
      action === "publish"
        ? await publishLegalDocument(doc.id, formData)
        : await saveLegalDocument(doc.id, formData);
    setIsPending(false);

    setMessage(result.message ?? (result.success ? "Saved" : "Failed"));
    if (result.success) {
      router.refresh();
    } else if (result.errors) {
      setErrors(result.errors);
    }
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <p className="text-red-600 text-sm mt-1">{errors[name][0]}</p>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/legal">← Back</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {doc.titleEn}
            </h1>
            <p className="text-muted-foreground text-sm">
              Version {doc.version} · effective{" "}
              {new Date(doc.effectiveDate).toISOString().slice(0, 10)} ·
              content is Markdown
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${doc.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Link>
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.toLowerCase().includes("error") ||
            message.toLowerCase().includes("failed")
              ? "bg-destructive/15 text-destructive border border-destructive/20"
              : "bg-success/15 text-success border border-success/20"
          }`}
        >
          {message}
        </div>
      )}

      <form ref={formRef} className="space-y-6">
        <Tabs defaultValue="en" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="en" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              English
            </TabsTrigger>
            <TabsTrigger value="fr" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              French
            </TabsTrigger>
          </TabsList>

          {/* Both panels stay mounted via forceMount so hidden-tab fields are
              still submitted; visibility is handled with CSS. */}
          <TabsContent value="en" forceMount className="data-[state=inactive]:hidden space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>English Content</CardTitle>
                <CardDescription>
                  Headings with ##, lists with -, links as [label](url).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title (English)</Label>
                  <Input id="titleEn" name="titleEn" defaultValue={doc.titleEn} />
                  {fieldError("titleEn")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyEn">Body (English, Markdown)</Label>
                  <Textarea
                    id="bodyEn"
                    name="bodyEn"
                    defaultValue={doc.bodyEn}
                    className="min-h-[480px] font-mono text-xs leading-relaxed"
                  />
                  {fieldError("bodyEn")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fr" forceMount className="data-[state=inactive]:hidden space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>French Content</CardTitle>
                <CardDescription>
                  Titres avec ##, listes avec -, liens [label](url).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titleFr">Title (French)</Label>
                  <Input id="titleFr" name="titleFr" defaultValue={doc.titleFr} />
                  {fieldError("titleFr")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFr">Body (French, Markdown)</Label>
                  <Textarea
                    id="bodyFr"
                    name="bodyFr"
                    defaultValue={doc.bodyFr}
                    className="min-h-[480px] font-mono text-xs leading-relaxed"
                  />
                  {fieldError("bodyFr")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => submit("save")}
          >
            {isPending ? "Working..." : "Save (no version bump)"}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => submit("publish")}
            className="bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            {isPending ? "Working..." : `Publish v${doc.version + 1}`}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
          <CardDescription>
            Immutable snapshots written on each publish.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>Published By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doc.versions.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <Badge
                      variant={v.version === doc.version ? "default" : "outline"}
                    >
                      v{v.version}
                      {v.version === doc.version ? " · current" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(v.effectiveDate).toISOString().slice(0, 10)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(v.publishedAt).toISOString().slice(0, 16).replace("T", " ")}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {v.publishedBy ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
