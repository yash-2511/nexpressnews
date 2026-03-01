import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavbarApp";
import Footer from "@/components/FooterApp";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "News - Breaking News & Top Stories",
  description: "Stay updated with the latest breaking news, top stories, tech news, and more.",
  keywords: "news, breaking news, top stories, technology, sports, business",
  openGraph: {
    title: "News - Breaking News & Top Stories",
    description: "Stay updated with the latest news",
    url: "http://localhost:3000",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Image preloading for performance */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous"
        ></script>
        {/* Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
