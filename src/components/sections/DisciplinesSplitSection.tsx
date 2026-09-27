"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

export interface DisciplineItem {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  features?: string[];
}

interface DisciplinesSplitSectionProps {
  disciplines: DisciplineItem[];
}

export function DisciplinesSplitSection({
  disciplines,
}: DisciplinesSplitSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    disciplines[0]?.slug || ""
  );
  const [hoveredDiscipline, setHoveredDiscipline] =
    useState<DisciplineItem | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const xToRef = useRef<((val: number) => void) | null>(null);
  const yToRef = useRef<((val: number) => void) | null>(null);

  const activeDiscipline =
    disciplines.find((d) => d.slug === activeSlug) || disciplines[0];
  const activeIndex = disciplines.findIndex((d) => d.slug === activeSlug);

  useEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;
    if (!section || disciplines.length === 0) return;

    const mm = gsap.matchMedia();

    // Fine-pointer devices (Desktop/Trackpad/Mouse) cursor-following preview
    mm.add("(pointer: fine)", () => {
      if (preview) {
        gsap.set(preview, {
          xPercent: -50,
          yPercent: -50,
          scale: 0.85,
          opacity: 0,
        });

        xToRef.current = gsap.quickTo(preview, "x", {
          duration: 0.35,
          ease: "power2.out",
        });
        yToRef.current = gsap.quickTo(preview, "y", {
          duration: 0.35,
          ease: "power2.out",
        });
      }

      // Sync active item as right column scrolls
      const items = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-discipline-item]")
      );

      const triggers = items.map((item, idx) => {
        return gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => setActiveSlug(disciplines[idx].slug),
            onEnterBack: () => setActiveSlug(disciplines[idx].slug),
          },
        });
      });

      return () => {
        triggers.forEach((t) => t.scrollTrigger?.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, [disciplines]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (xToRef.current && yToRef.current) {
      // Offset cursor slightly so preview card floats naturally near cursor
      xToRef.current(e.clientX + 45);
      yToRef.current(e.clientY + 25);
    }
  };

  const handleMouseEnterItem = (item: DisciplineItem) => {
    setHoveredDiscipline(item);
    setActiveSlug(item.slug);
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeaveItem = () => {
    setHoveredDiscipline(null);
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      onMouseMove={handleMouseMove}
      className="relative w-full border-t border-[#1C1B19]/10 bg-[#F7F5F0] py-16 text-[#1C1B19] md:py-24 select-none"
      aria-label="Specialist Practice Disciplines"
    >
      <div className="w-full px-4 sm:px-8 md:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* =========================================================================
              LEFT COLUMN: Stays Fixed/Sticky at top-[96px] while Right Column Scrolls
             ========================================================================= */}
          <div
            ref={leftColRef}
            className="w-full lg:w-[42%] lg:sticky lg:top-[96px] flex flex-col justify-between space-y-6 z-10"
          >
            <div>
              <span className="font-mono text-xs tracking-widest text-[#1C1B19]/50 uppercase block mb-2">
                [03 &mdash; Practice Capabilities]
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-1.5px] text-[#1C1B19] leading-[1.08]">
                Specialist Disciplines &amp; Typologies
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#1C1B19]/75 font-light">
                From ground-up generational new builds to sensitive heritage transformations, our practice operates with unified RIBA stewardship, JCT contract rigor, and on-site master craft execution.
              </p>
            </div>

            {/* Dynamic Active Discipline Preview Card */}
            {activeDiscipline && (
              <div className="relative w-full aspect-[16/11] overflow-hidden border border-[#1C1B19]/15 bg-black/5 shadow-sm group">
                <Image
                  key={activeDiscipline.slug}
                  src={activeDiscipline.image}
                  alt={activeDiscipline.name}
                  fill
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-white/70 block">
                      Active Typology &middot; 0{activeIndex + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-normal tracking-tight text-white mt-0.5">
                      {activeDiscipline.name}
                    </h3>
                  </div>
                  <Link
                    href={`/services/${activeDiscipline.slug}`}
                    className="font-mono text-xs uppercase tracking-wider text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                  >
                    Explore &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Directory Link */}
            <div className="pt-2">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-medium tracking-[-0.5px] text-[#1C1B19] hover:opacity-70 transition-opacity"
              >
                <span>View Full Services Directory</span>
                <span className="font-mono transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Freely Scrolls Down Through All Disciplines
             ========================================================================= */}
          <div
            onMouseLeave={handleMouseLeaveItem}
            className="w-full lg:w-[58%] flex flex-col border-t border-[#1C1B19]/10 lg:border-t-0 lg:border-l lg:border-[#1C1B19]/10 lg:pl-12"
          >
            {disciplines.map((item, index) => {
              const isSelected = activeSlug === item.slug;
              const indexFormatted = `0${index + 1}`;

              return (
                <div
                  key={item.slug}
                  data-discipline-item=""
                  onMouseEnter={() => handleMouseEnterItem(item)}
                  className={`group relative border-b border-[#1C1B19]/10 py-6 sm:py-8 transition-colors duration-300 ${
                    isSelected ? "bg-[#FAF8F5]" : "hover:bg-[#FAF8F5]/60"
                  } -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-sm cursor-pointer`}
                >
                  <Link
                    href={`/services/${item.slug}`}
                    className="block group/link"
                  >
                    {/* Top Row: Index & Title */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span
                          className={`font-mono text-xs sm:text-sm font-normal transition-colors ${
                            isSelected
                              ? "text-[#1C1B19] font-medium"
                              : "text-[#1C1B19]/40 group-hover:text-[#1C1B19]"
                          }`}
                        >
                          {indexFormatted}
                        </span>
                        <h3
                          className={`text-xl sm:text-2xl lg:text-3xl font-normal tracking-[-0.5px] text-[#1C1B19] transition-opacity ${
                            isSelected
                              ? "opacity-100"
                              : "opacity-80 group-hover/link:opacity-100"
                          }`}
                        >
                          {item.name}
                        </h3>
                      </div>

                      <span className="font-mono text-lg text-[#1C1B19]/50 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5">
                        &#8599;
                      </span>
                    </div>

                    {/* Tagline Narrative */}
                    <p className="mt-3 pl-8 sm:pl-12 text-sm sm:text-base leading-relaxed text-[#1C1B19]/75 font-light">
                      {item.tagline}
                    </p>

                    {/* Capability Tags */}
                    {item.features && item.features.length > 0 && (
                      <div className="mt-3 pl-8 sm:pl-12 flex flex-wrap gap-2">
                        {item.features.map((feature) => (
                          <span
                            key={feature}
                            className="font-mono text-[10px] tracking-wider uppercase bg-[#1C1B19]/5 text-[#1C1B19]/70 px-2.5 py-1 border border-[#1C1B19]/5"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>

                  {/* Inline Mobile Photo (visible only on small screens < 1024px) */}
                  <div className="mt-4 pl-8 sm:pl-12 lg:hidden">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 border border-[#1C1B19]/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          FLOATING CURSOR PREVIEW CARD (Small image & "Read or Get in Touch" badge)
         ========================================================================= */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block will-change-transform"
      >
        {hoveredDiscipline && (
          <div className="relative w-64 aspect-[16/10] overflow-hidden rounded border border-white/20 bg-[#121110] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <Image
              src={hoveredDiscipline.image}
              alt={hoveredDiscipline.name}
              fill
              sizes="260px"
              className="object-cover"
            />
            {/* Cinematic dark tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

            {/* Floating pill badge with "Read / Get in Touch" */}
            <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
              <span className="font-mono text-[9px] tracking-wider uppercase text-white/70">
                {hoveredDiscipline.name}
              </span>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase text-white backdrop-blur-md border border-white/30">
                  <span>Explore</span>
                  <span className="text-xs">&rarr;</span>
                </span>
                <span className="font-mono text-xs text-white/80">&#8599;</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
