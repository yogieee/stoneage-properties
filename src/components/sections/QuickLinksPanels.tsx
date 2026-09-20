import Image from "next/image";
import Link from "next/link";
import { getHomepagePanels } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

const FALLBACK_PANELS = [
  {
    eyebrow: "Portfolio",
    title: "Selected Projects",
    href: "/projects",
    src: "/images/hero/projects-panel.png",
    alt: "Stoneage Crafted Architecture Projects",
    grayscale: false,
  },
  {
    eyebrow: "Discipline",
    title: "Architectural Design",
    href: "/design",
    src: "/images/hero/design-hero.png",
    alt: "Stoneage Architectural Conception & Spatial Design",
    grayscale: true,
  },
  {
    eyebrow: "Execution",
    title: "Specialist Build",
    href: "/build",
    src: "/images/hero/build-hero.png",
    alt: "Stoneage Master Craft Construction",
    grayscale: true,
  },
  {
    eyebrow: "The Practice",
    title: "Our Studio & Heritage",
    href: "/ourstudio",
    src: "/images/hero/studio-hero.png",
    alt: "Stoneage Solihull, London & Nottingham Practice",
    grayscale: false,
  },
];

const FALLBACK_METHODOLOGY = {
  eyebrow: "Our Methodology",
  heading: "Conceive. Engineer. Craft.",
  body: [
    "Every residence we shape begins as an organic conversation between landscape, light, and human rhythm. We reject off-the-shelf templates in favour of pure architectural integrity, selecting native stone, structural timber, and artisanal masonry suited to lasting generations.",
    "By uniting RIBA-chartered architects and master building contractors under one single studio stewardship, Stoneage eliminates the traditional friction between visionary blueprint and onsite physical execution.",
  ],
};

const FALLBACK_STATEMENT = {
  eyebrow: "Bespoke Residences",
  heading: "Quiet Luxury & Enduring Form",
  body: [
    "We craft private residential sanctuaries defined by spatial calm, tactile natural materials, and precision engineering. Our portfolio spans monolithic country estates, sensitive heritage transformations, and forward-thinking contemporary extensions.",
    "Headquartered in Solihull with collaborative studios in London and Nottingham, Stoneage Properties advises discerning homeowners throughout the UK on complex planning, conservation zoning, and turnkey construction management.",
  ],
  ctaLabel: "Discuss your architectural commission",
  ctaHref: "/contact",
};

export async function QuickLinksPanels() {
  const data = await getHomepagePanels();

  const panels = data?.panels?.length
    ? data.panels.map((panel, index) => ({
        eyebrow: panel.eyebrow,
        title: panel.title,
        href: panel.href,
        src: urlFor(panel.image).width(1200).height(1080).url(),
        alt: panel.title,
        grayscale: FALLBACK_PANELS[index]?.grayscale ?? false,
      }))
    : FALLBACK_PANELS;

  const methodology = data?.methodology?.heading
    ? data.methodology
    : FALLBACK_METHODOLOGY;
  const statement = data?.statement?.heading
    ? data.statement
    : FALLBACK_STATEMENT;

  const [projectsPanel, designPanel, buildPanel, studioPanel] = panels;

  return (
    <section className="w-full bg-[#F7F5F0] px-3 pt-16 pb-12 text-[#1C1B19] sm:px-6 sm:pt-20 sm:pb-16 md:px-12 md:pt-24 md:pb-20">
      {/* Row 1: Projects (wider/taller) & Design (asymmetrical pairing) */}
      <div className="mb-16 grid grid-cols-1 items-end gap-6 md:mb-24 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <Link
            href={projectsPanel.href}
            className="group relative block h-[360px] w-full overflow-hidden bg-black sm:h-[460px] md:h-[540px]"
          >
            <Image
              src={projectsPanel.src}
              alt={projectsPanel.alt}
              fill
              className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between text-white sm:bottom-8 sm:left-8">
              <div>
                <span className="mb-1 block font-mono text-xs tracking-widest text-white/60 uppercase">
                  {projectsPanel.eyebrow}
                </span>
                <h3 className="flex items-center gap-3 text-2xl font-normal tracking-[-1px] sm:text-3xl">
                  <span>{projectsPanel.title}</span>
                  <span className="font-mono text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </h3>
              </div>
            </div>
          </Link>
        </div>

        <div className="md:col-span-5">
          <Link
            href={designPanel.href}
            className="group relative block h-[320px] w-full overflow-hidden bg-black sm:h-[380px] md:h-[440px]"
          >
            {/* Grayscale architectural image for contrast and visual rhythm */}
            <Image
              src={designPanel.src}
              alt={designPanel.alt}
              fill
              className="object-cover opacity-85 contrast-125 grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between text-white sm:bottom-8 sm:left-8">
              <div>
                <span className="mb-1 block font-mono text-xs tracking-widest text-white/60 uppercase">
                  {designPanel.eyebrow}
                </span>
                <h3 className="flex items-center gap-3 text-2xl font-normal tracking-[-1px] sm:text-3xl">
                  <span>{designPanel.title}</span>
                  <span className="font-mono text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </h3>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mid-Section Ethos Statement (.layout-2-4) */}
      <div className="mb-16 w-full md:mb-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <span className="mb-2 block font-mono text-xs tracking-widest text-black/50 uppercase">
              {methodology.eyebrow}
            </span>
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              {methodology.heading}
            </h2>
          </div>
          <div className="text-reg space-y-4 text-black/80 md:col-span-7">
            {methodology.body?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Build & Craft (asymmetrical inverted pairing) */}
      <div className="mb-16 grid grid-cols-1 items-start gap-6 md:mb-24 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Link
            href={buildPanel.href}
            className="group relative block h-[320px] w-full overflow-hidden bg-black sm:h-[380px] md:h-[440px]"
          >
            {/* Black and white architectural study image */}
            <Image
              src={buildPanel.src}
              alt={buildPanel.alt}
              fill
              className="object-cover opacity-85 contrast-115 grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between text-white sm:bottom-8 sm:left-8">
              <div>
                <span className="mb-1 block font-mono text-xs tracking-widest text-white/60 uppercase">
                  {buildPanel.eyebrow}
                </span>
                <h3 className="flex items-center gap-3 text-2xl font-normal tracking-[-1px] sm:text-3xl">
                  <span>{buildPanel.title}</span>
                  <span className="font-mono text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </h3>
              </div>
            </div>
          </Link>
        </div>

        <div className="md:col-span-7">
          <Link
            href={studioPanel.href}
            className="group relative block h-[360px] w-full overflow-hidden bg-black sm:h-[460px] md:h-[540px]"
          >
            <Image
              src={studioPanel.src}
              alt={studioPanel.alt}
              fill
              className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between text-white sm:bottom-8 sm:left-8">
              <div>
                <span className="mb-1 block font-mono text-xs tracking-widest text-white/60 uppercase">
                  {studioPanel.eyebrow}
                </span>
                <h3 className="flex items-center gap-3 text-2xl font-normal tracking-[-1px] sm:text-3xl">
                  <span>{studioPanel.title}</span>
                  <span className="font-mono text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </h3>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Luxury residential architects statement */}
      <div className="w-full border-t border-black/10 pt-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <span className="mb-2 block font-mono text-xs tracking-widest text-black/50 uppercase">
              {statement.eyebrow}
            </span>
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              {statement.heading}
            </h2>
          </div>
          <div className="text-reg space-y-4 text-black/80 md:col-span-7">
            {statement.body?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="pt-2">
              <Link
                href={statement.ctaHref ?? "/contact"}
                className="fabric-underline font-normal text-black"
              >
                {statement.ctaLabel} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
