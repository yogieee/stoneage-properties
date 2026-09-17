export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.stoneageproperties.com";

export const SITE_NAME = "Stoneage Properties";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero/exterior.png`;

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
