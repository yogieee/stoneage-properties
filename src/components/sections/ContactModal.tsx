"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { SpatialBriefForm } from "@/components/sections/SpatialBriefForm";

interface ContactModalProps {
  onClose: () => void;
}

export function ContactModal({ onClose }: ContactModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
            gsap.set(panelRef.current, { y: "0%", autoAlpha: 1 });
          } else {
            gsap.from(panelRef.current, {
              y: "100%",
              duration: 0.6,
              ease: "power3.out",
            });
          }
        },
      );

      return () => mm.revert();
    },
    { scope: panelRef },
  );

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onPointerDown={handleBackdropPointerDown}
      className="bg-charcoal/60 fixed inset-0 z-50 flex items-end justify-end backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brief-heading"
    >
      <div
        ref={panelRef}
        data-lenis-prevent
        className="relative h-[95%] w-full lg:w-3/4 overflow-y-auto p-6 pt-16 sm:p-12 sm:pt-20"
      >
        {/* Spatial Brief Intake Form */}
        <SpatialBriefForm isModal onSuccess={onClose} onClose={onClose} />
      </div>
    </div>
  );
}
