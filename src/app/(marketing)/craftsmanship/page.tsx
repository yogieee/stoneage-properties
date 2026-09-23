import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description:
    "Specialist building and master craftsmanship at Stoneage Properties. Discover the artisans, materials, and hands-on execution behind our private residential sanctuaries.",
  alternates: { canonical: "/craftsmanship" },
  openGraph: {
    title: "Craftsmanship | Stoneage Properties",
    description:
      "Specialist building and master craftsmanship shaping private residential sanctuaries.",
    url: "/craftsmanship",
  },
};

const PRINCIPLES = [
  {
    num: "01",
    title: "Material Permanence",
    description:
      "We build with authentic, tactile materials that age with grace: quarried British limestone, hand-formed brick, patinated bronze, and structural English oak. We reject superficial cladding in favour of tectonic truth.",
    image: "/images/hero/design-principle-material.png",
  },
  {
    num: "02",
    title: "Artisan Detailing",
    description:
      "Bespoke joinery, dressed stone, and hand-finished ironmongery are resolved on the bench by trusted artisans before a single piece reaches site, so every junction is considered long before it is fixed in place.",
    image: "/images/hero/build-timber-detail.png",
  },
  {
    num: "03",
    title: "Structural Mastery",
    description:
      "Load-bearing masonry, complex roof geometries, and heritage repair are executed by specialist trades who understand how a building actually stands, not just how it is drawn.",
    image: "/images/hero/build-stone-masonry.png",
  },
  {
    num: "04",
    title: "On-Site Stewardship",
    description:
      "Our master craftsmen remain on site from first fix to final polish, holding tolerances that drawings alone cannot guarantee and safeguarding the integrity of every finish through handover.",
    image: "/images/hero/build-site-execution.png",
  },
];

const CRAFT_STAGES = [
  {
    stage: "Sourcing",
    title: "Material Selection & Provenance",
    detail:
      "Quarry visits, timber selection, and sample panels ensure every material is proven for durability, patina, and character before it is committed to the build.",
  },
  {
    stage: "Fabrication",
    title: "Bespoke Joinery & Stonework",
    detail:
      "Dressed stone, structural oak frames, and fitted joinery are hand-fabricated off site to fine tolerances, tested and refined before installation begins.",
  },
  {
    stage: "Execution",
    title: "On-Site Mastery",
    detail:
      "Specialist masons, carpenters, and roofers work under continuous supervision from our building team, holding the exacting standard our clients expect.",
  },
  {
    stage: "Finishing",
    title: "Detail, Polish & Handover",
    detail:
      "Final fixings, surface finishes, and snagging are resolved by hand, with every junction inspected before a home is ready to be lived in.",
  },
];

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      {/* 1. Hero matching exact landing page framing & dimensions */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
          {/* Framed Image Holder */}
          <div className="relative h-full w-full overflow-hidden bg-black">
            <Image
              src="/images/hero/build-stone-masonry.png"
              alt="Stoneage Specialist Building & Master Craftsmanship"
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
          </div>

          {/* Overview Bar (height: 72px, border-b) */}
          <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center justify-between gap-3 border-b border-black/10">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <h2 className="text-base font-normal tracking-[-1px] text-black sm:text-2xl">
                Specialist Building &amp; Master Craftsmanship
              </h2>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-CRAFT
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Craftsmanship Narrative (Fabric layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h1 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Craftsmanship
            </h1>
            <div className="mt-4 font-mono text-xs tracking-wider text-black/50 uppercase">
              Materials &middot; Trades &middot; Execution
            </div>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p className="text-lg font-medium tracking-[-0.5px] text-black sm:text-xl">
              Our specialist building team consists of master masons,
              carpenters, and artisans who shape private residential
              sanctuaries with their hands, not just their drawings.
            </p>
            <p>
              Many of our clients arrive through an architect who has already
              resolved the design. Our role begins where the drawing ends:
              turning a scheme into a physically enduring home through
              specialist trades, honest materials, and obsessive attention to
              detail.
            </p>
            <p>
              We work in quarried British limestone, hand-formed brick,
              structural English oak, and patinated bronze &mdash; materials
              selected for how they age, not just how they render. Every
              stone is dressed, every joint is fitted, and every finish is
              inspected by hand before it is signed off.
            </p>
            <p>
              We provide a passionate, sensitive, and responsive approach to
              every project, working closely with clients, architects, and
              conservation officers to deliver a standard of craft that
              outlasts trend. Our goal is to build quiet, enduring spaces
              that feel inevitable.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Craft Gallery */}
        <div className="mt-16 grid grid-cols-1 items-end gap-6 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5 sm:col-span-4">
            <Image
              src="/images/hero/barn.png"
              alt="Specialist Structural Craftsmanship"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 sm:col-span-5">
            <Image
              src="/images/hero/rennovation.png"
              alt="Master Craftsmanship & Material Detailing"
              fill
              className="object-cover contrast-110 grayscale transition-transform duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 sm:col-span-3">
            <Image
              src="/images/hero/build-timber-detail.png"
              alt="Bespoke Joinery & Timber Craft"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 3. Section: Craft Principles (4-Column Architectural Pillars) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="mb-12 border-b border-black/10 pb-6">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Craft Principles
          </h2>
          <p className="text-reg mt-2 text-black/70">
            The core building fundamentals that guide every Stoneage
            commission
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle) => (
            <div key={principle.num} className="flex flex-col">
              <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden bg-black/5">
                <Image
                  src={principle.image}
                  alt={principle.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <span className="text-xxl mb-2 leading-none font-normal tracking-[-1.5px] text-black">
                {principle.num}
              </span>
              <h3 className="font-display mb-2 text-base font-medium text-black">
                {principle.title}
              </h3>
              <p className="text-xs leading-relaxed font-light text-black/70">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section: Craft Process (layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Craft Process
            </h2>
            <p className="mt-3 max-w-xs text-sm text-black/60">
              From quarry and workshop to site and handover, every stage is
              held to the same standard of hand-finished precision.
            </p>
          </div>

          <div className="space-y-6 md:col-span-8">
            {CRAFT_STAGES.map((item) => (
              <div
                key={item.stage}
                className="flex flex-col justify-between gap-4 border-t border-black/10 pt-4 sm:flex-row sm:items-baseline"
              >
                <div className="sm:w-1/3">
                  <span className="mb-1 block font-mono text-xs tracking-wider text-black/50 uppercase">
                    {item.stage}
                  </span>
                  <h3 className="text-lg font-medium text-black">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed font-light text-black/70 sm:w-2/3">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section: Explore Navigation */}
      <section className="w-full px-3 py-16 sm:px-6 md:px-12 md:py-20">
        <div className="mb-10 flex items-baseline justify-between border-b border-black/10 pb-4">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Explore
          </h2>
          <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
            Navigation &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/projects" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/projects-panel.png"
                alt="Projects"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Projects
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/build" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/build-hero.png"
                alt="Build & Delivery"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Build
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/ourstudio" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/studio-hero.png"
                alt="Our Studio"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Studio
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/journal" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/loft.png"
                alt="Journal"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Journal
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Standardized Project Brief Consultation */}
      <SpatialBriefSection />
    </div>
  );
}
