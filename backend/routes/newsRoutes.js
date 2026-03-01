import express from 'express';
import Article from '../models/Article.js';
import { CATEGORIES } from '../services/categoryMapper.js';
import { searchLimiter } from '../middleware/rateLimiter.js';
import logger from '../middleware/logger.js';

const router = express.Router();

// Helper function to get articles by category
const getArticlesByCategory = async (category, page = 1, limit = 20) => {
  try {
    // Validate category
    const validCategories = CATEGORIES;
    const normalizedCategory = String(category).toLowerCase().trim();
    
    if (!validCategories.includes(normalizedCategory)) {
      return {
        success: false,
        category: normalizedCategory,
        page,
        limit,
        total: 0,
        totalPages: 0,
        articles: [],
        error: `Invalid category: ${category}`
      };
    }

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = Math.max(0, (parsedPage - 1) * parsedLimit);
    
    // Query with image filter and index optimization
    const articles = await Article.find({ 
      category: normalizedCategory,
      image: { $ne: null, $exists: true }
    })
      .select('_id title image link source publishedAt description')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()
      .exec();

    const total = await Article.countDocuments({ 
      category: normalizedCategory,
      image: { $ne: null, $exists: true }
    });
    const totalPages = Math.ceil(total / parsedLimit);

    logger.info(`Fetched ${articles.length} articles for category: ${normalizedCategory} (page ${parsedPage})`);

    return {
      success: true,
      category: normalizedCategory,
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages,
      articles: articles.length > 0 ? articles : []
    };
  } catch (error) {
    logger.error(`Error fetching category ${category}: ${error.message}`);
    return {
      success: false,
      category,
      page,
      limit,
      total: 0,
      totalPages: 0,
      articles: [],
      error: error.message
    };
  }
};

// GET /api/news/breaking
router.get('/breaking', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await getArticlesByCategory('breaking', page, limit);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/news/top
router.get('/top', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await getArticlesByCategory('top', page, limit);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/news/tech
router.get('/tech', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await getArticlesByCategory('tech', page, limit);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/news/ai
router.get('/ai', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await getArticlesByCategory('ai', page, limit);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/news/defence
router.get('/defence', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await getArticlesByCategory('defence', page, limit);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/news/sports
router.get('/sports', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await getArticlesByCategory('sports', page, limit);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/news/:id - Get single article by ID
router.get('/:id', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .select('_id title image link source publishedAt description')
      .lean();

    if (!article) {
      const error = new Error('Article not found');
      error.statusCode = 404;
      throw error;
    }

    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200');
    res.json({
      success: true,
      article
    });
  } catch (error) {
    if (error.name === 'CastError') {
      error.message = 'Invalid article ID';
      error.statusCode = 400;
    }
    next(error);
  }
});

export default router;
