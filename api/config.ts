/**
 * Единая конфигурация URL бекенда.
 * Меняйте хост и порты только в этом файле.
 */

const DEV_BACKEND_HOST = "backend-production-9803a.up.railway.app";
const DEV_MEDIA_HOST = "media-service-5zxp-production.up.railway.app";

const PROD_API_ORIGIN = "https://backend-production-9803a.up.railway.app";
const PROD_MEDIA_ORIGIN = "https://media-service-5zxp-production.up.railway.app";

const BACKEND_URLS = {
  development: {
    api: `https://${DEV_BACKEND_HOST}`,
    media: `https://${DEV_MEDIA_HOST}`,
  },
  production: {
    api: PROD_API_ORIGIN,
    media: PROD_MEDIA_ORIGIN,
  },
} as const;

type BackendEnvironment = keyof typeof BACKEND_URLS;

function getEnvironment(): BackendEnvironment {
  return __DEV__ ? "development" : "production";
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export const API_CONFIG = {
  timeout: 30_000,
  maxRetries: 3,
  retryDelay: 1_000,
} as const;

export const MEDIA_API_PATHS = {
  create: "/media/create",
  markUploaded: (mediaId: string) => `/media/mark-uploaded/${mediaId}`,
  byId: (mediaId: string) => `/media/${mediaId}`,
  download: (mediaPath: string) =>
    `/media/download?url=${encodeURIComponent(mediaPath)}`,
} as const;

/** REST API (порт 3000 в dev). */
export const getBaseUrl = (): string => BACKEND_URLS[getEnvironment()].api;

/** Media service (порт 3002 в dev). */
export const getMediaBaseUrl = (): string => BACKEND_URLS[getEnvironment()].media;

/** Socket.IO — тот же origin, что и REST API. */
export const getSocketUrl = (): string => getBaseUrl();

export const buildApiUrl = (path: string): string => {
  const base = trimTrailingSlash(getBaseUrl());
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildMediaApiUrl = (path: string): string => {
  const base = trimTrailingSlash(getMediaBaseUrl());
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildMediaDownloadUrl = (mediaPath: string): string =>
  buildMediaApiUrl(MEDIA_API_PATHS.download(mediaPath));

export const isMediaServerOrigin = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const base = trimTrailingSlash(getMediaBaseUrl());
  return url === base || url.startsWith(`${base}/`);
};

export const isApiServerOrigin = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const base = trimTrailingSlash(getBaseUrl());
  return url === base || url.startsWith(`${base}/`);
};

/** Наши хосты (REST API или media service) — presigned query нужно убирать для видео/плеера. */
export const isOurMediaHostOrigin = (url: string | null | undefined): boolean => {
  return isMediaServerOrigin(url) || isApiServerOrigin(url);
};
