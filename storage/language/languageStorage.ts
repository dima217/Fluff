import { storage } from "../config";

export type Language = "ru" | "be" | "en";

const LANGUAGE_KEY = "app_language";

export function getStoredLanguage(): Language {
  const savedLanguage = storage.getString(LANGUAGE_KEY);
  if (
    savedLanguage === "ru" ||
    savedLanguage === "be" ||
    savedLanguage === "en"
  ) {
    return savedLanguage;
  }
  return "en";
}

export function setStoredLanguage(lang: Language): void {
  storage.set(LANGUAGE_KEY, lang);
}
