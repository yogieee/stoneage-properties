import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage({
    eyebrow: "Projects",
    title: "A Portfolio of Private Residences",
    image: "/images/hero/projects-panel.png",
  });
}
