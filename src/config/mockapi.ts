// Read raw environment variables directly into internal constants (isolated from components)
const PROJECT_TOKEN = import.meta.env.VITE_MOCKAPI_PROJECT_TOKEN || '';
const API_PREFIX = import.meta.env.VITE_MOCKAPI_API_PREFIX || '';

// Notify the developer at runtime if environment configuration is incomplete
if (!PROJECT_TOKEN) {
  console.warn(
    'Warning: Missing mandatory VITE_MOCKAPI_PROJECT_TOKEN in your .env file! API features will fail.'
  );
}

// Ensure the base subdomain is formatted correctly or falls back to a mock domain safely
const baseUrlString = PROJECT_TOKEN
  ? `https://${PROJECT_TOKEN}.mockapi.io`
  : 'https://missing-token.mockapi.io';

/**
 * Safely resolves an endpoint path against the base URL using native Web APIs.
 * Prevents protocol-relative URL bugs and handles nested paths correctly.
 *
 * @param basePath - The root base URL instance or string.
 * @param prefix - The optional API folder or version prefix from environment variables.
 * @param segment - The specific entity resource endpoint segment (e.g., 'books').
 * @returns A fully normalized absolute URL string.
 */
const resolveEndpoint = (
  basePath: string,
  prefix: string,
  segment: string
): string => {
  const url = new URL(basePath);

  // Clean individual segments from surrounding slashes and filter out empty values
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
  const cleanSegment = segment.replace(/^\/+|\/+$/g, '');

  // Combine segments and set directly via pathname to let the browser normalize slashes natively
  url.pathname = [cleanPrefix, cleanSegment].filter(Boolean).join('/');

  return url.toString();
};

/**
 * Single source of truth for MockAPI network topography.
 * Guarantees valid absolute URL construction for consumption by HttpBaseService layers.
 */
export const MOCKAPI_CONFIG = {
  /** Single source of truth for the primary platform URL */
  BASE_URL: baseUrlString,

  /** Endpoints dynamically built and validated via native URL pathname assignment */
  ENDPOINTS: {
    BOOKS: resolveEndpoint(baseUrlString, API_PREFIX, 'books'),
  },
} as const;
