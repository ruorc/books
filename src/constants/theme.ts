/**
 * Pure runtime theme constants serving as the core single source of truth.
 */
export const THEMES = {
  /** Renders the user interface using a light color palette. */
  LIGHT: 'light',
  /** Renders the user interface using a dark color palette. */
  DARK: 'dark',
  /** Adapts the user interface color palette automatically to the user's operating system preferences. */
  SYSTEM: 'system',
} as const;

/**
 * Local storage serialization key tracking the persistent theme selection state.
 */
export const THEME_KEY = 'books-theme';

/**
 * Fallback theme applied when no user override profile exists in local storage.
 */
export const DEFAULT_THEME = THEMES.SYSTEM;

/**
 * UI Display Labels tied directly to the values of THEMES for robust localization matching.
 * Uses an inline lookup to eliminate circular dependencies with external type definition files.
 */
export const THEME_LABELS: Record<
  (typeof THEMES)[keyof typeof THEMES],
  string
> = {
  [THEMES.LIGHT]: 'Light',
  [THEMES.DARK]: 'Dark',
  [THEMES.SYSTEM]: 'System',
};

/**
 * Unique scope identifier used to isolate layout animations for the ThemeSelector.
 * Prevents structural motion conflicts with other segmented controllers like ModeSelector.
 */
export const THEME_LAYOUT_ID = 'app-theme' as const;
