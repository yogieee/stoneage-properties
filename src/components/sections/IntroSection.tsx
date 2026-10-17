export function IntroSection() {
  return (
    <section
      id="studio"
      className="w-full bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
    >
      <div className="w-full">
        {/* Fabric Title */}
        <h1 className="text-xxl mb-8 max-w-5xl font-normal text-black md:mb-12">
          Specialist Building Contractors
          <br className="hidden sm:inline" /> Shaping Private Residential Spaces
        </h1>

        {/* Fabric Two-Column Narrative (.layout-2-4) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              At Stoneage, we are a specialists in residential and commercial
              projects with years of experience in the Construction industry.
              Based in Solihull, we deliver ambitious turnkey projects from
              groundworks and through to the final finish and aftercare
              throughout West Midlands.
            </p>
          </div>
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              From architects and structural engineers to Building Control and
              the Water Authority, we bring together the entire professional
              team to deliver a seamless turnkey experience. At the heart of our
              approach is a commitment to making every project enjoyable and
              stress-free for our clients. Through careful planning, expert
              project management, and exceptional craftsmanship, we create
              distinctive homes built to stand the test of time with outstanding
              quality and workmanship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
