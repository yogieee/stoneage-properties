"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Vertical offset (px) the content travels from when revealing. */
  y?: number;
  /** Delay (seconds) before the reveal animation starts. Generic timing
   * control only — never a domain-specific prop. */
  delay?: number;
  className?: string;
};

/**
 * Content-agnostic scroll-reveal primitive.
 *
 * `prefers-reduced-motion` handling is built into this primitive's own
 * implementation via `gsap.matchMedia()` — callers never need to think
 * about reduced motion themselves. When reduce-motion is on, content is
 * set to its final state instantly (no animation, not a "faster" version
 * of the same animation). When off, content fades/slides in on scroll.
 *
 * Never import or reference domain types (e.g. Project, Service) here —
 * this component must stay reusable across any future content.
 */
export function Reveal({ children, y = 40, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            // Simplified: instant final state, no transform/opacity animation.
            gsap.set(ref.current, { opacity: 1, y: 0 });
            return;
          }

          gsap.from(ref.current, {
            y,
            opacity: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
