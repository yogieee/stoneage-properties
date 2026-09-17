import type { Metadata } from "next";
import { JournalGrid } from "@/components/sections/JournalGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Thoughts, technical process studies, and construction case studies from Stoneage Properties on residential architecture and design.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Journal | Stoneage Properties",
    description:
      "Thoughts, technical process studies, and construction case studies from Stoneage Properties.",
    url: "/journal",
  },
};

export default function JournalPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <JournalGrid />
      <SpatialBriefSection />
    </div>
  );
}
