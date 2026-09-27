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
              At Stoneage, we are a specialist building contractors with years
              of experience in the Construction industry. Based in Solihull, we
              deliver ambitious turnkey projects from groundworks and through to
              the final finish and aftercare.
            </p>
          </div>
          <div className="text-reg space-y-4 text-black/80 md:col-span-6">
            <p>
              We work closely with your architect and structural engineer to
              transform technical drawings into exceptional homes. From planning
              and project management through to construction and final handover,
              our experienced team manages every stage under one roof. The
              result is a beautifully crafted home built with quality materials,
              expert workmanship, and designed around the way your family lives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
