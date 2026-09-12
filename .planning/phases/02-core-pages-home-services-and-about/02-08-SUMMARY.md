---
phase: 02-core-pages-home-services-and-about
plan: 08
subsystem: ui
tags: [nextjs, gsap, scrolltrigger, lenis, single-page-architecture, nav]

# Dependency graph
requires:
  - phase: 02-06
    provides: "/work -> /projects rename with defensive redirects, cleared internal /work references"
  - phase: 02-07
    provides: "Condensed content-only section components (ServicesSection, WorkPreviewSection, TeamStrip, AboutSection) rendering only their inner content, not a wrapping <section>"
provides:
  - "Single scrolling homepage (/) composing Hero + Services + Work preview + About + Contact CTA strip in one page, each anchor section owning its own <section id=\"...\"> at page-composition level"
  - "ContactCtaStrip component: trigger surface for the Wave 3 contact modal, not a form/route"
  - "SiteNav: simplified global nav (logo/home + Services/Work/About anchors + Projects + Contact) with Lenis-powered smooth anchor scroll and ScrollTrigger-driven scroll-spy active-link highlighting"
  - "SmoothScrollProvider anchors: true option enabling declarative smooth-scroll for all in-page anchor links app-wide"
affects: [02-09, 02-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Page-level composition owns <section id> anchor wrappers; section components (components/sections/*) render only inner content — established in 02-07, reinforced here at the composing page"
    - "Scroll-spy via ScrollTrigger.create({ trigger: '#id', toggleClass }) targeting sections by string selector, never IntersectionObserver, to stay in sync with the existing Lenis/GSAP tick sync"
    - "In-page anchor links use the /#id absolute form (not bare #id) so they resolve correctly from any route, combined with Lenis's anchors: true for zero-click-handler smooth scroll"

key-files:
  created:
    - src/components/sections/ContactCtaStrip.tsx
    - src/components/sections/SiteNav.tsx
  modified:
    - src/app/(marketing)/page.tsx
    - src/app/(marketing)/layout.tsx
    - src/components/motion/SmoothScrollProvider.tsx

key-decisions:
  - "ContactCtaStrip has no id and is not a scroll-spy anchor target (it's a CTA trigger surface, not a browsable section) per 02-CONTEXT.md"
  - "Scroll-spy active-state styling uses a Tailwind v4 arbitrary variant ([&.is-active]:text-ink) on the anchor element itself rather than a separate CSS module, keeping the toggled class name (is-active) and its visual treatment co-located in SiteNav.tsx"

patterns-established:
  - "Global nav is now a single client component (SiteNav) owning both anchor markup and its own scroll-spy GSAP effect, rather than server-rendered nav markup + a separate client behavior file"

# Metrics
duration: 15min
completed: 2026-09-09
---

# Phase 2 Plan 08: Single-Page Composition + Nav/Scroll-Spy Summary

**Composed Hero/Services/Work/About/Contact into one scrolling `/` page and replaced the flat 5-link nav with a logo + anchor-links + Projects + Contact `SiteNav` driven by Lenis smooth-scroll and `ScrollTrigger` scroll-spy highlighting.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-09-09T09:44:00Z
- **Completed:** 2026-09-09T09:58:50Z
- **Tasks:** 2
- **Files modified:** 5 (2 created, 3 modified)

## Accomplishments
- `/` now renders Hero, Services, Work preview, About, and a Contact CTA strip as one coherent scroll, each anchor section server-rendering a stable `id` (`services`, `work`, `about`)
- New `SiteNav` client component replaces the old flat `NAV_LINKS` array/inline markup with logo/home + Services/Work/About anchors + Projects + Contact
- Anchor clicks smooth-scroll via Lenis's declarative `anchors: true` option (zero custom click handlers)
- Scroll-spy active-link highlighting implemented with one `ScrollTrigger` per section + `toggleClass`, not a competing `IntersectionObserver`, so it stays synced with the existing Lenis/GSAP tick wiring

## Task Commits

Each task was committed atomically:

1. **Task 1: Compose the single page with a Contact CTA strip** - `22a2b67` (feat)
2. **Task 2: SiteNav — simplified links, smooth anchor scroll, scroll-spy highlighting** - `e858b7c` (feat)

_No TDD tasks in this plan; both are `type="auto"` composition/feature tasks._

## Files Created/Modified
- `src/components/sections/ContactCtaStrip.tsx` - New CTA trigger strip ("Let's build something" + Enquire button), closes the homepage scroll
- `src/app/(marketing)/page.tsx` - Rewritten to compose Hero + `<section id="services">`/`<section id="work">`/`<section id="about">` wrapping the 02-07 condensed components + `ContactCtaStrip`
- `src/components/sections/SiteNav.tsx` - New client nav: logo/home link, `/#id`-form anchor links, Projects/Contact route links, `useGSAP`-scoped scroll-spy `ScrollTrigger`s
- `src/app/(marketing)/layout.tsx` - Replaced flat `NAV_LINKS` array + inline `<nav>` markup with `<SiteNav />`
- `src/components/motion/SmoothScrollProvider.tsx` - Added `anchors: true` to the existing Lenis `options` object

## Decisions Made
- `ContactCtaStrip` is a CTA trigger surface (no `id`, not a scroll-spy target) — the real contact form/modal is explicitly out of scope here and deferred to Wave 3 (02-09)
- Active-link styling implemented as a Tailwind v4 arbitrary variant (`[&.is-active]:text-ink [&.is-active]:font-medium`) directly on each anchor's `className`, avoiding a separate stylesheet while keeping the `is-active` toggle class name (set via `ScrollTrigger`'s `toggleClass`) and its visual treatment in one place

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `/` is now the complete single-page scroll surface; `02-09` (sliding contact modal via parallel/intercepting routes) can build directly on the existing `/contact` links in `Hero.tsx`, `ContactCtaStrip.tsx`, and `SiteNav.tsx` — none of them needed special-casing for the eventual intercepted route per 02-RESEARCH.md Topic 2
- Scroll-spy and anchor-scroll are both verified via `npm run build` SSR output (`id="services"`/`id="work"`/`id="about"` present) and compiled Tailwind CSS (`.is-active` rule present in `.next/static/css/app/layout.css`); a full interactive/visual pass (clicking anchors, watching the active link change while scrolling, mobile-width nav overflow) is deferred to the `02-10` human-verify checkpoint per the plan's own wave structure
- No blockers for `02-09`/`02-10`

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
