# Roadmap: Stoneage Properties — Awwwards-Grade Redesign (v1)

## Overview

This roadmap delivers stoneageproperties.com as an Awwwards-caliber Next.js marketing site in five phases: first the technical/motion foundation is proven on real hardcoded content (so animation risk is decoupled from content risk — no CMS in v1, that's deferred to v2's AWS/Terraform backend), then the lower-complexity core pages (home, services, about) establish the design system and motion feel, then the highest-leverage page type (portfolio and case studies, the primary conversion asset) is built against that proven template, then the lead-capture form is wired with email notification (durable `leads` persistence is a v2 concern), and finally a dedicated hardening pass verifies performance, accessibility, and SEO across every template before launch.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation — Architecture, Design System & Content Layer** - Scaffold, motion primitives, and reduced-motion baseline proven on real hardcoded content (no CMS in v1)
- [ ] **Phase 2: Core Pages — Home, Services & About** - Hybrid homepage (hero carousel, condensed services/about, testimonials) + dedicated /services route, Storey-referenced nav/dividers, sliding contact modal with full brief-intake fields (re-planned twice mid-phase)
- [ ] **Phase 3: Portfolio & Case Studies** - Filterable project gallery and full case study template with real content
- [ ] **Phase 4: Contact, Lead Capture & Multi-Office** - Enquiry form persisting to a real leads record, multi-office selection, trust signals near conversion point
- [ ] **Phase 5: Performance, Accessibility & SEO Hardening** - Core Web Vitals, keyboard/screen-reader, and structured-data verification across every template

## Phase Details

### Phase 1: Foundation — Architecture, Design System & Content Layer
**Goal**: The technical and content foundation exists and is provably correct before any real page is built against it — motion primitive system and reduced-motion/SSR baseline working on real (hardcoded) content. No CMS in v1 — content management is deferred to v2 as part of a self-built AWS/Terraform backend (see PROJECT.md Key Decisions, superseded 2026-09-08).
**Depends on**: Nothing (first phase)
**Requirements**: MOTION-03, ENG-02, ENG-04
**Success Criteria** (what must be TRUE):
  1. Core marketing content in a skeleton page is visible in server-rendered HTML (view-source shows real text without executing JavaScript)
  2. A demo/style-guide page displays the monochrome/neutral palette and bold editorial typography system consistently
  3. Toggling the OS "reduce motion" setting on a demo animated section removes or simplifies the animation (no retrofitted fallback)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Next.js 15.5 + Tailwind v4 scaffold, monochrome/editorial design tokens, marketing route group
- [x] 01-02-PLAN.md — GSAP/Lenis motion primitives (Reveal, SmoothScrollProvider) with reduced-motion built in
- [x] 01-04-PLAN.md — Design-system UI primitives, style-guide + skeleton homepage (hardcoded content), phase verification checkpoint

**Note**: A Sanity CMS plan (01-03) was built then reverted 2026-09-08 after the client decided v1 ships without a CMS — content is hardcoded directly in the codebase, and a custom AWS/Terraform backend is planned for v2. See PROJECT.md Key Decisions.

### Phase 2: Core Pages — Home, Services & About
**Goal**: Visitors experience the site's Awwwards-grade brand tone and can learn what Stoneage does and who they are, via a hybrid structure — a single-page homepage story (hero carousel, condensed services teaser, work preview, condensed about/team, testimonials) plus a dedicated `/services` route for full per-service depth, Storey Architecture-referenced nav/dividers, and a sliding contact modal with the full brief-intake field set — re-planned twice mid-phase (see 02-CONTEXT.md, second pivot 2026-09-10) after the first single-page-only pivot's checkpoint was itself rejected for animation defects and a design-direction gap.
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, SERV-01, SERV-02, ABOUT-01, MOTION-01, MOTION-02, TRUST-02, ENG-05
**Success Criteria** (what must be TRUE):
  1. Visitor loads the homepage and sees a cinematic, full-viewport hero image carousel (GSAP + Lenis) that sets brand tone within 3-5 seconds, with zero stuck-opacity or overlapping-text animation defects anywhere on the page under stress-scroll conditions
  2. Visitor sees "Enquire" and "View Projects" CTAs persistently accessible above the fold on the homepage
  3. Visitor can scroll to a 3-column, photo-led Services teaser (New Builds, Renovations, Extensions, Conversions, Basements, Refurbishments, Barn Conversions) showing relevant warranty/trust content, and can follow through to a dedicated `/services` route with full per-service depth (description + full warranty detail) reintroduced in this phase
  4. Visitor can scroll to a condensed About/team section (30+ years combined experience story, a team strip with no stock imagery for real people, plus a general ambient photo) and a Testimonials carousel
  5. Headings use text-reveal animation, primary CTA buttons show magnetic/hover micro-interactions, the Storey-referenced nav (Contact as a button) and sliding contact modal (full brief-intake fields, no submission logic) work correctly, and the page renders correctly across mobile, tablet, and desktop breakpoints
**Plans**: 17 plans (5 original multi-page plans 02-01..02-05; superseded mid-phase by first-pivot re-plan 02-06..02-10 after 02-05's checkpoint was rejected; 02-10's checkpoint was itself rejected — second pivot re-plan 02-11..02-17 plus a rewritten 02-10 checkpoint — see 02-CONTEXT.md)

Plans:
- [x] 02-01-PLAN.md — TextReveal + MagneticButton motion primitives (SplitText/quickTo, reduced-motion built in)
- [x] 02-02-PLAN.md — Cinematic homepage hero, persistent CTAs, credentials strip, placeholder /work route
- [x] 02-03-PLAN.md — Data-driven service pages (7 services, per-service warranty/trust content) — superseded by 02-06/02-07, reinstated by 02-14
- [x] 02-04-PLAN.md — About/team page with photo-ready TeamGrid (neutral placeholder, no stock imagery) — superseded by 02-06/02-07 (content reused, dedicated route dropped)
- [ ] ~~02-05-PLAN.md~~ — Phase 2 human-verify checkpoint — REJECTED at checkpoint (user requested single-page pivot); superseded by 02-10-PLAN.md
- [x] 02-06-PLAN.md — Routing cleanup: /work → /projects rename+redirect, drop /services & /about routes
- [x] 02-07-PLAN.md — Condensed section components (ServicesSection, WorkPreviewSection, TeamStrip, AboutSection) — ServicesSection reworked by 02-14
- [x] 02-08-PLAN.md — Compose single-page homepage + simplified nav with scroll-spy
- [x] 02-09-PLAN.md — Sliding contact modal (parallel + intercepting routes) — fields expanded by 02-12
- [ ] ~~02-10-PLAN.md (first version)~~ — Phase 2 human-verify checkpoint — REJECTED at checkpoint (user requested exact Storey template replication + animation bug fixes); rewritten below
- [ ] 02-11-PLAN.md — Root-cause fix: TextReveal onSplit() rebuild + sitewide ScrollTrigger.refresh() on fonts.ready
- [ ] 02-12-PLAN.md — Contact modal + /contact fallback: full brief-intake form fields (no submission logic)
- [ ] 02-13-PLAN.md — Full-viewport hero image carousel (GSAP crossfade, reduced-motion/WCAG-aware)
- [ ] 02-14-PLAN.md — Reintroduce /services route (recovered from git history) + 3-column photo-led homepage Services teaser
- [ ] 02-15-PLAN.md — Nav chrome rework: Contact as a button, new /services nav link
- [ ] 02-16-PLAN.md — Decorative section dividers + Testimonials carousel, composed into the homepage
- [ ] 02-17-PLAN.md — Photo-led Work preview + About sections (stock photography placeholder, sitewide consistency)
- [ ] 02-10-PLAN.md (rewritten) — Phase 2 human-verify checkpoint: re-verifies the three original animation defects are gone under stress-scroll, plus the full Storey-replication direction — supersedes the rejected first version

### Phase 3: Portfolio & Case Studies
**Goal**: Visitors can browse real past projects and read individual case studies that function as the site's primary conversion asset.
**Depends on**: Phase 2
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, TRUST-01
**Success Criteria** (what must be TRUE):
  1. Visitor can browse a project gallery/index filterable by service type (New Build / Renovation / Extension / Conversion)
  2. Visitor can open an individual case study page for any project, following a consistent structure: hero, brief/challenge, process, before/after (where applicable), outcome, testimonial, CTA
  3. Case study pages show real project photography and real project history migrated from the current site (House Remodelling Knowle, Residential Roof Solihull, Kitchen Extension Solihull & London, New Build Rugby, etc.)
  4. Renovation/extension/conversion/basement case studies include a working before/after comparison (scroll-scrubbed or draggable slider)
  5. Each case study ends with an "Enquire about a similar project" CTA pre-filled with that project's service type, and displays a testimonial tied to that specific project (not a generic testimonial wall)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Contact & Lead Capture (v1: form + email, no DB)
**Goal**: Visitors can submit an enquiry with confidence-building context (office selection, response time, trust signals) at the point of conversion. Durable `leads` database persistence is deferred to v2's AWS/Terraform backend (see PROJECT.md Key Decisions, superseded 2026-09-08) — v1 delivers the form and notification path only.
**Depends on**: Phase 2/3 (CTA entry points)
**Requirements**: CONT-01, CONT-02, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. Visitor can submit a contact/enquiry form with name, email, project type, location, timeline, and an open message field
  2. Visitor can select or indicate which office (Solihull HQ, London, Nottingham) is relevant to their enquiry
  3. Every submitted enquiry reliably reaches the business (e.g. email notification via a Server Action), with graceful error handling if delivery fails
  4. Visitor sees a response-time expectation (e.g. "We respond within 1 business day") and testimonials/trust signals (warranties, certifications) positioned near the contact form
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

### Phase 5: Performance, Accessibility & SEO Hardening
**Goal**: The site meets the performance, accessibility, and discoverability bar required of a real lead-generation tool, verified per-template rather than assumed.
**Depends on**: Phase 2, Phase 3, Phase 4 (all templates must exist to be verified)
**Requirements**: ENG-01, ENG-03
**Success Criteria** (what must be TRUE):
  1. A mobile-throttled Lighthouse/PageSpeed audit on every template (home, service, case study, contact) meets Core Web Vitals "Good" thresholds (LCP, CLS, INP)
  2. Every page includes correct SEO metadata, OpenGraph tags, and JSON-LD LocalBusiness structured data matching the business's real name/address/phone for all three offices, validated via Google's Rich Results Test
  3. A manual keyboard-navigation and screen-reader smoke test passes on every animated component, and `prefers-reduced-motion` fallback behavior is confirmed sitewide (not just on the Phase 1 demo)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete ✓ | 2026-09-08 |
| 2. Core Pages | 8/17 (re-planned twice) | In progress | - |
| 3. Portfolio & Case Studies | 0/TBD | Not started | - |
| 4. Contact & Lead Capture | 0/TBD | Not started | - |
| 5. Performance/A11y/SEO Hardening | 0/TBD | Not started | - |

---
*Roadmap created: 2026-09-08*
