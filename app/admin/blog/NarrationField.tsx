"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { NARRATION_VOICES } from "@/lib/narration-voices";
import type { Lang } from "@/types/blog";

/** One language's generate / regenerate / remove row. */
function LangRow({
  postId,
  lang,
  label,
  url,
  voice,
  disabled,
  disabledHint,
  onChanged,
}: {
  postId: string;
  lang: Lang;
  label: string;
  url: string | null | undefined;
  voice: string | null | undefined;
  disabled?: boolean;
  disabledHint?: string;
  onChanged: (message: string | null) => void;
}) {
  const [busy, setBusy] = useState<"gen" | "del" | null>(null);
  const router = useRouter();
  const voiceRef = useRef<HTMLSelectElement>(null);

  async function generate() {
    setBusy("gen");
    onChanged(null);
    const result = await generatePostNarration(
      postId,
      lang,
      voiceRef.current?.value ?? null
    );
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
          <div className="mt-2">
            <Label
              htmlFor={`voice-${lang}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Voice
            </Label>
            <select
              id={`voice-${lang}`}
              ref={voiceRef}
              defaultValue={voice ?? NARRATION_VOICES[lang][0].id}
              disabled={busy !== null}
              className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50"
            >
              {NARRATION_VOICES[lang].map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
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
  voiceEn,
  voiceFr,
}: {
  postId: string;
  hasFrenchBody: boolean;
  audioUrlEn?: string | null;
  audioUrlFr?: string | null;
  voiceEn?: string | null;
  voiceFr?: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Narration</CardTitle>
        <CardDescription>
          Natural-voice audio read of the article. Generated automatically when
          you publish; regenerate here if a run failed or you edited the copy
          after publishing.
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
          voice={voiceEn}
          onChanged={setMessage}
        />
        <LangRow
          postId={postId}
          lang="fr"
          label="French"
          url={audioUrlFr}
          voice={voiceFr}
          disabled={!hasFrenchBody}
          disabledHint="Add French body copy to enable a French track. French readers hear the English narration until then."
          onChanged={setMessage}
        />
      </CardContent>
    </Card>
  );
}
