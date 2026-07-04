import { createContext, useContext } from 'react';
import { THEMES } from '@/constants/theme';
import type { Theme } from '@/types/theme';

/**
 * Structural contract defining properties and payload metrics managed by the Theme context.
 * Features mandatory property documentation layout specifications above every signature field.
 */
export interface ThemeContextType {
  /** The currently selected active theme configuration preference mode */
  theme: Theme;
  /** Sets a fresh user interface color theme strategy mode and updates references securely */
  setTheme: (theme: Theme) => void;
  /** Evaluated dynamic boolean state flag indicating whether the system layout should render dark styles */
  isDark: boolean;
}

/**
 * React context storing the active client-side visual theme preference configuration profile.
 * The initial undefined default value enforces execution parameters inside a matching provider boundary.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

/**
 * Type guard validation verifying if a raw storage string exactly matches permitted theme literal constraints.
 * Assesses input data consistency by checking matching variables against known single source of truth configurations.
 */
export const isValidTheme = (value: string | null): value is Theme => {
  if (!value) return false;

  return Object.values(THEMES).includes(value as Theme);
};

/**
 * Safe consumer hook providing direct type-safe access to the global active theme context space.
 * Throws a descriptive application exception error when evaluated outside a structurally sound provider tree boundary.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
