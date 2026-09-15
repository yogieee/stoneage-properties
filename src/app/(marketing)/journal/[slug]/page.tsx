import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Typography } from "@/components/ui/Typography";
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

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getJournalArticle(slug);

  if (!article) notFound();

  return (
    <div className="pt-16 sm:pt-24">
      <div className="px-6 pb-16 sm:px-12">
        <span className="text-ink-subtle mb-3 block font-mono text-xs tracking-widest uppercase">
          Journal
        </span>
        <Typography variant="display-lg" as="h1">
          {article.title}
        </Typography>
      </div>

      <div className="border-line relative aspect-[16/9] w-full overflow-hidden border-y">
        <Image
          src={urlFor(article.image).width(2000).height(1125).url()}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-12">
        {article.excerpt && (
          <Typography variant="body-lg" className="mb-8">
            {article.excerpt}
          </Typography>
        )}

        {Array.isArray(article.body) && article.body.length > 0 && (
          <div className="prose prose-neutral max-w-none">
            <PortableText value={article.body as never} />
          </div>
        )}
      </div>
    </div>
  );
}
