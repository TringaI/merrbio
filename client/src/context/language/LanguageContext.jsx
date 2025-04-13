import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from './translations';

// Create a context for language management
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or default to 'sq' (Albanian)
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('merrbio-language');
    return savedLanguage || 'sq'; // 'sq' for Albanian (default), 'en' for English
  });

  // Get current translations
  const [texts, setTexts] = useState(translations[language]);

  // Update texts when language changes
  useEffect(() => {
    setTexts(translations[language]);
    localStorage.setItem('merrbio-language', language);
    
    // Optionally set html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Function to translate text
  const t = (key) => {
    return texts[key] || key; // Return the key itself if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, texts }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy usage
export const useLanguage = () => useContext(LanguageContext);
