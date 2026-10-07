import { getService } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { renderBrandOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  return renderBrandOgImage({
    eyebrow: "Service",
    title: service?.name || "Stoneage Properties",
    image: service?.heroImage
      ? urlFor(service.heroImage).width(1200).height(630).url()
      : "/images/hero/services-hero.png",
  });
}
