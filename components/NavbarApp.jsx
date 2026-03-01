"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

const categories = [
  { name: "Breaking", slug: "breaking" },
  { name: "Top", slug: "top" },
  { name: "Tech", slug: "tech" },
  { name: "AI", slug: "ai" },
  { name: "Defence", slug: "defence" },
  { name: "Sports", slug: "sports" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDark(html.classList.contains("dark"));
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-950 shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              News
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <SearchBar />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      {/* Category Links */}
      <div className="overflow-x-auto">
        <div className="container-custom flex gap-4 py-3 text-sm font-medium whitespace-nowrap">
          <Link href="/" className="hover:text-red-600 transition pb-1 border-b-2 border-transparent hover:border-red-600">
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="hover:text-red-600 transition pb-1 border-b-2 border-transparent hover:border-red-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
