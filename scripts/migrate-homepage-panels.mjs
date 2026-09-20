// One-off migration for the frontend redesign. Run with:
//   node --env-file=.env.local scripts/migrate-homepage-panels.mjs
//
// Does three things, all additive/idempotent except step 3:
//   1. Creates the "homepagePanels" singleton, seeded with the content that
//      used to be hardcoded in QuickLinksPanels.tsx.
//   2. Patches the existing "siteSettings" document to add `socials`
//      (Instagram/Facebook/LinkedIn), which were previously hardcoded in
//      SiteNav.tsx/SiteFooter.tsx instead of coming from Sanity. Uses
//      setIfMissing so it won't clobber socials if already set.
//   3. Deletes the four "expertiseArea" documents — that content type is no
//      longer rendered anywhere on the site after the redesign.
//
// Safe to re-run: step 1 uses createIfNotExists, step 2 is setIfMissing,
// step 3 is a no-op once the docs are gone.

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

async function uploadImage(relativePath) {
  const filePath = path.join(PUBLIC_DIR, relativePath);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(relativePath),
  });
  console.log(`Uploaded ${relativePath} -> ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function run() {
  console.log(`Migrating project ${projectId}/${dataset}...\n`);

  // 1. Homepage panels singleton
  const [exterior, construction, extension, oldtonew] = await Promise.all([
    uploadImage("images/hero/exterior.png"),
    uploadImage("images/hero/construction.png"),
    uploadImage("images/hero/extension.png"),
    uploadImage("images/hero/oldtonew.png"),
  ]);

  const homepagePanelsDoc = {
    _id: "homepagePanels",
    _type: "homepagePanels",
    panels: [
      {
        _key: "projects",
        image: exterior,
        eyebrow: "Portfolio",
        title: "Selected Projects",
        href: "/projects",
      },
      {
        _key: "design",
        image: construction,
        eyebrow: "Discipline",
        title: "Architectural Design",
        href: "/design",
      },
      {
        _key: "build",
        image: extension,
        eyebrow: "Execution",
        title: "Specialist Build",
        href: "/build",
      },
      {
        _key: "studio",
        image: oldtonew,
        eyebrow: "The Practice",
        title: "Our Studio & Heritage",
        href: "/ourstudio",
      },
    ],
    methodology: {
      eyebrow: "Our Methodology",
      heading: "Conceive. Engineer. Craft.",
      body: [
        "Every residence we shape begins as an organic conversation between landscape, light, and human rhythm. We reject off-the-shelf templates in favour of pure architectural integrity, selecting native stone, structural timber, and artisanal masonry suited to lasting generations.",
        "By uniting RIBA-chartered architects and master building contractors under one single studio stewardship, Stoneage eliminates the traditional friction between visionary blueprint and onsite physical execution.",
      ],
    },
    statement: {
      eyebrow: "Bespoke Residences",
      heading: "Quiet Luxury & Enduring Form",
      body: [
        "We craft private residential sanctuaries defined by spatial calm, tactile natural materials, and precision engineering. Our portfolio spans monolithic country estates, sensitive heritage transformations, and forward-thinking contemporary extensions.",
        "Headquartered in Solihull with collaborative studios in London and Nottingham, Stoneage Properties advises discerning homeowners throughout the UK on complex planning, conservation zoning, and turnkey construction management.",
      ],
      ctaLabel: "Discuss your architectural commission",
      ctaHref: "/contact",
    },
  };

  await client.createIfNotExists(homepagePanelsDoc);
  console.log("Created (or kept existing) homepagePanels singleton");

  // 2. Add socials to siteSettings without touching anything already set
  await client
    .patch("siteSettings")
    .setIfMissing({
      socials: [
        {
          _key: "instagram",
          platform: "Instagram",
          url: "https://www.instagram.com/stoneage_building_contractors/",
        },
        {
          _key: "facebook",
          platform: "Facebook",
          url: "https://www.facebook.com/stoneageproperties",
        },
        {
          _key: "linkedin",
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/stoneage-properties-5bb8171a1/",
        },
      ],
    })
    .commit();
  console.log("Patched siteSettings.socials (if missing)");

  // 3. Remove the no-longer-rendered expertiseArea documents
  const expertiseIds = await client.fetch(
    `*[_type == "expertiseArea"]._id`,
  );
  if (expertiseIds.length) {
    await client.delete({ query: `*[_type == "expertiseArea"]` });
    console.log(`Deleted ${expertiseIds.length} expertiseArea document(s)`);
  } else {
    console.log("No expertiseArea documents left to delete");
  }

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
