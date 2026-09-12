export type Service = {
  slug: string;
  name: string;
  /** One-line summary, used on the services index page. */
  summary: string;
  /** Longer paragraph(s), used on the service detail page. */
  description: string;
  warranty: { label: string; detail: string };
};

const STANDARD_WARRANTY = {
  label: "3-Year Workmanship Guarantee",
  detail:
    "Every project is backed by Stoneage Properties' standard 3-year workmanship guarantee, covering the quality of our labour and materials.",
};

export const SERVICES: Service[] = [
  {
    slug: "new-builds",
    name: "New Builds",
    summary: "Ground-up residential and commercial construction, contract-backed and structurally warranted.",
    description:
      "From first foundations to final finish, we deliver new build projects across Solihull, London, and Nottingham with the rigour of a formal JCT contract at every stage. Over 30 years of combined experience means every build is planned for value, communicated clearly, and executed to a professional standard from groundworks through to handover.",
    warranty: {
      label: "JCT Contract + 10-Year Structural Warranty",
      detail:
        "Every new build is delivered under a formal JCT contract and backed by a 10-year structural warranty, giving you contractual and structural protection for the life of the build.",
    },
  },
  {
    slug: "renovations",
    name: "Renovations",
    summary: "Kitchens, bathrooms, and room additions renovated to a professional, lasting standard.",
    description:
      "Whether it's a kitchen, bathroom, or a wider room addition, our renovation work is handled with the same attention to detail as a full new build. We work closely with homeowners to keep communication quick and straightforward, delivering renovations that add lasting value to the property.",
    warranty: STANDARD_WARRANTY,
  },
  {
    slug: "extensions",
    name: "Extensions",
    summary: "Single and double storey extensions, backed by our workmanship guarantee.",
    description:
      "We design and build single and double storey extensions that extend both the space and the value of a property. From planning through to the final finish, our extension projects are managed for quality, value for money, and minimal disruption to the household.",
    warranty: {
      label: "3-Year Workmanship Guarantee",
      detail:
        "All extension work is covered by a 3-year workmanship guarantee, giving homeowners confidence in the quality and durability of the build.",
    },
  },
  {
    slug: "conversions",
    name: "Conversions",
    summary: "HMOs, commercial and residential flat conversions, loft and garage conversions.",
    description:
      "Our conversion work spans HMOs, commercial and residential flat conversions, loft conversions, and garage conversions. Each conversion is treated as its own specialist project, converting underused space into fully functional, professionally finished rooms that meet the relevant building standards.",
    warranty: STANDARD_WARRANTY,
  },
  {
    slug: "basements",
    name: "Basements",
    summary: "Basement construction and conversion, engineered for long-term structural integrity.",
    description:
      "Basement projects demand specialist waterproofing and structural expertise. We deliver basement construction and conversions with the same professional, value-for-money approach as our above-ground work, turning below-ground space into usable, comfortable rooms.",
    warranty: STANDARD_WARRANTY,
  },
  {
    slug: "refurbishments",
    name: "Refurbishments",
    summary: "Full property refurbishments delivered with quick communication and professional expertise.",
    description:
      "From single rooms to whole-property refurbishments, we manage every stage of the works with clear, quick communication. Our refurbishment projects are built around the client's priorities, delivering a professional finish on time and on budget.",
    warranty: STANDARD_WARRANTY,
  },
  {
    slug: "barn-conversions",
    name: "Barn Conversions",
    summary: "Barn conversions that balance character preservation with modern building standards.",
    description:
      "Converting a barn into a modern, comfortable home requires a careful balance between preserving character and meeting current building regulations. Our barn conversion projects draw on decades of specialist contracting experience to deliver both.",
    warranty: STANDARD_WARRANTY,
  },
];
