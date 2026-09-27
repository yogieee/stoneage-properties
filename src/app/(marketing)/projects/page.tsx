import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Curated portfolio of residential architecture, bespoke new builds, full renovations, and specialist extensions in Solihull.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Stoneage Properties",
    description:
      "Curated portfolio of residential architecture, bespoke new builds, full renovations, and specialist extensions.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <ProjectsGrid />
      <SpatialBriefSection />
    </div>
  );
}
