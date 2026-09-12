# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-08)

**Core value:** The v1 site must look and feel like an Awwwards-nominated site — premium, smooth, fast — while accurately representing Stoneage Properties' real services and project history.
**Current focus:** Phase 2's 02-10 human-verify checkpoint was REJECTED (second pivot) — user wants an exact template replication of https://www.storeyarchitecture.co.uk/, not just the single-page structure. Needs `/gsd:discuss-phase 2` before further plans are written.

## Current Position

Phase: 2 of 5 (Core Pages: Home, Services & About) — CHECKPOINT REJECTED, second pivot requested, needs re-plan
Plan: 02-01, 02-02, 02-03, 02-04, 02-06, 02-07, 02-08, and 02-09 complete; 02-05 superseded (first pivot); 02-10 checkpoint run but NOT approved (second pivot) — 02-10-SUMMARY.md not created, plan left open
Status: Wave 4 (02-10) automated pre-checks passed (build, typecheck, no stale routes) and the checkpoint was presented to the user for manual verification. User rejected it with two categories of findings, captured live against the dev server via browser automation during the checkpoint:
  1. **Stuck Reveal/ScrollTrigger bugs** (real defects, not style): hero headline lines overlap/collide mid-reveal ("Specialist" / "Contractors for..." render stacked); Services section cards past the first one never reach full opacity after scroll-past; About section body paragraphs stay stuck near-invisible while the adjacent team photo tiles render fully opaque.
  2. **Design-direction gap**: current build is wireframe/diagram-led (thin-line boxes, minimal imagery); the reference site is photography-led (full-bleed Ken-Burns hero image, minimal chrome). User explicitly asked for an **exact template replication** of storeyarchitecture.co.uk — not incremental style tweaks — including its nav pattern (wordmark + Projects/Studio/Journal-equivalent + Contact button), full-bleed imagery, and overall structure.
This is scope beyond gap-closure: it's a second architecture/design pivot (same pattern as the 02-05 rejection that produced 02-06..02-10). Next step: run `/gsd:discuss-phase 2` to capture the exact-replication requirements (including how real photography will be sourced — none has been supplied by the client yet, see Blockers) into a new `02-CONTEXT.md` addendum, then re-plan.
Last activity: 2026-09-10 — Ran 02-10 checkpoint via /gsd:execute-phase; user rejected with bug findings + a request to exactly replicate storeyarchitecture.co.uk's template. Phase 2 execution paused pending re-plan.

Progress: [██████████] ~92% (11 of 12 known Phase 1-2 plans complete under the pivoted structure; 02-05 superseded/not counted; 1 plan — 02-10 — remains queued; later phases not yet planned)

## Performance Metrics

**Velocity:**
- Total plans completed (SUMMARY.md confirmed): 11
- Average duration: ~18 min
- Total execution time: ~3.1 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 - Foundation | 3 | ~50 min | ~17 min |
| 2 - Core Pages | 8 | ~144 min | ~18 min |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Next.js 15.5.x LTS (React 19 stable) recommended over Next 16 (React canary) — re-verify at implementation kickoff
- [2026-09-08, supersedes Init]: No CMS in v1 — content is hardcoded directly in the Next.js codebase. Client wants a custom AWS/Terraform backend instead of Sanity; that's real infra work deferred to v2. CMS-01 moved to v2 Requirements.
- [2026-09-08, supersedes Init]: Contact form does not persist to a `leads` database in v1 (email/log only via Server Action) — DB persistence is part of the same v2 AWS/Terraform backend. CONT-03 moved to v2 Requirements.
- [01-01]: Pinned next@15.5.25 / react@19.1.0 explicitly (verified via npm view) rather than trusting `create-next-app@15` latest resolution
- [01-01]: Fraunces (display) + Inter (body) selected as the initial editorial typeface pairing — swappable later, next/font usage centralized in root layout.tsx
- [01-01]: Design tokens are semantic (--color-ink, --color-paper, --text-display-*) in a single @theme block; raw Tailwind gray/slate/zinc utilities are disallowed project-wide
- [01-02]: All GSAP/ScrollTrigger imports go through `src/lib/gsap.ts` (never import `gsap`/`ScrollTrigger` directly in component files) — guarantees single plugin registration across routes
- [01-02]: Reduced-motion handling lives inside each motion primitive's own implementation (`gsap.matchMedia()` for `Reveal`; Lenis's untouched `reduceMotion: true` default for scroll) — never as an external per-usage wrapper; `components/motion/` primitives accept only generic/children props, never domain types
- [01-02]: Lenis mounted via `lenis/react`'s `ReactLenis` with `root` (passthrough, no wrapper divs), `autoRaf` disabled so `gsap.ticker` drives the frame loop instead — keeps ScrollTrigger synced with smoothed scroll
- [01-04]: `src/components/ui/` design-system primitives (Typography, Button) consume only semantic `@theme` tokens, never raw Tailwind gray/slate/zinc utilities — `/style-guide` is the living audit reference future phases should visually match
- [01-04]: Homepage kept as an intentional minimal skeleton (single section, one heading, one Reveal-wrapped paragraph) — full homepage design/layout is explicit Phase 2 scope (HOME-01/HOME-02)
- [2026-09-08]: Phase 1 complete — all three ROADMAP.md success criteria (SSR content, design-system consistency, reduced-motion behavior) human-verified live against the dev server and approved by user in a single pass, no issues reported
- [02-01]: `SplitText` registered in the same single `gsap.registerPlugin(...)` call as `ScrollTrigger` in `src/lib/gsap.ts` (not a second call) — preserves the "register once, import from here everywhere" discipline from Phase 1; no new dependency needed since `SplitText` ships bundled with the already-installed `gsap` package
- [02-01]: `MagneticButton` attaches zero `mousemove`/`mouseleave` listeners under reduced-motion or coarse-pointer (touch) conditions, rather than attaching and no-op'ing — wrapped CTA behaves as a plain button on mobile
- [02-04]: No real team member names/photos exist yet — `content/team.ts` uses real company facts (30+ years, JCT contracts, office locations) but role-based placeholder identities (e.g. "Founding Director") rather than fabricated named individuals; each entry marked `// TODO: replace with real client-supplied bio`. Never a stock photo URL as fallback — `TeamGrid` renders a neutral `bg-ink`/initials tile instead.
- [02-03]: Single typed `content/services.ts` array + one `[slug]/page.tsx` route template (`generateStaticParams`) used instead of 7 hand-built page files — makes a missing per-service warranty block a type error, not a shipped content gap. 5 of 7 services use the standard "3-Year Workmanship Guarantee" baseline since REQUIREMENTS.md only specifies distinct warranty language for New Builds and Extensions; no fabricated certifications added for the rest.
- [02-02]: "View Projects" resolves to `/work`, a minimal real placeholder page (not a 404), explicitly commented for Phase 3 (PORT-01..05) to replace with the full filterable gallery — resolves 02-RESEARCH.md Open Question 3.
- [02-02]: `Reveal` gained a generic `delay` prop (seconds) rather than a Hero-specific timing wrapper, so headline -> supporting copy -> CTA row can reveal in sequence while keeping the primitive reusable/content-agnostic.
- [02-02]: `Button` became polymorphic via an `as` prop (mirrors `Typography`'s existing `as` override) so CTAs can render as `next/link`'s `Link` while keeping design-system variant styling, instead of a separate `LinkButton` component.
- [02-02, process note]: 02-01/02-02/02-03/02-04 were executed concurrently by parallel agent sessions in the same working tree. This caused transient file-revert and shared `.next` build-directory races (all resolved by re-verifying on-disk state immediately before each commit and rebuilding). Future phases should avoid running multiple `execute-phase` sessions against the same working tree concurrently unless each plan's file sets are fully disjoint.
- [02-07]: Section components render only their content (a wrapping `<div>`), never the `<section>` element itself — the composing page (`02-08`) owns `<section id="...">` for anchor/nav/scroll-spy wiring, keeping section components reusable/testable independent of page-level anchor concerns.
- [02-07]: Condensed teaser variants live as new sibling components (`TeamStrip` next to `TeamGrid`) rather than modifying the original full-detail component — `TeamGrid` stays intact for potential future use per `02-04-SUMMARY.md`.
- [02-07, process note]: Ran concurrently with 02-06 in the same working tree (per the 02-02 concurrency note above). 02-06's already-staged route-rename (`work/ → projects/`) was unintentionally swept into 02-07's Task 1 commit (git commits all staged changes, not just newly-added files) — content is correct/expected 02-06 output, just mis-attributed to a 02-07 commit. Before Task 2's commit, three more 02-06-staged deletions were found and explicitly unstaged, committed around, then re-staged to avoid disrupting the concurrent session. No functional impact; documented in `02-07-SUMMARY.md`.
- [02-06]: Marketing layout nav's "Work" link (`href="/work"`) updated to `/projects` even though only `Hero.tsx` was named in the plan's Task 1 file list — required to satisfy the plan's own `grep -rn "\"/work\""` verification and avoid an internal nav click forcing a redirect hop. Full nav content/label rebuild remains 02-08's scope.
- [02-06, process note]: Confirmed the 02-07-documented commit cross-attribution (route-rename content landing in a 02-07-labeled commit) resolved correctly by end of both plans' execution — `npm run build` after a clean `.next` removal shows exactly `/`, `/projects`, `/style-guide` as routes, and `/work`, `/services`, `/about` all verified 308-redirecting via `curl -I` against a production build. Functional state matches both plans' `must_haves` regardless of which commit hash a given diff line landed in.
- [02-08]: `ContactCtaStrip` (page-closing CTA) deliberately has no `id` and is not a `ScrollTrigger` scroll-spy target — it's a trigger surface for Wave 3's contact modal, not a browsable/nav-anchored section, per `02-CONTEXT.md`.
- [02-08]: Scroll-spy `.is-active` styling implemented as a Tailwind v4 arbitrary variant (`[&.is-active]:text-ink [&.is-active]:font-medium`) directly in `SiteNav.tsx`'s anchor `className`, rather than a separate stylesheet/`style jsx` block — keeps the `ScrollTrigger`-toggled class name and its visual treatment co-located in one file.
- [02-08]: In-page anchor links use the absolute `/#id` form (not bare `#id`) throughout `SiteNav.tsx`, so they resolve correctly from any future non-homepage route, not just `/`.
- [02-09]: `ContactModal` built as a plain ref-based `useGSAP()` `<div>` component (not native `<dialog>`), matching the codebase's existing `Reveal`/`TextReveal`/`MagneticButton` pattern and giving full control over the outside-click dismiss requirement.
- [02-09]: `ContactModal` renders placeholder contact content (heading, copy, the same office/contact details already in the footer) — the real CONT-01 lead-capture form is explicit Phase 4 scope; no form fields were fabricated.
- [02-09]: `@modal/default.tsx` returning `null` is required — without it, refreshing any route after the modal was previously opened in-session 404s on the unmatched `@modal` slot (02-RESEARCH.md Pitfall 1).

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 2, SECOND ARCHITECTURE/DESIGN PIVOT — OPEN, blocks Phase 2 completion]: At the 02-10 checkpoint (which itself superseded the first pivot's 02-05), user rejected the pivoted single-page build and asked for an **exact template replication** of https://www.storeyarchitecture.co.uk/ — not incremental matching. Concrete findings from the rejected checkpoint: (1) stuck Reveal/ScrollTrigger animations — hero headline lines overlap mid-reveal, Services cards past the first stay near-invisible after scroll-past, About body text stays stuck low-opacity next to fully-opaque team photos; (2) current build is wireframe/diagram-led vs. the reference's full-bleed photography-led hero and minimal chrome. Real project photography still has not been supplied by the client (see the 02-04 content-dependency item below), which directly affects how closely a photo-led reference can be replicated — must be resolved or explicitly worked around during `/gsd:discuss-phase 2`. `02-10-PLAN.md` is left without a SUMMARY.md (not approved); do not mark it complete until re-verified after the re-plan.
- [Phase 2, ARCHITECTURE PIVOT — RESOLVED via re-plan]: At the 02-05 checkpoint, user rejected the multi-page structure and requested a single scrolling page (referencing https://www.storeyarchitecture.co.uk/), a nav reduced to logo/home + Projects + Contact + in-page anchors, and a sliding bottom-to-top contact modal. Captured via `/gsd:discuss-phase 2` in `02-CONTEXT.md` and researched in the pivot-updated `02-RESEARCH.md`; re-planned as `02-06` through `02-10` (routing cleanup, condensed section components, single-page composition + nav/scroll-spy, contact modal via parallel/intercepting routes, and a new human-verify checkpoint superseding `02-05`). Phase 3's routing (`/work` → `/projects`) and Phase 4's scope (contact modal + form logic, not a dedicated page) are updated accordingly per `02-CONTEXT.md`'s Impact section — no longer a blocker, tracked here for history only.
- [Phase 1]: WebGL/3D hero scope not yet confirmed with user/design direction — do not add `three`/`@react-three/fiber` speculatively; resolve before Phase 2 if a 3D hero is desired.
- [Phase 5]: LocalBusiness structured data / local SEO specifics are MEDIUM confidence (industry-sourced, not primary-verified) — worth a light validation pass at implementation time.
- [02-04, content dependency, not blocking]: Real team member names, bios, and photography have not been supplied by the client. `content/team.ts` is fully photo-ready — supplying `photo`/`name`/`bio` values and images under `/public/team/` requires no component changes. Track this as an open content gap before final ABOUT-01 sign-off.

## Session Continuity

Last session: 2026-09-09
Stopped at: Completed 02-09-PLAN.md (sliding contact modal via parallel/intercepting routes). `ContactModal` slides up from the bottom (GSAP, reduced-motion aware) over the current page on client-side navigation to `/contact`, dismissed via backdrop-click/Escape with a focus trap and `router.back()`; a real standalone `/contact` page renders on hard navigation; `@modal/default.tsx` prevents the refresh-404 pitfall. Wave 3 fully done. Next step: continue `/gsd:execute-phase 2` with Wave 4 (`02-10`, human-verify checkpoint superseding `02-05`) — the final plan in Phase 2.
Resume file: None
