// API Configuration
export const API_CONFIG = {
  baseUrl: __DEV__ ? "http://10.30.220.195:3000" : "https://api.yourdomain.com",

  mediaBaseUrl: __DEV__
    ? "http://10.30.220.195:3002"
    : "https://api.yourdomain.com",

  // Timeouts
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000,
};

export const getBaseUrl = (): string => API_CONFIG.baseUrl;

/** Базовый URL для /media/download (стрим файлов с S3 и т.д.) */
export const getMediaBaseUrl = (): string => API_CONFIG.mediaBaseUrl;
