import { createContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  toggleLanguage: (newLanguage: string) => void; 
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'zh', 
  toggleLanguage: () => {} 
});

export const LanguageProvider = ({ children }:any) => {


  const [language, setLanguage] = useState('zh'); 

  const toggleLanguage = (key:string) => {
    setLanguage(key)
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};