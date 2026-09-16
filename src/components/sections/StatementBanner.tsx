"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { gsap } from "@/lib/gsap";

export function StatementBanner() {
  const containerRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: "20%",
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

  return (
    <section
      ref={containerRef}
      className="bg-charcoal text-paper relative z-50 flex min-h-[90svh] w-full flex-col justify-between overflow-hidden py-24 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] sm:py-32"
    >
      {/* Full-bleed background image with parallax scrub */}
      <div
        ref={imageRef}
        className="absolute inset-0 -top-[10%] h-[120%] w-full opacity-40 will-change-transform"
      >
        <Image
          src="/images/hero/extension.png"
          alt="Architectural structure in natural setting"
          fill
          className="object-cover"
        />
        <div className="from-charcoal via-charcoal/60 to-charcoal absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="relative z-10 my-12 flex w-full flex-1 flex-col items-center justify-center px-6 text-center sm:px-12">
        <h2 className="font-display text-paper mb-10 max-w-4xl text-4xl leading-[1.08] font-medium tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          We shape space into purpose
        </h2>

        <Link
          href="/#contact"
          className="group bg-paper text-ink hover:bg-paper-warm inline-flex items-center gap-4 rounded-full px-8 py-4 font-mono text-xs tracking-wider uppercase shadow-xl transition-all duration-300 hover:shadow-2xl sm:px-10 sm:py-5 sm:text-sm"
        >
          <span>Start a project</span>
          <LogoSpinner spin="hover" size="h-5 w-5" className="text-ink" />
        </Link>
      </div>

      {/* Two supporting manifesto columns below */}
      <div className="border-paper/15 relative z-10 w-full border-t px-6 pt-12 sm:px-12">
        <div className="grid grid-cols-1 gap-8 sm:gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-body text-paper/80 text-base leading-relaxed sm:text-xl">
              Architecture should enhance the experience of everyday living. We
              create homes that feel open, grounded, and intimately connected to
              their surroundings.
            </p>
          </div>
          <div className="md:col-span-6">
            <p className="font-body text-paper/80 text-base leading-relaxed sm:text-xl">
              Through rigorous planning and material integrity, each project is
              built to balance simplicity, warmth, and structural longevity
              across generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
