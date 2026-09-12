import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import type { TeamMember } from "@/content/team";

function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

type TeamStripProps = {
  members: TeamMember[];
};

/**
 * Condensed team strip for the single-page homepage's About section — a
 * sibling to `TeamGrid` (not a modification of it; `TeamGrid` may still be
 * useful elsewhere per 02-04-SUMMARY.md), rendering only `name` and `role`
 * beneath each photo/placeholder tile (no long-form background text, per
 * 02-CONTEXT.md's condensation constraint). Tighter, denser layout with
 * smaller tiles than `TeamGrid`'s full-size cards.
 *
 * Same neutral-placeholder contract as `TeamGrid`: a real `next/image` when
 * a member has a `photo`, and a neutral monochrome initials tile when they
 * do not — never a stock photograph as a substitute (ABOUT-01 constraint).
 */
export function TeamStrip({ members }: TeamStripProps) {
  return (
    <div className="flex flex-wrap gap-6">
      {members.map((member) => (
        <div
          key={member.name + member.role}
          className="flex w-36 flex-col gap-3 sm:w-40"
        >
          {member.photo ? (
            <div className="border-line relative aspect-square w-full overflow-hidden rounded-xl border">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="bg-ink text-paper flex aspect-square w-full items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <span className="font-display text-display-sm">
                {initialsFor(member.name)}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-0.5">
            <Typography variant="body" as="p" className="text-ink">
              {member.name}
            </Typography>
            <Typography variant="body-sm" as="p" className="text-ink-subtle">
              {member.role}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
