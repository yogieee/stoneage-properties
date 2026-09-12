"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type MagneticButtonProps = {
  children: ReactNode;
  /** Fraction of the cursor-to-center distance the element travels. */
  strength?: number;
};

/**
 * Content-agnostic magnetic cursor-follow hover primitive, built on
 * `gsap.quickTo()`.
 *
 * `prefers-reduced-motion` and pointer-type handling are both built into
 * this primitive's own implementation via `gsap.matchMedia()`, following
 * the same contract `Reveal`/`TextReveal` established. On reduced motion
 * or coarse-pointer (touch) devices, no event listeners are attached at
 * all — the wrapped child behaves like a normal static, fully clickable
 * element. On fine-pointer devices with motion allowed, the element
 * follows the cursor within `strength` of the distance to the pointer and
 * snaps back to origin on mouse leave.
 *
 * Stays content-agnostic — no domain-specific props, works with any
 * children (a `Button`, an anchor, etc.).
 */
export function MagneticButton({
  children,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isFinePointer: "(pointer: fine)",
        },
        (context) => {
          const { reduceMotion, isFinePointer } = context.conditions as {
            reduceMotion: boolean;
            isFinePointer: boolean;
          };

          // No listeners attached at all under reduced motion or on
          // coarse-pointer (touch) devices — normal static, tappable button.
          if (reduceMotion || !isFinePointer) return;

          const el = ref.current!;
          const xTo = gsap.quickTo(el, "x", {
            duration: 0.4,
            ease: "elastic.out(1, 0.3)",
          });
          const yTo = gsap.quickTo(el, "y", {
            duration: 0.4,
            ease: "elastic.out(1, 0.3)",
          });

          const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener("mousemove", onMove);
          el.addEventListener("mouseleave", onLeave);
          return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
