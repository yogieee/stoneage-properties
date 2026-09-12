"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface ParallaxImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  speed?: number; // 1 = subtle, 1.5 = moderate
  className?: string; // styles on inner image
  containerClassName?: string; // styles on outer overflow-hidden container
  children?: React.ReactNode; // overlay badges, gradients, etc.
}

/**
 * Editorial architectural image container with smooth scroll-driven parallax scrub.
 *
 * Replicates Storey Architecture's tactile photography depth:
 * As the user scrolls past the image, the inner image pans smoothly inside its
 * overflow-hidden frame.
 *
 * Automatically respects prefers-reduced-motion (no parallax transform applied).
 */
export function ParallaxImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  speed = 1.0,
  className = "object-cover",
  containerClassName = "relative w-full h-full overflow-hidden",
  children,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !innerRef.current) return;

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
            gsap.set(innerRef.current, { yPercent: 0, scale: 1 });
            return;
          }

          const travel = 8 * speed;

          gsap.fromTo(
            innerRef.current,
            { yPercent: -travel },
            {
              yPercent: travel,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={containerClassName}>
      <div
        ref={innerRef}
        className="relative w-full h-full scale-[1.18] will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={className}
        />
      </div>
      {children}
    </div>
  );
}
