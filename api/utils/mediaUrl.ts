import {
  buildMediaApiUrl,
  buildMediaDownloadUrl,
  isOurMediaHostOrigin,
} from "../config";

export type MediaUrlType = "direct" | "path" | "invalid";

/**
 * Проверяет, что URL — обычная http(s) ссылка (в т.ч. localhost).
 */
export function isDirectHttpUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Presigned MinIO/S3 URL (X-Amz-* в query) — подпись ломает видеоплеер,
 * файл доступен по origin + pathname без query.
 */
export function hasPresignedS3Query(url: string): boolean {
  try {
    const parsed = new URL(url);
    return [...parsed.searchParams.keys()].some((key) =>
      key.startsWith("X-Amz")
    );
  } catch {
    return /[?&]X-Amz-/i.test(url);
  }
}

/** Убирает query/hash — presigned-параметры MinIO/S3 ломают плеер. */
export function stripUrlQuery(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    const qIndex = url.indexOf("?");
    return qIndex === -1 ? url : url.slice(0, qIndex);
  }
}

function shouldStripMediaQuery(url: string): boolean {
  return isOurMediaHostOrigin(url) || hasPresignedS3Query(url);
}

/**
 * Если хост localhost/127.0.0.1 — подменяем на наш медиа-хост (IP), чтобы с телефона запрос уходил на сервер.
 */
function rewriteLocalhostToMediaHost(url: string): string {
  if (!isDirectHttpUrl(url)) return url;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host !== "localhost" && host !== "127.0.0.1") return url;
    return buildMediaApiUrl(parsed.pathname);
  } catch {
    return url;
  }
}

/**
 * Тип URL: direct = http(s), path = путь вида /3/xxx.mp4 (нужен эндпоинт /media/download).
 */
export function getMediaUrlType(url: string | null | undefined): MediaUrlType {
  if (!url) return "invalid";
  if (url.startsWith("http://") || url.startsWith("https://")) return "direct";
  if (url.startsWith("/")) return "path";
  return "invalid";
}

/**
 * Нормализует URL для использования в Image/Video:
 * - наш API/media host или presigned MinIO (X-Amz-*) — без query;
 * - внешние URL (gstatic и т.п.) — query сохраняем;
 * - localhost подменяем на mediaBaseUrl;
 * - путь (/3/xxx.mp4) — через /media/download.
 */
export function normalizeMediaUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null;

  const urlType = getMediaUrlType(url);

  if (urlType === "direct") {
    const rewritten = rewriteLocalhostToMediaHost(url);
    if (shouldStripMediaQuery(rewritten)) {
      return stripUrlQuery(rewritten);
    }
    return rewritten;
  }

  if (urlType === "path") {
    return buildMediaDownloadUrl(url);
  }

  return null;
}

/** Для обратной совместимости: path считаем «прокси» в смысле «через наш сервер». */
export function isProxyUrl(url: string | null | undefined): boolean {
  return getMediaUrlType(url) === "path";
}

export function isDirectUrl(url: string | null | undefined): boolean {
  return getMediaUrlType(url) === "direct";
}

/** Оставлено для совместимости; для path URL mediaId не используется. */
export function extractMediaId(_proxyUrl: string): string | null {
  return null;
}

export function getFullMediaUrl(proxyUrl: string): string {
  return normalizeMediaUrl(proxyUrl) ?? proxyUrl;
}

/** URL ведёт на наш API или media service — для таких запросов нужен Authorization. */
export function isMediaServerUrl(
  resolvedUrl: string | null | undefined
): boolean {
  return isOurMediaHostOrigin(resolvedUrl);
}
