# Pitfalls Research

**Domain:** Awwwards-quality, heavily-animated Next.js marketing site for a real UK small-business building contractor (lead-gen, not a design showcase)
**Researched:** 2026-09-08
**Confidence:** MEDIUM-HIGH (GSAP/Lenis/Next.js technical claims verified against official docs/GitHub; local-SEO and small-business-conversion claims are MEDIUM confidence, cross-referenced across multiple industry sources but not a single authoritative source)

## Critical Pitfalls

### Pitfall 1: Hero imagery/video tanks LCP because it's treated as decoration, not the LCP element

**What goes wrong:**
The hero — almost always the largest, most visually dominant element on an Awwwards-style homepage — is implemented as a CSS `background-image`, an unoptimized full-res JPEG/PNG, a lazy-loaded `next/image`, or an autoplay video poster frame. Lighthouse/CrUX then reports poor LCP (>2.5s), which on a real business site directly hurts Google rankings and conversion (bounce before the page even paints).

**Why it happens:**
Design-led builds start from Figma/video assets and get implemented visually-first; nobody explicitly checks "what element does Chrome DevTools/PageSpeed identify as the LCP node" until late. `next/image` without `priority`/`fetchPriority="high"` still lazy-loads by default, and CSS background images are invisible to `next/image`'s optimization pipeline entirely (no responsive `sizes`, no AVIF/WebP, no priority hints).

**How to avoid:**
- The hero visual must be a real `<img>` via `next/image` with `priority` (or `fetchPriority="high"`) and a correct `sizes` attribute — never a CSS background-image for the primary hero.
- Serve AVIF/WebP with responsive srcset; target a compressed hero under ~150-250KB at delivered resolution.
- If hero is video: use a poster image as the actual LCP-visible element, defer video `<source>` loading, mute+autoplay only after first paint, and never let the video itself block LCP.
- Explicitly identify and test the LCP element in DevTools Performance panel / PageSpeed Insights for every major page template before calling it done.

**Warning signs:**
Lighthouse LCP > 2.5s on mobile throttled test; PageSpeed reports the LCP element as an `<img>` with `loading=lazy` or a `background-image`; hero assets >500KB in Network tab.

**Phase to address:**
Foundational build phase (design system / homepage hero implementation) — must be verified before motion/animation layer is added, since animation makes diagnosing LCP regressions harder later.

---

### Pitfall 2: GSAP entrance/reveal animations cause layout shift (CLS) and delay perceived readiness

**What goes wrong:**
Elements animate in via changes to `height`, `top`, `margin`, `width`, or by being inserted/removed from flow (e.g., `SplitText` re-wrapping text, images animating from `display:none`), triggering layout recalculation and visible jank. Cumulative Layout Shift score suffers, and on slower devices the animation stutters instead of feeling premium — the opposite of the "Awwwards feel" being targeted.

**Why it happens:**
It's natural to animate the properties that are easiest to reason about (position/size) rather than the GPU-cheap ones (`transform`, `opacity`). Text-split animations in particular re-flow the DOM before the animation library measures positions.

**How to avoid:**
- Animate only `transform` and `opacity` (GSAP's `x`/`y`/`scale`/`autoAlpha`) — never animate `top`/`left`/`width`/`height`/`margin` for scroll or entrance effects.
- Reserve final layout space up front (e.g., set container height before text-split animates in) so the pre-animation and post-animation layout are identical — nothing should "pop" into a new position.
- Use `will-change: transform` sparingly (only on actively-animating elements, removed after) to avoid excessive compositing layers.

**Warning signs:**
CLS > 0.1 in Lighthouse; visible "jump" when scrolling past animated sections in a throttled CPU test (Chrome DevTools 4x-6x slowdown).

**Phase to address:**
Animation/motion implementation phase — bake this into the animation coding standard from the first ScrollTrigger built, not retrofitted.

---

### Pitfall 3: GSAP + Lenis break keyboard navigation, screen readers, and reduced-motion — silently

**What goes wrong:**
Custom smooth-scroll (Lenis), scroll-jacked sections, horizontal-scroll galleries, and text-split reveals commonly ship without keyboard focus support, without respecting `prefers-reduced-motion`, and without accessible text alternatives. GSAP's `SplitText` plugin, by default, adds `aria-hidden` to the individual split character/word `<div>`s and an `aria-label` on the parent — but this pattern has been shown (Adrian Roselli's cross-browser/screen-reader testing) to only work correctly in 2 of 8 real screen reader/browser combinations. Horizontal-scroll sections frequently aren't keyboard-focusable at all (no `tabindex`, no arrow-key support), functionally locking keyboard-only users out of content.

**Why it happens:**
Motion is built and tested visually, with a mouse, on modern Chrome. Nobody tests with keyboard-only navigation, VoiceOver/NVDA, or OS-level "reduce motion" turned on until (if ever) an accessibility audit happens — usually never, on a small local-business budget.

**How to avoid:**
- Wrap all GSAP scroll/entrance animations in a `prefers-reduced-motion` check (via `matchMedia` + GSAP's `gsap.matchMedia()`) that either disables animation entirely or reduces it to simple opacity fades with no motion/parallax.
- Lenis already respects `prefers-reduced-motion` by default (forces 1:1 scroll tracking, instant `scrollTo`) — do not override or disable this default behavior.
- Any horizontal-scroll section must be keyboard-focusable (`tabindex="0"`), support arrow key / Page Up-Down scrolling, and carry a descriptive `role`/`aria-label` explaining what it is.
- Do not rely solely on GSAP `SplitText`'s default `aria-hidden`/`aria-label` behavior for body copy or important content — test with an actual screen reader (VoiceOver on Mac is free) before shipping any text-split animation on content that matters (headings, CTAs, service descriptions). Consider limiting SplitText to short, purely decorative headline text rather than paragraph content.
- Never fully scroll-jack (hijack the scrollbar so native scroll no longer works) — Awwwards sites like Storey Architecture and Kononenko still let native/keyboard scroll function underneath the smoothing layer; smoothing is an enhancement, not a replacement for standard scroll behavior.

**Warning signs:**
Tab key can't reach content inside horizontal-scroll or pinned sections; turning on macOS/Windows "reduce motion" has no visible effect on the site; VoiceOver reads gibberish (single characters) over animated headlines; Lighthouse Accessibility score below ~90.

**Phase to address:**
Animation/motion implementation phase, with an explicit accessibility pass phase before launch (manual keyboard-only + screen-reader smoke test on every animated template).

---

### Pitfall 4: GSAP ScrollTrigger instances leak and multiply across Next.js App Router navigations

**What goes wrong:**
ScrollTriggers created in one page/route aren't cleaned up when the user navigates client-side to another route. Over a session, ScrollTrigger instances accumulate, causing degraded scroll performance, duplicate/conflicting animations, animations firing on the wrong elements, or animations referencing DOM nodes that no longer exist (throwing errors or silently doing nothing).

**Why it happens:**
GSAP animations are commonly wired up with a plain `useEffect` and manual `ScrollTrigger.create()` calls without matching cleanup, or cleanup that misses `ScrollTrigger.getAll().forEach(t => t.kill())` scoped correctly. In App Router, layouts persist across route changes (unlike a full page reload), so anything not explicitly torn down survives.

**How to avoid:**
- Use `@gsap/react`'s `useGSAP()` hook instead of raw `useEffect` — it wraps animations in `gsap.context()` and automatically calls `.revert()` on unmount, killing all tweens, timelines, ScrollTriggers, and Draggables scoped to that component.
- Scope every `useGSAP` call to a `ref` (container scoping) so cleanup only affects that component's animations, not siblings.
- Centralize GSAP plugin registration (`gsap.registerPlugin(ScrollTrigger, SplitText, ...)`) in one client-only module to avoid duplicate registration across routes.
- After any route transition, call `ScrollTrigger.refresh()` (or refresh on `next/navigation` route-change events) so trigger positions recalculate against the new DOM layout.

**Warning signs:**
Scroll performance degrades the longer a session lasts (more time on site = jankier scroll); animations that fire on elements from a previous page; React StrictMode dev warnings about effects running twice; `ScrollTrigger.getAll().length` growing unexpectedly across navigations (checkable in console during dev).

**Phase to address:**
Animation architecture / technical foundation phase — establish the `useGSAP` + context pattern as the standard before building individual page animations, since retrofitting cleanup across many components is expensive.

---

### Pitfall 5: Client-heavy animation architecture tanks SEO/indexability for a local-search-dependent business

**What goes wrong:**
Content critical for ranking (service descriptions, project history, location/service-area copy) gets rendered only after JS execution and animation libraries load, or gets hidden behind interaction (accordions/reveals that never populate the DOM until scrolled/clicked). Google can generally render client-rendered content, but indexing is delayed and less reliable than SSR/SSG, and other systems (AI Overviews, some crawlers, link previews) may not execute JS at all. For a local contractor competing on "builder near me" style search, this directly costs qualified leads.

**Why it happens:**
Heavy animation libraries and "reveal on scroll" patterns encourage building pages as client components with content that only becomes visible/present through JS-driven interaction, and teams default entire pages to `"use client"` because that's where the animation hooks live — dragging static content into client-rendered territory unnecessarily.

**How to avoid:**
- Keep this a Next.js App Router project using SSR/SSG (static generation for marketing/service pages) as the default; animation is a progressive-enhancement layer on top of server-rendered content, not a replacement for it.
- Content (headings, service copy, project descriptions, address/contact info) must exist in the initial server-rendered HTML — animate its *presentation* (opacity/transform reveal) rather than its *existence* in the DOM. Never mount content only inside a `useEffect` after client hydration.
- Isolate GSAP/Lenis/ScrollTrigger logic into small client components (`"use client"` at the leaf, not the page/layout level) so page-level metadata, structured data, and static content generation aren't dragged into client-only rendering.
- Implement `generateMetadata` per page (title, description, OpenGraph) and JSON-LD `LocalBusiness`/`GeneralContractor` structured data (name, address, phone, geo, service area, opening hours, sameAs links) server-side, validated with Google's Rich Results Test. Complete, error-free LocalBusiness schema correlates with meaningfully better local pack / rich result visibility.
- Ensure Core Web Vitals (Pitfalls 1 & 2) stay healthy — Google's ranking systems factor page experience, so animation-driven CWV regressions compound the SEO risk beyond just crawlability.

**Warning signs:**
"View Source" / disabling JS shows missing service/contact content; Google Search Console reports pages "Crawled - currently not indexed" or excludes key pages; Rich Results Test shows no LocalBusiness markup or validation errors; large gap between what's visually on the page and what's in the initial HTML payload.

**Phase to address:**
Information architecture / content-model phase (decide what's server-rendered vs. client-enhanced) and a dedicated SEO/structured-data phase before launch, with CWV/indexability checks in the QA phase.

---

### Pitfall 6: Aesthetic-first design buries the "quick, professional, easy to contact" signals a local trade business depends on

**What goes wrong:**
In pursuit of the minimal/monochrome/full-bleed-imagery Awwwards aesthetic, phone number, contact form, service area, and clear "get a quote" CTAs get pushed below intro animations, hidden in a hamburger-only nav, or styled so subtly (thin type, low contrast, no visible button) that they don't register as clickable. For a 30-year-established contractor whose real advantage is trust and responsiveness, this actively undermines the site's business purpose even if it wins design points.

**Why it happens:**
Awwwards reference sites (Storey Architecture, Kononenko) are architecture/portfolio studios where the "conversion" is an inquiry from an already-motivated visitor who tolerates friction to see the work — not a homeowner comparison-shopping several local builders who will bounce to a competitor within seconds if contact isn't obvious. Copying the aesthetic without adjusting for a different user intent transfers the wrong lessons.

**How to avoid:**
- Persistent, high-contrast phone number and a clear primary CTA ("Get a Quote" / "Call Now") in the header/nav on every page and every viewport, not just the footer.
- Trust signals (years in business, certifications, testimonials, completed-project count) should be visible near the top of key pages, not only buried on an About page — small-business visitors decide credibility fast.
- Contact/quote form should be short (name, phone, brief project description) — do not let form complexity or a multi-step "experience" become another design flourish that reduces completion.
- Treat the intro/hero animation as a few seconds of delight, not a gate — never require the user to wait out a full animation sequence before primary nav/CTA is interactive.
- Run this past someone unfamiliar with the design decisions: can they find the phone number and "request a quote" in under 5 seconds on both desktop and mobile?

**Warning signs:**
Phone number/CTA only exists in the footer or behind a menu tap; user testing shows people scrolling past the hero looking for "how do I contact them"; stakeholder/client feedback that the site "looks amazing but I can't find where to get a quote."

**Phase to address:**
UX/wireframe phase (before high-fidelity design) — CTA and contact placement should be locked as a non-negotiable pattern before animation/visual polish begins, and re-verified in final QA.

---

### Pitfall 7: Mobile experience is an afterthought because Awwwards references are demoed/awarded on desktop

**What goes wrong:**
Awwwards showcases and jury voting are heavily desktop/large-viewport-biased (large parallax hero sections, horizontal scroll, big pinned-scroll sequences, cursor-follow effects) — but most local-business lead-gen traffic, especially for a builder ("get a quote," searched on the go), is mobile. Pinned/scroll-jacked sections, custom cursors, and large parallax layers often perform poorly or make no sense on touch devices, and heavy JS bundles disproportionately hurt mobile CWV (slower CPUs/networks).

**Why it happens:**
Design references and mockups are built and reviewed on desktop monitors first; mobile is treated as "the same thing, responsive" rather than a distinct interaction model, and complex scroll-driven effects are the hardest thing to adapt down (they often get simply disabled or left broken/janky on mobile).

**How to avoid:**
- Design and prototype mobile-first (or at minimum, mobile-parallel) for every animated section — decide explicitly what happens to pinned/horizontal/parallax effects on touch: simplified, replaced with a simpler transition, or removed.
- Custom cursor effects should be desktop-only (feature-detect pointer type via `matchMedia('(pointer: fine)')`) — never attempt on touch.
- Test real performance on a mid-range Android device (not just desktop DevTools throttling) since GSAP-heavy sites are disproportionately CPU-bound on lower-end mobile hardware.
- Verify Core Web Vitals specifically on mobile (Google's field data / CrUX is mobile-weighted for most local business search).

**Warning signs:**
Design reviews only happen on a MacBook/desktop monitor; mobile mockups are an "also responsive" checkbox rather than dedicated screens; PageSpeed mobile score significantly worse than desktop; scroll-pin sections feel broken or jump oddly on an actual phone.

**Phase to address:**
Design/UX phase (mobile treatment decided alongside desktop concept, not after) and animation implementation phase (device/pointer-type branching built in from the start).

---

### Pitfall 8: The finished site is effectively un-editable by the client, so it rots

**What goes wrong:**
Bespoke, animation-driven layouts (custom GSAP timelines keyed to specific DOM structure/content length, hand-placed pinned sections) make it impractical for the non-technical client to update project photos, add a new completed job, or change copy without breaking layout or animation timing. Content goes stale, which undermines both SEO (fresh content signals) and the "active, real business" trust signal.

**Why it happens:**
Animation-first builds often hardcode content directly into components/timelines for precision (exact pixel/scroll-distance tuning) rather than pulling from a content source, because it's faster to build that way and nobody explicitly plans for "who updates the projects page in 6 months."

**How to avoid:**
- Decide the content-management approach early (even a lightweight one — e.g., MDX/JSON content files the developer updates periodically, or a headless CMS/Sanity/Contentful if the client truly needs self-service) rather than defaulting to fully hardcoded JSX.
- Build animations to be length/content-agnostic where feasible (e.g., ScrollTrigger driven by element count/`end: () => "+=" + el.scrollHeight` rather than magic pixel numbers) so adding a new project or paragraph doesn't require re-tuning animation code.
- Clarify with the client up front whether they expect to self-edit content post-launch or whether updates go through the developer — this changes the architecture decision materially.

**Warning signs:**
No answer exists to "how does the client add a new completed project six months from now"; animation timings reference hardcoded pixel values tied to today's content length; project/portfolio data lives inline in JSX rather than a data file/CMS.

**Phase to address:**
Content architecture phase (early, alongside information architecture) — this is a foundational decision, expensive to retrofit after animations are built against hardcoded content.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Hardcoding GSAP `useEffect` cleanup instead of `useGSAP()` | Slightly less new-dependency overhead | Memory leaks across route navigations, hard-to-debug duplicate animations | Never — `@gsap/react` is free and purpose-built; use it from day one |
| CSS background-image for hero instead of `next/image` | Easier to layer text/overlay via CSS | Breaks LCP optimization entirely (no priority hint, no responsive sizes, no format negotiation) | Never for the actual LCP element; acceptable only for genuinely decorative, below-fold background textures |
| Skipping `prefers-reduced-motion` handling for MVP | Faster initial animation build | Accessibility/legal exposure, real user complaints, retrofits require touching every animation | Never on a client-facing production site — bake in from the first animation |
| Hardcoding project/portfolio content in JSX | Fast to build, precise animation tuning | Client cannot self-update; developer becomes a bottleneck for every content change | Acceptable only if explicitly agreed the developer handles all future content updates |
| Full page as `"use client"` because "the animations need it" | Simpler mental model, less prop-drilling | Drags static content out of SSR, hurts SEO/indexability and initial payload | Never — scope client components to the smallest animated leaf |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|-------------------|
| GSAP + Next.js App Router | Registering plugins (`ScrollTrigger`, `SplitText`) in a module that's imported by both server and client code, or re-registering per component | Register plugins once in a small client-only module (`"use client"`), imported wherever needed; guard with `typeof window !== 'undefined'` if needed |
| Lenis + GSAP ScrollTrigger | Not connecting Lenis's `scroll` event to `ScrollTrigger.update()`, causing ScrollTrigger to use native scroll position while Lenis smooths visually — triggers fire at the wrong point | Wire Lenis's `raf`/`scroll` callback to call `ScrollTrigger.update()`, and set `ScrollTrigger.defaults({ scroller: ... })` or use GSAP's recommended Lenis integration pattern from official docs |
| next/font + GSAP text-split animations | Splitting text before web fonts finish loading, causing re-measurement/layout shift once the font swaps in | Split text after `document.fonts.ready`, or use `next/font`'s built-in font-loading strategy to avoid FOUT-driven re-splits |
| Google Rich Results / LocalBusiness schema | Publishing JSON-LD with mismatched NAP (name/address/phone) vs. Google Business Profile, or incomplete required properties | Keep JSON-LD NAP identical to Google Business Profile; validate every page template with Rich Results Test before launch |
| Vercel/hosting + large video/image assets | Serving full-resolution source video/images directly instead of through an optimization pipeline (Next Image, or a video CDN) | Use `next/image` for all imagery; for video, use a proper video host/CDN with adaptive bitrate or at minimum pre-compressed, multiple-format sources with poster images |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Every scroll section registers its own `ScrollTrigger` with no `ScrollTrigger.refresh()` batching | Scroll stutters/jank as the number of animated sections grows | Batch refreshes, avoid redundant triggers, use `ScrollTrigger.batch()` for repeated similar elements (e.g., project grid cards) | Noticeable once a page has roughly 10+ independent triggers, common on a long single-page-feeling homepage |
| Unoptimized/uncompressed video backgrounds | Huge initial payload, slow mobile LCP/INP, high data usage for mobile visitors | Compress aggressively, use poster-first loading, consider disabling autoplay video on mobile/reduced-data connections (`navigator.connection.saveData`) | Breaks immediately on 3G/4G or metered connections; disproportionately hurts mobile CWV scores used in local search ranking |
| Loading full GSAP bundle (all plugins) on every route | Larger JS bundle than needed on pages without heavy animation | Import only needed plugins per route/component; rely on Next.js code-splitting via dynamic `import()` for animation-heavy client components not needed above the fold | Noticeable in bundle-analyzer once GSAP + SplitText + ScrollTrigger + Lenis are all globally imported |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Contact/quote form with no server-side validation or spam protection | Spam leads flood the client's inbox, wasting the business owner's time (a real trust/operational cost, not just a security abstraction) | Server-side validation on form submission, honeypot field or a lightweight CAPTCHA/Turnstile, rate limiting on the submission endpoint |
| Exposing form-handling API keys (email service, CRM) in client-side code | Credential leakage, potential abuse of the client's email/SMS sending service | Route form submissions through a Next.js Route Handler/Server Action; keep third-party API keys server-side only |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Forcing users to watch a full intro animation before interacting | Frustrates repeat visitors and mobile users on slower connections; feels like an obstacle, not delight | Keep intro sequences under ~1-2s, make them skippable/interruptible, and never block nav/CTA interactivity behind them |
| Scroll-jacking that overrides native scroll speed/direction entirely | Disorients users, especially those using trackpads, and breaks expected browser behavior (including back/forward scroll restoration) | Use smoothing (Lenis) as an enhancement over native scroll, not a full replacement; always keep native scroll functional as fallback |
| Custom cursor replacing the native cursor with no fallback | Confusing or invisible on touch devices, trackpad-only laptops, or accessibility tools that rely on the OS cursor | Feature-detect fine-pointer devices only; always keep a visible native cursor as the baseline, custom cursor as pure enhancement |
| Text/content only becoming legible after a reveal animation completes (e.g., blur-to-focus, opacity 0 to 1 gated by scroll trigger not yet fired) | Content is invisible if JS fails to load/execute, or if the user scrolls faster than the animation settles | Ensure a no-JS/JS-failure fallback state where content is fully visible; treat animation state as progressive enhancement layered on visible content, not a gate to visibility |

## "Looks Done But Isn't" Checklist

- [ ] **Hero LCP:** Often still slow because the wrong DOM element is the actual LCP node — verify with PageSpeed Insights/Lighthouse on mobile, not just "it looks fast on my machine."
- [ ] **Reduced motion:** Often only tested by eyeballing the animation, not by actually toggling OS-level "reduce motion" and confirming the site responds.
- [ ] **Keyboard navigation:** Often never tested at all — verify Tab can reach every interactive element including inside horizontal-scroll/pinned sections, in the order a sighted mouse user would expect.
- [ ] **LocalBusiness structured data:** Often added once on the homepage and forgotten — verify it's present and validates (Rich Results Test) with NAP matching Google Business Profile exactly, and consider whether service/location pages need their own markup.
- [ ] **Content editability:** Often assumed "fine" because the developer can update it — explicitly confirm with the client whether they expect self-service edits, and verify the actual mechanism (CMS, data file, or dev-mediated) works end to end.
- [ ] **Mobile animation behavior:** Often "works" only because it silently does nothing/breaks gracefully on mobile — explicitly verify what each scroll effect does on a real phone, not just that it doesn't crash.
- [ ] **ScrollTrigger cleanup:** Often looks fine in a quick demo but leaks over a longer session — verify via repeated client-side navigation across all major routes, checking `ScrollTrigger.getAll().length` doesn't grow unbounded.
- [ ] **Contact/quote path:** Often "exists" but is buried — verify phone number and quote CTA are reachable in under 5 seconds from any page, on both mobile and desktop, without waiting for animation.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|-----------------|
| Poor LCP from unoptimized hero | LOW | Swap background-image for `next/image` with `priority`, compress/convert to AVIF/WebP, add correct `sizes` — typically a same-day fix once identified |
| Accessibility gaps (keyboard/reduced-motion) discovered late | MEDIUM | Requires touching every animated component to add `matchMedia` reduced-motion branching and keyboard focus handling; more expensive the more components exist, but not architectural |
| SEO content trapped in client-only rendering | MEDIUM-HIGH | Requires restructuring which components are server vs. client, potentially re-templating page structure; easier if content model (Pitfall 8 fix) was done separately from presentation |
| ScrollTrigger memory leaks from ad-hoc `useEffect` usage | MEDIUM | Migrate each animated component to `useGSAP()` incrementally; mechanical but touches every animation component |
| Content hardcoded in JSX, client can't self-edit | HIGH | Requires retrofitting a content source (CMS or data files) and refactoring components to consume it instead of inline JSX — significant if done after launch with real content already live |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Hero image/video tanks LCP | Foundational build / homepage hero implementation | Lighthouse mobile LCP < 2.5s; confirm LCP element is the intended `<img>` via `next/image priority` |
| Animation-driven layout shift (CLS) | Animation implementation phase | Lighthouse CLS < 0.1; visual spot-check under CPU throttling |
| Accessibility breaks (keyboard, screen reader, reduced-motion) | Animation implementation phase + dedicated pre-launch a11y pass | Manual keyboard-only pass; VoiceOver/NVDA pass on key animated templates; OS reduce-motion toggle test |
| ScrollTrigger memory leaks across App Router navigation | Animation architecture / technical foundation phase | Repeated client-side navigation session; confirm `ScrollTrigger.getAll()` count stays bounded |
| SEO/indexability compromised by client-heavy rendering | Information architecture phase + dedicated SEO/structured-data phase | View-source/JS-disabled content check; Search Console indexing status; Rich Results Test pass for LocalBusiness schema |
| CTAs/contact info buried under design | UX/wireframe phase, re-verified in final QA | 5-second "find the phone number/quote CTA" test on desktop and mobile |
| Mobile experience under-designed relative to desktop | Design/UX phase + animation implementation phase | Real mid-range Android device test; mobile-specific PageSpeed score; explicit design review of mobile treatment for every animated section |
| Client cannot self-edit content | Content architecture phase (early, with IA) | Confirm content source (CMS/data file) and walk through an actual "add a new project" update end to end before launch |

## Sources

- [Optimizing GSAP Animations in Next.js 15: Best Practices for Initialization and Cleanup — Medium](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232) — MEDIUM confidence, corroborated by GSAP official forum guidance on `useGSAP`
- [Using ScrollTriggers in Next.js with useGSAP() — GSAP official forum](https://gsap.com/community/forums/topic/40128-using-scrolltriggers-in-nextjs-with-usegsap/) — HIGH confidence (official GSAP source)
- [SplitText — GSAP official docs](https://gsap.com/docs/v3/Plugins/SplitText/) — HIGH confidence (official docs, describes default aria-hidden/aria-label behavior)
- [Screen Readers do not expose SplitText — GitHub greensock/GSAP Issue #642](https://github.com/greensock/GSAP/issues/642) — HIGH confidence (primary source issue tracker)
- [GSAP SplitText Accessibility Problems: Screen Reader Barriers — accessibility.chat](https://www.accessibility.chat/articles/when-animation-frameworks-break-reading-the-gsap-splittext-problem) — MEDIUM confidence, references Adrian Roselli's cross-browser/screen-reader testing (2 of 8 combinations worked)
- [Lenis — GitHub darkroomengineering/lenis README](https://github.com/darkroomengineering/lenis) — HIGH confidence (official source; documents default `prefers-reduced-motion` handling and keyboard support)
- [Keyboard-Only Scrolling Areas — Adrian Roselli](http://adrianroselli.com/2022/06/keyboard-only-scrolling-areas.html) — HIGH confidence (recognized accessibility authority on this exact problem)
- [Consider accessibility when using horizontally scrollable regions — Bogdan/cerovac.com](https://cerovac.com/a11y/2024/02/consider-accessibility-when-using-horizontally-scrollable-regions-in-webpages-and-apps/) — MEDIUM confidence
- [Next.js Image component — official docs](https://nextjs.org/docs/app/api-reference/components/image) — HIGH confidence (official docs)
- [Most LCP Fixes Come Down to One Image — DEV Community](https://dev.to/nosyos/most-lcp-fixes-come-down-to-one-image-2i09) — MEDIUM confidence, consistent with official Next.js image guidance
- [2025 Web Almanac Core Web Vitals findings, summarized via corewebvitals.io and w3era](https://www.corewebvitals.io/core-web-vitals) — MEDIUM confidence, aggregated industry data
- [Local Business Schema: How Structured Data Boosts Local SEO, Conversions, and Google Visibility](https://redarrowmarketing.com/2025/12/02/local-business-schema-how-structured-data-boosts-local-seo-conversions-and-google-visibility/) — MEDIUM confidence, industry source citing click/visibility lift figures (not independently verified against a primary Google source)
- [Contact Page Design Best Practices for Small Businesses — Flamingo Agency](https://www.flamingoagency.com/blog/contact-page-design/) — MEDIUM/LOW confidence, general industry best-practice consensus rather than primary research
- Multiple small-business web-design-mistake roundups (Levitate, CFGroove, The Hangline, Bracha Designs) — LOW-MEDIUM confidence individually, treated as corroborating pattern (contact-info findability, weak CTAs, misplaced trust signals recur across all of them) rather than a single authoritative claim

---
*Pitfalls research for: Awwwards-quality animated Next.js marketing site for a UK small-business building contractor*
*Researched: 2026-09-08*
