import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedProjects,
  getProjects,
  type Project,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Alternate aspect ratios and black-and-white contrast treatments for editorial rhythm
  const isPortrait = index % 3 === 1;
  const isMonochrome = index % 2 === 1;

  return (
    <Link href={`/projects/${project.slug}`} className="group block w-full">
      <div
        className={`relative mb-4 w-full overflow-hidden bg-black/5 ${
          isPortrait ? "aspect-[4/5]" : "aspect-[16/11]"
        }`}
      >
        <Image
          src={urlFor(project.image)
            .width(1200)
            .height(isPortrait ? 1500 : 825)
            .url()}
          alt={project.title}
          fill
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isMonochrome ? "contrast-115 grayscale group-hover:grayscale-0" : ""
          }`}
        />
      </div>
      <div className="flex items-baseline justify-between border-t border-black/10 pt-3">
        <div>
          <h3 className="text-xl font-normal tracking-[-1px] text-black transition-opacity group-hover:opacity-75 sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-xs tracking-wider text-black/50 uppercase">
            {project.category}
          </p>
        </div>
        <span className="font-mono text-sm font-normal tracking-[-0.5px] text-black transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </div>
    </Link>
  );
}

export async function FeaturedProjectsGrid() {
  const featured = await getFeaturedProjects();
  const projects = featured.length >= 4 ? featured : await getProjects();

  return (
    <section
      id="work"
      className="w-full border-t border-[#1C1B19]/10 bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
    >
      <div className="w-full">
        {/* Fabric Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              Selected Projects
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

        {/* 2-Column Fabric Grid */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
          {projects.slice(0, 4).map((proj, idx) => (
            <ProjectCard key={proj.slug} project={proj} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
