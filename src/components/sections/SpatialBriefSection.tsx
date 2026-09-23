import { SpatialBriefForm } from "@/components/sections/SpatialBriefForm";
import { getSiteSettings } from "@/sanity/queries";

interface SpatialBriefSectionProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  defaultMessage?: string;
}

const FALLBACK_OFFICE = {
  name: "Solihull HQ",
  address: "20 Micklehill Drive, Shirley, Solihull, B90 2PU",
};
const FALLBACK_PHONE = "0121 537 8229";
const FALLBACK_EMAIL = "enquiries@stoneageproperties.com";

export async function SpatialBriefSection({
  eyebrow = "Consultation & Enquiries",
  heading = "Start a conversation about your project, vision or future space.",
  intro = "Whether you are planning a contemporary new home, a complete internal remodelling, or a structural extension, we would welcome the opportunity to review your ideas and explore how our specialist team can help shape it.",
  defaultMessage,
}: SpatialBriefSectionProps = {}) {
  const settings = await getSiteSettings();
  const office = settings?.offices?.[0] || FALLBACK_OFFICE;
  const phone = settings?.phones?.[0]?.number || FALLBACK_PHONE;
  const email = settings?.email || FALLBACK_EMAIL;

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden border-t border-[#1C1B19]/10 bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
    >
      <div className="w-full">
        {/* Fabric Standard Section Header matching Projects, Journal, Testimonials & Services */}
        <div className="mb-12 border-b border-black/10 pb-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
              {eyebrow}
            </span>
            <h2 className="text-xxl max-w-4xl leading-tight font-normal tracking-[-1.5px] text-black">
              {heading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Context & Contact Details */}
          <div className="space-y-6 lg:col-span-5">
            <p className="text-reg max-w-md leading-relaxed text-black/80">
              {intro}
            </p>

            <div className="space-y-3 border-t border-black/10 pt-6 font-mono text-xs text-black/60">
              <p className="font-medium text-black">
                Stoneage Properties Specialist Contractors
              </p>
              <p>
                {office.name}: {office.address}
              </p>
              <p>
                Direct: {phone} &middot; {email}
              </p>
            </div>
          </div>

          {/* Right Column: Signature Pinned Project Brief Paper Form */}
          <div className="lg:col-span-7">
            <SpatialBriefForm defaultMessage={defaultMessage} />
          </div>
        </div>
      </div>
    </section>
  );
}
