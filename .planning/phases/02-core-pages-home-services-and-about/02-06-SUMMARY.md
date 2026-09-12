---
phase: 02-core-pages-home-services-and-about
plan: 06
subsystem: routing
tags: [nextjs, redirects, app-router]

# Dependency graph
requires:
  - phase: 02-core-pages-home-services-and-about (02-02)
    provides: "/work placeholder page and Hero.tsx CTA linking to it"
provides:
  - "/projects route (renamed from /work), still the Phase 3 placeholder pending the real filterable gallery"
  - "Permanent redirects: /work -> /projects, /services -> /#services, /about -> /#about"
  - "Removal of dedicated /services, /services/[slug], /about routes ahead of the single-page composition in 02-08"
affects: [02-08, phase-3-portfolio]

# Tech tracking
tech-stack:
  added: []
  patterns: ["next.config.ts redirects() as the single source of truth for retired/renamed routes"]

key-files:
  created: []
  modified:
    - next.config.ts
    - "src/app/(marketing)/projects/page.tsx (renamed from work/page.tsx)"
    - src/components/sections/Hero.tsx
    - "src/app/(marketing)/layout.tsx"

key-decisions:
  - "Nav's 'Work' link in the temporary multi-page layout.tsx updated to /projects to keep it out of the redirect hop, even though the plan's file list only named Hero.tsx — required to satisfy the plan's own href-usage grep verification; full nav rebuild is still 02-08's job"
  - "All three redirects (/work, /services, /about) added to a single redirects() array in next.config.ts across the two tasks, matching the plan's incremental Task 1 / Task 2 split"

patterns-established: []

# Metrics
duration: 12min
completed: 2026-09-09
---

# Phase 2 Plan 06: Routing Cleanup for Single-Page Pivot Summary

**Renamed /work to /projects with a 308 redirect, and deleted /services + /about routes in favor of /#services and /#about redirects, clearing stale multi-page routes ahead of the single-page composition.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-09-09T09:42:00Z
- **Completed:** 2026-09-09T09:54:00Z
- **Tasks:** 2
- **Files modified:** 7 (4 in Task 1, 4 in Task 2, next.config.ts shared across both)

## Accomplishments
- `/work` renamed to `/projects` (placeholder content untouched, still Phase 3's to replace) with a permanent 308 redirect from the old path
- `Hero.tsx`'s "View Projects" CTA and the marketing layout nav's "Work" link both point directly at `/projects`, avoiding the redirect hop
- Dedicated `/services`, `/services/[slug]`, and `/about` routes deleted; both paths now 308-redirect to their future on-page anchors (`/#services`, `/#about`)
- Reusable content/components (`content/services.ts`, `content/team.ts`, `TrustBadges`, `TeamGrid`) verified untouched on disk for Wave 2 (02-07/02-08) to consume

## Task Commits

1. **Task 1: Rename /work to /projects and redirect the old path** - `c09a052` (feat)
2. **Task 2: Drop dedicated /services and /about routes with defensive redirects** - `85b62f1` (feat)

_No TDD tasks in this plan; both are pure route-surgery `type="auto"` tasks._

## Files Created/Modified
- `next.config.ts` - Added `redirects()`: `/work` -> `/projects`, `/services` -> `/#services`, `/about` -> `/#about` (all permanent/308)
- `src/app/(marketing)/projects/page.tsx` - Renamed from `work/page.tsx`; component renamed `WorkPage` -> `ProjectsPage`, placeholder copy/CTA unchanged
- `src/components/sections/Hero.tsx` - "View Projects" CTA `href` changed from `/work` to `/projects`
- `src/app/(marketing)/layout.tsx` - Nav's "Work" link `href` changed from `/work` to `/projects`
- `src/app/(marketing)/services/page.tsx`, `src/app/(marketing)/services/[slug]/page.tsx`, `src/app/(marketing)/about/page.tsx` - Deleted (content moves to condensed single-page sections in 02-07/02-08)

## Decisions Made
- Fixed the marketing layout's nav "Work" link (`href="/work"` -> `/projects`) even though only `Hero.tsx` was named in the plan's Task 1 file list — the plan's own verification step (`grep -rn "\"/work\""`) would otherwise fail, and leaving an internal nav link pointed at a redirecting URL was a bug per deviation Rule 1. Full nav rebuild remains scoped to 02-08.
- Split the `next.config.ts` `redirects()` array additions strictly per-task (Task 1 commit adds only the `/work` entry, Task 2 commit adds `/services` and `/about`) to keep each commit's diff matching its task's stated scope, rather than writing all three redirects in one shot.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Marketing layout nav still linked to `/work` after the rename**
- **Found during:** Task 1 (Rename /work to /projects)
- **Issue:** `src/app/(marketing)/layout.tsx`'s `NAV_LINKS` array had `{ href: "/work", label: "Work" }`, which would have forced every in-app nav click through the new 308 redirect and left a stray `"/work"` href match, failing the task's own verification grep.
- **Fix:** Changed the nav entry's `href` to `/projects` (label left as "Work" — Wave 2's 02-08 owns the nav content/label rebuild for the single-page architecture).
- **Files modified:** `src/app/(marketing)/layout.tsx`
- **Verification:** `grep -rn "\"/work\"" src/` returns no matches; `npm run build` succeeds.
- **Committed in:** `c09a052` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary to satisfy the plan's own stated verification criteria; no scope creep — nav rebuild remains 02-08's responsibility.

## Issues Encountered
- A stale `.next` build cache (from a concurrently-running 02-07 execution in the same working tree, per the known Phase 2 concurrent-session caveat) produced a transient `PageNotFoundError: Cannot find module for page: /_document` on the first `npm run build` after Task 2's file deletions. Resolved by removing `.next` and rebuilding cleanly; not a code issue.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All stale multi-page routes from the pre-pivot Phase 2 plans are gone or redirected; `/projects`, `/work` (redirect), `/services` (redirect), `/about` (redirect) all verified via `npm run build` route listing and `curl -I` 308 checks against a production build.
- `content/services.ts`, `content/team.ts`, `TrustBadges`, and `TeamGrid` confirmed present and untouched, ready for 02-07's condensed sections (already landed in parallel, see `8afd98b`) and 02-08's single-page composition.
- No blockers for 02-08 (single-page composition + nav/scroll-spy), which will also need to finish the nav rebuild (labels/anchors) that this plan intentionally left minimal.

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
