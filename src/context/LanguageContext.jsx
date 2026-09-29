import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/dict';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('zariboutique_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('zariboutique_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'sw' : 'en'));
  };

  const t = (key, params = {}) => {
    const dict = translations[lang] || translations.en;
    let val = dict[key] || translations.en[key] || key;

    if (typeof val === 'string' && params) {
      Object.keys(params).forEach((paramKey) => {
        val = val.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    return val;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
