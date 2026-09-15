import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@/components/decorative/StarIcon";
import { Paperclip } from "@/components/decorative/Paperclip";
import { getSiteSettings } from "@/sanity/queries";

const FALLBACK_EMAIL = "enquiries@stoneageproperties.com";
const FALLBACK_PHONE = { label: "Solihull HQ", number: "0121 537 8229" };
const FALLBACK_OFFICES = [
  { name: "Solihull HQ", address: "20 Micklehill Dr, B90 2PU" },
  { name: "London", address: "1 Colegrave Rd, E15 1DZ" },
  { name: "Nottingham", address: "12 Northfield Ave, NG12" },
];

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const email = settings?.email || FALLBACK_EMAIL;
  const phone = settings?.phones?.[0] || FALLBACK_PHONE;
  const offices = settings?.offices?.length ? settings.offices : FALLBACK_OFFICES;
  const phoneHref = `tel:${phone.number.replace(/\s+/g, "")}`;

  return (
    <footer className="relative w-full bg-charcoal text-paper pt-24 pb-16 overflow-hidden">
      <div className="w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-paper/15">
          {/* Left Column: 3-column subgrid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Site index */}
            <div className="space-y-4">
              <h4 className="font-display text-base font-medium text-paper">Site index</h4>
              <ul className="space-y-2.5 font-mono text-xs text-paper/70">
                <li>
                  <Link href="/" className="hover:text-paper transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-paper transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-paper transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/#journal" className="hover:text-paper transition-colors">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-display text-base font-medium text-paper">Legal</h4>
              <ul className="space-y-2.5 font-mono text-xs text-paper/70">
                <li>
                  <Link href="/privacy-policy" className="hover:text-paper transition-colors">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-use" className="hover:text-paper transition-colors">
                    Terms of use
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-paper transition-colors">
                    Cookie policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get in touch */}
            <div className="space-y-4">
              <h4 className="font-display text-base font-medium text-paper">Get in touch</h4>
              <ul className="space-y-2.5 font-mono text-xs text-paper/70">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-paper transition-colors"
                  >
                    {email}
                  </a>
                </li>
                <li>
                  <a href={phoneHref} className="hover:text-paper transition-colors">
                    {phone.number}
                  </a>
                </li>
                <li className="pt-2 text-paper/50 leading-relaxed">
                  {offices.map((office, index) => (
                    <span key={office.name}>
                      {office.name}: {office.address}
                      {index < offices.length - 1 && <br />}
                    </span>
                  ))}
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Architectural Photo with Pinned Paper Note */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-charcoal-light border border-paper/15 shadow-xl">
              <Image
                src="/images/inprocess.png"
                alt="Stoneage Handover & Craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/20" />
            </div>

            {/* Pinned Note from Stoneage */}
            <div className="absolute -top-8 -left-4 sm:-left-8 z-20 w-44 sm:w-56 rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
              <div className="absolute -top-6 left-4 pointer-events-none z-30">
                <Paperclip className="w-8 h-auto drop-shadow-md" />
              </div>
              <div className="paper-texture bg-paper-card border border-line p-4 sm:p-5 rounded shadow-lg text-ink">
                <div className="flex justify-between items-center pb-2 border-b border-line mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                    A NOTE FROM STONEAGE
                  </span>
                  <StarIcon size="w-3 h-3" className="text-ink" />
                </div>
                <p className="font-display italic text-xs text-ink-muted leading-relaxed">
                  Built with integrity, verified by structural guarantees.
                </p>
                <div className="flex justify-between pt-3 border-t border-line mt-3 font-mono text-[8px] text-ink-subtle uppercase">
                  <span>ST / CTF</span>
                  <span>STONEAGE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Wordmark, Credits, and Copyright */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-xs text-paper/50">
          <div className="flex items-center gap-3 text-paper">
            <span className="font-display text-lg tracking-tight font-medium">Stoneage</span>
            <StarIcon size="w-4 h-4" className="text-paper/80" />
          </div>

          <p>&copy; {new Date().getFullYear()} Stoneage Properties. Specialist Building Contractors UK.</p>

          <p className="text-[11px] text-paper/40">Solihull &middot; London &middot; Nottingham</p>
        </div>
      </div>
    </footer>
  );
}
