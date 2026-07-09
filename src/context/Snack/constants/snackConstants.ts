/**
 * Pure runtime snack configuration constants serving as the single source of truth for alerts.
 */
export const SNACKS = {
  /** Renders a green success alert banner confirming a successful transaction */
  SUCCESS: 'success',
  /** Renders a red error alert banner highlighting a failed action or crash */
  ERROR: 'error',
  /** Renders an amber warning alert banner indicating non-critical boundary hazards */
  WARNING: 'warning',
  /** Renders a neutral blue information banner delivering auxiliary systemic feedback */
  INFO: 'info',
} as const;

/**
 * Total timeline duration in milliseconds a single notification stays visible before decaying.
 */
export const SNACK_DISPLAY_DURATION = 4000 as const;
