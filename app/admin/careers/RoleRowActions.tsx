"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditPencil, OpenNewWindow, Trash } from "iconoir-react";
import { deleteJobRole } from "@/lib/actions/career-actions";

export default function RoleRowActions({
  id,
  slug,
  isPublished,
}: {
  id: string;
  slug: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteJobRole(id);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-2">
      {isPublished && (
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0" title="View live">
          <Link href={`/careers/${slug}`} target="_blank">
            <OpenNewWindow className="h-4 w-4" />
          </Link>
        </Button>
      )}
      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0" title="Edit">
        <Link href={`/admin/careers/${id}`}>
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
