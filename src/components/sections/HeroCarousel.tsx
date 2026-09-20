"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  src: string;
  alt: string;
  tag: string;
  title: string;
  caption: string;
}

const SLIDE_DURATION_MS = 6000;

type HeroCarouselProps = {
  slides: Slide[];
};

/**
 * Fabric Design Group Hero Slide-System exact implementation:
 * - Desktop: 100vh height with padding: 84px 0 72px 0 (clearing 72px header)
 * - Mobile: 80vh height with padding: 72px 0 60px 0
 * - Horizontal padding: 12px (mobile) to 48px (desktop) matching header
 * - Bottom overview bar: 72px height, title (.text-lg .n-spaced), code, and View Project prompt
 */
export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Autoplay loop
  useEffect(() => {
    if (typeof window === "undefined" || slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION_MS);

    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  const activeSlide = slides[activeIndex];
  if (!activeSlide) return null;

  return (
    <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
      <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
        {/* Image Holder with exact Fabric padding & structure */}
        <div className="relative h-full w-full overflow-hidden bg-black">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.src}
                className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
                  isActive
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            );
          })}
        </div>

        {/* Fabric Overview Bar (height: 72px, padding: 17px 0) */}
        <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center justify-between gap-3 border-b border-black/10">
          {/* Project Title & Code with smooth synchronized crossfade */}
          <div className="relative flex h-10 min-w-0 flex-1 items-center overflow-hidden">
            {slides.map((slide, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={slide.src}
                  className={`absolute inset-0 flex items-baseline gap-2 transition-all duration-700 ease-in-out sm:gap-3 ${
                    isCurrent
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <h2 className="max-w-[200px] truncate text-base font-normal tracking-[-1px] text-black sm:max-w-md sm:text-2xl">
                    {slide.title || slide.tag}
                  </h2>
                  <span className="shrink-0 font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                    ST0{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* View Project prompt on right (shrink-0 so mobile never collides) */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-6">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-normal tracking-[-0.5px] whitespace-nowrap text-black transition-opacity hover:opacity-75 sm:gap-2 sm:text-lg"
            >
              <span>View Project</span>
              <span className="font-mono transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>

            {/* Subtle pagination indicator dots */}
            <div className="hidden items-center gap-1.5 sm:flex">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-5 bg-black"
                      : "w-2 bg-black/20 hover:bg-black/40"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
