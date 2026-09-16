// One-off content seed script. Run with:
//   node --env-file=.env.local scripts/seed-sanity.mjs
//
// Populates the Sanity dataset from the content that used to be hardcoded
// in the Next.js codebase (src/content/*.ts, and the section components'
// const arrays) before the Sanity CMS migration. Safe to re-run: it
// deletes any documents it previously created (tracked by a fixed _id
// prefix) before recreating them, so it won't duplicate on a second run.

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

const SERVICES = [
  {
    _id: `${SEED_ID_PREFIX}service-new-builds`,
    _type: "service",
    name: "New Builds",
    slug: { _type: "slug", current: "new-builds" },
    summary:
      "Ground-up residential and commercial construction, contract-backed and structurally warranted.",
    description:
      "From first foundations to final finish, we deliver new build projects across Solihull, London, and Nottingham with the rigour of a formal JCT contract at every stage. Over 30 years of combined experience means every build is planned for value, communicated clearly, and executed to a professional standard from groundworks through to handover.",
    warranty: {
      label: "JCT Contract + 10-Year Structural Warranty",
      detail:
        "Every new build is delivered under a formal JCT contract and backed by a 10-year structural warranty, giving you contractual and structural protection for the life of the build.",
    },
    order: 1,
  },
  {
    _id: `${SEED_ID_PREFIX}service-renovations`,
    _type: "service",
    name: "Renovations",
    slug: { _type: "slug", current: "renovations" },
    summary:
      "Kitchens, bathrooms, and room additions renovated to a professional, lasting standard.",
    description:
      "Whether it's a kitchen, bathroom, or a wider room addition, our renovation work is handled with the same attention to detail as a full new build. We work closely with homeowners to keep communication quick and straightforward, delivering renovations that add lasting value to the property.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "Every project is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
    },
    order: 2,
  },
  {
    _id: `${SEED_ID_PREFIX}service-extensions`,
    _type: "service",
    name: "Extensions",
    slug: { _type: "slug", current: "extensions" },
    summary:
      "Single and double storey extensions, backed by our workmanship guarantee.",
    description:
      "We design and build single and double storey extensions that extend both the space and the value of a property. From planning through to the final finish, our extension projects are managed for quality, value for money, and minimal disruption to the household.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "All extension work is covered by a 3-year workmanship guarantee, giving homeowners confidence in the quality and durability of the build.",
    },
    order: 3,
  },
  {
    _id: `${SEED_ID_PREFIX}service-conversions`,
    _type: "service",
    name: "Conversions",
    slug: { _type: "slug", current: "conversions" },
    summary:
      "HMOs, commercial and residential flat conversions, loft and garage conversions.",
    description:
      "Our conversion work spans HMOs, commercial and residential flat conversions, loft conversions, and garage conversions. Each conversion is treated as its own specialist project, converting underused space into fully functional, professionally finished rooms that meet the relevant building standards.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "Every project is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
    },
    order: 4,
  },
  {
    _id: `${SEED_ID_PREFIX}service-basements`,
    _type: "service",
    name: "Basements",
    slug: { _type: "slug", current: "basements" },
    summary:
      "Basement construction and conversion, engineered for long-term structural integrity.",
    description:
      "Basement projects demand specialist waterproofing and structural expertise. We deliver basement construction and conversions with the same professional, value-for-money approach as our above-ground work, turning below-ground space into usable, comfortable rooms.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "Every project is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
    },
    order: 5,
  },
  {
    _id: `${SEED_ID_PREFIX}service-refurbishments`,
    _type: "service",
    name: "Refurbishments",
    slug: { _type: "slug", current: "refurbishments" },
    summary:
      "Full property refurbishments delivered with quick communication and professional expertise.",
    description:
      "From single rooms to whole-property refurbishments, we manage every stage of the works with clear, quick communication. Our refurbishment projects are built around the client's priorities, delivering a professional finish on time and on budget.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "Every project is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
    },
    order: 6,
  },
  {
    _id: `${SEED_ID_PREFIX}service-barn-conversions`,
    _type: "service",
    name: "Barn Conversions",
    slug: { _type: "slug", current: "barn-conversions" },
    summary:
      "Barn conversions that balance character preservation with modern building standards.",
    description:
      "Converting a barn into a modern, comfortable home requires a careful balance between preserving character and meeting current building regulations. Our barn conversion projects draw on decades of specialist contracting experience to deliver both.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "Every project is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
    },
    order: 7,
  },
  {
    _id: `${SEED_ID_PREFIX}service-kitchens`,
    _type: "service",
    name: "Modern Kitchen Remodeling",
    slug: { _type: "slug", current: "kitchens" },
    summary:
      "Bespoke kitchen remodels designed and fitted to a professional, lasting standard.",
    description:
      "We design and build bespoke kitchen remodels that balance everyday practicality with a considered, modern finish. From layout and cabinetry through to worktops, lighting, and appliance integration, every kitchen is planned around how you actually use the space and delivered with the same attention to detail as a full renovation.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "Every kitchen remodel is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
    },
    order: 8,
  },
];

// NOTE: seed-sanity.mjs's run() uses createOrReplace() on the full SERVICES
// and EXPERTISE_AREAS documents, which would wipe fields patched in later by
// seed-service-details.mjs and add-kitchen-service.mjs (heroImage, process,
// features, faqs, note, and the expertiseArea "service" reference). Once a
// dataset has been through those later scripts, do not re-run this script's
// run() against it — it's kept here as the from-scratch bootstrap for a new,
// empty dataset.

const TEAM = [
  {
    _id: `${SEED_ID_PREFIX}team-founding-director`,
    _type: "teamMember",
    name: "Founding Director",
    role: "Director & Founder",
    bio: "Leads Stoneage Properties' delivery across new builds, renovations, extensions, and conversions, drawing on 30+ years of combined industry experience across the Solihull, London, and Nottingham offices.",
    order: 1,
  },
  {
    _id: `${SEED_ID_PREFIX}team-contracts-manager`,
    _type: "teamMember",
    name: "Contracts Manager",
    role: "Contracts & Site Management",
    bio: "Oversees JCT contract administration and on-site delivery, ensuring every project is backed by structural warranties and run to professional, transparent standards.",
    order: 2,
  },
  {
    _id: `${SEED_ID_PREFIX}team-client-liaison`,
    _type: "teamMember",
    name: "Client Liaison",
    role: "Client Relations",
    bio: "The first point of contact for prospective clients, focused on the company's founding values of value for money, quick communication, and professional expertise.",
    order: 3,
  },
];

const PROJECTS = [
  {
    _id: `${SEED_ID_PREFIX}project-festal-house`,
    title: "Festal House Remodelling",
    slug: "festal-house-remodelling",
    location: "Knowle, Solihull",
    category: "Full Renovation & Remodelling",
    imagePath: "images/projects/project-1.webp",
    order: 1,
    featured: true,
  },
  {
    _id: `${SEED_ID_PREFIX}project-meadow-residence`,
    title: "Meadow Contemporary Residence",
    slug: "meadow-contemporary-residence",
    location: "Rugby, Warwickshire",
    category: "New Build — JCT Contract & 10yr Warranty",
    imagePath: "images/projects/project-2.webp",
    order: 2,
    featured: true,
  },
  {
    _id: `${SEED_ID_PREFIX}project-bracken-extension`,
    title: "Bracken Kitchen & Living Extension",
    slug: "bracken-kitchen-living-extension",
    location: "Solihull & London",
    category: "Single & Double Storey Extension",
    imagePath: "images/projects/project-3.jpg",
    order: 3,
    featured: true,
  },
  {
    _id: `${SEED_ID_PREFIX}project-grange-conversion`,
    title: "Grange Change of Use Conversion",
    slug: "grange-change-of-use-conversion",
    location: "Radcliffe on Trent, Nottingham",
    category: "Commercial to Residential Conversion",
    imagePath: "images/projects/project-4.webp",
    order: 4,
    featured: true,
  },
];

const TESTIMONIALS = [
  {
    _id: `${SEED_ID_PREFIX}testimonial-david-shoreman`,
    quote:
      "Stoneage brought a level of clarity and structural intention to the project that completely changed how we experienced our home. From planning through to final handover, the execution was flawless.",
    author: "David Shoreman",
    role: "RESIDENTIAL NEW BUILD — SOLIHULL",
    imagePath: "images/projects/project-2.webp",
    order: 1,
  },
  {
    _id: `${SEED_ID_PREFIX}testimonial-leah-morrison`,
    quote:
      "The process felt exceptionally clear from beginning to end, and every decision elevated both function and atmosphere in our home. Their JCT contract administration provided complete peace of mind.",
    author: "Leah Morrison",
    role: "FULL REMODELLING — KNOWLE",
    imagePath: "images/projects/project-1.webp",
    order: 2,
  },
  {
    _id: `${SEED_ID_PREFIX}testimonial-jamie-caldwell`,
    quote:
      "Stoneage translated our goals into a calm, refined environment that balances material warmth with modern restraint beautifully. The workmanship on the cedar and zinc details is world-class.",
    author: "Jamie Caldwell",
    role: "KITCHEN & LIVING EXTENSION — LONDON",
    imagePath: "images/projects/project-3.jpg",
    order: 3,
  },
  {
    _id: `${SEED_ID_PREFIX}testimonial-ariana-holt`,
    quote:
      "Every stage was collaborative and thoughtful, resulting in a building that feels effortless to live in while remaining distinctly engineered. We could not recommend their specialist team more highly.",
    author: "Ariana Holt",
    role: "ROOF CONVERSION — NOTTINGHAM",
    imagePath: "images/projects/project-4.webp",
    order: 4,
  },
];

const HERO_SLIDES = [
  {
    _id: `${SEED_ID_PREFIX}hero-exterior`,
    imagePath: "images/hero/exterior.png",
    alt: "Contemporary Stoneage residential home cantilevered over private landscaped gardens",
    tag: "Exterior Architecture",
    title: "Contemporary Residential Exteriors",
    caption:
      "Stoneage designs contemporary homes and striking exterior architecture that prioritises clarity, material honesty, and enduring craftsmanship throughout.",
    order: 1,
  },
  {
    _id: `${SEED_ID_PREFIX}hero-extension`,
    imagePath: "images/hero/extension.png",
    alt: "Solihull pavilion residence with glazed and timber architectural extension",
    tag: "Bespoke Extensions",
    title: "Timber & Glazed Pavilions",
    caption:
      "Stoneage crafts bespoke extensions that seamlessly connect indoor spaces with private gardens, balancing natural light, proportion, and modern living effortlessly.",
    order: 2,
  },
  {
    _id: `${SEED_ID_PREFIX}hero-construction`,
    imagePath: "images/hero/construction.png",
    alt: "Specialist structural construction and precision engineering on site",
    tag: "Specialist Construction",
    title: "Structural Craft & On-Site Precision",
    caption:
      "Stoneage oversees every stage of structural construction with dedicated on-site craft, rigorous engineering standards, and dependable JCT contract administration.",
    order: 3,
  },
  {
    _id: `${SEED_ID_PREFIX}hero-oldtonew`,
    imagePath: "images/hero/oldtonew.png",
    alt: "Heritage stone and brick property transformed into modern open-plan living",
    tag: "Old to New Transformations",
    title: "Heritage Reimagining & Renewal",
    caption:
      "Stoneage bridges past and future by breathing new life into historic structures, turning heritage properties into light-filled, enduring contemporary homes.",
    order: 4,
  },
];

const EXPERTISE_AREAS = [
  {
    _id: `${SEED_ID_PREFIX}expertise-interior`,
    number: "1",
    title: "Interior Atmosphere & Renovation",
    description:
      "We design and deliver contemporary home transformations shaped through clarity, proportion, and long-term living, creating spaces that feel calm, functional, and deeply connected to their surroundings.",
    imagePath: "images/corridor.png",
    order: 1,
  },
  {
    _id: `${SEED_ID_PREFIX}expertise-new-builds`,
    number: "2",
    title: "Contemporary New Builds",
    description:
      "Our new build residences focus on material honesty, natural light, and structural precision, balancing warmth and simplicity to create considered living environments backed by JCT contracts and 10-year structural warranties.",
    imagePath: "images/newbuild.png",
    order: 2,
  },
  {
    _id: `${SEED_ID_PREFIX}expertise-landscape`,
    number: "3",
    title: "Landscape Integration & Extensions",
    description:
      "Each extension and conversion is developed in response to its setting, connecting architecture, landscape, and outdoor living into one cohesive experience with a 3-year workmanship guarantee.",
    imagePath: "images/exten.png",
    order: 3,
  },
  {
    _id: `${SEED_ID_PREFIX}expertise-kitchens`,
    number: "4",
    title: "Bespoke Kitchens & Living Architecture",
    description:
      "We design custom kitchen environments and open-plan spatial arrangements where bespoke joinery, tactile natural materials, and culinary ergonomics combine seamlessly.",
    imagePath: "images/kitchen.png",
    order: 4,
  },
];

// Full article bodies + hero "note" fields live in
// write-journal-content.mjs (patch-based, run after this script). The
// excerpts below are kept in sync with that script for documentation, but
// this script's createOrReplace() would wipe body/note if re-run against a
// dataset that's already been through write-journal-content.mjs — see the
// SERVICES warning above; the same caution applies here.
const JOURNAL_ARTICLES = [
  {
    _id: `${SEED_ID_PREFIX}journal-long-term-living`,
    title: "Designing for Long-Term Living Rather Than Trends",
    slug: "designing-for-long-term-living-rather-than-trends",
    imagePath: "images/livingroom.png",
    excerpt:
      "Interior trends move in cycles measured in seasons. A well-built home has to hold up for decades. Here's how we design for the second decade of ownership, not the first six months.",
    order: 1,
  },
  {
    _id: `${SEED_ID_PREFIX}journal-material-honesty`,
    title: "The Role of Material Honesty in Residential Architecture",
    slug: "the-role-of-material-honesty-in-residential-architecture",
    imagePath: "images/staircase.png",
    excerpt:
      "Timber that looks like timber. Brick that's allowed to read as brick. Why letting materials express their true nature — rather than disguising them — produces homes that age with dignity instead of just getting old.",
    order: 2,
  },
  {
    _id: `${SEED_ID_PREFIX}journal-openness-privacy`,
    title: "Balancing Openness, Privacy, and Everyday Comfort",
    slug: "balancing-openness-privacy-and-everyday-comfort",
    imagePath: "images/plan.png",
    excerpt:
      "Open-plan living solved one problem and created another: how do you stay connected as a household without losing anywhere quiet to retreat to? Notes on planning layouts that feel open without sacrificing privacy.",
    order: 3,
  },
  {
    _id: `${SEED_ID_PREFIX}journal-home-landscape`,
    title: "Creating a Stronger Connection Between Home and Landscape",
    slug: "creating-a-stronger-connection-between-home-and-landscape",
    imagePath: "images/garden.png",
    excerpt:
      "The line between indoors and outdoors has become one of the most valuable decisions in a home extension. Exploring how extensions, glazing, and level changes can dissolve that boundary rather than just decorate it.",
    order: 4,
  },
];

const SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  email: "enquiries@stoneageproperties.com",
  phones: [
    { _key: "solihull", label: "Solihull HQ", number: "0121 537 8229" },
    { _key: "mobile-1", label: "Mobile", number: "07720 965 010" },
    { _key: "mobile-2", label: "Mobile", number: "07948 503 957" },
  ],
  offices: [
    {
      _key: "solihull",
      name: "Solihull HQ",
      address: "20 Micklehill Drive, Shirley, Solihull, B90 2PU",
    },
    {
      _key: "london",
      name: "London",
      address: "1 Colegrave Road, E15 1DZ",
    },
    {
      _key: "nottingham",
      name: "Nottingham",
      address: "12 Northfield Ave, Radcliffe on Trent, NG12 2HX",
    },
  ],
};

async function seedDocumentsNeedingImage(items, buildDoc) {
  for (const item of items) {
    const image = await uploadImage(item.imagePath);
    const doc = buildDoc(item, image);
    await client.createOrReplace(doc);
    console.log(`Seeded ${doc._type} ${doc._id}`);
  }
}

async function run() {
  console.log(`Seeding project ${projectId}/${dataset}...\n`);

  for (const doc of SERVICES) {
    await client.createOrReplace(doc);
    console.log(`Seeded service ${doc._id}`);
  }

  for (const doc of TEAM) {
    await client.createOrReplace(doc);
    console.log(`Seeded teamMember ${doc._id}`);
  }

  await seedDocumentsNeedingImage(PROJECTS, (item, image) => ({
    _id: item._id,
    _type: "project",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    location: item.location,
    category: item.category,
    image,
    featured: item.featured,
    order: item.order,
  }));

  await seedDocumentsNeedingImage(TESTIMONIALS, (item, image) => ({
    _id: item._id,
    _type: "testimonial",
    quote: item.quote,
    author: item.author,
    role: item.role,
    image,
    order: item.order,
  }));

  await seedDocumentsNeedingImage(HERO_SLIDES, (item, image) => ({
    _id: item._id,
    _type: "heroSlide",
    image,
    alt: item.alt,
    tag: item.tag,
    title: item.title,
    caption: item.caption,
    order: item.order,
  }));

  await seedDocumentsNeedingImage(EXPERTISE_AREAS, (item, image) => ({
    _id: item._id,
    _type: "expertiseArea",
    number: item.number,
    title: item.title,
    description: item.description,
    image,
    order: item.order,
  }));

  await seedDocumentsNeedingImage(JOURNAL_ARTICLES, (item, image) => ({
    _id: item._id,
    _type: "journalArticle",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    image,
    excerpt: item.excerpt,
    order: item.order,
  }));

  await client.createOrReplace(SITE_SETTINGS);
  console.log(`Seeded siteSettings`);

  console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
