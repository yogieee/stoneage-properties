import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@/components/decorative/StarIcon";

const ARTICLES = [
  {
    title: "Designing for Long-Term Living Rather Than Trends",
    image: "/images/livingroom.png",
    aspect: "aspect-[4/3] sm:aspect-square",
    href: "/projects",
  },
  {
    title: "The Role of Material Honesty in Residential Architecture",
    image: "/images/staircase.png",
    aspect: "aspect-[4/3] sm:aspect-[16/12]",
    href: "/projects",
  },
  {
    title: "Balancing Openness, Privacy, and Everyday Comfort",
    image: "/images/plan.png",
    aspect: "aspect-[4/3] sm:aspect-[16/12]",
    href: "/projects",
  },
  {
    title: "Creating a Stronger Connection Between Home and Landscape",
    image: "/images/garden.png",
    aspect: "aspect-[4/3] sm:aspect-[12/14]",
    href: "/projects",
  },
];

export function JournalGrid() {
  return (
    <section
      id="journal"
      className="bg-paper relative w-full overflow-hidden py-24 sm:py-36"
    >
      <div className="px-6 sm:px-12">
        {/* Section Header */}
        <div className="border-line relative flex flex-col justify-between gap-8 border-b pb-16 sm:pb-20 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-ink-subtle mb-3 block font-mono text-xs tracking-widest uppercase">
              Research & Process
            </span>
            <h2 className="font-display text-ink mb-6 text-3xl font-medium tracking-tight sm:text-5xl">
              Spaces Shaped Through Intention
            </h2>
            <p className="font-body text-ink-muted text-base leading-relaxed sm:text-lg">
              Thoughts, technical process studies, and construction case studies
              exploring how contemporary building can create calmer, more
              durable living environments through material honesty and
              structural restraint.
            </p>
          </div>

          {/* Action Accent */}
          <div className="relative flex flex-col gap-6 sm:items-end">
            <Link
              href="/projects"
              className="group bg-charcoal text-paper hover:bg-ink inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-xs tracking-wider uppercase shadow-sm transition-all duration-300 hover:shadow"
            >
              <span>View Posts</span>
              <StarIcon className="text-paper h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90" />
            </Link>
          </div>
        </div>

        {/* 4-Card Editorial Study Grid */}
        <div className="grid grid-cols-1 gap-10 pt-16 sm:gap-16 md:grid-cols-2">
          {ARTICLES.map((article, index) => (
            <div key={article.title} className="group">
              <Link href={article.href} className="block w-full">
                <div
                  className={`relative w-full ${article.aspect} bg-paper-dim border-line overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md`}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Hover Read Badge */}
                  <div className="bg-paper/95 text-ink absolute top-4 left-4 rounded px-3 py-1.5 font-mono text-xs tracking-wider uppercase opacity-0 shadow backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    Read Case Study &rarr;
                  </div>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-ink-subtle mb-1 block font-mono text-[10px] uppercase">
                      Case Study &middot; 0{index + 1}
                    </span>
                    <h3 className="font-display text-ink group-hover:text-ink-muted text-xl leading-snug font-medium transition-colors sm:text-2xl">
                      {article.title}
                    </h3>
                  </div>

                  <span className="group bg-paper-dim border-line text-ink group-hover:bg-charcoal group-hover:text-paper group-hover:border-charcoal inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase transition-all">
                    <span>Read</span>
                    <StarIcon className="h-3 w-3 transition-transform duration-500 group-hover:rotate-90" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
