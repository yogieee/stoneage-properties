---
phase: 02-core-pages-home-services-and-about
plan: 09
subsystem: ui
tags: [nextjs, parallel-routes, intercepting-routes, gsap, modal, a11y]

# Dependency graph
requires:
  - phase: 02-08
    provides: Single-page homepage composition and global SiteNav with a "Contact" link (/contact) and "Enquire" CTA (ContactCtaStrip) already pointing at /contact
provides:
  - Sliding bottom-to-top contact modal (ContactModal) reachable via client-side navigation to /contact, with outside-click/Escape dismiss, focus trap, and reduced-motion support
  - Real standalone /contact fallback page for hard navigation
  - Next.js parallel route (@modal) + intercepting route ((.)contact) wiring on the (marketing) layout
affects: [Phase 4 (contact modal + form logic — CONT-01 lead-capture form replaces this plan's placeholder content)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js parallel routes (@modal slot) + intercepting routes ((.)contact) for 'modal with a URL' — the documented pattern over hand-rolled usePathname + client state"
    - "@modal/default.tsx returning null is required to prevent a 404 on refresh of any route after the modal slot was previously populated in-session"

key-files:
  created:
    - src/components/sections/ContactModal.tsx
    - src/app/(marketing)/@modal/default.tsx
    - src/app/(marketing)/@modal/(.)contact/page.tsx
    - src/app/(marketing)/contact/page.tsx
  modified:
    - src/app/(marketing)/layout.tsx

key-decisions:
  - "ContactModal built as a plain ref-based useGSAP() component (Option B from 02-RESEARCH.md Pitfall 2), not native <dialog>, matching the codebase's existing Reveal/TextReveal/MagneticButton pattern"
  - "ContactModal renders placeholder contact content (heading, copy, footer's office/contact details) — the real CONT-01 lead-capture form is explicit Phase 4 scope"
  - "Modal heading uses a plain native <h2> with manually-matched display-sm styling rather than passing a ref through the Typography primitive, since Typography is not a forwardRef component"

patterns-established:
  - "Modal dismiss delegates to a caller-supplied onClose callback (router.back() from the route page) rather than the modal managing navigation itself"

# Metrics
duration: ~20min
completed: 2026-09-09
---

# Phase 2 Plan 09: Sliding Contact Modal Summary

**Contact modal built via Next.js `@modal` parallel route + `(.)contact` intercepting route — slides up from the bottom on soft navigation with a real `/contact` URL, backdrop-click/Escape dismissal, and a focus-trapped `ContactModal` shell; hard navigation to `/contact` renders a real standalone fallback page instead.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 2
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- `ContactModal` shell: GSAP slide-up-from-bottom enter animation (reduced-motion gated via `gsap.matchMedia()`, matching `Reveal`/`TextReveal`), backdrop-pointerdown dismiss (verified `event.target === event.currentTarget` so inner clicks don't bubble-close), `Escape` dismiss, focus moved to the heading on open, and a manual Tab/Shift+Tab focus trap scoped to the panel
- `@modal/default.tsx` returns `null` — the required fallback preventing the documented refresh-404 failure mode (02-RESEARCH.md Pitfall 1)
- `@modal/(.)contact/page.tsx` renders `ContactModal` on client-side navigation to `/contact`, closing via `router.back()`
- `contact/page.tsx` is the real standalone fallback rendered on hard navigation (typed URL, refresh, shared link) — same content as the modal but in-flow, using `TextReveal`/`Reveal` directly
- `(marketing)/layout.tsx` now accepts and renders a `modal` parallel-route slot alongside `children`

## Task Commits

1. **Task 1: ContactModal shell — slide-up animation, outside-click dismiss, a11y baseline** - `ba777b1` (feat)
2. **Task 2: Parallel + intercepting routes wiring for /contact** - `af38778` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/components/sections/ContactModal.tsx` - Slide-up modal shell: GSAP enter animation, backdrop/Escape dismiss, focus trap, placeholder contact content
- `src/app/(marketing)/@modal/default.tsx` - Required null fallback for the unmatched `@modal` slot
- `src/app/(marketing)/@modal/(.)contact/page.tsx` - Intercepted route rendering `ContactModal` on soft navigation
- `src/app/(marketing)/contact/page.tsx` - Real standalone `/contact` fallback page for hard navigation
- `src/app/(marketing)/layout.tsx` - Accepts and renders the `modal` prop alongside `children`

## Decisions Made
- Plain ref-based `useGSAP()` `<div>` component for `ContactModal` (Option B, not native `<dialog>`) — consistent with every other animated element in this codebase and avoids fighting native `<dialog>` backdrop semantics for the outside-click requirement
- Modal content is placeholder (office/contact details already in the footer) standing in for Phase 4's not-yet-planned CONT-01 form fields — no fabricated form was invented
- Modal heading focus target implemented as a plain `<h2 ref={...}>` rather than routing a ref through the `Typography` primitive, since `Typography` isn't a `forwardRef` component

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Stale Next.js-generated route types (`.next/types/app/(marketing)/layout.ts`) caused a transient `tsc --noEmit` failure after adding the `modal` prop to the layout signature — resolved by removing `.next` and letting `next build`/`tsc` regenerate the route type declarations. No code change required; documented here since it looked like a real type error at first.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The contact modal mechanism (slide-up, outside-click dismiss, real shareable `/contact` URL, hard-navigation fallback) is fully wired and verified (`npm run build`, `npx tsc --noEmit`, dev-server route checks for `/` and `/contact`). Phase 4 can now focus purely on replacing `ContactModal`'s placeholder content with the real CONT-01 lead-capture form (name/email/project-type/location/timeline/message, office selection) — no modal mechanics work remains.
- Full interactive browser verification (slide animation, backdrop-click-to-dismiss, Escape, focus trap, refresh-after-modal-open with no 404) was validated by code inspection against `02-RESEARCH.md`'s documented pattern and via `npm run build`'s route-convention validation; a live-browser click-through is recommended at the Wave 4 (`02-10`) human-verify checkpoint.
- No blockers.

---
*Phase: 02-core-pages-home-services-and-about*
*Completed: 2026-09-09*
