import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|facebot|preview|headless|lighthouse|monitor/i;

// Per-IP sliding window, held in memory only (the IP is never stored).
// Same trade-off as the chat route: resets per instance, fine as an abuse guard.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const rateLimitLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitLog.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  rateLimitLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function clean(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed || null;
}

export async function POST(request: NextRequest) {
  const ok = () => new NextResponse(null, { status: 204 });

  let body: {
    path?: unknown;
    utmSource?: unknown;
    utmMedium?: unknown;
    utmCampaign?: unknown;
    referrerHost?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const path = clean(body.path, 300);
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ error: "A valid path is required." }, { status: 400 });
  }

  // Not real visitor traffic: crawlers/link scrapers, the CMS studio, the API.
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) return ok();
  if (path.startsWith("/studio") || path.startsWith("/api")) return ok();

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return ok();

  try {
    const { error } = await getSupabaseServerClient()
      .from("page_visits")
      .insert({
        host: clean(request.headers.get("host"), 200),
        path,
        utm_source: clean(body.utmSource, 100)?.toLowerCase() ?? null,
        utm_medium: clean(body.utmMedium, 100)?.toLowerCase() ?? null,
        utm_campaign: clean(body.utmCampaign, 150),
        referrer_host: clean(body.referrerHost, 200),
      });
    if (error) console.error("Visit tracking insert failed:", error);
  } catch (err) {
    console.error("Visit tracking error:", err);
  }

  // Tracking is best-effort and must never surface an error to the visitor.
  return ok();
}
