// One-off addition of the 9th service: Roof Installation & Repair.
// Run with:
//   node --env-file=.env.local scripts/add-roofing-service.mjs
//
// Follows the same standalone pattern as add-kitchen-service.mjs: only
// creates this one service doc and patches its detail fields, leaving
// every other service untouched. Safe to re-run.

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

const SERVICE_ID = `${SEED_ID_PREFIX}service-roofing`;

const SERVICE_DOC = {
  _id: SERVICE_ID,
  _type: "service",
  name: "Roof Installation & Repair",
  slug: { _type: "slug", current: "roofing" },
  summary:
    "New roof installations and repairs carried out to a structural, weather-tight standard built to last.",
  description:
    "We install and repair pitched and flat roofs to a structural, weather-tight standard — from full re-roofs on new builds and extensions through to targeted repairs on slipped tiles, failed flashing, or ageing coverings. Every job is assessed properly first, specified with the right materials for the property, and finished with the same attention to detail as the rest of our building work.",
  warranty: {
    label: "10-Year Warranty on New Roofs",
    detail:
      "New roof installations are backed by a 10-year warranty covering materials and workmanship; repairs carry our standard 3-year workmanship guarantee.",
  },
  order: 9,
};

const SERVICE_DETAIL = {
  heroImage: "images/hero/roofing.png",
  note: {
    line: "A roof that's built to be forgotten about.",
    subline: "10-year warranty on every new installation.",
  },
  metaDescription:
    "New roof installations and repairs in Solihull, London & Nottingham. Pitched and flat roofing specified and fitted to a weather-tight standard, backed by a 10-year warranty.",
  process: [
    {
      title: "Roof Survey & Assessment",
      detail:
        "We inspect the existing roof structure, coverings, and flashing (or the new build drawings, for a fresh install) to establish exactly what's needed before any quote is given.",
    },
    {
      title: "Specification & Fixed Quote",
      detail:
        "You receive a clear specification covering tiles or membrane, insulation, flashing, and guttering, along with a fixed, itemised quote and expected timeline.",
    },
    {
      title: "Scaffolding & Weather Protection",
      detail:
        "We arrange scaffolding and temporary weatherproofing so the property stays protected throughout, particularly on strip-and-replace projects.",
    },
    {
      title: "Strip-Out & Installation",
      detail:
        "Our roofing team strips back damaged or existing coverings where needed and installs the new roof structure, membrane, tiles or covering, and flashing to current building regulations.",
    },
    {
      title: "Final Inspection & Warranty",
      detail:
        "We carry out a final weather-tightness check, clear the site, and back the completed roof with a 10-year warranty on new installations.",
    },
  ],
  features: [
    "Pitched and flat roof installation",
    "Slipped tile, flashing, and leak repairs",
    "Re-roofing on extensions and loft conversions",
    "Insulation and guttering upgrades",
    "10-year warranty on new roof installations",
    "Fixed quote with no hidden extras",
  ],
  faqs: [
    {
      question: "How do I know if I need a repair or a full new roof?",
      answer:
        "It depends on the age and extent of the damage — a handful of slipped tiles or a failed flashing joint is usually a repair, while widespread wear, sagging, or repeated leaks across the roof usually points to a full re-roof. We'll give you an honest assessment during the survey rather than pushing for the bigger job.",
    },
    {
      question: "How much does a new roof cost?",
      answer:
        "A full pitched roof replacement on an average UK semi typically runs from £6,000–£15,000 depending on size, access, and covering material. We give you a fixed, itemised quote after the initial survey so there's no guesswork.",
    },
    {
      question: "How long does a roof installation take?",
      answer:
        "A typical full re-roof takes 1 to 2 weeks depending on size, weather, and access. Repairs are usually completed within a day or two.",
    },
    {
      question: "Can you match the existing tiles or roof style?",
      answer:
        "Yes — where reclaimed or matching tiles are available we source them to keep the property's appearance consistent, and we'll always flag if an exact match isn't realistic before work starts.",
    },
    {
      question: "What does the 10-year warranty cover?",
      answer:
        "It covers materials and workmanship on new roof installations for 10 years from completion, so if anything relating to the roof needs attention, we return and fix it at no extra cost.",
    },
  ],
};

async function run() {
  console.log(`Adding roofing service to ${projectId}/${dataset}...\n`);

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

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
