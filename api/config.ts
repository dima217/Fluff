// API Configuration
export const API_CONFIG = {
  // Development
  baseUrl: __DEV__
    ? "http://10.78.194.195:3000"
    : "https://api.yourdomain.com",

  // Медиа (стрим/скачивание) — отдельный порт, например 3002
  mediaBaseUrl: __DEV__
    ? "http://10.78.194.195:3002"
    : "https://api.yourdomain.com",

  // Timeouts
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000,
};

export const getBaseUrl = (): string => API_CONFIG.baseUrl;

/** Базовый URL для /media/download (стрим файлов с S3 и т.д.) */
export const getMediaBaseUrl = (): string => API_CONFIG.mediaBaseUrl;
