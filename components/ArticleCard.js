import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

function formatDate(iso, language) {
  if (!iso) return "";
  const d = new Date(iso);
  if (language === 'hi') {
    return d.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "short",
    });
  } else {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  }
}

export default function ArticleCard({ article }) {
  const { language } = useLanguage();
  const hasImage = !!article.imageUrl;

  return (
    <Link
      href={{
        pathname: `/article/${article.slug}`,
        query: { ...article },
      }}
      className={`group bg-white dark:bg-gray-900 rounded-md overflow-hidden shadow-sm flex flex-col hover:shadow-md dark:hover:shadow-lg transition-shadow ${
        !hasImage ? "border border-dashed border-gray-300 dark:border-gray-700" : ""
      }`}
    >
      {hasImage && (
        <div className="relative w-full h-36 md:h-40">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </div>
      )}

      <div className="p-3 flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug line-clamp-3 group-hover:text-brandRed dark:text-gray-100">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {article.description}
          </p>
        )}
        <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 flex justify-between">
          <span>{article.sourceName}</span>
          {article.publishedAt && <span>{formatDate(article.publishedAt, language)}</span>}
        </div>

        {!hasImage && (
          <div className="mt-2 text-[10px] text-amber-600 font-medium">
            (Edge case) This article has no image.
          </div>
        )}
      </div>
    </Link>
  );
}
