# Architecture Research

**Domain:** Awwwards-quality Next.js marketing/portfolio site, milestone 1 of 3 (v1 marketing → v2 AI lead-gen → v3 CRM)
**Researched:** 2026-09-08
**Confidence:** MEDIUM-HIGH (Next.js App Router patterns and GSAP integration are HIGH confidence, well-documented and stable conventions; CMS/backend choice recommendation is MEDIUM — a reasoned bet given the 3-milestone roadmap, not the only valid option)

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                            │
│  Next.js App Router — Server Components by default                    │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │
│  │  Home     │ │ Portfolio │ │  Case     │ │  About /  │ │ Services│ │
│  │  (page)   │ │  (list)   │ │  Study    │ │  Team     │ │ (page)  │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └─────────┘ │
│                          ┌───────────┐                                │
│                          │  Contact  │  (client component: form)      │
│                          └─────┬─────┘                                │
├────────────────────────────────┼───────────────────────────────────────┤
│                    MOTION / PRESENTATION PRIMITIVES                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐ │
│  │ ScrollFX   │ │ Reveal /   │ │ PageTrans- │ │ Lenis smooth-scroll │ │
│  │ (GSAP+ST   │ │ Parallax   │ │ ition      │ │ Provider (client    │ │
│  │  wrapper)  │ │ wrapper    │ │ wrapper    │ │  root)              │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                          CONTENT LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  CMS / content source (Payload CMS collections, Next.js-     │    │
│  │  native) — Projects, Services, TeamMembers, Offices,         │    │
│  │  SiteSettings — fetched server-side, typed, zero client JS   │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                     APPLICATION / BACKEND LAYER (thin in v1)          │
│  ┌─────────────────────┐        ┌─────────────────────────────┐     │
│  │ Server Action:       │        │ Payload REST/Local API       │     │
│  │ submitInquiry()      │───────▶│ Leads collection (write)     │     │
│  │ (validates w/ Zod)   │        │ + email notify (Resend)      │     │
│  └─────────────────────┘        └──────────────┬────────────────┘     │
├─────────────────────────────────────────────────┼─────────────────────┤
│                          DATA LAYER               ▼                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐     │
│  │ Postgres │  │ Projects │  │ Leads    │  │ Media (blob store: │     │
│  │ (owned   │  │ Services │  │ table    │  │ S3/R2 for project  │     │
│  │  DB)     │  │ TeamMbrs │  │ (status, │  │ photography)       │     │
│  │          │  │ tables   │  │ source)  │  │                    │     │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘

v2 (AI lead-gen) plugs into the Leads table + a new /api/chat or
qualification Server Action — no frontend restructuring needed.
v3 (CRM) adds Users/Auth/Roles collections + dashboard route group
that reads the same Leads/Projects tables — no schema migration off v1 data.
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Route segments (`app/`) | URL structure, layout nesting, server-side data fetching | Next.js App Router folders, Server Components by default |
| Content layer (CMS collections) | Own project/service/team/office data, independent of presentation | Payload CMS collections (TypeScript config), or MDX+Contentlayer if no CMS |
| Presentation components | Pure rendering of content into markup, no animation logic | `components/sections/*`, receive typed props from server data |
| Motion primitives | Reusable scroll/parallax/transition behavior, decoupled from page content | `components/motion/*` — `<Reveal>`, `<Parallax>`, `<PinnedSection>`, wraps GSAP/ScrollTrigger via `useGSAP` |
| Smooth-scroll provider | Global scroll physics (Lenis), syncs with ScrollTrigger | Single client component at root layout, `providers/SmoothScrollProvider.tsx` |
| Contact form (client) | Collects input, client-side validation, calls Server Action | `components/forms/InquiryForm.tsx`, `"use client"`, react-hook-form + Zod |
| Server Action (`submitInquiry`) | Server-side validation, writes to Leads table, triggers notification | `app/(marketing)/contact/actions.ts`, Zod schema shared with client |
| Leads data store | Durable record of every inquiry, decoupled from how it's rendered/notified | Postgres table (via CMS ORM or plain Drizzle/Prisma) — the seam v2/v3 build on |
| Email notification | Human-in-the-loop alert on new lead (v1's only "automation") | Resend transactional email triggered from Server Action or CMS hook |
| Media storage | Serve optimized project photography at Awwwards-grade quality | Next.js `<Image>` + CDN-backed blob storage (Cloudinary, S3+CloudFront, or CMS-native) |

## Recommended Project Structure

```
src/
├── app/
│   ├── (marketing)/              # route group — public marketing site
│   │   ├── layout.tsx            # shared header/footer/nav for marketing pages
│   │   ├── page.tsx               # Home
│   │   ├── work/
│   │   │   ├── page.tsx           # Portfolio grid (list of projects)
│   │   │   └── [slug]/page.tsx    # Individual case study (dynamic route)
│   │   ├── about/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx           # Services overview
│   │   │   └── [service]/page.tsx # Optional: individual service detail
│   │   └── contact/
│   │       ├── page.tsx
│   │       └── actions.ts         # Server Action: submitInquiry()
│   ├── (studio)/                 # route group — Payload admin (if using Payload)
│   │   └── admin/[[...segments]]/page.tsx
│   ├── api/
│   │   └── [Payload/REST routes if needed, e.g. /api/leads webhook target]
│   ├── layout.tsx                 # root layout — fonts, SmoothScrollProvider, metadata
│   └── globals.css
├── components/
│   ├── motion/                    # reusable animation primitives (domain-agnostic)
│   │   ├── Reveal.tsx              # fade/slide-in on scroll via useGSAP
│   │   ├── Parallax.tsx
│   │   ├── PinnedSection.tsx
│   │   ├── PageTransition.tsx
│   │   └── SmoothScrollProvider.tsx
│   ├── sections/                  # page-specific composed sections
│   │   ├── home/HeroSection.tsx
│   │   ├── home/FeaturedWork.tsx
│   │   ├── work/ProjectGrid.tsx
│   │   ├── work/CaseStudyHeader.tsx
│   │   └── contact/InquiryForm.tsx
│   ├── ui/                        # primitive design-system components
│   │   ├── Button.tsx
│   │   ├── Typography.tsx
│   │   └── Nav.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── content/                       # only if using MDX instead of/alongside CMS
│   └── (unused if Payload is source of truth)
├── collections/                   # Payload CMS collection schemas (if Payload)
│   ├── Projects.ts
│   ├── Services.ts
│   ├── TeamMembers.ts
│   ├── Offices.ts
│   ├── Leads.ts                   # <-- the v2/v3 seam, exists from day one
│   └── Users.ts                   # <-- stubbed empty/unused in v1, activated in v3
├── lib/
│   ├── payload.ts                 # Payload local API client / typed fetchers
│   ├── validation/
│   │   └── inquiry-schema.ts      # Zod schema shared client+server
│   ├── email.ts                   # Resend client wrapper
│   └── utils.ts
├── hooks/
│   └── useGSAP-based custom hooks if needed beyond @gsap/react
├── styles/
│   └── design tokens (if not fully in Tailwind config)
└── payload.config.ts              # Payload CMS root config (if Payload chosen)
```

### Structure Rationale

- **`(marketing)` route group:** Isolates all public marketing pages under one layout (nav/footer) without polluting the URL with a `/marketing` segment. When v3's CRM dashboard arrives, it becomes a sibling `(dashboard)` route group with its own layout, auth guard, and completely different chrome — no restructuring of marketing routes required.
- **`(studio)` route group for CMS admin:** If using Payload, its admin panel mounts as a Next.js route (`/admin`) inside the same app. Keeping it in its own route group means it never shares layout/nav with the public site and can later gain role-based access control (v3) without touching marketing code.
- **`components/motion/` separated from `components/sections/`:** This is the single most important boundary for de-risking the Awwwards bar. Motion primitives (`Reveal`, `Parallax`, `PinnedSection`) know nothing about "projects" or "services" — they take children and animation config. Sections know nothing about GSAP internals — they compose primitives. This means the motion system can be built and polished in isolation (Phase 1) before any real content exists, and swapped/tuned later without touching page content.
- **`collections/Leads.ts` present from v1:** Even though v1 has no AI and no CRM, defining the Leads schema now (fields: name, email, phone, project type, budget range, message, source, status, createdAt) means the contact form already writes to a real, typed, queryable data store instead of "just send an email." v2 adds AI qualification as an enrichment step on top of the same table (new fields: score, summary, qualified boolean — additive, non-breaking). v3's CRM reads/manages the same table with no migration.
- **`collections/Users.ts` stubbed but unused in v1:** Defining (not necessarily fully building) the Users/auth collection early costs almost nothing with Payload (it's built in) and means v3's "manage clients, engineers, contractors" doesn't require bolting on an auth system to an app that was never designed for one.
- **`lib/validation/inquiry-schema.ts` shared Zod schema:** Used by both the client form (for instant validation feedback) and the Server Action (for trustworthy server-side validation). This same schema becomes the contract v2's AI qualification flow and v3's CRM lead-entry forms extend rather than replace.

## Architectural Patterns

### Pattern 1: Motion Primitives as a Presentation-Only Layer

**What:** A small set of composable, content-agnostic animation wrapper components (`Reveal`, `Parallax`, `PinnedSection`, `PageTransition`) built once using `@gsap/react`'s `useGSAP` hook, registered with ScrollTrigger, synced to a Lenis smooth-scroll provider at the root.
**When to use:** Any time a page section needs scroll-triggered motion. Pages import and compose these; they never call `gsap.*` directly.
**Trade-offs:** Slight upfront investment before any real page is "done," but pays off massively — the Awwwards-grade motion quality is proven early on placeholder content, decoupling animation risk from content/CMS risk and from client content-approval delays.

**Example:**
```typescript
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Reveal({ children, y = 40 }: { children: React.ReactNode; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      y,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
    });
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
```

### Pattern 2: Content Layer Fully Decoupled from Presentation

**What:** Project case studies, services, team bios, and office info live in typed CMS collections (or MDX+frontmatter as a lighter alternative), fetched server-side in Server Components, and passed as plain typed props into presentation components. Presentation components never import a CMS SDK directly — only page-level `page.tsx` files fetch data.
**When to use:** Always, for any content that a non-developer (client) will need to update — project photos, case study copy, team members, office addresses.
**Trade-offs:** A CMS adds setup overhead and (if hosted) a monthly cost vs. MDX-in-repo, which is free and git-versioned but requires a developer/PR to update content. Given the client will want to add new completed projects regularly, a CMS with a usable admin UI is worth the overhead. MDX is acceptable only if the client explicitly wants developer-mediated content updates.

**Example:**
```typescript
// app/(marketing)/work/[slug]/page.tsx — Server Component
import { getProjectBySlug } from "@/lib/payload";
import { CaseStudyHeader } from "@/components/sections/work/CaseStudyHeader";

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug); // typed, server-side only
  return <CaseStudyHeader project={project} />; // presentation gets plain data, no CMS coupling
}
```

### Pattern 3: Server Action → Data Store → Notification (the v2/v3 seam)

**What:** The contact form submits through a Next.js Server Action that validates with a shared Zod schema, writes a row to a `leads` table, and separately triggers an email notification. The write-to-database step and the notify-a-human step are separate, sequential concerns — not conflated.
**When to use:** For the v1 contact/inquiry form, and for any future lead-capture surface (chat widget in v2, smart form in v2).
**Trade-offs:** More setup than "just POST to an email API" (e.g., Formspree, Resend-only), but this is the exact decision that avoids a v2 rewrite: if v1 only emails leads and never persists them, v2's AI qualification has nothing to read/write, and v3's CRM has no historical lead data to manage. The extra ~1 day of work (schema + DB write) in v1 is the single highest-leverage future-proofing decision in this project.

**Example:**
```typescript
// app/(marketing)/contact/actions.ts
"use server";
import { inquirySchema } from "@/lib/validation/inquiry-schema";
import { payload } from "@/lib/payload";
import { sendLeadNotification } from "@/lib/email";

export async function submitInquiry(formData: FormData) {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  const lead = await payload.create({
    collection: "leads",
    data: { ...parsed.data, source: "contact-form", status: "new" },
  });

  await sendLeadNotification(lead); // fire-and-forget email to enquiries@stoneageproperties.com

  return { success: true };
}
```

## Data Flow

### Content Flow (CMS → Page)

```
Client updates a project in CMS admin (/admin)
    ↓
Payload writes to Postgres (Projects collection)
    ↓ (at request time, or via ISR/ on-demand revalidation)
Server Component (app/(marketing)/work/[slug]/page.tsx) fetches via Payload Local API
    ↓
Typed project object passed as props
    ↓
Presentation components (CaseStudyHeader, ProjectGallery) render structure
    ↓
Motion primitives (Reveal, Parallax) wrap sections for scroll animation — zero knowledge of "project" data
    ↓
Rendered HTML (Server Component, no client JS for content) + hydrated motion (client JS for animation only)
```

### Lead Flow (v1 → v2 → v3, same data path, additive)

```
v1 (marketing site):
  Visitor fills InquiryForm (client component)
    ↓ Server Action: submitInquiry()
    ↓ Zod validation (server-side, authoritative)
    ↓ Write row → leads table (status: "new", source: "contact-form")
    ↓ Resend email → enquiries@stoneageproperties.com (human reads it, no automation)

v2 (AI lead-gen, added later — no v1 restructuring):
  Visitor interacts with chat/smart-form widget (new client component)
    ↓ New Server Action or /api/chat route → same leads table
    ↓ AI qualification step reads/enriches the lead row (adds: score, summary, qualified)
    ↓ Same Resend notification path, now with AI-generated summary attached

v3 (CRM, added later — no v1/v2 restructuring):
  Authenticated staff user (new (dashboard) route group + Payload auth)
    ↓ Reads/updates the same leads table (status: contacted → won/lost)
    ↓ New Clients/Engineers/Contractors collections relate to existing Projects/Leads
    ↓ Dashboard views query the same Postgres DB v1 was already writing to
```

### Key Data Flows

1. **Content authoring flow:** Client/staff edits content in CMS admin → Postgres → server-rendered pages. No content is hardcoded in components; this is what lets the client (non-developer) maintain the portfolio after launch without a developer touching page code.
2. **Lead capture flow:** Every inquiry, from any surface (form now, chat later), converges on one `leads` table with a `source` field. This single-table-multiple-sources design is what prevents v2 from needing a new data model and what gives v3's CRM a complete lead history from day one, including pre-AI v1 leads.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| v1 launch (marketing site, low traffic) | Single Next.js app + single Postgres instance is entirely sufficient. Static/ISR rendering for content pages (revalidate on CMS webhook) keeps server load near zero. |
| v2 added (AI chat/qualification) | Add an `/api/chat` route or Server Action calling an LLM provider; rate-limit it (Vercel/Upstash) since it's the first endpoint with real per-request cost. No architectural change to marketing pages. |
| v3 added (CRM, internal users) | Add `(dashboard)` route group with auth (Payload's built-in auth or NextAuth), role-based access (staff vs admin), and dashboard-specific data views. This is additive — the marketing site's public routes and rendering strategy are untouched. |

### Scaling Priorities

1. **First bottleneck:** Image/video weight for Awwwards-grade full-bleed photography and hero video — not traffic. Mitigate with `next/image`, AVIF/WebP, a CDN-backed media store, and lazy-loading below the fold from day one, since this is a v1 performance risk, not a future one.
2. **Second bottleneck (v2+):** LLM API costs/latency once AI lead-gen ships — irrelevant to v1 architecture but worth flagging now: keep the chat/qualification logic behind a Server Action or route handler (already the pattern above), not embedded in the CMS or in Server Components, so it can be rate-limited and swapped independently.

## Anti-Patterns

### Anti-Pattern 1: Coupling GSAP animation logic directly into content/section components

**What people do:** Write `gsap.from(...)` calls inline inside `HeroSection.tsx`, `ProjectGrid.tsx`, etc., each with its own `useEffect`/cleanup logic.
**Why it's wrong:** Animation logic gets duplicated and inconsistent across pages, cleanup bugs (memory leaks, animations firing on unmounted sections) creep in, and tuning the "feel" of the whole site requires touching every section file instead of one primitive.
**Do this instead:** Build a small number of reusable motion primitives (`Reveal`, `Parallax`, `PinnedSection`) once, using `useGSAP` for automatic cleanup, and have every section compose them. Tune animation feel in one place.

### Anti-Pattern 2: Contact form that only sends an email, with no persisted record

**What people do:** Wire the contact form directly to an email API (Resend, SendGrid, or a form-backend SaaS like Formspree) and call it done — "it's just a marketing site, why need a database."
**Why it's wrong:** Given this project's explicit v2 (AI lead-gen) and v3 (CRM) roadmap, an email-only form means v2 has no lead records to qualify against and v3's CRM launches with zero historical data and must be bolted onto a form that was never designed to be a data source. This is precisely the "rewrite" this research was asked to prevent.
**Do this instead:** Server Action validates, writes to a `leads` table (owned Postgres, via Payload or a plain ORM), then separately sends the email notification. Costs one extra day in v1; saves a restructuring project in v2.

### Anti-Pattern 3: Treating the CMS choice as low-stakes because "v1 is just a marketing site"

**What people do:** Reach for the fastest thing (MDX files, or a disconnected SaaS CMS purely for content, with a separate hand-rolled Express/serverless backend "for later") without considering that v3 needs a real backend with auth, roles, and relational data (clients ↔ projects ↔ engineers/contractors).
**Why it's wrong:** Two disconnected systems (a content CMS and a future custom backend) means v3 either lives awkwardly split across two data stores, or requires migrating all v1/v2 content and lead data into a new backend at v3 kickoff — real rework.
**Do this instead:** Choose a CMS that is also a real application backend on day one — e.g., Payload CMS (Next.js-native, installs directly into the app, gives typed Postgres collections, auth, and REST/GraphQL/Local API out of the box). v1 uses it only for Projects/Services/Team/Leads; v3 activates the Users/auth/roles capability that was available the whole time.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Payload CMS (or chosen CMS) | Installed directly into Next.js app (`payload.config.ts`), Local API used from Server Components — no network hop | Next.js-native as of Payload 3.0; owns Postgres schema for content + leads + (later) users |
| Resend (transactional email) | Called from Server Action after successful lead write | Does not handle spam filtering/rate limiting itself — add basic honeypot/rate-limit at the Server Action level |
| Media/CDN (S3, Cloudinary, or CMS-native storage) | Referenced via URL in CMS records, rendered through `next/image` | Critical path for Awwwards-grade visual quality — invest early |
| Analytics (Vercel Analytics / Plausible / GA4) | Client-side snippet in root layout | Not core to architecture, but wire in v1 so v2/v3 have baseline behavioral data on lead sources |
| Deployment (Vercel recommended) | Standard Next.js deploy target; Postgres via Neon/Supabase/Vercel Postgres | ISR/ on-demand revalidation for CMS-driven pages works natively on Vercel |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Motion primitives ↔ Presentation sections | Props/children (React composition), no shared state | Motion layer has zero knowledge of domain data; can be built and Awwwards-polished before any real content exists |
| Presentation ↔ Content layer (CMS) | Server Component fetch at request/build time only; never fetched from client components | Keeps CMS SDK/credentials server-only; presentation components receive plain typed objects |
| Contact form (client) ↔ Server Action | Form submission (progressive enhancement via native `<form action={}>`) | No client-side API key exposure; validation duplicated client (UX) + server (authority) |
| Server Action ↔ Leads data store | Direct write via Payload Local API / ORM | This boundary is the entire v2/v3 integration point — keep it a clean, typed, single-table interface |
| v1 marketing routes ↔ future v3 dashboard routes | Separate route groups, separate layouts, shared DB only | Guarantees v3 dashboard work never requires touching marketing page code or routing |

## Sources

- [The Next.js 15 App Router Project Structure That Scales](https://dev.to/krunal_groovy/the-nextjs-15-app-router-project-structure-that-scales-with-examples-47ha) — MEDIUM confidence, community source, cross-checked against Next.js official route-group conventions
- [Next.js official docs: Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) pattern referenced (marketing vs dashboard route groups is a documented official pattern) — HIGH confidence
- [GSAP + Next.js: useGSAP hook guide](https://medium.com/@ccjayanti/guide-to-using-gsap-scrolltrigger-in-next-js-with-usegsap-c48d6011f04a) — MEDIUM confidence, corroborated by GSAP's own `@gsap/react` package documentation pattern (register plugins once, use `useGSAP` for auto-cleanup)
- [Next.js Smooth Scrolling with Lenis & GSAP guide](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) — MEDIUM confidence
- [Headless CMS Comparison 2026 (Cosmic/Contentful/Strapi/Sanity/Prismic/Hygraph)](https://www.cosmicjs.com/blog/headless-cms-comparison-2026-cosmic-contentful-strapi-sanity-prismic-hygraph) — MEDIUM confidence, community comparison
- [Best headless CMS for Next.js in 2026: Sanity vs Contentful vs Payload vs Storyblok](https://nayankyada.com/blog/best-headless-cms-for-nextjs-in-2026-sanity-vs-contentful-vs-payload-vs-storyblo) — MEDIUM confidence
- [Payload 3.0: The first CMS that installs directly into any Next.js app](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app) — HIGH confidence, official Payload source; core rationale for the "CMS as future backend" recommendation
- [Payload docs: What is Payload](https://payloadcms.com/docs/getting-started/what-is-payload) — HIGH confidence, official docs
- [The Only Guide You Need for Next.js Forms: Server Actions, Zod & Validation (2025)](https://www.deepintodev.com/blog/form-handling-in-nextjs) — MEDIUM confidence, corroborates Server Action + Zod as the standard 2025-2026 pattern
- [Top 10 Next.js Contact Form Backends (2026)](https://splitforms.com/blog/top-10-nextjs-form-backends) — MEDIUM confidence, used to identify the "email-only, no persistence" anti-pattern this project should avoid

---
*Architecture research for: Awwwards-quality Next.js marketing site with staged AI/CRM roadmap*
*Researched: 2026-09-08*
