"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updatePage } from "@/lib/actions/page-actions";
import { toggleSection, moveSection } from "@/lib/actions/section-actions";
import { Page, Section } from "@prisma/client";
import { Edit, ArrowUp, ArrowDown, Eye, EyeOff, Layout, Type, Globe, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { BRAND_TOKENS } from "@/lib/brand-tokens";

interface EditPageFormProps {
  page: Page & { sections: Section[] };
}

export default function EditPageForm({ page }: EditPageFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updatePage(page.id, formData);
    setIsPending(false);
    if (result.success) {
      setMessage("Page updated successfully");
      router.refresh();
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.message) setMessage(result.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/pages">← Back</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Page: {page.titleEn}</h1>
            <p className="text-muted-foreground text-sm">Manage content, styles, and SEO for this page.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${page.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Link>
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes("success") ? "bg-success/15 text-success border border-success/20" : "bg-destructive/15 text-destructive border border-destructive/20"}`}>
          {message}
        </div>
      )}

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Content Management
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Style & Branding
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO & Metadata
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Sections</CardTitle>
              <CardDescription>Manage the order and visibility of sections on this page.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title (EN)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {page.sections.map((section, index) => (
                    <TableRow key={section.id} className={!section.isActive ? "opacity-50 grayscale" : ""}>
                      <TableCell className="font-mono text-xs">{section.componentType}</TableCell>
                      <TableCell>{section.titleEn}</TableCell>
                      <TableCell>
                        {section.isActive ? (
                          <Badge variant="default" className="bg-success/20 text-success border-success/30">Live</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell>{section.sortOrder}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <form action={moveSection.bind(null, section.id, "up")}>
                          <Button variant="outline" size="icon" disabled={index === 0} type="submit"><ArrowUp className="h-4 w-4" /></Button>
                        </form>
                        <form action={moveSection.bind(null, section.id, "down")}>
                          <Button variant="outline" size="icon" disabled={index === page.sections.length - 1} type="submit"><ArrowDown className="h-4 w-4" /></Button>
                        </form>
                        <form action={toggleSection.bind(null, section.id)}>
                          <Button variant="outline" size="icon" type="submit" title={section.isActive ? "Hide" : "Show"}>
                            {section.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </form>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/pages/${page.id}/sections/${section.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Style Guide</CardTitle>
              <CardDescription>Customize the page layout and appearance using brand-approved tokens.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="slug" defaultValue={page.slug} />
                <input type="hidden" name="titleEn" defaultValue={page.titleEn} />
                <input type="hidden" name="titleFr" defaultValue={page.titleFr} />

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Primary Brand Color</Label>
                      <div className="flex items-center gap-4 p-3 border rounded-md bg-muted/50">
                        <div className="h-10 w-10 rounded-full border shadow-sm" style={{ backgroundColor: BRAND_TOKENS.colors.gold.default }} />
                        <div>
                          <p className="text-sm font-medium">Gold (Default)</p>
                          <p className="text-xs text-muted-foreground">{BRAND_TOKENS.colors.gold.default}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">This color is defined in the Brand Guide and cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="layoutWidth">Container Max Width</Label>
                      <Select defaultValue={JSON.parse(page.configJson || "{}").maxWidth || "1440px"} name="maxWidth">
                        <SelectTrigger id="layoutWidth">
                          <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1280px">1280px (Compact)</SelectItem>
                          <SelectItem value="1440px">1440px (Standard)</SelectItem>
                          <SelectItem value="1600px">1600px (Wide)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spacingScale">Global Spacing Scale</Label>
                      <Select defaultValue={JSON.parse(page.configJson || "{}").spacingScale || "8px"} name="spacingScale">
                        <SelectTrigger id="spacingScale">
                          <SelectValue placeholder="Select spacing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4px">4px (Tight)</SelectItem>
                          <SelectItem value="8px">8px (Standard)</SelectItem>
                          <SelectItem value="12px">12px (Loose)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="borderRadius">Component Radius</Label>
                      <Select defaultValue={JSON.parse(page.configJson || "{}").borderRadius || "12px"} name="borderRadius">
                        <SelectTrigger id="borderRadius">
                          <SelectValue placeholder="Select radius" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4px">4px (Sharp)</SelectItem>
                          <SelectItem value="8px">8px (Modern)</SelectItem>
                          <SelectItem value="12px">12px (Standard)</SelectItem>
                          <SelectItem value="16px">16px (Soft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : "Save Branding Settings"}
                    </Button>
                 </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
              <CardDescription>Optimize your page for search engines and social media sharing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="slug" defaultValue={page.slug} />
                <input type="hidden" name="titleEn" defaultValue={page.titleEn} />
                <input type="hidden" name="titleFr" defaultValue={page.titleFr} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Globe className="h-4 w-4" /> English Metadata</h3>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescriptionEn">Meta Description</Label>
                      <Textarea
                        id="metaDescriptionEn"
                        name="metaDescriptionEn"
                        defaultValue={page.metaDescriptionEn || ""}
                        placeholder="Brief summary of the page content..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Globe className="h-4 w-4" /> French Metadata</h3>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescriptionFr">Meta Description</Label>
                      <Textarea
                        id="metaDescriptionFr"
                        name="metaDescriptionFr"
                        defaultValue={page.metaDescriptionFr || ""}
                        placeholder="Résumé bref du contenu de la page..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save SEO Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>Core page configuration.</CardDescription>
            </CardHeader>
            <CardContent>
               <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" defaultValue={page.slug} />
                    {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input id="sortOrder" name="sortOrder" type="number" defaultValue={page.sortOrder} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">Title (English)</Label>
                    <Input id="titleEn" name="titleEn" defaultValue={page.titleEn} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleFr">Title (French)</Label>
                    <Input id="titleFr" name="titleFr" defaultValue={page.titleFr} />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                   <Button type="submit" variant="outline" disabled={isPending}>Update Core Settings</Button>
                </div>
               </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
