# Phase 2: Core Pages — Home, Services & About — Research (Second Re-Plan)

**Researched:** 2026-09-10
**Domain:** GSAP ScrollTrigger/SplitText defect root-causing (stuck opacity, overlapping text), full-viewport GSAP hero carousel, lightweight testimonials carousel, reintroducing a dedicated `/services` route alongside a homepage teaser, Storey-style nav chrome (button-styled modal trigger), licensed stock photography sourcing/licensing, and lightweight decorative section dividers
**Confidence:** HIGH on the ScrollTrigger/SplitText root cause and fix (verified directly against official GSAP docs plus this project's actual `Reveal.tsx`/`TextReveal.tsx` source), HIGH on the `/services` route reintroduction (git history has the exact dropped implementation), MEDIUM on hero carousel/testimonials-carousel implementation choice and stock-photo sourcing (WebSearch cross-referenced, no single authoritative spec exists), LOW/none on anything requiring a new heavy dependency (none needed — carousel and testimonials both buildable with GSAP alone or Embla as the sole allowed exception, see below).

> **This file replaces the 2026-09-09 first-pivot 02-RESEARCH.md.** The first-pivot topics (single-page anchor nav + scroll-spy, `/contact` as a parallel+intercepting-route sliding modal, `/work`→`/projects` rename, condensing route content into sections) are still architecturally valid and are condensed below, not re-researched. Everything under "New for the Second Re-Plan" is new research for the 02-10 checkpoint rejection (animation defects + Storey template replication).

## Summary

The second pivot has two independent problem classes. First: **the 02-10 animation defects are a real, root-causable bug, not a design disagreement.** Reading this project's actual `TextReveal.tsx` and `Reveal.tsx` source confirms the exact anti-pattern GSAP's own docs warn against: `TextReveal` calls `SplitText.create(..., { autoSplit: true })` and then builds the `gsap.from(split.words, {...})` tween **outside** the `onSplit()` callback. GSAP's official SplitText docs state plainly: `autoSplit: true` reverts and re-splits text whenever webfonts finish loading (independent of any resize), and "make sure to create any animations in an `onSplit()` callback so that the freshly-split... elements are the ones being animated" — building the tween outside `onSplit()` means that when Fraunces/Inter (`next/font/google`) finish loading after first paint, SplitText silently re-splits the DOM into new word elements while the original tween keeps animating stale, now-detached elements — producing exactly the reported "hero headline lines overlapping mid-reveal." Second, related but distinct: `Reveal.tsx`'s `gsap.from(ref.current, { ..., scrollTrigger: { trigger: ref.current, start: "top 85%" } })` has no `end` and no manual refresh strategy; ScrollTrigger's start/end pixel offsets are computed once at mount, before the same async webfont swap reflows section/card heights, and before any images finish loading. There is no `document.fonts.ready`-driven `ScrollTrigger.refresh()` anywhere in the codebase. This is the shared root cause across all three 02-10 symptoms (hero, Services cards, About paragraphs): **layout-affecting async resources (fonts now, images once stock photography is added) finish loading after GSAP has already measured/split/triggered against the pre-load layout, and nothing tells GSAP to re-measure.**

Second: the Storey-replication requirements (hero carousel, testimonials, dedicated `/services`, nav chrome, stock photography, dividers) are all buildable with the existing stack (GSAP + Lenis + Next.js Image) with **zero new heavy dependencies required**, with one narrow exception worth flagging to the planner: a testimonials carousel is marginally more maintainable with **Embla Carousel** (~5-7KB gzipped, headless, no opinionated styling) than hand-rolled GSAP, but GSAP-only is equally valid and keeps the dependency count at zero — this is a real (Claude's-discretion-level) tradeoff, not a clear-cut "don't hand-roll," and is presented as an open question below rather than a prescription.

**Primary recommendation:** Fix the shared root cause once, in the primitives themselves, before rebuilding any section: (1) rewrite `TextReveal.tsx` to build its `gsap.from()` tween *inside* `SplitText.create()`'s `onSplit` callback; (2) add a single `document.fonts.ready.then(() => ScrollTrigger.refresh())` call (once, at the app root — e.g. inside `SmoothScrollProvider` — not per-component) so every existing and new `ScrollTrigger` (including `Reveal`'s) re-measures once webfonts settle; (3) once stock/hero images are added, reserve their aspect ratio (as `TeamStrip.tsx` already correctly does) and call `ScrollTrigger.refresh()` again on image load for any above-the-fold image affecting layout. Then rebuild sections (hero carousel, Services teaser + dedicated `/services` route, About, testimonials, nav chrome, dividers) on top of the fixed primitives, verifying scroll-behavior per section as it's rebuilt (per `02-CONTEXT.md`'s continuous-QA decision) rather than in one final pass.

## New for the Second Re-Plan

### Topic 1: Root-Causing the ScrollTrigger/SplitText "Stuck Opacity" and "Overlapping Text" Defects

**What:** Three reported symptoms — hero headline lines overlapping mid-reveal, Services cards past the first stuck below full opacity, About paragraphs stuck near-invisible next to fully-opaque team photos. Read directly from the codebase: `src/components/motion/TextReveal.tsx`, `src/components/motion/Reveal.tsx`, `src/components/motion/SmoothScrollProvider.tsx`, `src/lib/gsap.ts`, `src/app/layout.tsx` (confirms `Fraunces`/`Inter` loaded via `next/font/google`).

**Root cause A — `TextReveal`'s stale-element bug (explains hero headline overlap; also affects every other `TextReveal` heading, e.g. "What We Do", "About Stoneage Properties"):**
- Current code (`TextReveal.tsx` lines 50-74): `SplitText.create(ref.current, { type: "words", mask: "words", autoSplit: true, aria: "auto" })` is called, then `gsap.from(split.words, { ..., scrollTrigger: {...} })` is built immediately after, referencing `split.words` captured at that moment.
- **Verified via official GSAP SplitText docs (fetched 2026-09-10, `gsap.com/docs/v3/Plugins/SplitText/`):** "If `true`, SplitText will revert and re-split whenever the fonts finish loading or when... the width of the split element(s) changes [and] 'lines' are split." Font-loading-finish triggers a re-split **regardless of split type** (`words`, in this project's case) — this is not gated on `"lines"` being used. And: **"When using `autoSplit: true`, make sure to create any animations in an `onSplit()` callback so that the freshly-split line/word/character elements are the ones being animated."** Building animations outside `onSplit()` — exactly what this codebase does — risks targeting stale DOM elements after re-splitting occurs.
- **Mechanism:** `next/font/google` loads Fraunces/Inter asynchronously; when they finish loading (after the SplitText has already split + animated against fallback-font metrics), `autoSplit` silently reverts and rebuilds the word/mask DOM structure. The original `gsap.from()` tween keeps its reference to the now-detached old `split.words` array. Depending on timing, this can visually manifest as overlapping/duplicated word spans (old detached nodes still painted for a frame, new nodes rendering in a different position because line-wrap changed) — matching "lines overlapping mid-reveal" precisely.
- **The fix (per official docs, not a per-instance patch):** rebuild `TextReveal` so the tween is created and *returned* inside `SplitText.create()`'s `onSplit(self)` callback:
  ```typescript
  // Source: gsap.com/docs/v3/Plugins/SplitText/ (fetched 2026-09-10)
  SplitText.create(ref.current, {
    type: "words",
    mask: "words",
    autoSplit: true,
    aria: "auto",
    onSplit(self) {
      // Returning the tween here is required: GSAP automatically reverts
      // the previous tween and re-applies its elapsed totalTime() to the
      // new one, so re-splits (font load, resize) are seamless instead of
      // leaving stale elements animating.
      return gsap.from(self.words, {
        y: "100%",
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
  });
  ```
  Per the docs: "If you return your tween or timeline inside the `onSplit()` callback, your old animation will be safely `reverted()` before the new one is created" and GSAP "automatically save[s] the previous animation's `totalTime()` before reverting it, and appl[ies] it to the new one so that everything appears relatively seamless." This must be threaded through the existing `gsap.matchMedia()` reduced-motion branch (the `reduceMotion` case should also live inside/return from `onSplit`, setting `autoAlpha`/`y` on `self.words` directly).

**Root cause B — `Reveal`'s stuck-opacity bug (explains Services cards + About paragraphs):**
- Current code (`Reveal.tsx` lines 52-62): `gsap.from(ref.current, { y, opacity: 0, ..., scrollTrigger: { trigger: ref.current, start: "top 85%" } })` — no `end`, no manual refresh strategy anywhere in the app.
- **Verified via official GSAP ScrollTrigger docs (fetched 2026-09-10, `gsap.com/docs/v3/Plugins/ScrollTrigger/` and `.../refresh()/`):** ScrollTrigger "automatically recalculates positions when the window resizes," but the official docs do **not** list webfont-load or async-image-load as automatic refresh triggers — those require an explicit `ScrollTrigger.refresh()` call. This is corroborated (MEDIUM confidence, GSAP community forum consensus, cross-referenced against the official refresh() API) by the recurring, repeated GSAP-forum guidance pattern: wrap trigger-affecting setup in `document.fonts.ready.then(() => ScrollTrigger.refresh())`.
- **Mechanism:** `start: "top 85%"` is computed in pixels at the moment each `Reveal`'s `useGSAP()` effect runs — before Fraunces/Inter finish swapping in. Because Fraunces is a display serif with substantially different metrics than the fallback font, headings above/beside each `Reveal`'d element reflow after this initial calculation, shifting every element below on the page by a different amount depending on how much text precedes it (explains why "cards past the first" and "About paragraphs" are hit but not necessarily the very first element in a section — the first item's offset-from-section-top shifts least, later siblings shift more). Once positions are stale, the trigger's actual fire point no longer lines up with where GSAP thinks "top 85%" is; combined with `gsap.from()`'s default `immediateRender: true` (renders the `opacity: 0, y: 40` starting state immediately on creation regardless of scroll position), an element whose stale trigger has already been scrolled past without the real (recalculated) start point being crossed can be left rendered at its `from()` state or an interrupted intermediate value indefinitely — matching "stuck below full opacity" / "stuck near-invisible."
- **The fix (shared, not per-instance):** add exactly one `document.fonts.ready.then(() => ScrollTrigger.refresh())` call at the app root (recommended location: inside `SmoothScrollProvider.tsx`'s effect, alongside the existing `LenisGsapSync`, since that's the single place scroll/GSAP wiring already lives) so **every** `ScrollTrigger` in the app — current and future, `Reveal`'s included — gets one authoritative re-measure once webfonts are actually ready, regardless of which component created it. This does not require touching `Reveal.tsx` itself; the fix is structural/root-level, consistent with `02-CONTEXT.md`'s explicit instruction to fix the shared cause rather than patch three instances.
- **Second contributing factor to flag for the hero carousel + stock photography work specifically (not yet manifesting today since current images are all `aspect-square`-reserved, e.g. `TeamStrip.tsx`):** once stock photography is added to Hero/Services/About, any image without a reserved aspect-ratio container will reflow layout on load the same way fonts do. The fix generalizes: after adding the hero carousel/stock images, also call `ScrollTrigger.refresh()` on each above-the-fold image's `onLoad` (or, more robustly, reserve aspect-ratio via `next/image`'s `fill` + a sized wrapper `div`, exactly as `TeamStrip.tsx` already does, which avoids needing a refresh at all for that image). **Recommend the aspect-ratio-reservation pattern as primary, image-load-refresh as backup**, since reservation prevents the shift outright rather than reacting to it after the fact.

**Why this is root-cause, not per-instance patching:** Both fixes live in shared code paths (`TextReveal.tsx`'s `onSplit` restructure affects every `TextReveal` usage sitewide; the `document.fonts.ready` refresh call lives once in `SmoothScrollProvider.tsx` and covers every `ScrollTrigger` in the app, present and future) rather than adding conditional logic to the Hero, Services, or About components individually.

**Compatibility with existing `gsap.matchMedia()` reduced-motion contract:** Both fixes are orthogonal to reduced-motion handling — `matchMedia()` still gates whether the *animation* runs; the `onSplit` restructure and the `fonts.ready` refresh only affect *when GSAP correctly measures/rebuilds*, which must happen in both the reduced-motion and normal-motion branches equally (a reduced-motion user still needs correct final-state positioning, they just skip the animated transition to it).

**Confidence:** HIGH — both fixes are directly traceable to official GSAP documentation language read verbatim, applied against this project's actual (not hypothetical) source code.

### Topic 2: Full-Viewport Multi-Image Hero Carousel (Storey-Style)

**What:** Replace the current single-state Hero with a full-viewport crossfade/slide image carousel behind the headline, matching storeyarchitecture.co.uk.

**Implementation approach (no new dependency needed — GSAP alone, consistent with existing motion-primitive pattern):**
- A `HeroCarousel` component (new, `components/sections/` — domain-aware, not `components/motion/`, since it will take a `slides` prop of stock-photo image objects) holding N absolutely-positioned full-bleed `<Image fill>` layers, one active/visible at a time.
- Crossfade: `gsap.timeline({ repeat: -1 })` cycling `gsap.to(currentSlide, { autoAlpha: 0, duration: 1.2 })` / `gsap.to(nextSlide, { autoAlpha: 1, duration: 1.2 })` with a `stagger`-free sequential `.to()` chain and a hold (`duration` via an empty tween or `delay`) between transitions — animate `opacity`/`autoAlpha` only (compositor-friendly, avoids layout thrash), not `display`/`visibility` toggling directly.
- **Performance/LCP (WebSearch, cross-referenced against MDN's `LargestContentfulPaint` definition and general 2025/2026 Core Web Vitals guidance, MEDIUM confidence):** the *first* hero image is very likely the page's LCP element. Recommendations: mark the first slide's `next/image` with `priority` (skips lazy-loading, tells Next.js to preload it) and do **not** gate the first slide's visibility behind any GSAP-driven fade-in from `opacity: 0` — the first frame should render at full opacity immediately (only the *carousel cycling*, i.e. slide 2/3/4 crossfades, should be GSAP-animated); animate `transform`/`opacity` only, never `width`/`height`/`top`/`left` (layout-affecting properties cause repaint/reflow, defeating compositor-thread animation — this is standard, stable GSAP/web-perf guidance, not something that changed recently).
- **Accessibility — carousel-specific reduced-motion (distinct from the scroll-reveal `gsap.matchMedia()` contract already in `Reveal`/`TextReveal`):** WCAG 2.2.2 (Pause, Stop, Hide) is a **Level A** requirement for any auto-advancing content lasting >5s that starts automatically — a looping hero carousel qualifies. Verified via WebSearch cross-referencing WCAG's own success-criterion language (MEDIUM confidence, multiple accessibility-focused sources converge): (a) provide a visible pause/play control (does not need to be prominent, but must exist and be keyboard-reachable) regardless of `prefers-reduced-motion`; (b) under `prefers-reduced-motion: reduce`, do not autoplay/loop at all — show the first slide statically (or a very slow, minimal crossfade) rather than merely speeding up or skipping the transition animation, since the WCAG concern here is the *content moving on its own*, not transition smoothness; (c) pause on hover/focus is good practice but does not substitute for an explicit control per WCAG guidance. This is a **second, independent** `gsap.matchMedia()` check inside `HeroCarousel` (its own `reduceMotion`/`noPreference` branches) — do not try to reuse `Reveal`/`TextReveal`'s reduced-motion branch, since "don't animate a reveal" and "don't auto-cycle a carousel forever" are different concerns needing different fallback states (static final state vs. static first slide).

**Confidence:** HIGH on the GSAP mechanics (opacity/transform-only crossfade, consistent with the project's established motion-primitive patterns) and on WCAG 2.2.2's Level A pause requirement (directly from the criterion's own text); MEDIUM on the specific LCP/`priority` recommendation (standard Next.js/Core Web Vitals guidance, not carousel-specific, cross-referenced but not from a single canonical "GSAP hero carousel LCP" source).

### Topic 3: Testimonials Carousel

**What:** A new homepage section — a few client quotes in a carousel, consistent with the "don't hand-roll what GSAP already provides" principle from the first-pivot research.

**Finding:** This is a genuine, narrow tradeoff, not a clear-cut recommendation:
- **Option A — GSAP-only** (`gsap.timeline({ repeat: -1 })` cycling opacity/transform on quote slides, same pattern as the hero carousel, zero new dependency): consistent with this codebase's zero-new-dependency motion-primitive discipline; more code to hand-write for touch/swipe support if that's desired (GSAP has `Draggable`, a separate plugin bundled with the same `gsap` package used elsewhere in this project, if swipe is wanted — no additional install).
- **Option B — Embla Carousel** (WebSearch, MEDIUM confidence, converging recommendation across multiple 2025/2026 sources): "Embla's core is remarkably small (~4-7KB gzipped)... dependency-free, mobile-first" and explicitly called out as well-suited to "testimonial sliders" specifically; headless (no imposed styling), so it composes with this project's existing Tailwind/Typography components without a visual mismatch. Would be the **first UI dependency beyond GSAP/Lenis** in the project.
- **Recommendation for planner:** given testimonials are a low-stakes, low-complexity carousel (a handful of static quote cards, no images cycling, no LCP concern since it's below the fold), **Option A (GSAP-only)** keeps the dependency count at zero and reuses patterns the codebase already has muscle-memory for (same crossfade approach as Topic 2's hero carousel, just simpler — no `priority`/LCP concern). Reserve Embla only if swipe/drag-based interaction (not just autoplay+arrows) becomes a hard requirement, since hand-rolling robust touch/drag/momentum carousel physics is exactly the kind of "looks simple, has edge cases" problem the "Don't Hand-Roll" table exists for — but GSAP's own `Draggable` plugin (already bundled, zero extra install) covers most of that need if it comes up.

**Confidence:** MEDIUM — no single authoritative source prescribes one approach; this is presented as an explicit choice for planning, leaning toward the zero-dependency option given the low complexity of the actual content (quotes, not images).

### Topic 4: Reintroducing `/services` as a Dedicated Route

**What:** `02-CONTEXT.md` requires `/services` back as a real route (full per-service depth), with the homepage Services section becoming a 3-column photo-led teaser linking out to it.

**Finding — this is a straightforward revert-and-extend, not new research territory:** git history (`git show b23826b`, commit message `feat(02-03): add services index and dynamic [slug] detail template`, since dropped in `85b62f1 feat(02-06): drop dedicated /services and /about routes with redirects`) contains the exact prior implementation:
- `app/(marketing)/services/page.tsx` — a plain `.map()` over `SERVICES` rendering `name`/`summary` linking to `/services/[slug]`.
- `app/(marketing)/services/[slug]/page.tsx` — `generateStaticParams()` returning `SERVICES.map((s) => ({ slug: s.slug }))`, `generateMetadata()` per slug, `notFound()` on invalid slug, rendering `service.description` (the full field, unused by the homepage's condensed teaser) plus `TrustBadges` for the warranty detail.
- This `generateStaticParams` + typed-content-array pattern is **still the correct, current Next.js 15 approach** — nothing about static params generation for dynamic segments has changed between Next 15.5 (installed) and current docs; this was already confirmed HIGH confidence in the original (pre-first-pivot) 02-RESEARCH.md research and remains true.
- **Required config change:** `next.config.ts` currently has `{ source: "/services", destination: "/#services", permanent: true }` (added in 02-06 when the route was dropped) — **this redirect must be removed** now that `/services` is a real route again, otherwise the reintroduced page is unreachable (the redirect fires before the filesystem route resolves). `/about` should keep its existing `/#about` redirect since About stays a homepage-only section per `02-CONTEXT.md`.
- **Avoiding content duplication between the homepage teaser and the full page:** both consume the same `SERVICES` array from `content/services.ts` — the homepage's `ServicesSection` (already exists, currently renders `name`/`summary`/`warranty.label` per card) should keep rendering only the condensed fields and link each card (or a single "View All Services" CTA, or both) to `/services` / `/services/[slug]`; the full `/services/[slug]/page.tsx` renders `description` + full `warranty.detail`. No new content array or duplicated copy is needed — this was already the design intent baked into `content/services.ts`'s shape by the original 02-03 research (short/long field split).
- **Storey's 3-column photo-led teaser layout:** the homepage teaser gains a representative image per service (stock photography, per `02-CONTEXT.md`) alongside the existing `name`/`summary`/`warranty.label` — purely a layout/visual change to the existing `ServicesSection` grid (already `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), not a new architectural pattern.

**Confidence:** HIGH — exact prior implementation exists in git history and is directly reusable; the only genuinely new work is the photo-led visual layer and un-doing the 02-06 redirect.

### Topic 5: Nav Chrome — "Contact" as a Button Triggering the Modal-Intercepting Route

**What:** `02-CONTEXT.md` requires the nav's "Contact" link to render as a visually distinct button (filled/outlined), not a plain text link, while still triggering the existing `/contact` parallel+intercepting-route sliding modal rather than a full navigation.

**Finding — no gotcha exists; this is a styling change only, verified against the mechanics already established in the first-pivot research:** Next.js's intercepting-routes behavior is triggered by **any** client-side navigation via `next/link`'s `<Link>` component to the intercepted path — it is not conditioned on the link's visual presentation in any way. The project's own `Button` component already supports this exact composition pattern elsewhere in the codebase (`src/components/sections/Hero.tsx`: `<Button as={Link} href="/contact" variant="primary">Enquire</Button>`, confirmed by direct read) — `Button`'s `as={Link}` polymorphic pattern renders Next's `<Link>` under the hood with the button's visual styling applied via `className`, so `next/link`'s router-level interception logic is completely unaffected by which HTML element/classes are visually layered on top. The same `Button as={Link} href="/contact"` pattern used in `Hero.tsx` should simply be reused in `SiteNav.tsx` for the nav's "Contact" item (currently a plain `<Link href="/contact" className="text-ink-muted hover:text-ink">Contact</Link>` per direct read of `SiteNav.tsx`) — swap it for `<Button as={Link} href="/contact" variant={...}>Contact</Button>`, no other change needed. `MagneticButton` (used to wrap `Hero.tsx`'s CTAs) is optional/discretionary here — Storey's nav button doesn't appear to have a magnetic-follow effect, so plain `Button as={Link}` without the `MagneticButton` wrapper is the closer visual match, but this is a minor discretionary detail.

**Confidence:** HIGH — directly verified against this project's own already-working `Button as={Link}` pattern elsewhere; no Next.js documentation or community source suggests any interaction between link visual styling and intercepting-route behavior (they operate at entirely different layers — routing vs. CSS).

### Topic 6: Licensed Stock Photography Sourcing (Temporary Placeholder)

**What:** Source realistic UK residential architecture/construction stock photography for Hero, Services, Work preview, and About, as a deliberate, temporary, user-approved placeholder measure — **this explicitly overrides** REQUIREMENTS.md's Out-of-Scope note excluding stock photography; flagging this tension for the planner rather than silently resolving it, per the task's explicit instruction.

**Practical sourcing guidance (WebSearch, MEDIUM confidence — general licensing landscape, not project-specific legal advice):**
- **Unsplash** (now Getty-owned; Unsplash License permits free commercial and noncommercial use, no attribution legally required though appreciated) is the most frictionless source for generic "UK construction/architecture" imagery and has a dedicated searchable category for it; suitable for a temporary placeholder given zero licensing cost/friction.
- **Construction Photography** (London-based agency, est. 2001, 100,000+ built-environment images) is a UK-specific, industry-specialized paid stock source explicitly positioned as an alternative to Getty/Shutterstock for this exact vertical (construction/built environment) — worth flagging to the user as the more "on-brand" (paid) option if Unsplash's generic imagery doesn't read as premium/editorial enough for Storey-level presentation quality.
- **Stocksy** (cooperative, curated, premium/editorial-leaning aesthetic) is a reasonable middle ground between Unsplash's free-generic and Construction Photography's vertical-specific-but-paid positioning, if the editorial "Storey" look is the priority over cost.
- **Licensing considerations to flag to the user (not legal advice, practical flags only):** (a) confirm whether images will be used in paid advertising/social promotion, not just the website itself — some "free for commercial use" licenses (including Unsplash's) still have edge-case restrictions around using a recognizable subject/photographer's work in ways that imply endorsement; (b) since this is explicitly temporary/placeholder, budget for a swap-out pass before public launch — don't invest in a paid license for images destined to be replaced by real client photography; free (Unsplash) sourcing is the pragmatically correct choice for a temporary placeholder specifically, reserving paid/curated sourcing only if the placeholder period is expected to be long or public-facing before real photography arrives.
- **Next.js `<Image>` optimization for external/licensed images vs. local assets:** external image URLs (e.g., hotlinking directly from Unsplash) require adding the source domain to `next.config.ts`'s `images.remotePatterns` (current `next.config.ts`, confirmed by direct read, has no `images` config block at all yet — this is a required addition, not currently present) before `next/image` will optimize them; **recommend downloading and self-hosting the chosen images in `public/` instead of hotlinking**, since (a) it avoids the extra remote-fetch latency/dependency on a third party's CDN uptime for a production-quality Storey-level presentation, (b) it sidesteps any Unsplash-specific hotlinking terms nuance, and (c) self-hosted images benefit from Next.js's local static-import optimization path (automatic width/height inference from the file, which also helps prevent the exact layout-shift-before-ScrollTrigger-refresh problem discussed in Topic 1's Root Cause B). If external hosting is preferred anyway, `remotePatterns` must be configured per-domain.

**Confidence:** MEDIUM — sourcing options and general licensing shape are well-established via multiple converging sources, but this is explicitly practical guidance, not verified legal counsel; the Next.js `remotePatterns` requirement is HIGH confidence (standard, stable, documented Next.js `<Image>` behavior).

### Topic 7: Decorative Section-Divider Motifs

**What:** Storey uses paper/clip-style graphics between sections; `02-CONTEXT.md` calls for a lightweight, monochrome-adapted equivalent, exact visual treatment left to Claude's discretion.

**Finding:** No new dependency or research-heavy pattern needed — this is a design-system-consistent implementation choice:
- **SVG divider approach:** a small set of reusable inline SVG shapes (e.g., a torn-edge/zigzag path, a simple geometric wedge, or a thin ruled-line-with-tick motif) rendered as a `components/decorative/` component (sibling to the existing `BlueprintAccent.tsx`, confirmed present in `Hero.tsx`'s imports — this project already has a `components/decorative/` convention for exactly this kind of non-motion, non-domain decorative graphic), using the existing `--color-ink`/`--color-paper` design tokens for fill/stroke so it's automatically monochrome-consistent without new color values.
- **CSS `clip-path` approach:** an alternative/complementary technique — a section's top or bottom edge clipped with a `clip-path: polygon(...)` for an angled/torn-paper silhouette, requiring only CSS, no SVG asset — useful if the divider needs to be full-bleed-width and responsive without an SVG viewBox scaling concern.
- **Recommendation:** follow the existing `BlueprintAccent.tsx` pattern (a standalone decorative SVG component taking only generic props like `className`, consistent with this project's established `components/decorative/` convention) rather than introducing `clip-path` as a separate new technique, unless a specific full-bleed-edge effect is wanted that SVG scaling can't cleanly achieve — keeps the decorative layer's implementation approach singular/consistent.

**Confidence:** HIGH — this is standard, stable CSS/SVG technique with no fast-moving specification concerns, and directly extends an established pattern already present in the codebase (`BlueprintAccent.tsx`).

## Carried Forward From First-Pivot Research (Still Valid, Condensed)

The following remain architecturally correct and unaffected by the second pivot — full detail preserved in git history (prior version of this file):

- **Single-page anchor navigation + scroll-spy**: `SiteNav.tsx` already implements the recommended pattern — `ScrollTrigger.create({ trigger: "#id", toggleClass })` per section by string selector (not ref), Lenis's `anchors: true` (set in `SmoothScrollProvider.tsx`) for smooth-scroll-to-section, both automatically kept in sync via the existing `LenisGsapSync` (`useLenis(() => ScrollTrigger.update())` + `gsap.ticker`). This is unaffected by the hybrid page-structure change — the homepage's Hero/Services-teaser/Work-preview/About/Testimonials/Contact-CTA sections still use the same nav-anchor mechanism; only `/services` gaining a real route (Topic 4) is new, and it sits *alongside* the anchor-linked homepage teaser, not replacing it.
- **`/contact` as a parallel+intercepting-route sliding modal**: fully implemented already (`app/@modal/(.)contact/page.tsx`, `app/@modal/default.tsx`, real `app/contact/page.tsx` fallback) per the first-pivot research and 02-09's completed plan. Second pivot only expands the form's field set (name, email, project type, location, timeline, message — no submission logic) and changes the nav trigger's visual treatment (Topic 5 above) — the routing/modal mechanics themselves need no rework.
- **`/work` → `/projects` rename**: complete (02-06), including the `next.config.ts` redirect — unaffected by this pivot.
- **Condensing route-based content into sections**: the underlying principle (one typed content array, one render path) still applies; `/services` reintroduction (Topic 4) is the one exception where a dedicated route returns, and it reuses (not replaces) the same `SERVICES` array the homepage teaser also consumes.
- **Central GSAP plugin registration** (`src/lib/gsap.ts`, `gsap.registerPlugin(ScrollTrigger, SplitText)`, exactly once) and **reduced-motion living inside each primitive via `gsap.matchMedia()`** (never an external wrapper) remain the governing conventions for all new work in this pivot (hero carousel, testimonials carousel, and the `TextReveal`/`Reveal` fixes in Topic 1 all follow this contract).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Rebuilding a `SplitText` animation after fonts load/resize | A `useEffect` that manually listens for `document.fonts.ready` or `resize` and re-runs `SplitText.create()` + the tween from scratch, hoping to catch every re-split | `SplitText.create()`'s built-in `autoSplit: true` + building/returning the tween inside its `onSplit()` callback | GSAP's `onSplit()` already handles reverting the old split, preserving elapsed animation time (`totalTime()`), and rebuilding against the fresh DOM — a hand-rolled listener would need to reinvent this exact seamless-handoff behavior, which is precisely the documented purpose of `onSplit` |
| Detecting "has the layout settled enough to trust ScrollTrigger's measurements" | Polling `getBoundingClientRect()` in a loop, or a fixed `setTimeout` guess before creating ScrollTriggers | `document.fonts.ready.then(() => ScrollTrigger.refresh())` (fonts) + aspect-ratio-reserved image containers (images, as `TeamStrip.tsx` already does) | `document.fonts.ready` is the browser-native, exact signal for "webfonts have finished loading," and aspect-ratio reservation prevents the image-driven case from ever needing detection in the first place — both are more precise and less brittle than timing guesses |
| A carousel needing swipe/drag physics (hero or testimonials) | Hand-rolled touch/pointer-event drag tracking with momentum/inertia math | GSAP's `Draggable` plugin (already bundled with the installed `gsap` package, zero extra install) if drag interaction is wanted; otherwise plain autoplay timeline (no drag) is sufficient for both carousels per Storey's reference behavior | Drag/momentum physics is exactly the "looks simple, has many edge cases" category (release velocity, boundary snapping, direction locking) `Draggable` already solves |

**Key insight:** Every new Topic in this second pivot has either an existing official GSAP API designed for exactly this problem (`onSplit`, `ScrollTrigger.refresh()`, `Draggable`), an existing in-codebase pattern to extend (`Button as={Link}`, `BlueprintAccent`-style decorative SVGs, `TeamStrip`'s aspect-ratio reservation, the dropped-but-recoverable `/services/[slug]` route), or a well-established external sourcing landscape (stock photography) — no genuinely novel engineering surface is introduced.

## Common Pitfalls

### Pitfall 1: Building a `SplitText` animation outside `onSplit()` when `autoSplit: true` is set
**What goes wrong:** Exactly the current `TextReveal.tsx` bug — text lines/words overlap or duplicate visibly whenever a webfont finishes loading (or the container resizes) after the initial split+animate.
**Why it happens:** `autoSplit` silently reverts and rebuilds the split DOM on font-load/resize; any tween built against the *original* `split.words`/`split.lines` array keeps referencing now-stale, detached elements.
**How to avoid:** Always build (and `return`) the tween/timeline from inside `SplitText.create()`'s `onSplit(self)` callback, per official docs.
**Warning signs:** Visual overlap/duplication that appears specifically after fonts finish loading (often a brief flash, timing-dependent — may not reproduce every load, which is why it can look like a mysterious/intermittent bug rather than a deterministic one).

### Pitfall 2: Assuming ScrollTrigger auto-refreshes on webfont load or async image load
**What goes wrong:** `Reveal`'s current stuck-opacity bug — ScrollTrigger's documented automatic recalculation covers window resize; it does not cover webfont-swap-driven reflow or images loading in without a reserved aspect ratio, both of which silently invalidate previously-computed start/end offsets.
**Why it happens:** Official docs are explicit about resize-triggered auto-refresh but silent on font/image loading — easy to assume "GSAP handles this" when it doesn't, without exactly this on-page symptom to reveal the gap.
**How to avoid:** One `document.fonts.ready.then(() => ScrollTrigger.refresh())` call at the app root (not per-component); reserve aspect-ratio for any layout-affecting image (as `TeamStrip.tsx` already correctly does) rather than relying on a refresh-after-load pattern for images where avoidable.
**Warning signs:** Elements stuck at a from()-tween's starting opacity/position that never resolves even after scrolling well past where the animation should have completed; correlates with custom webfonts (`next/font`) and/or unsized images being present above/around the affected element.

### Pitfall 3: Gating hero carousel autoplay behind the same `gsap.matchMedia()` reduced-motion branch as scroll-reveal primitives
**What goes wrong:** Treating "skip the reveal transition" (appropriate for `Reveal`/`TextReveal`) and "stop content from moving on its own indefinitely" (the WCAG 2.2.2 concern for an autoplaying carousel) as the same reduced-motion response conflates two different accessibility requirements — a carousel that still auto-cycles (even instantly/without animation) under `prefers-reduced-motion: reduce` still fails the "don't auto-move content the user didn't ask to move" spirit of the criterion.
**Why it happens:** This codebase's existing reduced-motion contract (instant final state, still shown) is correct for one-shot reveals but not directly transferable to *looping* autoplay content.
**How to avoid:** `HeroCarousel` (and the testimonials carousel) needs its own `gsap.matchMedia()` branch that, under reduced motion, shows a single static slide (no looping) rather than an instant/undamped loop; provide an explicit pause control regardless of the media query (WCAG 2.2.2 is a Level A requirement independent of `prefers-reduced-motion`).
**Warning signs:** A carousel that still visibly cycles/auto-advances for `prefers-reduced-motion: reduce` users, even if individual transitions are instant rather than animated.

### Pitfall 4: Forgetting to remove the `/services` → `/#services` redirect when reinstating the dedicated route
**What goes wrong:** `next.config.ts` currently redirects `/services` to `/#services` (added in 02-06). If this redirect is left in place while Topic 4's dedicated route is rebuilt, the new `/services/page.tsx` becomes permanently unreachable — `redirects()` is evaluated before filesystem route resolution.
**Why it happens:** Easy to focus on rebuilding the route files and forget the config entry that made them unreachable in the first place was itself deliberate 02-06 work that now needs to be undone.
**How to avoid:** Explicit verification step: after reintroducing `/services`, confirm `next.config.ts`'s `redirects()` array no longer contains the `/services` → `/#services` entry (the `/about` → `/#about` entry should remain, since About stays homepage-only).
**Warning signs:** Visiting `/services` in the browser redirects to `/#services` instead of rendering the new dedicated page, despite the route files existing.

## Code Examples

See Topic 1 for the `onSplit()`-based `TextReveal` rebuild (verbatim-sourced from official GSAP SplitText docs) and the `document.fonts.ready` refresh pattern (community-consensus, cross-referenced against the official `ScrollTrigger.refresh()` API). See Topic 4 for the exact prior `/services` + `/services/[slug]` implementation (sourced directly from this project's own git history, commit `b23826b`).

## State of the Art

| Old Approach (first pivot / current buggy code) | Current Approach (second re-plan) | When Changed | Impact |
|---|---|---|---|
| `TextReveal` builds `gsap.from(split.words, ...)` immediately after `SplitText.create()` | Tween built and returned inside `onSplit()` callback | This research pass, 2026-09-10 (root-causing the 02-10 defect) | Fixes overlapping-text bug sitewide, for every current and future `TextReveal` usage, not just the hero |
| No `ScrollTrigger.refresh()` call anywhere in the app | One `document.fonts.ready.then(() => ScrollTrigger.refresh())` at the app root | Same | Fixes stuck-opacity bug sitewide, for every current and future `Reveal`/scroll-triggered element |
| `/services` and `/about` both redirect to homepage anchors (02-06) | `/services` reinstated as a real dedicated route; `/about` keeps its redirect | `02-CONTEXT.md`, second pivot, 2026-09-10 | Requires removing one `next.config.ts` redirect entry; the dropped `/services/[slug]/page.tsx` implementation is fully recoverable from git history |
| No stock photography anywhere (REQUIREMENTS.md exclusion) | Licensed/free stock photography permitted as a temporary, explicitly-flagged placeholder | `02-CONTEXT.md`, second pivot, 2026-09-10 | Requires `next.config.ts` `images.remotePatterns` config if hotlinking external URLs; self-hosting in `public/` avoids this and is recommended |

**Deprecated/outdated:** Nothing GSAP/Lenis/Next.js-version-related changed since the first-pivot research (one day prior) — the version-specific findings there (Next 15.5.25, GSAP `^3.15.0`, Lenis `^1.3.26`) remain current; this research only corrects a *usage* pattern within those same versions, not a version/API change.

## Open Questions

1. **GSAP-only vs. Embla for the testimonials carousel (Topic 3)**
   - What we know: both are valid; GSAP-only keeps the dependency count at zero and reuses the hero carousel's crossfade pattern; Embla is purpose-built for exactly this ("testimonial sliders" explicitly called out) and is small (~4-7KB) if drag/swipe becomes a hard requirement.
   - What's unclear: whether swipe/drag interaction (vs. simple autoplay + arrows/dots) is actually wanted for testimonials — `02-CONTEXT.md` leaves "autoplay, arrows/dots, swipe" as Claude's discretion.
   - Recommendation: default to GSAP-only (simplest, zero new dependency); revisit only if swipe/drag is specifically desired, in which case GSAP's own bundled `Draggable` plugin (not Embla) is still the zero-new-dependency option.

2. **Self-hosted vs. hotlinked stock photography**
   - What we know: self-hosting in `public/` avoids `remotePatterns` config, avoids third-party CDN dependency, and gets automatic width/height inference that helps prevent layout shift; hotlinking is faster to source/swap during the placeholder period.
   - What's unclear: how many images total, and how frequently they'll be swapped before real photography arrives — affects whether the self-hosting effort is worth it now.
   - Recommendation: self-host from the start (low effort, meaningfully de-risks the Topic 1 Root-Cause-B layout-shift problem for these specific images), but flag to the user that a later swap to real photography will simply replace the same files in `public/`, no config changes needed either way.

3. **Exact stock photography source/budget**
   - What we know: Unsplash (free, frictionless, generic) vs. Construction Photography / Stocksy (paid, more on-brand/editorial) are the realistic options.
   - What's unclear: whether the user has any budget appetite for paid stock during what's explicitly a temporary placeholder phase.
   - Recommendation: default to Unsplash (free) given the explicitly temporary nature of this photography; flag to the user as a specific approval point before sourcing, since it's a REQUIREMENTS.md exception being exercised.

## Sources

### Primary (HIGH confidence)
- [GSAP — SplitText official docs](https://gsap.com/docs/v3/Plugins/SplitText/) — fetched 2026-09-10; `autoSplit` re-split conditions (font-load OR width-change-with-lines), `onSplit()` callback contract, `mask` option behavior — all quoted verbatim above
- [GSAP — ScrollTrigger official docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — fetched 2026-09-10; automatic resize-driven recalculation, scroller default (viewport), React cleanup guidance
- [GSAP — ScrollTrigger.refresh() official docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/refresh()/) — fetched 2026-09-10; manual refresh triggers, `refresh(true)` safe-refresh option
- Project codebase, read directly 2026-09-10: `src/components/motion/TextReveal.tsx`, `src/components/motion/Reveal.tsx`, `src/components/motion/SmoothScrollProvider.tsx`, `src/lib/gsap.ts`, `src/app/layout.tsx`, `src/components/sections/{ServicesSection,AboutSection,TeamStrip,Hero,SiteNav}.tsx`, `src/content/services.ts`, `next.config.ts`, `src/app/(marketing)/layout.tsx`, `package.json` — establishes exact current (buggy) implementation this research fixes
- Git history: `git show b23826b` (commit `feat(02-03): add services index and dynamic [slug] detail template`) — exact recoverable prior `/services` + `/services/[slug]` implementation for Topic 4
- `.planning/phases/02-core-pages-home-services-and-about/02-CONTEXT.md` — authoritative second-pivot decisions constraining this research's scope
- 2026-09-09 first-pivot `02-RESEARCH.md` (prior version of this file, preserved in git history) — condensed-forward topics (anchor nav/scroll-spy, contact modal routing, `/work`→`/projects`, content condensation)

### Secondary (MEDIUM confidence)
- WebSearch: "GSAP ScrollTrigger.refresh() web font loading document.fonts.ready gotcha" — corroborates the `document.fonts.ready.then(ScrollTrigger.refresh)` community-consensus pattern (GSAP forum threads, cross-referenced against the official `refresh()` API's existence and purpose)
- WebSearch: "GSAP SplitText autoSplit onSplit callback rebuild animation resize" — corroborates and elaborates on the official docs' `onSplit` guidance with community explanation of the seamless-handoff (`totalTime()` preservation) mechanism
- WebSearch: "GSAP full viewport hero image carousel crossfade performance LCP best practice" — general Core Web Vitals/LCP guidance applied to hero imagery, cross-referenced against MDN's `LargestContentfulPaint` definition
- WebSearch: "prefers-reduced-motion autoplay carousel accessibility pause control WCAG" — WCAG 2.2.2 Level A pause/stop/hide requirement, cross-referenced across multiple accessibility-focused sources (WebAIM, dedicated WCAG explainer sites)
- WebSearch: "lightweight testimonials carousel GSAP no dependency vs Embla Swiper" — Embla's size/positioning as the lightweight, dependency-free, testimonial-slider-suited option, cross-referenced across multiple 2025/2026 carousel-library comparison sources
- WebSearch: "licensed stock photography UK architecture construction website sourcing" — Unsplash/Getty ownership and licensing terms, Construction Photography's UK-specific positioning, Stocksy's curated/cooperative model

### Tertiary (LOW confidence)
- None — every prescriptive claim above traces to official GSAP documentation (quoted verbatim), this project's own codebase/git history, or WebSearch findings cross-referenced against at least one other independent source

## Metadata

**Confidence breakdown:**
- ScrollTrigger/SplitText root cause & fix: HIGH — verified verbatim against official GSAP docs, applied directly to this project's actual buggy source code (not a hypothetical scenario)
- `/services` route reintroduction: HIGH — exact prior implementation recoverable from git history, no new API surface
- Hero/testimonials carousel implementation: MEDIUM — GSAP mechanics are HIGH confidence (standard opacity/transform tweening, already this codebase's established pattern); the Embla-vs-GSAP choice and exact LCP tuning are MEDIUM (cross-referenced WebSearch, no single canonical source for "GSAP hero carousel" specifically)
- Stock photography sourcing: MEDIUM — general licensing landscape well-corroborated, but explicitly practical/non-legal guidance, and inherently a temporary/exception measure requiring the user's explicit sign-off (flagged in Open Questions)
- Nav button + decorative dividers: HIGH — both directly extend existing, already-working in-codebase patterns (`Button as={Link}`, `BlueprintAccent.tsx`)

**Research date:** 2026-09-10
**Valid until:** ~2026-10-10 (30 days) for the Next.js/GSAP mechanics (stable); re-verify the GSAP SplitText/ScrollTrigger findings only if `gsap` is upgraded past `^3.15.0` before implementation. The stock-photography/carousel-library recommendations are lower-durability opinions (re-check if this research is reused more than ~2 weeks out, given how fast the JS carousel-library landscape and stock-photo licensing terms can shift).

---
*Phase research for: Phase 2 — Core Pages (Home, Services & About), second re-plan (Storey template replication + animation defect root-cause), Stoneage Properties*
*Researched: 2026-09-10*
*Supersedes: 02-RESEARCH.md dated 2026-09-09 (first pivot, single-page architecture research) — first-pivot findings condensed forward above, not deleted*
