import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.stoneageproperties.com";

export const SITE_NAME = "Stoneage Properties";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero/exterior.png`;

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogTitle?: string;
  type?: "website" | "article";
};

/**
 * Builds consistent title/description/keywords + OG & Twitter cards for a
 * page. Next.js overwrites (not deep-merges) nested `openGraph`/`twitter`
 * objects per segment, so every page sets its own here. Preview images are
 * NOT set here — each route ships a sibling `opengraph-image.tsx` (see
 * src/lib/og-image.tsx) that renders a branded image (logo + building photo
 * + title), which Next wires into both og:image and twitter:image.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  ogTitle,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const resolvedOgTitle = ogTitle ?? `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: resolvedOgTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description,
    },
  };
}
