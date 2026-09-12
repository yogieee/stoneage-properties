---
phase: 01-foundation-architecture-design-system-and-content-layer
plan: 01
subsystem: ui
tags: [nextjs, typescript, tailwindcss-v4, next-font, app-router]

# Dependency graph
requires: []
provides:
  - Next.js 15.5.x + TypeScript + Tailwind v4 project scaffold (App Router, src/ dir, @/* alias)
  - Monochrome/editorial @theme design-token system in globals.css
  - Self-hosted editorial typography (Fraunces display + Inter body) via next/font/google
  - cn() className helper (clsx + tailwind-merge) in src/lib/utils.ts
  - (marketing) route group with server-rendered nav/footer chrome, isolated from future /studio route
affects: [01-02, 01-03, 01-04]

# Tech tracking
tech-stack:
  added: [next@15.5.25, react@19.1.0, tailwindcss@4, clsx, tailwind-merge, prettier, prettier-plugin-tailwindcss]
  patterns:
    - "Semantic design tokens (--color-ink, --color-paper, --text-display-*) instead of raw Tailwind gray/slate/zinc utilities"
    - "next/font/google only for typefaces, applied as CSS variables on <html>, never a <link> tag"
    - "Route groups: (marketing) holds all public pages/chrome, kept structurally separate from future /studio admin route"

key-files:
  created:
    - src/lib/utils.ts
    - src/app/(marketing)/layout.tsx
    - src/app/(marketing)/page.tsx
    - .prettierrc
  modified:
    - package.json
    - src/app/globals.css
    - src/app/layout.tsx

key-decisions:
  - "Pinned next@15.5.25 / react@19.1.0 (15.5 LTS line) instead of accepting an unverified 'latest' that could resolve to Next 16 canary"
  - "Chose Fraunces (display) + Inter (body) as the editorial typeface pairing — swappable later since next/font usage is centralized in root layout.tsx"

patterns-established:
  - "Design tokens defined once in a single @theme block in globals.css; components must reach for semantic classes (text-ink, bg-paper) not raw Tailwind color scales"
  - "cn() from src/lib/utils.ts is the standard className-merging utility for all future variant-driven components"

# Metrics
duration: 15min
completed: 2026-09-08
---

# Phase 1 Plan 01: Foundation Scaffold Summary

**Next.js 15.5.25 + TypeScript + Tailwind v4 project with a monochrome/editorial `@theme` design-token system, self-hosted Fraunces/Inter typography, and a `(marketing)` route group shell.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-09-08T13:58:23Z
- **Completed:** 2026-09-08T14:11:43Z
- **Tasks:** 3
- **Files modified:** 22 (19 scaffolded + 3 hand-authored/edited)

## Accomplishments

- Working Next.js 15.5.25 App Router project (TypeScript, Tailwind v4, `src/` dir, `@/*` alias) that builds and runs cleanly
- Monochrome/neutral semantic color palette + editorial type scale defined as a single `@theme` block in `globals.css`
- Fraunces (display) + Inter (body) self-hosted via `next/font/google`, zero layout shift (`display: "swap"`)
- `(marketing)` route group with server-rendered nav (Home, Work, About, Services, Contact) and footer (real office/contact copy), structurally isolated from the future `/studio` Sanity route

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 15.5 + TypeScript + Tailwind v4 project** - `06905c1` (chore)
2. **Task 2: Define monochrome/editorial design tokens and self-hosted typography** - `d7d4aba` (feat)
3. **Task 3: Create (marketing) route group with shared chrome** - `2219e60` (feat)

**Plan metadata:** (this commit, docs: complete plan)

## Files Created/Modified

- `package.json` - Renamed to `stoneage-architecture`, pinned next@15.5.25/react@19.1.0, added clsx/tailwind-merge/prettier deps
- `src/lib/utils.ts` - `cn()` helper (clsx + tailwind-merge)
- `.prettierrc` - prettier-plugin-tailwindcss config for consistent class ordering
- `src/app/globals.css` - `@theme` block: monochrome palette (ink/paper/line) + editorial type scale
- `src/app/layout.tsx` - Fraunces + Inter via `next/font/google`, real Stoneage Properties metadata
- `src/app/(marketing)/layout.tsx` - Nav/footer chrome shell (Server Component)
- `src/app/(marketing)/page.tsx` - Placeholder homepage (real skeleton comes in Plan 04)
- `src/app/page.tsx` - Deleted (superseded by `(marketing)/page.tsx`, avoiding duplicate-route build error)

## Decisions Made

- Verified `next@15.5.25` / `react@19.1.0` explicitly via `npm view` before scaffolding, per research guidance not to trust an unverified "latest" resolving to Next 16's canary React line
- Selected Fraunces + Inter as the initial editorial typeface pairing (bold serif display / clean grotesk body) — acceptable placeholder per plan, swappable later since font loading is centralized in `layout.tsx`
- Root `layout.tsx` carries real Stoneage Properties metadata (title/description) rather than Next.js boilerplate, even though full metadata polish is technically Task 3 scope — set once during Task 2's font work since both touch the same file

## Deviations from Plan

**1. [Rule 3 - Blocking] `create-next-app` refused to scaffold into a non-empty directory**

- **Found during:** Task 1
- **Issue:** Repo root already contains `.planning/`, and `create-next-app` (even with `--yes`) aborts if it detects existing files/directories that could conflict
- **Fix:** Scaffolded into an isolated scratch directory, then moved all generated files/directories into the repo root, preserving `.planning/`
- **Files modified:** N/A (workaround, not a code change)
- **Verification:** `npm run build` and `npm run dev` succeeded post-move; git history shows clean addition of scaffold files
- **Committed in:** `06905c1` (Task 1 commit)

**2. [Rule 3 - Blocking] Stale `.next/types` cache caused false TypeScript errors after deleting `src/app/page.tsx`**

- **Found during:** Task 3
- **Issue:** `npx tsc --noEmit` reported `Cannot find module '../../../src/app/page.js'` after moving the homepage into the `(marketing)` route group and deleting the root `page.tsx`, because Next's generated route types weren't regenerated
- **Fix:** Removed the `.next` build cache (`rm -rf .next`) before re-running typecheck/build
- **Files modified:** None (cache-only, `.next` is gitignored)
- **Verification:** `npx tsc --noEmit` and `npm run build` both passed cleanly afterward
- **Committed in:** N/A (no source change; verified before `2219e60`)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking issues, environment/tooling only)
**Impact on plan:** No scope creep — both deviations were tooling workarounds required to execute the plan as written, not functional changes.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Foundation is ready for Plan 02 (GSAP/Lenis motion), Plan 03 (Sanity `/studio` route as a sibling to `(marketing)`), and Plan 04 (style-guide + real skeleton homepage)
- `npm run build` succeeds with no type errors; no `gsap`, `lenis`, or `sanity` packages present yet — scope stayed isolated to scaffold + design tokens as required
- No blockers identified for subsequent Phase 1 plans

---
*Phase: 01-foundation-architecture-design-system-and-content-layer*
*Completed: 2026-09-08*
