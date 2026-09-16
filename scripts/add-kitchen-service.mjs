// One-off addition of the 8th service: Modern Kitchen Remodeling.
// Run with:
//   node --env-file=.env.local scripts/add-kitchen-service.mjs
//
// Deliberately standalone (does NOT reuse seed-sanity.mjs's run()) because
// that script's createOrReplace() on the SERVICES/EXPERTISE_AREAS arrays
// would wipe the heroImage/process/features/faqs/note fields patched in by
// seed-service-details.mjs on the other 7 services. This script only
// creates the new service doc and patches it + the "Bespoke Kitchens"
// expertise card, leaving everything else untouched. Safe to re-run.

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

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

const PUBLIC_DIR = path.resolve(import.meta.dirname, "..", "public");
const SEED_ID_PREFIX = "seed-";
const key = () => Math.random().toString(36).slice(2, 10);

async function uploadImage(relativePath) {
  const filePath = path.join(PUBLIC_DIR, relativePath);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(relativePath),
  });
  console.log(`Uploaded ${relativePath} -> ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const SERVICE_ID = `${SEED_ID_PREFIX}service-kitchens`;

const SERVICE_DOC = {
  _id: SERVICE_ID,
  _type: "service",
  name: "Modern Kitchen Remodeling",
  slug: { _type: "slug", current: "kitchens" },
  summary:
    "Bespoke kitchen remodels designed and fitted to a professional, lasting standard.",
  description:
    "We design and build bespoke kitchen remodels that balance everyday practicality with a considered, modern finish. From layout and cabinetry through to worktops, lighting, and appliance integration, every kitchen is planned around how you actually use the space and delivered with the same attention to detail as a full renovation.",
  warranty: {
    label: "3-Year Workmanship Guarantee",
    detail:
      "Every kitchen remodel is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
  },
  order: 8,
};

const SERVICE_DETAIL = {
  heroImage: "images/hero/modernkitchen.png",
  note: {
    line: "A kitchen built around how you actually live.",
    subline: "3-year workmanship guarantee on every remodel.",
  },
  metaDescription:
    "Bespoke kitchen remodels in Solihull, London & Nottingham. Design, cabinetry, and fit-out delivered to a professional standard, backed by a 3-year workmanship guarantee.",
  process: [
    {
      title: "Consultation & Layout Design",
      detail:
        "We visit the property, discuss how you use the kitchen day to day, and talk through layout, storage, and workflow options before any drawings are produced.",
    },
    {
      title: "Design, Specification & Fixed Quote",
      detail:
        "You receive a detailed design with cabinetry, worktop, and appliance specification, along with a fixed, itemised quote so there are no surprises once work starts.",
    },
    {
      title: "Trade Coordination & Programme",
      detail:
        "We sequence electrics, plumbing, plastering, and tiling under one point of contact, and agree a start date and programme around your household.",
    },
    {
      title: "Strip-Out & Installation",
      detail:
        "Our team carries out strip-out, first fix, and cabinetry installation in sequence, with quick, direct communication if any decisions come up along the way.",
    },
    {
      title: "Snagging & 3-Year Guarantee",
      detail:
        "We walk the finished kitchen with you, resolve any snagging items, and back the completed work with our standard 3-year workmanship guarantee.",
    },
  ],
  features: [
    "Bespoke cabinetry design and installation",
    "Worktop, splashback, and lighting specification",
    "Integrated appliance coordination",
    "Electrics, plumbing, and tiling coordinated in-house",
    "3-year workmanship guarantee",
    "Fixed quote with no hidden extras",
  ],
  faqs: [
    {
      question: "How much does a kitchen remodel cost?",
      answer:
        "A mid-range kitchen remodel typically runs from £12,000–£28,000 depending on layout changes, cabinetry, and finishes. We give you a fixed, itemised quote after the initial consultation so there's no guesswork.",
    },
    {
      question: "Can I still use my kitchen during the remodel?",
      answer:
        "Once strip-out begins, no — but we sequence the project tightly and can help plan a temporary kitchen setup elsewhere in the house for the duration of the works.",
    },
    {
      question: "How long does a kitchen remodel take?",
      answer:
        "A typical kitchen remodel takes 3 to 5 weeks once started, depending on the extent of layout changes and any structural work involved.",
    },
    {
      question: "Do you handle the electrics and plumbing as well?",
      answer:
        "Yes — we coordinate every trade needed, including electricians and plumbers, under one point of contact, so you deal with a single team rather than managing subcontractors yourself.",
    },
    {
      question: "What does the 3-year workmanship guarantee cover?",
      answer:
        "It covers the quality of our labour and materials for 3 years from completion — so if anything relating to our workmanship needs attention, we return and fix it at no extra cost.",
    },
  ],
};

async function run() {
  console.log(`Adding kitchens service to ${projectId}/${dataset}...\n`);

  await client.createIfNotExists(SERVICE_DOC);
  console.log(`Created (or confirmed existing) service ${SERVICE_ID}`);

  const heroImage = await uploadImage(SERVICE_DETAIL.heroImage);
  await client
    .patch(SERVICE_ID)
    .set({
      heroImage,
      note: SERVICE_DETAIL.note,
      metaDescription: SERVICE_DETAIL.metaDescription,
      process: SERVICE_DETAIL.process.map((step) => ({
        ...step,
        _type: "processStep",
        _key: key(),
      })),
      features: SERVICE_DETAIL.features,
      faqs: SERVICE_DETAIL.faqs.map((faq) => ({
        ...faq,
        _type: "faq",
        _key: key(),
      })),
    })
    .commit();
  console.log(`Patched service ${SERVICE_ID} with detail content`);

  await client
    .patch(`${SEED_ID_PREFIX}expertise-kitchens`)
    .set({ service: { _type: "reference", _ref: SERVICE_ID } })
    .commit();
  console.log(
    `Re-linked expertiseArea ${SEED_ID_PREFIX}expertise-kitchens -> ${SERVICE_ID}`,
  );

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
