import cron from 'node-cron';
import Article from '../models/Article.js';
import { fetchAllFeedsByCategory } from '../services/rssFetcher.js';
import { FEEDS } from '../services/categoryMapper.js';
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

const cleanOldArticles = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48);

    const result = await Article.deleteMany({
      publishedAt: { $lt: cutoffDate }
    });

    if (result.deletedCount > 0) {
      logger.info(`Cleaned ${result.deletedCount} old articles`);
    }
  } catch (error) {
    logger.error(`Error cleaning old articles: ${error.message}`);
  }
};

const fetchAndStoreArticles = async () => {
  try {
    logger.info('Starting RSS feed fetch...');
    
    const articles = await fetchAllFeedsByCategory(FEEDS);

    if (articles.length === 0) {
      logger.warn('No articles fetched from any feed');
      return;
    }

    // Group articles by category for logging
    const articlesByCategory = {};
    articles.forEach(article => {
      const cat = String(article.category || 'unknown').toLowerCase().trim();
      articlesByCategory[cat] = (articlesByCategory[cat] || 0) + 1;
    });

    logger.info(`Total articles fetched: ${articles.length}`);
    Object.entries(articlesByCategory).forEach(([cat, count]) => {
      logger.info(`  Saved ${count} ${cat} articles`);
    });

    // Use bulkWrite for better performance
    const bulkOps = articles.map(article => ({
      updateOne: {
        filter: { link: article.link },
        update: { $set: article },
        upsert: true
      }
    }));

    const result = await Article.bulkWrite(bulkOps, { ordered: false });

    logger.info(`Successfully processed articles - Inserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}`);

    // Clean old articles after fetching new ones
    await cleanOldArticles();

  } catch (error) {
    logger.error(`Error in RSS job: ${error.message}`);
  }
};

export const startRSSJob = () => {
  // Run immediately on startup
  logger.info('Running initial RSS fetch...');
  fetchAndStoreArticles();

  // Run every 10 minutes
  cron.schedule('*/10 * * * *', () => {
    logger.info('Running scheduled RSS fetch...');
    fetchAndStoreArticles();
  });

  logger.info('RSS cron job started - runs every 10 minutes');
};
