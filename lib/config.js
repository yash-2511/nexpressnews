// Configuration file for the News Website
// Update these values for your specific deployment

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: "http://localhost:5000/api",
    TIMEOUT: 10000, // milliseconds
    REVALIDATE_HOME: 300, // 5 minutes
    REVALIDATE_CATEGORY: 300, // 5 minutes
    REVALIDATE_ARTICLE: 3600, // 1 hour
  },

  // Site Information
  SITE: {
    NAME: "News",
    DOMAIN: "https://news.example.com",
    DESCRIPTION: "Stay updated with the latest breaking news and top stories",
    LANGUAGE: "en",
    TIMEZONE: "UTC",
  },

  // Categories
  CATEGORIES: [
    { name: "Breaking", slug: "breaking", icon: "🔴", description: "Breaking news and general updates" },
    { name: "Top", slug: "top", icon: "⭐", description: "Most popular stories" },
    { name: "Tech", slug: "tech", icon: "💻", description: "Technology news" },
    { name: "AI", slug: "ai", icon: "🤖", description: "Artificial Intelligence news" },
    { name: "Defence", slug: "defence", icon: "🛡️", description: "Defence & security" },
    { name: "Sports", slug: "sports", icon: "⚽", description: "Sports updates" },
  ],

  // Google AdSense
  ADSENSE: {
    ENABLED: false, // Set to true after AdSense approval
    CLIENT_ID: "ca-pub-xxxxxxxxxxxxxxxx", // Replace with your Google AdSense ID
    SLOTS: {
      BANNER: "1234567890",
      SQUARE: "0987654321",
      VERTICAL: "1122334455",
    },
  },

  // Pagination
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MIN_LIMIT: 10,
    MAX_LIMIT: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50],
  },

  // Images
  IMAGES: {
    DEFAULT_IMAGE: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23e0e0e0' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%23666' text-anchor='middle' dy='.3em' font-family='Arial'%3ENews Image%3C/text%3E%3C/svg%3E",
    PLACEHOLDER_RATIO: "16:9",
    QUALITY: 85,
    FORMATS: ["webp", "jpg"],
  },

  // SEO
  SEO: {
    KEYWORDS: "news, breaking news, top stories, technology, sports, business",
    OG_IMAGE: "https://news.example.com/og-image.jpg",
    TWITTER_HANDLE: "@newssite",
    TWITTER_CARD: "summary_large_image",
  },

  // Performance
  PERFORMANCE: {
    LAZY_LOAD_IMAGES: true,
    CACHE_ARTICLES: true,
    COMPRESS_IMAGES: true,
    MIN_FONT_SIZE: 12,
  },

  // Theme
  THEME: {
    PRIMARY_COLOR: "#d8232a", // Red
    DARK_BG: "#0f0f0f",
    LIGHT_BG: "#f5f5f5",
    DARK_TEXT: "#f5f5f5",
    LIGHT_TEXT: "#111111",
  },

  // UI
  UI: {
    NAVBAR_STICKY: true,
    FOOTER_LINKS_COLS: 4,
    SHOW_RELATED_ARTICLES: true,
    RELATED_ARTICLES_COUNT: 3,
    SHOW_BREADCRUMBS: true,
  },

  // Feature Flags
  FEATURES: {
    SEARCH_ENABLED: true,
    PAGINATION_ENABLED: true,
    DARK_MODE_ENABLED: true,
    SHARING_ENABLED: true,
    COMMENTS_ENABLED: false,
    BOOKMARKS_ENABLED: false,
    NEWSLETTER_ENABLED: false,
  },
};

// Helper function to get category by slug
export function getCategoryBySlug(slug) {
  return CONFIG.CATEGORIES.find((cat) => cat.slug === slug);
}

// Helper function to get all category slugs
export function getAllCategorySlugs() {
  return CONFIG.CATEGORIES.map((cat) => cat.slug);
}
