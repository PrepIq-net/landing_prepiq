"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import CareerMarkdown from "@/components/careers/CareerMarkdown";
import { EditPencil, Eye } from "iconoir-react";

/**
 * A lightweight Markdown editor: a textarea (the real form field, submitted
 * under `name`) plus a live preview rendered with the same renderer the public
 * role page uses. No extra dependencies.
 */
export default function MarkdownEditor({
  name,
  defaultValue = "",
  minHeight = 360,
}: {
  name: string;
  defaultValue?: string;
  minHeight?: number;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="mb-3">
        <TabsTrigger value="write" className="flex items-center gap-2">
          <EditPencil className="h-3.5 w-3.5" />
          Write
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5" />
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="write">
        <Textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-mono text-xs leading-relaxed"
          style={{ minHeight }}
          placeholder={"## About the role\n\n- Responsibility one\n- Responsibility two\n\n**What you'll need**\n\n- ..."}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Markdown: <code>##</code> headings, <code>-</code> lists,{" "}
          <code>**bold**</code>, <code>[label](url)</code>.
        </p>
      </TabsContent>

      <TabsContent value="preview">
        <div
          className="rounded-md border border-border/60 bg-background/40 p-5"
          style={{ minHeight }}
        >
          {value.trim() ? (
            <CareerMarkdown body={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
