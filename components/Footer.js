import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-brandDark dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-6">
      <div className="container-custom py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-sm">
        <div>© {new Date().getFullYear()} Nexpress. {t('allRightsReserved')}</div>
        <div className="flex gap-3">
          <a href="#" className="hover:text-white dark:hover:text-gray-200 transition">{t('about')}</a>
          <a href="#" className="hover:text-white dark:hover:text-gray-200 transition">{t('contact')}</a>
          <a href="#" className="hover:text-white dark:hover:text-gray-200 transition">{t('privacy')}</a>
        </div>
      </div>
    </footer>
  );
}
