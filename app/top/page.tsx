import type { Metadata } from "next";
import { fetchNewsCategory } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";
import Pagination from "@/components/Pagination";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Top News - Popular Stories",
  description: "Top stories and most popular news from around the world.",
};

export const revalidate = 300;

export default async function TopPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const data = await fetchNewsCategory("top", page, limit);
  const articles = data.articles || [];
  const totalPages = Math.ceil((data.total || 0) / limit);

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-2">⭐ Top News</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Most popular and trending stories</p>

      <div className="mb-8">
        <AdBanner format="horizontal" />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No top news available</p>
        </div>
      ) : (
        <>
          <NewsGrid articles={articles} />
          <Pagination currentPage={page} totalPages={totalPages} category="top" />

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
