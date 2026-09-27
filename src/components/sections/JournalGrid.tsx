import Link from "next/link";
import { getJournalArticles, type JournalArticle } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import {
  JournalScrollSection,
  type JournalArticleItem,
} from "./JournalScrollSection";

const FALLBACK_ARTICLES: {
  slug: string;
  title: string;
  excerpt: string;
  imageSrc: string;
}[] = [
  {
    slug: "designing-for-long-term-living-rather-than-trends",
    title: "Designing for Long-Term Living Rather Than Trends",
    excerpt:
      "Interior trends move in cycles measured in seasons. A well-built home has to hold up for decades. Here's how we design for the second decade of ownership, not the first six months.",
    imageSrc: "/images/livingroom.png",
  },
  {
    slug: "the-role-of-material-honesty-in-residential-architecture",
    title: "The Role of Material Honesty in Residential Architecture",
    excerpt:
      "Timber that looks like timber. Brick that's allowed to read as brick. Why letting materials express their true nature produces homes that age with dignity instead of just getting old.",
    imageSrc: "/images/staircase.png",
  },
  {
    slug: "balancing-openness-privacy-and-everyday-comfort",
    title: "Balancing Openness, Privacy, and Everyday Comfort",
    excerpt:
      "Open-plan living solved one problem and created another: how do you stay connected as a household without losing anywhere quiet to retreat to? Notes on planning modern residential layouts.",
    imageSrc: "/images/plan.png",
  },
  {
    slug: "creating-a-stronger-connection-between-home-and-landscape",
    title: "Creating a Stronger Connection Between Home and Landscape",
    excerpt:
      "The line between indoors and outdoors has become one of the most valuable decisions in a home extension. Exploring how extensions, glazing, and level changes dissolve that boundary.",
    imageSrc: "/images/garden.png",
  },
];

export async function JournalGrid() {
  let articles: JournalArticle[] = [];
  try {
    articles = await getJournalArticles();
  } catch (err) {
    console.error("Failed to load journal articles from Sanity:", err);
  }

  const items: JournalArticleItem[] =
    articles && articles.length > 0
      ? articles.map((article, idx) => {
          let imageUrl =
            FALLBACK_ARTICLES[idx % FALLBACK_ARTICLES.length].imageSrc;
          if (article.image?.asset?._ref) {
            try {
              imageUrl = urlFor(article.image).width(1600).height(1000).url();
            } catch {
              // fallback remains
            }
          }
          return {
            slug: article.slug,
            title: article.title,
            excerpt:
              article.excerpt ||
              FALLBACK_ARTICLES[idx % FALLBACK_ARTICLES.length].excerpt,
            imageUrl,
            tag: `Insight · 0${idx + 1}`,
            publishedAt: article.publishedAt,
          };
        })
      : FALLBACK_ARTICLES.map((item, idx) => ({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          imageUrl: item.imageSrc,
          tag: `Insight · 0${idx + 1}`,
        }));

  return (
    <div id="journal" className="w-full bg-[#F7F5F0] text-[#1C1B19]">
      {/* Editorial Header */}
      <div className="w-full border-t border-[#1C1B19]/10 px-4 pt-16 pb-8 sm:px-8 md:px-12 md:pt-24 md:pb-12">
        <div className="flex flex-col justify-between gap-4 border-b border-[#1C1B19]/15 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#1C1B19]/60 uppercase">
              [Journal &amp; Insights]
            </span>
            <h2 className="text-xxl mt-2 font-normal tracking-[-1.5px] text-[#1C1B19]">
              Architectural Discourse &amp; Research
            </h2>
          </div>
          <Link
            href="/journal"
            className="group flex items-center gap-2 text-sm font-medium tracking-[-0.5px] text-[#1C1B19] transition-opacity hover:opacity-70 sm:text-base"
          >
            <span>View All Articles</span>
            <span className="font-mono transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Interactive Pinned Scroll Accordion (Exact Alejandro HA Services Style) */}
      <JournalScrollSection articles={items} />
    </div>
  );
}
