import Link from "next/link";
import { getSiteSettings } from "@/sanity/queries";
import { StackingStonesLogo } from "@/components/decorative/StackingStonesLogo";
import { SocialIcon } from "@/components/decorative/SocialIcon";

const FALLBACK_EMAIL = "enquiries@stoneageproperties.com";
const FALLBACK_PHONE = { label: "Solihull HQ", number: "0121 537 8229" };
const FALLBACK_OFFICES = [
  {
    name: "Solihull HQ",
    address: "64 Stratford Rd, Shirley, Solihull, B90 3LP",
  },
];
const QUICK_LINKS = [
  { label: "Studio", href: "/ourstudio" },
  { label: "Projects", href: "/projects" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Build", href: "/build" },
  { label: "Journal", href: "/journal" },
];
const FALLBACK_SOCIALS = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/stoneage_building_contractors/",
  },
  { platform: "Facebook", url: "https://www.facebook.com/stoneageproperties" },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/stoneage-properties-5bb8171a1/",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/channel/UCaXNV-S7WE2LfIQOr9NlGeQ",
  },
];

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const email = settings?.email || FALLBACK_EMAIL;
  const phone = settings?.phones?.[0] || FALLBACK_PHONE;
  const offices = settings?.offices?.length
    ? settings.offices
    : FALLBACK_OFFICES;
  const socials = settings?.socials?.length
    ? settings.socials
    : FALLBACK_SOCIALS;
  const phoneHref = `tel:${phone.number.replace(/\s+/g, "")}`;

  return (
    <footer
      className="w-full border-t border-[#1C1B19]/10 bg-[#F7F5F0] px-3 pt-16 pb-12 text-[#1C1B19] sm:px-6 md:px-12"
      role="contentinfo"
    >
      <div className="w-full">
        {/* Fabric 2-column primary layout */}
        <div className="grid grid-cols-1 gap-10 border-b border-black/10 pb-16 md:grid-cols-12">
          {/* Left Column: Phone, Email, Button, Socials */}
          <div className="space-y-6 md:col-span-6 lg:col-span-5">
            <div className="flex items-end gap-1.5 pb-2">
              <StackingStonesLogo size="w-8 h-8" className="text-black" />
              <span className="text-2xl leading-none font-normal tracking-[-1px] uppercase">
                Stoneage
              </span>
            </div>

            <div>
              <p className="mb-1 font-mono text-xs tracking-wider text-black/50 uppercase">
                Phone
              </p>
              <a
                href={phoneHref}
                className="text-xl font-normal tracking-[-0.5px] transition-opacity hover:opacity-70 md:text-2xl"
              >
                {phone.number}
              </a>
            </div>

            <div>
              <p className="mb-1 font-mono text-xs tracking-wider text-black/50 uppercase">
                Email
              </p>
              <a
                href={`mailto:${email}`}
                className="text-lg font-normal tracking-[-0.5px] transition-opacity hover:opacity-70 md:text-xl"
              >
                {email}
              </a>
            </div>

            <div className="pt-2">
              <Link href="/contact" className="fabric-btn">
                Project Enquiry
              </Link>
            </div>

            <div className="flex items-center gap-5 pt-4 text-sm">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.platform}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <SocialIcon platform={social.platform} className="h-4 w-4" />
                  {social.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Address + Quick Links, then full-width Map */}
          <div className="flex flex-col gap-8 md:col-span-6 lg:col-span-7">
            {offices.map((office) => (
              <div key={office.name} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 font-mono text-xs tracking-wider text-black/50 uppercase">
                      {office.name}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-black/80">
                      {office.address}
                    </p>
                    <p className="pt-3">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs tracking-wider uppercase underline underline-offset-4 hover:opacity-70"
                      >
                        Get Directions &rarr;
                      </a>
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 font-mono text-xs tracking-wider text-black/50 uppercase">
                      Quick Links
                    </p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-black/80">
                      {QUICK_LINKS.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="transition-opacity hover:opacity-70"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="h-24 w-full overflow-hidden border border-black/10 sm:h-80 sm:w-[85%]">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(office.address)}&output=embed`}
                    title={`Map showing ${office.name}, ${office.address}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fabric Sub-Footer: Accreditations, Reg, Copyright */}
        <div className="flex flex-col items-start justify-between gap-6 pt-8 text-xs text-black/60 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] tracking-wider uppercase">
            <span>Specialist Building Contractors UK</span>
            <span className="hidden md:inline">|</span>
            <span>Solihull</span>
          </div>

          <div className="text-left font-mono text-[11px] text-black/50 md:text-right">
            <p>
              &copy; {new Date().getFullYear()} Stoneage Properties Ltd &middot;
              All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
