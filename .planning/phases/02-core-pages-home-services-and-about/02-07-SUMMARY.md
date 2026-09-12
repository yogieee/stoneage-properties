---
phase: 02-core-pages-home-services-and-about
plan: 07
subsystem: ui
tags: [react, nextjs, gsap, condensed-sections, single-page]

# Dependency graph
requires:
  - phase: 02-04
    provides: content/team.ts (TEAM), TeamGrid.tsx neutral-placeholder-tile pattern
  - phase: 02-03
    provides: content/services.ts (SERVICES) typed content array
provides:
  - "ServicesSection.tsx: condensed services teaser (name/summary/warranty-label only) for the single-page homepage"
  - "WorkPreviewSection.tsx: honest no-fabricated-data work teaser linking to /projects"
  - "TeamStrip.tsx: condensed team strip (name/role only, no bio) as a sibling to TeamGrid"
  - "AboutSection.tsx: condensed About section composing full brand-story copy + TeamStrip"
affects: [02-08 single-page composition, Phase 3 portfolio (WorkPreviewSection replacement)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Section components render only their content (a wrapping <div>), not the <section> element itself — the composing page owns the <section id=...> for anchor/nav wiring"
    - "Condensed teaser variant lives as a new sibling component (TeamStrip next to TeamGrid) rather than modifying the original full-detail component"

key-files:
  created:
    - src/components/sections/ServicesSection.tsx
    - src/components/sections/WorkPreviewSection.tsx
    - src/components/sections/TeamStrip.tsx
    - src/components/sections/AboutSection.tsx
  modified: []

key-decisions:
  - "Warranty label rendered directly via Typography body-sm instead of reusing TrustBadges (which always renders both label+detail) — avoided modifying a component built for a different context"
  - "WorkPreviewSection does not fabricate placeholder project cards since content/projects.ts does not exist yet — renders an honest 'archive being finalized' teaser + /projects CTA, same honesty precedent as the prior /work placeholder page"

patterns-established:
  - "Content-model-first: typed content array (SERVICES, TEAM) -> presentational server component, no new data model changes in this plan"

# Metrics
duration: 12min
completed: 2026-09-09
---

# Phase 2 Plan 07: Condensed Section Components Summary

**Four presentational server components (ServicesSection, WorkPreviewSection, TeamStrip, AboutSection) built for the single-page homepage, reusing existing `content/services.ts` and `content/team.ts` with no data model changes.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-09-09T09:42:00Z
- **Completed:** 2026-09-09T09:54:00Z
- **Tasks:** 2
- **Files modified:** 4 created

## Accomplishments
- `ServicesSection` renders all 7 `SERVICES` as staggered `Reveal` cards showing name/summary/warranty-label only (full `description`/`warranty.detail` reserved for Phase 3 case studies)
- `WorkPreviewSection` honestly teases the work archive (no fabricated project cards) with a `MagneticButton`-wrapped CTA to `/projects`
- `TeamStrip` created as a new sibling to `TeamGrid` — same neutral photo-or-initials contract, denser layout, name+role only (no long-form bio text)
- `AboutSection` composes the full, unabridged brand-story copy (adapted from the original `/about` page) with `TeamStrip`

## Task Commits

Each task was committed atomically:

1. **Task 1: ServicesSection and WorkPreviewSection** - `b1be8bc` (feat)
2. **Task 2: TeamStrip and AboutSection** - `8afd98b` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/components/sections/ServicesSection.tsx` - Condensed services teaser grid, maps `SERVICES`
- `src/components/sections/WorkPreviewSection.tsx` - Honest work-archive teaser linking to `/projects`
- `src/components/sections/TeamStrip.tsx` - Condensed team strip (name/role only), sibling to `TeamGrid`
- `src/components/sections/AboutSection.tsx` - Full brand-story copy + `TeamStrip` composition

## Decisions Made
- Rendered the warranty label directly with `Typography variant="body-sm"` rather than reusing `TrustBadges` (which always renders `label` + `detail` together) — simpler than adding an optional-`detail` variant to a component built for the service detail page's different context.
- `WorkPreviewSection` intentionally has zero fabricated project data — `content/projects.ts` doesn't exist yet (Phase 3 scope). This mirrors the honesty precedent already set by the original `/work` (now `/projects`) placeholder page from 02-02.
- `TeamStrip` duplicates ~15 lines of `initialsFor()` + placeholder-tile logic from `TeamGrid` rather than extracting a shared util — the plan's own threshold ("if it feels like more than ~10 lines of duplication, extract") was borderline; kept as direct duplication since both components' JSX differs enough (tile size, layout) that a shared util would only cover the initials function, not meaningfully reduce duplication.

## Deviations from Plan

None - plan executed exactly as written. Both tasks matched their `<action>` specs; all `<done>` and `<verify>` criteria (tsc clean, no `.description`/`.warranty.detail` references, no `bio` substring in `TeamStrip.tsx`, no stock-photo domain strings, no `"use client"` in any of the four files) were confirmed via grep before each commit.

### Process note (concurrent execution)

This plan ran while a separate `02-06` (routing cleanup) session was concurrently active in the same working tree, per the known risk documented in `02-02-SUMMARY.md`. Two concurrency artifacts were observed and handled:

1. Task 1's commit (`b1be8bc`) unintentionally picked up an already-staged `work/ → projects/` route rename from the concurrent 02-06 session (git includes all staged changes in a commit, not just files just-added). The rename itself is correct/expected 02-06 output — no content was lost or altered, but it means that specific route-rename is attributed to the 02-07 commit rather than a 02-06 commit.
2. Before Task 2's commit, three more 02-06 deletions (`about/page.tsx`, `services/page.tsx`, `services/[slug]/page.tsx`) were found already staged. This time they were explicitly unstaged (`git reset HEAD --`) before committing only the two 02-07 files, then re-staged afterward to restore the concurrent session's in-progress state untouched.

No functional impact on 02-07's deliverables. Flagging for the same reason 02-02-SUMMARY.md did: future phases should avoid running multiple `execute-phase` sessions against the same working tree concurrently.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All four condensed section components exist, compile cleanly (`tsc --noEmit`, `npm run lint` both pass), and have zero dependency on `02-06`'s route changes (purely presentational, composable into any page)
- Ready for `02-08` to import and compose `ServicesSection`, `WorkPreviewSection`, and `AboutSection` into the single-page `/` route with `<section id="...">` wrappers and scroll-spy nav wiring
- No blockers

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
