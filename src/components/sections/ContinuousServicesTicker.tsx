import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

// Fallback services in case CMS returns an empty array
const FALLBACK_SERVICES = [
  {
    slug: "bespoke-new-builds",
    name: "Bespoke New Builds",
    tagline: "Generational architecture built from the bedrock up",
    image: "/images/hero/exterior.png",
  },
  {
    slug: "full-home-renovations",
    name: "Full Home Renovations",
    tagline: "Complete internal remodelling & structural transformations",
    image: "/images/hero/rennovation.png",
  },
  {
    slug: "structural-extensions",
    name: "Structural Extensions",
    tagline: "Monolithic extensions bridging past and present",
    image: "/images/hero/extension.png",
  },
  {
    slug: "barn-conversions",
    name: "Historic Barn Conversions",
    tagline: "Conserving rural timber & stone heritage with modern volume",
    image: "/images/hero/barn.png",
  },
  {
    slug: "architectural-design",
    name: "Architectural Design & BIM",
    tagline: "Full RIBA Work Stages 0–7 & 3D Revit documentation",
    image: "/images/hero/Refurbishments.png",
  },
  {
    slug: "basement-developments",
    name: "Subterranean & Basement Architecture",
    tagline: "Discreet lightwells, wellness suites & structural underpinning",
    image: "/images/hero/basement.png",
  },
  {
    slug: "loft-conversions",
    name: "Bespoke Loft Conversions",
    tagline: "Dormers & roofscapes maximizing vertical light",
    image: "/images/hero/loft.png",
  },
];

export async function ContinuousServicesTicker() {
  const sanityServices = await getServices();

  const services =
    sanityServices.length > 0
      ? sanityServices.map((service, idx) => ({
          slug: service.slug,
          name: service.name,
          tagline: service.summary || "Bespoke Architectural Excellence",
          image: service.heroImage
            ? urlFor(service.heroImage).width(800).height(500).url()
            : FALLBACK_SERVICES[idx % FALLBACK_SERVICES.length].image,
        }))
      : FALLBACK_SERVICES;

  // Duplicate items twice to ensure seamless infinite looping without gaps
  const tickerItems = [...services, ...services];

  return (
    <section
      className="w-full overflow-hidden border-t border-[#1C1B19]/10 bg-[#F7F5F0] pt-12 pb-16 text-[#1C1B19] sm:pt-16 sm:pb-20 md:pt-20 md:pb-24"
      aria-label="Available Services"
    >
      {/* Editorial Header */}
      <div className="mb-8 w-full px-3 sm:px-6 md:mb-12 md:px-12">
        <div className="flex flex-col justify-between gap-4 border-b border-[#1C1B19]/10 pb-6 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <span className="mb-2 block font-mono text-xs tracking-widest text-[#1C1B19]/50 uppercase">
              Services &amp; Capabilities
            </span>
            <h2 className="lg:text-xxl truncate text-xl font-normal tracking-[-1.5px] whitespace-nowrap text-[#1C1B19] sm:text-2xl md:text-3xl">
              Your next project with us could be...
            </h2>
          </div>
          <Link
            href="/services"
            className="flex shrink-0 items-center gap-2 text-base font-normal tracking-[-0.5px] whitespace-nowrap text-[#1C1B19] transition-opacity hover:opacity-70"
          >
            <span>View All Services</span>
            <span className="font-mono">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Infinite Smooth Ticker Carousel (hover to pause) */}
      <div className="group relative w-full overflow-hidden">
        {/* Subtle edge fade overlays */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-8 bg-gradient-to-r from-[#F7F5F0] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l from-[#F7F5F0] to-transparent sm:w-16" />

        <div className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
          {tickerItems.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/services/${item.slug}`}
              className="group/card mx-3 block w-[280px] shrink-0 text-black sm:mx-4 sm:w-[340px] md:w-[380px]"
            >
              {/* Card Image */}
              <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden bg-black/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 280px, 380px"
                  className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                />
              </div>

              {/* Title & Tagline */}
              <div className="border-t border-black/10 pt-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-normal tracking-[-0.5px] text-black transition-opacity group-hover/card:opacity-70 sm:text-xl">
                    {item.name}
                  </h3>
                  <span className="font-mono text-sm transition-transform duration-300 group-hover/card:translate-x-1">
                    &rarr;
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 font-mono text-xs tracking-wider text-black/50 uppercase">
                  {item.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
