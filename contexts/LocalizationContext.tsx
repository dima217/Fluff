import React, { createContext, ReactNode, useContext, useState } from "react";
import { MMKV } from "react-native-mmkv";
import { translations } from "./translations";

export type Language = "ru" | "be" | "en";

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

const storage = new MMKV();
const LANGUAGE_KEY = "app_language";

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = storage.getString(LANGUAGE_KEY);
    if (
      savedLanguage &&
      (savedLanguage === "ru" ||
        savedLanguage === "be" ||
        savedLanguage === "en")
    ) {
      return savedLanguage as Language;
    }
    return "en"; // Default language
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.set(LANGUAGE_KEY, lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
