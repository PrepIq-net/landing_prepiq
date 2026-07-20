"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BlogMarkdown from "@/components/blog/BlogMarkdown";
import { uploadPostImage } from "@/lib/actions/blog-actions";
import { estimateReadMinutes } from "@/types/blog";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Text,
  List,
  NumberedListLeft,
  QuoteMessage,
  Code,
  Link as LinkIcon,
  MediaImage,
  Eye,
  EditPencil,
  Table2Columns,
  Minus,
  Expand,
  Collapse,
} from "iconoir-react";

type Mode = "write" | "split" | "preview";

interface ToolbarAction {
  label: string;
  Icon: React.ElementType;
  shortcut?: string;
  run: (api: EditorApi) => void;
}

interface EditorApi {
  wrap: (before: string, after?: string) => void;
  prefixLines: (prefix: string, toggle?: boolean) => void;
  insert: (text: string) => void;
}

const TOOLBAR: (ToolbarAction | "divider")[] = [
  {
    label: "Heading",
    Icon: Text,
    run: (api) => api.prefixLines("## ", true),
  },
  {
    label: "Subheading",
    Icon: Text,
    run: (api) => api.prefixLines("### ", true),
  },
  "divider",
  {
    label: "Bold",
    Icon: Bold,
    shortcut: "⌘B",
    run: (api) => api.wrap("**"),
  },
  {
    label: "Italic",
    Icon: Italic,
    shortcut: "⌘I",
    run: (api) => api.wrap("_"),
  },
  {
    label: "Inline code",
    Icon: Code,
    run: (api) => api.wrap("`"),
  },
  "divider",
  {
    label: "Bullet list",
    Icon: List,
    run: (api) => api.prefixLines("- ", true),
  },
  {
    label: "Numbered list",
    Icon: NumberedListLeft,
    run: (api) => api.prefixLines("1. ", true),
  },
  {
    label: "Quote",
    Icon: QuoteMessage,
    run: (api) => api.prefixLines("> ", true),
  },
  "divider",
  {
    label: "Link",
    Icon: LinkIcon,
    shortcut: "⌘K",
    run: (api) => api.wrap("[", "](https://)"),
  },
  {
    label: "Table",
    Icon: Table2Columns,
    run: (api) =>
      api.insert(
        "\n| Column | Column |\n| --- | --- |\n| Value | Value |\n\n"
      ),
  },
  {
    label: "Divider",
    Icon: Minus,
    run: (api) => api.insert("\n---\n\n"),
  },
];

export default function RichMarkdownEditor({
  name,
  defaultValue = "",
  postId,
  minHeight = 520,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  postId?: string;
  minHeight?: number;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>("write");
  const [fullscreen, setFullscreen] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Writes through execCommand where available so the browser's native undo
   * stack survives toolbar edits — setRangeText would discard it.
   */
  const replaceSelection = useCallback(
    (text: string, selectionStart?: number, selectionEnd?: number) => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();

      if (selectionStart !== undefined) {
        el.setSelectionRange(selectionStart, selectionEnd ?? selectionStart);
      }

      const ok = document.execCommand("insertText", false, text);
      if (!ok) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.setRangeText(text, start, end, "end");
      }
      setValue(el.value);
    },
    []
  );

  const api: EditorApi = {
    wrap: (before, after = before) => {
      const el = textareaRef.current;
      if (!el) return;
      const { selectionStart: start, selectionEnd: end } = el;
      const selected = el.value.slice(start, end);
      replaceSelection(`${before}${selected}${after}`, start, end);

      // With nothing selected, park the caret between the markers so the editor
      // can keep typing inside the new emphasis.
      if (start === end) {
        const caret = start + before.length;
        requestAnimationFrame(() => el.setSelectionRange(caret, caret));
      }
    },

    prefixLines: (prefix, toggle = false) => {
      const el = textareaRef.current;
      if (!el) return;
      const { selectionStart: start, selectionEnd: end } = el;
      const lineStart = el.value.lastIndexOf("\n", start - 1) + 1;
      const lineEndIdx = el.value.indexOf("\n", end);
      const lineEnd = lineEndIdx === -1 ? el.value.length : lineEndIdx;

      const block = el.value.slice(lineStart, lineEnd);
      const lines = block.split("\n");
      const allPrefixed = lines.every((l) => l.startsWith(prefix));

      const next = lines
        .map((line) =>
          toggle && allPrefixed ? line.slice(prefix.length) : `${prefix}${line}`
        )
        .join("\n");

      replaceSelection(next, lineStart, lineEnd);
    },

    insert: (text) => replaceSelection(text),
  };

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/"));
      if (images.length === 0) return;

      setError(null);

      for (const file of images) {
        const token = `![Uploading ${file.name}…](uploading-${Date.now()})`;
        setUploading((n) => n + 1);
        replaceSelection(`\n${token}\n`);

        try {
          const fd = new FormData();
          fd.append("file", file);
          if (postId) fd.append("postId", postId);
          const result = await uploadPostImage(fd);

          setValue((current) =>
            current.replace(
              token,
              result.success && "url" in result
                ? `![${file.name.replace(/\.[^.]+$/, "")}](${result.url})`
                : ""
            )
          );
          if (!result.success) {
            setError(result.message ?? "Upload failed");
          }
        } catch {
          setValue((current) => current.replace(token, ""));
          setError("Upload failed");
        } finally {
          setUploading((n) => n - 1);
        }
      }
    },
    [postId, replaceSelection]
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.metaKey || e.ctrlKey)) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      api.wrap("**");
    } else if (key === "i") {
      e.preventDefault();
      api.wrap("_");
    } else if (key === "k") {
      e.preventDefault();
      api.wrap("[", "](https://)");
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.clipboardData.files);
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      void uploadFiles(files);
    }
  }

  function onDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.dataTransfer.files);
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      setDragging(false);
      void uploadFiles(files);
    }
  }

  // Escape leaves fullscreen; without this the editor traps the admin.
  useEffect(() => {
    if (!fullscreen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [fullscreen]);

  const words = value.split(/\s+/).filter(Boolean).length;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/40",
        fullscreen && "fixed inset-4 z-50 flex flex-col overflow-hidden bg-background shadow-l2"
      )}
    >
      {/* The real form field — always present, even in preview-only mode. */}
      <textarea name={name} value={value} readOnly hidden />

      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-2">
        {TOOLBAR.map((item, i) =>
          item === "divider" ? (
            <span key={`d-${i}`} className="mx-1 h-5 w-px bg-border" />
          ) : (
            <button
              key={item.label}
              type="button"
              title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
              aria-label={item.label}
              onClick={() => item.run(api)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.Icon
                className={cn("h-4 w-4", item.label === "Subheading" && "h-3 w-3")}
              />
            </button>
          )
        )}

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          title="Insert image"
          aria-label="Insert image"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-8 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <MediaImage className="h-4 w-4" />
          <span className="text-xs font-medium">Image</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            void uploadFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />

        <div className="ml-auto flex items-center gap-1">
          {uploading > 0 && (
            <span className="mr-2 text-xs text-primary">
              Uploading {uploading}…
            </span>
          )}

          <div className="flex rounded-md border border-border p-0.5">
            {(
              [
                ["write", EditPencil, "Write"],
                ["split", Table2Columns, "Split"],
                ["preview", Eye, "Preview"],
              ] as const
            ).map(([m, Icon, label]) => (
              <button
                key={m}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => setMode(m)}
                className={cn(
                  "flex h-7 w-8 items-center justify-center rounded transition-colors",
                  mode === m
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          <button
            type="button"
            title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => setFullscreen((f) => !f)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {fullscreen ? (
              <Collapse className="h-4 w-4" />
            ) : (
              <Expand className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div
        className={cn(
          "grid",
          mode === "split" ? "md:grid-cols-2" : "grid-cols-1",
          fullscreen && "min-h-0 flex-1"
        )}
      >
        {mode !== "preview" && (
          <div className={cn("relative", fullscreen && "min-h-0 overflow-auto")}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              placeholder={
                placeholder ??
                "Write the article in Markdown.\n\n## A section heading\n\nDrag an image straight into the editor to upload it."
              }
              spellCheck
              className={cn(
                "block h-full w-full resize-y bg-transparent p-5 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60",
                dragging && "ring-2 ring-inset ring-primary/40"
              )}
              style={{ minHeight: fullscreen ? "100%" : minHeight }}
            />
            {dragging && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-medium text-primary">
                Drop to upload
              </div>
            )}
          </div>
        )}

        {mode !== "write" && (
          <div
            className={cn(
              "overflow-auto p-6",
              mode === "split" && "border-t border-border md:border-l md:border-t-0"
            )}
            style={{ minHeight: fullscreen ? undefined : minHeight }}
          >
            {value.trim() ? (
              <div className="mx-auto max-w-[68ch]">
                <BlogMarkdown body={value} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nothing to preview yet.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <span>
          {words.toLocaleString()} words · ~{estimateReadMinutes(value)} min read
        </span>
        <span className="hidden sm:inline">
          Markdown · ⌘B bold · ⌘I italic · ⌘K link · drag or paste to upload
        </span>
      </div>
    </div>
  );
}
