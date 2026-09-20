// Second step of the WordPress video import. Run with:
//   node --env-file=.env.local scripts/finalize-mux-videos.mjs
//
// Reads scripts/wp-media-export/manifest.json (written by
// import-wp-media.mjs), checks each pending Mux asset's encoding status,
// and — once an asset is "ready" — creates the corresponding
// mux.videoAsset document in Sanity (the same document shape Sanity's own
// Studio "import existing Mux assets" feature creates), then updates the
// manifest with the new Sanity document ID.
//
// Safe to re-run: already-finalized entries are skipped, and assets still
// "preparing" on Mux are left for the next run.

import { createClient } from "@sanity/client";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

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

const muxAuthHeader = {
  Authorization: `Basic ${Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64")}`,
};

const MANIFEST_PATH = path.resolve(
  import.meta.dirname,
  "wp-media-export",
  "manifest.json",
);

async function getMuxAsset(assetId) {
  const res = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
    headers: muxAuthHeader,
  });
  if (!res.ok) {
    throw new Error(`Mux asset fetch failed (${res.status}): ${await res.text()}`);
  }
  const { data } = await res.json();
  return data;
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));

  const pending = manifest.filter((m) => m.needsMuxUpload && !m.sanityVideoAssetId);
  if (pending.length === 0) {
    console.log("Nothing pending — all videos already finalized.");
    return;
  }
  console.log(`Checking ${pending.length} pending Mux asset(s)...`);

  let readyCount = 0;
  let stillPreparing = 0;

  for (const entry of pending) {
    try {
      const asset = await getMuxAsset(entry.muxAssetId);
      entry.muxStatus = asset.status;

      if (asset.status === "errored") {
        entry.error = asset.errors?.messages?.join("; ") || "Mux asset errored";
        console.error(`[error] ${entry.filename}: ${entry.error}`);
        continue;
      }
      if (asset.status !== "ready") {
        stillPreparing += 1;
        console.log(`[preparing] ${entry.filename} (${asset.status})`);
        continue;
      }

      const playbackId = (asset.playback_ids || []).find((p) => p.id)?.id;
      if (!playbackId) {
        entry.error = "Ready asset has no playback ID";
        continue;
      }

      const doc = {
        _id: randomUUID(),
        _type: "mux.videoAsset",
        status: asset.status,
        assetId: asset.id,
        playbackId,
        filename: entry.filename,
        data: asset,
      };
      const created = await sanity.create(doc);
      entry.sanityVideoAssetId = created._id;
      readyCount += 1;
      console.log(`[ready] ${entry.filename} -> ${created._id}`);
    } catch (err) {
      entry.error = err.message;
      console.error(`[error] ${entry.filename}: ${err.message}`);
    }
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(
    `\n${readyCount} video(s) registered in Sanity. ${stillPreparing} still encoding on Mux.`,
  );
  if (stillPreparing > 0) {
    console.log("Re-run this script again in a few minutes to pick up the rest.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
