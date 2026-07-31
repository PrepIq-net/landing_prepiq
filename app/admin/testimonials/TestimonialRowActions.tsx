"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditPencil, Trash, Eye, EyeClosed } from "iconoir-react";
import {
  deleteTestimonial,
  toggleTestimonialPublished,
} from "@/lib/actions/testimonial-actions";

export default function TestimonialRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onToggle() {
    startTransition(async () => {
      await toggleTestimonialPublished(id);
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteTestimonial(id);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        disabled={pending}
        className="h-8 w-8 p-0"
        title={isPublished ? "Unpublish" : "Publish"}
      >
        {isPublished ? (
          <EyeClosed className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
        title="Edit"
      >
        <Link href={`/admin/testimonials/${id}`}>
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
