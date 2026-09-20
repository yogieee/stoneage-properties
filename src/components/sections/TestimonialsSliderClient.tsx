"use client";

import { useState, useEffect, useCallback } from "react";

type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  project?: string;
  location?: string;
};

type TestimonialsSliderClientProps = {
  testimonials: TestimonialItem[];
};

export function TestimonialsSliderClient({
  testimonials,
}: TestimonialsSliderClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const length = testimonials?.length || 0;

  const goToNext = useCallback(() => {
    if (length <= 1) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % length);
      setIsFading(false);
    }, 300);
  }, [length]);

  const goToPrev = useCallback(() => {
    if (length <= 1) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + length) % length);
      setIsFading(false);
    }, 300);
  }, [length]);

  // Auto-scroll timer: advances to the next testimonial every 5.5 seconds, pauses when hovered
  useEffect(() => {
    if (isPaused || length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, length, goToNext]);

  if (!testimonials || length === 0) return null;

  const current = testimonials[activeIndex];

  return (
    <section
      className="w-full border-t border-[#1C1B19]/10 bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Client Testimonials"
    >
      <div className="w-full">
        {/* Header with Title & Auto-scroll indicator */}
        <div className="mb-8 flex items-center justify-between md:mb-12">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            What our clients say:
          </h2>
          {length > 1 && (
            <div className="hidden items-center gap-2 font-mono text-[11px] tracking-wider text-black/40 uppercase sm:flex">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  isPaused ? "bg-black/30" : "animate-pulse bg-black"
                }`}
              />
              <span>{isPaused ? "Paused" : "Auto"}</span>
            </div>
          )}
        </div>

        {/* Testimonial Content with smooth fade transition */}
        <div
          className={`min-h-[260px] transition-all duration-300 md:min-h-[220px] ${
            isFading ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <p className="mb-2 text-xl font-normal tracking-[-0.5px] text-black sm:text-2xl">
            Project : {current.role || "Residential Architecture"}
          </p>
          <p className="mb-6 font-mono text-sm tracking-wider text-black/60 uppercase">
            Location : Solihull &amp; Warwickshire
          </p>

          <div className="text-reg max-w-4xl space-y-4 leading-relaxed font-light text-black/80">
            <p className="text-lg leading-relaxed md:text-xl">
              &ldquo;{current.quote}&rdquo;
            </p>
          </div>

          <p className="mt-6 text-base font-normal tracking-[-0.5px] text-black sm:text-lg">
            {current.author}
          </p>
        </div>

        {/* Prev / Next Controls & Progress Indicators */}
        <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-8">
          {/* Progress dots / bars */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsFading(true);
                  setTimeout(() => {
                    setActiveIndex(idx);
                    setIsFading(false);
                  }, 250);
                }}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-8 bg-black"
                    : "w-2 bg-black/20 hover:bg-black/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={goToPrev}
              className="flex cursor-pointer items-center gap-2 text-base font-normal tracking-[-0.5px] text-black transition-opacity hover:opacity-70 sm:text-lg"
            >
              <span className="font-mono">&larr;</span>
              <span>Prev</span>
            </button>

            <span className="font-mono text-xs text-black/40">
              {activeIndex + 1} / {testimonials.length}
            </span>

            <button
              type="button"
              onClick={goToNext}
              className="flex cursor-pointer items-center gap-2 text-base font-normal tracking-[-0.5px] text-black transition-opacity hover:opacity-70 sm:text-lg"
            >
              <span>Next</span>
              <span className="font-mono">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
