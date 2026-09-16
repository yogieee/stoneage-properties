import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { StoneageMonolithLogo } from "@/components/decorative/StoneageMonolithLogo";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { getJournalArticle, getJournalArticles } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

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

  return {
    title: `${article.title} | Stoneage Properties Journal`,
    description: article.excerpt,
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

  return (
    <div className="pt-16 sm:pt-24">
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
        <div className="mx-auto max-w-4xl">
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
          <Typography variant="display-lg" as="h1">
            {article.title}
          </Typography>
          {article.excerpt && (
            <Typography variant="body-lg" className="mt-6 max-w-2xl">
              {article.excerpt}
            </Typography>
          )}
        </div>
      </div>

      {/* Cover image */}
      <div className="px-6 sm:px-12">
        <div className="border-line bg-paper-dim relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-xl border shadow-md sm:aspect-[16/9]">
          <Image
            src={urlFor(article.image).width(2000).height(1125).url()}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-12 sm:py-24">
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
                    <StoneageMonolithLogo
                      variant="mark"
                      className="text-ink-subtle mt-1 h-3 w-3 shrink-0 transition-transform duration-500 group-hover:rotate-90 group-hover:text-ink"
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
