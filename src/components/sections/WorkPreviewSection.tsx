import Link from "next/link";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

/**
 * Work preview teaser for the single-page homepage. No `content/projects.ts`
 * data model exists yet (Phase 3 scope — PORT-01..05), so this intentionally
 * does NOT fabricate placeholder project cards/photos. Instead it renders an
 * honest teaser, same honesty precedent as the original `/work` (now
 * `/projects`) placeholder copy, and links through to the full archive page.
 * Phase 3 is responsible for replacing this with real curated preview cards
 * once real project content exists.
 */
export function WorkPreviewSection() {
  return (
    <div className="flex flex-col gap-6">
      <TextReveal as="h2" className="font-display text-display-md text-ink">
        Recent Work
      </TextReveal>

      <Reveal>
        <Typography variant="body-lg" className="max-w-prose">
          Our full project archive is being finalized. In the meantime, take
          a look at what we do and get in touch to discuss examples relevant
          to your project.
        </Typography>
      </Reveal>

      <MagneticButton>
        <Button as={Link} href="/projects" variant="secondary">
          View all Projects
        </Button>
      </MagneticButton>
    </div>
  );
}
