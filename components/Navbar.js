import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthModal from "./AuthModal";
import CitySelector from "./CitySelector";

const primaryTabs = [
  { label: { en: 'Home', hi: 'होम' }, id: "/" },
  { label: { en: 'Top News', hi: 'टॉप खबरें' }, id: "india" },
  { label: { en: 'Sports', hi: 'खेल' }, id: "sports" },
  { label: { en: 'Entertainment', hi: 'मनोरंजन' }, id: "entertainment" },
  { label: { en: 'Technology', hi: 'टेक्नोलॉजी' }, id: "technology" },
  { label: { en: 'Business', hi: 'बिजनेस' }, id: "business" },
];

export default function Navbar() {
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user, signOut, mounted: authMounted } = useAuth();
  const { language, toggleLanguage, t, mounted: langMounted } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const handleSmoothScroll = (e, id) => {
    if (id === "/") return; // Let Link handle home navigation
    
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    // Reload page with city parameter
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <>
    <header className="bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
      {/* Top bar with logo */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brandRed to-red-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                NE
              </div>
              <div className="leading-none">
                <div className="text-2xl font-extrabold text-brandRed tracking-tight">
                  Nexpress
                </div>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
            <button 
              onClick={() => setShowCitySelector(true)}
              className="hover:text-brandRed dark:hover:text-brandRed transition"
            >
              {t('citySelect')}
            </button>
            
            {authMounted && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-brandRed font-medium">{t('greeting')}, {user.name}</span>
                    <button
                      onClick={signOut}
                      className="hover:text-brandRed dark:hover:text-brandRed transition"
                    >
                      {t('signOut')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="hover:text-brandRed dark:hover:text-brandRed transition"
                  >
                    {t('signIn')}
                  </button>
                )}
              </>
            )}

            {langMounted && (
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium"
                title="Switch Language"
              >
                {language === 'en' ? 'हिं' : 'EN'}
              </button>
            )}

            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            {langMounted && (
              <button
                onClick={toggleLanguage}
                className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-xs font-medium"
              >
                {language === 'en' ? 'हिं' : 'EN'}
              </button>
            )}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">Menu</span>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="border-b border-brandRed/60">
        <nav className="container-custom flex items-center overflow-x-auto gap-6 text-sm font-medium text-gray-800 dark:text-gray-200 py-2">
          {primaryTabs.map((tab, idx) => (
            <Link
              key={tab.id}
              href={tab.id === "/" ? "/" : "#" + tab.id}
              onClick={(e) => handleSmoothScroll(e, tab.id)}
              className={`whitespace-nowrap pb-1 border-b-2 transition ${
                idx === 0
                  ? "border-brandRed text-brandRed"
                  : "border-transparent hover:border-brandRed/60 hover:text-brandRed dark:hover:text-brandRed"
              }`}
            >
              {tab.label[language]}
            </Link>
          ))}
        </nav>
      </div>
    </header>

    <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    <CitySelector 
      isOpen={showCitySelector} 
      onClose={() => setShowCitySelector(false)}
      onCitySelect={handleCitySelect}
    />
  </>
  );
}
