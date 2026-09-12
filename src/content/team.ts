export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string; // optional — path under /public, e.g. "/team/jane-doe.jpg"
};

/**
 * Real named team members and photography have not yet been supplied by
 * the client (see 02-04-PLAN.md content-dependency note). Entries below
 * use real, discovery-verified company facts (structure, 30+ years
 * combined experience, office locations) with role-based placeholder
 * identities rather than fabricated named individuals.
 *
 * TODO: replace with real client-supplied names, bios, and photos.
 */
export const TEAM: TeamMember[] = [
  {
    name: "Founding Director",
    role: "Director & Founder",
    bio: "Leads Stoneage Properties' delivery across new builds, renovations, extensions, and conversions, drawing on 30+ years of combined industry experience across the Solihull, London, and Nottingham offices.",
    // TODO: replace with real client-supplied bio
  },
  {
    name: "Contracts Manager",
    role: "Contracts & Site Management",
    bio: "Oversees JCT contract administration and on-site delivery, ensuring every project is backed by structural warranties and run to professional, transparent standards.",
    // TODO: replace with real client-supplied bio
  },
  {
    name: "Client Liaison",
    role: "Client Relations",
    bio: "The first point of contact for prospective clients, focused on the company's founding values of value for money, quick communication, and professional expertise.",
    // TODO: replace with real client-supplied bio
  },
];
