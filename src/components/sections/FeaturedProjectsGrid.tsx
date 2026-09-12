import Image from "next/image";
import Link from "next/link";
import { Paperclip } from "@/components/decorative/Paperclip";
import { StarIcon } from "@/components/decorative/StarIcon";

const PROJECTS = [
  {
    title: "Festal House Remodelling",
    location: "Knowle, Solihull",
    category: "Full Renovation & Remodelling",
    image: "/images/projects/project-1.webp",
    href: "/projects",
    aspect: "aspect-[4/3] md:aspect-[16/11]",
    colSpan: "md:col-span-8",
  },
  {
    title: "Meadow Contemporary Residence",
    location: "Rugby, Warwickshire",
    category: "New Build — JCT Contract & 10yr Warranty",
    image: "/images/projects/project-2.webp",
    href: "/projects",
    aspect: "aspect-[4/3] md:aspect-[16/10]",
    colSpan: "md:col-span-4",
  },
  {
    title: "Bracken Kitchen & Living Extension",
    location: "Solihull & London",
    category: "Single & Double Storey Extension",
    image: "/images/projects/project-3.jpg",
    href: "/projects",
    aspect: "aspect-[4/3] md:aspect-[16/10]",
    colSpan: "md:col-span-6",
  },
  {
    title: "Grange Change of Use Conversion",
    location: "Radcliffe on Trent, Nottingham",
    category: "Commercial to Residential Conversion",
    image: "/images/projects/project-4.webp",
    href: "/projects",
    aspect: "aspect-[4/3] md:aspect-[16/10]",
    colSpan: "md:col-span-6",
  },
];

export function FeaturedProjectsGrid() {
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
          {/* Project 1: Large Featured Card */}
          <div className="md:col-span-7">
            <Link
              href={PROJECTS[0].href}
              className="group relative block w-full"
            >
              <div className="bg-paper-dim border-line relative aspect-[16/11] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                <Image
                  src={PROJECTS[0].image}
                  alt={PROJECTS[0].title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Hover Badge */}
                <div className="bg-paper/95 text-ink absolute top-4 left-4 rounded px-3 py-1.5 font-mono text-xs tracking-wider uppercase opacity-0 shadow backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Explore Project &rarr;
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className="font-display text-ink group-hover:text-ink-muted text-xl font-medium transition-colors sm:text-2xl">
                    {PROJECTS[0].title}
                  </h3>
                  <p className="text-ink-subtle mt-1 font-mono text-xs">
                    {PROJECTS[0].category}
                  </p>
                </div>
                <span className="text-ink-muted font-mono text-xs">
                  {PROJECTS[0].location}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Column: Project 2 + Pinned Paper Note */}
          <div className="flex flex-col gap-12 md:col-span-5">
            {/* Project 2 */}
            <Link
              href={PROJECTS[1].href}
              className="group relative block w-full"
            >
              <div className="bg-paper-dim border-line relative aspect-[16/11] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                <Image
                  src={PROJECTS[1].image}
                  alt={PROJECTS[1].title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="bg-paper/95 text-ink absolute top-4 left-4 rounded px-3 py-1.5 font-mono text-xs tracking-wider uppercase opacity-0 shadow backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Explore Project &rarr;
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className="font-display text-ink group-hover:text-ink-muted text-xl font-medium transition-colors">
                    {PROJECTS[1].title}
                  </h3>
                  <p className="text-ink-subtle mt-1 font-mono text-xs">
                    {PROJECTS[1].category}
                  </p>
                </div>
                <span className="text-ink-muted font-mono text-xs">
                  {PROJECTS[1].location}
                </span>
              </div>
            </Link>

            {/* Signature Storey Design Element: "A NOTE FROM STONEAGE" Pinned Paper Card */}
            <div className="relative mt-4 ml-auto w-full max-w-sm rotate-1 transition-transform duration-500 hover:rotate-0">
              {/* Paperclip graphic pinned to the top left */}
              <div className="pointer-events-none absolute -top-7 left-6 z-20">
                <Paperclip className="h-auto w-10 drop-shadow-md" />
              </div>

              {/* Tactile Paper Card */}
              <div className="bg-paper-card border-line text-ink relative overflow-hidden rounded border p-6 shadow-md sm:p-8">
                {/* Header */}
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

                {/* Ruled lines with written thought */}
                <div className="notepad-lines font-display text-ink-muted py-2 text-base italic sm:text-lg">
                  <p className="mb-0 pl-1 leading-loose">
                    Calm homes, lasting craft.
                  </p>
                  <p className="text-ink-subtle pl-1 font-mono text-sm leading-loose not-italic">
                    30+ years delivering structural excellence across the UK.
                  </p>
                </div>

                {/* Footer Stamp */}
                <div className="border-line text-ink-subtle mt-6 flex items-center justify-between border-t pt-6 font-mono text-[9px] tracking-widest uppercase">
                  <span>ST / CTF</span>
                  <span>THANK YOU</span>
                  <span>STONEAGEPROPERTIES.COM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 Projects: Project 3 and Project 4 */}
          <div className="mt-8 md:col-span-6">
            <Link
              href={PROJECTS[2].href}
              className="group relative block w-full"
            >
              <div className="bg-paper-dim border-line relative aspect-[16/11] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                <Image
                  src={PROJECTS[2].image}
                  alt={PROJECTS[2].title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="bg-paper/95 text-ink absolute top-4 left-4 rounded px-3 py-1.5 font-mono text-xs tracking-wider uppercase opacity-0 shadow backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Explore Project &rarr;
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className="font-display text-ink group-hover:text-ink-muted text-xl font-medium transition-colors sm:text-2xl">
                    {PROJECTS[2].title}
                  </h3>
                  <p className="text-ink-subtle mt-1 font-mono text-xs">
                    {PROJECTS[2].category}
                  </p>
                </div>
                <span className="text-ink-muted font-mono text-xs">
                  {PROJECTS[2].location}
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-8 md:col-span-6">
            <Link
              href={PROJECTS[3].href}
              className="group relative block w-full"
            >
              <div className="bg-paper-dim border-line relative aspect-[16/11] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                <Image
                  src={PROJECTS[3].image}
                  alt={PROJECTS[3].title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="bg-paper/95 text-ink absolute top-4 left-4 rounded px-3 py-1.5 font-mono text-xs tracking-wider uppercase opacity-0 shadow backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Explore Project &rarr;
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className="font-display text-ink group-hover:text-ink-muted text-xl font-medium transition-colors sm:text-2xl">
                    {PROJECTS[3].title}
                  </h3>
                  <p className="text-ink-subtle mt-1 font-mono text-xs">
                    {PROJECTS[3].category}
                  </p>
                </div>
                <span className="text-ink-muted font-mono text-xs">
                  {PROJECTS[3].location}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
