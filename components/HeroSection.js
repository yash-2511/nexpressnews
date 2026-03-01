import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

function formatDate(iso, language) {
  if (!iso) return "";
  const d = new Date(iso);
  if (language === 'hi') {
    return d.toLocaleString("hi-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default function HeroSection({ topArticles }) {
  const { t, language } = useLanguage();
  
  if (!topArticles || topArticles.length === 0) {
    return (
      <section className="container-custom my-6">
        <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm p-4 text-sm text-gray-700 dark:text-gray-300">
          {t('noNewsAvailable')}
        </div>
      </section>
    );
  }

  const [main, ...rest] = topArticles;

  return (
    <section className="container-custom mb-6">
      <h2 className="text-base md:text-lg font-bold mt-2 mb-3 border-b border-gray-300 dark:border-gray-700 pb-1 dark:text-gray-100">
        {t('topHindiNews')}
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main story */}
        <Link
          href={{
            pathname: `/article/${main.slug}`,
            query: { ...main },
          }}
          className="group bg-white dark:bg-gray-900 rounded-md overflow-hidden shadow-sm lg:col-span-2 flex flex-col hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          {main.imageUrl ? (
            <div className="relative w-full h-60 md:h-72">
              <Image
                src={main.imageUrl}
                alt={main.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
            </div>
          ) : (
            <div className="w-full h-60 md:h-72 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
              No image available (edge-case test)
            </div>
          )}
          <div className="p-3 sm:p-4 flex flex-col gap-1">
            <h1 className="text-lg sm:text-2xl font-extrabold leading-snug group-hover:text-brandRed dark:text-gray-100">
              {main.title}
            </h1>
            {main.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">
                {main.description}
              </p>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex gap-2">
              {main.sourceName && <span>{main.sourceName}</span>}
              {main.publishedAt && <span>• {formatDate(main.publishedAt, language)}</span>}
            </div>
          </div>
        </Link>

        {/* Side stories */}
        <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm p-2 flex flex-col gap-3">
          {rest.slice(0, 5).map((article) => (
            <Link
              key={article.id}
              href={{
                pathname: `/article/${article.slug}`,
                query: { ...article },
              }}
              className="group flex gap-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-2 last:pb-0"
            >
              {article.imageUrl ? (
                <div className="relative w-24 min-w-[6rem] h-20 rounded overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-24 min-w-[6rem] h-20 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500 text-center px-1">
                  No image
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <h2 className="text-xs sm:text-sm font-semibold leading-snug group-hover:text-brandRed dark:text-gray-100 line-clamp-3">
                  {article.title}
                </h2>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {article.publishedAt && formatDate(article.publishedAt, language)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
