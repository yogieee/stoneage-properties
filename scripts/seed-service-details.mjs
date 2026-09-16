// One-off content-fill script for the individual service detail pages.
// Run with:
//   node --env-file=.env.local scripts/seed-service-details.mjs
//
// Patches the 7 services already created by seed-sanity.mjs with heroImage,
// process steps, features, faqs, and metaDescription; tags the 4 seeded
// projects to their matching service(s); and links the 4 expertiseArea
// homepage cards to their matching service. Placeholder copy/photography
// written in-house for launch — the client can edit any of it in Studio.
// Safe to re-run (patch() is idempotent / last-write-wins per field).

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN env vars.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const PUBLIC_DIR = path.resolve(import.meta.dirname, "..", "public");
const uploadedAssets = new Map();

async function uploadImage(relativePath) {
  if (uploadedAssets.has(relativePath)) {
    return uploadedAssets.get(relativePath);
  }
  const filePath = path.join(PUBLIC_DIR, relativePath);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(relativePath),
  });
  const imageField = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
  uploadedAssets.set(relativePath, imageField);
  console.log(`Uploaded ${relativePath} -> ${asset._id}`);
  return imageField;
}

const SEED_ID_PREFIX = "seed-";
const key = () => Math.random().toString(36).slice(2, 10);

const SERVICE_DETAILS = [
  {
    id: `${SEED_ID_PREFIX}service-new-builds`,
    heroImage: "images/hero/newbuilds.png",
    note: {
      line: "Built from the ground up, right the first time.",
      subline: "10-year structural warranty on every new build.",
    },
    metaDescription:
      "New build homes in Solihull, London & Nottingham, delivered under a JCT contract with a 10-year structural warranty. Get a fixed-price quote from Stoneage Properties.",
    process: [
      {
        title: "Initial Consultation & Site Survey",
        detail:
          "We visit your plot to review the site, existing planning history, and your brief, then walk you through what a new build with Stoneage Properties involves from groundworks to handover.",
      },
      {
        title: "Design, Specification & Fixed Quote",
        detail:
          "Our team works with your architect (or ours) to finalise drawings and specification, then issues a clear, itemised quote so there are no surprises once work starts.",
      },
      {
        title: "JCT Contract & Programme",
        detail:
          "Every new build is issued under a formal JCT contract with an agreed programme of works, giving you contractual protection and a realistic timeline before a single brick is laid.",
      },
      {
        title: "On-Site Build & Regular Updates",
        detail:
          "A dedicated contracts manager runs the site day to day, with regular progress updates and direct access to the team throughout groundworks, structure, and fit-out.",
      },
      {
        title: "Handover & 10-Year Warranty",
        detail:
          "On completion you receive full handover documentation, building control sign-off, and a 10-year structural warranty covering the life of the build.",
      },
    ],
    features: [
      "Ground-up construction from groundworks to final fit-out",
      "Formal JCT contract administration",
      "10-year structural warranty",
      "Dedicated contracts manager and single point of contact",
      "Building control liaison and sign-off",
      "Fixed, itemised quotation before work begins",
    ],
    faqs: [
      {
        question: "How much does a new build home cost in Solihull, London, or Nottingham?",
        answer:
          "Cost depends on plot size, specification, and local ground conditions, but most self-build and new build homes we deliver range from £2,000 to £3,500 per square metre. We provide a fixed, itemised quote after the initial site survey so you know the full cost before committing.",
      },
      {
        question: "Do I need planning permission before you can start?",
        answer:
          "Yes — new build work requires full planning permission. If you don't already have consent, we can work alongside your architect or planning consultant to help prepare and submit an application before construction begins.",
      },
      {
        question: "How long does a new build project take?",
        answer:
          "A typical single residential new build takes 9 to 14 months from groundworks to handover, depending on size, specification, and weather. We agree a realistic programme with you as part of the JCT contract before work starts.",
      },
      {
        question: "What does the 10-year structural warranty cover?",
        answer:
          "It covers the structural integrity of the build — foundations, load-bearing walls, and roof structure — for 10 years from completion, giving you the same protection as a new-build warranty from a major housebuilder.",
      },
      {
        question: "Do you build outside Solihull, London, and Nottingham?",
        answer:
          "Our three offices cover the Midlands, London, and the East Midlands, and we regularly take on projects across those regions. Get in touch with your location and we'll confirm whether it falls within our working radius.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-renovations`,
    heroImage: "images/hero/rennovation.png",
    note: {
      line: "Same walls, a space that finally works.",
      subline: "3-year workmanship guarantee on every renovation.",
    },
    metaDescription:
      "Kitchen, bathroom & whole-house renovations in Solihull, London & Nottingham. 3-year workmanship guarantee, clear communication, professional finish.",
    process: [
      {
        title: "Consultation & Design Discussion",
        detail:
          "We visit the property, discuss how you use the space day to day, and talk through layout, material, and budget options before any drawings are produced.",
      },
      {
        title: "Detailed Quote & Material Selection",
        detail:
          "You receive an itemised quote covering labour, materials, and any specialist trades (electrics, plumbing, tiling), with a chance to review and adjust specification before booking a start date.",
      },
      {
        title: "Programme & Site Preparation",
        detail:
          "We agree a start date and working hours around your household, protect adjoining rooms and access routes, and confirm delivery schedules for kitchens, sanitaryware, and finishes.",
      },
      {
        title: "Renovation Works",
        detail:
          "Our tradespeople carry out strip-out, first fix, and second fix in sequence, with our team available for quick, direct communication if anything needs a decision along the way.",
      },
      {
        title: "Snagging & 3-Year Guarantee",
        detail:
          "We walk the finished space with you, resolve any snagging items, and back the completed work with our standard 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Kitchen and bathroom renovations",
      "Whole-house and single-room refurbishment",
      "Structural alterations (removing/adding walls, RSJs)",
      "Electrics, plumbing, and tiling coordinated in-house",
      "3-year workmanship guarantee",
      "Fixed quote with no hidden extras",
    ],
    faqs: [
      {
        question: "How much does a kitchen or bathroom renovation cost?",
        answer:
          "A mid-range kitchen renovation typically runs from £12,000–£28,000 and a bathroom from £6,000–£14,000, depending on layout changes, fittings, and finishes. We give you a fixed, itemised quote after the initial consultation so there's no guesswork.",
      },
      {
        question: "Can I still live in the house during the renovation?",
        answer:
          "In most single-room renovations, yes — we sequence work to keep disruption to a minimum and dust-sheet adjoining areas. For whole-house renovations involving multiple rooms at once, we'll talk through the practicalities with you at the quote stage.",
      },
      {
        question: "How long does a typical renovation take?",
        answer:
          "A kitchen or bathroom renovation usually takes 2 to 4 weeks once started. Whole-house renovations vary more widely, typically 8 to 16 weeks depending on scope — we'll confirm a realistic programme as part of your quote.",
      },
      {
        question: "What does the 3-year workmanship guarantee cover?",
        answer:
          "It covers the quality of our labour and materials for 3 years from completion — so if anything relating to our workmanship needs attention, we return and fix it at no extra cost.",
      },
      {
        question: "Do you handle building regulations for structural work?",
        answer:
          "Yes. If your renovation involves removing a wall or other structural changes, we liaise with building control on your behalf and make sure all necessary sign-off is in place.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-extensions`,
    heroImage: "images/hero/extensionservice.png",
    note: {
      line: "More room, without moving house.",
      subline: "3-year workmanship guarantee on every extension.",
    },
    metaDescription:
      "Single and double storey home extensions in Solihull, London & Nottingham. Kitchen extensions, side returns & wrap-arounds, backed by a 3-year guarantee.",
    process: [
      {
        title: "Site Visit & Feasibility",
        detail:
          "We assess your garden or side-return space, boundary conditions, and existing structure to confirm what's feasible before you commit to design fees.",
      },
      {
        title: "Design, Planning & Building Regs",
        detail:
          "We work with your architect (or ours) on drawings, then handle or support the planning application and building regulations submission, including party wall matters where relevant.",
      },
      {
        title: "Fixed Quote & Programme",
        detail:
          "Once drawings are approved, you receive a fixed, itemised quote and an agreed programme covering groundworks, structure, roofing, and internal finish.",
      },
      {
        title: "Build: Groundworks Through to Fit-Out",
        detail:
          "Our team manages foundations, steelwork, brick or block work, roofing, glazing, and internal finishes in sequence, with regular site updates throughout.",
      },
      {
        title: "Handover & 3-Year Guarantee",
        detail:
          "We complete a full snagging walk-through with you and hand over the finished extension backed by our 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Single and double storey extensions",
      "Kitchen extensions, side returns, and wrap-arounds",
      "Planning application and building regulations support",
      "Party wall agreement coordination",
      "Structural steelwork and roofing",
      "3-year workmanship guarantee",
    ],
    faqs: [
      {
        question: "Do I need planning permission for a home extension?",
        answer:
          "Many single-storey rear extensions qualify under Permitted Development, but this depends on size, boundary distances, and whether your property has existing planning restrictions. We assess this at the feasibility stage and can support a planning application if one's required.",
      },
      {
        question: "How much does a single or double storey extension cost?",
        answer:
          "As a guide, single storey extensions typically run £2,200–£3,000 per square metre and double storey extensions £1,900–£2,700 per square metre, depending on specification. We confirm exact figures with a fixed quote once drawings are finalised.",
      },
      {
        question: "Will I need a party wall agreement?",
        answer:
          "If your extension is near or on a shared boundary with a neighbouring property, a party wall agreement is usually required by law. We coordinate this process on your behalf as part of the build programme.",
      },
      {
        question: "How long does an extension take to build?",
        answer:
          "A single storey extension typically takes 10 to 14 weeks; a double storey extension 14 to 20 weeks, depending on size and weather. We confirm a realistic programme as part of your fixed quote.",
      },
      {
        question: "Can you manage the extension alongside my existing architect?",
        answer:
          "Yes — we regularly work alongside independent architects and designers, taking their approved drawings through planning, building regulations, and construction.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-conversions`,
    heroImage: "images/hero/loft.png",
    note: {
      line: "Unused space, turned into a room you'll live in.",
      subline: "3-year workmanship guarantee on every conversion.",
    },
    metaDescription:
      "Loft, garage, HMO & flat conversions in Solihull, London & Nottingham. Fully compliant, professionally finished conversions backed by a 3-year guarantee.",
    process: [
      {
        title: "Feasibility & Use-Class Check",
        detail:
          "We review the existing structure, head height, and (for HMOs or flats) planning use-class requirements to confirm the conversion is viable before you spend on design.",
      },
      {
        title: "Design & Building Regulations",
        detail:
          "We prepare or work from approved drawings and submit a full building regulations application, including fire safety and means-of-escape requirements for HMOs and multi-unit conversions.",
      },
      {
        title: "Fixed Quote & Programme",
        detail:
          "You receive an itemised quote covering structural work, insulation, services, and finish, along with an agreed start date and programme.",
      },
      {
        title: "Conversion Works",
        detail:
          "Our team carries out structural alterations, insulation, electrics, plumbing, and finishing in sequence, keeping you updated at each key stage.",
      },
      {
        title: "Compliance Sign-Off & 3-Year Guarantee",
        detail:
          "We secure building control completion certificates (and licensing sign-off for HMOs where applicable) and back the finished work with our 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Loft conversions (dormer, hip-to-gable, Velux)",
      "Garage conversions",
      "HMO conversions and licensing compliance",
      "Commercial-to-residential flat conversions",
      "Fire safety and means-of-escape compliance",
      "3-year workmanship guarantee",
    ],
    faqs: [
      {
        question: "Do I need planning permission for a loft or garage conversion?",
        answer:
          "Many loft and garage conversions fall under Permitted Development, but dormer additions, height changes, or conservation-area properties may require full planning permission. We confirm this at the feasibility stage.",
      },
      {
        question: "How much does a loft conversion cost?",
        answer:
          "A Velux loft conversion typically starts around £30,000–£45,000, while a dormer or hip-to-gable conversion with an en-suite runs £50,000–£70,000+, depending on size and specification. We confirm exact costs with a fixed quote.",
      },
      {
        question: "What's involved in converting a property to an HMO?",
        answer:
          "HMO conversions must meet specific fire safety, means-of-escape, and room-size standards, and in most areas require an HMO licence from the local council. We manage the building regulations and compliance side of the conversion so it's ready for licensing.",
      },
      {
        question: "How long does a conversion take?",
        answer:
          "A standard loft or garage conversion typically takes 6 to 10 weeks. HMO and larger flat conversions vary more depending on the number of units and scope of works — we'll confirm a programme as part of your quote.",
      },
      {
        question: "Will a loft conversion need extra structural support?",
        answer:
          "Usually yes — most loft conversions require new steel beams to support the floor and roof alterations. Our team designs and installs this as part of the building regulations package.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-basements`,
    heroImage: "images/hero/basement.png",
    note: {
      line: "Dry, watertight, and built to last below ground.",
      subline: "BS 8102 waterproofing on every basement.",
    },
    metaDescription:
      "Basement construction & conversion in Solihull, London & Nottingham. Specialist waterproofing and structural engineering, backed by a 3-year guarantee.",
    process: [
      {
        title: "Structural & Waterproofing Assessment",
        detail:
          "We assess ground conditions, water table, and the existing structure, and bring in a structural engineer to design underpinning or excavation where needed.",
      },
      {
        title: "Design, Planning & Building Regulations",
        detail:
          "Drawings and a waterproofing design (to BS 8102) are prepared and submitted for planning (where required) and building regulations approval.",
      },
      {
        title: "Fixed Quote & Programme",
        detail:
          "Basement work is priced and programmed in detail given its specialist nature, with clear stage payments tied to excavation, structure, and waterproofing milestones.",
      },
      {
        title: "Excavation, Structure & Waterproofing",
        detail:
          "Our team manages excavation and underpinning, structural work, and a fully specified waterproofing system installed by qualified operatives.",
      },
      {
        title: "Fit-Out, Sign-Off & 3-Year Guarantee",
        detail:
          "Once watertight and structurally signed off, we complete the internal fit-out and back the finished space with our 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Basement excavation and underpinning",
      "Existing basement conversion to habitable space",
      "BS 8102 compliant waterproofing design and installation",
      "Structural engineering coordination",
      "Building regulations and (where needed) planning support",
      "3-year workmanship guarantee",
    ],
    faqs: [
      {
        question: "Do I need planning permission for a basement conversion or dig-out?",
        answer:
          "Converting an existing basement to habitable use often falls under Permitted Development, but a new excavation (a basement dig-out) usually requires full planning permission, particularly in London boroughs with specific basement policies. We confirm this at the assessment stage.",
      },
      {
        question: "How much does basement work cost?",
        answer:
          "Converting an existing, dry basement typically costs £1,200–£2,000 per square metre. A full excavation and underpin (a basement dig-out) is significantly more, typically £3,000–£4,500+ per square metre due to structural and waterproofing requirements. We confirm exact costs after a structural assessment.",
      },
      {
        question: "How do you stop a basement from flooding or damp?",
        answer:
          "We design and install a waterproofing system to BS 8102 standard — typically a combination of tanking, a cavity drain membrane, and a sump pump — specified by our waterproofing designer according to the site's ground conditions.",
      },
      {
        question: "Will a basement dig-out affect my neighbours?",
        answer:
          "Excavation near a shared boundary or a neighbouring property's foundations usually requires a party wall agreement, and in some cases neighbouring structural monitoring during works. We manage this process as part of the project.",
      },
      {
        question: "How long does a basement project take?",
        answer:
          "Converting an existing dry basement typically takes 8 to 12 weeks. A full excavation and underpin project is considerably longer, often 5 to 9 months, given the structural and waterproofing sequencing involved.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-refurbishments`,
    heroImage: "images/hero/Refurbishments.png",
    note: {
      line: "One team, every trade, start to finish.",
      subline: "3-year workmanship guarantee on every refurbishment.",
    },
    metaDescription:
      "Full property refurbishments in Solihull, London & Nottingham — single rooms to whole houses, delivered on time and on budget with a 3-year guarantee.",
    process: [
      {
        title: "Walkthrough & Priority Setting",
        detail:
          "We walk the property with you room by room, discuss your priorities and budget, and agree what's essential versus nice-to-have before pricing begins.",
      },
      {
        title: "Scope, Quote & Specification",
        detail:
          "You receive a clear, itemised quote broken down by room or trade, so you can see exactly what's included and adjust scope before committing.",
      },
      {
        title: "Programme & Trade Coordination",
        detail:
          "We sequence and coordinate all trades — electrics, plumbing, plastering, decorating, flooring — under one point of contact, so you're not managing multiple contractors yourself.",
      },
      {
        title: "Refurbishment Works",
        detail:
          "Work proceeds room by room or in parallel depending on scope, with quick, direct communication if any decisions or variations come up along the way.",
      },
      {
        title: "Final Walkthrough & 3-Year Guarantee",
        detail:
          "We complete a snagging walkthrough together and hand the property over backed by our standard 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Single-room to whole-property refurbishment",
      "All trades coordinated under one point of contact",
      "Rewiring, replumbing, and replastering",
      "Flooring, decorating, and finishing",
      "Landlord and rental-property turnaround refurbishments",
      "3-year workmanship guarantee",
    ],
    faqs: [
      {
        question: "How much does a full property refurbishment cost?",
        answer:
          "A full refurbishment of a 3-bedroom house typically runs £45,000–£90,000+ depending on the extent of works (cosmetic vs. rewiring/replumbing/replastering throughout). We give you a clear, itemised quote after the initial walkthrough.",
      },
      {
        question: "Can you refurbish a property between tenants?",
        answer:
          "Yes — we regularly carry out fast-turnaround refurbishments for landlords between tenancies, working to a tight, agreed timeline to minimise void periods.",
      },
      {
        question: "Do you manage all the trades, or do I need to source them?",
        answer:
          "We coordinate every trade needed — electricians, plumbers, plasterers, decorators, and flooring fitters — under one point of contact, so you deal with a single team rather than managing subcontractors yourself.",
      },
      {
        question: "How long does a whole-house refurbishment take?",
        answer:
          "A full refurbishment typically takes 8 to 16 weeks depending on the size of the property and extent of works. We agree a realistic programme with you before work starts.",
      },
      {
        question: "Can I stay in the property during the refurbishment?",
        answer:
          "For lighter refurbishments, often yes. For refurbishments involving rewiring, replumbing, or replastering throughout, we'd usually recommend the property is vacant — we'll advise honestly at the quote stage based on your specific scope.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-barn-conversions`,
    heroImage: "images/hero/barn.png",
    note: {
      line: "Old timber and stone, made to live in again.",
      subline: "3-year workmanship guarantee on every barn conversion.",
    },
    metaDescription:
      "Barn conversions in Solihull, London & Nottingham that preserve character while meeting modern building standards. 3-year workmanship guarantee.",
    process: [
      {
        title: "Heritage & Structural Survey",
        detail:
          "We survey the existing barn's structure, materials, and any listed or conservation-area status to understand what can be preserved and what needs replacing or reinforcing.",
      },
      {
        title: "Design, Planning & Class Q / Full Permission",
        detail:
          "We work with your architect to design a scheme that balances character retention with modern comfort, and support the planning process — whether under Class Q permitted development or a full planning application.",
      },
      {
        title: "Fixed Quote & Programme",
        detail:
          "You receive a detailed, itemised quote covering structural retention, insulation upgrades, services, and finish, with a realistic programme given the specialist nature of barn structures.",
      },
      {
        title: "Structural Works & Building Envelope",
        detail:
          "Our team carries out structural repairs, insulation, and a weathertight building envelope while retaining original timber frame, stonework, or cladding wherever possible.",
      },
      {
        title: "Fit-Out, Sign-Off & 3-Year Guarantee",
        detail:
          "We complete the internal fit-out, secure building control and (where relevant) listed building sign-off, and back the finished conversion with our 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Structural retention of original timber frame and stonework",
      "Class Q and full planning permission support",
      "Listed building and conservation-area compliance",
      "Insulation and building envelope upgrades to current regulations",
      "Bespoke joinery and character-matched finishes",
      "3-year workmanship guarantee",
    ],
    faqs: [
      {
        question: "Can I convert a barn under permitted development?",
        answer:
          "Agricultural barns can often be converted to residential use under Class Q permitted development rights, which is a faster route than full planning permission — but it comes with specific structural and design conditions. We assess your barn's eligibility at survey stage.",
      },
      {
        question: "How much does a barn conversion cost?",
        answer:
          "Barn conversions typically cost more per square metre than a standard renovation due to structural retention and upgrade work — as a guide, £2,000–£3,200 per square metre depending on the condition of the existing structure and level of finish. We confirm exact costs with a fixed quote after survey.",
      },
      {
        question: "Will I lose the character of the barn during conversion?",
        answer:
          "No — our approach is to retain as much of the original timber frame, brick, or stonework as structurally possible, and design new elements (glazing, joinery) to complement rather than compete with the existing character.",
      },
      {
        question: "How long does a barn conversion take?",
        answer:
          "Most barn conversions take 6 to 10 months, longer than an equivalent new build, due to the structural surveys, careful retention work, and often more involved planning process.",
      },
      {
        question: "Do listed barns need special permission?",
        answer:
          "Yes — if the barn is listed or within a conservation area, you'll need listed building consent in addition to (or instead of) standard planning permission. We coordinate this as part of the design and planning stage.",
      },
    ],
  },
  {
    id: `${SEED_ID_PREFIX}service-kitchens`,
    heroImage: "images/hero/modernkitchen.png",
    note: {
      line: "A kitchen built around how you actually live.",
      subline: "3-year workmanship guarantee on every remodel.",
    },
    metaDescription:
      "Bespoke kitchen remodels in Solihull, London & Nottingham. Design, cabinetry, and fit-out delivered to a professional standard, backed by a 3-year workmanship guarantee.",
    process: [
      {
        title: "Consultation & Layout Design",
        detail:
          "We visit the property, discuss how you use the kitchen day to day, and talk through layout, storage, and workflow options before any drawings are produced.",
      },
      {
        title: "Design, Specification & Fixed Quote",
        detail:
          "You receive a detailed design with cabinetry, worktop, and appliance specification, along with a fixed, itemised quote so there are no surprises once work starts.",
      },
      {
        title: "Trade Coordination & Programme",
        detail:
          "We sequence electrics, plumbing, plastering, and tiling under one point of contact, and agree a start date and programme around your household.",
      },
      {
        title: "Strip-Out & Installation",
        detail:
          "Our team carries out strip-out, first fix, and cabinetry installation in sequence, with quick, direct communication if any decisions come up along the way.",
      },
      {
        title: "Snagging & 3-Year Guarantee",
        detail:
          "We walk the finished kitchen with you, resolve any snagging items, and back the completed work with our standard 3-year workmanship guarantee.",
      },
    ],
    features: [
      "Bespoke cabinetry design and installation",
      "Worktop, splashback, and lighting specification",
      "Integrated appliance coordination",
      "Electrics, plumbing, and tiling coordinated in-house",
      "3-year workmanship guarantee",
      "Fixed quote with no hidden extras",
    ],
    faqs: [
      {
        question: "How much does a kitchen remodel cost?",
        answer:
          "A mid-range kitchen remodel typically runs from £12,000–£28,000 depending on layout changes, cabinetry, and finishes. We give you a fixed, itemised quote after the initial consultation so there's no guesswork.",
      },
      {
        question: "Can I still use my kitchen during the remodel?",
        answer:
          "Once strip-out begins, no — but we sequence the project tightly and can help plan a temporary kitchen setup elsewhere in the house for the duration of the works.",
      },
      {
        question: "How long does a kitchen remodel take?",
        answer:
          "A typical kitchen remodel takes 3 to 5 weeks once started, depending on the extent of layout changes and any structural work involved.",
      },
      {
        question: "Do you handle the electrics and plumbing as well?",
        answer:
          "Yes — we coordinate every trade needed, including electricians and plumbers, under one point of contact, so you deal with a single team rather than managing subcontractors yourself.",
      },
      {
        question: "What does the 3-year workmanship guarantee cover?",
        answer:
          "It covers the quality of our labour and materials for 3 years from completion — so if anything relating to our workmanship needs attention, we return and fix it at no extra cost.",
      },
    ],
  },
];

const PROJECT_SERVICE_TAGS = [
  { projectId: `${SEED_ID_PREFIX}project-festal-house`, serviceIds: [`${SEED_ID_PREFIX}service-renovations`, `${SEED_ID_PREFIX}service-refurbishments`] },
  { projectId: `${SEED_ID_PREFIX}project-meadow-residence`, serviceIds: [`${SEED_ID_PREFIX}service-new-builds`] },
  { projectId: `${SEED_ID_PREFIX}project-bracken-extension`, serviceIds: [`${SEED_ID_PREFIX}service-extensions`, `${SEED_ID_PREFIX}service-renovations`] },
  { projectId: `${SEED_ID_PREFIX}project-grange-conversion`, serviceIds: [`${SEED_ID_PREFIX}service-conversions`] },
];

const EXPERTISE_SERVICE_LINKS = [
  { expertiseId: `${SEED_ID_PREFIX}expertise-interior`, serviceId: `${SEED_ID_PREFIX}service-renovations` },
  { expertiseId: `${SEED_ID_PREFIX}expertise-new-builds`, serviceId: `${SEED_ID_PREFIX}service-new-builds` },
  { expertiseId: `${SEED_ID_PREFIX}expertise-landscape`, serviceId: `${SEED_ID_PREFIX}service-extensions` },
  { expertiseId: `${SEED_ID_PREFIX}expertise-kitchens`, serviceId: `${SEED_ID_PREFIX}service-kitchens` },
];

async function run() {
  console.log(`Patching service details in ${projectId}/${dataset}...\n`);

  for (const detail of SERVICE_DETAILS) {
    const heroImage = await uploadImage(detail.heroImage);
    await client
      .patch(detail.id)
      .set({
        heroImage,
        note: detail.note,
        metaDescription: detail.metaDescription,
        process: detail.process.map((step) => ({ ...step, _type: "processStep", _key: key() })),
        features: detail.features,
        faqs: detail.faqs.map((faq) => ({ ...faq, _type: "faq", _key: key() })),
      })
      .commit();
    console.log(`Patched service ${detail.id}`);
  }

  for (const tag of PROJECT_SERVICE_TAGS) {
    await client
      .patch(tag.projectId)
      .set({
        services: tag.serviceIds.map((id) => ({
          _type: "reference",
          _ref: id,
          _key: key(),
        })),
      })
      .commit();
    console.log(`Tagged project ${tag.projectId} -> ${tag.serviceIds.join(", ")}`);
  }

  for (const link of EXPERTISE_SERVICE_LINKS) {
    await client
      .patch(link.expertiseId)
      .set({ service: { _type: "reference", _ref: link.serviceId } })
      .commit();
    console.log(`Linked expertiseArea ${link.expertiseId} -> ${link.serviceId}`);
  }

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
