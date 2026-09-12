# Phase 2: Core Pages — Home, Services & About - Context

**Gathered:** 2026-09-10
**Status:** Ready for planning (second re-plan — supersedes the 2026-09-09 single-page-only context)

<domain>
## Phase Boundary

**This context replaces the 2026-09-09 CONTEXT.md.** At the 02-10 human-verify checkpoint, the user rejected the pivoted single-page build on two grounds: (1) real ScrollTrigger/Reveal defects — hero headline lines overlapping mid-reveal, Services cards stuck below full opacity after scroll-past, About body paragraphs stuck near-invisible next to fully-opaque team photos; (2) a design-direction gap — the current build is wireframe/diagram-led, while the user wants an **exact template replication** of https://www.storeyarchitecture.co.uk/ (structure, nav pattern, full-bleed photography-led presentation), adapted to Stoneage's brand.

Phase 2 now delivers a **hybrid page structure** (not pure single-page): a homepage (`/`) carrying Hero, a condensed Services teaser, Work preview, About (condensed), Testimonials, and Contact CTA — plus a **new dedicated `/services` page** carrying full per-service depth. `/projects` (existing) and Phase 3's case study pages are unaffected. The original Phase 2 Requirements (HOME-01, HOME-02, SERV-01, SERV-02, ABOUT-01, MOTION-01, MOTION-02, TRUST-02, ENG-05) still apply, now satisfied via this hybrid structure with Storey's visual/content template as the reference, rather than either the original multi-page approach or the first pivot's pure single-page approach.

The 02-10 animation defects must be fixed as part of this re-plan regardless of the design changes — they are correctness bugs, not style choices.

</domain>

<decisions>
## Implementation Decisions

### Page structure
- Hybrid, not pure single-page: homepage (`/`) stays a single scroll story for Hero → Services (teaser) → Work preview → About (condensed) → Testimonials → Contact CTA.
- **Services gets its own dedicated route again** (`/services`, using the existing `content/services.ts` data-driven structure and the previously-built `[slug]/page.tsx` per-service template pattern from 02-03), carrying the full per-service depth. The homepage Services section becomes a teaser linking to it.
- About stays a homepage section (not split into its own page) — only Services was pulled out.
- `/projects` (renamed from `/work` in 02-06) and individual case study pages (Phase 3) are unaffected.
- Nav labels stay as currently built: logo (home link) + "Projects" + "Contact", plus in-page anchors for homepage sections — no attempt to force Storey's literal "Studio"/"Journal" wording onto Stoneage's nav.

### Navigation chrome
- Match Storey's nav chrome closely: logo left, nav links center-right, "Contact" rendered as a distinct button (filled/outlined), not a plain text link — built with Stoneage's existing Fraunces/Inter type and monochrome tokens, not Storey's literal colors.
- Scroll behavior (shrink/hide-on-scroll etc.) remains Claude's discretion, consistent with the prior context.

### Hero & photography
- Hero is a **full-viewport, multi-image carousel** (crossfade/slide between images), replicating Storey's carousel behavior — not a single Ken-Burns image.
- Since no real Stoneage project photography exists yet, use **licensed stock photography** (UK residential architecture/construction, matching Stoneage's style) as a placeholder throughout the hero, Services, Work preview, and About sections — consistent placeholder strategy sitewide, not mixed per-section.
- Section copy/data stays real (actual service names, actual project names/locations where known) even where the accompanying image is a stock placeholder — never fabricate project claims to match a stock photo.
- Stock photography is acceptable to ship now; swapping for real client-supplied photography remains a tracked pre-launch content gap (already noted in STATE.md), not something to solve in this phase.

### New sections vs. deferred
- **Testimonials**: add now as a carousel section on the homepage (a few client quotes, profile images can use stock/placeholder avatars) — low content burden, fits as a trust signal.
- **Journal/blog**: explicitly deferred — not built in this phase or added to Phase 2 scope. See Deferred Ideas.
- **Services 3-column photo-led teaser**: the homepage Services teaser adopts Storey's 3-column, photo-led layout (not the previous minimal card-teaser) since it now links out to the full `/services` page for depth.
- **Decorative section dividers**: replicate the spirit of Storey's paper/clip divider motif, adapted to Stoneage's monochrome/editorial system (not a literal color-for-color copy) — exact visual treatment (torn-edge, geometric block, etc.) is Claude's discretion.

### Contact modal / form
- Build the full "spatial brief intake"-style form fields now in Phase 2 (name, email, project type, location, timeline, message) inside the sliding contact modal — this pulls the field-richness forward from Phase 4.
- The form does **not** submit/persist/email in Phase 2 — no Server Action wiring, no email delivery. That remains Phase 4's CONT-01/CONT-02 scope, built on top of the fields/UI shipped here. Phase 4's job becomes "wire up this existing form" rather than "design and build the form."

### Animation reliability (must-fix, not a design preference)
- Bar for "fixed": zero stuck-opacity or overlapping-text states across **any** scroll pattern (fast, slow, direction reversal, resize mid-animation) — not just normal linear scroll-down.
- Root-cause the pattern rather than patching each of the three reported instances individually — investigate whether hero, Services, and About all hit the same underlying ScrollTrigger/Reveal setup issue (e.g. recalculation on layout change) and fix the shared cause.
- QA continuously as each section is rebuilt (each new/rebuilt section gets a scroll-behavior check before moving to the next), rather than one big verification pass at the end — avoids repeating the 02-10 checkpoint-rejection pattern.

### Claude's Discretion
- Exact divider motif design (within the monochrome/editorial system).
- Nav shrink/hide-on-scroll behavior.
- Testimonial carousel interaction details (autoplay, arrows/dots, swipe).
- Root-cause fix implementation for the ScrollTrigger/Reveal defects.
- Stock photography sourcing/licensing specifics (as long as it reads as realistic UK residential architecture, not obviously generic stock).

</decisions>

<specifics>
## Specific Ideas

- Direct reference: https://www.storeyarchitecture.co.uk/ — exact template replication requested, not incremental style tweaks. Reference structure: fixed light nav (logo left, links center-right, Contact as a button); full-viewport photo carousel hero; intro statement; project grid; 3-column Services with lifestyle photography; featured-project CTA; testimonials carousel; process statement; journal grid (deferred for Stoneage); "Spatial Brief Intake" contact form; multi-section footer.
- Paper/clip decorative graphics between sections — adapt the *idea* (visual breathing room between sections) to Stoneage's brand, not the literal graphic.
- The 02-10 checkpoint's specific bug list (hero headline lines colliding, Services cards not reaching full opacity past the first card, About paragraphs stuck low-opacity next to opaque team photos) must all be verified fixed.

</specifics>

<deferred>
## Deferred Ideas

- **Journal/blog section** — Storey has one; Stoneage's roadmap doesn't include ongoing content publishing. Flagged as a potential future phase/backlog item, not built now.
- Everything already deferred to Phase 3 (full `/projects` filterable gallery, case study pages, before/after sliders) and Phase 4 (form submission/persistence/email) remains deferred as previously scoped — this discussion reassigns *where* the contact form's fields/UI get built (pulled into Phase 2) but not the submission logic itself.

</deferred>

<impact>
## Impact on Existing Work

- **02-06 (routing cleanup: /work → /projects)** — unaffected, stays as-is.
- **02-07 (condensed section components)** — ServicesSection needs rework from card-teaser to 3-column photo-led teaser; a new full-depth `/services` page/route needs to be reintroduced (reusing 02-03's dropped per-service template pattern); AboutSection and TeamStrip content approach is largely reusable, still condensed on the homepage.
- **02-08 (single-page composition + nav)** — nav needs chrome rework (Contact as a button, closer Storey-style layout) and a new "Services" nav consideration now that `/services` exists again as a real route; homepage composition gains a Testimonials section and needs a new Hero carousel (replacing the current hero treatment) plus divider elements between sections.
- **02-09 (contact modal)** — form fields need to expand from placeholder content to the full brief-intake field set (still non-functional/no submission).
- **02-10 (rejected checkpoint)** — superseded; will be replaced by a new checkpoint plan once re-planned, and must explicitly re-verify the three specific animation defects plus the new design direction.
- **Phase 3** — unaffected; still owns `/projects` gallery depth and case studies.
- **Phase 4** — scope narrows to wiring the already-built modal form (Server Action, email delivery, error handling) rather than designing/building the form itself.
- **Content/assets** — licensed stock photography needs sourcing for hero, Services, Work preview, and About sections; this is new work not previously scoped in any prior plan.

</impact>

---

*Phase: 02-core-pages-home-services-about*
*Context gathered: 2026-09-10 (second pivot, supersedes 2026-09-09 context)*
