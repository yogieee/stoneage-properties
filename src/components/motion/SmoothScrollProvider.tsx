"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function LenisGsapSync() {
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  useEffect(() => {
    // Recalculate ScrollTrigger offsets once webfonts finish swapping in
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  return null;
}

/**
 * Mounts Lenis smooth scroll once at the root layout, synced to GSAP's
 * ticker/ScrollTrigger. `autoRaf` is disabled so GSAP's ticker drives the
 * frame loop instead of Lenis's own, keeping ScrollTrigger positions in
 * sync with smoothed scroll.
 *
 * Config is intentionally minimal — no custom duration/easing overrides —
 * so Lenis's own default `prefers-reduced-motion` handling (native 1:1
 * scroll tracking, instant programmatic scrolls) is never defeated.
 *
 * `anchors: true` makes every `<a href="#...">`/`<a href="/#...">` in the
 * app smooth-scroll via Lenis declaratively — no manual click handlers
 * needed for `SiteNav`'s in-page anchor links.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 0.6,
        smoothWheel: true,
        autoRaf: false,
        anchors: { offset: -80, duration: 1.2 },
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
