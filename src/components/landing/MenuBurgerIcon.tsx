/**
 * Navbar menu toggle glyph — the same wink as the dashboard rail, with a
 * third state for the landing page.
 *
 * At rest it is an ordinary three-line menu icon in the Iconoir stroke
 * language (24-unit box, 1.5 stroke, round caps, `currentColor`). In the
 * "burger" phase the stack opens into a burger — the top line domes into a
 * sesame bun, the middle becomes the gold patty, the base line curls under.
 * In the "x" phase the glyph folds into a close glyph — used by the sheet
 * header's close button, which lands pixel-perfect on the burger's spot.
 *
 * The burger wink is choreographed as a cascade, not a single cross-fade:
 * the dome rises first, the gold patty slides up beneath it, the base curls
 * in, and the sesame seeds pop onto the bun last. On touch there is no
 * hover, so the navbar plays the burger as a phase on tap; on pointer
 * devices hovering the resting glyph plays the same cascade.
 *
 * Implementation notes (kept from the dashboard glyph):
 *
 * 1. The straight, curved and diagonal forms are separate paths cross-faded
 *    against each other, not a single morphing `d`. SVG path interpolation
 *    via CSS `d` is still unsupported in Firefox, and because both forms
 *    share their endpoints the cross-fade reads as a morph anyway.
 *
 * 2. All phases share the same element order and endpoints, so no phase
 *    transition ever snaps.
 *
 * 3. The seeds scale around their own centres via `transform-box: fill-box`
 *    (SVG geometry transforms are otherwise relative to the view box).
 *
 * `prefers-reduced-motion` collapses every phase transition to an instant
 * swap — handled globally in `globals.css` via the `.nav-burger` class.
 */

const DOME = "transition-all duration-200 ease-out";
const PATTY = "transition-all duration-200 ease-out delay-75";
const CURL = "transition-all duration-200 ease-out delay-100";
const SEEDS =
  "transition-all duration-150 ease-out delay-150 [transform-box:fill-box] origin-center scale-0";

const FADE = "transition-all duration-150 ease-out";
const X_STROKES = "transition-all duration-150 ease-out delay-100";

export function MenuBurgerIcon({
  className,
  phase,
}: {
  className?: string;
  phase: "lines" | "burger" | "x";
}) {
  const lines = phase === "lines";
  const burger = phase === "burger";
  const x = phase === "x";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`nav-burger transition-transform duration-300 ease-in-out ${className ?? ""}`}
    >
      {/* Top bun — straight at rest, domes in the burger wink. */}
      <path
        d="M4 8h16"
        className={`${DOME} ${lines ? "opacity-100" : "opacity-0"} ${lines ? "group-hover:opacity-0" : ""}`}
      />
      <path
        d="M4 8Q12 3.2 20 8"
        className={`${DOME} ${burger ? "opacity-100" : "opacity-0"} ${lines ? "group-hover:opacity-100" : ""}`}
      />

      {/* Sesame — pops onto the dome, last. */}
      <g
        fill="currentColor"
        stroke="none"
        className={`${SEEDS} ${burger ? "scale-100 opacity-100" : "opacity-0"} ${
          lines ? "group-hover:scale-100 group-hover:opacity-100" : ""
        }`}
      >
        <circle cx="9" cy="6.8" r="0.5" />
        <circle cx="12" cy="6.4" r="0.5" />
        <circle cx="15" cy="6.8" r="0.5" />
      </g>

      {/* Patty — slides up into gold beneath the dome, folds away in the x.
          The rest offset (translate-y-1) is gated to the lines phase: in the
          burger phase only translate-y-0 is applied, so no two translate
          classes ever fight for the same property. */}
      <path
        d="M4 12h16"
        className={`${PATTY} ${lines ? "translate-y-1" : "translate-y-0"} ${
          burger ? "text-primary" : ""
        } ${
          lines ? "group-hover:translate-y-0 group-hover:text-primary" : ""
        } ${x ? "opacity-0" : "opacity-100"}`}
      />

      {/* Base bun — straight at rest, curls under in the burger wink. Same
          translate gating as the patty: one translate class per phase. */}
      <path
        d="M4 16h16"
        className={`${CURL} ${lines ? "opacity-100" : "opacity-0"} ${lines ? "group-hover:opacity-0" : ""}`}
      />
      <path
        d="M4 16Q12 19.2 20 16"
        className={`${CURL} ${lines ? "translate-y-0.5" : "translate-y-0"} ${
          burger ? "opacity-100" : "opacity-0"
        } ${lines ? "group-hover:translate-y-0 group-hover:opacity-100" : ""}`}
      />

      {/* The x — what the burger settles into while the menu is open. It
          spans the same 4→20 box as the resting lines, so the close glyph
          lands exactly where the burger sat. */}
      <path d="M4 4l16 16" className={`${X_STROKES} ${x ? "opacity-100" : "opacity-0"}`} />
      <path d="M20 4l-16 16" className={`${X_STROKES} ${x ? "opacity-100" : "opacity-0"}`} />
    </svg>
  );
}
