import type { Mail } from "iconoir-react";

/**
 * One icon per step, naming what kind of question it is — not decoration on
 * every row. Mirrors the icon+title header pattern used elsewhere on the site
 * (e.g. the pricing page's calculator card header).
 */
export function StepHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Mail;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-[18px] w-[18px] text-primary" aria-hidden />
      </div>
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
