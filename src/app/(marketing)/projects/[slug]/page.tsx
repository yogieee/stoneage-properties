import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Typography } from "@/components/ui/Typography";
import { getProject, getProjects } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} | Stoneage Properties`,
    description: project.summary || project.category,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <div className="pt-16 sm:pt-24">
      <div className="px-6 pb-16 sm:px-12">
        <span className="text-ink-subtle mb-3 block font-mono text-xs tracking-widest uppercase">
          {project.category}
        </span>
        <Typography variant="display-lg" as="h1">
          {project.title}
        </Typography>
        <p className="text-ink-muted mt-4 font-mono text-sm">
          {project.location}
        </p>
      </div>

      <div className="border-line relative aspect-[16/9] w-full overflow-hidden border-y">
        <Image
          src={urlFor(project.image).width(2000).height(1125).url()}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-12">
        {project.summary && (
          <Typography variant="body-lg" className="mb-8">
            {project.summary}
          </Typography>
        )}

        {Array.isArray(project.body) && project.body.length > 0 && (
          <div className="prose prose-neutral max-w-none">
            <PortableText value={project.body as never} />
          </div>
        )}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <div className="grid grid-cols-1 gap-6 px-6 pb-24 sm:grid-cols-2 sm:px-12">
          {project.gallery.map((image, index) => (
            <div
              key={index}
              className="border-line relative aspect-[4/3] w-full overflow-hidden rounded-lg border"
            >
              <Image
                src={urlFor(image).width(1000).height(750).url()}
                alt={`${project.title} — image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
