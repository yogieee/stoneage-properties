import { SpatialBriefForm } from "@/components/sections/SpatialBriefForm";

export function SpatialBriefSection() {
  return (
    <section
      id="contact"
      className="bg-paper relative w-full overflow-hidden py-24 sm:py-36"
    >
      <div className="px-6 sm:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading and Intake Context */}
          <div className="space-y-8 lg:col-span-5">
            <div>
              <span className="text-ink-subtle mb-4 block font-mono text-xs tracking-widest uppercase">
                Consultation & Enquiries
              </span>
              <h2 className="font-display text-ink text-3xl leading-[1.12] font-medium tracking-tight sm:text-5xl lg:text-6xl">
                Start a conversation about your project, vision or future space.
              </h2>
            </div>

            <p className="font-body text-ink-muted max-w-md text-base leading-relaxed sm:text-lg">
              Whether you are planning a contemporary new home, a complete
              internal remodelling, or a structural extension, we would welcome
              the opportunity to review your ideas and explore how our
              specialist team can help shape it.
            </p>

            <div className="border-line text-ink-muted space-y-3 border-t pt-6 font-mono text-xs">
              <p className="text-ink font-medium">
                Stoneage Properties Specialist Contractors
              </p>
              <p>
                Solihull HQ: 20 Micklehill Drive, Shirley, Solihull, B90 2PU
              </p>
              <p>
                Direct: 0121 537 8229 &middot; enquiries@stoneageproperties.com
              </p>
            </div>
          </div>

          {/* Right Column: Signature Pinned Spatial Brief Paper Form */}
          <div className="pt-6 lg:col-span-7 lg:pt-0">
            <SpatialBriefForm />
          </div>
        </div>
      </div>
    </section>
  );
}
