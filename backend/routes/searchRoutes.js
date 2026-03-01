import express from 'express';
import Article from '../models/Article.js';
import { CATEGORIES } from '../services/categoryMapper.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /api/search?q=keyword&page=1&limit=20
router.get('/', searchLimiter, async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim() === '') {
      const error = new Error('Search query is required');
      error.statusCode = 400;
      throw error;
    }

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    const articles = await Article.find(
      { 
        $text: { $search: q },
        image: { $ne: null, $exists: true }
      },
      { score: { $meta: 'textScore' } }
    )
      .select('_id title image link source publishedAt description')
      .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const total = await Article.countDocuments({ 
      $text: { $search: q },
      image: { $ne: null, $exists: true }
    });

    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    res.json({
      success: true,
      query: q,
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
      articles
    });
  } catch (error) {
    next(error);
  }
});

export default router;
