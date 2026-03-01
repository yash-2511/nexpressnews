import type { Metadata } from "next";
import { searchNews } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";
import Pagination from "@/components/Pagination";
import AdBanner from "@/components/AdBanner";
import BackButton from "@/components/BackButton";

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const query = searchParams.q || "";
  return {
    title: `Search: ${query} - News`,
    description: `Search results for "${query}"`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; limit?: string };
}) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  if (!query) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Search News</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter a search query to find articles</p>
        </div>
      </div>
    );
  }

  const data = await searchNews(query, page, limit);
  const articles = data.articles || [];
  const totalPages = Math.ceil((data.total || 0) / limit);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-4xl font-bold mb-2 mt-4">Search Results</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Results for: <span className="font-semibold text-gray-900 dark:text-white">"{query}"</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Found {data.total || 0} articles
        </p>
      </div>

      <div className="mb-8">
        <AdBanner format="horizontal" />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No articles found for "{query}"
          </p>
        </div>
      ) : (
        <>
          <NewsGrid articles={articles} />
          {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} category={`search?q=${query}`} />}

          {articles.length > 5 && (
            <div className="my-12">
              <AdBanner format="square" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
