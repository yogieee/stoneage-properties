import type { Metadata } from "next";
import { FeaturedProjectsGrid } from "@/components/sections/FeaturedProjectsGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Curated portfolio of residential architecture, bespoke new builds, full renovations, and specialist extensions across Solihull, London, and Nottingham.",
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
    <div className="pt-16 sm:pt-20">
      <FeaturedProjectsGrid />
      <SpatialBriefSection />
    </div>
  );
}
