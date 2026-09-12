# Feature Research

**Domain:** Awwwards-caliber architecture/construction/design-studio marketing & portfolio site (UK building contractor)
**Researched:** 2026-09-08
**Confidence:** MEDIUM-HIGH (table stakes and conversion patterns are well-corroborated across multiple sources; specific Awwwards interaction patterns verified via two reference sites — Storey Architecture, Kononenko Architectural Bureau — plus broader ecosystem search; some findings are pattern-level rather than site-specific and should be spot-checked against 3-5 more live Awwwards SOTD examples before final design lock)

## Feature Landscape

### Table Stakes (Users Expect These)

Features any credible architecture/construction portfolio site needs. Missing these makes the site feel incomplete or untrustworthy regardless of how polished the motion design is.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Project gallery / portfolio index | Primary way visitors browse capability and taste | LOW-MEDIUM | Grid or list of project cards; needs filtering by service type for Stoneage (New Build / Renovation / Extension / Conversion) to help prospects self-identify |
| Individual case study pages | Proof of execution, the actual "sales" content | MEDIUM | Needs consistent structure (see Case Study Structure below); this is the highest-leverage page type for both awards and lead conversion |
| About / team page | Trust-building, "who am I hiring" | LOW | Real people, real photos (see Anti-Features: stock imagery) |
| Services overview + per-service pages | Visitors search by service (e.g. "loft conversion Solihull") and need SEO-indexable dedicated pages | MEDIUM | Each of New Builds / Renovations / Extensions / Conversions (HMO, flats, loft, garage) / Basements should have its own page for SEO + clarity; supports local SEO across 3 offices |
| Contact / inquiry form | The actual conversion mechanism — everything else exists to drive traffic here | LOW-MEDIUM | Must be short, mobile-friendly, low-friction (see Conversion section) |
| Multi-office / location info | Client has 3 offices (Solihull, London, Nottingham); visitors need to know if contractor serves their area | LOW | Simple page or footer/contact section; supports local SEO (separate landing pages per region are a differentiator, see below) |
| Mobile-responsive layout | Majority of local/service searches happen on mobile; construction leads often browsed on-site at a property | MEDIUM | Non-negotiable; motion-heavy sites frequently fail this — must be designed mobile-first, not degraded desktop |
| Clear primary navigation | Users need to find Projects/Services/About/Contact without hunting | LOW | Awwwards sites often hide nav behind a menu button — acceptable IF the CTA (contact/enquire) stays persistently visible |
| Fast page load / Core Web Vitals baseline | Google ranking factor + user patience threshold; also required for Awwwards technical scores | MEDIUM-HIGH | Directly in tension with heavy animation/imagery — must be actively engineered (image optimization, lazy loading, code-splitting GSAP/WebGL bundles) |
| Basic accessibility (keyboard nav, contrast, reduced-motion support) | Legal/ethical baseline (UK Equality Act relevance for public-facing business site) + Awwwards judges usability | MEDIUM | `prefers-reduced-motion` media query support is now a de facto Awwwards technical-score expectation, not optional |
| SSL/HTTPS, standard SEO metadata, OpenGraph tags | Baseline credibility and shareability | LOW | Trivial in Next.js but must not be skipped |
| Testimonials / client reviews | Social proof reduces perceived risk for a large spend (construction projects) | LOW | Ideally tied to specific case studies rather than a generic wall of quotes |
| Certifications / credentials display | UK construction trust signals: JCT contract usage, FMB/NHBC/Checkatrade-style accreditation, warranty terms | LOW | Client already has 10yr structural warranty (new builds) and 3yr workmanship guarantee (extensions) — these are underused trust assets, should be prominent, not buried |

### Differentiators (Competitive Advantage — What Gets Awwwards Nominations)

These are not required for a functioning site, but are what separates "professional agency site" from "Site of the Day" caliber. Each should be deployed deliberately, not everywhere.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cinematic hero with scroll-triggered narrative sequence | First 3-5 seconds is what makes/breaks Awwwards judging and visitor impression; sets brand tone (calm, material honesty, editorial) | HIGH | Reference sites (Storey Architecture, Kononenko) both lead with a strong hero + scroll-driven reveal. Should use GSAP ScrollTrigger + Lenis smooth-scroll. Must have a static/no-JS fallback (see Anti-Features) |
| Text reveal animations (mask/clip-path/split-text) | Reinforces "bold editorial type" direction, elevates otherwise plain content sections | MEDIUM | GSAP SplitText or CSS clip-path; cheap to implement once a pattern is built, reusable across pages |
| Scroll-driven storytelling on case study pages | Turns a project write-up into a guided narrative (brief → process → materials → outcome) instead of a static page, increasing time-on-page and comprehension | HIGH | This is the single highest-value differentiator for THIS client because case studies are also the primary lead-conversion asset — worth the investment |
| Parallax image/media treatment | Adds depth and production value to photography-heavy pages | MEDIUM | Used by both reference sites; must be performance-budgeted (GPU-friendly transforms only, not layout-triggering) |
| Custom cursor (contextual, e.g. "View Project" label follows cursor on hover) | Signature Awwwards-era interaction; adds perceived craft | LOW-MEDIUM | Should degrade gracefully on touch devices (i.e. simply not render) — pure enhancement, never core functionality |
| Magnetic buttons / hover micro-interactions on CTAs | Makes primary CTAs (Enquire, View Project) feel premium and draws the eye without being gimmicky | LOW-MEDIUM | High value-to-cost ratio; directly reinforces conversion since it's applied to CTA elements |
| Page transition choreography (persistent header/nav, animated route changes) | Coherence across page loads, feels like an "experience" rather than a stack of pages | HIGH | In Next.js requires View Transitions API or a custom transition layer; adds real engineering complexity — recommend scoping to key routes (home→project, project→project) rather than every link |
| Filterable/sortable project index with animated grid reflow | Lets visitors self-segment by service type quickly, doubles as an interaction showcase | MEDIUM | Directly useful for Stoneage since services map cleanly to filter categories |
| Before/after or process-stage visual comparison (slider or scroll-scrubbed) | Construction-specific differentiator — visually proves capability on renovations/extensions in a way generic architecture portfolios don't need | MEDIUM | High relevance for this client specifically: renovations/extensions/basements are transformation-driven work, a before/after slider is a natural, on-brand differentiator not overused in the architecture-portfolio genre |
| Editorial "journal" or process/insights content | Signals thought leadership, supports SEO, gives reason to return | MEDIUM | Storey Architecture has this (Journals). Optional for v1 — flag as a strong v1.x candidate rather than launch-blocking |
| Subtle WebGL/shader accents (e.g. grain texture, distortion on hover, gradient mesh) | Adds a premium, "crafted" feel that separates top-tier Awwwards sites from merely-competent GSAP sites | HIGH | Use sparingly — 1-2 tasteful touches (e.g. hover distortion on hero image, subtle noise overlay) rather than full 3D scenes. High complexity-to-value ratio if overdone; see Anti-Features |
| Custom loading/intro sequence | Reinforces brand-as-craft on first visit | MEDIUM | Only justified if it's short (<1.5s), skippable, and shown once per session (localStorage) — otherwise becomes a bounce risk |
| Micro-copy and empty-state polish (404 page, form success states) | Kononenko's custom 404 was specifically called out; small details judges/users notice | LOW | Cheap, high polish-per-effort |
| Region-specific landing content (Solihull / London / Nottingham) | Local SEO differentiator + lets each office page speak to local project examples | MEDIUM | Not purely aesthetic — this is a conversion/SEO differentiator specific to the multi-office structure |

### Anti-Features (Commonly Requested, Often Problematic)

Things that look appealing (especially with an "Awwwards" brief) but actively hurt load time, accessibility, or — critically for this client — lead conversion.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Full-scene WebGL / Three.js on every page | "It'll look impressive everywhere" | Massive bundle size, battery/thermal drain on mobile, high dev cost, accessibility nightmare, frequently breaks on older devices — for a lead-gen site this actively taxes the exact users (mobile, on-site, time-pressured) who convert | Reserve WebGL/shader touches for 1-2 hero moments only; everything else stays performant DOM/CSS/GSAP |
| Autoplay sound / background audio | "Adds atmosphere" | Universally disliked, triggers immediate bounce, violates user expectation and most browser autoplay policies anyway | Opt-in sound toggle only if used at all (rare for this domain); skip entirely for v1 |
| Mandatory long intro/loading animation with no skip | "Sets the mood" | Repeat visitors and mobile users on data connections abandon before the site even loads; directly conflicts with lead-gen goal | Session-based (show once), always skippable, capped under ~1.5s |
| Horizontal scroll for primary navigation of core content | Trendy in some Awwwards work | Disorients users, breaks browser back-button/scroll-wheel expectations, poor mobile translation, hurts accessibility (screen readers, keyboard nav) | Reserve horizontal scroll (if used at all) for a self-contained showcase moment (e.g. a project image carousel within a case study), never for primary site navigation |
| Overly long/complex inquiry form (10+ fields, budget ranges, project uploads upfront) | "More info = better-qualified leads" | Each additional field measurably drops form completion; contractors lose warm leads to competitors with a 3-field form | 3-5 fields max for the primary CTA (name, email/phone, project type, message); defer detailed qualification to a follow-up call/email |
| Custom cursor or hover interactions that hide/replace native cursor everywhere including on forms/links critical to conversion | "Consistent branding" | Custom cursors on interactive form elements and text-heavy content actively degrade usability and can break for accessibility tools | Scope custom cursor to hero/gallery/media zones only; always fall back to native cursor on forms, body text, and touch devices |
| Stock photography instead of real project photos | Faster to launch, no photography budget/scheduling needed | Directly undermines the "real people, real trucks, real local projects" trust signal that construction buyers specifically look for; also weakens Awwwards content score | Budget for professional photography of actual completed projects and team; this is non-negotiable given "real project history" already exists to draw from |
| Chatbot / AI assistant on the marketing site | Feels modern, "everyone has one" | Explicitly out of scope for this milestone (v2/v3 per project context); adds engineering surface with no v1 payoff and risks looking like an empty gimmick if not well-trained | Defer to future milestone; use a plain, fast contact form for v1 |
| Infinite/auto-advancing carousels for hero or key trust content | Common "modern site" request | Auto-advance interrupts reading, hides content from users who don't catch it in time, accessibility issue (WCAG 2.2.2) | User-controlled carousels only, or replace with a static curated selection |
| Parallax/scroll effects applied indiscriminately across every section | "More motion = more impressive" | Motion fatigue, nausea risk for vestibular-sensitive users, performance cost compounds across a long page, dilutes the impact of motion where it actually matters | Apply scroll storytelling deliberately to 2-3 high-value moments (hero, case study narrative) and keep secondary content (services list, contact) calm and fast |
| Skipping `prefers-reduced-motion` support to save dev time | Motion-heavy build already complex, this feels like extra scope | Directly excludes vestibular-disorder users, fails WCAG 2.3.3, and is increasingly checked by Awwwards judges as a technical-quality signal | Build reduced-motion fallback into the animation system from day one (e.g. GSAP's `matchMedia`), not bolted on later |

## Feature Dependencies

```
[Project Gallery/Index]
    └──requires──> [Case Study Page Template]
                       └──requires──> [Photography/Media Asset Pipeline]
                       └──enhances by──> [Before/After Slider] (renovation/extension case studies)
                       └──enhances by──> [Scroll-Driven Narrative Sequence]

[Case Study Page]
    └──feeds──> [Contact/Inquiry Form] (via "Enquire about a similar project" CTA)

[Services Pages]
    └──requires──> [Trust Signals: Warranty/Certification Content] (JCT, 10yr/3yr warranty copy)
    └──enhances by──> [Region-Specific Landing Content] (Solihull/London/Nottingham)

[Cinematic Hero + Scroll Storytelling]
    └──requires──> [Smooth-scroll library (Lenis) + GSAP ScrollTrigger]
    └──requires──> [prefers-reduced-motion fallback] (must ship together, not after)
    └──conflicts with──> [Fast initial load / Core Web Vitals] unless actively code-split and asset-optimized

[Custom Cursor / Magnetic Buttons]
    └──enhances──> [Primary CTAs] (Enquire, View Project)
    └──conflicts with──> [Mobile/touch UX] — must no-op on touch devices, not degrade

[Filterable Project Grid]
    └──requires──> [Project data model with service-type taxonomy] (New Build / Renovation / Extension / Conversion / Basement)

[Region-Specific Landing Content]
    └──requires──> [Multi-office data structure] (Solihull / London / Nottingham)
    └──enhances──> [Local SEO]

[Contact Form]
    └──conflicts with──> [Long qualification forms] — keep short; longer qualification happens post-lead, not in-form

[Full-scene WebGL]
    └──conflicts with──> [Core Web Vitals] and [Mobile performance] — excluded from v1 scope by design
```

### Dependency Notes

- **Project Gallery requires Case Study Page Template:** The gallery is only as good as what it links to — build the case study template and structure first (it's also the primary conversion asset), then build the index/gallery around it.
- **Scroll Storytelling conflicts with fast load unless actively engineered:** This is the central tension of the whole brief. GSAP/Lenis/ScrollTrigger and high-res project photography are both essential to the "Awwwards-caliber" goal and both threaten Core Web Vitals. Resolve via code-splitting animation bundles per-route, next/image optimization, and reserving heaviest motion (WebGL/shader) for the homepage hero only.
- **Custom Cursor/Magnetic Buttons enhance CTAs, not everything:** Scope these features narrowly (hero, project cards, primary CTA buttons) rather than sitewide to avoid the anti-feature failure mode (interfering with forms/text).
- **Region-Specific Landing Content enhances Local SEO:** Given three physical offices, dedicated location pages (or at minimum location-aware content blocks) meaningfully improve "[service] + [city]" search visibility — this is a differentiator with direct lead-gen ROI, not just a nice-to-have.
- **prefers-reduced-motion must ship with, not after, the hero/storytelling build:** Retrofitting accessibility into a GSAP timeline system is significantly more expensive than designing for `matchMedia`-based branching from the start.

## MVP Definition

### Launch With (v1)

Minimum viable product for this milestone — Awwwards-caliber marketing/portfolio site, no CRM/AI.

- [ ] Cinematic homepage hero with scroll-triggered narrative (GSAP + Lenis) — core brand differentiator, referenced directly in project brief
- [ ] Project portfolio/gallery index with service-type filtering — primary browse path
- [ ] Case study page template with consistent structure (brief, process, materials, before/after where applicable, outcome, CTA) — primary conversion asset
- [ ] Real project photography populated into case studies (from existing project history) — non-negotiable trust asset
- [ ] Services pages (New Builds, Renovations, Extensions, Conversions incl. HMO/flats/loft/garage, Basements) with warranty/certification content
- [ ] About/team page with real people
- [ ] Short contact/inquiry form (3-5 fields) with multi-office selector (Solihull/London/Nottingham)
- [ ] Testimonials tied to specific projects
- [ ] Text reveal animations and magnetic-button/hover micro-interactions on CTAs — high value-to-cost differentiator
- [ ] Mobile-first responsive build with performance budget enforced from day one
- [ ] `prefers-reduced-motion` fallback built into the animation system
- [ ] Basic SEO/OpenGraph metadata, HTTPS

### Add After Validation (v1.x)

- [ ] Before/after scroll-scrubbed slider on renovation/extension/basement case studies — add once base case study template is proven, since it's a bespoke build per media type
- [ ] Editorial "journal"/insights section — add once core commercial pages are live and indexed
- [ ] Region-specific landing pages with local project curation (beyond a simple office-selector) — add once initial SEO performance data shows which regions need dedicated pages
- [ ] Page transition choreography across routes — polish layer, add once core pages are stable
- [ ] Custom cursor — polish layer, low risk to add post-launch
- [ ] Subtle WebGL/shader accent on hero (if not included in initial launch due to timeline) — can be layered onto an already-performant hero

### Future Consideration (v2+)

- [ ] AI features (chat/assistant, AI-driven project matching) — explicitly out of scope per milestone context, future milestone
- [ ] CRM integration for lead management — explicitly out of scope per milestone context, future milestone
- [ ] Client portal / project tracking for active customers — not part of marketing site goal
- [ ] Full custom loading/intro sequence with brand animation — defer until core motion system is proven and only if it doesn't threaten load performance

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|----------------------|----------|
| Case study page template + real photography | HIGH | MEDIUM | P1 |
| Cinematic hero + scroll storytelling | HIGH | HIGH | P1 |
| Project gallery with service filtering | HIGH | MEDIUM | P1 |
| Short contact form (multi-office) | HIGH | LOW | P1 |
| Services pages w/ trust signals (warranty, JCT) | HIGH | LOW-MEDIUM | P1 |
| Text reveal + magnetic CTA micro-interactions | MEDIUM-HIGH | LOW-MEDIUM | P1 |
| Testimonials tied to case studies | MEDIUM-HIGH | LOW | P1 |
| Mobile-first perf budget / reduced-motion support | HIGH (risk mitigation) | MEDIUM | P1 |
| Before/after slider (renovations) | MEDIUM-HIGH | MEDIUM | P2 |
| Region-specific landing content | MEDIUM | MEDIUM | P2 |
| Page transition choreography | MEDIUM | HIGH | P2 |
| Custom cursor | LOW-MEDIUM | LOW-MEDIUM | P2 |
| Journal/insights content | LOW-MEDIUM | MEDIUM | P3 |
| WebGL/shader hero accent | MEDIUM (awards signal) | HIGH | P2-P3 |
| Custom loading/intro sequence | LOW | MEDIUM | P3 |
| Full-scene WebGL sitewide | LOW (negative ROI) | HIGH | Excluded |
| Chatbot/AI assistant | N/A (out of scope) | HIGH | Excluded (v2+) |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Case Study Structure (Recommended Pattern)

Based on award-winning architecture portfolio conventions and construction lead-gen best practice, each case study should follow a consistent narrative structure — this doubles as both the Awwwards "storytelling" differentiator and the primary sales asset:

1. **Hero** — hero image/video of the finished project, project name, location, service type tag
2. **Brief/Challenge** — what the client needed, constraints (planning permission, site conditions, budget context)
3. **Process** — approach, key decisions, materials, timeline; this is where scroll-driven storytelling adds the most value
4. **Before/After** — especially critical for renovations/extensions/conversions/basements (transformation-driven work)
5. **Outcome** — finished result gallery, warranty/guarantee applied (10yr structural / 3yr workmanship), any certifications relevant
6. **Client testimonial** — tied specifically to this project, not generic
7. **CTA** — "Enquire about a similar project" leading directly to the short contact form, ideally pre-filled with the service type

## Conversion-Focused Recommendations (Beyond Aesthetics)

Since the client's real goal is qualified inquiries, not just design recognition, these are the site-wide practices most correlated with lead conversion for contractor/construction sites:

- **CTA placement and specificity:** Use action-specific CTA copy ("Get a Project Estimate", "Enquire About This Project") rather than generic "Submit" or "Learn More"; place CTAs above the fold on homepage, at the end of every case study, and in the footer/nav persistently.
- **Form friction reduction:** 3-5 fields maximum for the primary form; every additional field measurably reduces completion. Detailed project qualification (budget, timeline, drawings) happens in a human follow-up, not the initial form.
- **Trust signal proximity to CTAs:** Place warranty terms, certifications, and testimonials near conversion points (end of case studies, near contact form), not only on a separate "About" page.
- **Real people/real work rule:** Actual team photos, actual completed local projects, actual trucks/site photography — this is specifically what differentiates trustworthy contractor sites from generic template sites, and aligns directly with the "real project history" asset this client already has.
- **Response-time expectations set on the form:** Stating an expected response time (e.g. "We respond within 1 business day") near the form measurably increases completion confidence, even though actual CRM/auto-response workflows are out of scope for this milestone.
- **Local/regional signals:** Multi-office structure (Solihull, London, Nottingham) should be visible and selectable at the point of contact, and ideally reflected in project examples shown per region — directly supports both trust and local SEO.
- **Mobile performance as a conversion issue, not just a UX issue:** Slow mobile load directly loses leads who are searching on-site or time-pressured; this elevates performance budgeting from a "nice engineering practice" to a lead-gen requirement.

## Sources

- [Storey Architecture — Awwwards listing](https://www.awwwards.com/sites/storey-architecture) (MEDIUM confidence — WebFetch summary of Awwwards page and community scoring)
- [Kononenko Architectural Bureau — Awwwards listing](https://www.awwwards.com/sites/kononenko-architectural-bureau) (MEDIUM confidence — WebFetch summary, Site of the Day, developer/animation scoring detail)
- [Scroll-driven Storytelling — Awwwards Inspiration](https://www.awwwards.com/inspiration/scroll-driven-storytelling-synapser-studio) (MEDIUM — pattern reference)
- [Made With GSAP — Awwwards SOTD](https://www.awwwards.com/sites/made-with-gsap) (LOW-MEDIUM — GSAP interaction pattern reference)
- [ProjectMark — Construction Website Design: Essential Elements](https://www.projectmark.com/blog/construction-website-design) (MEDIUM — construction-industry web design guidance)
- [Bullseye Marketing Consultants — High Converting Contractor Websites 2026 Checklist](https://www.bullseyemarketingconsultants.com/marketing/high-converting-contractor-websites-the-2026-lead-generation-checklist/) (MEDIUM — conversion benchmarks, e.g. 11%+ conversion rate, 5-minute lead response)
- [Construction Digital Marketing — Role of CTAs in Boosting Lead Generation for Contractors](https://constructiondigitalmarketing.com/cro/the-role-of-ctas-in-boosting-lead-generation-for-contractors/) (MEDIUM — CTA copy/placement guidance, personalized-CTA conversion lift figure)
- [Lead Origin — Building Trust Online for Large Construction Projects](https://leadorigin.com/how-to-build-trust-online-for-construction-projects/) (LOW-MEDIUM — trust signal patterns)
- [Contractor Accelerator — 7 Website Fixes for Better Lead Generation for Contractors 2025](https://contractoraccelerator.com/blog/7-website-fixes-for-better-lead-generation-for-contractors-in-2025) (LOW-MEDIUM — form friction, mobile guidance)
- General WCAG 2.2/2.3 accessibility guidance (prefers-reduced-motion, auto-advancing content) — training knowledge, standard/stable web platform guidance, treated as HIGH confidence as these are long-established, non-volatile standards

**Note on confidence:** Trust-signal, CTA, and form-friction findings are corroborated across multiple independent construction-marketing sources (MEDIUM-HIGH confidence as a pattern, though specific statistics like "202% better conversion" and "9x more likely to convert within 5 minutes" are commonly cited industry figures that should be treated as directional rather than verified primary research). Awwwards interaction-pattern findings are grounded in two directly-referenced client sites plus general ecosystem search; recommend the requirements/design phase spot-check 3-5 additional current Awwwards SOTD architecture sites before finalizing the interaction inventory, since Awwwards trends shift and this research reflects a snapshot as of September 2026.

---
*Feature research for: Awwwards-quality construction/architecture marketing site (Stoneage Properties)*
*Researched: 2026-09-08*
