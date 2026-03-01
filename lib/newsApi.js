const NEWS_API_BASE = "https://newsdata.io/api/1/latest";

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

function getCacheKey(keyword, language) {
  return `${keyword}:${language}`;
}

function getFromCache(keyword, language) {
  const key = getCacheKey(keyword, language);
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[Cache HIT] ${key}`);
    return cached.data;
  }
  
  if (cached) {
    cache.delete(key);
  }
  return null;
}

function setInCache(keyword, language, data) {
  const key = getCacheKey(keyword, language);
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`[Cache SET] ${key}`);
}

export function slugify(str) {
  if (!str) return "article";
  return (
    str
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 80) || "article"
  );
}

function mapArticle(raw, categoryKey, index) {
  const slugBase = slugify(raw.title || `article-${index}`);
  const slug = `${slugBase}-${index}`;

  return {
    id: `${categoryKey}-${index}`,
    title: raw.title || "Untitled",
    description: raw.description || null,
    // keep real URL if present, else null (handled in components)
    imageUrl: raw.image_url || null,
    content: raw.content || null,
    author: Array.isArray(raw.creator) ? raw.creator.join(", ") : raw.creator || null,
    sourceName: raw.source_id || null,
    publishedAt: raw.pubDate || null,
    url: raw.link || null,
    category: categoryKey,
    slug,
  };
}

// Works with NewsData.io latest endpoint
export async function fetchCategory(keyword, apiKey) {
  if (!apiKey) {
    throw new Error("Missing NewsData API key");
  }

  // Check cache first
  const cached = getFromCache(keyword, "en");
  if (cached) {
    return cached;
  }

  const url = new URL(NEWS_API_BASE);
  url.searchParams.set("q", keyword);
  url.searchParams.set("language", "en");
  url.searchParams.set("size", "10");
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    const message = data?.results?.message || data?.message || res.statusText;
    throw new Error(`NewsData.io error: ${res.status} ${message}`);
  }

  const articles = (data.results || []).map((a, idx) =>
    mapArticle(a, keyword, idx)
  );

  // Cache the results
  setInCache(keyword, "en", articles);

  return articles;
}

export async function fetchAllCategories(apiKey, city = null) {
  const categories = {
    top: city ? `${city} India` : "India news",
    general: city ? `${city} news` : "latest news",
    sports: city ? `${city} sports` : "sports news",
    entertainment: city ? `${city} entertainment` : "entertainment news",
    technology: city ? `${city} technology` : "technology news",
    business: city ? `${city} business` : "business news",
  };

  const result = {};
  let hasError = false;

  for (const [key, keyword] of Object.entries(categories)) {
    try {
      const articles = await fetchCategory(keyword, apiKey);
      result[key] = articles;
    } catch (e) {
      hasError = true;
      console.error("Error fetching category", key, e);
      result[key] = [];
    }
  }

  const allEmpty = Object.values(result).every(
    (list) => !Array.isArray(list) || list.length === 0
  );

  if (hasError && allEmpty) {
    throw new Error("All NewsData.io category fetches failed");
  }

  return result;
}
