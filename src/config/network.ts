/**
 * Global HTTP and Network transport layer configuration parameters.
 * These metrics guard core application API infrastructure connections behavior.
 * Routes all active network parameters through a safe environment fallback matrix.
 */
export const NETWORK_CONFIG = {
  /** Total number of connection retry attempts for transient network failures. */
  DEFAULT_RETRIES: Number(import.meta.env.VITE_API_RETRIES) || 2,

  /** Initial exponential backoff delay time baseline metric in milliseconds. */
  DEFAULT_DELAY: Number(import.meta.env.VITE_API_DELAY) || 1000,

  /** Maximum exponential backoff delay time baseline metric in milliseconds. */
  DEFAULT_MAX_DELAY: Number(import.meta.env.VITE_API_MAX_DELAY) || 10000,

  /** Default request timeout duration in milliseconds. */
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
} as const;
