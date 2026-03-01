import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23e0e0e0" width="800" height="450"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23666" text-anchor="middle" dy=".3em" font-family="Arial"%3ENews Article%3C/text%3E%3C/svg%3E'
  },
  source: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['breaking', 'top', 'tech', 'ai', 'defence', 'sports'],
    lowercase: true,
    trim: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Compound index for category pages: filter by category, sort by newest
articleSchema.index({ category: 1, publishedAt: -1 });

// Unique index to prevent duplicate articles by link
articleSchema.index({ link: 1 }, { unique: true });

// Text index for fast search on title/description
articleSchema.index({ title: 'text', description: 'text' });

// Index for sorting by published date (newest first)
articleSchema.index({ publishedAt: -1 });

// TTL index to auto-delete documents older than 7 days
articleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const Article = mongoose.model('Article', articleSchema);

export default Article;
