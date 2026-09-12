"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

type TextRevealProps = {
  /** SplitText requires real text content, not arbitrary nodes. */
  children: string;
  as?: ElementType;
  className?: string;
};

/**
 * Content-agnostic word-by-word heading reveal primitive, built on GSAP
 * `SplitText`.
 *
 * `prefers-reduced-motion` handling is built into this primitive's own
 * implementation via `gsap.matchMedia()`, following the exact contract
 * `Reveal.tsx` established in Phase 1 — callers never need to think about
 * reduced motion themselves. When reduce-motion is on, the full text is set
 * to its final visible state instantly (no animation). When off, the text
 * splits into words and staggers in on scroll.
 *
 * Never import or reference domain types (e.g. Service, TeamMember) here —
 * this component must stay reusable across any future content.
 */
export function TextReveal({
  children,
  as: Tag = "h2",
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
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

          const split = SplitText.create(ref.current, {
            type: "words",
            mask: "words",
            autoSplit: true,
            aria: "auto",
            onSplit(self) {
              if (reduceMotion) {
                gsap.set(self.words, { autoAlpha: 1, y: 0 });
                return;
              }
              return gsap.from(self.words, {
                y: "100%",
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.04,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 85%",
                },
              });
            },
          });

          return () => split.revert();
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
