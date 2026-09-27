import { getServices, type Service } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import {
  DisciplinesSplitSection,
  type DisciplineItem,
} from "./DisciplinesSplitSection";

// Enriched fallback architectural disciplines
const FALLBACK_SERVICES: DisciplineItem[] = [
  {
    slug: "bespoke-new-builds",
    name: "Bespoke New Builds",
    tagline:
      "Generational architecture built from the bedrock up. We craft private residences with monolithic stone, mass timber, and precision structural warranties.",
    image: "/images/client/client-new-build-detail.jpeg",
    features: [
      "RIBA Stages 0–7",
      "10-Year Structural Warranty",
      "JCT Administration",
    ],
  },
  {
    slug: "full-home-renovations",
    name: "Full Home Renovations",
    tagline:
      "Complete internal remodelling, structural transformations, and heritage restoration crafted around modern spatial proportion.",
    image: "/images/client/client-living-room-renovation.jpeg",
    features: [
      "Interior Architecture",
      "Structural Alterations",
      "Bespoke Joinery",
    ],
  },
  {
    slug: "structural-extensions",
    name: "Structural Extensions",
    tagline:
      "Glazed pavilions, timber extensions, and monolithic modern additions that seamlessly bridge indoor spaces with private landscapes.",
    image: "/images/client/client-extension-aerial.jpeg",
    features: [
      "Zinc & Cedar Detailing",
      "Flush-Threshold Glazing",
      "Lightwell Engineering",
    ],
  },
  {
    slug: "barn-conversions",
    name: "Historic Barn Conversions",
    tagline:
      "Conserving rural timber & stone heritage while creating light-filled contemporary living volumes compliant with modern building standards.",
    image: "/images/hero/barn.png",
    features: [
      "Conservation Zoning",
      "Heritage Stone Masonry",
      "Underpinning & Insulation",
    ],
  },
  {
    slug: "architectural-design",
    name: "Architectural Design & BIM",
    tagline:
      "Precision 3D Revit documentation, planning consent submissions, and comprehensive architectural appraisals from concept to handover.",
    image: "/images/hero/Refurbishments.png",
    features: [
      "3D BIM Modeling",
      "Planning Applications",
      "Building Regulations",
    ],
  },
  {
    slug: "basement-developments",
    name: "Subterranean & Basement Architecture",
    tagline:
      "Discreet lightwells, wellness suites, and subterranean living environments delivered with specialist waterproofing and acoustic control.",
    image: "/images/hero/basement.png",
    features: [
      "Waterproofing Systems",
      "Acoustic Engineering",
      "Lightwell Integration",
    ],
  },
  {
    slug: "loft-conversions",
    name: "Bespoke Loft Conversions",
    tagline:
      "Architectural dormers, bespoke roofscapes, and vertical light maximization designed to complement existing building profiles.",
    image: "/images/client/client-loft-bedroom.jpeg",
    features: [
      "Roof Re-engineering",
      "Bespoke Staircases",
      "Zinc & Slate Cladding",
    ],
  },
];

export async function ContinuousServicesTicker() {
  let sanityServices: Service[] = [];
  try {
    sanityServices = await getServices();
  } catch (err) {
    console.error("Failed to load services from Sanity:", err);
  }

  const disciplines: DisciplineItem[] =
    sanityServices.length > 0
      ? sanityServices.map((service, idx) => {
          const fallback = FALLBACK_SERVICES[idx % FALLBACK_SERVICES.length];
          let image = fallback.image;
          if (service.heroImage?.asset?._ref) {
            try {
              image = urlFor(service.heroImage).width(1200).height(800).url();
            } catch {
              // fallback remains
            }
          }
          return {
            slug: service.slug,
            name: service.name,
            tagline: service.summary || fallback.tagline,
            image,
            features:
              service.features && service.features.length > 0
                ? service.features.slice(0, 3)
                : fallback.features,
          };
        })
      : FALLBACK_SERVICES;

  return <DisciplinesSplitSection disciplines={disciplines} />;
}
