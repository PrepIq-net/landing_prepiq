"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaImage, Trash, Upload } from "iconoir-react";
import { uploadPostImage } from "@/lib/actions/blog-actions";

export default function CoverImageField({
  defaultUrl,
  defaultPublicId,
  defaultAlt,
  postId,
}: {
  defaultUrl: string | null;
  defaultPublicId: string | null;
  defaultAlt: string | null;
  postId?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [publicId, setPublicId] = useState(defaultPublicId ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (postId) fd.append("postId", postId);
      const result = await uploadPostImage(fd);

      if (result.success && "url" in result) {
        setUrl(result.url);
        setPublicId(result.publicId);
      } else {
        setError(result.message ?? "Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  /**
   * Clearing only empties the form fields — the Cloudinary asset is destroyed on
   * save, so an accidental clear can be undone by leaving without saving.
   */
  function clear() {
    setUrl("");
    setPublicId("");
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="coverUrl" value={url} />
      <input type="hidden" name="coverPublicId" value={publicId} />

      <Label>Cover image</Label>

      {url ? (
        <div className="group relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="aspect-[16/9] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              Replace
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={clear}>
              <Trash className="mr-2 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void upload(e.dataTransfer.files[0]);
          }}
          disabled={uploading}
          className={`flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors ${
            dragging
              ? "border-primary/50 bg-primary/[0.06]"
              : "border-border bg-card/40 hover:border-primary/30"
          }`}
        >
          <MediaImage className="h-7 w-7 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {uploading ? "Uploading…" : "Upload a cover image"}
          </span>
          <span className="text-xs text-muted-foreground">
            Drag and drop, or click to browse · 1600×900 or wider
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <Label htmlFor="coverAlt" className="text-xs text-muted-foreground">
          Alt text (describe the image for screen readers and search engines)
        </Label>
        <Input
          id="coverAlt"
          name="coverAlt"
          defaultValue={defaultAlt ?? ""}
          placeholder="A chef checking a prep list on a tablet"
          className="mt-1.5"
        />
      </div>
    </div>
  );
}
