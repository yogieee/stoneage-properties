"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { StarIcon } from "@/components/decorative/StarIcon";

/**
 * Initial-load screen: a black overlay with the wordmark held in the same
 * top-left position/size as the real nav logo, so when the overlay fades
 * out the logo underneath lines up exactly and reads as one continuous
 * element rather than a cut between two different logos.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    if (mediaQuery.matches) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setVisible(false);
      },
    });

    tl.to(logo, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.15).to(
      overlay,
      {
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        onStart: () => {
          overlay.style.pointerEvents = "none";
        },
      },
      1.0,
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 bg-charcoal"
      aria-hidden="true"
    >
      <div
        ref={logoRef}
        className="absolute top-0 left-0 flex items-center gap-2 px-10 py-5 text-paper opacity-0 sm:py-7"
      >
        <span className="font-display text-2xl leading-none font-bold tracking-tight sm:text-3xl">
          Stoneage
        </span>
        <StarIcon className="mt-1.5 h-8 w-8 shrink-0 animate-[spin_25s_linear_infinite] self-center sm:h-6 sm:w-6" />
      </div>
    </div>
  );
}
