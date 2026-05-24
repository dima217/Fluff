import { Language } from "@/contexts/LocalizationContext";

export const getAppLocale = (language: Language) => {
  switch (language) {
    case "ru":
      return "ru-RU";
    case "be":
      return "be-BY";
    default:
      return "en-US";
  }
};
