import type { Metadata } from "next";
import Link from "next/link";
import { fetchArticleById, fetchNewsCategory } from "@/lib/api";
import AdBanner from "@/components/AdBanner";
import NewsGrid from "@/components/NewsGrid";
import BackButton from "@/components/BackButton";
import NewsImage from "@/components/NewsImage";

const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e0e0e0' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23666' text-anchor='middle' dy='.3em' font-family='Arial'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = await fetchArticleById(params.id);

  return {
    title: article?.title || "Article",
    description: article?.description || "Read the full article",
    openGraph: {
      title: article?.title || "Article",
      description: article?.description || "Read the full article",
      images: [article?.image || article?.imageUrl || DEFAULT_IMAGE],
    },
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const [article, relatedNews] = await Promise.all([
    fetchArticleById(params.id),
    fetchNewsCategory("breaking", 1, 6),
  ]);

  if (!article) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The article you are looking for doesn't exist.</p>
          <Link href="/" className="text-red-600 hover:text-red-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = article.image || article.imageUrl || DEFAULT_IMAGE;
  const title = article.title || "Untitled";
  const description = article.description || article.summary || "";
  const source = article.source || "Unknown Source";
  const publishedAt = article.publishedAt || article.pubDate || new Date().toISOString();
  const content = article.content || article.description || "";
  const link = article.link || article.url || "#";

  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Article Header */}
      <div className="container-custom py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <article>
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <span className="font-semibold text-gray-900 dark:text-white">{source}</span>
            <span>•</span>
            <time>{formattedDate}</time>
          </div>

          {/* Featured Image */}
          <NewsImage
            src={imageUrl}
            alt={title}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            width={1200}
            height={675}
            containerClassName="w-full h-96 sm:h-[500px] mb-8 rounded-lg overflow-hidden"
          />

          {/* Description/Summary */}
          {description && (
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {/* Ad Banner */}
          <div className="my-8">
            <AdBanner format="horizontal" />
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* Read Full Article Button */}
          {link && link !== "#" && (
            <div className="my-8">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Read Full Article →
              </a>
            </div>
          )}

          {/* Ad Banner */}
          <div className="my-8">
            <AdBanner format="square" />
          </div>
        </article>
      </div>

      {/* Related Articles */}
      {relatedNews.articles && relatedNews.articles.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900 py-12 mt-12">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <NewsGrid articles={relatedNews.articles.slice(0, 3)} />
          </div>
        </section>
      )}
    </div>
  );
}
