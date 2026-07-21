# PrepIQ Design System — Landing

Authoritative UI reference for `landing` (marketing site + admin). Replaces `BRAND_SYSTEM.md`.

Sections 1–6 are the **shared core**, identical across `landing`, `web_dashboard`, and
`mobile-app`. Section 7 onward is **platform binding** — how the core is actually
expressed in this repo. When the two ever disagree, the platform binding wins, because
it describes running code.

---

## 1. Brand Intent

PrepIQ is operational intelligence infrastructure for kitchens. Pillars: **Intelligent,
Structured, Controlled, Premium**.

Every UI decision passes four filters, in order:

1. Does it increase clarity?
2. Does it reduce noise?
3. Does it signal authority?
4. Does it feel engineered?

A change that fails filter 1 or 2 is rejected regardless of how good it looks.

## 2. Color

The palette is fixed. Do not introduce new hues.

| Role | Hex | HSL (as stored) |
|---|---|---|
| Base background | `#141416` | `240 7% 8%` |
| Card | `#1C1C1F` | `240 5% 11%` |
| Secondary / muted surface | `#2A2A2E` | `240 4% 17%` |
| Accent surface | `#232327` | `240 4% 14%` |
| Border / input | `#2E2E33` | `240 4% 18%` |
| Brand gold (`primary`) | `#A8821F` | `40 70% 39%` |
| Text primary | `#F5F5F7` | `240 5% 96%` |
| Text muted | `#8E8E93` | `240 4% 56%` |
| Critical (`destructive`) | `#C44949` | `0 55% 53%` |
| Warning | `#C48B2A` | `38 65% 47%` |
| Success | `#3F8F68` | `153 39% 40%` |
| Info | `#3A6EA5` | `211 48% 44%` |

**Gold is a scarce resource.** Per viewport it marks the single most important
thing — the primary CTA, or the one phrase the section turns on. Gold in four
places is no emphasis at all.

**Status colors carry meaning, never decoration.**

## 3. Typography

- **Display** (headings): Hanken Grotesk, weight 600–800
- **Body** (prose, forms, labels): Inter

| Level | Size / line-height / weight |
|---|---|
| H1 | 40 / 48 / 600 |
| H2 | 32 / 40 / 600 |
| H3 | 24 / 32 / 600 |
| H4 | 18 / 28 / 500 |
| Body Large | 16 / 24 / 400 |
| Body | 14 / 22 / 400 |
| Small | 12 / 18 / 400 |
| KPI | 32–48 / 600 / tracking `-0.5` |

Marketing headlines may exceed H1 (`text-5xl`/`text-6xl`) — this is the one surface
where they may. Body copy never goes below 12px.

> **Note:** the shared core historically named *Satoshi* as the display face. This
> repo uses **Hanken Grotesk**, loaded from Google Fonts. That is the real face and
> this file documents it as such. `web_dashboard` and `mobile-app` do use Satoshi;
> the two are close enough in structure that the brand reads consistently, but do not
> assume a shared font stack when porting a component between repos.

## 4. Space, Radius, Depth

- Grid: **8pt**. Spacing scale: `4, 8, 12, 16, 24, 32, 40, 48, 64, 80`.
- Radius: `--radius` is `0.5rem` (8px); Tailwind `rounded-lg` = 8, `rounded-md` = 6,
  `rounded-sm` = 4. Cards use `rounded-xl` (12px), modals 16px.
- Shadows: `shadow-l1` · `shadow-l2` · `shadow-l3` (mapped in `tailwind.config.ts`)

Depth is for genuine layering — not for making a flat section look interesting.

## 5. Motion

- Duration `150–220ms`, easing `cubic-bezier(0.4, 0, 0.2, 1)`
- Allowed: fade in, slide up 8–12px, width expansion, soft pulse for critical only
- Forbidden: bounce, elastic, spring overshoot, playful easing

Marketing gets one **narrative** exception: slow ambient motion (`kenburns` at 24s,
`ticker`, `fadeUp` on scroll-in) is permitted for atmosphere. It must be slow enough
to read as cinematography rather than as UI feedback. Interactive feedback stays in
the 150–220ms band. Honor `prefers-reduced-motion` on all of it.

## 6. Voice

Measured, strategic, precise. On marketing surfaces this means **claims with
specifics**, not adjectives:

> "Cut over-production by 12%." — not — "Revolutionize your kitchen!"

Never: "Oops!", "Awesome!", "Let's get cooking!". The reader is an operator
evaluating infrastructure.

---

## 7. Platform Binding — Next.js 16 + Tailwind v3 + shadcn/ui

### Where tokens live

`app/globals.css` under `@layer base :root`, as **space-separated HSL triples**
(not hex), consumed through `tailwind.config.ts` as `hsl(var(--token))`.

```css
--primary: 40 70% 39%;   /* correct  */
--primary: #A8821F;      /* WRONG — breaks the hsl() wrapper and opacity modifiers */
```

Storing the triple bare is what makes `bg-primary/15` work. Adding a token means
adding the triple to `:root` **and** mapping it in `tailwind.config.ts`.

### Using tokens

Semantic shadcn names, not palette names:

```tsx
<div className="bg-card text-muted-foreground border-border rounded-xl">
```

`primary` **is** the brand gold. `destructive` is critical. `warning`, `success`,
and `info` are raw vars without a Tailwind mapping — reach them via
`text-[hsl(var(--warning))]`, or better, use the prebuilt badge classes below.

Never write a raw hex in a component.

### Prebuilt component classes

`globals.css` already defines these — use them before inventing markup:

- `.section-container` — the standard max-width + responsive gutter wrapper. Every
  top-level section uses this. Do not hand-roll `mx-auto max-w-*`.
- `.intelligence-card` — the standard bordered content card
- `.badge-critical` / `.badge-warning` / `.badge-success` / `.badge-info` — tinted
  background + matching text + border, at accessible contrast
- `.text-gradient-gold`, `.gold-glow` — headline treatments, **at most one per page**

### Atmosphere utilities

`.pattern-dots`, `.pattern-dots-accent`, `.pattern-grid`, `.pattern-squares`,
`.pattern-diagonal`, `.section-band`, `.wash-gold-top`, `.wash-gold-bottom`.

These exist to break up a long single-charcoal scroll. Rules: **one atmosphere
treatment per section**, never stacked, and never behind dense body copy — they
are for hero, section transitions, and framing a feature element. They are the
marketing-only counterpart to the dashboard's strict spacing-led posture.

> The dashboard's "no glass / no gradients" rule still holds for **chrome** —
> buttons, cards, nav, forms. These utilities apply to *backgrounds* only.

### shadcn/ui components

~50 components in `src/components/ui/`. **Extend, never fork.** Need a new button
look? Add a variant to the `cva` config in `button.tsx` so it stays themed and
accessible. Copying a component to make a one-off is how the system drifts.

Radix primitives bring keyboard nav and ARIA for free — prefer a Radix-backed
component over a hand-rolled `div` with an `onClick`.

### Theme mode

**Dark only.** `darkMode: ["class"]` is configured and `next-themes` is present, but
only `sonner.tsx` consumes it and no provider is mounted. There is no light palette.
Do not add `dark:` variants — they never activate.

### Motion

`framer-motion` is available here (unlike `web_dashboard`). Use it for scroll-in
choreography via `src/components/ui/animated-group.tsx`. `tailwindcss-animate`
covers enter/exit on Radix components. Prefer these over new keyframes.

### Icons

Both `iconoir-react` and `lucide-react` are installed. **Iconoir is the brand set** —
use it for anything expressing product concepts. Lucide is legacy in shadcn internals;
don't add new Lucide usage in your own components.

---

## 8. Contrast — Verified

Measured against `#1C1C1F` (card). WCAG AA for normal text is 4.5:1; 3:1 for large
text (≥18.66px bold / ≥24px) and non-text UI.

| Foreground | On card | Verdict |
|---|---|---|
| Text primary `#F5F5F7` | 15.6:1 | Pass |
| Text secondary `#C7C7CC` | 10.1:1 | Pass |
| Muted `#8E8E93` | 5.2:1 | Pass |
| Warning `#C48B2A` | 5.7:1 | Pass |
| Gold / `primary` `#A8821F` | 4.8:1 | Pass |
| Success `#3F8F68` | 4.3:1 | **Large text / UI only** |
| Destructive `#C44949` | 3.6:1 | **Large text / UI only** |
| Info `#3A6EA5` | 3.2:1 | **Large text / UI only** |

**Binding rules that follow:**

- `destructive`, `info`, and `success` must **not** be the color of 12–14px body text.
  Use them for icons, borders, large numerals, and badges — the `.badge-*` classes
  already solve this by tinting the *background* and keeping the label readable.
- Charcoal on gold (primary CTA) is 5.15:1 — passes.
- Gold at 4.8:1 passes as text but sits close to the floor. Do not lower its
  lightness, and do not put gold text on `#232327` or lighter (drops to 4.4:1).
- `.text-gradient-gold` ramps to `hsl(40 80% 50%)`, which is *lighter* than base gold
  and therefore safe. Never ramp the gradient darker.
- `.gold-glow` is a shadow, not a contrast mechanism — the text under it must already
  pass on its own.

---

## 9. Skills

Installed at `.claude/skills/` in the monorepo root, shared by all three apps.

| Skill | Use it when |
|---|---|
| `design-tokens` | Adding/changing a color, font, spacing, or radius; or you caught yourself about to write a hex. Explains the token pipeline for whichever of the three stacks you're in. |
| `ui-polish` | A screen works but looks plain. Applies hierarchy, rhythm, and the missing empty/loading/error states. |
| `ui-review` | Before shipping any UI change. Audits the diff against this file and reports violations. |
| `ui-a11y` | Contrast, focus rings, hit targets, semantics, reduced motion. Run when adding interactive controls or a new color pairing. |

Built-in skills that also apply: **`dataviz`** before writing any new chart, and
**`run`** to boot the site and confirm a change visually.

Typical order for a UI task: `design-tokens` (if tokens involved) → build →
`ui-polish` → `ui-review` → `ui-a11y`.

---

## 10. QA Checklist

- [ ] No raw hex or arbitrary color in components — tokens only
- [ ] New CSS vars stored as bare HSL triples, not hex
- [ ] Gold appears once per viewport, on the most important element
- [ ] Status color is never the color of small body text (see §8)
- [ ] At most one `.text-gradient-gold` / `.gold-glow` per page
- [ ] One atmosphere utility per section, never stacked, never behind body copy
- [ ] Sections wrapped in `.section-container`, not hand-rolled max-widths
- [ ] shadcn components extended via `cva` variants, not forked
- [ ] `font-display` on headings (applied automatically to `h1`–`h6`)
- [ ] Spacing lands on the 8pt scale
- [ ] Interactive motion is 150–220ms; ambient motion is slow; reduced-motion honored
- [ ] New icons are Iconoir, not Lucide
- [ ] Interactive elements have a visible focus ring
- [ ] Copy makes specific claims, not hype
- [ ] No `dark:` variants added (this app is dark-only)
