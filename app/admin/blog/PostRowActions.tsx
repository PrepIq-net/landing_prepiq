"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EditPencil,
  OpenNewWindow,
  Trash,
  Star,
  StarSolid,
  Eye,
  EyeClosed,
} from "iconoir-react";
import {
  deleteBlogPost,
  toggleBlogPostFeatured,
  toggleBlogPostPublished,
} from "@/lib/actions/blog-actions";

export default function PostRowActions({
  id,
  slug,
  title,
  isPublished,
  isFeatured,
}: {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  isFeatured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    // Deleting destroys the post's Cloudinary assets too, so require a second
    // click rather than acting on the first.
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteBlogPost(id);
      router.refresh();
    });
  }

  function onToggleFeatured() {
    startTransition(async () => {
      await toggleBlogPostFeatured(id, !isFeatured);
      router.refresh();
    });
  }

  function onTogglePublished() {
    startTransition(async () => {
      await toggleBlogPostPublished(id, !isPublished);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleFeatured}
        disabled={pending}
        className={`h-8 w-8 p-0 ${isFeatured ? "text-primary" : ""}`}
        title={isFeatured ? `Unfeature "${title}"` : `Feature "${title}" on the home page`}
      >
        {isFeatured ? (
          <StarSolid className="h-4 w-4" />
        ) : (
          <Star className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePublished}
        disabled={pending}
        className="h-8 w-8 p-0"
        title={isPublished ? `Move "${title}" back to draft` : `Publish "${title}" now`}
      >
        {isPublished ? (
          <EyeClosed className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>

      {isPublished && (
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0" title="View live">
          <Link href={`/blog/${slug}`} target="_blank">
            <OpenNewWindow className="h-4 w-4" />
          </Link>
        </Button>
      )}

      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0" title="Edit">
        <Link href={`/admin/blog/${id}`}>
          <EditPencil className="h-4 w-4" />
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={pending}
        className={`h-8 ${confirming ? "px-2 text-destructive" : "w-8 p-0"}`}
        title="Delete"
      >
        <Trash className="h-4 w-4" />
        {confirming && <span className="ml-1 text-xs">Confirm?</span>}
      </Button>
    </div>
  );
}
