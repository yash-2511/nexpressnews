"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({ currentPage = 1, totalPages = 1, category = "" }) {
  const searchParams = useSearchParams();
  const pageNum = parseInt(searchParams.get("page")) || 1;
  const limit = searchParams.get("limit") || 20;

  const baseUrl = category ? `/${category}` : "/";
  const getPageUrl = (page) => `${baseUrl}?page=${page}&limit=${limit}`;

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      {pageNum > 1 && (
        <Link
          href={getPageUrl(pageNum - 1)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          ← Previous
        </Link>
      )}

      {[...Array(Math.min(5, totalPages))].map((_, i) => {
        let pageToShow = pageNum - 2 + i;
        if (pageToShow < 1) pageToShow = 1 + i;
        if (pageToShow > totalPages) return null;

        return (
          <Link
            key={pageToShow}
            href={getPageUrl(pageToShow)}
            className={`px-3 py-2 rounded transition ${
              pageToShow === pageNum
                ? "bg-red-600 text-white font-semibold"
                : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {pageToShow}
          </Link>
        );
      })}

      {pageNum < totalPages && (
        <Link
          href={getPageUrl(pageNum + 1)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
