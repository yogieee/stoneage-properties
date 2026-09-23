import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getJournalArticles } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Thoughts, technical process studies, and construction case studies from Stoneage Properties on residential architecture, heritage conservation, and spatial craftsmanship.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Journal | Stoneage Properties",
    description:
      "Thoughts, technical process studies, and construction case studies from Stoneage Properties.",
    url: "/journal",
  },
};

export default async function JournalPage() {
  const articles = await getJournalArticles();

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      {/* 1. Hero matching exact landing page, build, design & studio framing */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 text-[#1C1B19] select-none sm:px-6 md:h-[100vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pt-[72px] pb-[72px] md:pt-[84px]">
          {/* Framed Image Holder */}
          <div className="relative h-full w-full overflow-hidden bg-black">
            <Image
              src="/images/hero/loft.png"
              alt="Stoneage Journal & Architectural Research"
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
          </div>

          {/* Overview Bar (height: 72px, border-b) */}
          <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center justify-between gap-3 border-b border-black/10">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <h2 className="text-base font-normal tracking-[-1px] text-black sm:text-2xl">
                Journal &amp; Insights
              </h2>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-JOURNAL
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Editorial Manifesto Narrative (Fabric layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h1 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Journal
            </h1>
            <div className="mt-4 font-mono text-xs tracking-wider text-black/50 uppercase">
              Discourse &middot; Studies &middot; Craft
            </div>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p className="text-lg font-medium tracking-[-0.5px] text-black sm:text-xl">
              Observations on materials, spatial proportion, and the art of
              enduring construction.
            </p>
            <p>
              The Stoneage Journal documents our practice&apos;s ongoing
              architectural research, technical case studies, planning
              perspectives, and material explorations. From structural stone
              masonry to high-performance building envelopes, we share the
              thinking behind the private residences we craft.
            </p>
            <p>
              Each essay reflects the collaborative dialogue between our
              chartered architects, structural engineers, and on-site master
              craftsmen at our Solihull practice.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section: Curated Journal Articles Grid (Fabric 2-Column Grid) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="mb-12 border-b border-black/10 pb-6">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Selected Articles
          </h2>
          <p className="text-reg mt-2 text-black/70">
            Field notes, architectural commentary, and technical reviews
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {articles.map((article, index) => {
            const isPortrait = index % 3 === 1;
            return (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="group block w-full"
              >
                <div
                  className={`relative mb-4 w-full overflow-hidden bg-black/5 ${
                    isPortrait ? "aspect-[4/5]" : "aspect-[16/10]"
                  }`}
                >
                  {article.image ? (
                    <Image
                      src={urlFor(article.image)
                        .width(1200)
                        .height(isPortrait ? 1500 : 750)
                        .url()}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-black/5" />
                  )}
                </div>

                <div className="border-t border-black/10 pt-3">
                  <div className="mb-1 flex items-center justify-between font-mono text-xs tracking-wider text-black/50 uppercase">
                    <span>Insight &middot; 0{index + 1}</span>
                    <span className="font-mono text-sm transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="text-xl font-normal tracking-[-1px] text-black transition-opacity group-hover:opacity-75 sm:text-2xl">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-light text-black/70">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Section: Explore Navigation */}
      <section className="w-full px-3 py-16 sm:px-6 md:px-12 md:py-20">
        <div className="mb-10 flex items-baseline justify-between border-b border-black/10 pb-4">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
            Explore
          </h2>
          <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
            Navigation &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Link href="/projects" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/projects-panel.png"
                alt="Projects"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Projects
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/craftsmanship" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/build-stone-masonry.png"
                alt="Specialist Building & Master Craftsmanship"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Craftsmanship
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/build" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/build-hero.png"
                alt="Build & Delivery"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Build
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Standardized Project Brief Consultation */}
      <SpatialBriefSection />
    </div>
  );
}
