import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { getProject, getProjects } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

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
  const keywords = [
    project.category,
    project.location,
    "residential architecture",
    "Stoneage Properties project",
  ].filter((value): value is string => Boolean(value));

  return {
    title: project.title,
    description,
    keywords,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: `${project.title} | Stoneage Properties`,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Stoneage Properties`,
      description,
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
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 1. Header with Breadcrumb, Title & Project Details */}
      <section className="w-full border-b border-[#1C1B19]/10 px-3 pt-24 pb-12 sm:px-6 sm:pt-28 md:px-12 md:pb-16">
        <div className="mb-6">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-black/50 uppercase transition-colors hover:text-black"
          >
            <span className="font-mono transition-transform duration-300 group-hover:-translate-x-1">
              &larr;
            </span>
            <span>Back to Projects</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider text-black/50 uppercase">
              <span>{project.category}</span>
              <span>&middot;</span>
              <span>{project.location}</span>
            </div>

            <h1 className="text-xxl mb-6 leading-tight font-normal tracking-[-1.5px] text-black">
              {project.title}
            </h1>

            {project.summary && (
              <p className="text-lg leading-relaxed font-normal tracking-[-0.5px] text-black/75 sm:text-xl">
                {project.summary}
              </p>
            )}
          </div>

          {/* Project Details Card */}
          <div className="border border-[#1C1B19]/10 bg-white p-6 md:col-span-4">
            <div className="mb-4 flex items-center justify-between border-b border-[#1C1B19]/10 pb-3">
              <span className="font-mono text-[10px] tracking-widest text-black/50 uppercase">
                Project Details
              </span>
              <LogoSpinner size="w-3.5 h-3.5" className="text-black" />
            </div>
            <dl className="space-y-3 font-mono text-sm">
              <div>
                <dt className="text-xs tracking-widest text-black/50 uppercase">
                  Location
                </dt>
                <dd className="mt-1 text-black">{project.location}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-widest text-black/50 uppercase">
                  Category
                </dt>
                <dd className="mt-1 text-black">{project.category}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Framed Cover Image */}
      <section className="w-full px-3 py-8 sm:px-6 md:px-12">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5">
          <Image
            src={urlFor(project.image).width(2400).height(1350).url()}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      {/* 3. Editorial Body */}
      {Array.isArray(project.body) && project.body.length > 0 && (
        <section className="w-full border-b border-[#1C1B19]/10 px-3 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20">
          <div className="text-reg mx-auto max-w-3xl leading-relaxed text-black/85">
            <ArticleBody value={project.body} />
          </div>
        </section>
      )}

      {/* 4. Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="w-full border-b border-[#1C1B19]/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mb-12 border-b border-[#1C1B19]/10 pb-6">
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              Gallery
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {project.gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] w-full overflow-hidden bg-black/5"
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
        </section>
      )}

      {/* 5. More Projects Grid */}
      {moreProjects.length > 0 && (
        <section className="w-full border-b border-[#1C1B19]/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#1C1B19]/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
                More Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-2 text-base font-normal tracking-[-0.5px] text-black transition-opacity hover:opacity-70"
            >
              <span>View All Projects</span>
              <span className="font-mono">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {moreProjects.map((item) => (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                className="group block"
              >
                <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <Image
                    src={urlFor(item.image).width(800).height(600).url()}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-[#1C1B19]/10 pt-2.5">
                  <div className="mb-1 flex items-center justify-between font-mono text-xs tracking-wider text-black/50 uppercase">
                    <span>{item.location}</span>
                    <span className="font-mono text-sm transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="text-lg font-normal tracking-[-0.5px] text-black transition-opacity group-hover:opacity-70">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Standardized Project Brief Consultation */}
      <SpatialBriefSection />
    </div>
  );
}
