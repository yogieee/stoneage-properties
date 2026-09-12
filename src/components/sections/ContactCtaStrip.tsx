import Link from "next/link";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/Button";

/**
 * Contact CTA strip closing out the single-page homepage. This is a
 * trigger surface, not a form/route — the actual contact modal/form is
 * built in Wave 3 (02-09) via a parallel/intercepting route on `/contact`.
 * Intentionally has no `id` and is not a scroll-spy anchor target per
 * `02-CONTEXT.md`.
 */
export function ContactCtaStrip() {
  return (
    <div className="border-line flex flex-col items-start gap-8 border-t px-6 py-24 sm:px-12">
      <TextReveal as="h2" className="font-display text-display-md text-ink">
        Let&apos;s build something
      </TextReveal>

      <Reveal>
        <MagneticButton>
          <Button as={Link} href="/contact" variant="primary">
            Enquire
          </Button>
        </MagneticButton>
      </Reveal>
    </div>
  );
}
