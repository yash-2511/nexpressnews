import Parser from 'rss-parser';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'content:encoded'],
      ['media:credit', 'media:credit'],
      ['media:description', 'media:description']
    ]
  }
});

const MAX_DESCRIPTION_LENGTH = 300;
const GOOGLE_NEWS_HOST = 'news.google.com';
const DUPLICATE_THRESHOLD = 0.85;

// -----------------------------
// Helpers: HTML/Text
// -----------------------------
const decodeHTMLEntities = (text) => {
  if (!text) return '';
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
};

const stripHTML = (html) => {
  if (!html) return '';
  return decodeHTMLEntities(
    html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
};

const limitText = (text, maxLength = MAX_DESCRIPTION_LENGTH) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trim()}...`;
};

// Similarity checker - Levenshtein distance
const stringSimilarity = (s1, s2) => {
  const str1 = String(s1).toLowerCase().replace(/\W/g, '');
  const str2 = String(s2).toLowerCase().replace(/\W/g, '');
  
  if (str1.length === 0 || str2.length === 0) return 0;
  
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (j = 0; j <= len2; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return 1 - (matrix[len2][len1] / maxLen);
};

// -----------------------------
// Helpers: URL extraction
// -----------------------------
const isGoogleNewsRedirect = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes(GOOGLE_NEWS_HOST) && parsed.pathname.includes('/rss/articles');
  } catch {
    return false;
  }
};

const safeDecodeURIComponent = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.href;
  } catch {
    return '';
  }
};

const extractUrlFromText = (text) => {
  if (!text) return '';

  // Look for explicit URL query params
  const urlParamMatch = text.match(/[?&](url|u)=([^&]+)/i);
  if (urlParamMatch && urlParamMatch[2]) {
    return safeDecodeURIComponent(urlParamMatch[2]);
  }

  // Look for href in HTML
  const hrefMatch = text.match(/href=["']([^"']+)["']/i);
  if (hrefMatch && hrefMatch[1]) {
    return safeDecodeURIComponent(hrefMatch[1]);
  }

  // Fallback: first plain URL
  const plainUrlMatch = text.match(/https?:\/\/[^\s"'>]+/i);
  if (plainUrlMatch && plainUrlMatch[0]) {
    return safeDecodeURIComponent(plainUrlMatch[0]);
  }

  return '';
};

const getRealLink = (item) => {
  const candidates = [
    item.link,
    item.guid,
    item?.content,
    item?.['content:encoded'],
    item?.description,
    item?.summary,
    item?.contentSnippet
  ].filter(Boolean);

  for (const candidate of candidates) {
    const extracted = extractUrlFromText(candidate);
    const normalized = normalizeUrl(extracted || candidate);
    if (normalized && !isGoogleNewsRedirect(normalized)) {
      return normalized;
    }
  }

  return '';
};

// -----------------------------
// Helpers: Image extraction
// -----------------------------
const cleanImage = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // Reject data URIs
  if (trimmed.startsWith('data:')) return null;

  // Reject base64
  if (trimmed.startsWith('base64')) return null;

  // Must be http or https
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return null;

  try {
    const urlObj = new URL(trimmed);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') return null;
    
    // Prefer https
    if (urlObj.protocol === 'http:') {
      return trimmed.replace('http://', 'https://');
    }
    
    return trimmed;
  } catch {
    return null;
  }
};

const extractImageFromHTML = (html) => {
  if (!html) return null;
  
  // Try multiple patterns to find image URLs
  // Pattern 1: Standard img tag with src attribute
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    const cleaned = cleanImage(imgMatch[1]);
    if (cleaned) return cleaned;
  }

  // Pattern 2: img tag with single quotes or no quotes
  const imgMatch2 = html.match(/<img[^>]+src=([^\s>]+)/i);
  if (imgMatch2 && imgMatch2[1]) {
    const url = imgMatch2[1].replace(/['"]/g, '');
    const cleaned = cleanImage(url);
    if (cleaned) return cleaned;
  }

  // Pattern 3: Picture tag with source
  const picMatch = html.match(/<picture[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);
  if (picMatch && picMatch[1]) {
    const cleaned = cleanImage(picMatch[1]);
    if (cleaned) return cleaned;
  }

  // Pattern 4: Look for first http/https URL in img tag
  const httpMatch = html.match(/<img[^>]*https?:\/\/[^\s"'>\]]+/i);
  if (httpMatch && httpMatch[0]) {
    const urlMatch = httpMatch[0].match(/https?:\/\/[^\s"'>\]]+/);
    if (urlMatch) {
      const cleaned = cleanImage(urlMatch[0]);
      if (cleaned) return cleaned;
    }
  }

  return null;
};

const extractImage = (item) => {
  // Step 1: Check enclosure tag (NDTV, Sportstar use this)
  if (item?.enclosure?.url && item?.enclosure?.type?.includes('image')) {
    const cleaned = cleanImage(item.enclosure.url);
    if (cleaned) return cleaned;
  }
  
  // Also check enclosure without strict type checking (some feeds omit type)
  if (item?.enclosure?.url && !item?.enclosure?.type?.includes('audio') && !item?.enclosure?.type?.includes('video')) {
    const cleaned = cleanImage(item.enclosure.url);
    if (cleaned) return cleaned;
  }

  // Step 2: Check media:thumbnail (Common in many feeds)
  if (item?.['media:thumbnail']?.[0]?.$ && item['media:thumbnail'][0].$.url) {
    const cleaned = cleanImage(item['media:thumbnail'][0].$.url);
    if (cleaned) return cleaned;
  }

  // Step 3: Check media:content tag (Times of India uses this)
  if (item?.['media:content']?.[0]?.$ && item['media:content'][0].$.url) {
    const cleaned = cleanImage(item['media:content'][0].$.url);
    if (cleaned) return cleaned;
  }

  // Also check media:content as array of objects
  if (Array.isArray(item?.['media:content'])) {
    for (const media of item['media:content']) {
      if (media?.url) {
        const cleaned = cleanImage(media.url);
        if (cleaned) return cleaned;
      }
      if (media?.$?.url && media.$.url.includes('image')) {
        const cleaned = cleanImage(media.$.url);
        if (cleaned) return cleaned;
      }
    }
  }

  // Step 4: Regex the description for image URLs (The Hindu/Digit embed images in description)
  const htmlCandidates = [
    item?.content,
    item?.['content:encoded'],
    item?.description,
    item?.summary
  ].filter(Boolean);

  for (const html of htmlCandidates) {
    const img = extractImageFromHTML(html);
    if (img) return img;
  }

  return null;
};

// -----------------------------
// Helpers: Source extraction
// -----------------------------
const toTitleCase = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const domainToSourceName = (hostname) => {
  if (!hostname) return 'Unknown';
  const cleanHost = hostname.replace(/^www\./i, '').toLowerCase();
  const parts = cleanHost.split('.').filter(Boolean);
  const main = parts.length >= 2 ? parts[parts.length - 2] : parts[0];

  const knownAcronyms = new Set(['ndtv', 'toi', 'bbc', 'cnn', 'ani', 'pti', 'ibn', 'zee']);
  if (knownAcronyms.has(main)) return main.toUpperCase();

  return main
    .split('-')
    .map((segment) => (segment.length <= 3 ? segment.toUpperCase() : toTitleCase(segment)))
    .join(' ');
};

const extractSource = (realLink) => {
  try {
    const url = new URL(realLink);
    return domainToSourceName(url.hostname);
  } catch {
    return 'Unknown';
  }
};

// -----------------------------
// Core: RSS Fetching & Deduplication
// -----------------------------
export const fetchRSSFeed = async (feedUrl, category) => {
  try {
    const feed = await parser.parseURL(feedUrl);
    const articles = [];

    const normalizedCategory = String(category || '').toLowerCase().trim();
    if (!normalizedCategory || !['general', 'breaking', 'sports', 'tech', 'ai', 'defence'].includes(normalizedCategory)) {
      logger.warn(`Invalid category "${normalizedCategory}" for feed: ${feedUrl}`);
      return [];
    }

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48);

    for (const item of feed.items) {
      try {
        const rawTitle = stripHTML(item.title || '').trim();
        if (!rawTitle) continue;

        const realLink = getRealLink(item).trim();
        if (!realLink) continue;

        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        const normalizedDate = isNaN(publishedAt.getTime()) ? new Date() : publishedAt;
        if (normalizedDate < cutoffDate) continue;

        const rawDescription = stripHTML(
          item.contentSnippet || item.description || item.summary || item.content || ''
        );
        const description = limitText(rawDescription, MAX_DESCRIPTION_LENGTH);

        const article = {
          title: rawTitle,
          description,
          link: realLink,
          image: extractImage(item),
          source: extractSource(realLink),
          category: normalizedCategory,
          publishedAt: normalizedDate,
          createdAt: new Date(),
          titleHash: Buffer.from(rawTitle.toLowerCase()).toString('base64')
        };

        if (!article.image) continue;

        articles.push(article);
      } catch (err) {
        logger.warn(`Failed to process item from ${feedUrl}: ${err.message}`);
      }
    }

    logger.info(`Fetched ${articles.length} articles from ${normalizedCategory} feed: ${feedUrl}`);
    return articles;
  } catch (error) {
    logger.error(`Failed to fetch RSS feed ${feedUrl}: ${error.message}`);
    return [];
  }
};

export const fetchAllFeeds = async (feedsConfig) => {
  const allArticles = [];
  const seenTitles = new Map();
  const categoryArticles = {};

  for (const config of feedsConfig) {
    const { url, category } = config;
    try {
      const articles = await fetchRSSFeed(url, category);
      
      if (!categoryArticles[category]) {
        categoryArticles[category] = [];
      }

      for (const article of articles) {
        let isDuplicate = false;

        // Check exact link duplicates
        if (allArticles.some(a => a.link === article.link)) {
          isDuplicate = true;
        }

        // Check title similarity within same category
        if (!isDuplicate && seenTitles.has(article.titleHash)) {
          const similarity = stringSimilarity(
            article.title,
            seenTitles.get(article.titleHash).title
          );
          if (similarity > DUPLICATE_THRESHOLD) {
            isDuplicate = true;
          }
        }

        if (!isDuplicate) {
          allArticles.push(article);
          seenTitles.set(article.titleHash, article);
          categoryArticles[category].push(article);
        }
      }
    } catch (err) {
      logger.error(`Error processing feed ${url}: ${err.message}`);
    }
  }

  // Log by category
  for (const [cat, articles] of Object.entries(categoryArticles)) {
    if (articles.length > 0) {
      logger.info(`  ${cat}: ${articles.length} articles`);
    }
  }

  logger.info(`Total articles fetched (deduped): ${allArticles.length}`);
  return allArticles;
};

export const fetchAllFeedsByCategory = async (feedsMap) => {
  const allArticles = [];
  const seenTitles = new Map();
  const categoryArticles = {};

  for (const [category, feedUrls] of Object.entries(feedsMap)) {
    const normalizedCategory = String(category || '').toLowerCase().trim();
    if (!normalizedCategory) continue;

    logger.info(`Fetching ${normalizedCategory} feeds...`);
    
    if (!categoryArticles[normalizedCategory]) {
      categoryArticles[normalizedCategory] = [];
    }

    for (const feedUrl of feedUrls) {
      try {
        const articles = await fetchRSSFeed(feedUrl, normalizedCategory);

        for (const article of articles) {
          let isDuplicate = false;

          if (allArticles.some(a => a.link === article.link)) {
            isDuplicate = true;
          }

          if (!isDuplicate && seenTitles.has(article.titleHash)) {
            const similarity = stringSimilarity(
              article.title,
              seenTitles.get(article.titleHash).title
            );
            if (similarity > DUPLICATE_THRESHOLD) {
              isDuplicate = true;
            }
          }

          if (!isDuplicate) {
            allArticles.push(article);
            seenTitles.set(article.titleHash, article);
            categoryArticles[normalizedCategory].push(article);
          }
        }
      } catch (err) {
        logger.error(`Error fetching ${normalizedCategory} feed ${feedUrl}: ${err.message}`);
      }
    }
  }

  for (const [cat, articles] of Object.entries(categoryArticles)) {
    if (articles.length > 0) {
      logger.info(`  ${cat}: ${articles.length} articles`);
    }
  }

  logger.info(`Total articles fetched (deduped): ${allArticles.length}`);
  return allArticles;
};
