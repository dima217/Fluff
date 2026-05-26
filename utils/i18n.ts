import { Language } from "@/contexts/LocalizationContext";
import { translations } from "@/contexts/translations";

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations[language];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          return key;
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

export function formatTranslation(
  template: string,
  params: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function translate(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const template = getTranslation(language, key);
  return params ? formatTranslation(template, params) : template;
}
