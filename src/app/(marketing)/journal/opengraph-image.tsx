import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Journal",
    title: "Insights on Architecture & Craft",
    image: "/images/hero/loft.png",
  });
}
