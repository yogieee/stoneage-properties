---
phase: 01-foundation-architecture-design-system-and-content-layer
plan: 04
subsystem: ui
tags: [design-system, tailwind-v4, typography, nextjs-app-router, ssr, gsap, reveal]

# Dependency graph
requires:
  - phase: 01-foundation-architecture-design-system-and-content-layer (plan 01)
    provides: Next.js App Router scaffold, root layout with next/font, Tailwind v4 @theme design tokens, (marketing) route group
  - phase: 01-foundation-architecture-design-system-and-content-layer (plan 02)
    provides: "Reveal motion primitive (gsap.matchMedia reduced-motion branch) and SmoothScrollProvider mounted at root layout"
provides:
  - "Typography.tsx / Button.tsx: design-system UI primitives consuming only project @theme semantic tokens (no raw Tailwind gray/slate utilities)"
  - "/style-guide: living reference page auditing the full color palette, editorial type scale, and button variants, with a Reveal-wrapped demo section"
  - "/ (homepage): Server Component skeleton rendering real hardcoded Stoneage Properties copy in server HTML, paragraph wrapped in Reveal"
  - "Human-verified proof that all three Phase 1 success criteria (SSR content, design-system consistency, reduced-motion behavior) hold on real composed output, not just in isolation"
affects: [02-core-pages-home-services-about]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "UI primitives (src/components/ui/) consume only semantic @theme tokens (text-ink, text-ink-muted, bg-paper, text-display-*, text-body-*) — never raw Tailwind gray/slate/zinc utilities"
    - "/style-guide acts as the living audit reference every later-phase component should visually match"

key-files:
  created:
    - src/components/ui/Typography.tsx
    - src/components/ui/Button.tsx
    - src/app/(marketing)/style-guide/page.tsx
  modified:
    - src/app/(marketing)/page.tsx

key-decisions:
  - "Homepage kept intentionally as a minimal skeleton (single section, one heading, one Reveal-wrapped paragraph) — full homepage layout/design is explicitly Phase 2 scope; this plan only had to prove the SSR + motion architectural loop on real copy"
  - "Style-guide page built as a Server Component with no client boundary at the page level, so Reveal remains the only client leaf, matching the pattern established in Plan 01-02"

patterns-established:
  - "Design-system primitives (Typography, Button) are the single source of truth for token usage; any component introduced in Phase 2+ that needs text or button styling should reuse these primitives or match /style-guide's tokens exactly, not redeclare raw utility classes"

# Metrics
duration: ~15min
completed: 2026-09-08
---

# Phase 1 Plan 04: Style-Guide, Skeleton Homepage & Phase 1 Verification Summary

**Typography/Button design-system primitives, a /style-guide audit page, and a Server Component homepage rendering real Stoneage Properties copy wrapped in Reveal — human-verified against all three Phase 1 ROADMAP success criteria (SSR content, design consistency, reduced motion).**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-09-08 (following 01-02 completion)
- **Completed:** 2026-09-08
- **Tasks:** 3/3 (2 auto tasks + 1 human-verify checkpoint)
- **Files modified:** 4 (3 created, 1 modified)

## Accomplishments
- Built `Typography.tsx` and `Button.tsx` design-system primitives consuming only project `@theme` semantic tokens (no raw `text-gray-*`/`bg-slate-*` utilities anywhere in the design system)
- Built `/style-guide`, a Server Component living reference page displaying every color-token swatch, the full editorial type scale, and button variants, with a `Reveal`-wrapped demo section for the reduced-motion criterion
- Rewrote `/` (homepage) as a Server Component skeleton rendering real hardcoded Stoneage Properties copy (30+ years combined experience, service areas: Solihull, London, Nottingham) directly in server-rendered HTML, with the paragraph wrapped in `Reveal`
- User explicitly verified all three Phase 1 success criteria against the running dev server and responded "approved":
  1. SSR: homepage heading/paragraph text present in server-rendered HTML (view-source, no JS execution required)
  2. Design-system consistency: `/style-guide` renders the monochrome palette and editorial type scale consistently
  3. Reduced motion: toggling OS/DevTools `prefers-reduced-motion: reduce` on the `Reveal`-wrapped section removes the scroll-triggered animation with no retrofitted fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: Build design-system UI primitives and the style-guide page** - `6d8b5ad` (feat)
2. **Task 2: Build the skeleton homepage proving SSR + motion together on real hardcoded content** - `f5960de` (feat)
3. **Task 3: Checkpoint (human-verify)** - no code commit; user verified all three Phase 1 success criteria live against the dev server and responded "approved"

**Plan metadata:** (this commit, following SUMMARY/STATE update)

## Files Created/Modified
- `src/components/ui/Typography.tsx` - Design-system typography primitives (headings, body variants) consuming `@theme` tokens
- `src/components/ui/Button.tsx` - Design-system button primitive with hover micro-interaction, using `@theme` tokens (final magnetic/hover treatment deferred to Phase 2's MOTION-02)
- `src/app/(marketing)/style-guide/page.tsx` - Server Component living reference auditing the full color palette, type scale, and button variants, with a `Reveal`-wrapped section
- `src/app/(marketing)/page.tsx` - Rewritten as a Server Component skeleton homepage with real Stoneage Properties copy, paragraph wrapped in `Reveal`

## Decisions Made
- Homepage intentionally minimal (single section) — full homepage design/layout is Phase 2 scope (HOME-01/HOME-02); this plan's only job was proving SSR + motion compose correctly on real content
- `/style-guide` established as the ongoing visual audit reference for all future components, per research guidance to avoid design-system drift across later phases

## Deviations from Plan

None - plan executed exactly as written. Both auto tasks matched their `<action>`/`<verify>`/`<done>` criteria; the checkpoint was resolved with user approval on the first pass, no issues reported for any of the three success criteria.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 1 is complete.** All three plans delivered:
- 01-01: Next.js 15.5 + Tailwind v4 scaffold, design tokens, marketing route group
- 01-02: GSAP/Lenis motion primitives (Reveal, SmoothScrollProvider) with reduced-motion built in
- 01-04: Design-system UI primitives, style-guide + skeleton homepage, human-verified against all three ROADMAP.md Phase 1 success criteria

(Plan 01-03, a Sanity CMS integration, was built then fully reverted on 2026-09-08 after the client decided v1 ships without a CMS — a custom AWS/Terraform backend is planned for v2. See PROJECT.md Key Decisions.)

- The `components/ui/` design-system primitives and `/style-guide` reference are ready for Phase 2 to build real homepage/service/about pages against without re-litigating token usage.
- The `components/motion/` primitives (`Reveal`, `SmoothScrollProvider`) are proven on real content and ready for Phase 2's cinematic hero/scroll work (MOTION-01, MOTION-02).
- No blockers carried forward from this plan. The pre-existing WebGL/3D hero scope question (STATE.md) remains open and should be resolved before Phase 2 if a 3D hero is desired.

---
*Phase: 01-foundation-architecture-design-system-and-content-layer*
*Completed: 2026-09-08*
