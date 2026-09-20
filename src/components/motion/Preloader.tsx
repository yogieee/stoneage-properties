"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Initial-load preloader: A stark, pure, empty white overlay
 * that fades out smoothly to reveal the landing page underneath.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const overlay = overlayRef.current;
    if (!overlay) return;

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

    // Hold pure empty white momentarily, then fade out smoothly into the landing page
    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onStart: () => {
          overlay.style.pointerEvents = "none";
        },
      },
      0.6,
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
      className="fixed inset-0 z-100 bg-[#F7F5F0]"
      aria-hidden="true"
    />
  );
}
