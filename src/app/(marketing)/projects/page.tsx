import { FeaturedProjectsGrid } from "@/components/sections/FeaturedProjectsGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata = {
  title: "Projects | Stoneage Properties",
  description:
    "Curated portfolio of residential architecture, bespoke new builds, full renovations, and specialist extensions across the UK.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <FeaturedProjectsGrid />
      <SpatialBriefSection />
    </div>
  );
}
