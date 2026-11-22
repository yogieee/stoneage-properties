# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (App Router, Turbopack-free default)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint (flat config, `next/core-web-vitals` + `next/typescript`)

No test runner is configured in this repo. Prettier runs via `prettier-plugin-tailwindcss` (class sorting) — no separate `format` script exists; invoke `npx prettier --write .` directly if needed.

Sanity Studio is embedded in the Next app at `/studio` (see `sanity.config.ts` and `src/app/studio/[[...tool]]`) — no separate CLI/dev process; it runs inside `npm run dev`.

One-off data/content scripts live in `scripts/*.mjs` (seeding Sanity, migrating homepage panels, importing WP media, finalizing Mux videos, etc.) and `scripts/supabase-schema.sql`. Run with `node scripts/<name>.mjs`; check the top of each script for required env vars before running.

## Architecture

**Stack**: Next.js 15 (App Router, React 19) + Sanity CMS (content) + Supabase (contact/chat persistence) + Anthropic Claude (site chat assistant) + Resend (email) + Twilio (WhatsApp notifications) + GSAP/Lenis (scroll/motion) + Tailwind v4.

### Route structure

- `src/app/(marketing)/` — the public marketing site, grouped under a route group so it shares `layout.tsx` (nav/footer/smooth-scroll) without affecting the URL. Pages: home, `build`, `contact`, `craftsmanship`, `journal`, `ourstudio`, `projects`, `services`, `privacy`, `terms`, `style-guide`.
  - `@modal/default.tsx` is a parallel route slot used for the contact modal overlay, so it can render on top of any marketing page without a route change.
  - Every top-level page has a sibling `opengraph-image.tsx` — OG images are generated per-route (see `src/lib/og-image.tsx` for the shared renderer).
- `src/app/studio/[[...tool]]` — catch-all mount for Sanity Studio.
- `src/app/api/` — route handlers:
  - `chat/route.ts` — the Claude-powered site assistant. Contains the full system prompt, two tool definitions (`capture_lead`, `offer_options`) for structured lead qualification and quick-reply UI, and triggers `sendAdminChatLeadEmail` / `sendAdminChatLeadWhatsAppMessage` when a lead is captured. This is the most business-logic-dense file in the repo — read it fully before changing chat behavior.
  - `chat/context/route.ts` — supplies page context to the assistant (see `src/lib/chat/pageContext.ts`).
  - `contact/route.ts` — contact form submission → Supabase + notification fan-out.
  - `revalidate/route.ts` — Sanity webhook target for on-demand ISR revalidation (uses `SANITY_REVALIDATE_SECRET`).
  - `track/route.ts` — visit tracking, paired with `src/components/analytics/VisitTracker.tsx`.
- `src/app/sitemap.ts` / `src/app/robots.ts` — generated from Sanity content + static routes.

### Content layer (Sanity)

- `src/sanity/schemaTypes/` — document schemas: `project`, `service`, `journalArticle`, `teamMember`, `testimonial`, `heroSlide`, `homepagePanels`, `siteSettings`. Slugs are enforced URL-safe via `src/sanity/lib/slug.ts` — reuse that helper for any new slugged schema rather than Sanity's default slugify.
- `src/sanity/queries.ts` — centralized GROQ queries; prefer adding here over inlining GROQ in components/pages.
- `src/sanity/client.ts` / `src/sanity/image.ts` / `src/sanity/env.ts` — client setup, image URL builder, and env var assertions (throws at import time if Sanity env vars are missing — expect hard failures, not silent fallbacks).
- Studio structure/customization: `src/sanity/structure.ts`, wired into `sanity.config.ts` (also configures `sanity-plugin-mux-input` for video fields).

### Backend integrations (`src/lib/`)

- `supabase/server.ts` — server-only Supabase client (service role key). Backs contact form submissions and chat lead/history persistence.
- `email/resend.ts` + `notifications/templates.ts` — admin email notifications for new leads; templates centralized separately from send logic.
- `whatsapp/twilio.ts` — admin WhatsApp notifications for hot/warm leads via Twilio.
- `chat/pageContext.ts` — builds context injected into the chat assistant based on what page the visitor is on.
- `seo.ts` — shared metadata helper used by marketing pages for per-route `<title>`/description/OG tags.
- `og-image.tsx` — shared OG image renderer consumed by each route's `opengraph-image.tsx`.
- `gsap.ts` — GSAP registration/config shared across motion components.

### Motion/UI conventions

- `src/components/motion/` — reusable animation primitives (`Reveal`, `TextReveal`, `ParallaxImage`, `MagneticButton`, `PageTransition`, `Preloader`, `SmoothScrollProvider` wrapping Lenis). Build new scroll/entrance animations on top of these rather than hand-rolling GSAP in page components.
- `src/components/sections/` — one component per marketing page section (hero, services, journal grid, testimonials slider, contact CTA, etc.), composed into pages under `(marketing)/`.
- `src/components/decorative/` — brand-specific SVG/graphic components (logos, blueprint accents, star rating, Trustpilot widget).
- `src/components/ui/` — low-level shared primitives (`Button`, `Typography`, `ArticleBody` for Portable Text rendering via `@portabletext/react`).
- Client components doing client-only work are split out explicitly (e.g. `TestimonialsSlider.tsx` vs `TestimonialsSliderClient.tsx`) — follow this pattern when a section needs a server-rendered wrapper plus client interactivity.

### Env vars

Required vars are declared in `.env.local` (not committed) — see keys referenced across `src/sanity/env.ts`, `src/lib/supabase/server.ts`, `src/lib/email/resend.ts`, `src/lib/whatsapp/twilio.ts`, and the `chat` route (`ANTHROPIC_API_KEY`). Sanity, Supabase, Anthropic, Resend, and Twilio credentials are all required for the full feature set to work locally.
