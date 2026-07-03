/**
 * Global notification alert classification variants.
 */
export const SNACK_TYPES = {
  /** Indicates a successful operational outcome, typically rendered in green. */
  SUCCESS: 'success',
  /** Indicates a runtime crash or network infrastructure failure, typically rendered in red. */
  ERROR: 'error',
  /** Indicates a neutral contextual update or general message, typically rendered in blue. */
  INFO: 'info',
} as const;

/**
 * Global screen longevity duration window in milliseconds before individual alert auto-dismisses.
 */
export const SNACK_AUTOHIDE_DURATION = 4000;
