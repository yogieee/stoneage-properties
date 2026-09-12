---
phase: 01-foundation-architecture-design-system-and-content-layer
plan: 02
subsystem: motion
tags: [gsap, gsap-scrolltrigger, gsap-react, lenis, prefers-reduced-motion, nextjs, accessibility]

# Dependency graph
requires:
  - phase: 01-foundation-architecture-design-system-and-content-layer (plan 01)
    provides: Next.js App Router scaffold, root layout with next/font, Tailwind v4 design tokens, (marketing) route group
provides:
  - "Reveal: content-agnostic scroll-reveal primitive with prefers-reduced-motion handling built into its own implementation"
  - "SmoothScrollProvider: root-mounted Lenis smooth scroll synced to GSAP's ticker/ScrollTrigger"
  - "src/lib/gsap.ts: single client-only module registering ScrollTrigger once, canonical import point for gsap"
affects: [01-03, 01-04, 02-motion-and-page-composition]

# Tech tracking
tech-stack:
  added: ["gsap@3.15.0", "@gsap/react@2.1.2", "lenis@1.3.26"]
  patterns:
    - "gsap.matchMedia() branching on prefers-reduced-motion, nested inside useGSAP(), with mm.revert() in useGSAP's own cleanup (not inside the matchMedia handler's returned function)"
    - "All GSAP/ScrollTrigger imports go through src/lib/gsap.ts (never import gsap/ScrollTrigger directly in component files) to guarantee single plugin registration"
    - "Motion primitives (components/motion/) accept only generic/children props, never domain types — content composes around primitives, primitives never know about content"

key-files:
  created:
    - src/lib/gsap.ts
    - src/components/motion/Reveal.tsx
    - src/components/motion/SmoothScrollProvider.tsx
  modified:
    - package.json
    - package-lock.json
    - src/app/layout.tsx

key-decisions:
  - "Lenis mounted via lenis/react's ReactLenis with root (passthrough, no wrapper divs) rather than manual instantiation — confirmed via installed package source that root mode renders children directly, preserving SSR HTML structure"
  - "Lenis's autoRaf disabled (options: { autoRaf: false }); GSAP's ticker (gsap.ticker.add) drives the frame loop instead, keeping ScrollTrigger positions in sync with smoothed scroll per research Pattern 2"
  - "No custom duration/easing passed to Lenis — config is options: { autoRaf: false } only, so Lenis's own default reduceMotion: true behavior is never overridden"

patterns-established:
  - "Reduced-motion handling lives inside each motion primitive's own implementation (gsap.matchMedia() for Reveal; Lenis's built-in default for scroll) — never as an external per-usage wrapper"

# Metrics
duration: 20min
completed: 2026-09-08
---

# Phase 1 Plan 02: GSAP/Lenis Motion Primitive Layer Summary

**Reveal and SmoothScrollProvider motion primitives built on gsap@3.15/@gsap/react/lenis@1.3, with reduced-motion handling structurally built into each primitive (gsap.matchMedia() branch inside Reveal; Lenis's untouched reduceMotion default for scroll), verified via Playwright's emulated prefers-reduced-motion contexts against live rendered output.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-09-08T15:12:47+01:00 (following 01-01 completion)
- **Completed:** 2026-09-08T15:19:09+01:00
- **Tasks:** 2/2
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- Installed and verified the motion stack (gsap 3.15.0, @gsap/react 2.1.2, lenis 1.3.26 — all match research version pins)
- Built `src/lib/gsap.ts` as the single client-only ScrollTrigger registration point (confirmed exactly one `gsap.registerPlugin` call project-wide)
- Built `Reveal.tsx`: a fully content-agnostic scroll-reveal primitive using `useGSAP()` + `gsap.matchMedia()`, verified via Playwright with emulated `prefers-reduced-motion: reduce` (content appears instantly, opacity 1, no transform) vs `no-preference` (fade/slide-in animates progressively on scroll into view)
- Built `SmoothScrollProvider.tsx`, mounted once at the root layout, syncing Lenis to GSAP's ticker/ScrollTrigger without overriding Lenis's default reduced-motion behavior
- Confirmed the motion layer stays client-scoped at the leaf: full server-rendered marketing HTML (headings, nav, footer contact info, body copy) still present in `curl` output after wiring `SmoothScrollProvider` into root layout

## Task Commits

Each task was committed atomically:

1. **Task 1: Install GSAP/Lenis and build the Reveal primitive with reduced-motion built in** - `0147827` (feat)
2. **Task 2: Build SmoothScrollProvider and wire into root layout** - `59990e6` (feat)

**Plan metadata:** (this commit, following SUMMARY/STATE update)

## Files Created/Modified
- `src/lib/gsap.ts` - Client-only module registering ScrollTrigger once; canonical import point for `gsap`/`ScrollTrigger` project-wide
- `src/components/motion/Reveal.tsx` - Content-agnostic scroll-reveal primitive; `gsap.matchMedia()` branches reduced-motion (instant `gsap.set`) vs full animation (`gsap.from` + ScrollTrigger), cleanup via `mm.revert()` inside `useGSAP`'s own returned cleanup
- `src/components/motion/SmoothScrollProvider.tsx` - Mounts Lenis once via `ReactLenis root`, syncs to `gsap.ticker` (autoRaf disabled) and calls `ScrollTrigger.update()` via `useLenis`'s scroll callback; minimal config preserves Lenis's default `reduceMotion: true`
- `src/app/layout.tsx` - Wraps `{children}` in `SmoothScrollProvider` at the root
- `package.json` / `package-lock.json` - Added `gsap`, `@gsap/react`, `lenis`

## Decisions Made
- Verified `lenis/react`'s current API surface directly against the installed package's `.d.ts`/`.mjs` source (not just the README) before writing `SmoothScrollProvider`, per research's Open Question flag that Lenis ships frequently — confirmed `ReactLenis`, `useLenis(callback, deps, priority)`, and that `root` mode renders children directly with no wrapper divs (critical for keeping SSR content unaffected)
- Disabled Lenis's `autoRaf` and drove its `raf()` loop from `gsap.ticker` instead, so ScrollTrigger and Lenis stay frame-synced (per research Pattern 2), rather than running two independent rAF loops
- Used Playwright (installed transiently via `npm install --no-save`, removed after verification) with `newContext({ reducedMotion })` to emulate the OS-level `prefers-reduced-motion` toggle programmatically, since no interactive OS is available in this environment — read computed/inline styles on the wrapper element across sampled frames to confirm the reduce-motion branch sets final state instantly while the no-preference branch animates opacity/transform progressively

## Deviations from Plan

None - plan executed exactly as written. Both tasks matched their `<action>`/`<verify>`/`<done>` criteria; no bugs, missing critical functionality, blocking issues, or architectural changes were encountered.

## Issues Encountered
- Initial Playwright verification attempt targeted the wrong DOM node (`data-testid` was on the inner `<p>`, but GSAP animates the `Reveal` wrapper `<div ref>`) — corrected the test script to read the wrapper's `style` attribute; this was a test-script mistake, not a Reveal implementation issue, and required no changes to `Reveal.tsx` itself.
- `lenis/react`'s exact API needed source-level confirmation (research flagged this as MEDIUM confidence) — resolved by reading the installed package's `.d.ts` and `.mjs` directly rather than guessing from the illustrative research code sample.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `Reveal` and `SmoothScrollProvider` are ready to wrap real content in Plan 01-04's style-guide and skeleton homepage without any changes to primitive internals.
- The `components/motion/` pattern (content-agnostic, reduced-motion built in) is established and should be followed for any future primitives (e.g. `Parallax`, `PinnedSection`) added in later phases.
- No blockers. The WebGL/3D hero scope note from STATE.md remains open and unaffected by this plan (GSAP/Lenis layer is 2D-scroll-only, no `three`/`@react-three/fiber` added).

---
*Phase: 01-foundation-architecture-design-system-and-content-layer*
*Completed: 2026-09-08*
