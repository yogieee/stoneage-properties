import { JournalGrid } from "@/components/sections/JournalGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata = {
  title: "Journal | Stoneage Properties",
  description:
    "Thoughts, technical process studies, and construction case studies from Stoneage Properties.",
};

export default function JournalPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <JournalGrid />
      <SpatialBriefSection />
    </div>
  );
}
