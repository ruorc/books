/**
 * Composition Root Barrel Export for the Theme Context Module.
 * Consolidates and exposes public APIs, hooks, and global state providers.
 * Keeps structural implementation details encapsulated away from external views.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */

export { ThemeProvider } from './ThemeProvider';
export { useTheme, isValidTheme } from './ThemeContext';

export type { ThemeContextType } from './ThemeContext';
