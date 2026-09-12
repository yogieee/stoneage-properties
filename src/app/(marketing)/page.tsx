import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { StatementBanner } from "@/components/sections/StatementBanner";
import { FeaturedProjectsGrid } from "@/components/sections/FeaturedProjectsGrid";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { JournalGrid } from "@/components/sections/JournalGrid";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

/**
 * End-to-end replication of the Storey Architecture landing page
 * (storeyarchitecture.co.uk) adapted for Stoneage Properties.
 *
 * Sequence of sections:
 * 1. HeroCarousel — full-viewport crossfading carousel with progress bars and narrative
 * 2. IntroSection — 2-column philosophy manifesto + 3D project orbit in perspective
 * 3. ExpertiseSection — "Our areas of expertise" numbered 1, 2, 3 with drafting tools
 * 4. StatementBanner — "We shape space into purpose" full-width statement with dual manifesto
 * 5. FeaturedProjectsGrid — Staggered editorial portfolio grid + signature pinned paper note
 * 6. TestimonialsSlider — Client proof carousel with progress lines and collaboration statement
 * 7. JournalGrid — "Spaces Shaped Through Intention" 4-card study grid with drafting accents
 * 8. SpatialBriefSection — "SPATIAL BRIEF INTAKE" paper-textured form pinned with paperclip
 */
export default function HomePage() {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <IntroSection />
      <ExpertiseSection />
      <StatementBanner />
      <FeaturedProjectsGrid />
      <TestimonialsSlider />
      <JournalGrid />
      <SpatialBriefSection />
    </div>
  );
}
