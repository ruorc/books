const PROJECT_TOKEN = import.meta.env.VITE_MOCKAPI_PROJECT_TOKEN || '';
const API_PREFIX = import.meta.env.VITE_MOCKAPI_API_PREFIX || '';

if (!PROJECT_TOKEN) {
  console.warn(
    'Warning: Missing mandatory VITE_MOCKAPI_PROJECT_TOKEN in your .env file! API features will fail.'
  );
}

const baseUrlString = PROJECT_TOKEN
  ? `https://${PROJECT_TOKEN}.mockapi.io`
  : 'https://mockapi.io';

/**
 * Universal endpoint resolution helper that combines environment prefixes and route segments.
 * Uses native Web API URL pathname mutations to guarantee slash normalization and block
 * protocol-relative URL injection exploits during initialization workflows.
 * Accepts the baseline platform string path, raw prefix token, and specific endpoint segment.
 */
const resolveEndpoint = (
  basePath: string,
  prefix: string,
  segment: string
): string => {
  const url = new URL(basePath);

  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
  const cleanSegment = segment.replace(/^\/+|\/+$/g, '');

  url.pathname = [cleanPrefix, cleanSegment].filter(Boolean).join('/');

  return url.toString();
};

/**
 * Centered configuration topology registry map acting as the single source of truth for vendor infrastructure.
 * Exposes verified immutable base links and resolved absolute endpoints for global consumption.
 */
export const MOCKAPI_CONFIG = {
  /** Root secure web path addressing the provisioned third-party platform subdomain */
  BASE_URL: baseUrlString,

  /** Dynamic collection endpoints fully marshaled via native URL pathname assignments */
  ENDPOINTS: {
    /** Absolute network path targeting the books database cluster */
    BOOKS: resolveEndpoint(baseUrlString, API_PREFIX, 'books'),
  },
} as const;
