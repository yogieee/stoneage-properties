import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Our Studio",
    title: "Design & Build, Under One Roof",
    image: "/images/hero/studio-process-design.png",
  });
}
