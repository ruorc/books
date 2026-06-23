import type { Theme } from '@/types/theme';

// Pure runtime constants - Single Source of Truth
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const THEME_KEY = 'books-theme';
export const DEFAULT_THEME = THEMES.SYSTEM;

// UI Display Labels tied directly to the keys of THEMES
export const THEME_LABELS: Record<Theme, string> = {
  [THEMES.LIGHT]: 'Light',
  [THEMES.DARK]: 'Dark',
  [THEMES.SYSTEM]: 'System',
};
