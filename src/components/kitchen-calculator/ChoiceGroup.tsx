"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "iconoir-react";

interface Option {
  value: string;
  label: string;
}

/**
 * A radio group rendered as large, clickable option cards rather than bare
 * dots — the assessment reads as a short guided conversation, not a form.
 * Built on Radix RadioGroup (via the visually-hidden input + label pattern)
 * so it keeps full keyboard/screen-reader semantics and a visible focus ring.
 */
export function ChoiceGroup({
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  name: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <RadioGroup
      value={value ?? undefined}
      onValueChange={onChange}
      className={`grid grid-cols-1 gap-3 sm:gap-4 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {options.map((opt) => {
        const id = `${name}-${opt.value}`;
        const selected = value === opt.value;
        return (
          <div key={opt.value}>
            <RadioGroupItem value={opt.value} id={id} className="peer sr-only" />
            <Label
              htmlFor={id}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-4 sm:px-5 sm:py-4 text-sm cursor-pointer transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                selected
                  ? "border-primary bg-primary/[0.06] text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {selected && <Check className="h-4 w-4 text-primary shrink-0" aria-hidden />}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
