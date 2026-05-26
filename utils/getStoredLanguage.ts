import { Language } from "@/contexts/LocalizationContext";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
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
