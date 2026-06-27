const PROJECT_TOKEN = import.meta.env.VITE_MOCKAPI_PROJECT_TOKEN || '';
// Renamed to accurately reflect that this is an optional nested URL namespace prefix
const API_PREFIX = import.meta.env.VITE_MOCKAPI_API_PREFIX || '';

// Notify the developer at runtime if environment configuration is incomplete
if (!PROJECT_TOKEN) {
  console.warn(
    'Warning: Missing mandatory VITE_MOCKAPI_PROJECT_TOKEN in your .env file! API features will fail.'
  );
}

// Ensure the base subdomain is formatted correctly or falls back to an empty string safely
const baseUrl = PROJECT_TOKEN
  ? `https://${PROJECT_TOKEN}.mockapi.io`
  : 'https://mockapi.io';

// Normalize nested folder prefix by removing leading/trailing slashes to prevent double slashes like '//books'
const cleanPrefix = API_PREFIX.replace(/^\/+|\/+$/g, '');
const urlPrefix = cleanPrefix ? `/${cleanPrefix}` : '';

export const MOCKAPI_CONFIG = {
  // Single source of truth for the primary platform URL
  BASE_URL: baseUrl,

  // Endpoints dynamically built from the validated BASE_URL and optional prefix folder
  ENDPOINTS: {
    BOOKS: `${baseUrl}${urlPrefix}/books`,
  },
} as const;
