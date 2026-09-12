# Phase 1: Foundation — Architecture, Design System & Content Layer — Research

**Researched:** 2026-09-08
**Domain:** Next.js App Router project bootstrap; Sanity embedded CMS; Tailwind v4 design-token system; GSAP/Lenis motion-primitive layer with reduced-motion built in; SSR/indexability baseline
**Confidence:** HIGH (Next.js, Sanity, GSAP/Lenis mechanics all verified against official docs); MEDIUM on exact current npm versions (verify at `npm install` time — this research reuses the project-level STACK.md version pins, dated same day)

## Summary

Phase 1 has no real pages and no real content — its job is to prove four independent systems work correctly in isolation, on placeholder content, so later phases build on a foundation that's already been verified rather than discovered broken: (1) Next.js App Router renders real text server-side with zero client-JS dependency, (2) Tailwind v4's `@theme`-based token system enforces the monochrome/editorial design language consistently, (3) a small set of GSAP-driven motion primitives have `prefers-reduced-motion` handling **built into the primitive itself** (not bolted on per-usage), and (4) Sanity Studio is embedded in the same Next.js app, schema-driven, and the client can create/edit content that flows to the live site without a deploy or developer involvement.

The critical architectural insight for this phase: **each of the four success criteria maps to a boundary that must not leak.** Motion primitives must know nothing about content (so they can be built and polished against placeholder data before real content exists). Content-fetching must happen only in Server Components (so SEO/indexability isn't accidentally coupled to the client-heavy motion layer). The reduced-motion check must live inside the motion primitive's own implementation (`gsap.matchMedia()`), not as an external wrapper someone might forget to apply per-usage. Sanity Studio must be a fully separate route group with its own layout, so CMS admin code never touches marketing page code or bundle.

**Primary recommendation:** Scaffold Next.js 15.5 LTS + Tailwind 4 + Sanity (embedded `/studio` route) + a `components/motion/` primitive layer built once using `@gsap/react`'s `useGSAP()` combined with `gsap.matchMedia()` for reduced motion, verified against a style-guide/demo page before any real page is attempted.

## Standard Stack

Reuses project-level `.planning/research/STACK.md` (same research date, do not re-litigate). Phase-1-relevant subset:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---------------|
| `next` | 15.5.x (LTS) | App Router, Server Components, `next/font`, `next/image` | React 19 stable track; avoids Next 16's canary-React App Router on a client-facing build. Re-verify at kickoff per STACK.md note. |
| `react` / `react-dom` | 19.x | UI runtime | Required by Next 15+ |
| `typescript` | 5.7+ | Type safety, CMS-generated types | Standard |
| `tailwindcss` | 4.x (npm `4.3.3`+) | CSS-first design tokens via `@theme` | No `tailwind.config.js` needed; ideal for enforcing a strict monochrome palette + type scale in one place |
| `sanity` | latest | Embedded Studio (React app mounted at `/studio`) | Client-facing CMS editor UI |
| `next-sanity` | latest | `NextStudio` component, typed client helpers, image URL builder glue | Official Sanity/Next.js integration toolkit |
| `@sanity/client` | 8.x | Server-side GROQ querying from Server Components | Official client |
| `@sanity/image-url` | latest | Build optimized image URLs from Sanity asset refs for `next/image` | Required for the Sanity image pipeline |
| `gsap` (+ `ScrollTrigger`) | 3.15.x | Scroll-driven reveal/parallax primitives | Free since Apr 2025 (Webflow acquisition) — no license gating |
| `@gsap/react` | latest (matches gsap major) | `useGSAP()` hook — automatic context cleanup on unmount, React 19-safe | Prevents ScrollTrigger leaks across App Router navigations (see Pitfalls) |
| `lenis` | 1.3.x | Smooth/inertia scroll, synced to GSAP ticker | Defaults to respecting `prefers-reduced-motion` (see below) — do not override |
| `motion` | latest (verify: `motion@13.x`+) | Component-level UI micro-interactions (not scroll choreography) | Only if Phase 1's demo page needs discrete UI-state transitions; GSAP owns scroll |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `clsx` + `tailwind-merge` | latest | `cn()` helper for variant-driven components | Any component accepting a `className` override |
| `sharp` | 0.35.x | Image optimization backing `next/image` | Auto-installed; verify if deploying off Vercel |

### Explicitly NOT in Phase 1
- `three` / `@react-three/fiber` — WebGL hero is unconfirmed scope; do not add speculatively (per project STACK.md and prompt constraint)
- Payload CMS — superseded by the Sanity decision; ignore Payload-flavored guidance in `.planning/research/ARCHITECTURE.md` (that file predates the Sanity-vs-Payload decision lock and still shows Payload in its diagrams/structure — **treat Sanity as the CMS in all phase planning**, adapt the architecture doc's structural patterns, not its literal CMS choice)
- Postgres/`leads` table — Phase 4 concern (contact form), but Phase 1's architecture must not block it (see Architecture Patterns below)

**Installation:**
```bash
npx create-next-app@15 . --typescript --tailwind --app --src-dir --import-alias "@/*"
npm install gsap @gsap/react lenis motion
npm install sanity next-sanity @sanity/client @sanity/image-url @sanity/vision
npm install clsx tailwind-merge
npm install -D prettier prettier-plugin-tailwindcss
```

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx              # shared nav/footer chrome for public site
│   │   └── style-guide/page.tsx    # demo page proving design system + motion + SSR
│   ├── studio/
│   │   └── [[...tool]]/page.tsx    # embedded Sanity Studio (force-static)
│   ├── layout.tsx                  # root layout: fonts (next/font), SmoothScrollProvider
│   └── globals.css                 # @theme design tokens
├── components/
│   ├── motion/                     # content-agnostic primitives, reduced-motion baked in
│   │   ├── Reveal.tsx
│   │   ├── Parallax.tsx
│   │   └── SmoothScrollProvider.tsx
│   └── ui/                         # design-system primitives (Typography, Button)
├── sanity/
│   ├── schemaTypes/
│   │   ├── project.ts              # minimal placeholder schema for CMS-01 proof
│   │   └── index.ts
│   ├── lib/
│   │   ├── client.ts               # server-only Sanity client (GROQ)
│   │   └── image.ts                # @sanity/image-url builder
│   └── env.ts                      # typed env var access
├── sanity.config.ts                # 'use client' — Studio config, basePath '/studio'
└── sanity.cli.ts
```

### Structure Rationale

- **`(marketing)` route group, `studio/` as sibling, not nested:** Keeps CMS admin fully decoupled from public-site layout/nav so Studio's React app (which is itself a large client bundle) never affects the marketing site's SSR/bundle budget. `export const dynamic = 'force-static'` on the Studio page lets it be statically served without touching per-request marketing rendering.
- **`components/motion/` isolated from any content/domain component:** This is the single most load-bearing structural decision in this phase. Motion primitives are built and proven against **placeholder content on the style-guide page** — they take `children`/generic props, never a "Project" or "Service" type. This is what makes success criterion 3 (reduced-motion toggle test) verifiable in total isolation from CMS work, and what lets later phases compose primitives around real content without touching primitive internals.
- **`sanity/schemaTypes/` with a minimal `project` schema in Phase 1:** CMS-01's success criterion only requires the client can create/edit **a** project entry that reflects live — it does not require the full case-study content model (that's later-phase scope per requirements). Build one real, minimal schema (title, slug, summary, hero image) to prove the end-to-end pipeline (Studio → dataset → GROQ query → Server Component → rendered HTML), not a placeholder/mock. Expanding the schema in later phases is additive, not a rebuild.
- **Sanity client is server-only (`sanity/lib/client.ts`, no `"use client"`):** Enforces ENG-04 structurally — content fetching can only happen in Server Components/Server Actions, never leaks into a client bundle, so the "is content in server-rendered HTML" property is architecturally guaranteed, not just a convention someone might violate later.

### Pattern 1: Motion Primitive With Reduced-Motion Built In (not retrofitted)

**What:** A `Reveal` (and optionally `Parallax`) component that internally uses `gsap.matchMedia()` to branch its own animation setup based on `(prefers-reduced-motion: reduce)`, wrapped in `useGSAP()` for automatic cleanup. Callers never think about reduced motion — it's inside the primitive, satisfying ENG-02's "fallback built into the animation system, not retrofitted."
**When to use:** Every scroll/entrance animation in the project, from Phase 1 onward.
**Source:** GSAP official docs (`gsap.matchMedia()`), `@gsap/react` official pattern.

```typescript
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); // register once, client-only module

export function Reveal({ children, y = 40 }: { children: React.ReactNode; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        noPreference: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          // Simplified: instant opacity fade, no transform/parallax motion
          gsap.set(ref.current, { opacity: 1, y: 0 });
          return;
        }

        gsap.from(ref.current, {
          y,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      }
    );

    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
```

**Verification for success criterion 3:** Toggle OS "reduce motion" (macOS: System Settings → Accessibility → Display → Reduce Motion; or Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion") while the style-guide page is open, then reload — the `Reveal` section should show content statically (opacity 1, no animation), not merely a "faster" version of the same motion. `gsap.matchMediaRefresh()` can be used if testing a live toggle without reload, but OS-level toggle + reload is the more realistic test matching how a real user would experience it.

### Pattern 2: Lenis Smooth Scroll — Do Not Override Its Reduced-Motion Default

**What:** Lenis (darkroomengineering) already checks `prefers-reduced-motion` internally and, when reduced motion is on, forces 1:1 native scroll tracking and instant `scrollTo` — this is documented, default behavior.
**When to use:** Mount once at root layout via a client `SmoothScrollProvider`, synced to GSAP's ticker.
**Pitfall to avoid:** Some tutorials manually pass `smoothWheel`/duration overrides copy-pasted without realizing they can defeat Lenis's built-in reduced-motion handling. Keep Lenis config minimal in Phase 1; do not hardcode `duration`/easing overrides that would need a manual reduced-motion branch — let Lenis's default do the work.

```typescript
"use client";
import { ReactLenis, useLenis } from "lenis/react"; // or manual instantiation — verify current API at install time
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    return () => gsap.ticker.remove((time) => lenis.raf(time * 1000));
  }, [lenis]);

  return <ReactLenis root>{children}</ReactLenis>;
}
```
**Confidence:** MEDIUM on exact `lenis/react` API surface (package restructured under new `lenis` npm name; verify hook names — `useLenis`, `ReactLenis` — against the installed version's README at implementation time, since Lenis ships frequently). The GSAP-ticker-sync pattern itself and the reduced-motion default are HIGH confidence (official Lenis README, cross-referenced in project PITFALLS.md).

### Pattern 3: SSR/Indexability Proof (success criterion 1)

**What:** Core marketing copy (skeleton page content — headings, a paragraph of body copy, contact info placeholder) must be fetched/rendered in a Server Component and appear in `view-source:` HTML with JavaScript disabled.
**When to use:** Every content-bearing page, from the Phase 1 skeleton page onward. This is a structural default (Server Components), not a per-page decision.

```typescript
// app/(marketing)/page.tsx — Server Component, no "use client"
import { client } from "@/sanity/lib/client";
import { Reveal } from "@/components/motion/Reveal";

export default async function Home() {
  const data = await client.fetch(`*[_type == "siteSettings"][0]{tagline, intro}`);
  return (
    <main>
      <h1>{data?.tagline ?? "Placeholder tagline"}</h1>
      <Reveal>
        <p>{data?.intro ?? "Placeholder intro copy for SSR proof."}</p>
      </Reveal>
    </main>
  );
}
```
**Verification:** `curl -s http://localhost:3000 | grep "Placeholder tagline"` (or view-source in browser with JS disabled) must show the real text, not an empty shell. Keep the `Reveal` wrapper client-scoped to its own leaf (`"use client"` inside `Reveal.tsx` only) — the page itself stays a Server Component so content isn't dragged into client-only rendering.

### Pattern 4: Sanity Embedded Studio (success criterion 4)

**What:** Sanity Studio mounted at `/studio` inside the same Next.js app via `next-sanity`'s `NextStudio` component, sharing one deployment/build pipeline with the marketing site.
**Source:** Official Sanity docs (`sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs`), fetched 2026-09-08.

```typescript
// sanity.config.ts (project root) — 'use client' required, Studio is a client React app
'use client'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
```

```typescript
// src/app/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

**Fastest path:** `npx sanity@latest init` from inside the existing Next.js project auto-detects the framework and scaffolds most of this — prefer it over fully manual setup to reduce boilerplate drift from current Sanity CLI conventions.

**Verification for success criterion 4:** Client logs into `/studio` (Sanity's own auth, no custom auth needed), creates/edits a `project` document, and — depending on caching strategy chosen (see Open Questions) — sees it reflected on the live site without a code deploy or developer touching anything.

### Anti-Patterns to Avoid

- **Wrapping every individual `Reveal` usage in an external reduced-motion `if` check:** Defeats ENG-02's explicit requirement ("built into the animation system, not retrofitted"). The check belongs inside the primitive's implementation once, not at every call site.
- **Fetching Sanity data from a Client Component or via a public API route hit from the browser:** Breaks the server-only guarantee that keeps content in the initial HTML payload (ENG-04). Server Components / Server Actions only.
- **Treating Phase 1's Sanity schema as a placeholder/mock to be thrown away:** Requirement CMS-01's success criterion is a real, working end-to-end loop, not a stub. Build the minimal `project` schema for real; extend it later.
- **Copy-pasting Lenis config with custom duration/easing that bypasses its default reduced-motion handling** (see Pattern 2).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| ScrollTrigger cleanup on unmount/route change | Manual `useEffect` + `ScrollTrigger.getAll().forEach(t => t.kill())` | `@gsap/react`'s `useGSAP()` hook | Wraps in `gsap.context()`, auto-`.revert()`s on unmount — the standard, official pattern; manual cleanup is the #1 source of ScrollTrigger leaks across App Router navigations (see project PITFALLS.md Pitfall 4) |
| Reduced-motion detection/toggling | A custom `useReducedMotion()` hook re-implementing `matchMedia` listeners | `gsap.matchMedia()` (for GSAP animations) + Lenis's built-in default (for scroll smoothing) | Both libraries already ship this; hand-rolling risks missing the dynamic-toggle case (`matchMediaRefresh()`) and duplicating logic GSAP already tests |
| CMS admin UI / auth for content editors | A custom admin panel or login system for the client | Sanity Studio (ships auth, real-time collaborative editing, image hotspot/crop UI) | This is exactly the CMS-01 requirement — Sanity's whole value proposition is not needing to build this |
| Image URL/crop transforms for Sanity-hosted images | Manual CDN URL string concatenation | `@sanity/image-url` builder | Handles hotspot/crop metadata, format negotiation, responsive sizing correctly; manual string-building breaks silently when Sanity's asset CDN URL scheme changes |
| Design token management across components | Ad-hoc hex values scattered in `className` strings or a separate JS constants file | Tailwind v4 `@theme` block in `globals.css` | Single source of truth, generates utility classes automatically, keeps the "consistent monochrome/editorial system" requirement (MOTION-03) enforceable in one place instead of by convention |

**Key insight:** Every "don't hand-roll" item here maps directly to one of the four success criteria. This phase is specifically about using each system's built-in guarantees (Server Components for SSR, `@theme` for consistency, `matchMedia`+`useGSAP` for reduced-motion correctness, Sanity Studio for editor UX) rather than reimplementing any of them, because Phase 1's entire purpose is proving these foundations are solid before real content/pages are built against them.

## Common Pitfalls

### Pitfall 1: Reduced-motion check applied outside the primitive, easy to forget on new sections
**What goes wrong:** A developer builds `Reveal` correctly with `matchMedia` inside, but later adds a second primitive (`Parallax`, `PinnedSection`) without repeating the pattern, because it "seemed like extra boilerplate" for a demo.
**Why it happens:** Reduced-motion handling isn't visually obvious when reduce-motion is off (the default dev/testing state), so it's easy to ship a primitive that looks done but silently fails the OS-toggle test.
**How to avoid:** Every new motion primitive added in Phase 1 must include the `gsap.matchMedia()` branch as part of its minimal implementation, verified by explicitly toggling OS reduce-motion before considering the primitive "done" — not just before final QA.
**Warning signs:** A primitive component with a `useGSAP` call but no `matchMedia`/`prefers-reduced-motion` reference anywhere in its file.

### Pitfall 2: Sanity Studio embedded but CORS/dataset not configured, so "reflects live" silently fails
**What goes wrong:** Studio works fine (client can log in, edit, save), but the marketing site's GROQ fetch either errors (CORS) or serves stale cached data, so success criterion 4 ("reflects live on the site") appears to fail even though the CMS itself works.
**Why it happens:** Sanity requires the frontend's origin to be added to the project's CORS-allowed origins (in manage.sanity.io or via CLI), and Next.js's fetch caching (`fetch` with Next's extended caching, or ISR) can serve stale content unless revalidation is configured — this is easy to miss since local dev (`localhost:3000`) often needs to be explicitly whitelisted separately from the deployed URL.
**How to avoid:** Add both `http://localhost:3000` and the deployed preview/production URL to Sanity CORS origins early. For Phase 1's proof, either use `cache: 'no-store'` / short `revalidate` on the GROQ fetch, or set up on-demand revalidation — whichever is simpler is fine for Phase 1 (this isn't the phase to build production-grade ISR/webhook revalidation, just to prove the loop works).
**Warning signs:** Studio saves succeed but the site shows old/no data on refresh; browser console shows CORS errors when testing locally.

### Pitfall 3: Tailwind v4 `@theme` tokens defined but not actually used consistently (design system exists on paper, not in practice)
**What goes wrong:** `@theme` block defines a clean monochrome palette and type scale, but the style-guide/demo page (and later real pages) use raw Tailwind defaults (`text-gray-500`, arbitrary hex in `className`) instead of the theme's semantic tokens, so "consistent" (success criterion 2) isn't actually true in the rendered output.
**Why it happens:** Tailwind's default palette is still available alongside custom `@theme` tokens unless explicitly restricted, so nothing stops a developer from reaching for `text-neutral-400` (Tailwind default) instead of the project's own `text-ink-muted` (custom token) — both "work" visually but drift over time.
**How to avoid:** Name theme tokens semantically (not just re-exposing a raw palette) so there's an obvious "right" class to reach for, and treat the style-guide page as a living reference/audit tool — every component built in later phases should visually match swatches shown there.
**Warning signs:** Grep for raw Tailwind color utilities (`text-gray-`, `bg-slate-`, `text-zinc-` etc., outside the theme's own defined scale) creeping into component files.

### Pitfall 4: `@gsap/react`'s `useGSAP` cleanup return value confused with `matchMedia`'s own cleanup
**What goes wrong:** Because both `useGSAP`'s effect and `gsap.matchMedia()`'s handler support returning a cleanup function, it's easy to double up or mismatch which cleanup fires when, especially combined with `mm.revert()` being called in the wrong place.
**Why it happens:** Nesting `matchMedia` inside `useGSAP` (Pattern 1 above) is the correct, official pattern, but two layers of "returns a cleanup function" is a legitimate source of confusion when adapted from single-layer tutorials that only show `useGSAP` or only show `matchMedia`, not both together.
**How to avoid:** Follow Pattern 1's exact structure — `mm.revert()` in `useGSAP`'s own returned cleanup, not inside the `matchMedia` handler's returned function (that inner one is for custom per-condition teardown only, per GSAP's own docs guidance not to call `context.revert()` there).
**Warning signs:** Animations that don't reset properly when toggling reduce-motion back and forth during dev testing.

## Code Examples

See Architecture Patterns section above for the four canonical Phase 1 code patterns: `Reveal` motion primitive (Pattern 1), `SmoothScrollProvider` (Pattern 2), SSR content page (Pattern 3), embedded Sanity Studio (Pattern 4). All four sourced from official docs (GSAP, Sanity) or the project's own STACK/ARCHITECTURE/PITFALLS research, dated 2026-09-08.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---------------|-------------------|----------------|--------|
| `tailwind.config.js` JS-based theme config | `@theme` block directly in CSS (Tailwind v4) | Tailwind v4 (2025) | No config file needed for Phase 1's token system; tokens live in `globals.css`, colocated with the design system they define |
| Manual `useEffect` + `ScrollTrigger.kill()` cleanup | `@gsap/react`'s `useGSAP()` hook | `@gsap/react` package maturity, now the documented standard | Directly prevents the ScrollTrigger-leak pitfall called out in project PITFALLS.md |
| GSAP Club plugins (ScrollTrigger, SplitText) paid | All GSAP plugins free | April 2025 (Webflow acquisition) | No licensing gate on any Phase 1 motion work |
| `framer-motion` npm package | `motion` npm package (`motion/react` import) | 2025 rename | Only relevant if Phase 1's demo page uses Motion for a discrete UI transition; use the new package name |

**Deprecated/outdated:** Payload-CMS-centric guidance in the project's own `.planning/research/ARCHITECTURE.md` — that document was written considering Payload as a live option; the project has since locked Sanity. Its structural patterns (route groups, motion/content separation, Server Action → data store pattern) remain valid and should be followed; its literal CMS collection/config code samples (Payload-specific) do not apply.

## Open Questions

1. **Sanity content revalidation strategy for Phase 1's proof (on-demand webhook vs. short-TTL fetch vs. `no-store`)**
   - What we know: Sanity supports on-demand ISR via webhooks (`revalidateTag`/`revalidatePath` triggered on document publish), and this is the production-grade pattern typically wired up later.
   - What's unclear: Whether Phase 1 needs the full webhook-based revalidation, or whether a simple short-cache/`no-store` fetch is sufficient to satisfy "reflects live on the site without developer involvement" for this phase's proof.
   - Recommendation: Use the simplest option (`cache: 'no-store'` or a short `revalidate` value) for Phase 1's demo/skeleton page; treat production-grade webhook revalidation as an optimization for a later phase once real pages exist. Flag this explicitly to the planner as a scope decision, not a research gap.

2. **Exact current `lenis`/`lenis/react` API surface (hook names, whether `ReactLenis` wrapper vs. manual instantiation is current best practice)**
   - What we know: The package was renamed from `@studio-freight/lenis` to `lenis`; a React-specific entry point exists; default reduced-motion behavior is documented in the README.
   - What's unclear: Exact current export names/API shape, since Lenis ships frequently (per project STACK.md note) and this research pass didn't fetch the live README.
   - Recommendation: At implementation kickoff, run `npm view lenis versions --json | tail` and check the installed version's README/CHANGELOG directly before writing `SmoothScrollProvider`; treat Pattern 2's code as illustrative of the *integration pattern* (GSAP ticker sync), not a copy-paste-exact API reference.

3. **Font choice for "bold editorial typography"**
   - What we know: MOTION-03 requires bold editorial typography consistent with the Storey Architecture / Kononenko references; `next/font` (local or Google) is the required loading mechanism (never `<link>`/`@import`, per project STACK.md and PITFALLS.md).
   - What's unclear: The actual typeface(s) — this is a design decision, not a research gap, and likely belongs to whoever owns visual design direction (CONTEXT.md-equivalent discussion, if one occurs before planning) rather than this research pass.
   - Recommendation: Planner should treat "select and license/self-host the display + body typefaces" as an explicit Phase 1 task with a placeholder-acceptable default (e.g., a strong free editorial serif/grotesk pairing via `next/font/google`) if no design decision exists yet, swappable later without architectural impact since `next/font` usage is already centralized in the root layout.

## Sources

### Primary (HIGH confidence)
- [Sanity — Embedding Sanity Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs) — official docs, fetched 2026-09-08; exact `/studio` route + `sanity.config.ts` + `NextStudio` pattern
- [GSAP — gsap.matchMedia() official docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) — official docs, fetched 2026-09-08; exact API and cleanup semantics
- [Next.js — Image component docs](https://nextjs.org/docs/app/api-reference/components/image) — referenced via project PITFALLS.md, official
- Project-level `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` (2026-09-08) — treated as primary/authoritative for this phase per task instructions; Sanity-vs-Payload conflict resolved in favor of Sanity per prior project decision noted in task context

### Secondary (MEDIUM confidence)
- WebSearch: "next-sanity embed studio Next.js App Router setup" — cross-referenced against and consistent with the official doc fetch above
- WebSearch: "Tailwind CSS v4 @theme design tokens typography monochrome setup" — community sources consistent with Tailwind's own v4 CSS-first architecture change (well-established since v4 GA)
- Lenis default `prefers-reduced-motion` behavior — carried from project PITFALLS.md (sourced there from the official Lenis GitHub README), not independently re-verified in this pass

### Tertiary (LOW confidence)
- Exact current `lenis`/`lenis/react` hook names in Pattern 2's code sample — illustrative only, flagged in Open Questions for verification at implementation time

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — inherited from same-day project-level STACK.md npm registry lookups, cross-checked with this phase's Sanity/GSAP-specific fetches
- Architecture: HIGH for structural patterns (route groups, server-only content fetching, motion primitive isolation — all verified against official docs); MEDIUM for the exact Lenis React API surface
- Pitfalls: HIGH — GSAP/Lenis/Sanity mechanics verified against official sources; CORS/caching pitfall is a well-known, documented Sanity+Next.js integration gotcha

**Research date:** 2026-09-08
**Valid until:** ~2026-10-08 (30 days) for architecture/pattern guidance; re-verify exact npm versions (`gsap`, `@gsap/react`, `lenis`, `next-sanity`, `sanity`, `motion`) at actual implementation kickoff regardless of date, since several of these ship frequently

---
*Phase research for: Phase 1 — Foundation (Architecture, Design System & Content Layer), Stoneage Properties*
*Researched: 2026-09-08*
