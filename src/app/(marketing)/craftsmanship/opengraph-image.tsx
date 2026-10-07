import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Craftsmanship",
    title: "Master Craftsmanship & Artisan Detail",
    image: "/images/hero/design-principle-material.png",
  });
}
