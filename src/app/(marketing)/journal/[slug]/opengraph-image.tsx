import { getJournalArticle } from "@/sanity/queries";
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
  const article = await getJournalArticle(slug);

  return renderBrandOgImage({
    eyebrow: "Journal",
    title: article?.title || "Stoneage Properties",
    image: article?.image
      ? urlFor(article.image).width(1200).height(630).url()
      : "/images/hero/loft.png",
  });
}
