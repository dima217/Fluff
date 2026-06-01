import React, { createContext, ReactNode, useContext, useState } from "react";
import { MMKV } from "react-native-mmkv";
import { getTranslation } from "@/utils/i18n";

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

  const t = (key: string): string => getTranslation(language, key);

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
