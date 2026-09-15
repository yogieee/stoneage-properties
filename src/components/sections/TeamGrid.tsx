import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import type { TeamMember } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

type TeamGridProps = {
  members: TeamMember[];
};

/**
 * Responsive team member grid. Renders a real `next/image` when a member
 * has a `photo`, and a neutral monochrome initials tile when they do not —
 * never a stock photograph as a substitute (ABOUT-01 constraint).
 */
export function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div key={member.name + member.role} className="flex flex-col gap-4">
          {member.photo ? (
            <div className="border-line relative aspect-square w-full overflow-hidden rounded-2xl border">
              <Image
                src={urlFor(member.photo).width(800).height(800).url()}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="bg-ink text-paper flex aspect-square w-full items-center justify-center rounded-2xl"
              aria-hidden="true"
            >
              <span className="font-display text-display-sm">
                {initialsFor(member.name)}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Typography variant="display-sm" as="h3">
              {member.name}
            </Typography>
            <Typography variant="body-sm" as="p" className="text-ink-subtle">
              {member.role}
            </Typography>
            <Typography variant="body" as="p">
              {member.bio}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
