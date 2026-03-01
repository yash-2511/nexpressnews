import type { Metadata } from "next";
import { fetchNewsCategory } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";
import Pagination from "@/components/Pagination";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Technology News - Latest Tech Updates",
  description: "Latest technology news, gadgets, software, and tech industry updates.",
};

export const revalidate = 300;

export default async function TechPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");

  const data = await fetchNewsCategory("tech", page, limit);
  const articles = data.articles || [];
  const totalPages = Math.ceil((data.total || 0) / limit);

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-2">💻 Technology</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Latest gadgets, software, and tech industry news</p>

      <div className="mb-8">
        <AdBanner format="horizontal" />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tech news available</p>
        </div>
      ) : (
        <>
          <NewsGrid articles={articles} />
          <Pagination currentPage={page} totalPages={totalPages} category="tech" />

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
