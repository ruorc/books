/**
 * Global notification alert classification variants.
 */
export const SNACK_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
} as const;

/**
 * Global screen longevity duration window in milliseconds before individual alert auto-dismisses.
 */
export const SNACK_AUTOHIDE_DURATION = 4000;
