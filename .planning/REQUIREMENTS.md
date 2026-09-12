# Requirements: Stoneage Properties — Awwwards-Grade Redesign (v1)

**Defined:** 2026-09-08
**Core Value:** The v1 site must look and feel like an Awwwards-nominated site — premium, smooth, fast — while accurately representing Stoneage Properties' real services and project history.

## v1 Requirements

### Home

- [ ] **HOME-01**: Visitor sees a cinematic hero on the homepage with a scroll-triggered narrative sequence (GSAP + Lenis) that sets brand tone within the first 3-5 seconds
- [ ] **HOME-02**: Visitor sees primary CTAs ("Enquire", "View Projects") persistently accessible from the homepage above the fold

### Portfolio & Case Studies

- [ ] **PORT-01**: Visitor can browse a filterable project gallery/index, filterable by service type (New Build / Renovation / Extension / Conversion)
- [ ] **PORT-02**: Visitor can open an individual case study page for any project, following a consistent structure: hero, brief/challenge, process, before/after (where applicable), outcome, testimonial, CTA
- [ ] **PORT-03**: Case study pages are populated with real project photography and real project history migrated from the current site (House Remodelling Knowle, Residential Roof Solihull, Kitchen Extension Solihull & London, New Build Rugby, etc.)
- [ ] **PORT-04**: Renovation/extension/conversion/basement case studies include a before/after comparison (scroll-scrubbed or draggable slider)
- [ ] **PORT-05**: Each case study ends with an "Enquire about a similar project" CTA leading to the contact form, pre-filled with the relevant service type

### Services

- [ ] **SERV-01**: Visitor can view a dedicated page for each service: New Builds, Renovations, Extensions, Conversions (HMOs, commercial/residential flats, loft, garage), plus Basements, Refurbishments, Barn Conversions
- [ ] **SERV-02**: Each service page displays relevant trust/warranty content (e.g. JCT contract + 10-year structural warranty for New Builds, 3-year workmanship guarantee for Extensions)

### About

- [ ] **ABOUT-01**: Visitor can view an About/team page featuring the company's 30+ years combined experience story and real team photos (no stock imagery)

### Contact & Conversion

- [ ] **CONT-01**: Visitor can submit a contact/enquiry form (modeled on Storey Architecture's intake pattern) with fields: name, email, project type, location, timeline, and an open message field
- [ ] **CONT-02**: Visitor can select or indicate which office (Solihull HQ, London, Nottingham) is relevant to their enquiry
- [ ] **CONT-04**: Visitor sees a response-time expectation near the form (e.g. "We respond within 1 business day") to increase completion confidence
- [ ] **CONT-05**: Visitor sees testimonials and trust signals (warranties, certifications) positioned near the contact form, not only on the About page

### Trust & Social Proof

- [ ] **TRUST-01**: Visitor can see client testimonials tied to specific case studies (not a generic testimonial wall)
- [ ] **TRUST-02**: Visitor can see the company's warranty/certification credentials (JCT contract, 10yr structural warranty, 3yr workmanship guarantee) prominently, not buried

### Motion & Interaction Design

- [ ] **MOTION-01**: Headings and key content sections use text reveal animations (mask/clip-path/split-text) consistent with the bold editorial typography direction
- [ ] **MOTION-02**: Primary CTA buttons use magnetic/hover micro-interactions
- [x] **MOTION-03**: Site uses a monochrome/neutral design system with bold editorial typography, consistent with the Storey Architecture and Kononenko Architectural Bureau design references

### Engineering Baseline

- [ ] **ENG-01**: Site is built mobile-first with a performance budget enforced from day one (Core Web Vitals: LCP, CLS, INP within Google's "Good" thresholds on mobile)
- [x] **ENG-02**: All scroll/motion effects respect `prefers-reduced-motion`, with a reduced-motion fallback built into the animation system (not retrofitted)
- [ ] **ENG-03**: Site has SEO metadata, OpenGraph tags, and LocalBusiness structured data (JSON-LD) matching the business's real NAP (name/address/phone) across all three offices
- [x] **ENG-04**: Core marketing content (services, contact info, case study text) is server-rendered/indexable, not locked behind client-only JavaScript
- [ ] **ENG-05**: Site is fully responsive across mobile, tablet, and desktop breakpoints

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Backend (CMS & Lead Persistence)

- **CMS-01**: Client can update project case studies, services content, and team info themselves via a CMS (backend TBD — AWS/Terraform-based, not Sanity) without developer involvement
- **CONT-03**: Contact form submissions are persisted to a real `leads` database record (not email-only), so AI qualification and CRM can build on this data without a rewrite

### AI Lead Generation

- **AI-01**: AI-driven lead qualification on top of the persisted `leads` data
- **AI-02**: AI chat/assistant for visitor Q&A
- **AI-03**: AI-driven project-type matching or estimation assistance

### Motion Polish (v1.x candidates, not launch-blocking)

- **POLISH-01**: Page transition choreography across routes (home→project, project→project)
- **POLISH-02**: Custom contextual cursor (hero/gallery zones only)
- **POLISH-03**: Editorial "journal"/insights content section
- **POLISH-04**: Region-specific landing pages with local project curation per office
- **POLISH-05**: Subtle WebGL/shader accent on hero (1-2 tasteful touches only)

## v3 Requirements

### CRM

- **CRM-01**: Manage clients (lead → client lifecycle, built on the `leads` data model from CONT-03)
- **CRM-02**: Manage engineers (assignment, scheduling)
- **CRM-03**: Manage contractors (assignment, scheduling)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full-scene WebGL/Three.js sitewide | Massive bundle size, mobile battery/thermal drain, accessibility risk — directly hurts the mobile lead-conversion audience this site depends on |
| Autoplay sound / background audio | Universally disliked, triggers bounce, conflicts with browser autoplay policies |
| Mandatory unskippable intro/loading animation | Hurts repeat visitors and mobile users on data connections; conflicts with lead-gen goal |
| Horizontal scroll for primary site navigation | Disorients users, breaks accessibility and back-button expectations |
| Long qualification forms (10+ fields, budget ranges, uploads upfront) | Each added field measurably drops form completion; detailed qualification happens post-lead |
| Custom cursor replacing native cursor on forms/body text | Degrades usability and accessibility on the exact elements that matter for conversion |
| Stock photography | Undermines the "real people, real local projects" trust signal that construction buyers specifically look for |
| Chatbot/AI assistant in v1 | Explicitly deferred to v2 per project milestones |
| CRM features (client/engineer/contractor management) in v1 | Explicitly deferred to v3 per project milestones |
| Infinite/auto-advancing carousels | Interrupts reading, accessibility issue (WCAG 2.2.2) |
| Indiscriminate parallax across every section | Motion fatigue, vestibular-disorder risk, performance cost; scroll storytelling reserved for 2-3 high-value moments |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MOTION-03 | Phase 1 | Complete |
| ENG-02 | Phase 1 | Complete |
| ENG-04 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Pending |
| HOME-02 | Phase 2 | Pending |
| SERV-01 | Phase 2 | Pending |
| SERV-02 | Phase 2 | Pending |
| ABOUT-01 | Phase 2 | Pending |
| MOTION-01 | Phase 2 | Pending |
| MOTION-02 | Phase 2 | Pending |
| TRUST-02 | Phase 2 | Pending |
| ENG-05 | Phase 2 | Pending |
| PORT-01 | Phase 3 | Pending |
| PORT-02 | Phase 3 | Pending |
| PORT-03 | Phase 3 | Pending |
| PORT-04 | Phase 3 | Pending |
| PORT-05 | Phase 3 | Pending |
| TRUST-01 | Phase 3 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 4 | Pending |
| ENG-01 | Phase 5 | Pending |
| ENG-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓
- Deferred to v2 during Phase 1 execution: CMS-01, CONT-03 (see v2 Requirements → Backend)

---
*Requirements defined: 2026-09-08*
*Last updated: 2026-09-08 after roadmap creation (5-phase structure, full coverage)*
