const PROJECT_TOKEN = import.meta.env.VITE_MOCKAPI_PROJECT_TOKEN || '';
const PROJECT_ENDPOINT = import.meta.env.VITE_MOCKAPI_ENDPOINT || '';

// Notify the developer at runtime if environment configuration is incomplete
if (!PROJECT_TOKEN) {
  console.warn(
    'Warning: Missing mandatory VITE_MOCKAPI_PROJECT_TOKEN in your .env file! API features will fail.'
  );
}

// Ensure the base subdomain is formatted correctly or falls back to an empty string safely
const baseUrl = PROJECT_TOKEN ? `https://${PROJECT_TOKEN}.mockapi.io` : '';

// Normalize endpoint prefix by removing leading/trailing slashes to prevent double slashes like '//books'
const cleanPrefix = PROJECT_ENDPOINT.replace(/^\/+|\/+$/g, '');
const urlPrefix = cleanPrefix ? `/${cleanPrefix}` : '';

export const MOCKAPI_CONFIG = {
  // Single source of truth for the primary platform URL
  BASE_URL: baseUrl,
  
  // Endpoints dynamically built from the validated BASE_URL
  ENDPOINTS: {
    BOOKS: baseUrl ? `${baseUrl}${urlPrefix}/books` : '',
  },
} as const;
