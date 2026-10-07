import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Services",
    title: "Architecture, Build & Delivery",
    image: "/images/hero/services-hero.png",
  });
}
