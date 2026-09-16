// One-off update: swap each service's heroImage for the new dedicated
// photography added to public/images/hero/. Only patches the heroImage
// field, so it's safe to run against the live dataset. Run with:
//   node --env-file=.env.local scripts/update-hero-images.mjs

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

const HERO_IMAGE_UPDATES = [
  { id: `${SEED_ID_PREFIX}service-new-builds`, image: "images/hero/newbuilds.png" },
  { id: `${SEED_ID_PREFIX}service-renovations`, image: "images/hero/rennovation.png" },
  { id: `${SEED_ID_PREFIX}service-extensions`, image: "images/hero/extensionservice.png" },
  { id: `${SEED_ID_PREFIX}service-conversions`, image: "images/hero/loft.png" },
  { id: `${SEED_ID_PREFIX}service-basements`, image: "images/hero/basement.png" },
  { id: `${SEED_ID_PREFIX}service-refurbishments`, image: "images/hero/Refurbishments.png" },
  { id: `${SEED_ID_PREFIX}service-barn-conversions`, image: "images/hero/barn.png" },
  { id: `${SEED_ID_PREFIX}service-kitchens`, image: "images/hero/modernkitchen.png" },
];

async function run() {
  console.log(`Updating hero images in ${projectId}/${dataset}...\n`);

  for (const { id, image } of HERO_IMAGE_UPDATES) {
    const heroImage = await uploadImage(image);
    await client.patch(id).set({ heroImage }).commit();
    console.log(`Patched ${id} heroImage -> ${image}`);
  }

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
