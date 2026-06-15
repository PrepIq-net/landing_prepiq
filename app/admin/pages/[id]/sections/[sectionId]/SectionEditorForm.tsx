"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateSectionContent } from "@/lib/actions/section-actions";
import { toast } from "sonner";

export default function SectionEditorForm({ sectionId, initialContent }: { sectionId: string, initialContent: any }) {
  const [content, setContent] = useState(JSON.stringify(initialContent, null, 2));

  const handleSave = async () => {
    try {
      JSON.parse(content); // Validate JSON
      await updateSectionContent(sectionId, content);
      toast.success("Section content updated");
    } catch (e) {
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-mono text-sm">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={25}
          className="font-mono"
        />
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
