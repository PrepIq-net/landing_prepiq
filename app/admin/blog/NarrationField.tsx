"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SoundHigh, Trash, Refresh } from "iconoir-react";
import {
  generatePostNarration,
  deletePostNarration,
} from "@/lib/actions/blog-actions";
import type { Lang } from "@/types/blog";

/** One language's generate / regenerate / remove row. */
function LangRow({
  postId,
  lang,
  label,
  url,
  disabled,
  disabledHint,
  onChanged,
}: {
  postId: string;
  lang: Lang;
  label: string;
  url: string | null | undefined;
  disabled?: boolean;
  disabledHint?: string;
  onChanged: (message: string | null) => void;
}) {
  const [busy, setBusy] = useState<"gen" | "del" | null>(null);
  const router = useRouter();

  async function generate() {
    setBusy("gen");
    onChanged(null);
    const result = await generatePostNarration(postId, lang);
    setBusy(null);
    if (result.success) router.refresh();
    else onChanged(result.message ?? "Generation failed.");
  }

  async function remove() {
    setBusy("del");
    onChanged(null);
    const result = await deletePostNarration(postId, lang);
    setBusy(null);
    if (result.success) router.refresh();
    else onChanged(result.message ?? "Removal failed.");
  }

  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`text-xs ${url ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`}
        >
          {url ? "Ready" : "Not generated"}
        </span>
      </div>

      {disabled ? (
        <p className="mt-2 text-xs text-muted-foreground">{disabledHint}</p>
      ) : (
        <>
          {url && (
            <audio controls src={url} className="mt-2 h-9 w-full" preload="none" />
          )}
          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy !== null}
              onClick={generate}
            >
              {url ? (
                <Refresh className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <SoundHigh className="mr-1.5 h-3.5 w-3.5" />
              )}
              {busy === "gen"
                ? "Generating…"
                : url
                  ? "Regenerate"
                  : "Generate"}
            </Button>
            {url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={busy !== null}
                onClick={remove}
                className="text-destructive hover:text-destructive"
              >
                <Trash className="mr-1.5 h-3.5 w-3.5" />
                {busy === "del" ? "Removing…" : "Remove"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Sidebar card for generating spoken-word narration of a post. Only shown in
 * edit mode, because generation reads the *saved* body from the database — an
 * editor must save copy changes before regenerating so the audio matches.
 */
export default function NarrationField({
  postId,
  hasFrenchBody,
  audioUrlEn,
  audioUrlFr,
}: {
  postId: string;
  hasFrenchBody: boolean;
  audioUrlEn?: string | null;
  audioUrlFr?: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Narration</CardTitle>
        <CardDescription>
          Natural-voice audio read of the article. Save any copy edits first —
          narration is generated from the saved text.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {message && (
          <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
            {message}
          </p>
        )}
        <LangRow
          postId={postId}
          lang="en"
          label="English"
          url={audioUrlEn}
          onChanged={setMessage}
        />
        <LangRow
          postId={postId}
          lang="fr"
          label="French"
          url={audioUrlFr}
          disabled={!hasFrenchBody}
          disabledHint="Add French body copy to enable a French track. French readers hear the English narration until then."
          onChanged={setMessage}
        />
      </CardContent>
    </Card>
  );
}
