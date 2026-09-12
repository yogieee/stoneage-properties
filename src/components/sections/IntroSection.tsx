"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { Paperclip } from "@/components/decorative/Paperclip";

const ALL_PROJECTS = [
  {
    title: "Festal House Remodelling",
    location: "Knowle",
    image: "/images/hero/exterior.png",
    href: "/projects",
  },
  {
    title: "Meadow Contemporary Residence",
    location: "Rugby",
    image: "/images/hero/extension.png",
    href: "/projects",
  },
  {
    title: "Bracken Kitchen & Living Extension",
    location: "Solihull",
    image: "/images/hero/construction.png",
    href: "/projects",
  },
  {
    title: "Grange Change of Use Conversion",
    location: "Nottingham",
    image: "/images/hero/oldtonew.png",
    href: "/projects",
  },
  {
    title: "Kenilworth Cedar Pavilion",
    location: "Warwickshire",
    image: "/images/hero/exterior.png",
    href: "/projects",
  },
  {
    title: "Dorridge Monolith Residence",
    location: "Solihull",
    image: "/images/hero/extension.png",
    href: "/projects",
  },
  {
    title: "Copper & Timber Studio",
    location: "Birmingham",
    image: "/images/hero/construction.png",
    href: "/projects",
  },
  {
    title: "Stamford Zinc Conversion",
    location: "Nottingham",
    image: "/images/hero/oldtonew.png",
    href: "/projects",
  },
];

export function IntroSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const spinnerRef = useRef<HTMLDivElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Storey GSAP ScrollTrigger scrub: smoothly rotates the 3D circle as user scrolls
  useEffect(() => {
    if (!containerRef.current || !spinnerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(spinnerRef.current, {
        rotateZ: 100,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Note starts pinned near the top of the section, then drops into its
      // resting spot with a bounce once the section scrolls into view.
      if (noteRef.current) {
        const dropDistance = containerRef.current!.offsetHeight - 140;

        const dropTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });

        dropTimeline
          .fromTo(
            noteRef.current,
            { y: -dropDistance },
            { y: 14, duration: 1.8, ease: "power2.in" },
          )
          .to(noteRef.current, { y: 0, duration: 0.5, ease: "bounce.out" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro-section-container"
      ref={containerRef}
      className="bg-charcoal text-paper relative flex min-h-[95svh] w-full flex-col justify-between overflow-y-clip select-none sm:min-h-[110svh]"
    >
      {/* Bottom gradient fade smoothly into Section 3 matching Storey */}
      <div className="to-charcoal pointer-events-none absolute bottom-0 left-0 z-10 h-[35%] w-full bg-gradient-to-b from-transparent" />

      {/* Manifesto Philosophy Copy across top in 2 columns */}
      <div className="pointer-events-none relative z-20 w-full px-6 pt-16 sm:px-12 sm:pt-24">
        <div className="pointer-events-auto grid grid-cols-1 gap-6 sm:gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-paper/90 text-base leading-relaxed font-light sm:text-xl md:text-2xl">
              We believe architecture and specialist building should feel calm,
              lasting, and deeply connected to the way people live. Our work
              focuses on creating homes that feel refined without excess.
            </p>
          </div>
          <div className="md:col-span-6">
            <p className="font-display text-paper/90 text-base leading-relaxed font-light sm:text-xl md:text-2xl">
              Every project is shaped through collaboration, careful detailing,
              and a strong understanding of space, light, and material. The
              result is construction designed to age beautifully over time.
            </p>
          </div>
        </div>
      </div>

      {/* Exact Storey 3D Card Circle Orbit (DisplayLogoSpinner) */}
      <div className="pointer-events-auto absolute bottom-0 left-1/2 z-0 h-fit w-fit -translate-x-3/4 translate-y-1/2">
        <div
          className="relative"
          style={{
            width: "114.4vw",
            height: "114.4vw",
            perspective: "132vw",
          }}
        >
          {/* Storey's exact 3D tilt plane: rotate3d(0.27, -1.005, 1.5, 85deg) */}
          <div
            className="size-full [transform-style:preserve-3d]"
            style={{
              transform: "rotate3d(0.27, -1.005, 1.5, 85deg)",
            }}
          >
            {/* Scroll-Rotated Wheel */}
            <div
              id="intro-logo-spinner"
              ref={spinnerRef}
              className="relative size-full will-change-transform [transform-style:preserve-3d]"
            >
              {ALL_PROJECTS.map((proj, idx) => {
                const angle = (idx * 360) / ALL_PROJECTS.length;
                const isHovered = hoveredIndex === idx;

                return (
                  <Link
                    key={`${proj.title}-${idx}`}
                    href={proj.href}
                    className="pointer-events-none absolute inset-0"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    {/* Clickable Card on the Ring */}
                    <div
                      data-spinner-square={idx}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`bg-paper/20 hover:bg-paper/40 border-paper/30 pointer-events-auto absolute left-1/2 -translate-x-1/2 cursor-pointer overflow-hidden rounded-md border transition-all duration-300 ${
                        isHovered ? "z-30 scale-105 shadow-2xl" : "opacity-40"
                      }`}
                      style={{
                        width: "13.2vw",
                        height: "11.12vw",
                        bottom: "calc(50% + 44vw)",
                      }}
                    >
                      <div
                        className={`relative h-full w-full transition-opacity duration-500 ${
                          isHovered ? "opacity-100" : "opacity-25"
                        }`}
                      >
                        <Image
                          src={proj.image}
                          alt={proj.title}
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                        <div className="bg-charcoal/40 absolute inset-0 flex flex-col justify-end p-2 sm:p-3">
                          <span className="font-display text-paper truncate text-[10px] leading-tight font-medium sm:text-xs">
                            {proj.title}
                          </span>
                          <span className="text-paper/70 font-mono text-[8px] tracking-wider uppercase sm:text-[9px]">
                            {proj.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Storey's Sticky "Hover + click to visit projects" Paper Note Box */}
      <div
        ref={noteRef}
        className="pointer-events-auto absolute right-6 bottom-6 z-30 sm:right-12 sm:bottom-10"
      >
        <div
          onMouseEnter={() => setIsDismissed(true)}
          className={`transition-all duration-700 ${
            isDismissed
              ? "pointer-events-none translate-y-4 scale-95 opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          }`}
        >
          <div className="relative w-72 -rotate-2 transition-transform duration-300 hover:rotate-0 sm:w-96">
            {/* Paperclip pinned to the top edge */}
            <div className="pointer-events-none absolute -top-6 left-6 z-10">
              <Paperclip className="h-auto w-9" />
            </div>

            <div className="paper-texture bg-paper-card border-line text-ink hover:shadow-paper/10 relative flex flex-col rounded border p-4 shadow-2xl transition-all duration-300">
              {/* Animated Demo Indicator */}
              <div className="bg-charcoal/90 relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded border border-black/10">
                <Image
                  src="/images/projectsuggestion.gif"
                  alt="Project preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
                {/* Animated cursor pointer */}
                <div className="absolute right-2 bottom-2 animate-bounce">
                  <svg
                    className="text-paper h-6 w-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z" />
                  </svg>
                </div>
              </div>

              {/* Text instruction  */}
              <div className="flex items-center justify-between gap-2 border-t border-black/10 pt-3">
                <span className="text-ink font-mono text-[11px] font-medium tracking-wider uppercase underline underline-offset-4">
                  Hover + click to visit projects
                </span>
                <div className="relative h-3 w-3 shrink-0">
                  <span className="bg-ink absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" />
                  <span className="bg-ink relative inline-flex h-3 w-3 rounded-full opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
