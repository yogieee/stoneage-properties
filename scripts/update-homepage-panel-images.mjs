// One-off patch: replace the homepagePanels images with the dedicated
// AI-generated images that now also serve as each destination page's hero
// (design-hero.png, build-hero.png, studio-hero.png) plus a new dedicated
// projects-panel.png, fixing the mismatch where the homepage's Design/Build
// panels showed the wrong page's photo relative to every other page's
// consistent per-destination nav image. Run with:
//   node --env-file=.env.local scripts/update-homepage-panel-images.mjs
// Safe to re-run.

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
  const [projects, design, build, studio] = await Promise.all([
    uploadImage("images/hero/projects-panel.png"),
    uploadImage("images/hero/design-hero.png"),
    uploadImage("images/hero/build-hero.png"),
    uploadImage("images/hero/studio-hero.png"),
  ]);

  await client
    .patch("homepagePanels")
    .set({
      'panels[_key=="projects"].image': projects,
      'panels[_key=="design"].image': design,
      'panels[_key=="build"].image': build,
      'panels[_key=="studio"].image': studio,
    })
    .commit();

  console.log("Patched homepagePanels images");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
