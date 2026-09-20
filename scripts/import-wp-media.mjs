// One-off WordPress media importer. Run with:
//   node --env-file=.env.local scripts/import-wp-media.mjs
//
// Pulls every item from the old WordPress site's media library via the
// REST API (/wp-json/wp/v2/media) using an Application Password, then:
//   - images are uploaded straight into Sanity as unattached image assets
//     (visible in Studio's Media Library, ready to attach to documents)
//   - videos are handed to Mux directly by URL (Mux fetches the file from
//     the WordPress source_url itself — nothing is downloaded here). Mux
//     takes a while to finish encoding, so this only kicks off the asset
//     and records its Mux asset ID; run finalize-mux-videos.mjs afterwards
//     (repeatedly, until it reports everything ready) to register the
//     finished videos as mux.videoAsset documents in Sanity.
//
// A manifest (scripts/wp-media-export/manifest.json) records the mapping
// from old WP media ID/URL to the new Sanity asset ID (images) or Mux
// asset ID (videos), so galleries can be wired up afterwards.

import { createClient } from "@sanity/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const WP_BASE_URL = process.env.WP_BASE_URL?.replace(/\/$/, "");
const WP_APP_USER = process.env.WP_APP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

if (!WP_BASE_URL || !WP_APP_USER || !WP_APP_PASSWORD) {
  console.error(
    "Missing WP_BASE_URL / WP_APP_USER / WP_APP_PASSWORD env vars. " +
      "Create an Application Password in WP Admin > Users > Profile.",
  );
  process.exit(1);
}
if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN env vars.",
  );
  process.exit(1);
}
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error("Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET env vars.");
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const EXPORT_DIR = path.resolve(import.meta.dirname, "wp-media-export");

const wpAuthHeader = {
  Authorization: `Basic ${Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString("base64")}`,
};

const muxAuthHeader = {
  Authorization: `Basic ${Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64")}`,
  "Content-Type": "application/json",
};

async function fetchAllMedia() {
  const items = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${WP_BASE_URL}/wp-json/wp/v2/media?per_page=100&page=${page}`,
      { headers: wpAuthHeader },
    );
    if (res.status === 400) break; // WP returns 400 once page > total pages
    if (!res.ok) {
      throw new Error(`WP media fetch failed: ${res.status} ${res.statusText}`);
    }
    const batch = await res.json();
    if (batch.length === 0) break;
    items.push(...batch);
    const totalPages = Number(res.headers.get("x-wp-totalpages") || page);
    if (page >= totalPages) break;
    page += 1;
  }
  return items;
}

async function downloadFile(url) {
  const res = await fetch(url, { headers: wpAuthHeader });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function createMuxAssetFromUrl(sourceUrl, filename) {
  const res = await fetch("https://api.mux.com/video/v1/assets", {
    method: "POST",
    headers: muxAuthHeader,
    body: JSON.stringify({
      input: [{ url: sourceUrl }],
      playback_policy: ["public"],
      meta: { title: filename },
    }),
  });
  if (!res.ok) {
    throw new Error(`Mux asset create failed (${res.status}): ${await res.text()}`);
  }
  const { data } = await res.json();
  return data; // { id, status, ... }
}

async function main() {
  await mkdir(EXPORT_DIR, { recursive: true });

  console.log(`Fetching media list from ${WP_BASE_URL} ...`);
  const items = await fetchAllMedia();
  console.log(`Found ${items.length} media items.`);

  const manifest = [];

  for (const item of items) {
    const sourceUrl = item.source_url;
    const mime = item.mime_type || "";
    const filename = path.basename(new URL(sourceUrl).pathname);
    const alt = item.alt_text || item.title?.rendered || "";

    try {
      if (mime.startsWith("image/")) {
        const buffer = await downloadFile(sourceUrl);
        const asset = await sanity.assets.upload("image", buffer, {
          filename,
        });
        manifest.push({
          wpId: item.id,
          wpUrl: sourceUrl,
          mime,
          alt,
          sanityAssetId: asset._id,
        });
        console.log(`[image] ${filename} -> ${asset._id}`);
      } else if (mime.startsWith("video/")) {
        const muxAsset = await createMuxAssetFromUrl(sourceUrl, filename);
        manifest.push({
          wpId: item.id,
          wpUrl: sourceUrl,
          mime,
          alt,
          filename,
          muxAssetId: muxAsset.id,
          muxStatus: muxAsset.status,
          needsMuxUpload: true,
        });
        console.log(`[video] ${filename} -> Mux asset ${muxAsset.id} (${muxAsset.status})`);
      } else {
        console.log(`[skip] ${filename} (${mime || "unknown mime"})`);
      }
    } catch (err) {
      console.error(`[error] ${filename}: ${err.message}`);
      manifest.push({ wpId: item.id, wpUrl: sourceUrl, mime, error: err.message });
    }
  }

  await writeFile(
    path.join(EXPORT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  const videoCount = manifest.filter((m) => m.needsMuxUpload).length;
  const imageCount = manifest.filter((m) => m.sanityAssetId).length;
  console.log(`\nDone. ${imageCount} images uploaded to Sanity.`);
  if (videoCount > 0) {
    console.log(
      `${videoCount} videos submitted to Mux for encoding. Run ` +
        `"node --env-file=.env.local scripts/finalize-mux-videos.mjs" ` +
        `in a few minutes to register the finished ones in Sanity.`,
    );
  }
  console.log(`Manifest written to ${path.join(EXPORT_DIR, "manifest.json")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
