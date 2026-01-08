// API Configuration
export const API_CONFIG = {
  // Development
  baseUrl: __DEV__ ? 'http://localhost:3000' : 'https://api.yourdomain.com',
  
  // Timeouts
  timeout: 30000, // 30 seconds
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

export const getBaseUrl = (): string => {
  // You can override this with environment variables if needed
  return API_CONFIG.baseUrl;
};

