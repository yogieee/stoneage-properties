import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Build | Specialist Construction & Delivery",
  description:
    "Discover how build works with Stoneage Properties. Our master construction team provides complete control of the technical and construction stages from our Solihull HQ, London, and Nottingham.",
  alternates: { canonical: "/build" },
  openGraph: {
    title: "Build | Stoneage Properties",
    description:
      "Specialist residential construction, master craftsmanship, and seamless project delivery across the UK.",
    url: "/build",
  },
};

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      {/* 1. Hero matching exact landing page framing & dimensions */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
          {/* Framed Image Holder */}
          <div className="relative h-full w-full overflow-hidden bg-black">
            <Image
              src="/images/hero/build-hero.png"
              alt="Stoneage Specialist Residential Build"
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
          </div>

          {/* Fabric Overview Bar (height: 72px, border-b) */}
          <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center justify-between gap-3 border-b border-black/10">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <h2 className="text-base font-normal tracking-[-1px] text-black sm:text-2xl">
                Specialist Build &amp; Delivery
              </h2>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-BUILD
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Build (Fabric layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h1 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Build
            </h1>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p>
              Our highly skilled construction team operates with complete
              mastery and technical precision, providing our clients with
              surety, transparency, and comfort in working with the very best
              industry specialists. Our in-house construction expertise covers
              all disciplines required for complex residential developments.
            </p>
            <p>
              We further strengthen the services we offer by utilising an
              extensive, vetted network of tried and tested specialist
              consultants, structural engineers, and artisanal craftsmen.
            </p>
            <p>
              We manage and take complete control of your project&apos;s
              technical and construction stages, allowing you to invest your
              time in the enjoyable design and spatial process whilst ensuring
              an uncompromising quality of finish and structural longevity.
            </p>
            <p className="font-medium text-black">
              Stoneage offers extensive, turnkey construction services on prime
              residential new builds, major structural transformations, and
              historic renovations.
            </p>
          </div>
        </div>

        {/* Asymmetrical Construction Editorial Gallery */}
        <div className="mt-16 grid grid-cols-1 items-end gap-6 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5 sm:col-span-4">
            <Image
              src="/images/hero/build-stone-masonry.png"
              alt="Stone Masonry & Structural Framing"
              fill
              className="object-cover contrast-110 grayscale transition-transform duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 sm:col-span-5">
            <Image
              src="/images/hero/build-timber-detail.png"
              alt="Craftsmanship & Timber Detailing"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 sm:col-span-3">
            <Image
              src="/images/hero/build-site-execution.png"
              alt="Site Execution"
              fill
              className="object-cover contrast-110 grayscale transition-transform duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
        </div>
      </section>

      {/* 3. Section: Delivery (Fabric layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Delivery
            </h2>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p>
              Delivery, to us, means every step of the way exceeding
              expectations, creating beautiful, faultless, comforting homes
              and spaces for our clients to live in and enjoy for
              generations.
            </p>
            <p>
              The difference between something good and great is obsessive
              attention to detail. To create something exceptional we focus
              relentlessly on the detail, tolerances, and execution of every
              joint, surface, and material junction.
            </p>
            <p className="pt-2 font-normal text-black">
              Stoneage&apos;s unique collaboration of like-minded architects and
              master construction experts provides a single point of
              accountability throughout the whole journey.
            </p>
            <p className="font-mono text-sm tracking-wider text-black uppercase">
              We Design &middot; We Build &middot; We Deliver.
            </p>
          </div>
        </div>

        {/* Asymmetrical Delivery Editorial Gallery */}
        <div className="mt-16 grid grid-cols-1 items-start gap-6 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 sm:col-span-7">
            <Image
              src="/images/hero/oldtonew.png"
              alt="Completed Architectural Renovation"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5 sm:col-span-5">
            <Image
              src="/images/hero/build-delivery-interior.png"
              alt="Refined Interior Delivery"
              fill
              className="object-cover contrast-105 grayscale transition-transform duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
        </div>
      </section>

      {/* 4. Quick Links Grid (Projects, Design, Studio, Journal) matching Fabric */}
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

          <Link href="/ourstudio" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/studio-hero.png"
                alt="Studio"
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

      {/* 5. Direct Spatial Brief Intake Form */}
      <SpatialBriefSection />
    </div>
  );
}
