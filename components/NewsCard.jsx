"use client";

import Link from "next/link";
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import NewsImage from "./NewsImage";

function NewsCard({ article, index }) {
  if (!article) return null;

  const title = article.title || "Untitled";
  const description = article.description || article.summary || "";
  const source = article.source || "Unknown Source";
  const publishedAt = article.publishedAt || article.pubDate || new Date().toISOString();
  const slug = article.slug || article._id || article.id;
  const timeAgo = publishedAt ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true }) : "Recently";

  return (
    <Link href={`/article/${slug}`}>
      <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative">
          <NewsImage
            src={article?.image || article?.imageUrl}
            alt={title}
            priority={index && index < 2}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            containerClassName="w-full h-48 sm:h-56 bg-gray-200 dark:bg-gray-800"
            className="hover:scale-105 transition-transform duration-300"
          />
          {index && index < 3 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Top
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-gray-900 dark:text-white mb-2 hover:text-red-600 dark:hover:text-red-500 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-grow">
            {description.substring(0, 100)}...
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-3">
            <span className="font-medium truncate">{source}</span>
            <span className="whitespace-nowrap ml-2">{timeAgo}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default memo(NewsCard);
