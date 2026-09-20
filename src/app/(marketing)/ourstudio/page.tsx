import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Our Studio",
  description:
    "Explore Stoneage Properties' design and build studio. Rooted in Solihull with studios in London and Nottingham, we unite RIBA-chartered architects and master building contractors.",
  alternates: { canonical: "/ourstudio" },
  openGraph: {
    title: "Our Studio | Stoneage Properties",
    description:
      "Our practice, ethos, design & build assurance, turnkey delivery process, and people.",
    url: "/ourstudio",
  },
};

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Initial Appraisal",
    description:
      "Understanding your spatial needs, lifestyle aspirations, and site parameters, advising how the architectural brief can best unlock the potential of your property.",
    image: "/images/hero/studio-process-appraisal.png",
  },
  {
    num: "02",
    title: "Design Stage",
    description:
      "Developing vision into evocative 3D visualisations, physical models, and drafted architectural packages through full RIBA Work Stages 0–4 with local planning consent.",
    image: "/images/hero/studio-process-design.png",
  },
  {
    num: "03",
    title: "Procurement",
    description:
      "Formulating an exhaustive technical specification covering artisanal stone, timber, fixtures, and finishes to provide guaranteed certainty on programme and fixed budget.",
    image: "/images/hero/studio-process-procurement.png",
  },
  {
    num: "04",
    title: "Build",
    description:
      "Our dedicated master builders, masons, and site directors execute the technical build with surgical precision, keeping you informed via weekly milestone briefings.",
    image: "/images/hero/studio-process-build.png",
  },
  {
    num: "05",
    title: "Post-Construction",
    description:
      "Full handover, comprehensive structural warranties, and ongoing care to ensure your sanctuary performs with enduring ease for decades to come.",
    image: "/images/hero/studio-process-handover.png",
  },
];

const ASSURANCE_ITEMS = [
  {
    title: "Time",
    description:
      "Overlapping design, engineering, and procurement eliminates the downtime of separate contractor tendering, keeping projects moving without the usual handover delays.",
  },
  {
    title: "Collaboration",
    description:
      "Architects and craftsmen sit together at the same bench. Ideas flow directly into constructability without translation loss.",
  },
  {
    title: "Quality",
    description:
      "Single-point stewardship from sketch to stonework ensures detailing is executed to museum-grade standards and tight tolerances.",
  },
  {
    title: "Cost",
    description:
      "Transparent commercial estimating from day one eliminates sudden contractor variations and surprise cost overruns.",
  },
  {
    title: "Ease",
    description:
      "One accountable partner managing planning authorities, building control, structural engineers, and site trades.",
  },
  {
    title: "Heritage",
    description:
      "Our team brings over 30 years of combined craftsmanship experience across Solihull, London, and the English shires, with an unblemished reputation.",
  },
];

export default function OurStudioPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      {/* 1. Hero matching exact landing page framing & dimensions */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
          {/* Framed Image Holder */}
          <div className="relative h-full w-full overflow-hidden bg-black">
            {/* Video is over-scaled in height and anchored to the top so the
                container clips the bottom edge (watermark). */}
            <video
              src="/images/hero/Studio-Scene.mp4"
              poster="/images/hero/studio-hero.png"
              aria-label="Stoneage Architectural Studio"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute top-0 left-0 h-[112%] w-full object-cover opacity-90"
            />
          </div>

          {/* Overview Bar (height: 72px, border-b) */}
          <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center justify-between gap-3 border-b border-black/10">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <h2 className="text-base font-normal tracking-[-1px] text-black sm:text-2xl">
                The Studio &amp; Practice
              </h2>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-STUDIO
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: The Studio / Ethos (layout-2-4) */}
      <section
        id="ethos"
        className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h1 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              The Studio
            </h1>
            <div className="mt-4 font-mono text-xs tracking-wider text-black/50 uppercase">
              Ethos &middot; Heritage &middot; Vision
            </div>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p className="text-lg font-medium tracking-[-0.5px] text-black sm:text-xl">
              Conceive. Engineer. Craft.
            </p>
            <p>
              Stoneage Properties is a boutique collective of chartered
              architects, interior designers, structural engineers, and master
              construction artisans. Operating from our Solihull headquarters
              with project studios in London and Nottingham, we shape buildings
              rooted in permanence, spatial quiet, and natural light.
            </p>
            <p>
              We purposefully operate as a close-knit practice. Our boutique
              scale sustains our ethos: every client receives direct,
              senior-director stewardship, and every drawing, material junction,
              and joint receives uncompromising attention.
            </p>
            <p>
              Architects and builders working separately is where most projects
              lose their way — decisions made on a drawing board get
              reinterpreted, or quietly dropped, once they reach a site. Under
              one roof, that gap doesn&apos;t exist: the people who conceived
              the design are the same people accountable for how it&apos;s
              built.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Studio Gallery */}
        <div className="mt-16 grid grid-cols-1 items-end gap-6 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5 sm:col-span-5">
            <Image
              src="/images/hero/studio-ethos-drawing.png"
              alt="Studio Drawing Table & Craft"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 sm:col-span-7">
            <Image
              src="/images/hero/studio-ethos-collab.png"
              alt="Stoneage Architectural Site Study"
              fill
              className="object-cover contrast-110 grayscale transition-transform duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
        </div>
      </section>

      {/* 3. Section: Approach (layout-2-4) */}
      <section
        id="approach"
        className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Approach
            </h2>
            <p className="mt-3 max-w-xs text-sm text-black/60">
              A holistic architecture &amp; construction methodology built on
              certainty.
            </p>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p>
              We aspire for recognition as the premier residential design and
              build practice across the West Midlands, the Cotswolds, and
              London. Whatever the brief—whether a generational new build
              estate, a sensitive listed barn conversion, or a monolithic
              structural extension—we never offer a mere drawing service.
            </p>
            <p>
              High-quality design drives every physical execution. We understand
              that undertaking a significant architectural project can feel
              daunting; through our unified approach, we shoulder complete
              technical responsibility and on-site governance.
            </p>
            <p>
              Early integration of structural engineering with architectural
              concept removes the risk of the completed building departing from
              the original aesthetic intent. See our{" "}
              <Link href="/ourstudio#process" className="fabric-underline">
                turnkey process
              </Link>{" "}
              below for how that plays out stage by stage.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Section: Assurance (Grid 3-col matching Fabric layout-3) */}
      <section
        id="assurance"
        className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24"
      >
        <div className="mb-12 border-b border-black/10 pb-6">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Assurance
          </h2>
          <p className="text-reg mt-2 text-black/70">
            The advantages of the unified Stoneage Design &amp; Build philosophy
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ASSURANCE_ITEMS.map((item) => (
            <div key={item.title} className="border-t border-black/10 pt-4">
              <h3 className="font-display mb-2 text-xl font-medium tracking-tight text-black">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed font-light text-black/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section: Turnkey Process (01 - 05 Grid matching Fabric) */}
      <section
        id="process"
        className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24"
      >
        <div className="mb-12 border-b border-black/10 pb-6">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Process
          </h2>
          <p className="text-reg mt-2 text-black/70">
            Elements of Turnkey Architectural Delivery
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="flex flex-col">
              <div className="relative mb-4 aspect-square w-full overflow-hidden bg-black/5">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <span className="text-xxl mb-2 leading-none font-normal tracking-[-1.5px] text-black">
                {step.num}
              </span>
              <h3 className="font-display mb-2 text-base font-medium text-black">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed font-light text-black/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Explore Navigation Bar */}
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

          <Link href="/design" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/design-hero.png"
                alt="Design & Capabilities"
                fill
                className="object-cover contrast-110 grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Design
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

      {/* 8. Integrated Spatial Brief */}
      <SpatialBriefSection />
    </div>
  );
}
