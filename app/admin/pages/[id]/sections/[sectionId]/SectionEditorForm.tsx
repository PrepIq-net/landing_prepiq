"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateSectionContent } from "@/lib/actions/section-actions";
import { toast } from "sonner";
import { Code, Eye, Save, Settings2 } from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

interface SectionEditorFormProps {
  sectionId: string;
  initialContent: any;
  componentType: string;
}

export default function SectionEditorForm({ sectionId, initialContent, componentType }: SectionEditorFormProps) {
  const [content, setContent] = useState(initialContent);
  const [jsonString, setJsonString] = useState(JSON.stringify(initialContent, null, 2));
  const [advancedMode, setAdvancedMode] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Sync Visual -> JSON when switching TO Advanced Mode
  const handleModeToggle = (isAdvanced: boolean) => {
    if (isAdvanced) {
      setJsonString(JSON.stringify(content, null, 2));
    } else {
      // Sync JSON -> Visual when switching TO Visual Mode
      try {
        const parsed = JSON.parse(jsonString);
        setContent(parsed);
      } catch (e) {
        toast.error("Invalid JSON format. Fix errors before switching back to Visual Mode.");
        return; // Don't switch if JSON is invalid
      }
    }
    setAdvancedMode(isAdvanced);
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      let finalContent = content;
      if (advancedMode) {
        finalContent = JSON.parse(jsonString);
        setContent(finalContent);
      }

      await updateSectionContent(sectionId, JSON.stringify(finalContent));
      toast.success("Section updated successfully");
    } catch (e) {
      toast.error("Invalid JSON format. Please check your syntax.");
    } finally {
      setIsPending(false);
    }
  };

  const updateField = useCallback((path: string, value: any) => {
    setContent((prev: any) => {
      const newContent = JSON.parse(JSON.stringify(prev)); // Deep clone
      const keys = path.split('.');
      let current = newContent;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  }, []);

  const renderVisualEditor = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(content).map(([key, value]) => {
            if (typeof value === "string") {
              return (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  {value.length > 100 ? (
                    <Textarea
                      value={value}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      value={value}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  )}
                </div>
              );
            }
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
               return (
                 <div key={key} className="col-span-full border border-border/50 p-4 rounded-lg bg-muted/20">
                    <h3 className="font-semibold mb-4 capitalize text-sm flex items-center gap-2">
                      <Settings2 className="h-3.5 w-3.5" />
                      {key}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {Object.entries(value).map(([subKey, subValue]) => (
                          <div key={subKey} className="space-y-2">
                            <Label className="capitalize text-xs text-muted-foreground">{subKey.replace(/([A-Z])/g, ' $1')}</Label>
                            <Input
                              value={subValue as string}
                              onChange={(e) => updateField(`${key}.${subKey}`, e.target.value)}
                            />
                          </div>
                       ))}
                    </div>
                 </div>
               )
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Editing: {componentType}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="advanced-mode" className="text-sm cursor-pointer">Advanced Mode</Label>
            <Switch
              id="advanced-mode"
              checked={advancedMode}
              onCheckedChange={handleModeToggle}
            />
          </div>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {advancedMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {advancedMode ? "Raw JSON Editor" : "Visual Content Editor"}
          </CardTitle>
          <CardDescription>
            {advancedMode
              ? "Directly edit the underlying data structure. Use with caution."
              : "Edit section content using brand-compliant inputs."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {advancedMode ? (
            <div className="font-mono text-sm border rounded-md overflow-hidden bg-[#2d2d2d]">
              <Editor
                value={jsonString}
                onValueChange={setJsonString}
                highlight={(code) => highlight(code, languages.json, "json")}
                padding={20}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 14,
                  minHeight: "400px",
                }}
              />
            </div>
          ) : (
            renderVisualEditor()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
