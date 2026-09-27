import {
  getFeaturedProjects,
  getProjects,
  type Project,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import {
  ProjectsHorizontalScroll,
  type ProjectItem,
} from "./ProjectsHorizontalScroll";

const FALLBACK_PRIMARY_PROJECTS: ProjectItem[] = [
  {
    slug: "festal-house-remodelling",
    title: "Festal House Remodelling",
    location: "Knowle, Solihull",
    category: "Full Renovation & Remodelling",
    imageUrl: "/images/projects/project-1.webp",
    summary:
      "A complete structural renovation and contemporary interior reconfiguration. We balanced tactile natural stone, bespoke dark oak cabinetry, and expansive glass apertures to create enduring spatial warmth.",
  },
  {
    slug: "meadow-contemporary-residence",
    title: "Meadow Contemporary Residence",
    location: "Rugby, Warwickshire",
    category: "New Build — JCT Contract & 10yr Warranty",
    imageUrl: "/images/projects/project-2.webp",
    summary:
      "A monolithic private residence crafted from local sandstone and structural mass timber. Backed by rigorous JCT contract administration and a 10-year structural warranty.",
  },
  {
    slug: "bracken-kitchen-living-extension",
    title: "Bracken Kitchen & Living Extension",
    location: "Solihull & London",
    category: "Single & Double Storey Extension",
    imageUrl: "/images/projects/project-3.jpg",
    summary:
      "Open-plan culinary living space opening out onto private landscaped gardens. Featuring structural steel framing, flush-threshold zinc sliding doors, and seamless indoor-outdoor transitions.",
  },
  {
    slug: "grange-change-of-use-conversion",
    title: "Grange Change of Use Conversion",
    location: "Radcliffe on Trent, Nottingham",
    category: "Commercial to Residential Conversion",
    imageUrl: "/images/projects/project-4.webp",
    summary:
      "Transforming a historic brick utility building into an airy, high-ceilinged modern family home. Preserved heritage brickwork paired with high-performance acoustic and thermal envelopes.",
  },
];

const FALLBACK_REMAINING_PROJECTS: ProjectItem[] = [
  {
    slug: "bracken-kitchen-living-extension",
    title: "The Pavilion & Glazed Extension",
    location: "Solihull, West Midlands",
    category: "Bespoke Glazed Extensions",
    imageUrl: "/images/exten.png",
  },
  {
    slug: "festal-house-remodelling",
    title: "Lapworth Heritage Barn Renewal",
    location: "Lapworth, Warwickshire",
    category: "Barn Conversion & Masonry",
    imageUrl: "/images/corridor.png",
  },
  {
    slug: "meadow-contemporary-residence",
    title: "Warwickshire Country Residence",
    location: "Warwickshire",
    category: "Contemporary New Build",
    imageUrl: "/images/newbuild.png",
  },
  {
    slug: "grange-change-of-use-conversion",
    title: "Bespoke Open-Plan Living & Joinery",
    location: "Solihull HQ",
    category: "Interior Architecture & Kitchens",
    imageUrl: "/images/kitchen.png",
  },
];

export async function FeaturedProjectsGrid() {
  let allProjects: Project[] = [];
  try {
    const featured = await getFeaturedProjects();
    allProjects = featured.length >= 4 ? featured : await getProjects();
  } catch (err) {
    console.error("Failed to fetch projects from Sanity:", err);
  }

  const mapProject = (proj: Project, fallbackImg: string): ProjectItem => {
    let imageUrl = fallbackImg;
    if (proj.image?.asset?._ref) {
      try {
        imageUrl = urlFor(proj.image).width(1200).height(825).url();
      } catch {
        // fallback
      }
    }
    return {
      slug: proj.slug,
      title: proj.title,
      location: proj.location || "Solihull, West Midlands",
      category: proj.category || "Residential Architecture",
      imageUrl,
      summary: proj.summary,
    };
  };

  const primaryProjects: ProjectItem[] =
    allProjects && allProjects.length >= 4
      ? allProjects.slice(0, 4).map((p, i) =>
          mapProject(p, FALLBACK_PRIMARY_PROJECTS[i % FALLBACK_PRIMARY_PROJECTS.length].imageUrl)
        )
      : FALLBACK_PRIMARY_PROJECTS;

  const rawRemaining = allProjects && allProjects.length > 4 ? allProjects.slice(4) : [];
  const remainingProjects: ProjectItem[] =
    rawRemaining.length > 0
      ? [
          ...rawRemaining.map((p, i) =>
            mapProject(p, FALLBACK_REMAINING_PROJECTS[i % FALLBACK_REMAINING_PROJECTS.length].imageUrl)
          ),
          ...FALLBACK_REMAINING_PROJECTS.slice(rawRemaining.length),
        ].slice(0, 4)
      : FALLBACK_REMAINING_PROJECTS;

  return (
    <ProjectsHorizontalScroll
      primaryProjects={primaryProjects}
      remainingProjects={remainingProjects}
    />
  );
}
