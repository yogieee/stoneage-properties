import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Start a conversation with Stoneage Properties. Submit a project brief for your residential new build, renovation, or structural extension.",
  path: "/contact",
  ogTitle: "Contact & Project Brief | Stoneage Properties",
  keywords: [
    "contact Stoneage Properties",
    "architects near me",
    "book a consultation",
    "project brief submission",
    "Solihull architects contact",
  ],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-20 text-[#1C1B19]">
      <SpatialBriefSection
        eyebrow="Contact & Project Brief"
        heading="Start a conversation about your project."
        intro="Whether you are planning a contemporary new home, a complete internal remodelling, or a structural extension, we would welcome the opportunity to review your brief."
      />
    </div>
  );
}
