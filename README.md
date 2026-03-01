LiveHindustan front-page clone in Next.js (v3).

- Uses NewsAPI /v2/everything (works with free plan) to fetch Hindi news.
- next/image configured with remotePatterns to allow any HTTP(S) image domain.
- Edge cases:
  * Explicit test card without image to show layout handling.
  * Fallback to mock JSON if API fails.
  * "No news available" message if all sections empty.
  * Simple top loading bar on route change.
