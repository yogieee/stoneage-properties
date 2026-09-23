export function IntroSection() {
  return (
    <section
      id="studio"
      className="w-full bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
    >
      <div className="w-full">
        {/* Fabric Title */}
        <h1 className="text-xxl mb-8 max-w-5xl font-normal text-black md:mb-12">
          Specialist Building &amp; Master Craftsmanship
          <br className="hidden sm:inline" /> Shaping Private Residential
          Sanctuaries
        </h1>

        {/* Fabric Two-Column Narrative (.layout-2-4) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              Stoneage Properties is a specialist building contractor rooted in
              generational craft. Based in Solihull, we deliver ambitious
              private homes on site from groundworks and structural build
              through to the final finish.
            </p>
          </div>
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              We work hand-in-hand with your architect, taking their drawing
              and holding it to account on site through masonry, joinery, and
              project management under one roof. The result is construction
              that lasts: tactile materials, considered daylight, and homes
              built uniquely around the rhythms of your life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
