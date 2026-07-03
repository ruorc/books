/**
 * @fileoverview Composition Root Barrel Export for the Theme Context Module.
 * Consolidates and exposes public APIs, hooks, providers, and smart UI controllers.
 * Keeps structural implementation details encapsulated away from external views.
 */

export { ProjectThemeProvider } from './ProjectThemeProvider';
export { useProjectTheme, isValidTheme } from './ThemeContext';
export { default as ThemeSelector } from './ThemeSelector';

export type { ThemeContextType } from './ThemeContext';
