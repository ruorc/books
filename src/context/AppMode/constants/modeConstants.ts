/**
 * Available application modes used for rendering and persistence.
 * These constants represent the two supported architectural styles
 * for the books app: a written functional mode and a classic class-based mode.
 */
export const MODES = {
  /** The functional approach using writing and hooks. */
  FUNCTIONAL: 'functional',
  /** The classic class-based object-oriented approach. */
  CLASS: 'class',
} as const;

/**
 * Short human-readable presentation labels representing system architecture engines.
 * Utilized strictly inside the top navigation header interaction controls.
 */
export const ENGINE_LABELS = {
  [MODES.FUNCTIONAL]: 'Functional',
  [MODES.CLASS]: 'Class',
} as const;

/**
 * Extended verbose description labels contextualizing application architecture paradigms.
 * Designed specifically for semantic deep-dives within the About presentation view.
 */
export const ENGINE_DESCRIPTORS = {
  [MODES.FUNCTIONAL]: 'Functional Components (Hooks)',
  [MODES.CLASS]: 'Class Components (Lifecycle)',
} as const;

/** Unique scope identifier used to isolate layout animations for the ModeSelector */
export const MODE_LAYOUT_ID = 'app-mode' as const;

/** Local storage serialization key tracking the persistent layout architecture state */
export const MODE_KEY = 'books-app-mode' as const;

/** Default runtime execution mode applied when no user override profile exists */
export const DEFAULT_MODE = MODES.FUNCTIONAL;

/** Micro-frontend transaction delay buffer in milliseconds used to orchestrate smooth context transitions */
export const MODE_SWITCH_DELAY = 400 as const;
