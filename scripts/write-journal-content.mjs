// One-off content-fill script for the 4 journal articles. Replaces the
// "[Placeholder]" excerpts seeded by seed-sanity.mjs with real copy, adds
// full portable-text article bodies, and sets the hero "note" field added
// to journalArticle.ts (matching the service detail page template). Only
// patches these three fields, so it's safe to re-run and won't touch
// title/slug/image/publishedAt/order. Run with:
//   node --env-file=.env.local scripts/write-journal-content.mjs

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN env vars.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const SEED_ID_PREFIX = "seed-";
const key = () => Math.random().toString(36).slice(2, 10);

function span(text, marks = []) {
  return { _type: "span", _key: key(), text, marks };
}

function block(style, text, marksSpec) {
  return {
    _type: "block",
    _key: key(),
    style,
    children: Array.isArray(text) ? text : [span(text, marksSpec)],
    markDefs: [],
  };
}

function list(style, items) {
  return items.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: style,
    level: 1,
    children: [span(text)],
    markDefs: [],
  }));
}

function quote(text) {
  return block("blockquote", text);
}

const ARTICLES = [
  {
    id: `${SEED_ID_PREFIX}journal-long-term-living`,
    excerpt:
      "Interior trends move in cycles measured in seasons. A well-built home has to hold up for decades. Here's how we design for the second decade of ownership, not the first six months.",
    note: {
      line: "Design for the family you'll be, not just the one you are.",
      subline: "Considered spaces outlast passing trends.",
    },
    body: [
      block(
        "normal",
        "Every few years a new palette, a new layout idea, or a new material finish gets declared the definitive look for a modern home. Most of it will look dated within a decade. A house, unlike a feed, doesn't get to refresh itself — so the decisions made at the drawing-board stage need to hold up long after the trend that inspired them has passed.",
      ),
      block("h2", "Trends Fade, Households Don't"),
      block(
        "normal",
        "When we sit down with a client at the start of a renovation or new build, the conversation that matters most isn't about which finish is popular this year — it's about how the household actually lives. A family with young children needs different sightlines and storage to a couple planning to work from home for the next twenty years. Designing around the real rhythm of a household, rather than a moodboard, is what keeps a layout working long after the finishes have quietly gone out of fashion.",
      ),
      block("h2", "What Actually Lasts"),
      block(
        "normal",
        "In our experience across 30+ years of new builds, renovations, and extensions, a handful of decisions consistently outlast everything else:",
      ),
      ...list("bullet", [
        "Generous natural light and clear sightlines through the ground floor",
        "Storage that's planned in at design stage, not retrofitted later",
        "Durable, honest materials — timber, stone, brick — that age rather than degrade",
        "Flexible rooms that can shift use as a family's needs change",
        "Structural decisions (openings, load-bearing walls) that leave future options open",
      ]),
      block("h2", "Designing Around the Next Decade, Not the Next Instagram Post"),
      block(
        "normal",
        "This doesn't mean building something plain or anonymous. It means separating the decisions that are genuinely structural — layout, light, flow, material honesty — from the ones that are easy and inexpensive to update later, like paint, soft furnishings, or cabinet hardware. Get the first category right and a home stays comfortable and valuable regardless of what's trending. Get it wrong, and no amount of styling will fix a room that simply doesn't work for how you live.",
      ),
      quote(
        "A kitchen you'll still love in fifteen years isn't the one that photographs best today — it's the one built around how you actually cook, gather, and live.",
      ),
      block(
        "normal",
        "That's the lens we bring to every project, whether it's a full new build or a single-room renovation: build the parts that are expensive and disruptive to change so they're right the first time, and leave room for the parts that are easy to refresh as tastes evolve.",
      ),
    ],
  },
  {
    id: `${SEED_ID_PREFIX}journal-material-honesty`,
    excerpt:
      "Timber that looks like timber. Brick that's allowed to read as brick. Why letting materials express their true nature — rather than disguising them — produces homes that age with dignity instead of just getting old.",
    note: {
      line: "Let a material be what it is.",
      subline: "Honest finishes age with dignity, not decay.",
    },
    body: [
      block(
        "normal",
        "There's a quiet difference between a material and an imitation of one — laminate dressed as oak, brick-effect cladding standing in for real brick. Both can look convincing in a showroom or a listing photo. Only one of them ages well. Material honesty is the principle of choosing what something actually is, and building it to be seen as such.",
      ),
      block("h2", "Why the Distinction Matters"),
      block(
        "normal",
        "A genuine material — solid timber, natural stone, real brick, poured concrete — wears over time in a way that stays attractive: timber deepens in tone, brick weathers, stone develops patina. An imitation material doesn't age, it degrades. Laminate chips and can't be refinished. Printed finishes fade unevenly. The gap between the two only becomes obvious years after the project completes, which is exactly when it's most expensive to fix.",
      ),
      block("h2", "Where We Apply It"),
      block(
        "normal",
        "On barn conversions this shows up most clearly: retaining original timber frame and stonework wherever it's structurally sound, rather than cladding over it, keeps the character that made the building worth converting in the first place. On new builds and extensions, it shows up in smaller decisions — specifying real timber joinery over veneered MDF where it's within budget, or choosing a genuine stone worktop over a printed laminate that mimics one.",
      ),
      ...list("bullet", [
        "Solid timber joinery in place of veneered board wherever budget allows",
        "Original brick and stonework retained and repointed rather than clad over",
        "Natural stone and hardwood specified for surfaces that see daily wear",
        "Structural materials left exposed where they're part of the architectural story",
      ]),
      block("h2", "It's Not About Cost — It's About Where You Spend It"),
      block(
        "normal",
        "Material honesty isn't a mandate to spend more everywhere. It's a way of deciding where authenticity actually earns its keep — a real timber staircase handrail that gets touched every day, versus a skirting board that doesn't need to be solid oak to do its job well. We help clients draw that line project by project, so the budget goes toward the materials that will actually be seen, felt, and lived with.",
      ),
      quote(
        "A home built from honest materials doesn't need to hide its age — it just changes character, gracefully, the way real things do.",
      ),
      block(
        "normal",
        "It's a slower, sometimes more expensive way to build. It's also the difference between a house that looks tired at year ten and one that looks like it's settling in.",
      ),
    ],
  },
  {
    id: `${SEED_ID_PREFIX}journal-openness-privacy`,
    excerpt:
      "Open-plan living solved one problem and created another: how do you stay connected as a household without losing anywhere quiet to retreat to? Notes on planning layouts that feel open without sacrificing privacy.",
    note: {
      line: "Open enough to gather. Private enough to think.",
      subline: "Good zoning does both without walls everywhere.",
    },
    body: [
      block(
        "normal",
        "Open-plan living became the default for a reason — it suits how modern households actually spend time together, especially around cooking and eating. But knock down every wall and you solve one problem while creating another: nowhere quiet to take a call, read, or simply be alone in a busy house. The layouts that work best aren't the most open ones. They're the ones that are open in the right places and closed in the right others.",
      ),
      block("h2", "Openness Is a Tool, Not a Goal"),
      block(
        "normal",
        "We treat open-plan as one technique among several, not an end in itself. A kitchen-diner that opens onto a garden through full-height glazing creates exactly the kind of connected, light-filled space most clients ask for. But that same project usually benefits from a separate snug, study, or simply a door that can close off part of the ground floor when the household needs quiet rather than togetherness.",
      ),
      block("h2", "Zoning Without Walls"),
      block(
        "normal",
        "Privacy doesn't always require a wall. A change in floor level, a run of joinery, a shift in ceiling height, or simply distance and sightline can create a sense of separation inside an otherwise open space. These soft boundaries let a room feel connected to the rest of the house while still giving whoever's in it a sense of their own territory — useful in a working-from-home study nook off an open living area, for example.",
      ),
      ...list("bullet", [
        "Sightlines planned so sound and activity don't travel further than intended",
        "At least one quiet, closable room retained on the ground floor",
        "Level changes or joinery used to define zones without full walls",
        "Bedroom and living wings separated clearly enough to buffer noise",
      ]),
      block("h2", "Designing for the Whole Household, Not Just the Photograph"),
      block(
        "normal",
        "The layouts that photograph best — one enormous, uninterrupted open-plan space — aren't always the ones that live best day to day, particularly for families with a wide age range or anyone who works from home. We ask clients early on who needs quiet, when, and where, and design the zoning around those answers rather than around a single dramatic open-plan shot.",
      ),
      quote(
        "The best open-plan spaces aren't the ones with the fewest walls — they're the ones where you never notice you're missing one."
      ),
      block(
        "normal",
        "Get that balance right, and a home supports both a Sunday lunch for twelve and a Tuesday afternoon when someone just needs somewhere quiet to work.",
      ),
    ],
  },
  {
    id: `${SEED_ID_PREFIX}journal-home-landscape`,
    excerpt:
      "The line between indoors and outdoors has become one of the most valuable decisions in a home extension. Exploring how extensions, glazing, and level changes can dissolve that boundary rather than just decorate it.",
    note: {
      line: "The garden isn't outside the house. It's the next room.",
      subline: "Glazing and level changes dissolve the boundary.",
    },
    body: [
      block(
        "normal",
        "Ask most clients what they want from a kitchen extension and, sooner or later, the garden comes up — not as a view to admire through a window, but as somewhere they actually want to spend time, ideally without a step, a threshold, or a change in material breaking the connection. The strongest extensions we build treat the boundary between house and landscape as something to dissolve, not just decorate.",
      ),
      block("h2", "Glazing as a Structural Decision, Not a Finishing Touch"),
      block(
        "normal",
        "Full-height sliding or bi-fold glazing across a rear extension does more than let in light — it changes how a room is used. A kitchen-diner that opens fully onto a patio effectively gains a second room in summer, and even closed, uninterrupted glass keeps the garden present as part of the space rather than separate from it. This has to be planned early, at the structural stage, not added as a finishing decision once the walls are up.",
      ),
      block("h2", "Removing the Threshold"),
      block(
        "normal",
        "One of the simplest, most effective moves is levelling the internal floor with the external patio or decking, so there's no step and no visual break at the doors. It's a small detail on a drawing that makes a significant difference to how connected a space feels once it's built — the eye reads the flooring as continuous, and the garden stops feeling like 'outside'.",
      ),
      ...list("bullet", [
        "Level thresholds between internal flooring and external paving or decking",
        "Full-height or bi-fold glazing specified at design stage, not retrofitted",
        "Planting and hard landscaping considered as part of the extension brief",
        "Sightlines from key rooms planned toward the garden, not just toward each other",
      ]),
      block("h2", "It Works in Both Directions"),
      block(
        "normal",
        "The best indoor-outdoor connections aren't just about looking out — they're about the garden reading as an extension of the house when you're standing in it too. Materials that carry through from interior floor to exterior paving, planting positioned to frame a view back toward the glazing, and lighting that treats the patio as another room after dark all reinforce the same idea from the outside in.",
      ),
      quote(
        "A well-connected extension doesn't just add square footage — it makes the garden feel like part of the house's floor plan.",
      ),
      block(
        "normal",
        "It's a principle that applies whether the project is a modest single-storey rear extension or a full wrap-around — the goal is the same: make the line between inside and outside as quiet as possible.",
      ),
    ],
  },
];

async function run() {
  console.log(`Writing journal content in ${projectId}/${dataset}...\n`);

  for (const article of ARTICLES) {
    await client
      .patch(article.id)
      .set({
        excerpt: article.excerpt,
        note: article.note,
        body: article.body,
      })
      .commit();
    console.log(`Patched ${article.id}`);
  }

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
