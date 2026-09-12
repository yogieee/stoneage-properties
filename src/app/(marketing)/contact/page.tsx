import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata = {
  title: "Contact & Spatial Brief | Stoneage Properties",
  description:
    "Start a conversation with Stoneage Properties. Submit a spatial brief for your residential new build, renovation, or structural extension.",
};

export default function ContactPage() {
  return (
    <div className="pt-16 sm:pt-24 min-h-screen">
      <SpatialBriefSection />
    </div>
  );
}
