import type { AppMode } from '@/types/mode';

/**
 * Application execution strategy modes matching structural paradigm splits.
 */
export const MODES = {
  /** The functional approach using composition and hooks. */
  FUNCTIONAL: 'functional',
  /** The classic class-based object-oriented approach. */
  CLASS: 'class',
} as const;

/**
 * Human-readable presentation labels representing system architecture engines.
 * Tied directly to the values of MODES for robust serialization matching.
 */
export const ENGINE_LABELS: Record<AppMode, string> = {
  [MODES.FUNCTIONAL]: 'Functional',
  [MODES.CLASS]: 'Class',
};

/**
 * Unique scope identifier used to isolate layout animations for the ModeSelector.
 * Prevents structural motion conflicts with other segmented controllers like ThemeSelector.
 */
export const MODE_LAYOUT_ID = 'app-mode' as const;

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
