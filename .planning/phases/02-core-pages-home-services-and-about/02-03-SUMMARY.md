---
phase: 02-core-pages-home-services-and-about
plan: 03
subsystem: ui
tags: [nextjs, typescript, gsap, generateStaticParams, content-modeling]

# Dependency graph
requires:
  - phase: 02-01
    provides: TextReveal and Reveal motion primitives used on services pages
provides:
  - Typed SERVICES content array (src/content/services.ts) covering all 7 Stoneage services with real warranty copy
  - Reusable TrustBadges component for rendering warranty/credential content
  - Statically generated services index (/services) and per-service detail pages (/services/[slug]) via generateStaticParams
affects: [phase-03-portfolio-and-project-pages, phase-05-seo-hardening]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single typed content array (content/services.ts) + one dynamic [slug]/page.tsx route template + generateStaticParams, instead of hand-built per-service page.tsx files — makes structural drift (e.g. a missing warranty block) a type error, not a shipped gap"
    - "Content-agnostic section components (TrustBadges) accept a generic { label, detail } shape rather than importing domain content types directly"

key-files:
  created:
    - src/content/services.ts
    - src/components/sections/TrustBadges.tsx
    - "src/app/(marketing)/services/page.tsx"
    - "src/app/(marketing)/services/[slug]/page.tsx"
  modified: []

key-decisions:
  - "5 of 7 services (Renovations, Conversions, Basements, Refurbishments, Barn Conversions) use the standard '3-Year Workmanship Guarantee' baseline since REQUIREMENTS.md only specifies distinct warranty language for New Builds (JCT + 10yr) and Extensions (3yr) explicitly — no fabricated certifications added"
  - "TrustBadges takes a generic { label, detail } warranty shape rather than importing the Service type, keeping components/sections/ content-agnostic to the specific content module"

patterns-established:
  - "generateStaticParams + async params (Next.js 15) + notFound() is the template for all future dynamic detail routes (e.g. project case studies in Phase 3)"

# Metrics
duration: 25min
completed: 2026-09-09
---

# Phase 2 Plan 03: Services Pages Summary

**7 statically generated service pages driven by one typed content array (`content/services.ts`) and one `[slug]/page.tsx` template, each rendering real per-service warranty content via a shared `TrustBadges` component.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-09-09T08:23:00Z
- **Completed:** 2026-09-09T08:48:33Z
- **Tasks:** 2
- **Files modified:** 4 created

## Accomplishments
- All 7 real Stoneage services (New Builds, Renovations, Extensions, Conversions, Basements, Refurbishments, Barn Conversions) now have dedicated, statically generated pages at `/services/[slug]`
- Each service page displays real, non-fabricated warranty/trust content (JCT + 10yr warranty for New Builds, 3yr workmanship guarantee baseline elsewhere) via a shared `TrustBadges` component — structurally guaranteed consistent across all 7 pages by the single route template
- `/services` index page links to all 7 detail pages
- Invalid slugs correctly render Next.js's not-found page (verified: `/services/nonexistent` returns HTTP 404)

## Task Commits

Each task was committed atomically:

1. **Task 1: Typed services content + TrustBadges component** - `6ac3133` (feat)
2. **Task 2: Services index + dynamic [slug] detail template** - `b23826b` (feat)

## Files Created/Modified
- `src/content/services.ts` - `Service` type + `SERVICES` array with 7 real services, each with slug/name/summary/description/warranty
- `src/components/sections/TrustBadges.tsx` - Content-agnostic warranty badge, renders `{ label, detail }` prominently with semantic tokens
- `src/app/(marketing)/services/page.tsx` - Services index listing all 7 as linked cards, `TextReveal` heading
- `src/app/(marketing)/services/[slug]/page.tsx` - Dynamic detail template: `generateStaticParams`, async `params`, `notFound()` on invalid slug, `generateMetadata` for per-service `<title>`

## Decisions Made
- Applied the standard 3-year workmanship guarantee as the baseline warranty for the 5 services REQUIREMENTS.md doesn't call out a distinct warranty for, rather than inventing distinct certifications — keeps content accurate to what's evidenced in project docs (TRUST-02).
- `TrustBadges` accepts a generic `{ label, detail }` shape instead of importing `Service` directly, preserving the project's established convention that `components/sections/` (and especially anything animation-adjacent) stays reusable rather than hard-coupled to one content module.

## Deviations from Plan

None — plan executed exactly as written. (Note: a concurrent execution of plan 02-02/02-04 was running in parallel against the same working tree during this plan's Task 2 verification, causing transient, self-resolving `npm run build`/`tsc` failures in unrelated files — `src/components/ui/Button.tsx`, `src/components/sections/Hero.tsx` — while that other agent's edits were in flight. No changes to those files were made as part of this plan; once that parallel work was committed, `npm run build` passed cleanly on the first attempt with no fixes needed from this plan.)

## Issues Encountered
- Transient build/type-check failures during Task 2 verification traced to a different, concurrently-running plan execution (02-02/02-04) editing `Button.tsx`/`Hero.tsx` in the same working directory — not a defect in this plan's own files. Resolved by waiting for that execution's commits to land, then re-running `npm run build`, which succeeded.

## Next Phase Readiness
- `generateStaticParams` + `[slug]/page.tsx` + `notFound()` pattern established here is directly reusable for Phase 3's project case study pages.
- Services content/pages are complete and independent of Home (02-02) and About (02-04) work, which were completed concurrently by other plan executions during this session.

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
