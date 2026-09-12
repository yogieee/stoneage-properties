---
phase: 02-core-pages-home-services-and-about
plan: 01
subsystem: ui
tags: [gsap, splittext, quickto, motion, react, reduced-motion]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: src/lib/gsap.ts central plugin registration, src/components/motion/Reveal.tsx matchMedia reduced-motion contract
provides:
  - "SplitText registered centrally in src/lib/gsap.ts alongside ScrollTrigger"
  - "TextReveal primitive: word-by-word scroll-triggered heading reveal (MOTION-01)"
  - "MagneticButton primitive: quickTo-based cursor-follow hover for primary CTAs (MOTION-02)"
affects: [02-02 homepage hero, services pages, about page, any future CTA/heading composition]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SplitText usage always goes through src/lib/gsap.ts export, never gsap/SplitText directly in component files"
    - "Motion primitives handle prefers-reduced-motion internally via gsap.matchMedia() — callers never wrap usages in their own media-query checks"
    - "Pointer-type gating (pointer: fine) lives inside the primitive itself for hover-only effects, not in calling code"

key-files:
  created:
    - src/components/motion/TextReveal.tsx
    - src/components/motion/MagneticButton.tsx
  modified:
    - src/lib/gsap.ts

key-decisions:
  - "SplitText registered once in src/lib/gsap.ts's existing registerPlugin call (not a second call) to preserve the single-registration-point discipline from Phase 1"
  - "MagneticButton skips attaching any mousemove/mouseleave listeners entirely under reduced-motion or coarse-pointer conditions, rather than attaching and no-op'ing them, to keep touch/mobile CTA behavior identical to a plain button"

patterns-established:
  - "Two-layer GSAP cleanup for primitives that create SplitText/tween state inside a matchMedia handler: inner handler returns its own revert (split.revert()), outer useGSAP cleanup calls mm.revert()"

# Metrics
duration: ~15min
completed: 2026-09-09
---

# Phase 2 Plan 1: Motion Primitives (TextReveal + MagneticButton) Summary

**Added SplitText-based word-reveal (`TextReveal`) and quickTo-based magnetic hover (`MagneticButton`) primitives to `src/components/motion/`, both with reduced-motion/pointer-type handling built in via `gsap.matchMedia()`, ready for composition into Phase 2 pages.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-09-09T08:26:00Z (approx)
- **Completed:** 2026-09-09T08:41:38Z
- **Tasks:** 2
- **Files modified:** 3 (1 modified, 2 created)

## Accomplishments
- `src/lib/gsap.ts` now registers `SplitText` alongside `ScrollTrigger` in the single central `registerPlugin` call, and exports `SplitText` so no component imports `gsap/SplitText` directly
- `TextReveal` component: content-agnostic word-by-word heading reveal using `SplitText.create(..., { type: "words", mask: "words", autoSplit: true, aria: "auto" })`, instant final state under reduced motion, staggered scroll-triggered reveal otherwise
- `MagneticButton` component: content-agnostic cursor-follow hover using `gsap.quickTo()` (never recreated per mousemove), zero listeners attached under reduced-motion or coarse-pointer (touch) conditions

## Task Commits

Each task was committed atomically:

1. **Task 1: Register SplitText centrally and build TextReveal primitive** - `53db2c2` (feat)
2. **Task 2: Build MagneticButton primitive** - `2f308b6` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/lib/gsap.ts` - Added `SplitText` import, registration, and export alongside existing `ScrollTrigger`
- `src/components/motion/TextReveal.tsx` - New: word-by-word `SplitText` heading reveal primitive
- `src/components/motion/MagneticButton.tsx` - New: `quickTo`-based magnetic cursor-follow hover primitive

## Decisions Made
- Kept `TextReveal`'s ref typed loosely against a polymorphic `as` tag (single narrow inline cast) rather than introducing a generic-component abstraction, since `tsc --noEmit` and `eslint` both pass cleanly and the component has exactly one caller pattern (heading text)
- No new dependencies added — `SplitText` ships bundled with the already-installed `gsap` package (no Club GreenSock license step needed, per 02-RESEARCH.md)

## Deviations from Plan

None - plan executed exactly as written, following 02-RESEARCH.md Pattern 1 and Pattern 2 verbatim.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both primitives compile cleanly (`tsc --noEmit`, `eslint`, `next build` all verified passing), are content-agnostic, and are ready to compose into the homepage hero, services pages, and about page in subsequent Phase 2 plans without any downstream plan needing to touch `SplitText`/`quickTo` directly
- Live visual/accessibility verification (word-by-word reveal on scroll, reduced-motion instant state, magnetic follow on fine-pointer only) deferred to the homepage plan (02-02) where these primitives are first mounted in a real page, per plan's own verify guidance
- No blockers identified

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
