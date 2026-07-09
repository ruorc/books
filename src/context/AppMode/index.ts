/**
 * Composition Root Barrel Export for the AppMode Context Module.
 * Consolidates and exposes public APIs, hooks, and global state providers.
 * Keeps structural implementation details encapsulated away from external views.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */

export { AppModeProvider } from './AppModeProvider';
export { useAppMode, isValidAppMode } from './AppModeContext';

export type { AppModeContextType } from './AppModeContext';
