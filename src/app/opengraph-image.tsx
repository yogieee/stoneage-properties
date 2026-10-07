import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Solihull · Design & Build",
    title: "Specialised Residential Builders",
    image: "/images/hero/exterior.png",
  });
}
