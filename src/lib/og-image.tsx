import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const MIME_BY_EXT: Record<string, string> = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function localImageDataUri(publicPath: string): string {
  const filePath = path.join(process.cwd(), "public", publicPath);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = MIME_BY_EXT[ext] ?? "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

type BrandOgImageInput = {
  title: string;
  eyebrow?: string;
  /** Either a path under /public (e.g. "/images/hero/exterior.png") or an absolute remote URL. */
  image?: string;
};

export function renderBrandOgImage({
  title,
  eyebrow,
  image,
}: BrandOgImageInput) {
  const backgroundSrc = image
    ? image.startsWith("http")
      ? image
      : localImageDataUri(image)
    : localImageDataUri("/images/hero/exterior.png");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1C1B19",
        }}
      >
        <img
          src={backgroundSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(28,27,25,0.2) 0%, rgba(28,27,25,0.5) 55%, rgba(28,27,25,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <svg width="36" height="36" viewBox="-14.5 30 320 320">
            <rect x="-14.5" y="30" width="320" height="320" rx="70" fill="#F7F5F0" />
            <g fill="#1C1B19">
              <path d="M76 40 L115 60 L115 340 L76 340 Z" />
              <path d="M126 142 L165 162 L165 340 L126 340 Z" />
              <path d="M176 242 L215 262 L215 340 L176 340 Z" />
            </g>
          </svg>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 3,
              color: "#F7F5F0",
              textTransform: "uppercase",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            Stoneage Properties
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 64,
            right: 64,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {eyebrow && (
            <span
              style={{
                fontSize: 20,
                letterSpacing: 3,
                color: "rgba(247,245,240,0.8)",
                textTransform: "uppercase",
                fontFamily: "monospace",
                display: "flex",
              }}
            >
              {eyebrow}
            </span>
          )}
          <span
            style={{
              fontSize: 58,
              color: "#F7F5F0",
              fontWeight: 600,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              display: "flex",
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
