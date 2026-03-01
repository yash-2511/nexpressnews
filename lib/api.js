const API_BASE_URL = "http://localhost:5000/api";

export async function fetchNewsCategory(category, page = 1, limit = 20) {
  try {
    const normalizedCategory = String(category || '').toLowerCase().trim();
    if (!normalizedCategory) {
      throw new Error("Invalid category");
    }

    const url = `${API_BASE_URL}/news/${normalizedCategory}?page=${page}&limit=${limit}`;
    const response = await fetch(url, { 
      next: { revalidate: 300 },
      headers: {
        'Cache-Control': 'public, max-age=300'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch ${normalizedCategory}`);
    }
    
    const data = await response.json();
    const sanitizeImage = (url) => {
      if (!url) return url;
      if (typeof url !== 'string') return url;
      if (url.includes('via.placeholder.com')) return '';
      return url;
    };
    
    // Transform articles to have proper field names for components
    const articles = Array.isArray(data.articles) ? data.articles.map(article => ({
      _id: article._id,
      id: article._id,
      slug: article._id,
      title: article.title,
      description: article.description,
      image: sanitizeImage(article.image),
      imageUrl: sanitizeImage(article.image),
      source: article.source,
      sourceName: article.source,
      link: article.link,
      url: article.link,
      publishedAt: article.publishedAt,
      pubDate: article.publishedAt,
      category: article.category
    })) : [];
    
    return {
      ...data,
      category: normalizedCategory,
      articles
    };
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return { 
      articles: [], 
      total: 0, 
      page, 
      limit, 
      category: category.toLowerCase(),
      error: error.message 
    };
  }
}

export async function fetchArticleById(id) {
  try {
    const url = `${API_BASE_URL}/news/${id}`;
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch article`);
    }
    
    const data = await response.json();
    const article = data.article || data;
    const sanitizeImage = (url) => {
      if (!url) return url;
      if (typeof url !== 'string') return url;
      if (url.includes('via.placeholder.com')) return '';
      return url;
    };
    
    // Transform article to have proper field names for components
    return {
      _id: article._id,
      id: article._id,
      slug: article._id,
      title: article.title,
      description: article.description,
      image: sanitizeImage(article.image),
      imageUrl: sanitizeImage(article.image),
      source: article.source,
      sourceName: article.source,
      link: article.link,
      url: article.link,
      publishedAt: article.publishedAt,
      pubDate: article.publishedAt,
      category: article.category,
      content: article.content || article.description
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function searchNews(query, page = 1, limit = 20) {
  try {
    const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    const response = await fetch(url, { 
      next: { revalidate: 300 },
      headers: {
        'Cache-Control': 'public, max-age=300'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to search news`);
    }
    
    const data = await response.json();
    const sanitizeImage = (url) => {
      if (!url) return url;
      if (typeof url !== 'string') return url;
      if (url.includes('via.placeholder.com')) return '';
      return url;
    };
    
    // Transform articles to have proper field names for components
    const articles = Array.isArray(data.articles) ? data.articles.map(article => ({
      _id: article._id,
      id: article._id,
      slug: article._id,
      title: article.title,
      description: article.description,
      image: sanitizeImage(article.image),
      imageUrl: sanitizeImage(article.image),
      source: article.source,
      sourceName: article.source,
      link: article.link,
      url: article.link,
      publishedAt: article.publishedAt,
      pubDate: article.publishedAt,
      category: article.category
    })) : [];
    
    return {
      ...data,
      articles
    };
  } catch (error) {
    console.error("Error searching news:", error);
    return { articles: [], total: 0, page, limit, error: error.message };
  }
}

export async function fetchMultipleCategories(categories = ["top", "breaking", "tech"]) {
  try {
    const promises = categories.map(cat => 
      fetchNewsCategory(cat, 1, 10).catch(() => ({ 
        articles: [], 
        category: cat 
      }))
    );
    const results = await Promise.all(promises);
    
    const data = {};
    categories.forEach((cat, idx) => {
      data[cat] = results[idx]?.articles || [];
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching multiple categories:", error);
    return {};
  }
}
