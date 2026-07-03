/**
 * Global HTTP and Network transport layer configuration parameters.
 * These metrics guard core application API infrastructure connections behavior.
 */
export const NETWORK_CONFIG = {
  /** Total number of connection retry attempts for transient network failures. */
  DEFAULT_RETRIES: 2,

  /** Initial exponential backoff delay time baseline metric in milliseconds. */
  DEFAULT_DELAY: 1000,
} as const;
