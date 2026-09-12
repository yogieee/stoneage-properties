"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GeometricLogo } from "@/components/decorative/GeometricLogo";
import { gsap } from "@/lib/gsap";

const TESTIMONIALS = [
  {
    quote:
      "Stoneage brought a level of clarity and structural intention to the project that completely changed how we experienced our home. From planning through to final handover, the execution was flawless.",
    author: "David Shoreman",
    role: "RESIDENTIAL NEW BUILD — SOLIHULL",
    image: "/images/projects/project-2.webp",
  },
  {
    quote:
      "The process felt exceptionally clear from beginning to end, and every decision elevated both function and atmosphere in our home. Their JCT contract administration provided complete peace of mind.",
    author: "Leah Morrison",
    role: "FULL REMODELLING — KNOWLE",
    image: "/images/projects/project-1.webp",
  },
  {
    quote:
      "Stoneage translated our goals into a calm, refined environment that balances material warmth with modern restraint beautifully. The workmanship on the cedar and zinc details is world-class.",
    author: "Jamie Caldwell",
    role: "KITCHEN & LIVING EXTENSION — LONDON",
    image: "/images/projects/project-3.jpg",
  },
  {
    quote:
      "Every stage was collaborative and thoughtful, resulting in a building that feels effortless to live in while remaining distinctly engineered. We could not recommend their specialist team more highly.",
    author: "Ariana Holt",
    role: "ROOF CONVERSION — NOTTINGHAM",
    image: "/images/projects/project-4.webp",
  },
];

export function TestimonialsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const containerRef = useRef<HTMLElement | null>(null);
  const DURATION = 5000;

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to("#background-logo-spinner", {
        rotateZ: 90,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      setProgress(0);
    }, DURATION);

    const animInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(elapsed / DURATION, 1));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animInterval);
    };
  }, [activeIndex]);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      ref={containerRef}
      className="bg-charcoal text-paper relative w-full overflow-hidden py-24 select-none sm:py-36"
    >
      {/* Ambient Rotating Watermark Logo matching Storey */}
      <div className="pointer-events-none absolute -bottom-24 left-1/2 z-0 flex h-[550px] w-[550px] -translate-x-1/2 items-center justify-center overflow-hidden overflow-visible opacity-10 select-none sm:h-[750px] sm:w-[750px]">
        <div
          id="background-logo-spinner"
          className="text-paper flex h-full w-full items-center justify-center"
        >
          <GeometricLogo className="h-full w-full text-current" />
        </div>
      </div>
      <div className="px-6 sm:px-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 lg:gap-16">
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-6">
            <div className="bg-charcoal-light border-paper/15 relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-xl">
              <Image
                src={current.image}
                alt={current.author}
                fill
                className="object-cover transition-all duration-700 ease-out"
              />
              <div className="bg-charcoal/20 absolute inset-0" />
            </div>

            {/* Segmented Progress Lines */}
            <div className="mt-6 flex gap-2 sm:gap-3">
              {TESTIMONIALS.map((item, idx) => (
                <button
                  key={item.author}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setProgress(0);
                    startTimeRef.current = Date.now();
                  }}
                  className="flex-1 cursor-pointer py-2 focus:outline-none"
                  aria-label={`Show testimonial ${idx + 1}`}
                >
                  <div className="bg-paper/20 h-[2px] w-full overflow-hidden rounded-full">
                    <div
                      className="bg-paper h-full transition-all"
                      style={{
                        width:
                          idx === activeIndex
                            ? `${progress * 100}%`
                            : idx < activeIndex
                              ? "100%"
                              : "0%",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Quote + Client Identity Card */}
          <div className="flex min-h-[300px] flex-col justify-between md:col-span-6">
            <div>
              <span className="text-paper/50 mb-6 block font-mono text-xs tracking-widest uppercase">
                Client Testimonials &middot; {activeIndex + 1} of{" "}
                {TESTIMONIALS.length}
              </span>

              {/* Quote text with smooth fade */}
              <blockquote className="font-display text-paper/95 min-h-[140px] text-lg leading-relaxed font-light sm:text-2xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            </div>

            {/* Client Avatar / Name */}
            <div className="border-paper/15 mt-8 flex items-center justify-between border-t pt-8">
              <div>
                <p className="font-display text-paper text-base font-medium sm:text-lg">
                  {current.author}
                </p>
                <p className="text-paper/60 mt-0.5 font-mono text-xs tracking-wider uppercase">
                  {current.role}
                </p>
              </div>

              {/* Monospace Counter */}
              <span className="text-paper/40 font-mono text-xs">
                0{activeIndex + 1} / 0{TESTIMONIALS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Supporting collaboration statement */}
        <div className="border-paper/15 text-paper/80 mt-20 grid grid-cols-1 gap-8 border-t pt-20 sm:gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-body text-base leading-relaxed sm:text-lg">
              We collaborate closely with clients, consultants, and specialist
              craftspeople to ensure every project is resolved with structural
              precision from initial design through handover.
            </p>
          </div>
          <div className="md:col-span-6">
            <p className="font-body text-base leading-relaxed sm:text-lg">
              Our building process prioritises clarity, communication, and
              lasting architectural quality that continues to age gracefully
              alongside the families who inhabit them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
