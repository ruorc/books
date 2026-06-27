/**
 * Application execution strategy modes matching structural paradigm splits.
 */
export const MODES = {
  FUNCTIONAL: 'functional',
  CLASS: 'class',
} as const;

/**
 * Local storage serialization key tracking the persistent layout architecture state.
 */
export const MODE_KEY = 'books-app-mode';

/**
 * Default runtime execution mode applied when no user override profile exists.
 */
export const DEFAULT_MODE = MODES.FUNCTIONAL;

/**
 * Micro-frontend transaction delay buffer in milliseconds used to orchestrate smooth context transitions.
 */
export const MODE_SWITCH_DELAY = 400;
