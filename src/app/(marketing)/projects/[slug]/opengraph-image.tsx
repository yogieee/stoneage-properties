import { getProject } from "@/sanity/queries";
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
  const project = await getProject(slug);

  return renderBrandOgImage({
    eyebrow: project?.category || "Project",
    title: project?.title || "Stoneage Properties",
    image: project?.image
      ? urlFor(project.image).width(1200).height(630).url()
      : "/images/hero/projects-panel.png",
  });
}
