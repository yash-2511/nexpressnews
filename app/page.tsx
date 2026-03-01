import type { Metadata } from "next";
import { fetchMultipleCategories } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "News - Home",
  description: "Breaking news, top stories, and tech updates. Stay informed with the latest news.",
};

export const revalidate = 300; // ISR - revalidate every 5 minutes

export default async function Home() {
  const { top = [], breaking = [] } = await fetchMultipleCategories([
    "top",
    "breaking",
  ]);

  return (
    <div className="container-custom py-8">
      {/* Ad Banner Below Navbar */}
      <div className="mb-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Breaking News Section */}
      {breaking.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm">
              🔴 BREAKING
            </span>
            <h2 className="text-3xl font-bold">Breaking News</h2>
          </div>
          <NewsGrid articles={breaking.slice(0, 6)} />
        </section>
      )}

      {/* Ad Banner */}
      <div className="my-12">
        <AdBanner format="horizontal" />
      </div>

      {/* Top News Section */}
      {top.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top Stories</h2>
          <NewsGrid articles={top.slice(0, 6)} />
        </section>
      )}

      {/* Ad Banner */}
      <div className="my-12">
        <AdBanner format="square" />
      </div>
    </div>
  );
}
