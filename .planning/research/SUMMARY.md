# Project Research Summary

**Project:** Stoneage Properties — Awwwards-grade Next.js Redesign
**Domain:** Awwwards-caliber architecture/construction marketing & portfolio site (UK building contractor), v1 of a 3-milestone product (v1 marketing site -> v2 AI lead-gen -> v3 CRM)
**Researched:** 2026-09-08
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a heavily-animated, editorial, photography-led Next.js marketing site for a real UK construction contractor (Solihull/London/Nottingham), built to Awwwards Site-of-the-Day visual/interaction standards while functioning as a genuine lead-generation tool, not a design portfolio for its own sake. Experts build this class of site on Next.js App Router (Server Components by default) with a "three-piece" animation stack: GSAP + ScrollTrigger for scroll-driven choreography, Lenis for smooth/inertia scroll, and Motion (formerly Framer Motion) for component-level UI transitions, layered as a presentation-only enhancement on top of server-rendered content, never as a replacement for it. Content (case studies, services, team, offices) should live in a headless CMS decoupled from presentation, and the contact form should write to a real, persisted `leads` data store (not just fire an email) so v2 (AI qualification) and v3 (CRM) can build on the same data without a rewrite.

The single biggest risk in this project is the tension between "Awwwards-tier" and "lead-gen tool for a local trade business": the reference sites this brief is modeled on (Storey Architecture, Kononenko) serve already-motivated visitors who tolerate friction, while Stoneage's actual visitors are comparison-shopping homeowners who will bounce in seconds if the phone number/quote CTA is buried under a cinematic intro, or if mobile performance is treated as an afterthought (Awwwards juries are desktop-biased; most real lead-gen traffic is mobile). A second major risk cluster is technical: GSAP/Lenis-driven builds routinely tank Core Web Vitals (LCP from unoptimized hero media, CLS from animating layout-affecting properties), silently break accessibility (keyboard nav, screen readers, `prefers-reduced-motion`), leak ScrollTrigger instances across App Router client-side navigations, and can accidentally drag static SEO-critical content into client-only rendering. All of these are well-documented, preventable failure modes with specific fixes (detailed in PITFALLS.md), the risk is that they get discovered late, after animation is built against hardcoded assumptions, when retrofitting is expensive.

Recommended approach: build the motion system (`Reveal`, `Parallax`, `PinnedSection` primitives via `@gsap/react`'s `useGSAP`) and the content/data architecture (CMS-backed content, persisted `leads` table via Server Action) as two decoupled, parallel foundations early, before real content or full-fidelity design exists. Bake performance budgets, `prefers-reduced-motion`, keyboard access, and mobile-first treatment into the animation coding standard from the first component built, not as a pre-launch cleanup pass. One open architectural decision, CMS choice (Sanity vs. Payload), needs explicit resolution before the roadmap locks in a content/data layer (see below).

## Key Findings

### Recommended Stack

Next.js 15.5.x LTS (React 19 stable) is recommended over the newer Next.js 16.x line, because 16's App Router currently runs on a React canary, not appropriate for a client-facing production site that must not break. Tailwind CSS 4.x (CSS-first `@theme` config, Oxide engine) is the styling layer, well suited to enforcing a strict editorial/monochrome design system. The animation stack is GSAP 3.15.x + ScrollTrigger (now fully free, including all plugins, since Webflow's 2025 acquisition of GreenSock) for scroll choreography, Lenis 1.3.x for smooth scroll (must be manually synced to GSAP's ticker and ScrollTrigger, the single most common source of scroll-jank bugs in this stack), and Motion 12.x/13.x for component-level UI micro-interactions (hover, modal, filter transitions). GSAP and Motion should never animate the same element; pick one system per animation type. WebGL (`three`/`@react-three/fiber`) is explicitly opt-in only, pending design-direction confirmation of a 3D/shader hero, the single biggest bundle-size/complexity cost in the stack, and should not be added speculatively.

**Core technologies:**
- Next.js 15.5.x (App Router, React 19 stable) — production-stable LTS track, avoids canary-React risk of v16
- Tailwind CSS 4.x — CSS-first design tokens, enforces the monochrome/editorial design system
- GSAP 3.15.x + ScrollTrigger + Lenis 1.3.x — the standard "three-piece" combo for Awwwards-tier scroll storytelling, now fully free
- Motion 12.x/13.x — component-scoped UI transitions, complements (does not overlap with) GSAP
- `next/font` (built-in) — zero-layout-shift, self-hosted web fonts; never Google Fonts `<link>`/`@import`

### Expected Features

**Must have (table stakes):**
- Project gallery/portfolio index with service-type filtering (New Build/Renovation/Extension/Conversion)
- Individual case study pages (consistent structure: hero -> brief -> process -> before/after -> outcome -> testimonial -> CTA), the primary conversion asset
- Services pages per offering with trust signals (10yr structural / 3yr workmanship warranty, JCT/accreditation)
- Short (3-5 field) contact/inquiry form with multi-office selector (Solihull/London/Nottingham)
- About/team page with real photos, testimonials tied to specific projects
- Mobile-first responsive build, Core Web Vitals baseline, `prefers-reduced-motion` support, basic SEO/OpenGraph/HTTPS

**Should have (competitive/differentiators):**
- Cinematic homepage hero with scroll-triggered narrative sequence (GSAP + Lenis)
- Scroll-driven storytelling on case study pages, highest-value differentiator for this client since case studies double as the primary lead-conversion asset
- Before/after scroll-scrubbed slider for renovations/extensions, a construction-specific differentiator not overused in the architecture-portfolio genre
- Text reveal animations, magnetic buttons/hover micro-interactions on CTAs, high value-to-cost ratio
- Region-specific landing content (Solihull/London/Nottingham), direct local SEO/conversion ROI given three physical offices

**Defer (v2+/explicitly out of scope):**
- Chatbot/AI assistant, AI-driven project matching, CRM integration, client portal, explicitly future-milestone
- Full-scene WebGL sitewide, custom loading/intro sequence, page transition choreography across all routes, polish layer, add post-launch once core pages are stable

### Architecture Approach

A layered Next.js App Router architecture: presentation layer (route segments, Server Components by default) sits above a content layer (CMS collections for Projects/Services/TeamMembers/Offices, fetched server-side only), with motion primitives (`Reveal`, `Parallax`, `PinnedSection`, a root `SmoothScrollProvider`) as a strictly presentation-only layer that knows nothing about domain data. The contact form is a client component that submits through a Server Action (`submitInquiry`), validated with a shared Zod schema, which writes to a persisted `leads` table before separately triggering an email notification, this single decision is the highest-leverage future-proofing move in the whole project, since it's the exact seam v2 (AI lead qualification) and v3 (CRM dashboard) build on without a rewrite.

**Major components:**
1. Route segments (`app/(marketing)/...`) — URL structure, server-side data fetching, isolated via a route group so v3's `(dashboard)` group can be added later without touching marketing routes
2. Motion primitives (`components/motion/*`) — reusable, content-agnostic GSAP/Lenis wrappers built once via `useGSAP`, composed by page sections rather than each section calling `gsap.*` directly
3. Content layer (CMS collections) — owns Projects/Services/TeamMembers/Offices data, fetched only in Server Components, never exposed to client components
4. Server Action -> Leads table -> Email notification — the v2/v3 integration seam; leads are durably persisted from day one, not just emailed

### Critical Pitfalls

1. **Hero LCP tanked by unoptimized/decorative treatment of the hero image/video** — use `next/image` with `priority`/`fetchPriority="high"`, real `sizes`, AVIF/WebP, never a CSS `background-image` for the primary hero; verify the actual LCP element in DevTools per template.
2. **GSAP layout-affecting animations cause CLS** — animate only `transform`/`opacity`, never `top`/`left`/`width`/`height`/`margin`; reserve final layout space before text-split/reveal animations run.
3. **Accessibility silently breaks** (keyboard nav, screen readers, `prefers-reduced-motion`) — wrap all scroll/entrance animations in `gsap.matchMedia()` reduced-motion branching from the first component; never fully scroll-jack; test with an actual screen reader before shipping text-split animation on meaningful content.
4. **ScrollTrigger instances leak across App Router client-side navigation** — use `@gsap/react`'s `useGSAP()` hook (auto `.revert()` cleanup) instead of raw `useEffect`, from the very first animated component.
5. **Aesthetic-first design buries the "get a quote" signals a local trade business depends on** — persistent, high-contrast phone number/CTA on every page/viewport; the Awwwards reference sites serve a different (more patient) user intent than Stoneage's comparison-shopping homeowners, and copying their aesthetic without adjusting for this transfers the wrong lesson.

## Open Decision: CMS Choice (Sanity vs. Payload) — Conflict Between STACK.md and ARCHITECTURE.md

**This must be resolved before roadmap phase sequencing locks in the content/data layer.** The two research passes reached different recommendations, for defensible but different reasons:

**STACK.md recommends Sanity** — reasoning: v1 is content-only (marketing site, no CRM logic yet), and Sanity is a fully-hosted SaaS with a polished, non-technical-friendly editor UI and built-in image/hotspot tooling, ideal for a client self-serving case-study updates. Its argument is that coupling the CMS to a future CRM backend *before* v2/v3 requirements are known is the premature-architecture risk — keep v1's content tool scoped to content, and decide the v2/v3 app backend (auth, leads, roles) later, against actual v2/v3 requirements, which might not be Payload at all.

**ARCHITECTURE.md recommends Payload CMS 3.x** — reasoning: Payload installs natively into the Next.js app, owns a real Postgres schema, and ships auth/roles/relational-data support out of the box. Its argument is the opposite: choosing a content-only CMS now risks a *split-backend* problem at v3, two disconnected systems (a SaaS content CMS + a hand-rolled future backend) that must be reconciled or migrated when the CRM arrives, whereas Payload lets the `Leads` and (stubbed) `Users` collections exist from day one, with v2/v3 activating capability that was already there.

**Both sides agree on the load-bearing point regardless of CMS pick:** the contact form must write to a persisted `leads` table via a Server Action (not email-only) from v1, this is the actual v2/v3 seam, independent of which CMS wins.

**Recommendation for roadmap:** Treat this as a Phase 0/1 decision gate, not something to default silently. Ask the user directly: (a) does the client need a highly polished, non-technical editor experience for case studies/services (favors Sanity), or (b) is there a strong preference for one unified login/system across the whole 3-milestone product lifecycle, and is the team willing to self-host Postgres/auth starting in v1 (favors Payload)? If undecided, Sanity is the lower-risk default for v1 specifically (less infra to stand up, no premature coupling), with the explicit caveat that v2/v3 backend architecture is a separate decision to be made when those milestones are researched, but this SUMMARY does not force that choice; flag it for the user/roadmapper.

## Implications for Roadmap

Based on combined research, suggested phase structure for v1:

### Phase 1: Technical & Content Foundation
**Rationale:** CMS choice (see Open Decision above), project scaffolding, design tokens, and the motion-primitive system all need to exist before any real page is built against them; retrofitting content architecture or animation cleanup patterns after pages exist is expensive (per PITFALLS.md).
**Delivers:** Next.js 15.5.x + Tailwind 4 scaffold, CMS decision resolved and collections stubbed (Projects/Services/TeamMembers/Offices/Leads), `useGSAP`-based motion primitives (`Reveal`, `Parallax`, `PinnedSection`, `SmoothScrollProvider`) built and tuned on placeholder content, Zod validation schema shared client/server.
**Avoids:** Pitfall 4 (ScrollTrigger leaks — establish `useGSAP` pattern before any page-level animation exists), Pitfall 8 (un-editable site — content architecture decided before hardcoding).

### Phase 2: Core Pages — Homepage, Services, About
**Rationale:** These are the lower-complexity, higher-certainty pages (services/about are LOW-MEDIUM complexity per FEATURES.md) and establish the design system/motion feel before tackling the highest-complexity page type (case studies).
**Delivers:** Cinematic homepage hero with scroll-triggered narrative, services overview + per-service pages with trust-signal content (warranty/JCT), About/team page.
**Uses:** GSAP+ScrollTrigger+Lenis stack, `next/image` with `priority` on hero.
**Implements:** Motion primitives layer, content layer (CMS fetch in Server Components only).
**Avoids:** Pitfall 1 (hero LCP — verify actual LCP element before calling homepage done), Pitfall 6 (buried CTAs — lock persistent phone/quote CTA pattern here, before visual polish).

### Phase 3: Portfolio & Case Studies
**Rationale:** Highest-leverage page type (primary conversion asset + primary Awwwards differentiator) but depends on the case-study template structure and photography pipeline being ready; FEATURES.md notes the gallery is "only as good as what it links to," build the template first, gallery around it.
**Delivers:** Case study page template (brief -> process -> before/after -> outcome -> testimonial -> CTA), project gallery/index with service-type filtering, before/after slider for renovations.
**Addresses:** P1 features (case study template + real photography, project gallery, before/after slider).
**Avoids:** Pitfall 2 (CLS from text-split/reveal in the narrative sections), Pitfall 5 (SEO — ensure case study copy is server-rendered, not gated behind scroll-triggered mount).

### Phase 4: Contact, Lead Capture & Multi-Office
**Rationale:** Depends on the Leads data model established in Phase 1 and benefits from CTA patterns already proven in Phase 2; this is the actual conversion mechanism and the v2/v3 architectural seam, so it should be built deliberately rather than bolted on last.
**Delivers:** Short contact/inquiry form (3-5 fields, multi-office selector), Server Action -> persisted `leads` table -> email notification, region-specific landing content for Solihull/London/Nottingham.
**Implements:** Server Action -> Data Store -> Notification pattern (Architecture Pattern 3) — explicitly avoids Anti-Pattern 2 (email-only form).
**Avoids:** Security Mistakes table — server-side validation, honeypot/rate-limiting on the form endpoint.

### Phase 5: Performance, Accessibility & SEO Hardening
**Rationale:** These cross-cutting concerns (CWV, reduced-motion, keyboard nav, LocalBusiness structured data) must be verified per-template, not just once at the end, but a dedicated hardening phase catches anything that slipped through per-phase checks, and is where the "Looks Done But Isn't" checklist gets run in full.
**Delivers:** Lighthouse/PageSpeed passes (mobile-throttled) on every template, manual keyboard + screen-reader smoke test, `prefers-reduced-motion` toggle verification, JSON-LD LocalBusiness schema validated via Rich Results Test, real mid-range Android device test.
**Addresses:** All 8 critical pitfalls from PITFALLS.md, cross-checked against the "Looks Done But Isn't" checklist.

### Phase Ordering Rationale

- Foundation-first ordering (motion primitives + content architecture before real pages) directly follows ARCHITECTURE.md's Pattern 1 rationale: proving the Awwwards-grade motion quality on placeholder content decouples animation risk from content/CMS/client-approval risk.
- Case studies are sequenced after homepage/services (not first) because they're the highest-complexity page type (HIGH implementation cost per FEATURES.md) and depend on the case-study template being right before the gallery is built around it.
- Contact/lead-capture is deliberately not the very first thing built, but its data model (`leads` table schema) is defined in Phase 1, this avoids Anti-Pattern 2 (retrofitting persistence onto an email-only form) while not blocking earlier phases on it.
- A dedicated hardening phase exists because PITFALLS.md is explicit that CWV/accessibility/SEO issues are typically "invisible in a quick demo" and discovered late, the roadmap should not treat these as implicit side effects of other phases.

### Research Flags

Needs research during phase planning:
- **Phase 1 (CMS decision):** The Sanity/Payload conflict is unresolved (see Open Decision) — needs explicit user input or a `/gsd:research-phase` pass focused specifically on CMS choice before this phase is planned in detail.
- **Phase 2/3 (WebGL hero):** Contingent on design direction — if a 3D/shader hero is confirmed, this needs dedicated research into Three.js/R3F integration and performance isolation before implementation.
- **Phase 5 (LocalBusiness structured data / local SEO specifics):** PITFALLS.md and FEATURES.md flag local-SEO claims as MEDIUM confidence, industry-sourced rather than primary-verified; worth a lighter validation pass against current Google guidance at implementation time.

Phases with standard, well-documented patterns (skip deep research):
- **Phase 1 (motion primitives, `useGSAP` pattern):** HIGH confidence, official GSAP/Next.js documentation.
- **Phase 4 (Server Action + Zod contact form):** HIGH-MEDIUM confidence, well-established 2025-2026 Next.js pattern.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH (technical) / MEDIUM (Awwwards-usage claims) | Versions verified via live npm registry lookups and official docs; "what Awwwards sites actually use" is WebSearch-sourced and cross-verified but not a formal survey |
| Features | MEDIUM-HIGH | Table stakes/conversion patterns corroborated across multiple construction-marketing sources; Awwwards interaction patterns verified against only two reference sites (Storey Architecture, Kononenko) — researcher explicitly recommends spot-checking 3-5 more before design lock |
| Architecture | MEDIUM-HIGH | Next.js App Router and GSAP integration patterns are HIGH confidence (official docs, stable conventions); CMS/backend recommendation is MEDIUM — a reasoned architectural bet, not the only valid option (see Open Decision) |
| Pitfalls | MEDIUM-HIGH | GSAP/Lenis/Next.js technical claims verified against official docs/GitHub issues (HIGH); local-SEO and small-business-conversion claims are MEDIUM, cross-referenced across multiple industry sources but not a single authoritative source |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **CMS choice (Sanity vs. Payload):** Unresolved conflict between STACK.md and ARCHITECTURE.md — must be explicitly decided with the user before Phase 1 is planned in detail (see Open Decision section above).
- **WebGL/3D hero scope:** Both FEATURES.md and STACK.md flag this as design-direction-dependent, not yet confirmed — resolve during design/requirements phase before Phase 2/3 planning, to avoid speculatively adding `three`/`@react-three/fiber`.
- **Motion package version drift:** STACK.md notes `motion` (formerly Framer Motion) ships frequently (npm showed both 12.x and 13.x as current during research) — re-verify exact version and React 19 compatibility at implementation kickoff.
- **Next.js 15 vs. 16:** STACK.md recommends 15.5.x LTS today but flags that if implementation start is delayed several weeks, Next 16 may have stabilized (React canary -> stable) and become preferable — re-verify at kickoff, do not float on `latest`.
- **Awwwards interaction inventory:** Features research is based on two reference sites; recommend a quick spot-check of 3-5 additional current Awwwards Site-of-the-Day architecture/construction sites during the design phase to confirm interaction patterns are still current (trends shift, research is a September 2026 snapshot).

## Sources

### Primary (HIGH confidence)
- Next.js official docs — App Router, Route Groups, Image component, upgrading to v16
- npm registry live lookups (2026-09-08) for next, react, gsap, lenis, motion, @sanity/client, payload, tailwindcss, sharp, three, @react-three/fiber, @react-three/drei, clsx, tailwind-merge, next-view-transitions
- GSAP official docs and forum — `useGSAP`, SplitText, ScrollTrigger
- Webflow — GSAP becomes free (official announcement, April 2025)
- Motion (motion.dev) official React docs and upgrade guide
- Lenis — official GitHub README (darkroomengineering/lenis)
- Payload — official "Payload 3.0" blog post and docs
- Adrian Roselli — Keyboard-Only Scrolling Areas (recognized accessibility authority)
- GitHub greensock/GSAP Issue #642 — SplitText screen reader exposure (primary source)

### Secondary (MEDIUM confidence)
- WebSearch: Awwwards Site-of-the-Day tech-stack case studies (By-Kin, etc.) cross-referenced across multiple write-ups
- Headless CMS comparison articles (dev.to, Makers Den, FocusReactive, Cosmic, nayankyada.com) for Sanity/Payload/Storyblok tradeoffs
- Storey Architecture and Kononenko Architectural Bureau — Awwwards listings (WebFetch summaries)
- Construction/contractor lead-gen conversion sources (ProjectMark, Bullseye Marketing, Construction Digital Marketing, Lead Origin, Contractor Accelerator)
- 2025 Web Almanac Core Web Vitals findings (corewebvitals.io aggregated data)
- LocalBusiness structured data / local SEO industry sources (redarrowmarketing.com)

### Tertiary (LOW confidence)
- Small-business web-design-mistake roundups (Levitate, CFGroove, The Hangline, Bracha Designs) — treated as corroborating pattern only, individually low confidence
- Specific cited conversion statistics ("202% better conversion," "9x more likely to convert within 5 minutes") — directional industry figures, not independently verified primary research

---
*Research completed: 2026-09-08*
*Ready for roadmap: yes, pending CMS decision (see Open Decision)*
