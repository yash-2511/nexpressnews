import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 mt-16">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              News
            </span>
          </h3>
          <p className="text-gray-400 text-sm">Your trusted source for breaking news and in-depth stories.</p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/breaking" className="hover:text-red-600 transition">Breaking</Link></li>
            <li><Link href="/top" className="hover:text-red-600 transition">Top</Link></li>
            <li><Link href="/tech" className="hover:text-red-600 transition">Tech</Link></li>
            <li><Link href="/ai" className="hover:text-red-600 transition">AI</Link></li>
          </ul>
        </div>

        {/* More */}
        <div>
          <h4 className="font-semibold mb-4">More</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/defence" className="hover:text-red-600 transition">Defence</Link></li>
            <li><Link href="/sports" className="hover:text-red-600 transition">Sports</Link></li>
            <li><Link href="/general" className="hover:text-red-600 transition">General</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-red-600 transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-red-600 transition">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-red-600 transition">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2024 News Website. All rights reserved.</p>
      </div>
    </footer>
  );
}
