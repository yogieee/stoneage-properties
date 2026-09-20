import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { getJournalArticle, getJournalArticles } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/seo";

function estimateReadingTime(body: unknown): string {
  if (!Array.isArray(body)) return "3 min read";
  const words = body
    .filter(
      (block): block is { children?: { text?: string }[] } =>
        block?._type === "block",
    )
    .flatMap((block) => block.children ?? [])
    .map((span) => span.text ?? "")
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export async function generateStaticParams() {
  const articles = await getJournalArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  if (!article) return {};

  const images = article.image
    ? [urlFor(article.image).width(1200).height(630).url()]
    : undefined;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/journal/${article.slug}` },
    openGraph: {
      type: "article",
      title: `${article.title} | Stoneage Properties Journal`,
      description: article.excerpt,
      url: `${SITE_URL}/journal/${article.slug}`,
      images,
      publishedTime: article.publishedAt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Stoneage Properties Journal`,
      description: article.excerpt,
      images,
    },
  };
}

function formatDate(dateString?: string) {
  if (!dateString) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getJournalArticle(slug),
    getJournalArticles(),
  ]);

  if (!article) notFound();

  const publishedDate = formatDate(article.publishedAt);
  const moreArticles = allArticles
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  const articleImage = article.image
    ? urlFor(article.image).width(1200).height(630).url()
    : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: articleImage ? [articleImage] : undefined,
    datePublished: article.publishedAt || undefined,
    author: {
      "@type": "Organization",
      name: "Stoneage Properties",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Stoneage Properties",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/journal/${article.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Journal",
        item: `${SITE_URL}/journal`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.title,
        item: `${SITE_URL}/journal/${article.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 1. Header with Breadcrumb, Title & Editorial Details */}
      <section className="w-full border-b border-black/10 px-3 pt-24 pb-12 sm:px-6 sm:pt-28 md:px-12 md:pb-16">
        <div className="mb-6">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-black/50 uppercase transition-colors hover:text-black"
          >
            <span className="font-mono transition-transform duration-300 group-hover:-translate-x-1">
              &larr;
            </span>
            <span>Back to Journal</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider text-black/50 uppercase">
              <span>Journal</span>
              {publishedDate && (
                <>
                  <span>&middot;</span>
                  <time dateTime={article.publishedAt}>{publishedDate}</time>
                </>
              )}
              <span>&middot;</span>
              <span>{estimateReadingTime(article.body)}</span>
            </div>

            <h1 className="text-xxl mb-6 leading-tight font-normal tracking-[-1.5px] text-black">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg leading-relaxed font-normal tracking-[-0.5px] text-black/75 sm:text-xl">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Architectural Note Card */}
          <div className="border border-black/10 bg-white p-6 md:col-span-4">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <span className="font-mono text-[10px] tracking-widest text-black/50 uppercase">
                A Note From Stoneage
              </span>
              <LogoSpinner size="w-3.5 h-3.5" className="text-black" />
            </div>
            <p className="mb-2 text-base leading-relaxed font-normal text-black/80">
              {article.note?.line || "Calm homes, lasting craft."}
            </p>
            <p className="font-mono text-xs leading-relaxed tracking-wider text-black/50 uppercase">
              {article.note?.subline || "Solihull, London & Nottingham"}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Framed Editorial Cover Image */}
      {article.image && (
        <section className="w-full px-3 py-8 sm:px-6 md:px-12">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5">
            <Image
              src={urlFor(article.image).width(2400).height(1350).url()}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </section>
      )}

      {/* 3. Editorial Essay Body */}
      <section className="w-full border-b border-black/10 px-3 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20">
        <div className="text-reg mx-auto max-w-3xl leading-relaxed text-black/85">
          {Array.isArray(article.body) && article.body.length > 0 ? (
            <ArticleBody value={article.body} />
          ) : (
            article.excerpt && (
              <Typography variant="body-lg">{article.excerpt}</Typography>
            )
          )}
        </div>
      </section>

      {/* 4. More from the Journal Grid */}
      {moreArticles.length > 0 && (
        <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
                More from the Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="flex items-center gap-2 text-base font-normal tracking-[-0.5px] text-black transition-opacity hover:opacity-70"
            >
              <span>View All Articles</span>
              <span className="font-mono">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {moreArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/journal/${item.slug}`}
                className="group block"
              >
                <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <Image
                    src={urlFor(item.image).width(800).height(600).url()}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-black/10 pt-2.5">
                  <div className="mb-1 flex items-center justify-between font-mono text-xs tracking-wider text-black/50 uppercase">
                    <span>Insight</span>
                    <span className="font-mono text-sm transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="text-lg font-normal tracking-[-0.5px] text-black transition-opacity group-hover:opacity-70">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Standardized Spatial Brief Consultation */}
      <SpatialBriefSection />
    </div>
  );
}
