import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Build & Delivery",
    title: "Specialist Residential Construction",
    image: "/images/client/client-twilight-exterior.png",
  });
}
