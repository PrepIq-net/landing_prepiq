# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the owner or founder of a growing food brand.** Typically running a
handful of locations and adding more. They buy because waste and stockouts
compound as they scale — a loss they could absorb at one site becomes structural
at six. They are evaluating infrastructure for the operation they are about to
become, not the one they have.

They convert **self-serve**, without a sales call. The site is the whole sales
conversation.

Secondary audiences the product serves but the site does not lead with:

- **Head chefs / kitchen managers** — the daily hands-on user. They review the
  morning plan rather than guessing it, and their overrides feed the model.
- **Operations managers** — watch forecast accuracy and cost impact across branches.
- **Hotel / enterprise F&B groups** — reachable via the Command tier and custom
  pricing at 10+ branches, but not the site's primary target.

The daily user and the buyer are often different people. Copy that persuades the
owner still has to describe a system the chef will accept.

## Product Purpose

PrepIQ turns demand into a daily kitchen plan — prep quantities, ingredients, and
staffing — then coordinates the line during service and learns from the result.

It exists because most kitchens still prep on instinct or spreadsheets that never
learn from yesterday. The intended outcome is a kitchen that wastes less, stops
running out of its best items, and gets measurably more predictable every service.

Success is a kitchen where the morning prep decision is *reviewed* rather than
*guessed*.

## Positioning

**An intelligence layer, not a replacement.** PrepIQ does not replace the POS and
does not replace the chef. It sits above existing systems, reads what they already
produce, and returns a decision.

The differentiating mechanism is **multi-signal forecasting that learns from the
specific kitchen**: sales history, day-of-week patterns, weather, local events,
recent stockouts, chef overrides, and cross-branch patterns are combined into one
forecast per morning, with the signal weights shifting as the model learns that
kitchen. Chef overrides are training data, not exceptions — the system gets better
because the chef disagrees with it.

The framing PrepIQ claims: the forecasting discipline airlines and retailers
already run on, adapted to kitchen operations.

## Operating Context

- **The morning decision.** Before service, someone commits to prep quantities.
  That single recurring moment is what the product replaces.
- **During service.** Live tracking and alerts when an item trends above or below
  forecast, early enough to adjust.
- **After service.** Actuals feed back; the model updates for tomorrow.
- **Data entry paths.** Direct POS connection, CSV upload, or REST API. Kitchens
  without a supported POS are explicitly still serviceable.
- **PIQ Connector.** On-premise software that bridges local systems to PrepIQ.
- **Multi-branch.** Roll up across a network or drill into one kitchen. Branch
  patterns cross-pollinate (one location's rainy-Tuesday waste informs another's).
- **This repo also runs the marketing site itself.** Pages and sections are stored
  in the database and rendered dynamically; PrepIQ staff edit the live site, blog,
  careers, legal documents, nav/footer links, and pricing through `/admin` without
  a deploy. Landing-page structure is content, not code.

## Capabilities and Constraints

**Confirmed and live:**

- Self-serve signup, free pilot, and paid subscription all work end to end today.
  A visitor can go from the landing page to a paying account without a human.
- Pricing is **per active kitchen branch**, never metered by volume. Three tiers —
  Core (daily operational visibility), Intelligence (margin protection), Command
  (multi-branch command center) — plus optional per-branch add-ons. Each branch
  subscribes independently, so one café on Core can sit alongside a flagship on
  Command. Monthly and annual billing; 10+ branches is custom pricing.
- Plan pricing renders from the backend's live catalog, so published prices can
  change without a deploy. The bundled copy is only a fallback.
- **Loyverse is the only live POS integration.** Square, Toast, and Clover are
  marked "soon" and are not connected. CSV upload and the REST API are the real
  paths for everyone else. **This status labelling must be preserved** — do not
  let a redesign flatten these into an undifferentiated logo wall.
- English and French throughout, including all legal documents.
- Multi-currency and timezone-aware forecasting.
- An AI concierge widget answers product/pricing questions and captures leads.
- Support surface: ticketed requests and a public feature board with voting.

**Constraints:**

- **Dark theme only.** No light palette exists.
- The marketing site depends on a separate Django backend for pricing and
  subscriptions; it must degrade gracefully rather than error when that is
  unreachable.
- Sibling products (`web_dashboard`, `mobile-app`) share brand intent but not this
  font stack or component tree. Do not assume portability.

**Undecided / not established:** target market geography beyond "global-ready"
claims; whether the four-persona spread in current copy should narrow to the
confirmed primary user.

## Brand Commitments

- **Name:** PrepIQ. Marketing at `prepiq.net`, product at `app.prepiq.net`.
- **Company:** based in Kampala, Uganda. The footer states "Built in Uganda.
  Designed for kitchens everywhere" — an owned fact, not a hedge.
- **Legal:** operated as PrepIQ, Kampala, Uganda; terms governed by California law.
- **Contact:** `customer@prepiq.net`, `careers@prepiq.net`, +256 709 802 259.
- **Voice:** measured, strategic, precise. Claims carry specifics, not adjectives.
  The reader is an operator evaluating infrastructure — never "Awesome!" or
  "Let's get cooking!"
- **Visual system:** documented in `docs/DESIGN.md`, which is the authority for
  color, type, spacing, motion, and component usage.

## Evidence on Hand

**There is currently no real proof. This is the most important fact in this file.**

Every proof point on the live site is illustrative:

- Testimonials — "Chef Adamu / Lagos Kitchen Co.", "Sarah K. / FreshBite",
  "Marcus T. / 3-Branch Network" — are **invented placeholders**, not customers.
- Headline metrics — 92% forecast accuracy, −34% food waste, 0 stockouts/week,
  $2,400 average monthly waste, 14% revenue lost to stockouts, "kitchens powered",
  "meals processed / week" — are **illustrative, not measured**.
- The 5-second kitchen test, the AI-thinking signal panel, and their confidence
  percentages are **demonstrations of the mechanism**, not records of a real
  service.

Binding rules that follow:

1. **Never invent additional testimonials, logos, customer counts, case studies,
   press mentions, or benchmark figures.** Not as placeholder, not as "example
   content", not to fill a layout.
2. Existing illustrative numbers may be preserved as-is, but must not be
   escalated, made more specific, or restated as measured results.
3. **This is an active exposure.** The product takes real money self-serve while
   every proof point on the page is fabricated. Any work touching the
   testimonials, stats bar, or "kitchens powered" counters should treat replacing
   them with real evidence — or removing them — as the correct fix, and should
   surface that to the user rather than restyling fiction.
4. What *is* real and can be leaned on: the working product, the live self-serve
   path, the Loyverse integration, the mechanism itself, and the specificity of
   the signals. Demonstrating how the forecast works is honest. Claiming it
   already worked for someone is not.

**Real assets available:** logo set (`public/logo`, `public/app_logo`), hero
background video (`public/videos`), Satoshi + Hanken Grotesk font files,
full EN/FR legal documents, and a database-backed blog and careers system.

## Product Principles

1. **Layer, never replace.** PrepIQ earns its place by making the POS and the chef
   more effective. Anything that reads as "throw out your system" is off-brand.
2. **Decisions over dashboards.** Information matters only where it changes what
   someone does that morning. A chart that informs nobody is noise.
3. **Claims must be earned.** The product is real; the proof is not yet. Show the
   mechanism, never manufacture the outcome.
4. **The page closes the sale.** Conversion is self-serve — there is no rep to
   recover a visitor's unanswered objection. Pricing, integration status, and
   scope must be legible without a call.
5. **The system compounds.** Every service, override, and correction makes the
   forecast better. Durability, not novelty, is the promise.

## Accessibility & Inclusion

No formal external standard has been established by the user. Observed and
already-honored practice in the codebase, which future work should preserve:

- Contrast measured and documented against WCAG AA in `docs/DESIGN.md` §8, with
  binding rules on which status colors may carry small text.
- `prefers-reduced-motion` honored, including on ambient marketing motion.
- Radix primitives used for keyboard navigation and ARIA rather than hand-rolled
  interactive `div`s.
- Full English/French parity across marketing, product, and legal surfaces.
  
