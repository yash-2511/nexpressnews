import express from 'express';
import { CATEGORIES } from '../services/categoryMapper.js';
import Article from '../models/Article.js';

const router = express.Router();

// GET /api/categories - Get all categories with article counts
router.get('/', async (req, res, next) => {
  try {
    const categoryCounts = await Article.aggregate([
      {
        $match: {
          image: { $ne: null, $exists: true }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const categories = CATEGORIES.map(category => {
      const found = categoryCounts.find(item => item._id === category);
      return {
        name: category,
        count: found ? found.count : 0
      };
    });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
});

export default router;
