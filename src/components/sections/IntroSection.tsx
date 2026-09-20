export function IntroSection() {
  return (
    <section
      id="studio"
      className="w-full bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
    >
      <div className="w-full">
        {/* Fabric Title */}
        <h1 className="text-xxl mb-8 max-w-5xl font-normal text-black md:mb-12">
          Architectural Vision &amp; Master Craftsmanship
          <br className="hidden sm:inline" /> Shaping Private Residential
          Sanctuaries
        </h1>

        {/* Fabric Two-Column Narrative (.layout-2-4) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              Stoneage Properties operates at the intersection of architectural
              precision and generational craft. Rooted in Solihull with studios
              in London and Nottingham, we shepherd ambitious private homes from
              initial spatial inquiry through structural engineering, planning
              consent, and meticulous on-site construction.
            </p>
          </div>
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              Rather than dividing design from delivery, our unified practice
              brings architects, artisanal masons, and project directors
              together on the same drawing table. The result is architecture
              that endures: tactile materials, balanced daylight, and spaces
              crafted uniquely around the rhythms of your life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
