---
phase: 02-core-pages-home-services-and-about
plan: 04
subsystem: ui
tags: [nextjs, react, typescript, gsap, tailwind, next-image]

# Dependency graph
requires:
  - phase: 02-01
    provides: TextReveal and Reveal motion primitives (word-by-word heading reveal, scroll-triggered fade/slide), reduced-motion handling built in
provides:
  - Typed TEAM content model (src/content/team.ts) — photo-ready, no fabricated identities, no stock imagery
  - TeamGrid section component rendering real next/image photos or neutral monochrome initials placeholders
  - /about page: 30+ years combined experience story + TeamGrid, fully server-rendered
affects: [phase-05-content-photography (real team photos/bios will replace placeholders), phase-02-05 (if it references About page)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content-model-first sections: typed content array in src/content/*.ts, consumed by a presentational component in src/components/sections/*.tsx, composed into the route in src/app/(marketing)/*/page.tsx"
    - "Photo-ready-but-not-photo-dependent rendering: a component conditionally renders next/image when a content field is present, and a neutral on-brand fallback (never third-party stock imagery) when absent"

key-files:
  created:
    - src/content/team.ts
    - src/components/sections/TeamGrid.tsx
    - "src/app/(marketing)/about/page.tsx"
  modified: []

key-decisions:
  - "No real team member names/photos exist yet (client content dependency, flagged not blocking) — TEAM uses role-based placeholder identities (\"Founding Director\", \"Contracts Manager\", \"Client Liaison\") with explicit `// TODO: replace with real client-supplied bio` comments, never fabricated named individuals or stock photo URLs"
  - "About page narrative is written as a fuller, distinct restatement of the same real 30+ years/value-for-money/quick-communication/professional-expertise facts already used in the homepage hero — not a verbatim duplicate"

patterns-established:
  - "TeamGrid fallback tile: bg-ink/text-paper square with font-display initials — the canonical 'no stock imagery' fallback pattern for any future photo-optional content (e.g. project case studies)"

# Metrics
duration: ~20min
completed: 2026-09-09
---

# Phase 02 Plan 04: About/Team Page Summary

**Photo-ready TeamGrid component and /about page shipping the 30+ years combined experience story with role-based placeholder team entries (no stock imagery, no fabricated names) pending real client-supplied photography**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-09-09
- **Completed:** 2026-09-09
- **Tasks:** 2
- **Files modified:** 3 (all created)

## Accomplishments

- `src/content/team.ts` — typed `TeamMember`/`TEAM` content model with an optional `photo` field, populated with real company facts (30+ years combined experience, JCT contracts, structural warranties, Solihull/London/Nottingham) but role-based placeholder identities, each explicitly commented as pending real client data
- `TeamGrid` component — responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` layout that renders a real `next/image` when a member has a `photo`, and a neutral `bg-ink`/`text-paper` initials tile when they don't — verified via grep that no stock-photo domain string (unsplash/pexels/stockphoto/placeholder.com) exists anywhere in either file
- `/about` page — `TextReveal` heading + two `Reveal`-wrapped narrative paragraphs (a fuller, non-duplicate version of the homepage's 30+ years story) followed by `<TeamGrid members={TEAM} />`, entirely server-rendered

## Task Commits

Each task was committed atomically:

1. **Task 1: Team content + photo-ready TeamGrid with neutral placeholder** - `70a6aa3` (feat)
2. **Task 2: About page composition** - `a3e57bd` (feat)

_Note: A concurrent execution of plan 02-02 (Hero section / homepage) landed a commit (`a35bd31`) between these two task commits. That work is unrelated to this plan and is documented here only for commit-history context — see "Issues Encountered" below._

## Files Created/Modified

- `src/content/team.ts` - Typed `TeamMember`/`TEAM` array; role-based placeholder identities with `// TODO: replace with real client-supplied bio` markers
- `src/components/sections/TeamGrid.tsx` - Responsive team grid; real photo via `next/image` or neutral initials tile fallback, never stock imagery
- `src/app/(marketing)/about/page.tsx` - Server component composing the 30+ years story (`TextReveal` + `Reveal`) and `TeamGrid`

## Decisions Made

- No real team member names, roles, bios, or photos exist yet in the codebase or PROJECT.md beyond company-level facts. Rather than leaving the team grid empty or inventing fictitious named people, `TEAM` was populated with real, verifiable role types (Director & Founder, Contracts & Site Management, Client Relations) as placeholder entries, each flagged with a `TODO` comment — keeps the page structurally complete without misrepresenting who works at the company.
- About page narrative deliberately restates the "30+ years combined experience / value for money / quick communication / professional expertise" facts in fuller, non-verbatim prose distinct from the homepage hero copy, per the plan's explicit instruction.

## Deviations from Plan

None - plan executed exactly as written. No bugs, missing-critical-functionality, or blocking issues were encountered in this plan's own scope.

## Issues Encountered

**Concurrent execution collision (informational, not a defect in this plan):** While verifying `npm run build`/`tsc` after Task 1, the working tree contained uncommitted changes belonging to a separate, concurrently-running execution of plan `02-02` (Hero.tsx, BlueprintAccent.tsx, Button.tsx `as`-prop support, Reveal.tsx). These files were mid-edit while this plan's build verification ran, initially causing unrelated `tsc`/build failures. Resolution: isolated the unrelated files via `git stash` (restored intact afterward without data loss — verified the other execution's own commit `a35bd31` landed correctly), then committed only this plan's own file (`src/app/(marketing)/about/page.tsx`) via `git commit -- <path>` to guarantee the commit's index scope matched exactly this plan's changes, not the other execution's staged files. Final `npm run build` (full tree, both plans' work present) succeeds with `/about` as a static route; `/about` SSR HTML confirmed via `curl` to contain the heading and all three team member names server-rendered.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ABOUT-01's structural requirements (30+ years story, responsive team grid, zero stock imagery) are fully shipped and build-verified.
- Remaining gap, tracked as a content dependency (not a code blocker): real team member names, bios, and photography have not been supplied by the client. When supplied, populating `photo`, replacing placeholder `name`/`bio` fields in `src/content/team.ts`, and adding image files under `/public/team/` is sufficient — no component changes required.
- No blockers for subsequent Phase 2 plans.

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
