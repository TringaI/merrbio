import React from 'react';
import { useLanguage } from '../../context/language/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex space-x-1">
      <button 
        onClick={() => setLanguage('sq')}
        className={`px-2 py-1 rounded text-sm font-medium ${
          language === 'sq' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        AL
      </button>
      <button 
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-sm font-medium ${
          language === 'en' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;