import Image from "next/image";
import Link from "next/link";
import { Paperclip } from "@/components/decorative/Paperclip";
import { StarIcon } from "@/components/decorative/StarIcon";
import { getFeaturedProjects, getProjects, type Project } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

function ProjectCard({
  project,
  aspectClassName,
  titleClassName,
}: {
  project: Project;
  aspectClassName: string;
  titleClassName?: string;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group relative block w-full">
      <div
        className={`bg-paper-dim border-line relative w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md ${aspectClassName}`}
      >
        <Image
          src={urlFor(project.image).width(1200).height(825).url()}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="bg-paper/95 text-ink absolute top-4 left-4 rounded px-3 py-1.5 font-mono text-xs tracking-wider uppercase opacity-0 shadow backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          Explore Project &rarr;
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <h3
            className={`font-display text-ink group-hover:text-ink-muted font-medium transition-colors ${titleClassName ?? "text-xl sm:text-2xl"}`}
          >
            {project.title}
          </h3>
          <p className="text-ink-subtle mt-1 font-mono text-xs">
            {project.category}
          </p>
        </div>
        <span className="text-ink-muted font-mono text-xs">
          {project.location}
        </span>
      </div>
    </Link>
  );
}

export async function FeaturedProjectsGrid() {
  const featured = await getFeaturedProjects();
  const projects = featured.length >= 4 ? featured : await getProjects();
  const [first, second, third, fourth] = projects;

  return (
    <section
      id="work"
      className="bg-paper relative w-full overflow-hidden py-24 sm:py-36"
    >
      <div className="px-6 sm:px-12">
        {/* Section Title */}
        <div className="border-line mb-16 flex flex-col justify-between gap-4 border-b pb-8 sm:mb-20 sm:flex-row sm:items-end">
          <div>
            <span className="text-ink-subtle mb-3 block font-mono text-xs tracking-widest uppercase">
              Curated Portfolio
            </span>
            <h2 className="font-display text-ink text-3xl font-medium tracking-tight sm:text-5xl">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-ink hover:text-ink-muted font-mono text-xs tracking-widest uppercase underline underline-offset-8 transition-colors"
          >
            View All Projects &rarr;
          </Link>
        </div>

        {/* Staggered Editorial Grid */}
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 md:grid-cols-12">
          {first && (
            <div className="md:col-span-7">
              <ProjectCard project={first} aspectClassName="aspect-[16/11]" />
            </div>
          )}

          <div className="flex flex-col gap-12 md:col-span-5">
            {second && (
              <ProjectCard project={second} aspectClassName="aspect-[16/11]" />
            )}

            {/* Signature Storey Design Element: "A NOTE FROM STONEAGE" Pinned Paper Card */}
            <div className="relative mt-4 ml-auto w-full max-w-sm rotate-1 transition-transform duration-500 hover:rotate-0">
              <div className="pointer-events-none absolute -top-7 left-6 z-20">
                <Paperclip className="h-auto w-10 drop-shadow-md" />
              </div>

              <div className="bg-paper-card border-line text-ink relative overflow-hidden rounded border p-6 shadow-md sm:p-8">
                <div className="border-line mb-6 flex items-center justify-between border-b pb-4">
                  <span className="text-ink-subtle font-mono text-[10px] tracking-widest uppercase">
                    A NOTE FROM STONEAGE
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs font-medium">
                      Stoneage
                    </span>
                    <StarIcon size="w-3.5 h-3.5" className="text-ink" />
                  </div>
                </div>

                <div className="notepad-lines font-display text-ink-muted py-2 text-base italic sm:text-lg">
                  <p className="mb-0 pl-1 leading-loose">
                    Calm homes, lasting craft.
                  </p>
                  <p className="text-ink-subtle pl-1 font-mono text-sm leading-loose not-italic">
                    30+ years delivering structural excellence across the UK.
                  </p>
                </div>

                <div className="border-line text-ink-subtle mt-6 flex items-center justify-between border-t pt-6 font-mono text-[9px] tracking-widest uppercase">
                  <span>ST / CTF</span>
                  <span>THANK YOU</span>
                  <span>STONEAGEPROPERTIES.COM</span>
                </div>
              </div>
            </div>
          </div>

          {third && (
            <div className="mt-8 md:col-span-6">
              <ProjectCard project={third} aspectClassName="aspect-[16/11]" />
            </div>
          )}

          {fourth && (
            <div className="mt-8 md:col-span-6">
              <ProjectCard project={fourth} aspectClassName="aspect-[16/11]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
