import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { Paperclip } from "@/components/decorative/Paperclip";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { getJournalArticle, getJournalArticles } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/seo";

function estimateReadingTime(body: unknown): string {
  if (!Array.isArray(body)) return "3 min read";
  const words = body
    .filter((block): block is { children?: { text?: string }[] } => block?._type === "block")
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
    author: { "@type": "Organization", name: "Stoneage Properties", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Stoneage Properties", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/journal/${article.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journal", item: `${SITE_URL}/journal` },
      {
        "@type": "ListItem",
        position: 2,
        name: article.title,
        item: `${SITE_URL}/journal/${article.slug}`,
      },
    ],
  };

  return (
    <div className="pt-16 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="px-6 pt-8 sm:px-12">
        <Link
          href="/journal"
          className="group text-ink-subtle hover:text-ink inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Journal
        </Link>
      </div>

      {/* Header */}
      <div className="px-6 pt-8 pb-16 sm:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-3">
            <span className="text-ink-subtle mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-widest uppercase">
              <span>Journal</span>
              {publishedDate && (
                <>
                  <span aria-hidden className="text-line">
                    &middot;
                  </span>
                  <time dateTime={article.publishedAt}>{publishedDate}</time>
                </>
              )}
            </span>
            <h1 className="font-display text-ink mb-6 text-3xl leading-[1.12] font-medium tracking-tight sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            {article.excerpt && (
              <Typography variant="body-lg" className="whitespace-pre-line">
                {article.excerpt}
              </Typography>
            )}

            <div className="border-line mt-8 gap-x-8 gap-y-3 border-t pt-4 font-mono text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-ink-subtle text-xs tracking-widest uppercase">
                  Reading Time
                </span>
                <span className="text-ink mt-1 whitespace-nowrap">
                  {estimateReadingTime(article.body)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative -rotate-2 transition-transform duration-500 hover:rotate-0 lg:col-span-1 lg:mt-2">
            <div className="pointer-events-none absolute -top-7 left-6 z-20">
              <Paperclip className="h-auto w-10 drop-shadow-md" />
            </div>

            <div className="bg-paper-card border-line text-ink relative overflow-hidden rounded border p-6 shadow-md">
              <div className="border-line mb-6 flex items-center justify-between gap-2 border-b pb-4">
                <span className="text-ink-subtle min-w-0 flex-1 truncate font-mono text-[10px] tracking-widest uppercase">
                  A NOTE FROM STONEAGE
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="font-display text-xs font-medium">Stoneage</span>
                  <LogoSpinner size="w-3.5 h-3.5" className="text-ink" />
                </div>
              </div>
              <div className="notepad-lines font-display text-ink-muted py-2 text-base italic">
                <p className="mb-0 pl-1 leading-loose">
                  {article.note?.line || "Calm homes, lasting craft."}
                </p>
                <p className="text-ink-subtle pl-1 font-mono text-sm leading-loose not-italic">
                  {article.note?.subline ||
                    "30+ years delivering structural excellence across the UK."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      <div className="bg-paper-dim relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
        <Image
          src={urlFor(article.image).width(2400).height(1029).url()}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Body */}
      <div className="px-6 py-16 sm:px-12 sm:py-24">
        {Array.isArray(article.body) && article.body.length > 0 ? (
          <ArticleBody value={article.body} />
        ) : (
          article.excerpt && (
            <Typography variant="body-lg">{article.excerpt}</Typography>
          )
        )}
      </div>

      {/* More journal entries */}
      {moreArticles.length > 0 && (
        <section className="border-line bg-paper-dim border-t px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex items-end justify-between gap-4">
              <Typography variant="display-sm" as="h2">
                More from the Journal
              </Typography>
              <Link
                href="/journal"
                className="group text-ink-muted hover:text-ink hidden shrink-0 items-center gap-2 font-mono text-xs tracking-wider uppercase transition-colors sm:inline-flex"
              >
                View All
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {moreArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/journal/${item.slug}`}
                  className="group block"
                >
                  <div className="border-line bg-paper-card relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                    <Image
                      src={urlFor(item.image).width(700).height(525).url()}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <h3 className="font-display text-ink group-hover:text-ink-muted text-lg leading-snug font-medium transition-colors">
                      {item.title}
                    </h3>
                    <LogoSpinner
                      spin="hover"
                      size="h-3 w-3"
                      className="text-ink-subtle mt-1 shrink-0 group-hover:text-ink"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SpatialBriefSection />
    </div>
  );
}
