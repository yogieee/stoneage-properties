import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Typography } from "@/components/ui/Typography";
import { TeamStrip } from "@/components/sections/TeamStrip";
import { getTeam } from "@/sanity/queries";

/**
 * Condensed About section for the single-page homepage. The brand-story
 * copy (30+ years combined experience, JCT contracts, Solihull office) is
 * adapted from the original `/about` page's approved narrative (02-04) —
 * updated to a single Solihull location, per the client's actual footprint.
 * Followed by the condensed `TeamStrip`.
 */
export async function AboutSection() {
  const team = await getTeam();

  return (
    <div className="flex flex-col gap-10">
      <TextReveal as="h2" className="font-display text-display-md text-ink">
        About Stoneage Properties
      </TextReveal>

      <div className="flex flex-col gap-6">
        <Reveal className="max-w-prose">
          <Typography variant="body-lg">
            Stoneage Properties was built on a simple premise: specialist
            building work — new builds, renovations, extensions, and
            conversions — delivered with the transparency and rigour larger
            clients expect, and the personal attention smaller clients
            deserve. From our Solihull office, our team brings over 30 years
            of combined experience to every project, backed by JCT contract
            administration and structural warranties from first enquiry to
            handover.
          </Typography>
        </Reveal>

        <Reveal className="max-w-prose">
          <Typography variant="body-lg">
            That experience shows up in three things clients consistently
            tell us matter most: value for money on every quote, quick
            communication throughout the build, and professional expertise
            at every stage — from planning through to the final finish.
          </Typography>
        </Reveal>
      </div>

      <TeamStrip members={team} />
    </div>
  );
}
