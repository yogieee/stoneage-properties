# Stoneage Properties — Awwwards-Grade Redesign

## What This Is

A complete rebuild of stoneageproperties.com — a UK specialist building contractor (new builds, renovations, extensions, conversions) with offices in Solihull, London, and Nottingham, and 30+ years of combined experience. The current site is a generic, dated contractor site that undersells the company's credibility (JCT contracts, structural warranties, real project history). This project rebuilds it in Next.js to Awwwards-nomination quality: cinematic scroll storytelling, smooth transitions, bold editorial typography — a portfolio site a specialist contractor can point prospective high-value clients to with pride.

Delivered in three milestones:
- **v1** — Full visual/UX redesign as a marketing site (this milestone)
- **v2** — AI integration for lead generation (deferred)
- **v3** — CRM features to manage clients, engineers, and contractors (deferred)

## Core Value

The v1 site must look and feel like an Awwwards-nominated site — premium, smooth, fast — while accurately representing Stoneage Properties' real services and project history, because a contractor competing on trust and craftsmanship loses high-value leads the moment the site feels generic or dated.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Cinematic home page with hero and scroll-driven storytelling
- [ ] Project portfolio/gallery with individual project case study pages
- [ ] About/team page (company story, 30+ years experience, philosophy)
- [ ] Services page covering New Builds, Renovations, Extensions, Conversions (plus Basements, Refurbishments, Barn Conversions)
- [ ] Contact/inquiry page with multi-office info (Solihull HQ, London, Nottingham) and enquiry form
- [ ] Monochrome/neutral design system with bold editorial typography (per design references)
- [ ] GSAP-driven scroll and micro-interaction animations, smooth page transitions
- [ ] Fully responsive across devices
- [ ] Built on Next.js

### Out of Scope

- AI lead-gen integration (chatbot, lead scoring, intelligent forms) — deferred to v2, not part of this milestone
- CRM features (client/engineer/contractor management) — deferred to v3, not part of this milestone
- Real-time booking/scheduling systems — not mentioned as a v1 need
- E-commerce/payment processing — not relevant to a contractor lead-gen site

## Context

**Current site (stoneageproperties.com) structure and content, used as the factual baseline for this redesign:**

- Nav: Home, About, Services (New Builds, Renovations, Extensions, Conversions), Work, Contact Us
- Tagline: "Specialist Contractors for Building Projects" — "over 30 years of combined experience," emphasis on value for money, quick communication, professional expertise
- Services:
  - New Builds — JCT contract, 10-year structural warranty
  - Renovations — kitchens, bathrooms, room additions
  - Extensions — single/double storey, 3-year workmanship guarantee
  - Conversions — HMOs, commercial/residential flats, loft, garage
  - Also: Basements, Refurbishments, Barn Conversions
- Past projects (to become portfolio case studies): House Remodelling (Knowle), Residential Roof (Solihull), Change of Use Roof (Nottingham), Kitchen Extension (Solihull & London), New Build (Rugby), House Refurbishment, Loft Conversion, Rear Extension, Residential Roofing, Basement work
- Offices: Solihull HQ (20 Micklehill Drive, Shirley, Solihull, B90 2PU), London (1 Colegrave Road, E15 1DZ), Nottingham (12 Northfield Ave, Radcliffe on Trent, NG12 2HX)
- Contact: 0121 537 8229, 07720 965 010, 07948 503 957, enquiries@stoneageproperties.com; social: Facebook, YouTube, LinkedIn, Instagram, WhatsApp
- Also has a Privacy Policy page and individual project case study pages

**Design references supplied by user (both converge on the same direction):**
- awwwards.com/sites/storey-architecture — calm, minimal, editorial; neutral/natural palette; GSAP + parallax microinteractions; content-led, spacious hierarchy
- awwwards.com/sites/kononenko-architectural-bureau — stark black/white two-color system, bold typography, immersive hover interactions, video accents, minimalist precision

Synthesized direction: **minimal, monochrome/neutral palette, bold editorial type, GSAP-driven scroll/parallax motion, imagery-led layout that lets project photography dominate.**

Real content (copy, project photos) will be gathered from the live site and the client as work proceeds — this is a live client redesign, not a from-scratch concept.

## Constraints

- **Tech stack**: Next.js, required — client wants a modern, high-performance React framework as the foundation for both v1 and later AI/CRM milestones.
- **Motion quality**: Must feel Awwwards-caliber — smooth scroll (Lenis/GSAP ScrollTrigger or equivalent), not generic CSS transitions.
- **Content accuracy**: This is a real client's business — services, warranties, and locations must be represented accurately, not fabricated.
- **Phased delivery**: v2 (AI) and v3 (CRM) depend on v1's architecture but are separate milestones — v1 should not be over-engineered to anticipate them, but shouldn't paint the codebase into a corner either.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use current live site as content/structure baseline | Real client, real business — avoid inventing services/offices/warranties that don't exist | — Pending |
| Design direction: minimal, monochrome, bold type, GSAP motion | Matches both Awwwards references the user pointed to | — Pending |
| Next.js as the framework | Explicitly requested by user, supports future AI/CRM milestones | — Pending |
| Three-milestone structure (redesign → AI lead-gen → CRM) | User's own phasing; keeps v1 scope focused on the marketing site | — Pending |
| No CMS in v1 — content is hardcoded in the Next.js codebase | Tried Sanity in Phase 1, then decided the client wants a self-built AWS/Terraform backend instead of a third-party CMS. That backend is real infra work deserving its own milestone, not something to rush into Phase 1. v1 ships as a static/hardcoded-content site; CMS-01 moves to v2. | Superseded 2026-09-08 |
| Contact form does not persist to a database in v1 (email/log only) | Same reasoning as above — the `leads` backend is part of the v2 AWS/Terraform buildout, not v1. CONT-03 moves to v2. | Superseded 2026-09-08 |

---
*Last updated: 2026-09-08 after initialization*
