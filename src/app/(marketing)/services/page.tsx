import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Services & Capabilities | Architecture & Specialist Construction",
  description:
    "Comprehensive architectural design, bespoke new builds, structural renovations, and master construction services delivered by Stoneage Properties across Solihull, London, and Nottingham.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Capabilities | Stoneage Properties",
    description:
      "Architectural design, bespoke new builds, renovations, structural extensions, and full turnkey construction.",
    url: "/services",
  },
};

export default async function ServicesIndexPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      {/* 1. Hero matching exact landing page, build & design framing */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
          {/* Framed Image Holder */}
          <div className="relative h-full w-full overflow-hidden bg-black">
            <Image
              src="/images/hero/services-hero.png"
              alt="Stoneage Services & Capabilities"
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
                Services &amp; Capabilities
              </h2>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-SERVICES
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Overview Narrative (Fabric layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h1 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Capabilities
            </h1>
            <div className="mt-4 font-mono text-xs tracking-wider text-black/50 uppercase">
              End-to-End Architectural Delivery
            </div>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p className="text-lg font-medium tracking-[-0.5px] text-black sm:text-xl">
              Turnkey architectural solutions bridging concept, planning, and
              master craft.
            </p>
            <p>
              From project inception through architectural design, structural
              engineering, planning consent, and bespoke on-site construction,
              Stoneage provides complete, transparent building solutions for
              discerning homeowners and private estates.
            </p>
            <p>
              Whether conceiving a private residential new build, revitalising a
              protected heritage estate, or executing a complex structural
              extension, our integrated practice provides single-point
              accountability and peerless craftsmanship across every discipline.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section: Curated Services Grid (Fabric 2-Column Grid) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="mb-12 border-b border-black/10 pb-6">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Our Specialisms
          </h2>
          <p className="text-reg mt-2 text-black/70">
            Dedicated architectural disciplines delivered across the West
            Midlands, Cotswolds, and London
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {services.map((service, index) => {
            const isPortrait = index % 3 === 1;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group block w-full"
              >
                <div
                  className={`relative mb-4 w-full overflow-hidden bg-black/5 ${
                    isPortrait ? "aspect-[4/5]" : "aspect-[16/10]"
                  }`}
                >
                  {service.heroImage ? (
                    <Image
                      src={urlFor(service.heroImage)
                        .width(1200)
                        .height(isPortrait ? 1500 : 750)
                        .url()}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-black/5" />
                  )}
                </div>
                <div className="border-t border-black/10 pt-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-normal tracking-[-1px] text-black transition-opacity group-hover:opacity-75 sm:text-2xl">
                      {service.name}
                    </h3>
                    <span className="font-mono text-sm font-normal tracking-[-0.5px] text-black transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-light text-black/70">
                    {service.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Section: Explore Navigation */}
      <section className="w-full px-3 py-16 sm:px-6 md:px-12 md:py-20">
        <div className="mb-10 flex items-baseline justify-between border-b border-black/10 pb-4">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Explore
          </h2>
          <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
            Navigation &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Link href="/design" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/design-hero.png"
                alt="Design Discipline"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
        </div>
      </section>

      {/* 5. Standardized Spatial Brief Consultation */}
      <SpatialBriefSection />
    </div>
  );
}
