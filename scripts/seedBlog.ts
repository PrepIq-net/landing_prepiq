import { PrismaClient } from "@prisma/client";
import { BLOG_TEASER } from "./content/blog-teaser";

const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/*  Navigation + footer links                                                  */
/* -------------------------------------------------------------------------- */

async function upsertLink(
  match: { type: string; labelEn: string; category?: string | null },
  data: {
    labelEn: string;
    labelFr: string;
    url: string;
    type: string;
    category?: string | null;
    sortOrder: number;
  }
) {
  const existing = await prisma.link.findFirst({
    where: {
      type: match.type,
      labelEn: match.labelEn,
      ...(match.category !== undefined ? { category: match.category } : {}),
    },
  });
  if (existing) {
    await prisma.link.update({ where: { id: existing.id }, data });
    console.log(`= updated ${data.type} link "${data.labelEn}" -> ${data.url}`);
  } else {
    await prisma.link.create({ data: { ...data, isActive: true } });
    console.log(`+ created ${data.type} link "${data.labelEn}" -> ${data.url}`);
  }
}

async function seedLinks() {
  // Footer, under Company — between About and Careers.
  await upsertLink(
    { type: "footer", labelEn: "Blog", category: "company" },
    {
      labelEn: "Blog",
      labelFr: "Blog",
      url: "/blog",
      type: "footer",
      category: "company",
      sortOrder: 1,
    }
  );

  // Careers sits after Blog; nudge it down if it's still holding slot 1.
  const careersFooter = await prisma.link.findFirst({
    where: { type: "footer", labelEn: "Careers", category: "company" },
  });
  if (careersFooter && careersFooter.sortOrder <= 1) {
    await prisma.link.update({
      where: { id: careersFooter.id },
      data: { sortOrder: 2 },
    });
  }
  const contactFooter = await prisma.link.findFirst({
    where: { type: "footer", labelEn: "Contact", category: "company" },
  });
  if (contactFooter && contactFooter.sortOrder <= 2) {
    await prisma.link.update({
      where: { id: contactFooter.id },
      data: { sortOrder: 3 },
    });
  }

  // Top nav, after About.
  await upsertLink(
    { type: "nav", labelEn: "Blog" },
    { labelEn: "Blog", labelFr: "Blog", url: "/blog", type: "nav", sortOrder: 3 }
  );
  const contactNav = await prisma.link.findFirst({
    where: { type: "nav", labelEn: "Contact" },
  });
  if (contactNav && contactNav.sortOrder <= 3) {
    await prisma.link.update({
      where: { id: contactNav.id },
      data: { sortOrder: 4 },
    });
  }
}

/* -------------------------------------------------------------------------- */
/*  Home page section                                                          */
/* -------------------------------------------------------------------------- */

/**
 * seedPages.ts owns the home page's section list and prunes anything missing
 * from it, so BlogTeaserSection is defined there too. This only fills the gap
 * when `db:seed:blog` runs on its own against an already-seeded database.
 */
async function ensureTeaserSection() {
  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (!home) {
    console.log("! home page not found — run `npm run db:seed:pages` first");
    return;
  }

  const existing = await prisma.section.findFirst({
    where: { pageId: home.id, componentType: "BlogTeaserSection" },
  });
  if (existing) {
    console.log("= home BlogTeaserSection already present");
    return;
  }

  // Slot it directly after the testimonials, pushing later sections down.
  const testimonials = await prisma.section.findFirst({
    where: { pageId: home.id, componentType: "TestimonialsSection" },
  });
  const position = testimonials ? testimonials.sortOrder + 1 : 0;

  await prisma.section.updateMany({
    where: { pageId: home.id, sortOrder: { gte: position } },
    data: { sortOrder: { increment: 1 } },
  });

  await prisma.section.create({
    data: {
      pageId: home.id,
      componentType: "BlogTeaserSection",
      titleEn: "Featured Articles",
      titleFr: "Articles en vedette",
      contentJson: { en: BLOG_TEASER.en, fr: BLOG_TEASER.fr },
      isActive: true,
      sortOrder: position,
    },
  });
  console.log(`+ created home BlogTeaserSection at position ${position}`);
}

/* -------------------------------------------------------------------------- */
/*  Launch articles                                                            */
/* -------------------------------------------------------------------------- */

interface PostSeed {
  slug: string;
  titleEn: string;
  titleFr: string;
  excerptEn: string;
  excerptFr: string;
  bodyEn: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  publishedAt: Date;
}

// Dated so the index (newest first) and the home strip (sortOrder) both read in
// the intended narrative order: problem → solution → positioning.
const POSTS: PostSeed[] = [
  {
    slug: "hidden-cost-of-food-waste",
    titleEn:
      "The Hidden Cost of Food Waste: Why Most Restaurants Lose Money Before Service Even Begins",
    titleFr:
      "Le coût caché du gaspillage : pourquoi la plupart des restaurants perdent de l'argent avant même le service",
    excerptEn:
      "Waste isn't only what ends up in the bin. By the time the first order lands, most kitchens have already decided how much money they're going to lose that day.",
    excerptFr:
      "Le gaspillage ne se limite pas à ce qui finit à la poubelle. Au moment où la première commande arrive, la plupart des cuisines ont déjà décidé combien elles vont perdre ce jour-là.",
    category: "Food Waste",
    tags: ["food waste", "margins", "prep planning"],
    seoTitle: "The Hidden Cost of Food Waste in Restaurants — PrepIQ",
    seoDescription:
      "Food waste starts with prep decisions, not leftovers. Where restaurants actually lose money before service, and what to do about it.",
    sortOrder: 0,
    publishedAt: new Date("2026-07-18T09:00:00Z"),
    bodyEn: `Ask a restaurant owner what food waste costs them and most will point at the bin at the end of the night. That number is real, and it's the easiest one to see.

It's also the smallest part of the problem.

By the time service starts, the expensive decisions have already been made. Someone decided how many portions to prep, how much product to pull from the walk-in, and how many hands to put on the line. Those decisions were made in the morning, usually quickly, usually from memory. Everything that happens afterwards is just the consequence.

## Waste is a decision, not an accident

There are three ways a prep decision costs you money, and only one of them is visible.

**You prepped too much.** The obvious one. Product gets thrown, and the loss shows up in your food cost at the end of the month. But the cash was gone long before that — it was tied up the moment you bought and portioned it. A kitchen that consistently over-preps by 15% is financing an inventory position it never needed.

**You prepped too little.** This one is invisible and usually more expensive. A guest orders the dish you ran out of, and you lose the sale, the margin on it, and some portion of their willingness to come back. Nothing gets thrown away, so nothing shows up in your waste log. The loss is real, but it never appears in a report.

**You hedged.** This is the most common and the least discussed. Not knowing what tomorrow looks like, you prep for a good day and hope. Or you prep conservatively and accept you'll run out of two or three items. Either way you're paying for uncertainty — and you pay it every single day, whether or not the day turns out busy.

> Most kitchens don't have a waste problem. They have a forecasting problem that shows up as waste.

## Why this is genuinely hard

It's tempting to say chefs should just plan better. That misreads the problem. Anyone who has run a kitchen knows demand moves for reasons that have nothing to do with the kitchen.

A Tuesday in the rain is not the Tuesday you planned for. A local match, a public holiday, a road closure, a competitor's promotion, the end of the month when people have been paid — each one shifts what walks through the door. So does the weather three days out, if that's when people decide where to eat on Friday.

Now multiply that by every item on your menu. Some move together, some move in opposite directions. Rain lifts delivery and suppresses walk-ins. A hot day changes what people drink and what they don't want to eat. A promotion on one dish quietly cannibalises another.

No one holds all of that in their head at 7am while also receiving deliveries and covering a late call-out. Chefs aren't guessing because they're careless. They're guessing because the problem is genuinely large and the information arrives faster than anyone can process it.

## What a good system actually does

The goal isn't to take the decision away from the chef. A chef knows things a model never will — that the new dish is landing badly with regulars, that a table of twelve booked for Saturday, that the supplier's chicken has been inconsistent this month.

What a good system does is remove the arithmetic and leave the judgement.

It should arrive in the morning with a specific, quantified starting point: prepare this many of this item, based on these signals, with this much confidence. Not a dashboard to interpret. A plan to approve, adjust, or override.

That distinction matters. A forecast the chef can't argue with is a forecast the chef will ignore. A forecast that shows its reasoning — *this is higher than last Tuesday because of the weather and the match* — is one they can push back on, correct, and eventually trust.

## Learning is the part that compounds

The first forecast a system produces is the least accurate one it will ever produce.

What matters is what happens after service. If the day missed, why? Was demand genuinely different, or did the kitchen run out at 8pm and cap its own sales? Was a dish unavailable because a supplier was late? Those are completely different events, and a system that treats them the same will learn the wrong lesson from both.

Separating them is what turns a month of operations into a better plan rather than a bigger pile of history. Over time, the model stops needing to be told that Fridays are busy and starts knowing what *this* Friday looks like, at *this* branch, in *this* weather.

## Where to start

You don't need to solve everything at once. Most kitchens find the first meaningful win in the same place:

- Pick the ten items that account for most of your prep cost.
- Record what you prepared and what you actually sold — daily, for two weeks.
- Look at the gap. Not the average gap, the day-to-day one.
- Ask what was different about the days you got badly wrong.

That exercise alone tends to surprise people. The average looks fine; the variance is where the money is going.

Once you can see the pattern, the question stops being *how much do we waste* and becomes *what would we have to know to have gotten that day right* — which is a question you can actually answer.`,
  },
  {
    slug: "how-smart-kitchens-plan-tomorrows-prep",
    titleEn: "How Smart Kitchens Plan Tomorrow's Prep Today",
    titleFr: "Comment les cuisines organisées préparent demain, aujourd'hui",
    excerptEn:
      "Good prep planning isn't a longer spreadsheet. It's a short daily loop: decide in the morning, watch during service, learn at close — and start tomorrow better informed.",
    excerptFr:
      "Une bonne planification n'est pas un tableur plus long. C'est une boucle quotidienne : décider le matin, suivre le service, apprendre à la fermeture — et mieux commencer demain.",
    category: "Operations",
    tags: ["prep planning", "daily operations", "forecasting"],
    seoTitle: "How Smart Kitchens Plan Tomorrow's Prep Today — PrepIQ",
    seoDescription:
      "The daily planning loop used by kitchens that have stopped guessing: morning plan, live service monitoring, end-of-day learning.",
    sortOrder: 1,
    publishedAt: new Date("2026-07-14T09:00:00Z"),
    bodyEn: `Most kitchens plan prep the same way. Someone looks at last week, remembers roughly how the last few days went, factors in anything they know about tomorrow, and writes a list.

It works, in the sense that service happens. But it's fragile in a specific way: the quality of tomorrow depends entirely on who is doing the remembering, how much sleep they got, and whether anything unusual is coming that they happen to know about.

Kitchens that have moved past this haven't adopted a more complicated process. They've adopted a shorter one that runs every day without exception.

## Why last week isn't enough

Historical sales are the foundation of any forecast, and they're not sufficient on their own.

Last Tuesday tells you what happened last Tuesday. It doesn't tell you that it was raining, that the school down the road was on holiday, or that you were out of the second-best-selling dish from 7pm. Sales history records the outcome without recording the conditions — so a plan built only on history quietly assumes tomorrow's conditions will match.

They rarely do. The things that reliably move restaurant demand are mostly external:

- **Weather** — not just today's, but the forecast people saw when they made plans.
- **Day of week and time of month** — payday weeks don't behave like the week before them.
- **Local events** — matches, concerts, conferences, market days, public holidays.
- **Promotions** — yours and, if you're honest about it, the ones nearby.
- **Seasonality** — both the calendar kind and the school-term kind.
- **Your own availability** — you can't sell what you ran out of at 8pm.

None of these is complicated on its own. The difficulty is that they interact, and the interaction is where the accuracy lives.

## The morning: a plan, not a dashboard

The first step of the loop is a decision, and it should take minutes.

A useful morning brief answers one question per item: how many should we prepare? It arrives with a number, the reasoning behind it, and a sense of how confident that number is. Where the system is unsure, it says so — that's the chef's cue to apply judgement rather than rubber-stamp.

The chef's role here is essential and shouldn't be automated away. They know the things that aren't in any dataset: the large booking that came in by phone, the dish that's been landing badly since the recipe changed, the section of the walk-in that needs using up. The plan should be easy to override, and overrides should be remembered.

What changes is the starting point. Instead of building the list from memory, the chef reviews a list built from evidence and corrects it where their knowledge is better. That's a much smaller cognitive job, and it's the same job every morning regardless of who is on.

## During service: watch the gap, not the total

A morning plan is a hypothesis. Service is where it gets tested, and the useful moment is well before close.

The signal that matters mid-service isn't total sales — it's pace against expectation. If an item is selling 40% faster than the plan assumed at 6:30pm, there is still time to prep more, move a special, or warn the front of house. If it's running well behind, there's still time to push it before it becomes tomorrow's waste.

This is the part most kitchens have never had. Sales data typically arrives as a report the next morning, by which point the decision it would have informed has already been made for you.

The bar for this to be useful is low but strict: it has to be visible without anyone stopping to look for it, and it has to be advisory. A system that interrupts a busy line with alerts it can't act on gets ignored within a week.

## At close: separate the two kinds of miss

This is the step that makes the whole loop compound, and it's the one most often skipped.

When a day misses its forecast, there are two fundamentally different explanations:

**Demand was different.** Fewer people came, or they ordered differently. This is real information about your market, and the model should learn from it.

**Service got in the way.** You ran out at 8pm. The fryer went down. A supplier didn't deliver. Sales were capped by something operational, not by demand.

Treating these the same is actively harmful. If you ran out of a dish at 8pm and the system records "sold 40" as demand, it learns that demand was 40 — when the truth is that demand was higher and you couldn't meet it. Do that a few times and the forecast trains itself downward into a stockout it created.

A short end-of-day review that tags the reason for a variance is worth more than any amount of additional historical data. It takes a couple of minutes and it's the difference between a system that gets better and one that gets confidently worse.

## The loop, and why it beats the spreadsheet

Put together, the day looks like this:

1. **Morning** — review a quantified prep plan; adjust with what you know.
2. **Service** — watch pace against plan; act while it still matters.
3. **Close** — record what happened and, crucially, why.
4. **Tomorrow** — start from a plan that includes yesterday's lesson.

Nothing in that list is exotic. What makes it work is that it runs every day, in the same shape, whether or not the head chef is in — and that each pass leaves the next one slightly better informed.

A spreadsheet can hold the numbers. It can't do step four.`,
  },
  {
    slug: "why-your-pos-isnt-enough",
    titleEn: "Why Your POS Isn't Enough (And Why That's Okay)",
    titleFr: "Pourquoi votre caisse ne suffit pas (et pourquoi ce n'est pas grave)",
    excerptEn:
      "Your POS is very good at recording what happened. It was never designed to tell you what to do tomorrow. Those are different jobs, and you need both.",
    excerptFr:
      "Votre caisse enregistre très bien ce qui s'est passé. Elle n'a jamais été conçue pour vous dire quoi faire demain. Ce sont deux métiers différents, et il vous faut les deux.",
    category: "Technology",
    tags: ["POS", "integrations", "restaurant technology"],
    seoTitle: "Why Your POS Isn't Enough for Kitchen Planning — PrepIQ",
    seoDescription:
      "A POS records what sold. It doesn't tell you what to prepare tomorrow. How the two systems divide the work, and why you don't need to replace anything.",
    sortOrder: 2,
    publishedAt: new Date("2026-07-09T09:00:00Z"),
    bodyEn: `Every restaurant we talk to already has a point-of-sale system. Most have had it for years, the staff know it, and it does its job.

So it's worth saying plainly: nothing here is an argument for replacing it. A POS is very good at what it was built for. The issue is that what it was built for is only half of what a kitchen needs.

## What a POS is for

A point-of-sale system is a **record**. It answers questions about the past with precision:

- What sold?
- How much of it?
- At what time, at which till, by which server?
- What did we take in today?

That's genuinely valuable, and it's the foundation everything else is built on. Without a reliable record of what sold, no amount of intelligence downstream is worth anything.

But look closely at the shape of those questions. Every one of them is backward-looking. That isn't a flaw — it's the design. A cash register's job is to be an accurate account of what already happened.

## The questions it can't answer

The questions that actually determine your food cost are different in kind:

- How much should we prepare tomorrow?
- Are we likely to run out of anything tonight?
- Which ingredients should we order, and how much?
- Why did today miss the forecast?
- What did that miss cost us?
- What should the chef do right now, at 6:40pm, with two hours of service left?

None of these can be answered by looking at a sales report, because none of them are questions about the past. They're decisions about the future that happen to *use* the past as one input among several.

| Question | Answered by |
| --- | --- |
| What sold yesterday? | POS |
| How much did we take? | POS |
| Which server rang it up? | POS |
| How much to prep tomorrow? | Operational intelligence |
| Are we about to run out? | Operational intelligence |
| Why did the forecast miss? | Operational intelligence |
| What should we order this week? | Operational intelligence |

The row that matters most is the last one in each half. Your POS closes out the day. Something else has to open the next one.

## Why the gap exists

This isn't an oversight by POS vendors. The two jobs pull in genuinely different directions.

A POS has to be fast, reliable, and correct under pressure. It's handling money in real time in front of a customer. Every design decision reasonably favours reliability over analysis.

Planning tomorrow's prep is the opposite kind of problem. It needs data the POS doesn't hold — weather, local events, what you actually prepared versus what you sold, why a dish ran out — and it needs to be wrong sometimes and learn from it. You would not want your till doing that.

So the gap isn't a defect. It's what happens when a system built to record transactions gets asked to make operational decisions.

## What fills it

An operational intelligence layer sits on top of the POS and does the work the POS was never meant to:

**It reads your sales history** — from the POS, automatically, so nobody re-keys anything.

**It adds the context the POS never sees** — weather, day-of-week patterns, local events, promotions, and the difference between what was prepared and what was sold.

**It produces a decision, not a report** — a specific prep quantity per item, with the reasoning attached.

**It watches service as it runs** — flagging items tracking well ahead of or behind plan while there's still time to act.

**It learns from the close** — including the crucial distinction between "demand was lower" and "we ran out at 8pm", which look identical in POS data and mean opposite things.

That last point is the clearest illustration of the divide. Your POS will faithfully record that you sold 40 portions. Only a system that also knows you *prepared* 40 can tell you that you didn't sell 40 because demand was 40 — you sold 40 because that's all you had.

## The practical version

In day-to-day terms, this means:

- You keep your POS. Staff training doesn't change. Nothing about how you take payments changes.
- Sales flow out of it automatically — most connect in minutes, and a CSV export works if yours doesn't.
- The kitchen gets a morning plan instead of a blank prep list.
- The manager gets a reason when a day misses, instead of a number.

No rip-and-replace, no parallel system for staff to maintain, no migration project.

> PrepIQ isn't a replacement for your POS. It's the operational intelligence layer that works alongside it.

If you already have a reliable record of what sold, you have everything needed to start answering the harder question — which is what to do about tomorrow.`,
  },
];

async function seedPosts() {
  for (const post of POSTS) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });
    if (existing) {
      console.log(`= post ${post.slug} already exists, skipping`);
      continue;
    }

    // French bodies are deliberately left null: the title and excerpt are
    // translated so listings read naturally, and the article itself falls back
    // to English until someone translates it properly.
    await prisma.blogPost.create({
      data: { ...post, isPublished: true, isFeatured: true },
    });
    console.log(`+ created post ${post.slug}`);
  }
}

async function main() {
  await seedLinks();
  await ensureTeaserSection();
  await seedPosts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
