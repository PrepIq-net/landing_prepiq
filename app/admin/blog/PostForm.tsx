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
import RichMarkdownEditor from "@/components/admin/RichMarkdownEditor";
import CoverImageField from "./CoverImageField";
import NarrationField from "./NarrationField";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog-actions";
import { SITE_URL } from "@/lib/constants";
import { Globe, OpenNewWindow } from "iconoir-react";

export interface PostFormValues {
  id?: string;
  slug: string;
  titleEn: string;
  titleFr: string | null;
  excerptEn: string;
  excerptFr: string | null;
  bodyEn: string;
  bodyFr: string | null;
  coverUrl: string | null;
  coverPublicId: string | null;
  coverAlt: string | null;
  category: string;
  tags: string[];
  authorName: string;
  authorRole: string | null;
  authorAvatar: string | null;
  readMinutes: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt: string | null;
  audioUrlEn?: string | null;
  audioUrlFr?: string | null;
  audioUpdatedAt?: string | null;
}

const EMPTY: PostFormValues = {
  slug: "",
  titleEn: "",
  titleFr: null,
  excerptEn: "",
  excerptFr: null,
  bodyEn: "",
  bodyFr: null,
  coverUrl: null,
  coverPublicId: null,
  coverAlt: null,
  category: "Operations",
  tags: [],
  authorName: "PrepIQ Team",
  authorRole: null,
  authorAvatar: null,
  readMinutes: null,
  seoTitle: null,
  seoDescription: null,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
  publishedAt: null,
};

const CATEGORIES = [
  "Operations",
  "Forecasting",
  "Food Waste",
  "Technology",
  "Multi-Branch",
  "Guides",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 160);
}

/** `datetime-local` needs `YYYY-MM-DDTHH:mm` in local time, not an ISO string. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export default function PostForm({ post }: { post?: PostFormValues }) {
  const values = post ?? EMPTY;
  const isEdit = Boolean(post?.id);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [title, setTitle] = useState(values.titleEn);
  const [slug, setSlug] = useState(values.slug);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [seoTitle, setSeoTitle] = useState(values.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(values.seoDescription ?? "");
  const [excerpt, setExcerpt] = useState(values.excerptEn);

  function onTitleChange(next: string) {
    setTitle(next);
    // The slug tracks the title until an editor types their own; changing it
    // afterwards would break links that are already published.
    if (!slugTouched) setSlug(slugify(next));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;

    setPending(true);
    setErrors({});
    setMessage(null);

    const fd = new FormData(formRef.current);
    const result = isEdit
      ? await updateBlogPost(post!.id!, fd)
      : await createBlogPost(fd);
    setPending(false);

    if (result.success) {
      router.push("/admin/blog");
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

  const previewTitle = seoTitle || `${title || "Untitled article"} — PrepIQ`;
  const previewDescription = seoDescription || excerpt;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/blog">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? `Edit: ${values.titleEn}` : "New article"}
          </h1>
        </div>
        {isEdit && values.isPublished && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/blog/${values.slug}`} target="_blank">
              <OpenNewWindow className="mr-2 h-4 w-4" />
              View live
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article</CardTitle>
                <CardDescription>
                  The English fields are required. French is optional — anything
                  left blank falls back to English on the public site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titleEn">Title</Label>
                  <Input
                    id="titleEn"
                    name="titleEn"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="The Hidden Cost of Food Waste"
                    className="mt-1.5"
                  />
                  {err("titleEn")}
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      /blog/
                    </span>
                    <Input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value);
                      }}
                      placeholder="hidden-cost-of-food-waste"
                      className="font-mono text-sm"
                    />
                  </div>
                  {err("slug")}
                </div>

                <div>
                  <Label htmlFor="excerptEn">
                    Excerpt
                    <span className="ml-2 font-normal text-muted-foreground">
                      {excerpt.length}/500 · shown on cards and in search results
                    </span>
                  </Label>
                  <Textarea
                    id="excerptEn"
                    name="excerptEn"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Most kitchens lose money before service even begins. Here's where it goes."
                    className="mt-1.5"
                  />
                  {err("excerptEn")}
                </div>

                <CoverImageField
                  defaultUrl={values.coverUrl}
                  defaultPublicId={values.coverPublicId}
                  defaultAlt={values.coverAlt}
                  postId={post?.id}
                />
              </CardContent>
            </Card>

            <Tabs defaultValue="en" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="en" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> English body
                </TabsTrigger>
                <TabsTrigger value="fr" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> French body
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </TabsTrigger>
              </TabsList>

              {/* forceMount keeps both editors in the DOM so switching tabs
                  doesn't drop the untouched language from the submission. */}
              <TabsContent
                value="en"
                forceMount
                className="space-y-4 data-[state=inactive]:hidden"
              >
                <RichMarkdownEditor
                  name="bodyEn"
                  defaultValue={values.bodyEn}
                  postId={post?.id}
                />
                {err("bodyEn")}
              </TabsContent>

              <TabsContent
                value="fr"
                forceMount
                className="space-y-4 data-[state=inactive]:hidden"
              >
                <div className="mb-3 space-y-3 rounded-lg border border-border bg-card/40 p-4">
                  <div>
                    <Label htmlFor="titleFr">Titre (French)</Label>
                    <Input
                      id="titleFr"
                      name="titleFr"
                      defaultValue={values.titleFr ?? ""}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerptFr">Extrait (French)</Label>
                    <Textarea
                      id="excerptFr"
                      name="excerptFr"
                      defaultValue={values.excerptFr ?? ""}
                      rows={2}
                      maxLength={500}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <RichMarkdownEditor
                  name="bodyFr"
                  defaultValue={values.bodyFr ?? ""}
                  postId={post?.id}
                  placeholder="Leave blank to serve the English article to French visitors."
                />
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Search engine listing</CardTitle>
                <CardDescription>
                  Optional overrides. Left blank, the title and excerpt above are
                  used.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-card/40 p-4">
                  <p className="truncate text-xs text-muted-foreground">
                    {SITE_URL}/blog/{slug || "your-slug"}
                  </p>
                  <p className="mt-1 truncate text-[15px] text-[#8ab4f8]">
                    {previewTitle}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {previewDescription || "Your excerpt will appear here."}
                  </p>
                </div>

                <div>
                  <Label htmlFor="seoTitle">
                    SEO title
                    <span
                      className={`ml-2 font-normal ${
                        seoTitle.length > 60
                          ? "text-[hsl(var(--warning))]"
                          : "text-muted-foreground"
                      }`}
                    >
                      {seoTitle.length}/60
                    </span>
                  </Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription">
                    Meta description
                    <span
                      className={`ml-2 font-normal ${
                        seoDescription.length > 155
                          ? "text-[hsl(var(--warning))]"
                          : "text-muted-foreground"
                      }`}
                    >
                      {seoDescription.length}/155
                    </span>
                  </Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={2}
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: publishing controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-2.5 text-sm font-medium">
                  <input
                    type="checkbox"
                    name="isPublished"
                    defaultChecked={values.isPublished}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Published
                </label>

                <label className="flex items-center gap-2.5 text-sm font-medium">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={values.isFeatured}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Feature on the home page
                </label>

                <div>
                  <Label htmlFor="publishedAt">Publish date</Label>
                  <Input
                    id="publishedAt"
                    name="publishedAt"
                    type="datetime-local"
                    defaultValue={toLocalInput(values.publishedAt)}
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Blank = stamped when first published.
                  </p>
                </div>

                <div>
                  <Label htmlFor="sortOrder">Featured order</Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    defaultValue={values.sortOrder}
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lower shows first in the home strip.
                  </p>
                </div>
              </CardContent>
            </Card>

            {isEdit && post?.id && (
              <NarrationField
                postId={post.id}
                hasFrenchBody={Boolean(values.bodyFr && values.bodyFr.trim())}
                audioUrlEn={values.audioUrlEn}
                audioUrlFr={values.audioUrlFr}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={values.category}
                    list="blog-categories"
                    className="mt-1.5"
                  />
                  <datalist id="blog-categories">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  {err("category")}
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={values.tags.join(", ")}
                    placeholder="food waste, prep planning"
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Comma separated.
                  </p>
                </div>

                <div>
                  <Label htmlFor="readMinutes">Read time override</Label>
                  <Input
                    id="readMinutes"
                    name="readMinutes"
                    type="number"
                    min={1}
                    defaultValue={values.readMinutes ?? ""}
                    placeholder="Auto"
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="authorName">Name</Label>
                  <Input
                    id="authorName"
                    name="authorName"
                    defaultValue={values.authorName}
                    className="mt-1.5"
                  />
                  {err("authorName")}
                </div>
                <div>
                  <Label htmlFor="authorRole">Role</Label>
                  <Input
                    id="authorRole"
                    name="authorRole"
                    defaultValue={values.authorRole ?? ""}
                    placeholder="Operations"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="authorAvatar">Avatar URL</Label>
                  <Input
                    id="authorAvatar"
                    name="authorAvatar"
                    defaultValue={values.authorAvatar ?? ""}
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="bg-primary font-semibold text-primary-foreground hover:bg-[#B8962E]"
          >
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
