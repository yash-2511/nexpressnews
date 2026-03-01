import Head from "next/head";
import fs from "fs";
import path from "path";
import HeroSection from "../components/HeroSection";
import ArticleGridSection from "../components/ArticleGridSection";
import { fetchAllCategories } from "../lib/newsApi";
import { useLanguage } from "../context/LanguageContext";

export default function Home({ news, usedMock, hasAnyNews }) {
  const { t } = useLanguage();
  const {
    top = [],
    general = [],
    sports = [],
    entertainment = [],
    technology = [],
    business = [],
  } = news;

  return (
    <>
      <Head>
        <title>Nexpress - News Front Page</title>
        <meta
          name="description"
          content="Nexpress - Your trusted source for latest news across India with city-wise coverage."
        />
        <meta property="og:title" content="Nexpress - News Front Page" />
        <meta
          property="og:description"
          content="Nexpress - Your trusted source for latest news across India with city-wise coverage."
        />
        <meta property="og:type" content="website" />
      </Head>

      {usedMock && (
        <div className="container-custom mt-3">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 text-xs text-yellow-800 dark:text-yellow-300 px-3 py-2 rounded">
            {t('apiFailedMock')}
          </div>
        </div>
      )}

      {!hasAnyNews && (
        <div className="container-custom mt-4">
          <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm p-4 text-sm text-gray-700 dark:text-gray-300">
            {t('noNewsAvailable')}
          </div>
        </div>
      )}

      <HeroSection topArticles={top} />

      <ArticleGridSection
        id="india"
        title={t('topStories')}
        articles={general}
      />
      <ArticleGridSection id="sports" title={t('sportsNews')} articles={sports} />
      <ArticleGridSection
        id="entertainment"
        title={t('entertainmentNews')}
        articles={entertainment}
      />
      <ArticleGridSection
        id="technology"
        title={t('technologyNews')}
        articles={technology}
      />
      <ArticleGridSection
        id="business"
        title={t('businessNews')}
        articles={business}
      />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const apiKey =
    process.env.NEWSDATA_API_KEY ||
    process.env.NEWS_API_KEY ||
    "pub_904fa42b5b684d0ab38b7811ccf92c2a";
  let news = {};
  let usedMock = false;
  
  // Get city from cookie or default to null
  const cookies = req.headers.cookie || '';
  const cityMatch = cookies.match(/selectedCity=([^;]+)/);
  const selectedCity = cityMatch ? decodeURIComponent(cityMatch[1]) : null;

  try {
    if (!apiKey) {
      throw new Error("Missing NewsData API key");
    }
    news = await fetchAllCategories(apiKey, selectedCity);
  } catch (error) {
    console.error("Error fetching from NewsData.io, falling back to mock data:", error);
    const mockPath = path.join(process.cwd(), "data", "mockNews.json");
    const raw = fs.readFileSync(mockPath, "utf-8");
    news = JSON.parse(raw);
    usedMock = true;
  }

  const arrays = [
    news.top || [],
    news.general || [],
    news.sports || [],
    news.entertainment || [],
    news.technology || [],
    news.business || [],
  ];
  const hasAnyNews = arrays.some((arr) => Array.isArray(arr) && arr.length > 0);

  return {
    props: {
      news,
      usedMock,
      hasAnyNews,
    },
  };
}
