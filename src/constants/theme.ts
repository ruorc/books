import type { Theme } from '@/types/theme';

/**
 * Pure runtime theme constants serving as the core single source of truth.
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
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
 * UI Display Labels tied directly to the keys of THEMES for robust localization matching.
 */
export const THEME_LABELS: Record<Theme, string> = {
  [THEMES.LIGHT]: 'Light',
  [THEMES.DARK]: 'Dark',
  [THEMES.SYSTEM]: 'System',
};
