import { getBaseUrl } from "../config";

/**
 * Тип медиа URL
 */
export type MediaUrlType = "proxy" | "direct" | "invalid";

/**
 * Определяет тип URL медиа файла
 * @param url - URL из API ответа
 * @returns Тип URL: 'proxy' (прокси через API), 'direct' (прямой URL), 'invalid' (невалидный)
 */
export function getMediaUrlType(url: string | null | undefined): MediaUrlType {
  if (!url) return "invalid";

  // Прокси URL начинается с /api/media/ или /media/
  if (url.startsWith("/api/media/") || url.startsWith("/media/")) {
    return "proxy";
  }

  // Прямой URL начинается с http:// или https://
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return "direct";
  }

  return "invalid";
}

/**
 * Извлекает mediaId из прокси URL
 * @param proxyUrl - Прокси URL вида /api/media/{mediaId} или /media/{mediaId}
 * @returns mediaId или null если не удалось извлечь
 */
export function extractMediaId(proxyUrl: string): string | null {
  const match = proxyUrl.match(/\/(?:api\/)?media\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Преобразует прокси URL в полный URL для запроса
 * @param proxyUrl - Прокси URL вида /api/media/{mediaId} или /media/{mediaId}
 * @returns Полный URL для запроса
 */
export function getFullMediaUrl(proxyUrl: string): string {
  // Если URL уже полный, возвращаем как есть
  if (proxyUrl.startsWith("http://") || proxyUrl.startsWith("https://")) {
    return proxyUrl;
  }

  // Убираем ведущий слэш если есть
  const cleanUrl = proxyUrl.startsWith("/") ? proxyUrl.slice(1) : proxyUrl;

  // Добавляем базовый URL
  const baseUrl = getBaseUrl().replace(/\/$/, ""); // Убираем trailing slash если есть
  return `${baseUrl}/${cleanUrl}`;
}

/**
 * Нормализует медиа URL для использования
 * - Прокси URL преобразуются в полные URL
 * - Прямые URL возвращаются как есть
 * @param url - URL из API ответа
 * @returns Нормализованный URL или null если невалидный
 */
export function normalizeMediaUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null;

  const urlType = getMediaUrlType(url);

  if (urlType === "direct") {
    return url;
  }

  if (urlType === "proxy") {
    return getFullMediaUrl(url);
  }

  return null;
}

/**
 * Проверяет, является ли URL прокси URL (требует авторизации)
 */
export function isProxyUrl(url: string | null | undefined): boolean {
  return getMediaUrlType(url) === "proxy";
}

/**
 * Проверяет, является ли URL прямым URL (можно использовать напрямую)
 */
export function isDirectUrl(url: string | null | undefined): boolean {
  return getMediaUrlType(url) === "direct";
}
