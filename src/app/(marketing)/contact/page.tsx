import type { Metadata } from "next";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Stoneage Properties. Submit a spatial brief for your residential new build, renovation, or structural extension.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Spatial Brief | Stoneage Properties",
    description:
      "Start a conversation with Stoneage Properties about your next residential project.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-20 text-[#1C1B19]">
      <SpatialBriefSection
        eyebrow="Contact & Spatial Brief"
        heading="Start a conversation about your project."
        intro="Whether you are planning a contemporary new home, a complete internal remodelling, or a structural extension, we would welcome the opportunity to review your brief."
      />
    </div>
  );
}
