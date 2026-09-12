# Stack Research

**Domain:** Awwwards-tier Next.js marketing/portfolio site (UK construction contractor), v1 of a 3-milestone product (v2 AI lead-gen, v3 CRM)
**Researched:** 2026-09-08
**Confidence:** HIGH (versions verified via npm registry live lookups + official docs/blog cross-checks); MEDIUM on "what Awwwards sites actually use" (WebSearch-sourced, cross-verified across multiple case studies but not a formal survey)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | **15.5.x (LTS)** — see note below on 15 vs 16 | React meta-framework, App Router, image/font optimization, routing | Current stable line is 16.3.x (Turbopack-by-default, React 19.2 canary features like native `<ViewTransition>`), but 16 is young (GA'd 2026) and its App Router runs on a **React canary**, not React stable. Next.js 15.5.x is the **Maintenance/Active LTS** track on **React 19 stable**, has the App Router conventions this project needs (Server Components, streaming, `generateMetadata`, parallel/intercepting routes for gallery modals), and avoids being an early adopter of a canary React on a client-facing, must-not-break marketing site. Verified via npm dist-tags: `latest=16.3.4`, `backport=15.5.25`. |
| React | 19.x | UI library | Required by Next 15/16. React 19's `useOptimistic`/`use`/Actions aren't critical for a static-ish marketing site, but React 19 is the baseline Next.js 15+ requires — not a separate decision. |
| TypeScript | 5.7+ | Type safety | Standard for any serious Next.js project in 2025/2026; catches CMS schema drift early, which matters once Sanity/Payload types are generated. |
| Tailwind CSS | **4.x** (npm latest `4.3.3`) | Utility CSS, design tokens | v4's CSS-first config (`@theme` in CSS, no `tailwind.config.js` required) and the new Oxide engine (Rust, much faster builds) is now the default for new projects. Ideal for enforcing a strict monochrome/neutral design system (define palette + type scale once in `@theme`, use everywhere) — exactly the constraint an editorial, minimal Awwwards-style site needs. |
| GSAP (GreenSock) | **3.15.x** + `ScrollTrigger` | Scroll-driven animation, pinning, parallax, timeline choreography | As of April 2025, Webflow (which acquired GreenSock in late 2024) made **all** of GSAP free, including previously paid Club GreenSock plugins (ScrollTrigger, SplitText, ScrollSmoother, MorphSVG, DrawSVG). This removed the only real barrier to using GSAP commercially. GSAP + ScrollTrigger remains the dominant choice for Awwwards-tier scroll storytelling (pinned sections, scrub-linked reveals, staged text/image entrances) — confirmed across multiple recent Awwwards Site-of-the-Day case studies (e.g., "By-Kin," built on Next.js + GSAP). |
| Lenis | **1.3.x** (renamed from `@studio-freight/lenis` to `lenis` on npm) | Smooth/inertia scroll | The de-facto standard smooth-scroll layer for GSAP-driven sites by Darkroom Engineering. Mounted once in the root layout, synced to GSAP's ticker (`gsap.ticker.add`) and to `ScrollTrigger.update`, so native scroll position, ScrollTrigger triggers, and Lenis's virtual scroll stay in lockstep. This is the standard "three-piece" combo (Next.js + GSAP/ScrollTrigger + Lenis) seen repeatedly in current Awwwards-caliber builds. |
| Motion (formerly Framer Motion) | **12.x** (npm registry shows `motion@13.x` is now current — reverify at implementation time) | Component-level UI micro-interactions: hover states, layout animations, exit animations on route/modal changes, `AnimatePresence` | Framer Motion was renamed **Motion** in 2025 and now lives at `motion` on npm (import from `motion/react`); `framer-motion` still exists as a deprecated alias that re-exports the same code. Use Motion for **component-scoped** interaction (buttons, cards, modals, filter transitions in the project gallery) — it's declarative, React-idiomatic, and handles exit animations (`AnimatePresence`) that GSAP does more awkwardly in React. GSAP owns **scroll/timeline choreography**; Motion owns **UI state transitions**. Don't use both for the same animation. |

**Note on Next.js 15 vs 16:** If the roadmap timeline pushes implementation start out several weeks and Next 16 has had time to stabilize further (React canary → stable, Turbopack build fully proven under real client load), re-verify and prefer 16 at that point — Turbopack-by-default is a meaningful DX/build-speed win. Pin whichever is chosen; do not float on `latest` for a client-facing site.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@sanity/client` + `next-sanity` | Sanity Studio (embedded) `latest` (client `8.6.x`) | Headless CMS for case studies, services, team, testimonials | **Primary CMS recommendation** — see CMS decision below for full rationale vs. Payload. |
| `sharp` | 0.35.x | Image processing (used internally by `next/image` for local optimization) | Required as a dependency for `next/image`'s built-in optimizer when self-hosting or building; auto-installed, just pin/verify version if deploying outside Vercel. |
| `next/font` (built into Next.js) | n/a (core) | Self-hosted, zero-layout-shift web font loading | Use for all typography — see Fonts section below. Do not use Google Fonts `<link>` tags or `@import` in CSS. |
| `clsx` | 2.1.x | Conditional className composition | Pairs with Tailwind for variant-driven components (nav states, active filters in gallery). |
| `tailwind-merge` | 3.6.x | Resolve conflicting Tailwind classes in composable components | Use inside a small `cn()` helper (`clsx` + `tailwind-merge`) for any component accepting a `className` override prop. |
| `next-cloudinary` (optional) | latest | Cloudinary transformation/upload components for Next.js, if using Cloudinary instead of/alongside `next/image` | Only add if the client will be uploading large volumes of high-res photography/video directly and needs on-the-fly art-directed cropping (focal point, aspect-ratio variants per breakpoint) beyond what `next/image` + Sanity's image pipeline provides. For a portfolio of curated project photography (dozens, not thousands, of images), this is likely **unnecessary complexity** for v1 — see "What NOT to Use." |
| `three` / `@react-three/fiber` / `@react-three/drei` | `three@0.185.x`, `@react-three/fiber@9.x`, `@react-three/drei@10.x` | WebGL/3D | **Only if** the design calls for a WebGL hero (e.g., a 3D model of a building, particle field, or shader-driven image distortion, as seen on the referenced Storey Architecture / Kononenko Architectural Bureau sites). Do not add this dependency speculatively — it's the single biggest bundle-size and complexity cost in this stack. Confirm with design direction before committing. |
| `next-view-transitions` | 0.3.x | Thin wrapper around the browser View Transitions API for Next.js App Router | **Optional, not recommended as primary mechanism** — see rationale below. Could be used for very simple same-DOM crossfades, but GSAP-driven page transitions give more control for an Awwwards-tier feel. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint (Next.js config) + Prettier | Lint/format | Use `eslint-config-next` shipped with Next.js; add Tailwind class-sorting via `prettier-plugin-tailwindcss`. |
| GSAP DevTools / `ScrollTrigger.markers` | Debug scroll triggers during development | Free now (see GSAP licensing note); strip markers before production build. |
| Vercel Preview Deployments | Client review workflow | Every PR gets a shareable URL — valuable for a client (Stoneage) reviewing motion/design iterations before sign-off. |
| Lighthouse / PageSpeed Insights + WebPageTest | Performance auditing | Heavy-motion, image-led Awwwards sites live or die on perceived performance (LCP, CLS, INP). Budget explicit performance-testing time per phase, not just at the end. |

## Installation

```bash
# Core framework
npx create-next-app@15 stoneage-site --typescript --tailwind --app --src-dir --import-alias "@/*"

# Animation stack
npm install gsap lenis motion

# CMS (Sanity path)
npm install sanity next-sanity @sanity/image-url @sanity/vision

# Utility
npm install clsx tailwind-merge

# Optional (only if design requires WebGL hero)
npm install three @react-three/fiber @react-three/drei

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss
```

## CMS Decision: Sanity (primary) vs Payload (v3-aware alternative)

This is the highest-leverage decision in the stack given the 3-milestone roadmap, so it's broken out explicitly.

**Recommendation: Sanity for v1.**

| Factor | Sanity | Payload 3.x |
|---|---|---|
| Editor experience for non-technical client | Sanity Studio is polished, real-time collaborative, purpose-built for content editors (case studies, services, testimonials) | Admin panel is functional but more developer-oriented; more onboarding needed for a non-technical construction-company office admin |
| Infra for v1 (marketing site only) | Fully hosted SaaS — no DB to provision, no auth system to run, generous free tier likely covers this project's content volume | Self-hosted, requires a Postgres DB from day one even though v1 has no app-logic need for one |
| Image pipeline | Built-in CDN-backed image API with on-the-fly transforms (`@sanity/image-url`), hotspot/crop metadata editors — well suited to a photography-led portfolio | Requires configuring your own storage adapter (S3, etc.) and doesn't include Sanity's crop/hotspot UI out of the box |
| Path to v3 (CRM, backend, auth) | Sanity is content-only — it will **not** become the CRM backend. v3's leads/clients/engineers data model will live in a separate application database regardless of CMS choice. | Payload **could** theoretically grow into the v2/v3 backend (it ships auth, collections, relationships, a real Postgres DB) — but this couples a marketing-site content tool to future CRM architecture prematurely, before v2/v3 requirements are known. |
| Risk of "painting into a corner" | Low — Sanity's role stays scoped to content (case studies, services copy, team, testimonials). v2 (AI lead-gen) and v3 (CRM) will need their own dedicated backend (likely a separate Next.js API layer or standalone service + Postgres + auth, decided in v2/v3 research) regardless of what CMS v1 uses. Swapping/removing a content-only CMS later is low-risk because it doesn't touch app logic. | Medium — tempting to "reuse" Payload's DB/auth for the CRM, but CRM data models (leads, clients, engineers, contractors, permissions) are a different domain than content modeling. Forcing them into one system now, before v2/v3 scope is defined, risks a schema/architecture mismatch discovered mid-build. |

**Why not decide the v3 backend now:** The milestone context says v1 "should not paint the codebase into a corner," which means **keep v1's CMS decoupled from future backend concerns**, not "pre-build the backend." A content-only headless CMS (Sanity) achieves that decoupling better than a full-stack CMS (Payload) that blurs the line between "content" and "application data." When v2 (AI lead-gen) is researched, that's the right time to decide the app backend/DB/auth stack — it will likely sit alongside the Next.js frontend as its own API layer, and can be Payload, a plain Postgres+Prisma service, Supabase, or something else entirely, chosen against v2's actual requirements.

**Confidence: MEDIUM** — this is an architectural judgment call, not a pure fact-lookup. Flag for confirmation with the user/roadmap: if the client strongly prefers a single admin login for everything long-term, Payload becomes more attractive despite the coupling risk.

**If simplicity is paramount and the client's content needs are minimal** (e.g., fewer than ~10 project case studies added per year, no need for a visual editor): an **MDX-based approach** (content as `.mdx` files in the repo, edited via PR or a lightweight git-based CMS UI like Tina CMS or Sanity's own git-backed alternative) is a legitimate lower-complexity alternative. Not recommended here because the client explicitly needs to self-serve updates to case studies/services without developer involvement — Sanity Studio serves that need directly; MDX-in-repo does not.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Next.js 15 (LTS) | Next.js 16 | Once Next 16's App Router runs on stable (not canary) React and Turbopack has more production track record — re-verify at implementation kickoff, this may already have flipped by then. |
| Sanity | Payload CMS 3.x | If the client wants one system/one login across the whole product lifecycle (content + future CRM) and is willing to accept self-hosting/DB overhead starting in v1. |
| Sanity | Storyblok | If the client's marketing team wants a highly visual, Webflow-like drag-and-drop page builder rather than structured content documents. Storyblok's visual editor is best-in-class for marketers building page layouts themselves, but that's more capability than a construction contractor's case-study/services content needs, and it adds cost (Storyblok's free tier is more limited for commercial use than Sanity's). |
| `next/image` (local/Vercel optimization) | Cloudinary (`next-cloudinary`) | If image volume grows large (hundreds+ of high-res photos/videos) or the client needs advanced art-directed cropping/focal points beyond Sanity's built-in hotspot tool, or if video transcoding/adaptive bitrate streaming is needed for background video. |
| GSAP + Lenis for scroll storytelling | Motion's `useScroll`/`useTransform` scroll hooks only | If the site's motion needs are simpler than full pinned/scrubbed cinematic sequences — Motion's scroll hooks are lighter-weight but far less capable for the pinning/timeline choreography this project's reference sites (Storey Architecture, Kononenko) demonstrate. |
| GSAP-driven page transitions | Native View Transitions API (`next-view-transitions` or Next 16's `experimental.viewTransition`) | Once the View Transitions API and its Next.js integration exit experimental status (expected sometime in 2026) and if transition needs are simple crossfades/shared-element morphs rather than complex choreographed sequences. Currently still `unstable_ViewTransition` in React 19.x and behind an `experimental` flag in Next.js — not yet reliable enough for a client-facing production site to depend on as the primary transition mechanism. |
| Vercel hosting | Self-hosted (Docker/VPS), Railway, Render, Cloudflare Pages | If the client's budget is highly cost-sensitive long-term and traffic/image-optimization volume would push Vercel Pro overages ($5/1,000 images beyond 5,000/month; bandwidth overages ~$150+/TB beyond 1TB). For a single-location-ish marketing site with a curated (not massive) image set, this is unlikely to be a near-term concern, but flag it as a monitoring item post-launch. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| jQuery / vanilla scroll-hijacking libraries (e.g., old `fullpage.js`, `scrollmagic`) | Unmaintained or poorly maintained, fights React's rendering model, no first-class Next.js/App Router support, worse performance than GSAP/ScrollTrigger + Lenis. | GSAP ScrollTrigger + Lenis |
| `framer-motion` npm package name going forward | Deprecated alias — still works, but new code should import from `motion` / `motion/react` to avoid confusion and stay on the actively developed package. | `motion` (npm package), import from `motion/react` |
| Club GSAP paid license / old GSAP <3.12 tutorials referencing "buy a license for ScrollTrigger" | Outdated information — as of April 2025, all GSAP plugins including ScrollTrigger, SplitText, ScrollSmoother are free for commercial use after Webflow's acquisition. Don't budget for or gate implementation on a GSAP license. | Free `gsap` npm package, all plugins included |
| Using both GSAP ScrollTrigger and Motion's scroll hooks to animate the *same* element/scroll region | Two competing scroll-position sources fighting for the same DOM element causes jank, race conditions, and unpredictable behavior — a very common Awwwards-clone-tutorial mistake. | Pick one system per animation type: GSAP+ScrollTrigger for scroll-driven/pinned sequences, Motion for discrete UI-state transitions (hover, modal open/close, filter changes) |
| Relying on `experimental.viewTransition` / `unstable_ViewTransition` as the *only* page-transition mechanism for a client-facing production launch | Still experimental/canary in both React 19.x and Next.js 16 as of 2026; API and import paths are expected to change when it stabilizes, which would require rework post-launch. | GSAP-orchestrated transitions (custom, framework-stable) for the core experience; can layer native View Transitions in later as a progressive enhancement once stable |
| Google Fonts via `<link>` tag or CSS `@import` | Introduces a render-blocking third-party network request, hurts LCP/CLS, defeats the purpose of a performance-obsessed Awwwards build. | `next/font/google` (self-hosted at build time, zero layout shift) or `next/font/local` for licensed editorial/display typefaces not on Google Fonts |
| Speculatively adding Three.js/WebGL before design direction confirms a 3D/shader requirement | Largest bundle-size and complexity cost in this stack; both reference sites (Storey Architecture, Kononenko) may use WebGL for hero treatments, but that's a design decision, not a default. | Confirm with design/roadmap phase whether a WebGL hero is in scope before installing `three`/`@react-three/fiber` |
| Building the v3 CRM's data layer inside the v1 CMS choice preemptively | Premature architecture coupling — CRM requirements (leads, clients, engineers, contractors, roles/permissions) aren't known yet at v1 research time. | Keep v1's CMS scoped to content only (Sanity); decide the application backend/DB/auth stack during v2/v3 research when requirements are concrete |

## Stack Patterns by Variant

**If the design direction confirms a WebGL/3D hero treatment (matching the Storey Architecture reference):**
- Add `three` + `@react-three/fiber` + `@react-three/drei`
- Scope WebGL to the hero/key moments only, not the whole page — lazy-load the Three.js bundle so it doesn't block initial page load for the rest of the (image/GSAP-driven) content
- Because: WebGL is the single heaviest dependency here; isolating it protects overall performance budgets

**If the client needs frequent, high-volume project photo/video uploads with advanced cropping (post-launch growth scenario):**
- Layer in `next-cloudinary` alongside or instead of Sanity's native image pipeline
- Because: Cloudinary's transformation API and video handling (adaptive bitrate, auto-format) scales better than Sanity's built-in image CDN once volume/complexity grows significantly beyond a curated portfolio

**If Vercel costs become a concern post-launch (unlikely for v1 traffic levels, but worth flagging):**
- Move to Cloudflare Pages (generous free tier, no per-image optimization charges when paired with Cloudflare Images or a manual sharp-based build step) or a self-hosted Docker deployment on a low-cost VPS
- Because: Vercel's image optimization and bandwidth pricing scales per-usage and can surprise budget-conscious small-business clients at higher traffic

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@15.5.x` | `react@19.x`, `tailwindcss@4.x`, `typescript@5.7+` | Next 15 requires React 19; confirm `eslint-config-next` matches installed Next version. |
| `gsap@3.15.x` + `ScrollTrigger` | `lenis@1.3.x` | Must manually sync: disable Lenis's own rAF loop, drive it from `gsap.ticker.add((time) => lenis.raf(time * 1000))`, and call `ScrollTrigger.update()` on Lenis's `scroll` event (or use `lenis.on('scroll', ScrollTrigger.update)`). This wiring is the single most common source of scroll-jank bugs in this stack — budget explicit implementation/testing time for it. |
| `motion@latest` (npm) | React 19 | Verify `motion` package major version at implementation time (npm showed `13.x` as current during this research pass, but this library ships frequently) — check for any React 19 concurrent-mode caveats in their upgrade guide before pinning. |
| `next-sanity` | `next@15.x`, `sanity@latest` | Sanity Studio can be embedded at a route like `/studio` inside the same Next.js app (monorepo-free setup) — recommended for this project so the client has one deployed surface. |
| `sharp` | Node.js version used by hosting platform | If self-hosting or moving off Vercel, verify `sharp`'s native binary compatibility with the target platform's architecture (common footgun in Docker/ARM environments). |

## Sources

- [Next.js — Upgrading to Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16) — HIGH confidence, official docs
- [Next.js 15 blog announcement](https://nextjs.org/blog/next-15) — HIGH confidence, official
- npm registry live lookups (`npm view <pkg> version` / `dist-tags`) run 2026-09-08 for: `next`, `react`, `gsap`, `lenis`, `motion`, `@sanity/client`, `payload`, `tailwindcss`, `sharp`, `three`, `@react-three/fiber`, `@react-three/drei`, `clsx`, `tailwind-merge`, `next-view-transitions` — HIGH confidence (authoritative, current at time of research)
- [Webflow — GSAP becomes free](https://webflow.com/updates/gsap-becomes-free) — HIGH confidence, official announcement
- [Motion (motion.dev) — Motion for React docs](https://motion.dev/docs/react) and [upgrade guide](https://motion.dev/docs/react-upgrade-guide) — HIGH confidence, official
- [npm — framer-motion package page](https://www.npmjs.com/package/framer-motion) — confirms deprecated-alias status — HIGH confidence
- [Payload — "Payload 3.0: The first CMS that installs directly into any Next.js app"](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app) — HIGH confidence, official
- WebSearch: "Awwwards site of the day 2025 tech stack GSAP Lenis Next.js" (By-Kin case study, Next.js + GSAP + Strapi; Lenis+GSAP+Next.js pattern) — MEDIUM confidence, cross-referenced across multiple independent write-ups but not a formal/statistical survey of all Awwwards winners
- WebSearch: headless CMS comparisons (dev.to, Makers Den, FocusReactive) for Sanity/Payload/Storyblok tradeoffs — MEDIUM confidence, community sources cross-agreeing on target-audience/hosting differences
- WebSearch: "Next.js 16 View Transitions API experimental" (official Next.js guide + community field notes) — HIGH confidence on experimental status (matches official docs), MEDIUM on 2026 stabilization timeline (community speculation)
- WebSearch: Vercel pricing/image-optimization tradeoffs (Wisp CMS, Makerkit, community cost-optimization posts) — MEDIUM confidence, pricing specifics should be re-verified against current Vercel pricing page at implementation time as pricing tiers change

---
*Stack research for: Awwwards-tier Next.js marketing site (Stoneage Properties), v1 of 3-milestone build*
*Researched: 2026-09-08*
