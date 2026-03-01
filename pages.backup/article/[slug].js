import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";

function formatFullDate(iso, language) {
  if (!iso) return "";
  const d = new Date(iso);
  if (language === 'hi') {
    return d.toLocaleString("hi-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return d.toLocaleString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default function ArticleDetail() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const {
    title,
    description,
    imageUrl,
    content,
    author,
    sourceName,
    publishedAt,
    url,
  } = router.query;

  const pageTitle = title || "Article";
  const metaDescription =
    description || (content ? String(content).slice(0, 150) : "News article");

  return (
    <>
      <Head>
        <title>{pageTitle} | Nexpress</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {url && <meta property="og:url" content={url} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className="container-custom max-w-3xl bg-white dark:bg-gray-900 mt-4 mb-8 p-4 sm:p-6 rounded-md shadow-sm">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-2 leading-snug dark:text-gray-100">
          {title}
        </h1>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex flex-wrap gap-2">
          {sourceName && <span>{sourceName}</span>}
          {author && <span>• {author}</span>}
          {publishedAt && <span>• {formatFullDate(publishedAt, language)}</span>}
        </div>

        {imageUrl ? (
          <div className="relative w-full h-60 sm:h-80 mb-4">
            <Image
              src={imageUrl}
              alt={title || "Article image"}
              fill
              className="object-cover rounded"
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </div>
        ) : (
          <div className="w-full h-40 mb-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
            {t('noImageArticle')}
          </div>
        )}

        {description && (
          <p className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
            {description}
          </p>
        )}

        <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 space-y-3">
          {content ? (
            <p>{content}</p>
          ) : (
            <p>
              {t('fullContentUnavailable')}
            </p>
          )}
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-sm font-semibold text-brandRed hover:underline"
          >
            {t('readFullStory')}
          </a>
        )}
      </article>
    </>
  );
}
