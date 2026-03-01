import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const cities = [
  { name: { en: 'Delhi', hi: 'दिल्ली' }, value: 'delhi' },
  { name: { en: 'Mumbai', hi: 'मुंबई' }, value: 'mumbai' },
  { name: { en: 'Bangalore', hi: 'बेंगलुरु' }, value: 'bangalore' },
  { name: { en: 'Kolkata', hi: 'कोलकाता' }, value: 'kolkata' },
  { name: { en: 'Chennai', hi: 'चेन्नई' }, value: 'chennai' },
  { name: { en: 'Hyderabad', hi: 'हैदराबाद' }, value: 'hyderabad' },
  { name: { en: 'Pune', hi: 'पुणे' }, value: 'pune' },
  { name: { en: 'Ahmedabad', hi: 'अहमदाबाद' }, value: 'ahmedabad' },
  { name: { en: 'Jaipur', hi: 'जयपुर' }, value: 'jaipur' },
  { name: { en: 'Lucknow', hi: 'लखनऊ' }, value: 'lucknow' },
];

export default function CitySelector({ isOpen, onClose, onCitySelect }) {
  const [selectedCity, setSelectedCity] = useState('');
  const { language, t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved) {
      setSelectedCity(saved);
    }
  }, []);

  if (!isOpen) return null;

  const handleCitySelect = (cityValue) => {
    setSelectedCity(cityValue);
    localStorage.setItem('selectedCity', cityValue);
    // Also set as cookie for SSR
    document.cookie = `selectedCity=${cityValue}; path=/; max-age=31536000`;
    onCitySelect(cityValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('selectCityTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {cities.map((city) => (
            <button
              key={city.value}
              onClick={() => handleCitySelect(city.value)}
              className={`w-full text-left px-4 py-3 rounded-md transition ${
                selectedCity === city.value
                  ? 'bg-brandRed text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {city.name[language]}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          {t('cityNote')}
        </div>
      </div>
    </div>
  );
}
