/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable image optimization for better performance and SEO
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 24 * 365, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'static.toiimg.com' },
      { protocol: 'https', hostname: 'toiimg.com' },
      { protocol: 'https', hostname: 'timesofindia.indiatimes.com' },
      { protocol: 'https', hostname: 'images.hindustantimes.com' },
      { protocol: 'https', hostname: 'www.hindustantimes.com' },
      { protocol: 'https', hostname: 'hindustantimes.com' },
      { protocol: 'https', hostname: 'static.hindustantimes.com' },
      { protocol: 'https', hostname: 'media.hindustantimes.com' },
      { protocol: 'https', hostname: 'images.indianexpress.com' },
      { protocol: 'https', hostname: 'indianexpress.com' },
      { protocol: 'https', hostname: 'www.thehindu.com' },
      { protocol: 'https', hostname: 'th-i.thgim.com' },
      { protocol: 'https', hostname: 'cdnimages.thehindu.com' },
      { protocol: 'https', hostname: 'static.thehindu.com' },
      { protocol: 'https', hostname: 'static.ndtv.com' },
      { protocol: 'https', hostname: 'cdn.ndtv.com' },
      { protocol: 'https', hostname: 'images.news18.com' },
      { protocol: 'https', hostname: 'static.pib.gov.in' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'cdn.dnaindia.com' },
      { protocol: 'https', hostname: 'resize.indiatvnews.com' },
      { protocol: 'https', hostname: 'akm-img-a-in.tosshub.com' },
      { protocol: 'https', hostname: 'i.cdn.newsbytesapp.com' },
      { protocol: 'https', hostname: 's3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'images.moneycontrol.com' },
      { protocol: 'https', hostname: 'media.assettype.com' },
      { protocol: 'https', hostname: 'images.livemint.com' }
    ],
  },
};

module.exports = nextConfig;
