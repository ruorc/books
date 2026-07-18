import { createContext, useContext } from 'react';
import { THEMES } from './constants/themeConstants';

import type { Theme } from './types/theme';

/**
 * Structural contract defining properties and payload metrics managed by the Theme context.
 */
export interface ThemeContextType {
  /** The currently selected active theme configuration preference mode */
  readonly theme: Theme;
  /** Sets a fresh user interface color theme strategy mode and updates references securely */
  readonly setTheme: (theme: Theme) => void;
  /** Evaluated dynamic boolean state flag indicating whether the system layout should render dark styles */
  readonly isDark: boolean;
}

/**
 * React context storing the active client-side visual theme preference configuration profile.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

/**
 * Type guard validation verifying if a raw storage string exactly matches permitted theme literal constraints.
 */
export const isValidTheme = (value: string | null): value is Theme => {
  if (!value) return false;

  return Object.values(THEMES).includes(value as Theme);
};

/**
 * Safe consumer hook providing direct type-safe access to the global active theme context space.
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
