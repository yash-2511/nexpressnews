import SectionHeader from "./SectionHeader";
import ArticleCard from "./ArticleCard";
import { useLanguage } from "../context/LanguageContext";

export default function ArticleGridSection({ id, title, articles }) {
  const { t } = useLanguage();
  
  return (
    <section className="mb-4">
      <SectionHeader id={id} title={title} />
      <div className="container-custom">
        {articles && articles.length > 0 ? (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm p-4 text-xs text-gray-600 dark:text-gray-400">
            {t('noNewsInSection')}
          </div>
        )}
      </div>
    </section>
  );
}
