const PROJECT_TOKEN = import.meta.env.VITE_MOCKAPI_PROJECT_TOKEN;
const PROJECT_ENDPOINT = import.meta.env.VITE_MOCKAPI_ENDPOINT; // Optional

if (!PROJECT_TOKEN) {
  console.warn(
    'Warning: Missing mandatory VITE_MOCKAPI_PROJECT_TOKEN in your .env file!'
  );
}

const endpointPrefix = PROJECT_ENDPOINT ? `/${PROJECT_ENDPOINT}` : '';

export const MOCKAPI_CONFIG = {
  // Dynamically assemble the correct subdomain URL provided by mockapi.io platform
  BASE_URL: `https://${PROJECT_TOKEN}.mockapi.io`,
  ENDPOINTS: {
    BOOKS: `https://${PROJECT_TOKEN}.mockapi.io${endpointPrefix}/books`,
  },
  LOCAL_STORAGE_KEYS: {
    FAVORITES: 'books-fav-list',
    THEME: 'books-theme',
    MODE: 'books-app-mode',
  },
} as const;
