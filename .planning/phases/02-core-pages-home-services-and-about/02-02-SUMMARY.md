---
phase: 02-core-pages-home-services-and-about
plan: 02
subsystem: ui
tags: [nextjs, react, gsap, tailwind, motion, hero, homepage]

# Dependency graph
requires:
  - phase: 02-01
    provides: TextReveal (SplitText word-mask scroll reveal) and MagneticButton (quickTo cursor-follow) motion primitives
provides:
  - Full homepage (Hero + credentials strip) replacing the Phase 1 skeleton
  - Reusable BlueprintAccent decorative SVG primitive (architectural line-art ambient texture)
  - Domain-aware components/sections/ layer, distinct from content-agnostic components/motion/
  - Polymorphic Button (`as` prop) so design-system buttons can render as next/link Links
  - Real /work placeholder route resolving the homepage's "View Projects" CTA
affects: [03-portfolio (replaces /work placeholder), 02-03, 02-04 (share Reveal/Button/Typography primitives touched here)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "components/sections/ for domain-aware page composition, separate from content-agnostic components/motion/"
    - "Reveal accepts a generic `delay` prop (seconds) for sequencing multiple Reveal-wrapped elements without adding domain-specific props"
    - "Button is polymorphic via `as` (mirrors Typography's `as` override) so CTAs render as next/link's Link while keeping design-system variant styling"
    - "Decorative-only SVGs: stroke=\"currentColor\", aria-hidden=\"true\", no fill, positioned/sized entirely by the consumer via className"

key-files:
  created:
    - src/components/sections/Hero.tsx
    - src/components/decorative/BlueprintAccent.tsx
    - src/app/(marketing)/work/page.tsx
  modified:
    - src/app/(marketing)/page.tsx
    - src/components/motion/Reveal.tsx
    - src/components/ui/Button.tsx

key-decisions:
  - "\"View Projects\" links to /work; Phase 2 ships a minimal real placeholder there (heading, one paragraph, Enquire CTA), explicitly commented for Phase 3 (PORT-01..05) to replace"
  - "Added a generic `delay` prop to Reveal rather than a one-off Hero-specific wrapper, keeping the motion primitive layer reusable for future sequenced-reveal needs"
  - "Made Button polymorphic via `as` (same pattern as Typography) instead of introducing a separate LinkButton component, keeping one design-system button implementation for both <button> and next/link Link usage"

patterns-established:
  - "Sequenced multi-element reveals: increasing `delay` values on successive Reveal wrappers within the same section"
  - "Ambient decorative SVG accents: aria-hidden, currentColor stroke, positioned/opacity controlled by the parent via className"

# Metrics
duration: ~25min
completed: 2026-09-09
---

# Phase 2 Plan 02: Homepage Hero & Credentials Summary

**Cinematic GSAP-driven homepage Hero (TextReveal headline + sequenced Reveal copy/CTAs + BlueprintAccent ambient SVG) composed into a full homepage with a credentials strip, plus a real placeholder /work route.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-09-09
- **Tasks:** 3/3
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- Built `Hero` (`src/components/sections/Hero.tsx`): TextReveal headline, staggered Reveal supporting copy and CTA row (via a generic `delay` prop), BlueprintAccent ambient background layer, both CTAs wrapped in `MagneticButton`, no WebGL
- Built `BlueprintAccent` (`src/components/decorative/BlueprintAccent.tsx`): inline-SVG architectural line-art (dimension lines, crosshair, floor-plan outline rectangles), `currentColor` stroke, `aria-hidden="true"`
- Replaced the Phase 1 skeleton homepage with Hero + a "Built on trust" credentials strip (JCT Contract, 10-Year Structural Warranty, 3-Year Workmanship Guarantee), verified present in SSR HTML
- Added a real, on-brand `/work` placeholder page so the "View Projects" CTA resolves to real content instead of a 404, explicitly commented as Phase 3's responsibility to replace

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the cinematic Hero section and its blueprint decorative accent** - `a35bd31` (feat)
2. **Task 2: Compose the full homepage with persistent CTAs and credentials strip** - `c75797b` (feat)
3. **Task 3: Placeholder /work route for the View Projects CTA** - `609abac` (feat)

_No TDD tasks in this plan; all three tasks executed as single feat commits._

## Files Created/Modified
- `src/components/sections/Hero.tsx` - Cinematic hero: BlueprintAccent background, TextReveal headline, sequenced Reveal copy/CTA row, MagneticButton-wrapped CTAs
- `src/components/decorative/BlueprintAccent.tsx` - Reusable ambient architectural line-art SVG accent
- `src/app/(marketing)/page.tsx` - Full homepage: Hero + "Built on trust" credentials strip
- `src/app/(marketing)/work/page.tsx` - Minimal real placeholder /work route (heading, copy, Enquire CTA)
- `src/components/motion/Reveal.tsx` - Added generic `delay` prop for sequencing multiple reveals
- `src/components/ui/Button.tsx` - Made polymorphic via `as` prop so it can render as `next/link`'s `Link`

## Decisions Made
- "View Projects" resolves to `/work`, a minimal real placeholder page (not a 404), explicitly marked in a code comment for Phase 3 (PORT-01..05) to replace with the full filterable gallery — resolves 02-RESEARCH.md Open Question 3.
- `Reveal` gained a generic `delay` prop (seconds) rather than a Hero-specific timing wrapper, keeping the change reusable and consistent with the "content-agnostic, generic-props-only" contract established for `components/motion/` in Phase 1/02-01.
- `Button` became polymorphic via an `as` prop (mirroring `Typography`'s existing `as` override) so CTAs can be real `next/link` `Link`s wrapped in `MagneticButton`, rather than adding a separate `LinkButton` component or duplicating button styling ad hoc in `Hero`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Button had no way to render as a real navigable link**
- **Found during:** Task 1 (Hero CTA implementation)
- **Issue:** The plan requires both CTAs to use `next/link` while also using the `Button` design-system primitive, but `Button` only rendered a `<button>` element (no `href` support), which would have blocked real navigation or forced ad-hoc styling outside the design system.
- **Fix:** Added a polymorphic `as` prop to `Button` (same pattern as `Typography`'s `as` override), typed with `ComponentPropsWithoutRef<T>` so it type-checks correctly for both `<button>` and `Link` usage.
- **Files modified:** `src/components/ui/Button.tsx`
- **Verification:** `npx tsc --noEmit` and `npx eslint` both pass; `npm run build` succeeds with both CTAs rendering as real anchor tags in the compiled output.
- **Committed in:** `a35bd31` (Task 1 commit)

**2. [Rule 3 - Blocking] Reveal had no way to sequence multiple staggered reveals**
- **Found during:** Task 1 (Hero supporting-copy/CTA sequencing requirement)
- **Issue:** The plan requires the headline, supporting copy, and CTA row to reveal in a staggered sequence rather than simultaneously, but `Reveal` had no timing-offset mechanism.
- **Fix:** Added a generic, content-agnostic `delay` prop (seconds) to `Reveal`, passed straight through to the underlying `gsap.from({ delay })` call.
- **Files modified:** `src/components/motion/Reveal.tsx`
- **Verification:** `npx tsc --noEmit` passes; visually the copy and CTA row reveal after the headline's word-mask animation rather than at the same instant.
- **Committed in:** `a35bd31` (Task 1 commit)

**3. [Environment - not a code issue] Concurrent sibling plan execution (02-03, 02-04) on the same working tree**
- **Found during:** Tasks 1-3 (multiple `git status`/build checks)
- **Issue:** Other agent sessions were concurrently executing plans 02-01/02-03/02-04 in the same working directory, at one point reverting my in-progress edit to `Reveal.tsx` (the `delay` prop) between edits, and repeatedly clobbering the shared `.next` build directory mid-build (`MODULE_NOT_FOUND` errors on `next build`).
- **Fix:** Re-applied the `Reveal.tsx` edit immediately before committing Task 1 to close the race window, and re-ran `npm run build` (with `rm -rf .next` once) until a clean build completed; verified final on-disk file contents via `git status`/`cat`/`grep` right before each commit rather than trusting earlier tool-call state.
- **Files modified:** None beyond the already-planned files (re-applied, not new work).
- **Verification:** Final `npx tsc --noEmit`, `npm run build`, and `git log`/`git status` all confirm the intended Task 1-3 file states are committed correctly.
- **Committed in:** N/A (process note; no separate commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking), plus 1 environmental note (concurrent execution, no code impact after re-verification)
**Impact on plan:** Both auto-fixes were necessary prerequisites for the plan's own explicit requirements (real `next/link` CTAs; sequenced, non-simultaneous reveals) — no scope creep beyond what Task 1 already specified. The concurrent-execution issue required extra verification passes but did not change any shipped code beyond what the plan called for.

## Issues Encountered
- Initial attempt to make `Button` polymorphic using a `Record<string, unknown>` index-signature intersection and a `forwardRef`-wrapped generic caused several rounds of TypeScript errors (implicit `any` on `variant`, `Tag` not usable as JSX element type). Resolved by dropping `forwardRef` (no existing caller used a `Button` ref) and using a plain generic function component typed as `ButtonOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>`, which type-checks cleanly for both `<button>` and `Link` usage.
- `npm run build` intermittently failed with `MODULE_NOT_FOUND` (`next-font-manifest.json`, `./611.js`) due to concurrent sibling-plan sessions also running builds against the same `.next` directory in the same working tree. Not a defect in this plan's code — confirmed by a clean `rm -rf .next && npm run build` immediately after, which succeeded and listed `/` and `/work` as static routes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- HOME-01 and HOME-02 are live on the homepage: cinematic scroll-triggered Hero with both CTAs above the fold, and TRUST-02 credentials are present homepage-level (independent of Plan 02-03's per-service detail).
- `/work` has a real, clearly-commented placeholder ready for Phase 3 (PORT-01..05) to fully replace with the filterable portfolio gallery.
- `BlueprintAccent` and the `Reveal` `delay` prop are both reusable primitives available to later phases/plans that want the same ambient decorative texture or sequenced-reveal timing.
- No blockers identified. Note: other 02-xx plans (02-03, 02-04) were executing concurrently in the same working tree during this plan's execution — worth confirming with the user/orchestrator that final `git log` state reflects all three plans' intended commits with no cross-plan file clobbering.
