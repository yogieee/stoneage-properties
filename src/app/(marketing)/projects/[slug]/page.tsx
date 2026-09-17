import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { getProject, getProjects } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/seo";

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

  const description =
    project.summary || `${project.category} project in ${project.location} by Stoneage Properties.`;
  const images = project.image
    ? [urlFor(project.image).width(1200).height(630).url()]
    : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | Stoneage Properties`,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Stoneage Properties`,
      description,
      images,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProject(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const moreProjects = allProjects
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Projects", item: `${SITE_URL}/projects` },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: `${SITE_URL}/projects/${project.slug}`,
      },
    ],
  };

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    about: project.category,
    locationCreated: project.location,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: project.image ? urlFor(project.image).width(1200).height(630).url() : undefined,
    creator: { "@type": "Organization", name: "Stoneage Properties", url: SITE_URL },
  };

  return (
    <div className="pt-16 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="px-6 pt-8 sm:px-12">
        <Link
          href="/projects"
          className="group text-ink-subtle hover:text-ink inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Projects
        </Link>
      </div>

      {/* Header */}
      <div className="px-6 pt-8 pb-16 sm:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-ink-subtle mb-4 block font-mono text-xs tracking-widest uppercase">
              {project.category}
            </span>
            <Typography variant="display-lg" as="h1">
              {project.title}
            </Typography>
          </div>

          <dl className="border-line shrink-0 gap-x-8 gap-y-3 border-t pt-4 font-mono text-sm sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
            <div className="flex justify-between gap-6 sm:block">
              <dt className="text-ink-subtle text-xs tracking-widest uppercase">
                Location
              </dt>
              <dd className="text-ink mt-1">{project.location}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cover image */}
      <div className="px-6 sm:px-12">
        <div className="border-line bg-paper-dim relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-xl border shadow-md sm:aspect-[16/9]">
          <Image
            src={urlFor(project.image).width(2000).height(1125).url()}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-12 sm:py-24">
        {project.summary && (
          <Typography variant="body-lg" className="mb-10">
            {project.summary}
          </Typography>
        )}

        {Array.isArray(project.body) && project.body.length > 0 && (
          <ArticleBody value={project.body} />
        )}
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="px-6 pb-24 sm:px-12">
          <div className="mx-auto max-w-5xl">
            <span className="text-ink-subtle mb-8 block font-mono text-xs tracking-widest uppercase">
              Gallery
            </span>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.gallery.map((image, index) => (
                <div
                  key={index}
                  className="border-line relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-sm"
                >
                  <Image
                    src={urlFor(image).width(1200).height(900).url()}
                    alt={`${project.title} — image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More projects */}
      {moreProjects.length > 0 && (
        <section className="border-line bg-paper-dim border-t px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex items-end justify-between gap-4">
              <Typography variant="display-sm" as="h2">
                More Projects
              </Typography>
              <Link
                href="/projects"
                className="group text-ink-muted hover:text-ink hidden shrink-0 items-center gap-2 font-mono text-xs tracking-wider uppercase transition-colors sm:inline-flex"
              >
                View All
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {moreProjects.map((item) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  className="group block"
                >
                  <div className="border-line bg-paper-card relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                    <Image
                      src={urlFor(item.image).width(700).height(525).url()}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-ink-subtle mb-1 block font-mono text-[10px] uppercase">
                        {item.location}
                      </span>
                      <h3 className="font-display text-ink group-hover:text-ink-muted text-lg leading-snug font-medium transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <LogoSpinner
                      spin="hover"
                      size="h-4 w-4"
                      className="text-ink-subtle mt-1 shrink-0 group-hover:text-ink"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SpatialBriefSection />
    </div>
  );
}
