import Image from "next/image";
import Link from "next/link";
import { getJournalArticles } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export async function JournalGrid() {
  const articles = await getJournalArticles();

  return (
    <section
      id="journal"
      className="w-full border-t border-[#1C1B19]/10 bg-[#F7F5F0] px-3 py-16 text-[#1C1B19] sm:px-6 md:px-12 md:py-24"
    >
      <div className="w-full">
        {/* Fabric Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              Journal &amp; Insights
            </h2>
          </div>
          <Link
            href="/journal"
            className="flex items-center gap-2 text-base font-normal tracking-[-0.5px] text-black transition-opacity hover:opacity-70"
          >
            <span>View All Posts</span>
            <span className="font-mono">&rarr;</span>
          </Link>
        </div>

        {/* 2-Column Fabric Article Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {articles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block w-full"
            >
              <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden bg-black/5">
                <Image
                  src={urlFor(article.image).width(900).height(560).url()}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="border-t border-black/10 pt-3">
                <div className="mb-1 flex items-center justify-between font-mono text-xs tracking-wider text-black/50 uppercase">
                  <span>Insight &middot; 0{index + 1}</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
                <h3 className="text-xl font-normal tracking-[-1px] text-black transition-opacity group-hover:opacity-75 sm:text-2xl">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
