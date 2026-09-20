import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Design | Architectural Principles & Discipline",
  description:
    "Discover how architectural design works at Stoneage Properties. Exploring our spatial discipline, RIBA stages, 3D modelling, and bespoke residential design principles.",
  alternates: { canonical: "/design" },
  openGraph: {
    title: "Design | Stoneage Properties",
    description:
      "Architectural design discipline, principles, RIBA stages, and craft at Stoneage Properties.",
    url: "/design",
  },
};

const PRINCIPLES = [
  {
    num: "01",
    title: "Context & Topography",
    description:
      "Architecture must belong to its earth. Every scheme commences with deep analysis of orientation, solar paths, prevailing winds, and native masonry traditions, ensuring the finished form is rooted symbiotically within its landscape.",
    image: "/images/hero/design-principle-context.png",
  },
  {
    num: "02",
    title: "Material Permanence",
    description:
      "We build with authentic, tactile materials that age with grace: quarried British limestone, hand-formed brick, patinated bronze, and structural English oak. We reject superficial cladding in favour of tectonic truth.",
    image: "/images/hero/design-principle-material.png",
  },
  {
    num: "03",
    title: "Spatial Calm & Light",
    description:
      "Luxury is defined by generous proportions, unhurried circulation, and dramatic daylight. We choreograph sightlines and lightwells to create interiors that breathe serenity, stillness, and comfort.",
    image: "/images/hero/design-principle-light.png",
  },
  {
    num: "04",
    title: "Technical Rigour & BIM",
    description:
      "Every project is drafted and resolved in full 3D Building Information Modelling (BIM) using Revit. Millimetric precision in drawings removes site ambiguities and safeguards design integrity from the first sketch.",
    image: "/images/hero/design-principle-bim.png",
  },
];

const RIBA_STAGES = [
  {
    stage: "Stages 0–1",
    title: "Strategic Definition & Brief",
    detail:
      "Site appraisal, spatial feasibility studies, client lifestyle mapping, and planning risk assessment.",
  },
  {
    stage: "Stages 2–3",
    title: "Concept & Developed Design",
    detail:
      "3D visualisations, physical maquettes, material palettes, and formal submission for Local Planning Authority consent.",
  },
  {
    stage: "Stage 4",
    title: "Technical & Construction Design",
    detail:
      "Full structural coordination, building regulations sign-off, bespoke joinery specifications, and procurement schedules.",
  },
  {
    stage: "Stages 5–7",
    title: "On-Site Architectural Oversight",
    detail:
      "Continuous architectural stewardship alongside our master builders, ensuring exact fidelity to drawings through handover.",
  },
];

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      {/* 1. Hero matching exact landing page framing & dimensions */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
          {/* Framed Image Holder */}
          <div className="relative h-full w-full overflow-hidden bg-black">
            <Image
              src="/images/hero/design-hero.png"
              alt="Stoneage Architectural Design & Spatial Planning"
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
                Architectural Design &amp; Discipline
              </h2>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-DESIGN
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Design Narrative (Fabric layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h1 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Design
            </h1>
            <div className="mt-4 font-mono text-xs tracking-wider text-black/50 uppercase">
              Discipline &middot; Philosophy &middot; RIBA 0–7
            </div>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p className="text-lg font-medium tracking-[-0.5px] text-black sm:text-xl">
              Our in-house architectural team consists of innovative chartered
              architects, spatial designers, and visualisers who collaborate to
              think beyond the obvious.
            </p>
            <p>
              Our speciality lies within bespoke residential schemes, modern
              country estates, sensitive heritage transformations, and
              structural extensions. We believe that architecture is never just
              a drawing service: high-calibre design drives every element of our
              practice.
            </p>
            <p>
              Stoneage provides an extensive architectural service across RIBA
              work stages 0–7, spanning hand-drafted concept sketches,
              photorealistic 3D visualisations, physical study models, and full
              BIM construction documentation. We resolve drawings using
              industry-standard Revit, allowing seamless coordination with
              structural engineers and our master builders from the very outset.
            </p>
            <p>
              We provide a passionate, sensitive, and responsive approach to
              every project, working closely with clients, conservation
              officers, planning authorities, and our on-site construction
              teams. Our goal is to craft engaging, quiet spaces that excite and
              inspire.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Design Gallery */}
        <div className="mt-16 grid grid-cols-1 items-end gap-6 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5 sm:col-span-4">
            <Image
              src="/images/hero/barn.png"
              alt="Design Concept & Structural Study"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 sm:col-span-5">
            <Image
              src="/images/hero/rennovation.png"
              alt="Architectural Detailing & Materials"
              fill
              className="object-cover contrast-110 grayscale transition-transform duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 sm:col-span-3">
            <Image
              src="/images/hero/design-gallery-loft.png"
              alt="Interior Volume & Daylight"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 3. Section: Discipline Principles (4-Column Architectural Pillars) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="mb-12 border-b border-black/10 pb-6">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Discipline Principles
          </h2>
          <p className="text-reg mt-2 text-black/70">
            The core architectural fundamentals that guide every Stoneage
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

      {/* 4. Section: RIBA Work Stages (layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              RIBA Stages
            </h2>
            <p className="mt-3 max-w-xs text-sm text-black/60">
              Structured architectural delivery through internationally
              accredited RIBA Work Stages 0–7.
            </p>
          </div>

          <div className="space-y-6 md:col-span-8">
            {RIBA_STAGES.map((item) => (
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

      {/* 6. Standardized Spatial Brief Consultation */}
      <SpatialBriefSection />
    </div>
  );
}
