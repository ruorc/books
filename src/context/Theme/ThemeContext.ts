import { createContext, useContext } from 'react';
import { THEMES } from '@/constants/theme';
import type { Theme } from '@/types/theme';

export interface ThemeContextType {
  /** The currently selected theme mode ('light', 'dark', or 'system'). */
  theme: Theme;
  /** Sets a new theme mode and updates state references securely. */
  setTheme: (theme: Theme) => void;
  /** Evaluated boolean indicating whether the UI should currently render dark styles. */
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

/**
 * Type guard validation verifying if a raw storage string exactly matches permitted Theme literal constraints.
 *
 * @param value - The raw string value pulled from localStorage theme state.
 * @returns Boolean affirmation declaring type compatibility.
 */
export const isValidTheme = (value: string | null): value is Theme => {
  if (!value) return false;

  return Object.values(THEMES).includes(value as Theme);
};

/**
 * Custom hook providing direct, type-safe access to the global Theme context space.
 *
 * @returns The active Theme layout values and modifiers.
 * @throws {Error} If consumed outside a structurally sound ProjectThemeProvider tree node.
 */
export function useProjectTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useProjectTheme must be used within a ProjectThemeProvider'
    );
  }

  return context;
}
