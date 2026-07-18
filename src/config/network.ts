/**
 * Global HTTP and Network transport layer configuration parameters.
 * Routes all active network parameters through a safe environment fallback matrix.
 */
export const NETWORK_CONFIG = {
  /** Governs circuit-breaker limits before throwing connection errors to the view layer */
  DEFAULT_RETRIES: Number(import.meta.env.VITE_API_RETRIES) || 2,

  /** Base latency window used to initialize exponential backoff scheduling graphs */
  DEFAULT_DELAY: Number(import.meta.env.VITE_API_DELAY) || 1000,

  /** Protects downstream rate-limiters by capping progressive backoff intervals */
  DEFAULT_MAX_DELAY: Number(import.meta.env.VITE_API_MAX_DELAY) || 10000,

  /** Enforces defensive execution barriers to prevent hanging pipeline leaks */
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
} as const;
