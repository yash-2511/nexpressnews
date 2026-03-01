# Production-Ready News Website Frontend

Complete Next.js 14 news website with modern design, backend API integration, AdSense support, and optimized performance.

## ✨ Features

- ✅ **Next.js 14 App Router** - Modern React framework with streaming & suspense
- ✅ **Multiple Category Pages** - Breaking, Top, Tech, AI, Defence, Sports, General
- ✅ **Full-Featured Articles** - Detailed view with images, metadata, and sharing
- ✅ **Search Functionality** - Instant article search with pagination
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Dark Mode** - Full dark theme with localStorage persistence
- ✅ **Google AdSense** - Ready for monetization with multiple ad formats
- ✅ **SEO Optimized** - Meta tags, sitemap, robots.txt, structured data
- ✅ **Server-Side Rendering** - ISR for fast initial page loads
- ✅ **Image Optimization** - Next.js Image component with lazy loading
- ✅ **Error Handling** - Graceful fallbacks and loading states
- ✅ **Performance** - Target <2s load time, code splitting, caching

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend API
Edit `lib/api.js` line 1:
```javascript
const API_BASE_URL = "http://localhost:5000/api";  // Change to your backend
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/                          # Next.js App Router pages
├── layout.tsx                # Root layout with AdSense
├── page.tsx                  # Home page
├── globals.css               # Global styles
├── sitemap.ts                # SEO sitemap
├── robots.ts                 # robots.txt
├── breaking/page.tsx         # Breaking news
├── top/page.tsx              # Top stories
├── tech/page.tsx             # Tech news
├── ai/page.tsx               # AI news
├── defence/page.tsx          # Defence news
├── sports/page.tsx           # Sports news
├── general/page.tsx          # General news
├── article/[id]/page.tsx     # Article detail
└── search/page.tsx           # Search results

components/                   # React components
├── NavbarApp.jsx             # Navigation with search
├── SearchBar.jsx             # Search input
├── NewsCard.jsx              # Article card
├── NewsGrid.jsx              # Grid layout
├── Pagination.jsx            # Page navigation
├── AdBanner.jsx              # AdSense placeholder
└── FooterApp.jsx             # Footer

lib/                          # Utilities
├── api.js                    # Backend API functions
└── config.js                 # Centralized configuration

public/                       # Static files
styles/                       # Legacy styles (using Tailwind now)
tailwind.config.js           # Tailwind CSS config
next.config.js               # Next.js config
package.json                 # Dependencies
tsconfig.json                # TypeScript config
```

## 📚 Available Pages

| Page | Path | Features |
|------|------|----------|
| Home | `/` | Featured news from 3 categories |
| Breaking | `/breaking?page=1&limit=20` | Latest breaking news with pagination |
| Top | `/top?page=1&limit=20` | Top stories |
| Tech | `/tech?page=1&limit=20` | Technology news |
| AI | `/ai?page=1&limit=20` | AI & machine learning |
| Defence | `/defence?page=1&limit=20` | Defence & security |
| Sports | `/sports?page=1&limit=20` | Sports updates |
| General | `/general?page=1&limit=20` | General news |
| Search | `/search?q=query&page=1` | Search results |
| Article | `/article/{id}` | Full article detail |

## 🔌 Backend API Integration

### Expected Endpoints

Your backend should provide:

```
GET /api/news/breaking?page=1&limit=20
GET /api/news/top?page=1&limit=20
GET /api/news/tech?page=1&limit=20
GET /api/news/ai?page=1&limit=20
GET /api/news/defence?page=1&limit=20
GET /api/news/sports?page=1&limit=20
GET /api/news/general?page=1&limit=20
GET /api/news/{id}
GET /api/search?q=query&page=1&limit=20
```

### Response Format

```json
{
  "articles": [
    {
      "_id": "article-id",
      "title": "Article Title",
      "description": "Short description",
      "content": "Full article content",
      "image": "https://...",
      "source": "Source Name",
      "link": "https://original-article.com",
      "publishedAt": "2024-02-04T12:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

See `API_INTEGRATION.md` for detailed documentation.

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  brandRed: "#d8232a",      // Primary color
  brandDark: "#111111",     // Dark text
  brandGray: "#f5f5f5"      // Light background
}
```

### Categories
Edit `components/NavbarApp.jsx`:
```javascript
const categories = [
  { name: "Breaking", slug: "breaking" },
  { name: "Top", slug: "top" },
  // Add your categories here
];
```

### Ads
Edit `components/AdBanner.jsx` and `app/layout.tsx`:
```javascript
data-ad-client="ca-pub-YOUR_ADSENSE_ID"
data-ad-slot="YOUR_SLOT_ID"
```

## 📊 SEO Features

- Dynamic meta titles and descriptions per page
- Open Graph tags for social sharing
- XML sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Semantic HTML structure
- Image alt text
- Structured data ready

## ⚡ Performance Optimization

- **Image Optimization**: Next.js Image component with WebP
- **Code Splitting**: Automatic with App Router
- **CSS**: Tailwind CSS utility classes (no runtime)
- **Lazy Loading**: Images and components
- **ISR**: Incremental Static Regeneration (5 min revalidation)
- **Caching**: Browser and server-side caching

### Performance Targets
- Page Load: < 2.5s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🌙 Dark Mode

- Toggle in navbar
- Persists in localStorage
- System preference detection
- Full component support via `dark:` prefix

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Flexible grid layouts
- Touch-friendly interactions
- Fast on slow networks

## 🔐 Security

- No hardcoded secrets
- Environment variables for config
- CORS handling
- XSS protection (React built-in)
- Input sanitization

## 📦 Deployment

Supports deployment on:
- **Vercel** (recommended, zero-config)
- **AWS** (EC2, ECS, Lambda)
- **Railway**
- **DigitalOcean App Platform**
- **Heroku**
- **Self-hosted** (Docker, VPS)

See `DEPLOYMENT.md` for detailed instructions.

## 📖 Documentation

- **QUICKSTART.md** - Get started in 5 minutes
- **SETUP_GUIDE.md** - Comprehensive setup and configuration
- **API_INTEGRATION.md** - Backend API specifications
- **COMPONENTS.md** - Component documentation
- **DEPLOYMENT.md** - Deployment guides for all platforms

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Development Tools

- Next.js 14 with App Router
- React 18 with Server Components
- TypeScript for type safety
- TailwindCSS for styling
- date-fns for date formatting
- ESLint for code quality

## 📞 Support & Troubleshooting

### Articles Not Loading?
1. Verify backend is running on `http://localhost:5000`
2. Check API URLs in `lib/api.js`
3. Verify CORS headers in backend
4. Check browser console for errors

### Dark Mode Not Working?
1. Clear browser localStorage
2. Verify theme script in `app/layout.tsx`
3. Check CSS classes in component

### Build Errors?
```bash
rm -r .next node_modules
npm install
npm run build
```

### Performance Issues?
1. Run `npm run build` to test production build
2. Use Chrome DevTools Lighthouse
3. Check for N+1 API calls
4. Verify image optimization

## 🎯 Next Steps

1. ✅ Clone or modify this project
2. ✅ Connect your backend API
3. ✅ Test all pages locally
4. ✅ Add Google AdSense ID (optional)
5. ✅ Update site metadata
6. ✅ Deploy to production

## 📄 License

MIT - Feel free to use and modify

## 🌟 Credits

Built with:
- Next.js 14
- React 18
- TailwindCSS
- TypeScript
- date-fns

---

**Ready to launch?** Start with `QUICKSTART.md` or `SETUP_GUIDE.md`

**Need API help?** See `API_INTEGRATION.md`

**Want to deploy?** Check `DEPLOYMENT.md`

**Component questions?** Read `COMPONENTS.md`
