import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { QuickLinksPanels } from "@/components/sections/QuickLinksPanels";
import { ContinuousServicesTicker } from "@/components/sections/ContinuousServicesTicker";
import { FeaturedProjectsGrid } from "@/components/sections/FeaturedProjectsGrid";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { JournalGrid } from "@/components/sections/JournalGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title:
    "Architects & Specialist Building Contractors | Solihull, London & Nottingham",
  description:
    "Stoneage Properties is a design and build practice specialising in luxury residential architecture, bespoke new builds, full renovations, and structural extensions.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Stoneage Properties | Design & Build Specialists",
    description:
      "Bespoke domestic residential architecture and specialist construction across Solihull, London, and Nottingham.",
    url: "/",
  },
};

/**
 * End-to-end design language aligned with Fabric Design Group (fabricdesigngroup.com):
 * 1. Hero — Full-bleed slide system with project tag and prompt
 * 2. IntroSection — Editorial manifesto headline + 2-column ethos
 * 3. QuickLinksPanels — 2x2 interactive panels (Projects, Design, Build, Studio) + ethos
 * 4. FeaturedProjectsGrid — High contrast 2-column architectural photography grid
 * 5. TestimonialsSlider — Client quotes with project, location, and Prev/Next controls
 * 6. JournalGrid — Research and technical editorial insights
 * 7. SpatialBriefSection — Clean contact intake form
 */
export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F5F0] text-[#1C1B19]">
      <Hero />
      <IntroSection />
      <QuickLinksPanels />
      <ContinuousServicesTicker />
      <FeaturedProjectsGrid />
      <TestimonialsSlider />
      <JournalGrid />
      <SpatialBriefSection />
    </div>
  );
}
