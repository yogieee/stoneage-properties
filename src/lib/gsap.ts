"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Single source of truth for GSAP plugin registration.
// Import gsap/ScrollTrigger/SplitText from this module everywhere in the
// project instead of importing "gsap"/"gsap/ScrollTrigger"/"gsap/SplitText"
// directly in component files — this prevents duplicate plugin registration
// across routes.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };
