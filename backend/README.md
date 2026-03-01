# Indian News Aggregator Backend

Production-ready Node.js backend for aggregating Indian news from legal RSS feeds.

## Features

- ✅ Automatic RSS feed fetching every 10 minutes
- ✅ MongoDB with optimized indexes
- ✅ Category-based news APIs
- ✅ Search functionality
- ✅ Rate limiting and compression
- ✅ Request logging
- ✅ Error handling
- ✅ 48-hour article retention
- ✅ Duplicate prevention
- ✅ High-performance bulk operations

## Tech Stack

- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- rss-parser
- node-cron
- Winston (logging)
- Morgan (HTTP logging)
- CORS
- Compression
- Rate Limiting

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   └── Article.js            # Article schema with indexes
├── routes/
│   ├── newsRoutes.js         # Category endpoints
│   ├── searchRoutes.js       # Search endpoint
│   └── categoryRoutes.js     # Categories list
├── services/
│   ├── rssFetcher.js         # RSS parsing logic
│   └── categoryMapper.js     # Feed-category mapping
├── cron/
│   └── rssJob.js             # Scheduled RSS fetching
├── middleware/
│   ├── logger.js             # Winston logger
│   ├── rateLimiter.js        # Rate limiting
│   └── errorHandler.js       # Error handling
├── server.js                 # Main server file
├── package.json
├── .env.example
└── .gitignore
```

## Installation

### 1. Install MongoDB

Make sure MongoDB is installed and running on your system.

**Windows:**
Download from https://www.mongodb.com/try/download/community

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

### 2. Clone and Setup

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/indian-news-aggregator
NODE_ENV=production
```

## Running the Server

### Production Mode

```bash
npm start
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Categories
```
GET /api/categories
```

### News by Category
```
GET /api/news/breaking?page=1&limit=20
GET /api/news/top?page=1&limit=20
GET /api/news/tech?page=1&limit=20
GET /api/news/ai?page=1&limit=20
GET /api/news/defence?page=1&limit=20
GET /api/news/sports?page=1&limit=20
GET /api/news/general?page=1&limit=20
```

### Single Article
```
GET /api/news/:id
```

### Search
```
GET /api/search?q=keyword&page=1&limit=20
```

## Response Format

### Success Response
```json
{
  "success": true,
  "category": "tech",
  "page": 1,
  "limit": 20,
  "total": 150,
  "totalPages": 8,
  "articles": [
    {
      "_id": "...",
      "title": "Article Title",
      "description": "Article description",
      "link": "https://...",
      "image": "https://...",
      "source": "Source Name",
      "category": "tech",
      "publishedAt": "2026-02-03T10:30:00.000Z"
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## RSS Feeds Configuration

Feeds are configured in `services/categoryMapper.js`:

- **Breaking**: Google News India
- **Top**: India Top Headlines
- **Tech**: Technology India
- **AI**: Artificial Intelligence India
- **Defence**: India Defence & Military
- **Sports**: Sports India Cricket
- **General**: Times of India + Indian Express

## Performance Optimizations

1. **Indexes**: Compound indexes on `category + publishedAt`
2. **Bulk Operations**: Using `bulkWrite` for inserts/updates
3. **Lean Queries**: Using `.lean()` for faster reads
4. **Compression**: GZIP compression for responses
5. **Rate Limiting**: Prevents API abuse
6. **Projection**: Only necessary fields returned
7. **Pagination**: Default 20 items per page
8. **Old Article Cleanup**: Removes articles older than 48 hours

## Cron Job

RSS feeds are fetched:
- Immediately on server startup
- Every 10 minutes thereafter
- Old articles (>48 hours) are automatically deleted

## Logging

- Console logs with color coding
- File logs: `error.log` and `combined.log`
- Automatic log rotation (5MB max per file, 5 files)

## Rate Limits

- General API: 100 requests per 15 minutes
- Search API: 30 requests per 15 minutes

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name indian-news-api
pm2 save
pm2 startup
```

3. Set up MongoDB replica set for production
4. Use reverse proxy (Nginx) for SSL/TLS
5. Monitor logs: `pm2 logs`

## Testing

Test endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Get breaking news
curl http://localhost:5000/api/news/breaking

# Search
curl "http://localhost:5000/api/search?q=technology"
```

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check MongoDB URI in `.env`

**No Articles Fetched:**
- Check internet connection
- RSS feeds may be temporarily unavailable
- Check logs for errors

**Port Already in Use:**
- Change PORT in `.env` file
- Kill process using port: `npx kill-port 5000`

## License

MIT
