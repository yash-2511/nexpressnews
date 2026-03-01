import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    citySelect: 'Select City',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    greeting: 'Hello',
    
    // Tabs
    home: 'Home',
    topNews: 'Top News',
    sports: 'Sports',
    entertainment: 'Entertainment',
    technology: 'Technology',
    business: 'Business',
    
    // Auth Modal
    signInTitle: 'Sign In',
    signUpTitle: 'Sign Up',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    enterName: 'Enter your name',
    enterEmail: 'email@example.com',
    enterPassword: 'Enter password',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUpButton: 'Sign Up',
    fillAllFields: 'Please fill all fields',
    
    // City Selector
    selectCityTitle: 'Select Your City',
    cityNote: 'Selecting a city will show you local news from that city',
    
    // Sections
    topHindiNews: 'Top News',
    topStories: 'Top Stories',
    sportsNews: 'Sports',
    entertainmentNews: 'Entertainment',
    technologyNews: 'Technology',
    businessNews: 'Business',
    
    // Messages
    noNewsAvailable: 'No news available right now. Please try again later.',
    noNewsInSection: 'No news available in this section.',
    apiFailedMock: 'Live API call failed, showing mock/demo news for layout verification.',
    
    // Footer
    allRightsReserved: 'All rights reserved.',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    
    // Article Detail
    noImageArticle: 'No image for this article.',
    fullContentUnavailable: 'Full content is not directly available from the API in this demo. Please click the original source link below to read the complete story.',
    readFullStory: 'Read full story',
  },
  hi: {
    // Navbar
    citySelect: 'सिटी चुनें',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    greeting: 'नमस्ते',
    
    // Tabs
    home: 'होम',
    topNews: 'टॉप खबरें',
    sports: 'खेल',
    entertainment: 'मनोरंजन',
    technology: 'टेक्नोलॉजी',
    business: 'बिजनेस',
    
    // Auth Modal
    signInTitle: 'साइन इन करें',
    signUpTitle: 'साइन अप करें',
    name: 'नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    enterName: 'अपना नाम दर्ज करें',
    enterEmail: 'email@example.com',
    enterPassword: 'पासवर्ड दर्ज करें',
    noAccount: 'खाता नहीं है?',
    haveAccount: 'पहले से खाता है?',
    signUpButton: 'साइन अप',
    fillAllFields: 'कृपया सभी फील्ड भरें',
    
    // City Selector
    selectCityTitle: 'अपना शहर चुनें',
    cityNote: 'शहर चुनने पर आपको उस शहर की स्थानीय खबरें मिलेंगी',
    
    // Sections
    topHindiNews: 'टॉप न्यूज',
    topStories: 'टॉप खबरें',
    sportsNews: 'खेल',
    entertainmentNews: 'मनोरंजन',
    technologyNews: 'टेक्नोलॉजी',
    businessNews: 'बिजनेस',
    
    // Messages
    noNewsAvailable: 'इस समय कोई खबर उपलब्ध नहीं है। कृपया थोड़ी देर बाद दोबारा कोशिश करें।',
    noNewsInSection: 'इस सेक्शन में अभी कोई खबर उपलब्ध नहीं है।',
    apiFailedMock: 'Live API कॉल में समस्या आई, इसलिए यहाँ मॉक / डेमो न्यूज़ दिखाई जा रही है।',
    
    // Footer
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    privacy: 'गोपनीयता',
    
    // Article Detail
    noImageArticle: 'इस लेख के लिए कोई छवि नहीं है।',
    fullContentUnavailable: 'पूरी सामग्री इस डेमो में API से सीधे उपलब्ध नहीं है। कृपया पूरी कहानी पढ़ने के लिए नीचे दिए गए मूल स्रोत लिंक पर क्लिक करें।',
    readFullStory: 'पूरा लेख यहाँ पढ़ें',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
