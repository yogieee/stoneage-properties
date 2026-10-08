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

// Only rendered if the Sanity fetch fails outright or returns fewer than 4
// projects — kept in sync with real, current project slugs (not fictional
// placeholders) so this path never links to a 404 if it ever triggers.
const FALLBACK_PRIMARY_PROJECTS: ProjectItem[] = [
  {
    slug: "new-build",
    title: "Basement & New Build",
    location: "Hall Green, Birmingham",
    category: "New Dwelling",
    imageUrl: "/images/projects/project-1.webp",
    summary:
      "Luxury new-build featuring a basement wellness suite with a swim spa, sauna, and shower facilities. Open-plan ground floor living, four en-suite bedrooms across two floors, a striking tinted glass curtain wall, and a bespoke single-spine staircase overlooking the courtyard.",
  },
  {
    slug: "rear-landscape",
    title: "Landscape",
    location: "Solihull",
    category: "Landscape",
    imageUrl: "/images/projects/project-2.webp",
    summary:
      "Thoughtfully landscaped to unlock the garden's full potential, creating a spacious and elegant setting for modern outdoor living.",
  },
  {
    slug: "dormer-loft",
    title: "Dormer Loft",
    location: "Walsall",
    category: "Loft Conversion",
    imageUrl: "/images/projects/project-3.jpg",
    summary:
      "An extensive remodelling, side and front extensions added to a bungalow in the Four Oaks Estate in Sutton Coldfield.",
  },
  {
    slug: "residential-extension",
    title: "Extension & Remodelling",
    location: "Solihull",
    category: "Residential Extension",
    imageUrl: "/images/projects/project-4.webp",
    summary:
      "A complete turnkey transformation comprising a front extension, garage conversion, rear double-storey extension, full remodelling, open-plan kitchen, media room, three bathrooms, and bespoke landscaping.",
  },
];

const FALLBACK_REMAINING_PROJECTS: ProjectItem[] = [
  {
    slug: "extension-kitchen-remodelling",
    title: "Extension & Open Plan Kitchen",
    location: "Harborne",
    category: "Residential Extension",
    imageUrl: "/images/exten.png",
  },
  {
    slug: "kitchen-renovation",
    title: "Kitchen Remodelling",
    location: "Solihull",
    category: "Kitchen Renovation",
    imageUrl: "/images/kitchen.png",
  },
  {
    slug: "extension-remodelling",
    title: "Extension & Remodelling",
    location: "Solihull",
    category: "Residential Extension",
    imageUrl: "/images/corridor.png",
  },
  {
    slug: "change-of-use-conversion",
    title: "Commercial to Residential Conversion",
    location: "Birmingham",
    category: "Commercial to Residential Conversion",
    imageUrl: "/images/newbuild.png",
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
