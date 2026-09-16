"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { gsap } from "@/lib/gsap";

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

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  // Parallax Scroll scrub matching Storey Architecture
  useEffect(() => {
    if (!containerRef.current || !imageContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageContainerRef.current, {
        y: "20%",
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Timer loop for carousel autoplay with reduced-motion support
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = Date.now() - progress * SLIDE_DURATION_MS;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(elapsed / SLIDE_DURATION_MS, 1);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        nextSlide();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, isPaused, nextSlide, progress]);

  const activeSlide = slides[activeIndex];

  if (!activeSlide) return null;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[640px] bg-charcoal text-paper overflow-hidden select-none"
    >
      {/* Background Image Carousel with parallax scroll scrub */}
      <div ref={imageContainerRef} className="absolute inset-0 w-full h-full will-change-transform">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? "opacity-90 scale-100 z-10"
                  : "opacity-0 scale-105 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover opacity-[0.92] saturate-125"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/25" />
            </div>
          );
        })}
      </div>

      {/* Hero Narrative Overlay at Bottom */}
      <div className="relative z-20 w-full h-full px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 gap-8 sm:gap-10">
        {/* Expanding Segmented Progress Indicators matching Storey (Active = 50% width, Inactive = 16.66% width) */}
        <div className="flex w-full gap-3 sm:gap-4 items-center" role="tablist" aria-label="Hero Slides">
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
                onClick={() => goToSlide(idx)}
                className={`py-3 group cursor-pointer focus:outline-none transition-all duration-500 ease-out ${
                  isActive ? "flex-[3]" : "flex-1"
                }`}
              >
                <div className="w-full h-[2px] sm:h-[3px] bg-paper/25 rounded-full overflow-hidden transition-colors group-hover:bg-paper/40">
                  <div
                    className="h-full bg-paper transition-all"
                    style={{
                      width: isActive ? `${progress * 100}%` : isPast ? "100%" : "0%",
                      transition: isActive ? "none" : "width 400ms ease-out",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Narrative Headline, Caption & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end">
          <div className="md:col-span-8 lg:col-span-9 space-y-3">
            {/* Dynamic Tag based on image name */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-paper/60">
                0{activeIndex + 1} &middot; {activeSlide.tag}
              </span>
            </div>

            {/* Dynamic Caption that updates with each image change */}
            <div className="min-h-[72px] sm:min-h-[84px] md:min-h-[96px] flex items-center">
              <h1
                key={activeSlide.src}
                className="font-display text-lg sm:text-2xl md:text-3xl lg:text-[2rem] font-light leading-snug tracking-tight text-paper/95 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
              >
                {activeSlide.caption}
              </h1>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3 flex md:justify-end items-center gap-4 md:mr-20 lg:mr-28">
            <Link
              href="/projects"
              className="group inline-flex items-center justify-between gap-4 bg-paper text-ink px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 hover:bg-paper-warm hover:shadow-lg"
            >
              <span>Projects</span>
              <LogoSpinner spin="hover" size="w-5 h-5" className="text-ink" />
            </Link>

            {/* Accessible WCAG Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="font-mono text-xs text-paper/60 hover:text-paper uppercase tracking-widest px-2 py-1 focus:outline-none"
              aria-label={isPaused ? "Resume carousel autoplay" : "Pause carousel autoplay"}
            >
              {isPaused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
