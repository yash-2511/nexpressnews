export const FEEDS = {
  tech: [
    'https://feeds.feedburner.com/gadgets360-latest',
    'https://www.digit.in/ot-feed/rss/'
  ],
  defence: [
    'http://idrw.org/feed/',
    'https://www.livefistdefence.com/feed/'
  ],
  ai: [
    'https://analyticsindiamag.com/feed/'
  ],
  sports: [
    'https://sportstar.thehindu.com/rssfeeds/',
    'https://www.insidesport.in/feed/'
  ],
  general: [
    'https://feeds.feedburner.com/ndtvnews-top-stories',
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms'
  ],
  breaking: [
    'https://feeds.feedburner.com/ndtvnews-top-stories',
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms'
  ]
};

export const CATEGORIES = ['tech', 'defence', 'ai', 'sports', 'general', 'breaking'];

export const getFeedsForCategory = (category) => {
  const normalized = String(category || '').toLowerCase().trim();
  return FEEDS[normalized] || [];
};
